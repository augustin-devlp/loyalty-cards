import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Fonctionnalités Stampify — Site vitrine + carte fidélité + roue de la fortune",
  description:
    "Toutes les fonctionnalités incluses dans Stampify : site vitrine, carte fidélité digitale, roue de la fortune, plaquette NFC, SMS automatiques, réservations, commandes en ligne, menu QR et dashboard analytics.",
  alternates: { canonical: "https://www.stampify.ch/fonctionnalites" },
};

const WA =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20veux%20en%20savoir%20plus%20sur%20Stampify.";

interface Feature {
  emoji: string;
  title: string;
  color: string;
  addon?: string;
  items: string[];
}

const features: Feature[] = [
  {
    emoji: "🌐",
    title: "Site vitrine",
    color: "#EEF0FC",
    items: [
      "Site web 5 pages à vos couleurs (Accueil, Menu/Carte, À propos, Contact, Fidélité)",
      "Nom de domaine .ch inclus la 1ère année",
      "Hébergement inclus la 1ère année",
      "Responsive mobile-first",
      "SEO local optimisé (Google My Business, Schema.org)",
      "Certificat SSL (https)",
      "Chargement ultra-rapide (score Lighthouse > 90)",
    ],
  },
  {
    emoji: "🎟️",
    title: "Carte fidélité digitale",
    color: "#EEF0FC",
    items: [
      "Carte à tampon 10 cases, zéro papier",
      "Accessible via QR code ou NFC — sans application à télécharger",
      "Le client scanne, le tampon s'applique en 1 seconde",
      "Récompense configurable (boisson offerte, remise, etc.)",
      "Historique de visites par client",
      "QR code A4/A5 imprimable inclus",
    ],
  },
  {
    emoji: "🎁",
    title: "Roue de la fortune & Loterie",
    color: "#FEF3C7",
    items: [
      "Roue animée personnalisable (jusqu'à 8 segments)",
      "Gains configurables : réduction, produit offert, points bonus",
      "Participation une fois par jour/semaine (configurable)",
      "Loterie mensuelle automatique pour les meilleurs clients",
      "Intégration directe dans votre site Stampify",
      "Génère de l'engagement et des visites répétées",
    ],
  },
  {
    emoji: "🪵",
    title: "Plaquette NFC en bois gravée",
    color: "#FEF3C7",
    items: [
      "Plaquette en bois véritable gravée à votre nom/logo",
      "Technologie NFC — le client approche son téléphone",
      "Redirige vers votre carte fidélité instantanément",
      "Fonctionne avec tous les smartphones récents",
      "Design élégant pour votre comptoir",
      "Livrée avec votre site en 48h",
    ],
  },
  {
    emoji: "📱",
    title: "SMS & Notifications push",
    color: "#EEF0FC",
    items: [
      "Notifications push navigateur incluses (sans app)",
      "1 campagne SMS offerte le 1er mois",
      "Envoi manuel depuis votre dashboard",
      "Taux d'ouverture SMS : > 90 %",
    ],
  },
  {
    emoji: "✉️",
    title: "SMS Automatiques",
    color: "#FFF7ED",
    addon: "ADD-ON — 49 CHF/mois",
    items: [
      "15 déclencheurs automatiques configurables",
      "Exemples : « Bravo, votre carte est complète ! », « On ne vous a pas vu depuis 3 semaines… »",
      "Campagnes manuelles vers vos clients fidèles",
      "SMS retargeting (add-on Pro)",
      "Parrainage client automatisé (add-on Pro)",
    ],
  },
  {
    emoji: "📅",
    title: "Réservations en ligne",
    color: "#F0FDF4",
    items: [
      "Formulaire de réservation intégré au site",
      "Confirmation automatique par SMS/email",
      "Gestion des créneaux depuis le dashboard",
      "Zéro commission",
    ],
  },
  {
    emoji: "🛒",
    title: "Commandes en ligne",
    color: "#F0FDF4",
    items: [
      "Catalogue produits avec photos et prix",
      "Commande click & collect",
      "Paiement en ligne ou sur place",
      "Notification en temps réel",
    ],
  },
  {
    emoji: "📋",
    title: "Menu QR",
    color: "#EEF0FC",
    items: [
      "Menu digital accessible par QR code",
      "Mise à jour en temps réel depuis le dashboard",
      "Photos des plats, descriptions, allergènes",
      "Zéro impression, toujours à jour",
    ],
  },
  {
    emoji: "📊",
    title: "Dashboard analytics",
    color: "#EEF0FC",
    items: [
      "Nombre de tampons distribués",
      "Clients les plus fidèles",
      "Taux de retour client",
      "Performances des campagnes SMS",
      "Accessible depuis mobile",
    ],
  },
];

export default function FonctionnalitesPage() {
  return (
    <div style={{ background: "#F5F0E8", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          paddingTop: 128,
          paddingBottom: 80,
          paddingLeft: 24,
          paddingRight: 24,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              background: "#EEF0FC",
              color: "#3D31B0",
              borderRadius: 999,
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            Tout inclus · 990 CHF
          </div>
          <h1
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 600,
              color: "#1A1410",
              margin: "0 0 20px 0",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Tout ce dont votre commerce a besoin.
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "#6B6259",
              lineHeight: 1.65,
              margin: "0 0 36px 0",
            }}
          >
            Un seul outil. Un seul paiement. Pour toujours.
          </p>
          <Link
            href="/subscribe"
            style={{
              display: "inline-block",
              background: "#3D31B0",
              color: "white",
              padding: "16px 32px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Obtenir mon site maintenant →
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: "0 24px 96px 24px" }}>
        <div
          style={{
            maxWidth: 1152,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "white",
                border: "1px solid #E2D9CC",
                borderRadius: 16,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Emoji circle */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: f.color,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  flexShrink: 0,
                }}
              >
                {f.emoji}
              </div>

              {/* Title + optional badge */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <h2
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#1A1410",
                    margin: 0,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                  }}
                >
                  {f.title}
                </h2>
                {f.addon && (
                  <span
                    style={{
                      display: "inline-block",
                      background: "#FEF3C7",
                      color: "#B45309",
                      border: "1px solid #F59E0B",
                      borderRadius: 999,
                      padding: "3px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      width: "fit-content",
                    }}
                  >
                    {f.addon}
                  </span>
                )}
              </div>

              {/* Checklist */}
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                }}
              >
                {f.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      gap: 9,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        color: "#3D31B0",
                        fontWeight: 700,
                        flexShrink: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      ✓
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        color: "#3D3028",
                        lineHeight: 1.55,
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          background: "#1A1410",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 600,
              color: "white",
              margin: "0 0 16px 0",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Prêt à tout avoir en une fois ?
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.65)",
              margin: "0 0 36px 0",
            }}
          >
            990 CHF · Livraison 48h · Paiement unique
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/subscribe"
              style={{
                display: "inline-block",
                background: "#3D31B0",
                color: "white",
                padding: "16px 32px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 16,
                textDecoration: "none",
              }}
            >
              Obtenir mon site maintenant →
            </Link>
            <Link
              href="/demos"
              style={{
                display: "inline-block",
                background: "transparent",
                color: "rgba(255,255,255,0.75)",
                padding: "16px 32px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 16,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              Voir des exemples →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
