import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité — Stampify",
  description: "Politique de confidentialité et protection des données personnelles de Stampify.",
};

export default function PolitiqueDeConfidentialite() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect width="28" height="28" rx="8" fill="#534AB7"/>
            <path d="M8 10C8 8.34 9.34 7 11 7H17C18.66 7 20 8.34 20 10V16C20 17.66 18.66 19 17 19H15.5L14 21.5L12.5 19H11C9.34 19 8 17.66 8 16V10Z" fill="white"/>
            <circle cx="14" cy="12" r="2.5" fill="#534AB7"/>
            <path d="M10.5 17C10.5 15.07 12.07 13.5 14 13.5C15.93 13.5 17.5 15.07 17.5 17" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="font-black text-lg" style={{ color: "#534AB7" }}>Stampify</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Politique de confidentialité</h1>
        <p className="text-gray-400 text-sm mb-10">Dernière mise à jour : mars 2026</p>

        <div className="space-y-10 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles collectées via la plateforme Stampify (stampify.ch) est :<br />
              <strong>Augustin Domenget</strong> — contact@stampify.ch<br />
              Délégué à la protection des données (DPO) : Augustin Domenget, contact@stampify.ch
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Données collectées</h2>
            <p className="mb-2"><strong>Données des commerçants (utilisateurs de la plateforme) :</strong></p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Adresse email</li>
              <li>Nom du commerce et pays (France ou Suisse)</li>
              <li>Informations de paiement (gérées exclusivement par Stripe — Stampify ne stocke aucune donnée bancaire)</li>
            </ul>
            <p className="mb-2"><strong>Données des clients des commerçants (utilisateurs finaux) :</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Prénom et nom</li>
              <li>Numéro de téléphone mobile (pour les SMS de bienvenue et de récompense, plan Pro uniquement)</li>
              <li>Historique des tampons et des récompenses liés à une carte de fidélité</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Finalités du traitement</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Création et gestion des comptes commerçants</li>
              <li>Fonctionnement du programme de fidélité (attribution des tampons, déclenchement des récompenses)</li>
              <li>Envoi de SMS automatiques de bienvenue et de récompense (plan Pro)</li>
              <li>Envoi d&apos;emails transactionnels (confirmation, notifications)</li>
              <li>Facturation et gestion des abonnements via Stripe</li>
              <li>Statistiques d&apos;usage anonymisées pour améliorer le service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Sous-traitants et transferts de données</h2>
            <p className="mb-3">Stampify fait appel aux sous-traitants suivants, tous soumis à des obligations de confidentialité et de sécurité :</p>
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
                  <tr><td className="px-4 py-2">Supabase</td><td className="px-4 py-2">Stockage des données (base de données)</td><td className="px-4 py-2">Union Européenne</td></tr>
                  <tr><td className="px-4 py-2">Stripe</td><td className="px-4 py-2">Traitement des paiements</td><td className="px-4 py-2">États-Unis (clauses contractuelles types)</td></tr>
                  <tr><td className="px-4 py-2">Brevo</td><td className="px-4 py-2">Envoi de SMS et emails transactionnels</td><td className="px-4 py-2">France (UE)</td></tr>
                  <tr><td className="px-4 py-2">Google Wallet</td><td className="px-4 py-2">Cartes de fidélité digitales sur mobile</td><td className="px-4 py-2">États-Unis (clauses contractuelles types)</td></tr>
                  <tr><td className="px-4 py-2">Vercel</td><td className="px-4 py-2">Hébergement de l&apos;application web</td><td className="px-4 py-2">États-Unis (clauses contractuelles types)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Durée de conservation</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Données des commerçants : conservées pendant toute la durée de l&apos;abonnement actif, puis 12 mois après résiliation.</li>
              <li>Données des clients des commerçants : conservées 3 ans après la dernière activité sur la carte de fidélité.</li>
              <li>Données de facturation : conservées 10 ans conformément aux obligations comptables légales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Cookies</h2>
            <p>
              Stampify n&apos;utilise <strong>aucun cookie tiers</strong> à des fins publicitaires ou de tracking. Seuls des cookies de session strictement nécessaires au fonctionnement de l&apos;authentification sont utilisés. Ces cookies sont supprimés à la fermeture de la session ou à la déconnexion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Vos droits (RGPD)</h2>
            <p className="mb-3">Conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi suisse sur la protection des données (nLPD), vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification</strong> : corriger vos données inexactes ou incomplètes</li>
              <li><strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré et lisible</li>
              <li><strong>Droit d&apos;opposition</strong> : vous opposer à certains traitements</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@stampify.ch" className="text-indigo-600 underline">contact@stampify.ch</a>.<br />
              Nous répondrons dans un délai maximum de 30 jours.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Sécurité</h2>
            <p>
              Stampify met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement des communications (HTTPS/TLS), contrôle d&apos;accès par rôle, hébergement en environnement sécurisé.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Droit applicable et réclamations</h2>
            <p>
              La présente politique est régie par le droit français et, pour les utilisateurs suisses, par la loi fédérale suisse sur la protection des données (nLPD).<br />
              En cas de litige, vous pouvez saisir la Commission Nationale de l&apos;Informatique et des Libertés (CNIL) en France, ou le Préposé fédéral à la protection des données et à la transparence (PFPDT) en Suisse.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-gray-100 py-6 px-6 text-center text-xs text-gray-400">
        <div className="flex justify-center gap-6">
          <Link href="/conditions-utilisation" className="hover:text-gray-600 transition-colors">Conditions d&apos;utilisation</Link>
          <Link href="/politique-de-confidentialite" className="hover:text-gray-600 transition-colors">Politique de confidentialité</Link>
          <Link href="mailto:contact@stampify.ch" className="hover:text-gray-600 transition-colors">contact@stampify.ch</Link>
        </div>
      </footer>
    </div>
  );
}
