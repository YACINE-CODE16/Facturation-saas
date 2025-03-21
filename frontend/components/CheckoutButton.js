import { useState } from "react";

export default function CheckoutButton({ priceId }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    const session = await response.json();
    window.location.href = session.url;
  };

  return (
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full"
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? "Redirection..." : "Payer maintenant"}
    </button>
  );
}
