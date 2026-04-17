"use client";

import BrandPattern from "@/components/BrandPattern";

const metrics = [
  { n: "67%", label: "taux de retour moyen", sub: "vs 32% sans fidélité" },
  { n: "4.8★", label: "satisfaction client", sub: "sur 140+ avis Google" },
  { n: "2×", label: "panier moyen", sub: "clients fidèles vs nouveaux" },
];

export default function MetricsSection() {
  return (
    <section style={{ background: "#0f1a15", position: "relative", overflow: "hidden", padding: "120px 24px" }}>
      <BrandPattern opacity={0.05} color="#1d9e75" />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 20,
          }}>
            <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.3)" }} />
            <span style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 11, fontWeight: 500,
              color: "#1d9e75",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>RÉSULTATS</span>
            <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.3)" }} />
          </div>

          <h2 style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 700,
            fontSize: "clamp(30px, 3.5vw, 44px)",
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: 16,
          }}>
            Les clients fidélisés reviennent<br />2 fois plus souvent.
          </h2>

          <p style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 17,
            color: "rgba(255,255,255,0.65)",
            maxWidth: 480,
            margin: "0 auto",
          }}>
            Données mesurées sur nos 40+ commerces partenaires.
          </p>
        </div>

        <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {metrics.map((m, i) => (
            <div key={i} data-animate="fadeUp" data-delay={String(i + 1)} style={{
              background: "#1a2b22",
              borderRadius: 20,
              padding: "32px 28px",
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 700,
                fontSize: "clamp(36px, 4vw, 52px)",
                color: "#1d9e75",
                lineHeight: 1,
                marginBottom: 10,
              }}>{m.n}</div>
              <div style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 16, fontWeight: 500,
                color: "#fff",
                marginBottom: 6,
              }}>{m.label}</div>
              <div style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.38)",
              }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
