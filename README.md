# 🚀 Fast Facture

Fast Facture est une solution SaaS innovante de génération automatique de factures, spécialement conçue pour les auto-entrepreneurs débutants en France. Elle se démarque par sa simplicité, sa rapidité et son efficacité exceptionnelle.

## 💡 Fonctionnalités Clés

### 🎯 Spécialisation
- Destiné principalement aux auto-entrepreneurs débutants en France.

### 🧾 Génération Ultra-Rapide de Factures
- Créez vos factures en moins de **10 secondes**.
- Aucune inscription nécessaire pour commencer.

### 💳 Paiement Direct Intégré
- Liens de paiement Stripe intégrés directement dans les factures via QR Code.
- Paiement sécurisé par lien Stripe.

### 📲 Intégrations des Réseaux Sociaux
- Envoyez vos factures par WhatsApp, Messenger ou Instagram.

### 🔔 Rappels Automatiques
- Notifications automatisées envoyées directement via WhatsApp.

### 📩 Relances Juridiques
- Génération automatique de modèles de relance en cas de retard de paiement.

## 📚 Technologie

### Frontend :
- React.js
- Axios pour les requêtes API

### Backend :
- Python
- FastAPI
- Stripe pour les paiements sécurisés

### Base de données :
- Supabase ou PostgreSQL (en cours de configuration)

## 🛠 Installation

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend :
```bash
cd frontend
npm install
npm start
```

## 🌐 Déploiement
- Frontend déployé sur Vercel
- Backend déployé sur Render

## 📌 À venir
- Intégration d'une base de données pour stocker les emails clients pour des campagnes marketing ciblées.
- Accès restreint aux factures jusqu'au paiement validé.
- Compatibilité légale internationale : UE, États-Unis, Royaume-Uni, etc.
- Application mobile iOS et Android pour gestion simplifiée des factures et paiements.

---

© Fast Facture, 2025
