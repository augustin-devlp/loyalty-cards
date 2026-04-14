import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoAnimation from "@/components/DemoAnimation";

export const metadata: Metadata = {
  title: "Démos Stampify — Exemples de sites et cartes fidélité pour commerçants",
  description:
    "Découvrez 6 exemples réels de sites livrés par Stampify : café, boulangerie, restaurant, barbershop, manucure, spa. Carte de fidélité digitale + plaquette NFC inclus. 990 CHF, livraison 48h.",
  alternates: { canonical: "https://www.stampify.ch/demos" },
};

const WA_OBTENIR =
  "https://wa.me/41791342997?text=Bonjour%2C%20je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

const demos = [
  {
    emoji: "🧖",
    name: "Spa Essence",
    type: "Spa & bien-être",
    city: "Genève",
    slug: "https://loyalty-cards-rho.vercel.app/lessence-spa.html",
    external: true,
    primary: "#2D5A4E",
    gradientFrom: "#1B4332",
    gradientTo: "#2D5A4E",
    urlBar: "spa-essence.ch",
    features: ["Carte fidélité", "Réservation", "SMS promos"],
    stampIcon: "🧖",
    reward: "Soin visage offert après 10 visites",
    rewardIcon: "✨",
    badge: "⭐ Démo principale",
  },
  {
    emoji: "☕",
    name: "Café Lumière",
    type: "Café & brunch",
    city: "Genève",
    slug: "/demos/cafe-lumiere.html",
    external: false,
    primary: "#6B3F2A",
    gradientFrom: "#3E1F0A",
    gradientTo: "#6B3F2A",
    urlBar: "cafe-lumiere.ch",
    features: ["Carte fidélité", "Menu digital", "Réservation"],
    stampIcon: "☕",
    reward: "Café offert après 10 visites",
    rewardIcon: "☕",
    badge: null,
  },
  {
    emoji: "🥐",
    name: "Boulangerie Martin",
    type: "Boulangerie artisanale",
    city: "Lausanne",
    slug: "/demos/boulangerie-martin.html",
    external: false,
    primary: "#8B6914",
    gradientFrom: "#5C4309",
    gradientTo: "#8B6914",
    urlBar: "boulangerie-martin.ch",
    features: ["Carte fidélité", "Menu digital", "Réservation"],
    stampIcon: "🥐",
    reward: "Viennoiserie offerte après 10 visites",
    rewardIcon: "🥐",
    badge: null,
  },
  {
    emoji: "🍽️",
    name: "Le Bistrot du Coin",
    type: "Restaurant gastronomique",
    city: "Fribourg",
    slug: "/demos/bistrot-du-coin.html",
    external: false,
    primary: "#6B1F2A",
    gradientFrom: "#4E1620",
    gradientTo: "#6B1F2A",
    urlBar: "bistrot-du-coin.ch",
    features: ["Carte fidélité", "Menu QR", "Réservation"],
    stampIcon: "🍽️",
    reward: "Dessert offert après 10 visites",
    rewardIcon: "🍮",
    badge: null,
  },
  {
    emoji: "✂️",
    name: "Black Scissors",
    type: "Barbershop premium",
    city: "Genève",
    slug: "/demos/black-scissors.html",
    external: false,
    primary: "#0A0A0A",
    gradientFrom: "#000000",
    gradientTo: "#C41E3A",
    urlBar: "black-scissors.ch",
    features: ["Carte fidélité", "Réservation", "Galerie"],
    stampIcon: "✂️",
    reward: "Coupe offerte après 10 visites",
    rewardIcon: "✂️",
    badge: null,
  },
  {
    emoji: "💅",
    name: "Nail Studio",
    type: "Salon de manucure",
    city: "Lausanne",
    slug: "/demos/nail-studio.html",
    external: false,
    primary: "#C2185B",
    gradientFrom: "#880E4F",
    gradientTo: "#C2185B",
    urlBar: "nail-studio.ch",
    features: ["Carte fidélité", "Prise de RDV", "Galerie"],
    stampIcon: "💅",
    reward: "Pose offerte après 10 visites",
    rewardIcon: "💅",
    badge: null,
  },
];

