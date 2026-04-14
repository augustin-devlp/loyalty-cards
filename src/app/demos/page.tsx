import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoFilter, { type Demo } from "@/components/DemoFilter";

export const metadata: Metadata = {
  title: "Démos Stampify — Exemples de sites et cartes fidélité pour commerçants",
  description:
    "Découvrez 6 exemples réels de sites livrés par Stampify : café, boulangerie, restaurant, barbershop, manucure, spa. Carte de fidélité digitale + plaquette NFC inclus. 990 CHF, livraison 48h.",
  alternates: { canonical: "https://www.stampify.ch/demos" },
};

const WA_GENERAL =
  "https://wa.me/41791342997?text=Bonjour+%21+J%27ai+vu+vos+exemples+de+sites+sur+Stampify+et+je+suis+int%C3%A9ress%C3%A9+pour+mon+commerce.+Pouvez-vous+me+dire+ce+que+vous+pouvez+faire+pour+moi+%3F";

const demos: Demo[] = [
  {
    name: "Spa Essence",
    type: "spa",
    typeLabel: "Spa & bien-être",
    city: "Genève",
    slug: "https://loyalty-cards-rho.vercel.app/lessence-spa.html",
    external: true,
    urlBar: "lessence-spa.stampify.ch",
    badge: "⭐ Plus populaire",
    gradientFrom: "#1B4332",
    gradientTo: "#2D5A4E",
    features: ["Réservation soins", "Carte fidélité", "Packages"],
  },
  {
    name: "Café Lumière",
    type: "cafe",
    typeLabel: "Café & brunch",
    city: "Genève",
    slug: "/demos/cafe-lumiere.html",
    external: false,
    urlBar: "cafe-lumiere.stampify.ch",
    badge: null,
    gradientFrom: "#3E1F0A",
    gradientTo: "#6B3F2A",
    features: ["Réservation table", "Commande en avance", "Carte fidélité"],
  },
  {
    name: "Black Scissors",
    type: "barbershop",
    typeLabel: "Barbershop premium",
    city: "Genève",
    slug: "/demos/black-scissors.html",
    external: false,
    urlBar: "black-scissors.stampify.ch",
    badge: null,
    gradientFrom: "#000000",
    gradientTo: "#C41E3A",
    features: ["Réservation coupe", "Carte VIP", "Galerie"],
  },
  {
    name: "Bistrot du Coin",
    type: "restaurant",
    typeLabel: "Restaurant gastronomique",
    city: "Fribourg",
    slug: "/demos/bistrot-du-coin.html",
    external: false,
    urlBar: "bistrot-du-coin.stampify.ch",
    badge: null,
    gradientFrom: "#4E1620",
    gradientTo: "#6B1F2A",
    features: ["Résa table", "Carte des vins", "Menu QR · Fidélité"],
  },
  {
    name: "Boulangerie Martin",
    type: "boulangerie",
    typeLabel: "Boulangerie artisanale",
    city: "Lausanne",
    slug: "/demos/boulangerie-martin.html",
    external: false,
    urlBar: "boulangerie-martin.stampify.ch",
    badge: null,
    gradientFrom: "#5C4309",
    gradientTo: "#8B6914",
    features: ["Commande en ligne", "Retrait QR code", "Fidélité"],
  },
  {
    name: "Nail Studio",
    type: "manucure",
    typeLabel: "Salon de manucure",
    city: "Lausanne",
    slug: "/demos/nail-studio.html",
    external: false,
    urlBar: "nail-studio.stampify.ch",
    badge: null,
    gradientFrom: "#880E4F",
    gradientTo: "#C2185B",
    features: ["Prise de RDV", "Galerie poses", "Carte récompenses"],
  },
];

export default function DemosPage() {
  return (
    <div style={{ background: "#F5F0E8", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          paddingTop: 128,
          paddingBottom: 40,
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
            6 démos interactives
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
            Ce que vous voyez est
            <br />
            <em style={{ fontStyle: "italic" }}>exactement ce que vous recevrez.</em>
          </h1>
          <p style={{ fontSize: 18, color: "#6B6259", lineHeight: 1.65, margin: 0 }}>
            Des exemples réels livrés à des commerçants en Suisse romande. À vos couleurs, à votre
            nom, en 48h.
          </p>
        </div>
      </section>

      {/* Filter + Cards (client component) */}
      <DemoFilter demos={demos} />

      {/* CTA section */}
      <section style={{ background: "white", padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              background: "#EEF0FC",
              color: "#3D31B0",
              borderRadius: 999,
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            Votre commerce
          </div>
          <h2
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 600,
              color: "#1A1410",
              margin: "0 0 16px 0",
              letterSpacing: "-0.02em",
            }}
          >
            Votre commerce n&apos;est pas dans la liste ?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#6B6259",
              lineHeight: 1.7,
              margin: "0 0 32px 0",
            }}
          >
            On fait des sites pour tous les commerces locaux en Suisse romande : fleuristes,
            pharmacies, boutiques, kinésithérapeutes, coiffeurs, tatoueurs... Contactez-nous et on
            vous montre ce qu&apos;on ferait pour vous spécifiquement.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href={WA_GENERAL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#3D31B0",
                color: "white",
                padding: "16px 32px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              Obtenir mon site en 48h — 990 CHF →
            </a>
            <Link
              href="/tarif"
              style={{
                display: "inline-block",
                background: "transparent",
                border: "1.5px solid #3D31B0",
                color: "#3D31B0",
                padding: "16px 32px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              Voir le tarif
            </Link>
          </div>
          <p style={{ fontSize: 13, color: "#6B6259", marginTop: 16 }}>
            📱 Réponse sous 2h · 7j/7
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
