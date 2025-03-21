export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="p-6 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quick Facture</h1>
        <a href="#pricing" className="text-blue-600 font-medium">Tarifs</a>
      </header>

      <section className="py-20 px-6 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">
          Ne payez plus de commissions pour vos factures Stripe
        </h2>
        <p className="text-lg mb-8">
          Marre des 0,4% ou 2€ par facture avec Stripe ? Avec Quick Facture, vous payez une seule fois. Un générateur de factures pro, simple, rapide et sans frais cachés.
        </p>
        <a
          href="#pricing"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700"
        >
          Voir les offres
        </a>
      </section>

      <section id="pricing" className="py-20 px-6 bg-gray-100">
        <h3 className="text-3xl font-bold text-center mb-12">Choisissez votre plan</h3>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow">
            <h4 className="text-xl font-semibold mb-4">Offre Essentielle</h4>
            <p className="text-4xl font-bold mb-4">49€</p>
            <ul className="mb-6 text-left space-y-2">
              <li>Facturation illimitée</li>
              <li>Export PDF illimité</li>
              <li>Envoi manuel des factures</li>
              <li>Support email</li>
            </ul>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full">
              Choisir ce plan
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow border-2 border-blue-600">
            <h4 className="text-xl font-semibold mb-4">Offre Pro</h4>
            <p className="text-4xl font-bold mb-4">69€</p>
            <ul className="mb-6 text-left space-y-2">
              <li>Tout dans Essentielle</li>
              <li>Ajout de logo et design personnalisé</li>
              <li>Rappels de paiement automatisés</li>
              <li>Support prioritaire</li>
            </ul>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full">
              Choisir ce plan
            </button>
          </div>
        </div>
      </section>

      <footer className="text-center p-6 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Quick Facture. Tous droits réservés.
      </footer>
    </div>
  );
}
