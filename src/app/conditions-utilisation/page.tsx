import Link from "next/link";

export default function ConditionsUtilisation() {
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
        <h1 className="text-3xl font-black text-gray-900 mb-4">Conditions d&apos;utilisation</h1>
        <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : mars 2026</p>

        <div className="space-y-10 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Présentation du service</h2>
            <p>
              Stampify est une plateforme SaaS (Software as a Service) permettant aux commerçants de créer et gérer
              des programmes de cartes de fidélité digitales pour leurs clients. Le service est accessible à l&apos;adresse{" "}
              <strong>stampify.ch</strong>.
            </p>
            <p className="mt-2">
              Stampify est édité par Augustin Domenget, domicilié en France.
              Contact : <a href="mailto:contact@stampify.ch" className="text-indigo-600 hover:underline">contact@stampify.ch</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Utilisateurs autorisés</h2>
            <p>
              L&apos;accès à Stampify est réservé aux <strong>commerçants professionnels</strong>. En créant un compte,
              vous déclarez agir dans le cadre de votre activité professionnelle et non en tant que consommateur
              au sens du droit de la consommation.
            </p>
            <p className="mt-2">
              L&apos;utilisation du service à des fins personnelles ou non commerciales est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Offres et tarifs</h2>
            <p className="mb-4">Stampify propose trois formules d&apos;abonnement :</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Formule</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Prix (€ / CHF)</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Engagement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium">Essentiel</td>
                    <td className="px-4 py-3">19 € / 29 CHF / mois</td>
                    <td className="px-4 py-3">Sans engagement</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Pro</td>
                    <td className="px-4 py-3">49 € / 79 CHF / mois</td>
                    <td className="px-4 py-3">Sans engagement</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Business</td>
                    <td className="px-4 py-3">99 € / 149 CHF / mois</td>
                    <td className="px-4 py-3">3 mois minimum</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-gray-500 text-xs">
              Les tarifs sont indiqués hors taxes. Stampify se réserve le droit de modifier ses tarifs avec un
              préavis de 30 jours par e-mail.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Paiement</h2>
            <p>
              Le paiement s&apos;effectue via <strong>Stripe</strong>, prestataire de paiement sécurisé. Un prélèvement
              mensuel automatique est réalisé à la date anniversaire de l&apos;abonnement.
            </p>
            <p className="mt-2">
              En cas d&apos;échec de paiement, Stampify se réserve le droit de suspendre l&apos;accès au service après
              un délai de grâce de 7 jours. Les données sont conservées pendant 30 jours suivant la suspension
              avant suppression définitive.
            </p>
            <p className="mt-2">
              Stampify ne stocke aucune information de carte bancaire — ces données sont traitées exclusivement
              par Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Résiliation et engagement</h2>
            <p>
              Les formules <strong>Essentiel</strong> et <strong>Pro</strong> sont sans engagement : vous pouvez
              résilier à tout moment depuis votre tableau de bord (&quot;Facturation&quot; → &quot;Gérer l&apos;abonnement&quot;).
              La résiliation prend effet à la fin de la période de facturation en cours.
            </p>
            <p className="mt-2">
              La formule <strong>Business</strong> requiert un engagement minimum de <strong>3 mois</strong>. Toute
              résiliation avant ce délai entraîne la facturation des mois restants de la période d&apos;engagement.
              Passé ce délai, la résiliation est libre et prend effet à la fin de la période en cours.
            </p>
            <p className="mt-2">
              Aucun remboursement partiel n&apos;est effectué pour les périodes déjà facturées, sauf disposition
              légale contraire.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Obligations du commerçant</h2>
            <p>En utilisant Stampify, le commerçant s&apos;engage à :</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Utiliser le service conformément à la législation applicable</li>
              <li>Obtenir le consentement de ses clients pour la collecte de leurs données personnelles</li>
              <li>Ne pas utiliser la plateforme à des fins illicites, frauduleuses ou trompeuses</li>
              <li>Assurer la sécurité de ses identifiants de connexion</li>
              <li>Ne pas transmettre ses identifiants à des tiers non autorisés</li>
            </ul>
            <p className="mt-3">
              Le commerçant est seul responsable de son programme de fidélité, de ses communications avec ses
              clients et du respect du RGPD vis-à-vis de ceux-ci.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Responsabilité de Stampify</h2>
            <p>
              Stampify s&apos;engage à fournir le service avec diligence et à maintenir une disponibilité raisonnable
              de la plateforme. Stampify héberge les données du commerçant et de ses clients, mais ne peut être
              tenu responsable :
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Des actions ou omissions du commerçant vis-à-vis de ses clients</li>
              <li>Des interruptions de service dues à des tiers (hébergeur, opérateur télécom, etc.)</li>
              <li>Des pertes indirectes ou manques à gagner</li>
              <li>Des dommages résultant d&apos;une utilisation non conforme aux présentes conditions</li>
            </ul>
            <p className="mt-3">
              La responsabilité de Stampify est limitée au montant des sommes effectivement versées par le
              commerçant au cours des 3 derniers mois.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des éléments de la plateforme Stampify (interface, code, marque, logo) sont la propriété
              exclusive d&apos;Augustin Domenget. Toute reproduction ou utilisation sans autorisation expresse est interdite.
            </p>
            <p className="mt-2">
              Le commerçant conserve la propriété de ses données et du contenu qu&apos;il crée via la plateforme
              (logo, nom de carte, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Modification des conditions</h2>
            <p>
              Stampify se réserve le droit de modifier les présentes conditions d&apos;utilisation. En cas de
              modification substantielle, les commerçants seront informés par e-mail avec un préavis de 30 jours.
              La poursuite de l&apos;utilisation du service après ce délai vaut acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. Droit applicable et juridiction compétente</h2>
            <p>
              Les présentes conditions d&apos;utilisation sont régies par le <strong>droit français</strong>. En cas
              de litige, et après tentative de résolution amiable, le tribunal compétent sera le{" "}
              <strong>Tribunal de Paris</strong>.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 px-6 mt-16">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">Accueil</Link>
          <Link href="/mentions-legales" className="hover:text-gray-900">Mentions légales</Link>
          <Link href="/politique-de-confidentialite" className="hover:text-gray-900">Politique de confidentialité</Link>
        </div>
      </footer>
    </div>
  );
}
