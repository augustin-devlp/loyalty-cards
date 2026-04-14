import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Conditions d'utilisation — Stampify",
  description: "Conditions générales de vente et d'utilisation de Stampify. Forfait 990 CHF tout inclus, livraison 48h.",
};

const sections = [
  {
    title: "1. Objet",
    content: `Les présentes conditions régissent les relations contractuelles entre Stampify (Maximilien Domenget, canton de Fribourg, Suisse) et tout client ayant commandé une prestation via le site stampify.ch ou par contact direct.

En passant commande, le client accepte sans réserve les présentes conditions générales.`,
  },
  {
    title: "2. Prestations",
    content: `Stampify propose la création de sites web vitrine et de systèmes de fidélité digitale pour commerçants locaux.

La prestation standard comprend :
• Site web vitrine 5 pages personnalisé
• Domaine .ch inclus la 1ère année
• Hébergement inclus la 1ère année
• Carte de fidélité digitale 10 cases
• Plaquette NFC en bois gravée
• QR code imprimable (A4 et A5)
• SEO local complet
• 1 campagne SMS offerte
• Tableau de bord analytics
• 2 retouches après livraison`,
  },
  {
    title: "3. Tarifs",
    content: `Forfait unique : 990 CHF TTC
Paiement unique, sans abonnement obligatoire.

Add-ons optionnels (sans engagement, résiliables à tout moment) :
• Add-on Standard : 49 CHF/mois — Campagnes SMS illimitées, mises à jour sur demande, rapport mensuel
• Add-on Premium : 79 CHF/mois — Tout le Standard + priorité support, campagnes push illimitées, A/B testing

Les prix s'entendent en francs suisses (CHF), TVA non applicable (prestataire indépendant exonéré).`,
  },
  {
    title: "4. Commande et paiement",
    content: `La commande est validée après échange via WhatsApp ou email et confirmation écrite des deux parties.

Le paiement intervient uniquement après validation du site par le client. Aucun paiement n'est demandé avant que le client ait approuvé le résultat.

Les modes de paiement acceptés : virement bancaire, TWINT, Stripe (carte bancaire).`,
  },
  {
    title: "5. Délai de livraison",
    content: `Le délai de livraison est de 48 heures à compter de la réception des informations complètes du client (textes, photos, horaires, logo).

Ce délai est garanti sous réserve de la fourniture complète des éléments nécessaires dans les 24h suivant la commande.`,
  },
  {
    title: "6. Propriété",
    content: `À la livraison et après paiement intégral, le client devient propriétaire à 100% de son site web : code source, contenu, domaine.

Stampify ne conserve aucun droit de propriété sur le site livré. Le client peut à tout moment changer d'hébergeur ou transférer son domaine.`,
  },
  {
    title: "7. Retouches et modifications",
    content: `2 retouches sont incluses dans le forfait initial dans les 30 jours suivant la livraison.

Au-delà, les modifications sont incluses dans l'add-on mensuel ou facturées à 80 CHF/heure.`,
  },
  {
    title: "8. Remboursement",
    content: `Le client ne paie qu'après avoir validé et approuvé son site. Aucun paiement n'étant effectué avant validation, aucun remboursement ne peut être demandé après paiement.

En cas de litige sur la conformité de la livraison par rapport aux spécifications convenues, Stampify s'engage à effectuer les corrections nécessaires gratuitement.`,
  },
  {
    title: "9. Responsabilité",
    content: `Stampify s'engage à mettre en œuvre tous les moyens nécessaires à la bonne exécution des prestations. Sa responsabilité est limitée au montant payé par le client.

Stampify ne peut être tenu responsable des interruptions de service liées à l'hébergeur tiers (Vercel) ou au registrar du domaine.`,
  },
  {
    title: "10. Droit applicable",
    content: `Les présentes conditions sont régies par le droit suisse. En cas de litige, les parties s'efforceront de trouver une solution amiable. À défaut, les tribunaux du canton de Fribourg seront seuls compétents.`,
  },
];

export default function ConditionsUtilisationPage() {
  return (
    <div style={{ background: "#F5F0E8", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "120px 24px 80px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3D31B0", marginBottom: 12 }}>
            Légal
          </div>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "#1A1410", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
            Conditions d&apos;utilisation
          </h1>
          <p style={{ color: "#6B6259", fontSize: 15 }}>Dernière mise à jour : avril 2026</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {sections.map((s) => (
            <div key={s.title} style={{ background: "white", border: "1px solid #E2D9CC", borderRadius: 16, padding: "28px 32px" }}>
              <h2 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 18, fontWeight: 700, color: "#1A1410", margin: "0 0 16px 0" }}>
                {s.title}
              </h2>
              <div style={{ color: "#6B6259", fontSize: 15, lineHeight: 1.75, whiteSpace: "pre-line" }}>
                {s.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
