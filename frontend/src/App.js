// App.js
import React, { useState } from 'react';
import axios from 'axios';
import { SubscribeForm } from "./SubscribeForm"; // ✅ Correct


function App() {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [paymentLink, setPaymentLink] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://facturation-saas.onrender.com';

  const handleGenerateInvoice = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate-invoice`,
        {
          client_name: clientName,
          client_email: clientEmail,
          amount: Number(amount)
        },
        { responseType: 'blob' }
      );

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrlLocal = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrlLocal);

      alert('Facture générée et envoyée par email (si configuré) !');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la génération de la facture.');
    }
  };

  const handlePaymentLink = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payment-link`, {
        client_name: clientName,
        client_email: clientEmail,
        amount: Number(amount)
      });
      setPaymentLink(response.data.url);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la création du lien de paiement.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>Fast Facture</h1>
      <div>
        <label>Nom du client : </label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
      </div>
      <div>
        <label>Email du client : </label>
        <input
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
      </div>
      <div>
        <label>Montant : </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
      </div>
      <button onClick={handleGenerateInvoice} style={{ marginRight: '10px' }}>
        Générer la Facture
      </button>
      <button onClick={handlePaymentLink}>
        Obtenir un lien de paiement
      </button>

      {pdfUrl && (
        <div style={{ marginTop: '20px' }}>
          <p>Votre facture PDF est prête :</p>
          <a href={pdfUrl} download="facture.pdf">Télécharger la facture</a>
        </div>
      )}

      {paymentLink && (
        <div style={{ marginTop: '20px' }}>
          <p>Lien de paiement Stripe :</p>
          <a href={paymentLink} target="_blank" rel="noopener noreferrer">
            Payer
          </a>
        </div>
      )}

      {/* Intégration du formulaire d'abonnement */}
      <SubscribeForm />
    </div>
  );
}

export default App;
