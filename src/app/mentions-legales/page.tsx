import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mentions légales — Stampify",
  description: "Mentions légales de Stampify, éditeur de sites web et cartes fidélité pour commerçants en Suisse romande.",
};

const sections = [
  {
    title: "1. Éditeur du site",
    content: `Le site stampify.ch est édité par :

Maximilien Domenget
Entrepreneur individuel
Canton de Fribourg, Suisse
Email : contact@stampify.ch
Téléphone : +41 79 134 29 97`,
  },
  {
    title: "2. Hébergement",
    content: `Le site est hébergé par :

Vercel Inc.
440 N Barranca Ave #4133
Covina, CA 91723, États-Unis
vercel.com

Les données des clients finaux sont hébergées sur des serveurs en Europe (région Frankfurt) via Supabase.`,
  },
  {
    title: "3. Propriété intellectuelle",
    content: `L'ensemble du contenu de ce site (textes, images, graphismes, logotypes, code source) est la propriété exclusive de Stampify et est protégé par les lois suisses et internationales relatives à la propriété intellectuelle.

Toute reproduction, représentation, modification, publication ou transmission, partielle ou totale, du contenu de ce site est interdite sans l'autorisation préalable et écrite de Stampify.`,
  },
  {
    title: "4. Données personnelles",
    content: `Stampify collecte et traite des données personnelles conformément à la Loi fédérale sur la protection des données (LPD) du 25 septembre 2020 ainsi qu'au Règlement général sur la protection des données (RGPD) européen pour les clients résidant en Union européenne.

Les données collectées (prénom, numéro de téléphone) sont utilisées exclusivement pour :
• La gestion du programme de fidélité
• L'envoi de communications commerciales avec consentement
• La facturation et la relation client

Ces données ne sont jamais revendues à des tiers. Vous pouvez exercer vos droits d'accès, de rectification et de suppression en contactant contact@stampify.ch.`,
  },
  {
    title: "5. Cookies",
    content: `Ce site utilise des cookies techniques nécessaires à son bon fonctionnement (session, préférences). Aucun cookie publicitaire tiers n'est utilisé.

En poursuivant votre navigation, vous acceptez l'utilisation de ces cookies techniques.`,
  },
  {
    title: "6. Droit applicable",
    content: `Le présent site et ses conditions sont soumis au droit suisse. En cas de litige, les tribunaux du canton de Fribourg seront seuls compétents.`,
  },
];

export default function MentionsLegalesPage() {
  return (
    <div style={{ background: "#F5F0E8", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "120px 24px 80px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3D31B0", marginBottom: 12 }}>
            Légal
          </div>
          <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: "#1A1410", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
            Mentions légales
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
