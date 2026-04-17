const testimonials = [
  {
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=44&h=44&fit=crop",
    quote: "Mes clients scannent à chaque visite. J'ai arrêté les cartes papier il y a 6 mois — je ne reviens pas en arrière.",
    name: "Marie-Claire D.",
    shop: "Boulangerie Artisane · Lausanne",
  },
  {
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=44&h=44&fit=crop",
    quote: "En 48h mon site était en ligne. Augustin a tout géré, je n'ai eu qu'à valider les textes.",
    name: "Karim B.",
    shop: "Best Cut Barbershop · Genève",
  },
  {
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=44&h=44&fit=crop",
    quote: "La carte fidélité a changé quelque chose. Les gens reviennent exprès pour compléter leurs tampons.",
    name: "Sophie L.",
    shop: "Café Lumière · Fribourg",
  },
];

const STARS = (
  <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="#1d9e75">
        <path d="M8 1l1.76 3.57 3.94.57-2.85 2.78.67 3.92L8 9.77l-3.52 1.85.67-3.92L2.3 4.9l3.94-.57z"/>
      </svg>
    ))}
  </div>
);

export default function TestimonialsSection() {
  return (
    <section style={{ background: "#FBF8F3", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 2, background: "#1d9e75" }} />
            <span style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 11, fontWeight: 500,
              color: "#1d9e75",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>ILS TÉMOIGNENT</span>
            <div style={{ width: 32, height: 2, background: "#1d9e75" }} />
          </div>
          <h2 style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 3.5vw, 44px)",
            color: "#0f172a",
            lineHeight: 1.2,
          }}>
            Des commerçants romands qui ont fait le pas.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{
              background: "#fff",
              borderRadius: 16,
              padding: 32,
              boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                fontFamily: "var(--font-fraunces), serif",
                fontStyle: "italic",
                fontSize: 64,
                color: "#E8F8F3",
                lineHeight: 0.8,
                marginBottom: 16,
                userSelect: "none",
              }}>&ldquo;</div>

              {STARS}

              <p style={{
                fontFamily: "var(--font-fraunces), serif",
                fontStyle: "italic",
                fontSize: 18,
                color: "#0f172a",
                lineHeight: 1.6,
                marginBottom: 20,
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  width={44} height={44}
                  style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 14, fontWeight: 500, color: "#0f172a" }}>
                    {t.name}
                  </div>
                  <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#94a3b8" }}>
                    {t.shop}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
