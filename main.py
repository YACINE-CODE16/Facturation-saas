# BACKEND complet (FastAPI) avec toutes fonctionnalités essentielles

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import stripe
import pdfkit
import smtplib
from email.message import EmailMessage

app = FastAPI()

# Config Stripe
stripe.api_key = 'ta_cle_stripe'

# Modèle de facture
class Invoice(BaseModel):
    client_name: str
    client_email: EmailStr
    amount: float

# Création facture PDF et envoi e-mail automatique
@app.post("/generate-invoice")
def generate_invoice(invoice: Invoice):
    html = f"""
    <html>
    <head><style>body {{font-family: Arial;}}</style></head>
    <body>
        <h2>Facture pour {invoice.client_name}</h2>
        <p>Montant: {invoice.amount} EUR</p>
        <p>Merci pour votre confiance.</p>
    </body>
    </html>
    """
    pdfkit.from_string(html, "facture.pdf")

    # E-mail auto
    msg = EmailMessage()
    msg['Subject'] = 'Votre Facture'
    msg['From'] = 'ton_email@exemple.com'
    msg['To'] = invoice.client_email
    msg.set_content('Voici votre facture en pièce jointe.')

    with open("facture.pdf", "rb") as f:
        msg.add_attachment(f.read(), maintype='application', subtype='pdf', filename='facture.pdf')

    with smtplib.SMTP_SSL('smtp.sendgrid.net', 465) as smtp:
        smtp.login('sendgrid_user', 'sendgrid_password')
        smtp.send_message(msg)

    return FileResponse("facture.pdf")

# Paiement Stripe via QR-Code
@app.post("/payment-link")
def payment_link(invoice: Invoice):
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'eur',
                'product_data': {'name': 'Facture rapide'},
                'unit_amount': int(invoice.amount * 100),
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url='https://tonsite.com/success',
        cancel_url='https://tonsite.com/cancel',
    )
    return {"url": session.url}

# Frontend React:
# - Formulaire simple envoyant à l'API.
# - Affichage direct du lien Stripe (QR-Code intégré sur frontend).

# Déploiement:
# Backend sur Railway
# Frontend sur Vercel
# Base de données sur Supabase
