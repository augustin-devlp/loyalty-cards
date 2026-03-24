import Link from "next/link";

export const metadata = {
  title: "Conditions d'utilisation — Stampify",
  description: "Conditions générales d'utilisation de la plateforme SaaS Stampify.",
};

export default function ConditionsUtilisation() {
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
        <h1 className="text-3xl font-black text-gray-900 mb-2">Conditions d&apos;utilisation</h1>
        <p className="text-gray-400 text-sm mb-10">Dernière mise à jour : mars 2026</p>

        <div className="space-y-10 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Présentation du service</h2>
            <p>
              Stampify (stampify.ch) est une plateforme SaaS (Software as a Service) permettant aux commerçants professionnels de créer et gérer des programmes de fidélité digitaux à destination de leurs clients. Le service est édité par Augustin Domenget (contact@stampify.ch).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Accès au service</h2>
            <p>
              L&apos;accès à Stampify est réservé aux professionnels (commerçants, artisans, prestataires de services) disposant d&apos;un abonnement actif. Toute utilisation à des fins personnelles ou non commerciales est exclue. L&apos;utilisateur est responsable de la confidentialité de ses identifiants de connexion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Offres et tarifs</h2>
            <p className="mb-3">Stampify propose trois forfaits mensuels, sans engagement sauf mention contraire :</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Forfait</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Tarif France</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Tarif Suisse</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Engagement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-2 font-medium">Essentiel</td>
                    <td className="px-4 py-2">19 € / mois</td>
                    <td className="px-4 py-2">29 CHF / mois</td>
                    <td className="px-4 py-2">Sans engagement</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Pro</td>
                    <td className="px-4 py-2">49 € / mois</td>
                    <td className="px-4 py-2">79 CHF / mois</td>
                    <td className="px-4 py-2">Sans engagement</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Business</td>
                    <td className="px-4 py-2">99 € / mois</td>
                    <td className="px-4 py-2">149 CHF / mois</td>
                    <td className="px-4 py-2">3 mois minimum</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-gray-500">
              Des options complémentaires (add-ons) peuvent être souscrites en supplément. Les tarifs sont indiqués TTC pour la France, TVA incluse selon la réglementation en vigueur.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Paiement et facturation</h2>
            <p>
              Le paiement est effectué mensuellement par prélèvement automatique via Stripe, plateforme de paiement sécurisée. La première facturation intervient à la souscription, les suivantes à la même date chaque mois. Stampify ne stocke aucune donnée bancaire — ces données sont gérées exclusivement par Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Résiliation</h2>
            <p>
              Pour les forfaits Essentiel et Pro, la résiliation peut être effectuée à tout moment depuis le dashboard utilisateur, sous <strong>Paramètres &gt; Abonnement</strong>. Elle prend effet à la fin de la période de facturation en cours. Aucun remboursement au prorata n&apos;est accordé pour la période non utilisée.<br /><br />
              Pour le forfait Business, un engagement minimum de 3 mois est requis. Toute résiliation avant ce terme entraîne la facturation des mois restants.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Responsabilités</h2>
            <p className="mb-3">
              <strong>Stampify</strong> s&apos;engage à assurer l&apos;hébergement, la sécurité et la disponibilité de la plateforme (objectif de disponibilité : 99,5 % par mois hors maintenance planifiée). Stampify ne saurait être tenu responsable en cas d&apos;interruption due à un tiers (hébergeur, opérateur réseau, force majeure).
            </p>
            <p>
              <strong>Le commerçant</strong> est seul responsable du contenu de son programme de fidélité, des informations communiquées à ses clients, du respect de la réglementation applicable à son activité, et de l&apos;utilisation conforme des données clients collectées via Stampify.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des éléments constituant la plateforme Stampify (interface, code, marque, logo) est la propriété exclusive d&apos;Augustin Domenget. Toute reproduction, distribution ou utilisation non autorisée est interdite. L&apos;utilisateur conserve la propriété de ses données et du contenu qu&apos;il crée sur la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Modification des CGU</h2>
            <p>
              Stampify se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront informés par email au moins 15 jours avant l&apos;entrée en vigueur de toute modification substantielle. La poursuite de l&apos;utilisation du service vaut acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Droit applicable et litiges</h2>
            <p>
              Les présentes conditions sont régies par le droit français. Pour les utilisateurs suisses, les dispositions impératives du droit suisse restent applicables. En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux compétents seront ceux du ressort de l&apos;éditeur du service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. Contact</h2>
            <p>
              Pour toute question relative aux présentes conditions : <a href="mailto:contact@stampify.ch" className="text-indigo-600 underline">contact@stampify.ch</a>
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
