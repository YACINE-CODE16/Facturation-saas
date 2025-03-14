// SubscribeForm.js
import React, { useState } from 'react';
import axios from 'axios';
export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    try {
      const response = await axios.post("https://facturation-saas.onrender.com/subscribe", {
        email,
        name
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <div>
      <h2>S'abonner aux offres</h2>
      <input
        type="text"
        placeholder="Votre nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubscribe}>S'abonner</button>
      <p>{message}</p>
    </div>
  );
}
const handleSubscribe = async () => {
  try {
    console.log("📩 Envoi des données :", { email, name }); // Voir si la requête part bien du frontend

    const response = await axios.post("https://facturation-saas.onrender.com/subscribe", {
      email,
      name
    });

    console.log("✅ Réponse API :", response.data); // Voir la réponse de l'API
    setMessage(response.data.message);
  } catch (error) {
    console.error("❌ Erreur API :", error.response?.data || error.message);
    setMessage("Erreur lors de l'enregistrement.");
  }
};


