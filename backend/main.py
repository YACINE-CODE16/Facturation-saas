from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import stripe
import pdfkit
import smtplib
from email.message import EmailMessage
import os

app = FastAPI()

# Activation du middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Remplace "*" par l'URL de ton frontend si nécessaire
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes HTTP (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Autorise tous les en-têtes
)

# Récupération des variables d'environnement (Stripe, SendGrid, etc.)
STRIPE_API_KEY = os.getenv("STRIPE_API_KEY")
SENDGRID_EMAIL = os.getenv("SENDGRID_EMAIL")
SENDGRID_PASSWORD = os.getenv("SENDGRID_PASSWORD")

if STRIPE_API_KEY:
    stripe.api_key = STRIPE_API_KEY
else:
    print("⚠️ Avertissement : STRIPE_API_KEY n'est pas défini.")

# Modèle Pydantic pour la facture
class Invoice(BaseModel):
    client_name: str
    client_email: EmailStr
    amount: float

@app.get("/")
def root():
    return {"message": "Bienvenue sur l'API Fast Facture !"}

#  Endpoint pour générer la facture (PDF) et l'envoyer par e-mail
@app.post("/generate-invoice")
def generate_invoice(invoice: Invoice):
    #  Vérifier que le montant est valide
    if invoice.amount <= 0:
        raise HTTPException(status_code=400, detail="Le montant doit être supérieur à zéro.")

    #  Template HTML pour la facture
    html_content = f"""
    <html>
    <head>
        <meta charset='utf-8'>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            h2 {{ color: #333; }}
            .facture {{ border: 1px solid #ddd; padding: 20px; border-radius: 5px; }}
        </style>
    </head>
    <body>
        <div class='facture'>
            <h2>Facture pour {invoice.client_name}</h2>
            <p>Montant : {invoice.amount} EUR</p>
            <p>Merci pour votre confiance.</p>
        </div>
    </body>
    </html>
    """

    #  Génération du PDF avec pdfkit
    pdf_path = "/tmp/facture.pdf"  # Dossier temporaire compatible avec Render
    try:
        pdfkit.from_string(html_content, pdf_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur PDFKit : {str(e)}")

    #  Envoi d'e-mail via SMTP SendGrid (optionnel)
    if SENDGRID_EMAIL and SENDGRID_PASSWORD:
        try:
            msg = EmailMessage()
            msg["Subject"] = "Votre Facture"
            msg["From"] = SENDGRID_EMAIL
            msg["To"] = invoice.client_email
            msg.set_content("Voici votre facture en pièce jointe.")

            with open(pdf_path, "rb") as f:
                msg.add_attachment(f.read(), maintype="application", subtype="pdf", filename="facture.pdf")

            with smtplib.SMTP_SSL("smtp.sendgrid.net", 465) as smtp:
                smtp.login("apikey", SENDGRID_PASSWORD)  # Pour SendGrid, user = 'apikey'
                smtp.send_message(msg)

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erreur envoi e-mail : {str(e)}")
    else:
        print("⚠️ SendGrid non configuré, la facture ne sera pas envoyée par email.")

    # Retourne le PDF en pièce jointe
    return FileResponse(pdf_path, media_type="application/pdf", filename="facture.pdf")

#  Endpoint pour créer un lien de paiement Stripe
@app.post("/payment-link")
def payment_link(invoice: Invoice):
    if not STRIPE_API_KEY:
        raise HTTPException(status_code=500, detail="Clé Stripe non configurée.")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {'name': 'Facture Fast Facture'},
                    'unit_amount': int(invoice.amount * 100),
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='https://tonsite.com/success',  # URL de succès
            cancel_url='https://tonsite.com/cancel',    # URL d'annulation
        )
        return {"url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur Stripe : {str(e)}")

@app.post("/subscribe")
def subscribe(email: str, name: str = None):
    print(f"📩 Requête reçue : email={email}, name={name}")  # Log pour voir si la requête arrive

    existing_client = supabase.table("clients").select("*").eq("email", email).execute()
    print(f"🔍 Résultat de la recherche : {existing_client}")  # Voir si l'email existe déjà

    if existing_client.data:
        return {"message": "Cet email est déjà enregistré."}

    data = {"email": email, "name": name}
    response = supabase.table("clients").insert(data).execute()

    if response.get("error"):
        raise HTTPException(status_code=500, detail="Erreur Supabase : " + str(response["error"]))

    print("✅ Inscription réussie !")
    return {"message": "Email enregistré avec succès !"}

