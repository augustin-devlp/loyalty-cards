"use client";

const BADGES = [
  "☕ Café Lumière · Genève",
  "🥐 Boulangerie Martin · Lausanne",
  "✂️ Black Scissors · Fribourg",
  "🧖 Spa Essence · Genève",
  "💅 Nail Studio Rose · Lausanne",
  "🍽️ Le Comptoir · Neuchâtel",
  "☕ Le Torréfacteur · Vevey",
  "💆 Institut Belle Peau · Sion",
];

export default function MarqueeBar() {
  return (
    <section style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB", padding: "20px 0" }}>
      <p style={{ textAlign: "center", fontSize: 12, fontWeight: 500, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
        Ils nous font confiance pour leur présence digitale
      </p>
      <div style={{ overflow: "hidden", position: "relative" }}>
        {/* Fade masks */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 80, zIndex: 1,
          background: "linear-gradient(to right, #F9FAFB, transparent)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 80, zIndex: 1,
          background: "linear-gradient(to left, #F9FAFB, transparent)",
          pointerEvents: "none",
        }} />

        <div
          style={{ display: "flex", gap: 16, animation: "v2-marquee 30s linear infinite", width: "max-content" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = "running"; }}
        >
          {[...BADGES, ...BADGES].map((badge, i) => (
            <div key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff", border: "1px solid #E5E7EB",
              borderRadius: 980, padding: "8px 16px",
              whiteSpace: "nowrap", fontSize: 13, fontWeight: 500, color: "#374151",
              flexShrink: 0,
            }}>
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
