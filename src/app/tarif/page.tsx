import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Tarif Stampify — 990 CHF tout inclus | Site + carte fidélité + NFC",
  description:
    "Stampify : 990 CHF paiement unique. Site vitrine, carte de fidélité digitale, plaquette NFC gravée, SEO local, domaine .ch inclus. Aucun abonnement. Livraison 48h.",
  alternates: { canonical: "https://www.stampify.ch/tarif" },
};

const WA_OBTENIR =
  "https://wa.me/41791342997?text=Bonjour%2C%20je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";
const WA_CONTACT =
  "https://wa.me/41791342997?text=Bonjour%2C%20j%27ai%20une%20question%20pour%20l%27%C3%A9quipe%20Stampify.";

const included = [
  "Site web vitrine 5 pages à vos couleurs",
  "Domaine .ch inclus la 1ère année",
  "Hébergement inclus la 1ère année",
  "Certificat SSL (https)",
  "Carte de fidélité digitale 10 cases",
  "Plaquette NFC en bois gravée à votre nom",
  "QR code imprimable A4 et A5",
  "SEO local complet (Google, Schema.org)",
  "1 campagne SMS offerte le premier mois",
  "Notifications push navigateur incluses",
  "Tableau de bord analytics",
  "2 retouches gratuites après livraison",
  "Guide vidéo d'utilisation (5 min)",
  "Livraison en 48h garantie",
];

const notIncluded = [
  "Abonnement mensuel",
  "Frais cachés",
  "Application à télécharger pour vos clients",
  "Contrat d'engagement",
];

const comparisons = [
  { label: "Site seul", who: "Agence suisse classique", price: "1 500 – 5 000 CHF", color: "#E2D9CC" },
  { label: "Site + fidélité + NFC + SEO + SMS", who: "Stampify", price: "990 CHF", color: "#3D31B0", highlight: true },
  { label: "Abonnement fidélité SaaS seul", who: "Stamply, Loyalzoo…", price: "30 – 80 CHF/mois", color: "#E2D9CC" },
];

const faqs = [
  {
    q: "Qu'est-ce qui est inclus dans les 990 CHF ?",
    a: "Tout ce qui est dans la liste ci-dessus : site 5 pages, domaine .ch, hébergement, carte fidélité, plaquette NFC gravée, QR code, SEO local, 1 campagne SMS, dashboard, 2 retouches et livraison 48h.",
  },
  {
    q: "Y a-t-il des coûts après la première année ?",
    a: "Le domaine .ch coûte environ 25 CHF/an à renouveler. L'hébergement est offert la 1ère année (environ 5 CHF/mois ensuite). La carte fidélité et le tableau de bord sont à vie. Aucun abonnement imposé.",
  },
  {
    q: "C'est quoi l'add-on à 49 CHF/mois ?",
    a: "Optionnel et sans engagement. Il inclut : campagnes SMS illimitées, mises à jour du site sur demande, et rapport mensuel détaillé par email. Vous pouvez l'activer ou l'arrêter quand vous voulez.",
  },
  {
    q: "Est-ce que je dois payer avant de voir le résultat ?",
    a: "Non. On crée votre site, vous le validez, et vous payez seulement quand vous êtes satisfait. Pas de surprise.",
  },
  {
    q: "Est-ce que je possède mon site ?",
    a: "Oui, à 100%. Le code source, le domaine, le contenu — tout est à vous. Si un jour vous voulez changer d'hébergeur ou gérer vous-même, vous pouvez.",
  },
  {
    q: "Combien de temps pour avoir mon site en ligne ?",
    a: "48h à partir du moment où vous nous envoyez vos informations (photos, textes, horaires). La livraison 48h est garantie.",
  },
];

