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
    <section
      data-animate="fade-up-sm"
      style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB", padding: "20px 0" }}
    >
      <p style={{ textAlign: "center", fontSize: 12, fontWeight: 500, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
        Ils nous font confiance pour leur présence digitale
      </p>
      <div style={{
        overflow: "hidden", position: "relative",
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}>
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
