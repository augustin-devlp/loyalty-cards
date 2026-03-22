import Link from "next/link";

export const metadata = {
  title: "Conditions d'utilisation – Stampify",
  description: "Conditions générales d'utilisation de la plateforme Stampify.",
};

export default function ConditionsUtilisation() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 py-4 px-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#534AB7" }}>
            <span className="text-white font-black text-xs">S</span>
          </div>
          <span className="font-black text-lg text-gray-900">Stampify</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-black text-gray-900 mb-4">Conditions d&apos;utilisation</h1>
        <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : mars 2026</p>

        <div className="space-y-10 text-gray-600 text-sm leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Description du service</h2>
            <p>
              Stampify est une plateforme SaaS (Software as a Service) permettant aux commerçants de créer et
              gérer des programmes de cartes de fidélité numériques pour leurs clients. Le service comprend la
              création de cartes, la gestion des tampons, l'envoi de notifications, la génération de rapports
              statistiques et l'intégration avec Google Wallet.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Utilisateurs concernés</h2>
            <p>
              Stampify est une plateforme réservée aux <strong>commerçants professionnels</strong> (personnes
              physiques ou morales exerçant une activité commerciale). L'ouverture d'un compte implique que
              l'utilisateur agit dans le cadre de son activité professionnelle et dispose de la capacité
              juridique pour s'engager contractuellement.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Offres et tarifs</h2>
            <p className="mb-3">Stampify propose trois plans d'abonnement :</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Plan</th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Prix mensuel (€)</th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Prix mensuel (CHF)</th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2 font-medium">Essentiel</td>
                    <td className="border border-gray-200 px-3 py-2">19 €</td>
                    <td className="border border-gray-200 px-3 py-2">29 CHF</td>
                    <td className="border border-gray-200 px-3 py-2">Sans engagement</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2 font-medium">Pro</td>
                    <td className="border border-gray-200 px-3 py-2">49 €</td>
                    <td className="border border-gray-200 px-3 py-2">79 CHF</td>
                    <td className="border border-gray-200 px-3 py-2">Sans engagement</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2 font-medium">Business</td>
                    <td className="border border-gray-200 px-3 py-2">99 €</td>
                    <td className="border border-gray-200 px-3 py-2">149 CHF</td>
                    <td className="border border-gray-200 px-3 py-2">3 mois minimum</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-gray-500">
              Les tarifs sont indiqués hors taxes. Stampify se réserve le droit de modifier ses tarifs avec un
              préavis de 30 jours par email.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Paiement</h2>
            <p>
              Les paiements sont traités par <strong>Stripe</strong>, prestataire de paiement sécurisé. Le
              prélèvement est effectué mensuellement de façon automatique à la date anniversaire de l'abonnement.
              En cas d'échec de paiement, Stampify se réserve le droit de suspendre l'accès au service jusqu'à
              régularisation.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Résiliation</h2>
            <p>
              L'abonnement peut être résilié à tout moment depuis le tableau de bord Stampify (section
              Facturation). La résiliation prend effet à la fin de la période de facturation en cours. Pour
              le plan Business, la résiliation ne peut intervenir qu'après la période minimale d'engagement de
              3 mois. Aucun remboursement partiel n'est accordé pour la période restante après résiliation.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Responsabilités</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Stampify s'engage à :</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Héberger et sécuriser les données conformément aux bonnes pratiques</li>
                  <li>Assurer une disponibilité du service de 99 % par mois (hors maintenance planifiée)</li>
                  <li>Notifier les commerçants en cas d'incident impactant leurs données</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Le commerçant est responsable de :</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>La conception et la gestion de son programme de fidélité</li>
                  <li>L'information de ses clients sur la collecte de leurs données personnelles</li>
                  <li>La conformité de son usage avec la réglementation applicable (RGPD, LPD)</li>
                  <li>La confidentialité de ses identifiants de connexion</li>
                </ul>
              </div>
            </div>
            <p className="mt-3">
              Stampify ne pourra être tenu responsable des dommages indirects, perte de chiffre d'affaires ou
              préjudice commercial résultant de l'utilisation ou de l'indisponibilité du service.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Propriété intellectuelle</h2>
            <p>
              La plateforme Stampify, son interface, son code source et ses contenus sont la propriété exclusive
              de Stampify. Toute reproduction, copie ou exploitation non autorisée est interdite.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Modification des CGU</h2>
            <p>
              Stampify se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs
              seront informés par email au moins 15 jours avant l'entrée en vigueur de toute modification
              substantielle. La poursuite de l'utilisation du service après cette date vaut acceptation des
              nouvelles conditions.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Droit applicable et litiges</h2>
            <p>
              Les présentes conditions sont régies par le <strong>droit français</strong>. En cas de litige,
              les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire. À défaut,
              le tribunal compétent sera celui du ressort du siège social de Stampify.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. Contact</h2>
            <p>
              Pour toute question relative aux présentes conditions :{" "}
              <a href="mailto:contact@stampify.ch" className="underline" style={{ color: "#534AB7" }}>
                contact@stampify.ch
              </a>
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 px-6 mt-8">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-4 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600 transition-colors">Accueil</Link>
          <Link href="/politique-de-confidentialite" className="hover:text-gray-600 transition-colors">Politique de confidentialité</Link>
          <span>© 2026 Stampify</span>
        </div>
      </footer>
    </div>
  );
}
