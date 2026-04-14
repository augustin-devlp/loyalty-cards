import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    emoji: "☕",
    name: "Café Lumière",
    type: "Café & brunch",
    city: "Genève",
    slug: "/demo/cafe",
    color: "#3E1F0A",
    accent: "#C9A84C",
    reward: "1 café offert après 10 tampons",
    features: ["Carte fidélité 10 cases", "Roue de la fortune", "Réservation en ligne"],
    desc: "Un café moderne à Genève avec une carte fidélité digitale, une roue de la fortune et un système de réservation. Exactement ce que vous recevrez — à vos couleurs.",
    stamps: 7,
  },
  {
    emoji: "🥐",
    name: "Boulangerie Martin",
    type: "Boulangerie artisanale",
    city: "Lausanne",
    slug: "/demo/boulangerie",
    color: "#6B3A1F",
    accent: "#E8A44A",
    reward: "1 viennoiserie offerte après 8 tampons",
    features: ["Carte fidélité 8 cases", "Menu digital", "Promotions SMS"],
    desc: "Une boulangerie artisanale lausannoise avec son menu digital, sa carte fidélité et ses campagnes SMS pour rappeler les promotions du weekend.",
    stamps: 5,
  },
  {
    emoji: "✂️",
    name: "The Barber Club",
    type: "Barbershop premium",
    city: "Fribourg",
    slug: "/demo/barbershop",
    color: "#1A2A3A",
    accent: "#D4A853",
    reward: "1 coupe offerte après 8 tampons",
    features: ["Réservation en ligne", "Carte VIP fidélité", "Galerie de coupes"],
    desc: "Un barbershop premium à Fribourg avec prise de rendez-vous intégrée, galerie de styles et carte VIP fidélité pour les habitués.",
    stamps: 6,
  },
  {
    emoji: "🍽️",
    name: "Chez Morel",
    type: "Restaurant gastronomique",
    city: "Neuchâtel",
    slug: "/demo/restaurant",
    color: "#2C1810",
    accent: "#B8956A",
    reward: "Dessert offert après 10 tampons",
    features: ["Menu digital QR", "Réservations en ligne", "Carte fidélité"],
    desc: "Un restaurant gastronomique à Neuchâtel avec menu digital QR, système de réservation et carte fidélité pour les clients réguliers.",
    stamps: 8,
  },
  {
    emoji: "💅",
    name: "Studio Nails",
    type: "Salon de manucure",
    city: "Genève",
    slug: "/demo/manucure",
    color: "#4A1530",
    accent: "#E8A0B4",
    reward: "Pose offerte après 10 tampons",
    features: ["Prise de RDV en ligne", "Carte récompenses", "Galerie de créations"],
    desc: "Un salon de manucure élégant avec prise de rendez-vous intégrée, galerie de créations et programme de récompenses pour fidéliser sa clientèle.",
    stamps: 4,
  },
  {
    emoji: "🧖",
    name: "Éclat Spa",
    type: "Spa & bien-être",
    city: "Lausanne",
    slug: "/demo/spa",
    color: "#2C4A3E",
    accent: "#8FBF9F",
    reward: "Soin visage offert",
    features: ["Roue de la fortune", "Carte fidélité soins", "Réservation en ligne"],
    desc: "Un spa bien-être à Lausanne avec roue de la fortune (toujours gagnante), carte fidélité pour les soins et réservation en ligne intégrée.",
    stamps: 6,
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
          <p style={{ fontSize: 18, color: "#6B6259", lineHeight: 1.65, margin: "0 0 12px 0" }}>
            Des exemples réels livrés à des commerçants en Suisse romande. À vos couleurs, à votre nom, en 48h.
          </p>
        </div>
      </section>

      {/* Demo grid */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
            {demos.map((d) => (
              <div
                key={d.slug}
                style={{ background: "white", border: "1px solid #E2D9CC", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column" }}
              >
                {/* Card header */}
                <div style={{ background: d.color, padding: "28px 28px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 36 }}>{d.emoji}</div>
                      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: "white", marginTop: 8 }}>{d.name}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{d.type} · {d.city}</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                      Démo
                    </div>
                  </div>
                  {/* Mini stamp card */}
                  <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>{d.reward}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          style={{ width: 22, height: 22, borderRadius: "50%", background: i < d.stamps ? d.accent : "rgba(255,255,255,0.15)", border: "1.5px solid " + (i < d.stamps ? d.accent : "rgba(255,255,255,0.2)"), display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          {i < d.stamps && <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3.5 8l3 3L12.5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "24px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <p style={{ fontSize: 14, color: "#6B6259", lineHeight: 1.65, margin: "0 0 20px 0", flex: 1 }}>{d.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                    {d.features.map((f) => (
                      <span key={f} style={{ background: "#EEF0FC", color: "#3D31B0", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 999 }}>{f}</span>
                    ))}
                  </div>
                  <Link
                    href={d.slug}
                    style={{ display: "block", background: "#3D31B0", color: "white", padding: "12px", borderRadius: 10, textAlign: "center", fontWeight: 600, fontSize: 14, textDecoration: "none" }}
                  >
                    Voir la démo interactive →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "Your business" CTA */}
      <section style={{ background: "white", padding: "80px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>Votre commerce</div>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, color: "#1A1410", margin: "0 0 16px 0", letterSpacing: "-0.02em" }}>
            Votre commerce n&apos;est pas dans la liste ?
          </h2>
          <p style={{ fontSize: 16, color: "#6B6259", lineHeight: 1.7, margin: "0 0 32px 0" }}>
            On fait des sites pour tous les commerces locaux en Suisse romande : fleuristes, pharmacies, boutiques, kinésithérapeutes, coiffeurs, tatoueurs... Contactez-nous et on vous montre ce qu&apos;on ferait pour vous spécifiquement.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={WA_OBTENIR} style={{ display: "inline-block", background: "#3D31B0", color: "white", padding: "16px 32px", borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
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