export default function DemosPage() {
  return (
    <div style={{ background: "#F5F0E8", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: 128, paddingBottom: 64, paddingLeft: 24, paddingRight: 24, textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            6 démos interactives
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 600, color: "#1A1410", margin: "0 0 20px 0", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Ce que vous voyez est<br /><em style={{ fontStyle: "italic" }}>exactement ce que vous recevrez.</em>
          </h1>
          <p style={{ fontSize: 18, color: "#6B6259", lineHeight: 1.65, margin: 0 }}>
            Des exemples réels livrés à des commerçants en Suisse romande. À vos couleurs, à votre nom, en 48h.
          </p>
        </div>
      </section>

      {/* Demo grid */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 32 }}>
            {demos.map((d) => (
              <div
                key={d.slug}
                style={{
                  background: "white",
                  border: "1px solid #E2D9CC",
                  borderRadius: 20,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                {/* Browser mockup */}
                <div style={{ background: "#F0EDE8", padding: "10px 14px 0" }}>
                  {/* Chrome bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                        <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                      ))}
                    </div>
                    <div style={{ flex: 1, background: "white", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#6B6259", display: "flex", alignItems: "center", gap: 6 }}>
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z" stroke="#28C840" strokeWidth="1.5" />
                        <path d="M5.5 8l1.5 1.5L10.5 6" stroke="#28C840" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {d.urlBar}
                    </div>
                  </div>
                  {/* Mini site preview */}
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${d.gradientFrom}, ${d.gradientTo})`,
                      borderRadius: "8px 8px 0 0",
                      padding: "20px 16px",
                      minHeight: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      position: "relative",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>
                        {d.type}
                      </div>
                      <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 16, fontWeight: 700, color: "white", lineHeight: 1.2 }}>
                        {d.name}
                      </div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                        {d.city}, Suisse
                      </div>
                    </div>
                    <div style={{ fontSize: 28 }}>{d.emoji}</div>
                    {d.badge && (
                      <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.2)", borderRadius: 999, padding: "3px 8px", fontSize: 9, fontWeight: 700, color: "white" }}>
                        {d.badge}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Sector info */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 20 }}>{d.emoji}</span>
                      <div>
                        <div style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 16, fontWeight: 700, color: "#1A1410" }}>
                          {d.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#6B6259" }}>{d.type} · {d.city}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {d.features.map((f) => (
                        <span key={f} style={{ background: "#EEF0FC", color: "#3D31B0", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999 }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* DemoAnimation */}
                  <div style={{ padding: "8px 0 28px" }}>
                    <DemoAnimation
                      primaryColor={d.primary}
                      stampIcon={d.stampIcon}
                      businessName={d.name}
                      reward={d.reward}
                      rewardIcon={d.rewardIcon}
                    />
                  </div>

                  {/* CTA */}
                  <a
                    href={d.slug}
                    target={d.external ? "_blank" : undefined}
                    rel={d.external ? "noopener noreferrer" : undefined}
                    style={{
                      display: "block",
                      background: "#3D31B0",
                      color: "white",
                      padding: "12px",
                      borderRadius: 10,
                      textAlign: "center",
                      fontWeight: 600,
                      fontSize: 14,
                      textDecoration: "none",
                      marginTop: "auto",
                    }}
                  >
                    Voir la démo interactive →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section style={{ background: "white", padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
            Votre commerce
          </div>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "#1A1410", margin: "0 0 16px 0", letterSpacing: "-0.02em" }}>
            Votre commerce n&apos;est pas dans la liste ?
          </h2>
          <p style={{ fontSize: 16, color: "#6B6259", lineHeight: 1.7, margin: "0 0 32px 0" }}>
            On fait des sites pour tous les commerces locaux en Suisse romande : fleuristes, pharmacies, boutiques, kinésithérapeutes, coiffeurs, tatoueurs... Contactez-nous et on vous montre ce qu&apos;on ferait pour vous spécifiquement.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/subscribe" style={{ display: "inline-block", background: "#3D31B0", color: "white", padding: "16px 32px", borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
              Obtenir mon site → 990 CHF
            </Link>
            <Link href="/tarif" style={{ display: "inline-block", background: "transparent", border: "1.5px solid #3D31B0", color: "#3D31B0", padding: "16px 32px", borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
              Voir le tarif
            </Link>
          </div>
          <p style={{ fontSize: 13, color: "#6B6259", marginTop: 16 }}>📱 Réponse sous 2h · 7j/7</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
