"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const FEATURES = [
  "Site vitrine 5 pages professionnel",
  "Domaine .ch ou .fr inclus (1 an)",
  "Hébergement inclus (1 an)",
  "Carte fidélité digitale QR code",
  "Plaquette NFC en bois gravée",
  "SEO local optimisé Google Maps",
  "Dashboard clients temps réel",
  "Campagnes SMS & push (1 offerte)",
  "Formation 30 min incluse",
  "Support WhatsApp 7j/7",
];

const COMPARISONS = [
  {
    label: "Agence classique",
    price: "3 000–8 000 CHF",
    color: "#EF4444",
    bg: "#FEF2F2",
    border: "#FECACA",
    icon: "❌",
  },
  {
    label: "DIY (Wix / Squarespace)",
    price: "200–500 CHF/an + votre temps",
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
    icon: "⚠️",
  },
  {
    label: "Stampify",
    price: "990 CHF · Paiement unique",
    color: "#1d9e75",
    bg: "#E8F7F2",
    border: "rgba(29,158,117,0.3)",
    icon: "✅",
  },
];

export default function PricingCard() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".v2-animate").forEach(e => e.classList.add("v2-visible"));
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="v2-pricing-grid"
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}
    >
      {/* LEFT: Pricing card */}
      <div
        className="v2-animate v2-d1"
        data-animate="scale-spring"
        style={{
          border: "2px solid #1d9e75",
          borderRadius: 20, padding: 36,
          background: "#fff",
          boxShadow: "0 16px 64px rgba(29,158,117,0.12)",
          position: "relative",
          overflow: "hidden",
          animation: "pricingBreath 3.5s ease-in-out infinite",
          animationDelay: "-1s",
        }}
      >
        {/* Shimmer effect on reveal */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.26) 50%,transparent 100%)", animation: "pricingShimmer 0.9s ease-out 1 forwards", animationDelay: "0.85s", width: "55%", top: 0, bottom: 0, left: 0, pointerEvents: "none", zIndex: 20 }} />
        {/* Badge */}
        <div style={{
          display: "inline-block",
          background: "#1d9e75", color: "#fff",
          borderRadius: 980, padding: "4px 14px",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
          textTransform: "uppercase", marginBottom: 24,
        }}>
          ⭐ LE FORFAIT UNIQUE
        </div>

        {/* Price */}
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#9CA3AF", textDecoration: "line-through" }}>1 490 CHF</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-0.05em", color: "#0A0A0A", lineHeight: 1 }}>990</span>
          <span style={{ fontSize: 24, fontWeight: 600, color: "#6B7280", paddingBottom: 8 }}>CHF</span>
        </div>
        <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28 }}>
          Paiement unique · Aucun abonnement · C&rsquo;est à vous pour toujours
        </p>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {FEATURES.map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                background: "#E8F7F2", color: "#1d9e75",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, flexShrink: 0,
              }}>✓</span>
              <span style={{ fontSize: 14, color: "#374151" }}>{f}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/v2/subscribe"
          style={{
            display: "block", textAlign: "center",
            background: "#1d9e75", color: "#fff",
            borderRadius: 12, padding: "16px 24px",
            fontSize: 16, fontWeight: 700,
            textDecoration: "none",
            transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#0D7A5A";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(29,158,117,0.35)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#1d9e75";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Obtenir mon site maintenant →
        </Link>
        <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", marginTop: 12 }}>
          📱 Réponse sous 2h · WhatsApp · 7j/7
        </p>
      </div>

      {/* RIGHT: Comparisons + add-on */}
      <div className="v2-animate v2-d2" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 8 }}>
          Comparez les options
        </h3>

        {COMPARISONS.map(c => (
          <div key={c.label} style={{
            background: c.bg, border: `1px solid ${c.border}`,
            borderRadius: 12, padding: "16px 20px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.color }}>{c.icon} {c.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A", marginTop: 4 }}>{c.price}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Add-on note */}
        <div style={{
          background: "#F9FAFB", border: "1px solid #E5E7EB",
          borderRadius: 12, padding: "20px",
          marginTop: 8,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A", marginBottom: 8 }}>
            🔄 Renouvellement annuel optionnel
          </div>
          <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
            Après la première année, domaine + hébergement : <strong>150 CHF/an</strong>.
            Pas d&rsquo;abonnement mensuel, jamais. Vos données restent les vôtres.
          </p>
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
          {["🔒 Paiement sécurisé", "📦 Livré en 48h", "💬 Support WhatsApp", "🇨🇭 Fait en Suisse"].map(b => (
            <span key={b} style={{
              fontSize: 12, fontWeight: 500, color: "#6B7280",
              background: "#F3F4F6", borderRadius: 980,
              padding: "4px 12px",
            }}>{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
