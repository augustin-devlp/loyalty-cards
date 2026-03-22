import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité – Stampify",
  description: "Comment Stampify collecte, utilise et protège vos données personnelles.",
};

export default function PolitiqueDeConfidentialite() {
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
        <h1 className="text-3xl font-black text-gray-900 mb-4">Politique de confidentialité</h1>
        <p className="text-gray-500 text-sm mb-10">Dernière mise à jour : mars 2026</p>

        <div className="space-y-10 text-gray-600 text-sm leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Responsable du traitement</h2>
            <p>
              Stampify est édité par Augustin Domenget. Pour toute question relative à la protection de vos
              données, vous pouvez nous contacter à l'adresse :{" "}
              <a href="mailto:contact@stampify.ch" className="underline" style={{ color: "#534AB7" }}>
                contact@stampify.ch
              </a>.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Données collectées</h2>
            <p className="mb-2">Stampify collecte les données suivantes selon le profil de l'utilisateur :</p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Commerçants (titulaires d'un compte)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Adresse email</li>
                  <li>Nom du commerce</li>
                  <li>Pays</li>
                  <li>Informations de facturation (via Stripe – voir section sous-traitants)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Clients des commerçants</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Prénom et nom</li>
                  <li>Numéro de téléphone</li>
                  <li>Historique des tampons et récompenses</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Finalités du traitement</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fournir le service de cartes de fidélité numériques</li>
              <li>Gérer les comptes commerçants et la facturation</li>
              <li>Envoyer des notifications SMS aux clients (Google Wallet, Brevo)</li>
              <li>Générer des rapports statistiques pour les commerçants</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Sous-traitants</h2>
            <p className="mb-3">
              Stampify fait appel aux sous-traitants suivants, tous soumis à des garanties contractuelles conformes
              au RGPD :
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Fournisseur</th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Rôle</th>
                    <th className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Localisation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">Supabase</td>
                    <td className="border border-gray-200 px-3 py-2">Stockage et authentification des données</td>
                    <td className="border border-gray-200 px-3 py-2">Union Européenne</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2">Stripe</td>
                    <td className="border border-gray-200 px-3 py-2">Traitement des paiements</td>
                    <td className="border border-gray-200 px-3 py-2">États-Unis / UE</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">Brevo</td>
                    <td className="border border-gray-200 px-3 py-2">Envoi de SMS et emails transactionnels</td>
                    <td className="border border-gray-200 px-3 py-2">Union Européenne</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2">Google Wallet</td>
                    <td className="border border-gray-200 px-3 py-2">Cartes de fidélité numériques sur mobile</td>
                    <td className="border border-gray-200 px-3 py-2">États-Unis</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2">Vercel</td>
                    <td className="border border-gray-200 px-3 py-2">Hébergement de l'application</td>
                    <td className="border border-gray-200 px-3 py-2">États-Unis / UE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Durée de conservation</h2>
            <p>
              Les données personnelles sont conservées pendant <strong>3 ans</strong> à compter de la dernière
              activité du compte ou de la dernière interaction client. À l'expiration de ce délai, les données
              sont supprimées ou anonymisées.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Vos droits RGPD</h2>
            <p className="mb-2">Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Droit d'accès</strong> : obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification</strong> : corriger des données inexactes ou incomplètes</li>
              <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition</strong> : vous opposer à certains traitements</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, écrivez-nous à{" "}
              <a href="mailto:contact@stampify.ch" className="underline" style={{ color: "#534AB7" }}>
                contact@stampify.ch
              </a>. Nous répondrons dans un délai de 30 jours.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Cookies</h2>
            <p>
              Stampify n'utilise <strong>aucun cookie tiers</strong> ni outil de tracking publicitaire. Seuls des
              cookies de session strictement nécessaires au fonctionnement de l'application sont déposés. Ils
              sont automatiquement supprimés à la fin de votre session.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Délégué à la protection des données (DPO)</h2>
            <p>
              Responsable de la protection des données : <strong>Augustin Domenget</strong>
              <br />
              Contact :{" "}
              <a href="mailto:contact@stampify.ch" className="underline" style={{ color: "#534AB7" }}>
                contact@stampify.ch
              </a>
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Droit applicable et juridiction</h2>
            <p>
              La présente politique est régie par le <strong>droit français</strong> et le{" "}
              <strong>droit suisse</strong> (LPD). En cas de litige, vous pouvez saisir la CNIL (France) ou
              le PFPDT (Suisse).
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 px-6 mt-8">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-4 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600 transition-colors">Accueil</Link>
          <Link href="/conditions-utilisation" className="hover:text-gray-600 transition-colors">Conditions d'utilisation</Link>
          <span>© 2026 Stampify</span>
        </div>
      </footer>
    </div>
  );
}
