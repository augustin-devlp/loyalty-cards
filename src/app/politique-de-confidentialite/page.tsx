import Link from "next/link";

export default function PolitiqueDeConfidentialite() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <svg width="28" height="28" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="8" y="8" width="176" height="148" rx="36" fill="#534AB7"/>
            <polygon points="40,156 40,186 74,156" fill="#534AB7"/>
            <text x="96" y="114" fontFamily="Arial, sans-serif" fontSize="100" fontWeight="900" textAnchor="middle" fill="white">S</text>
          </svg>
          <span className="font-black text-lg text-gray-900">Stampify</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-black text-gray-900 mb-4">Politique de confidentialité</h1>
        <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : mars 2026</p>

        <div className="space-y-10 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Responsable du traitement</h2>
            <p>
              Stampify, exploité par Augustin Domenget, est responsable du traitement des données personnelles
              collectées via la plateforme stampify.ch.
            </p>
            <p className="mt-2">
              <strong>DPO / Contact :</strong> Augustin Domenget — <a href="mailto:contact@stampify.ch" className="text-indigo-600 hover:underline">contact@stampify.ch</a> — France
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Données collectées</h2>
            <p className="mb-3">Stampify collecte deux catégories de données selon le profil de l&apos;utilisateur :</p>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Commerçants (titulaires d&apos;un compte Stampify)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Adresse e-mail</li>
                <li>Nom du commerce</li>
                <li>Pays</li>
                <li>Informations de facturation (gérées par Stripe)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Clients des commerçants (porteurs de carte de fidélité)</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Prénom</li>
                <li>Nom</li>
                <li>Numéro de téléphone</li>
              </ul>
              <p className="mt-2 text-gray-500 text-xs">
                Ces données sont collectées par le commerçant via Stampify et relèvent de sa responsabilité envers ses propres clients.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Finalités du traitement</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gestion des comptes commerçants et de l&apos;accès à la plateforme</li>
              <li>Suivi des programmes de fidélité</li>
              <li>Envoi de notifications SMS (récompenses, avis Google)</li>
              <li>Facturation et gestion des abonnements</li>
              <li>Génération de rapports mensuels d&apos;activité</li>
              <li>Intégration Google Wallet pour les cartes de fidélité digitales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Sous-traitants et transferts de données</h2>
            <p className="mb-3">Stampify fait appel aux sous-traitants suivants :</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Sous-traitant</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Rôle</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Localisation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-2 font-medium">Supabase</td>
                    <td className="px-4 py-2">Stockage des données (base de données)</td>
                    <td className="px-4 py-2">Union Européenne</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Stripe</td>
                    <td className="px-4 py-2">Paiement et facturation</td>
                    <td className="px-4 py-2">États-Unis / UE (Privacy Shield)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Brevo</td>
                    <td className="px-4 py-2">Envoi de SMS et d&apos;e-mails transactionnels</td>
                    <td className="px-4 py-2">France / Union Européenne</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Google Wallet</td>
                    <td className="px-4 py-2">Cartes de fidélité digitales</td>
                    <td className="px-4 py-2">États-Unis (clauses contractuelles types)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Vercel</td>
                    <td className="px-4 py-2">Hébergement de l&apos;application</td>
                    <td className="px-4 py-2">États-Unis / UE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Durée de conservation</h2>
            <p>
              Les données personnelles sont conservées pendant <strong>3 ans après la dernière activité</strong> sur le
              compte. À l&apos;expiration de ce délai, les données sont supprimées ou anonymisées.
            </p>
            <p className="mt-2">
              Les données de facturation sont conservées conformément aux obligations légales (10 ans en France).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Cookies</h2>
            <p>
              Stampify utilise uniquement des cookies de session nécessaires au fonctionnement de l&apos;application
              (authentification, maintien de la session). <strong>Aucun cookie tiers ni cookie de traçage publicitaire
              n&apos;est utilisé.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Vos droits (RGPD)</h2>
            <p className="mb-3">
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Droit d&apos;accès</strong> — obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification</strong> — corriger des données inexactes ou incomplètes</li>
              <li><strong>Droit à l&apos;effacement</strong> — demander la suppression de vos données</li>
              <li><strong>Droit à la portabilité</strong> — recevoir vos données dans un format structuré</li>
              <li><strong>Droit d&apos;opposition</strong> — vous opposer à certains traitements</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous à :{" "}
              <a href="mailto:contact@stampify.ch" className="text-indigo-600 hover:underline">contact@stampify.ch</a>.
              Nous répondrons dans un délai de 30 jours.
            </p>
            <p className="mt-2">
              Vous pouvez également introduire une réclamation auprès de la CNIL (
              <a href="https://www.cnil.fr" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Sécurité</h2>
            <p>
              Stampify met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données
              contre tout accès non autorisé, perte ou destruction. Les communications sont chiffrées via HTTPS et les
              accès à la base de données sont strictement contrôlés.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Contact</h2>
            <p>
              Pour toute question relative à cette politique de confidentialité :{" "}
              <a href="mailto:contact@stampify.ch" className="text-indigo-600 hover:underline">contact@stampify.ch</a>
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 px-6 mt-16">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">Accueil</Link>
          <Link href="/mentions-legales" className="hover:text-gray-900">Mentions légales</Link>
          <Link href="/conditions-utilisation" className="hover:text-gray-900">Conditions d&apos;utilisation</Link>
        </div>
      </footer>
    </div>
  );
}