export default function TarifPage() {
  return (
    <div style={{ background: "#F5F0E8", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: 128, paddingBottom: 64, paddingLeft: 24, paddingRight: 24, textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            Paiement unique · Aucun abonnement
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 600, color: "#1A1410", margin: "0 0 16px 0", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Un investissement unique.<br /><em>Zéro abonnement.</em>
          </h1>
          <p style={{ fontSize: 18, color: "#6B6259", lineHeight: 1.65, margin: 0 }}>
            Vous payez une fois. Votre site et votre carte fidélité sont à vous pour toujours.
          </p>
        </div>
      </section>

      {/* Pricing card */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ background: "white", border: "2px solid #3D31B0", borderRadius: 24, padding: "48px" }}>
            <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "4px 14px", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>⭐ Le seul forfait</div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 80, fontWeight: 700, color: "#1A1410", lineHeight: 1 }}>990 CHF</div>
            <div style={{ fontSize: 14, color: "#6B6259", marginTop: 6, marginBottom: 32 }}>paiement unique — aucun abonnement</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {included.map((item) => (
                <div key={item} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #F5F0E8", alignItems: "flex-start" }}>
                  <span style={{ color: "#3D31B0", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 15, color: "#1A1410" }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 2 }}>
              {notIncluded.map((item) => (
                <div key={item} style={{ display: "flex", gap: 12, padding: "8px 0", alignItems: "center" }}>
                  <span style={{ color: "#E2D9CC", fontWeight: 700, flexShrink: 0 }}>✕</span>
                  <span style={{ fontSize: 14, color: "#6B6259", textDecoration: "line-through" }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "#EEF0FC", borderRadius: 12, padding: 16, margin: "28px 0", fontSize: 14, fontStyle: "italic", color: "#3D31B0", lineHeight: 1.6 }}>
              2.71 CHF par jour pendant 1 an. Moins que votre café du matin.
            </div>

            <Link
              href={WA_OBTENIR}
              style={{ display: "block", background: "#3D31B0", color: "white", padding: "18px", borderRadius: 12, textAlign: "center", fontWeight: 600, fontSize: 17, textDecoration: "none" }}
            >
              Obtenir mon site maintenant →
            </Link>
            <p style={{ fontSize: 13, color: "#6B6259", textAlign: "center", marginTop: 12, marginBottom: 0 }}>
              📱 Réponse sous 2h · 7j/7
            </p>
          </div>

          {/* Add-on */}
          <div style={{ background: "white", border: "1px solid #E2D9CC", borderRadius: 16, padding: "28px 32px", marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#1A1410", marginBottom: 4 }}>Add-on optionnel</div>
                <div style={{ fontSize: 13, color: "#6B6259" }}>Sans engagement · résiliable à tout moment</div>
              </div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 700, color: "#3D31B0" }}>49 CHF/mois</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Campagnes SMS illimitées",
                "Mises à jour du site sur demande",
                "Rapport mensuel détaillé par email",
              ].map((item) => (
                <div key={item} style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: "#3D31B0", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 14, color: "#1A1410" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section style={{ background: "white", padding: "80px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 600, color: "#1A1410", margin: 0, letterSpacing: "-0.02em" }}>
              Pourquoi 990 CHF, c&apos;est peu.
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {comparisons.map((c, i) => (
              <div
                key={i}
                style={{
                  background: c.highlight ? "#3D31B0" : "#F5F0E8",
                  border: c.highlight ? "2px solid #3D31B0" : "1px solid #E2D9CC",
                  borderRadius: 14,
                  padding: "20px 28px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: c.highlight ? "white" : "#1A1410" }}>{c.who}</div>
                  <div style={{ fontSize: 13, color: c.highlight ? "rgba(255,255,255,0.7)" : "#6B6259", marginTop: 2 }}>{c.label}</div>
                </div>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 700, color: c.highlight ? "white" : "#1A1410" }}>{c.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#F5F0E8", padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 600, color: "#1A1410", margin: 0, letterSpacing: "-0.02em" }}>
              Questions fréquentes
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: "white", border: "1px solid #E2D9CC", borderRadius: 14, padding: "24px 28px" }}>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 600, color: "#1A1410", marginBottom: 10 }}>{faq.q}</div>
                <div style={{ fontSize: 15, color: "#6B6259", lineHeight: 1.65 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#1A1410", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, color: "white", margin: "0 0 16px 0", letterSpacing: "-0.02em" }}>
            Prêt à vous lancer ?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", margin: "0 0 32px 0" }}>
            Envoyez-nous un message. On vous répond sous 2h, 7j/7.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={WA_OBTENIR} style={{ display: "inline-block", background: "#3D31B0", color: "white", padding: "16px 32px", borderRadius: 10, fontWeight: 600, fontSize: 16, textDecoration: "none" }}>
              Obtenir mon site →
            </Link>
            <Link href={WA_CONTACT} style={{ display: "inline-block", background: "transparent", color: "rgba(255,255,255,0.7)", padding: "16px 32px", borderRadius: 10, fontWeight: 600, fontSize: 16, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
              Poser une question
            </Link>
          </div>
          <div style={{ marginTop: 24 }}>
            <Link href="/demos" style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>
              Voir des exemples de sites →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
