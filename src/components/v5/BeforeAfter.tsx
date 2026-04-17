"use client";

import { useEffect, useRef } from "react";

const ROWS = [
  { label: "Carte fidélité", before: "Papier, souvent perdue", after: "Digitale, toujours sur le téléphone" },
  { label: "Site web", before: "Inexistant ou dépassé", after: "Professionnel, livré en 48h" },
  { label: "Visibilité Google", before: "Invisible localement", after: "SEO local optimisé, Google Maps" },
  { label: "Rappel clients", before: "Aucun outil disponible", after: "SMS & push automatiques" },
  { label: "Plaquette NFC", before: "Pas de solution simple", after: "Bois gravé, livré en 5 jours" },
  { label: "Coût total", before: "Agence : 3 000–8 000 CHF", after: "Stampify : 990 CHF tout inclus" },
];

export default function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("v2-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="v2-animate">
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span style={{ display: "inline-block", background: "#E8F7F2", border: "1px solid rgba(29,158,117,0.2)", borderRadius: 980, padding: "4px 12px", fontSize: 13, fontWeight: 500, color: "#1d9e75", marginBottom: 16 }}>Avant / Après</span>
        <h2 style={{ fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>
          La différence est évidente.
        </h2>
        <p style={{ fontSize: 16, color: "#6B7280" }}>
          Comparez ce que vous avez aujourd&rsquo;hui avec ce que Stampify vous offre.
        </p>
      </div>

      <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #E5E7EB" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.06em", textTransform: "uppercase" }}>Aspect</div>
          <div style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#EF4444", letterSpacing: "0.06em", textTransform: "uppercase", borderLeft: "1px solid #E5E7EB" }}>❌ Sans Stampify</div>
          <div style={{ padding: "14px 20px", fontSize: 12, fontWeight: 600, color: "#1d9e75", letterSpacing: "0.06em", textTransform: "uppercase", borderLeft: "1px solid #E5E7EB" }}>✅ Avec Stampify</div>
        </div>

        {ROWS.map((row, i) => (
          <div key={row.label} style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            borderBottom: i < ROWS.length - 1 ? "1px solid #E5E7EB" : "none",
            background: i % 2 === 0 ? "#fff" : "#FAFAFA",
          }}>
            <div style={{ padding: "16px 20px", fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>{row.label}</div>
            <div style={{ padding: "16px 20px", fontSize: 14, color: "#9CA3AF", borderLeft: "1px solid #E5E7EB" }}>{row.before}</div>
            <div style={{ padding: "16px 20px", fontSize: 14, color: "#1d9e75", fontWeight: 500, borderLeft: "1px solid #E5E7EB" }}>{row.after}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
