"use client";

import Link from "next/link";

const CHECK = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="9" cy="9" r="9" fill="#E8F8F3"/>
    <path d="M5 9l3 3 5-5" stroke="#1d9e75" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Facteur de dézoom : le site est rendu à 65% → on voit plus de contenu
const SCALE = 0.65;

export default function SpaPreviewSection() {
  return (
    <section style={{ background: "#fff", padding: "120px 24px" }}>
      <style>{`
        .spa-iframe-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 0 0 8px 8px;
          /* hauteur visuelle souhaitée */
          height: 480px;
        }
        .spa-iframe-wrap iframe {
          width: ${Math.round(100 / SCALE)}%;
          height: ${Math.round(480 / SCALE)}px;
          border: none;
          display: block;
          transform: scale(${SCALE});
          transform-origin: top left;
          pointer-events: auto;
        }
        @media (max-width: 768px) {
          .spa-iframe-wrap { height: 320px; overflow: hidden; }
          .spa-iframe-wrap iframe {
            width: 100% !important;
            height: 500px !important;
            transform: none !important;
            pointer-events: none;
          }
          .spa-row { flex-direction: column !important; gap: 32px !important; }
          .spa-text-col { flex: none !important; max-width: 100% !important; }
          .spa-browser-frame { overflow: hidden !important; max-width: 100% !important; }
        }
      `}</style>

      <div className="spa-row" style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 80 }}>
        {/* Texte gauche */}
        <div className="spa-text-col" style={{ flex: "0 0 40%", maxWidth: "40%" }}>
          <div style={{ width: 40, height: 2, background: "#1d9e75", marginBottom: 12 }} />
          <p style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 11, fontWeight: 500,
            color: "#1d9e75",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}>EXEMPLE CONCRET</p>

          <h2 style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 3vw, 40px)",
            color: "#0f172a",
            lineHeight: 1.2,
            marginBottom: 20,
          }}>
            Un vrai site livré en 48h.
          </h2>

          <p style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 16,
            color: "#64748b",
            lineHeight: 1.8,
            marginBottom: 24,
          }}>
            Voici L&rsquo;Essence Spa à Lausanne — site vitrine, carte fidélité et SEO local, livré en 48h pour 990 CHF. Résultat visible, client satisfait.
          </p>

          {[
            "Site 5 pages complet et responsive",
            "Carte fidélité 10 tampons intégrée",
            "En ligne en moins de 48h",
          ].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
              {CHECK}
              <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 15, fontWeight: 500, color: "#374151" }}>
                {item}
              </span>
            </div>
          ))}

          <Link href="/demos" style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 15, fontWeight: 500,
            color: "#1d9e75",
            textDecoration: "none",
            display: "inline-block",
            marginTop: 8,
            borderBottom: "1px solid #1d9e75",
            paddingBottom: 2,
          }}>
            Voir toutes les démos →
          </Link>
        </div>

        {/* Browser mockup droite — iframe interactive */}
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <div className="spa-browser-frame" style={{
            borderRadius: "12px 12px 8px 8px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.08), 0 40px 80px rgba(0,0,0,0.06)",
          }}>
            {/* Chrome bar */}
            <div style={{
              height: 36,
              background: "#E8E8E8",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              gap: 8,
              flexShrink: 0,
            }}>
              <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                {["#ef4444","#f59e0b","#22c55e"].map((c,i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{
                flex: 1, background: "#fff", borderRadius: 6,
                height: 22, display: "flex", alignItems: "center",
                paddingLeft: 10, fontSize: 11,
                color: "#9ca3af",
                fontFamily: "var(--font-dm-sans), sans-serif",
              }}>
                stampify.ch/demos/lessence-spa
              </div>
              <a
                href="/lessence-spa.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: 11, color: "#1d9e75",
                  textDecoration: "none",
                  flexShrink: 0,
                  padding: "2px 8px",
                  background: "#E8F8F3",
                  borderRadius: 4,
                }}
              >
                ↗ Ouvrir
              </a>
            </div>

            {/* iframe interactive + dezoomée */}
            <div className="spa-iframe-wrap">
              <iframe
                src="/lessence-spa.html"
                title="L'Essence Spa — démo Stampify"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
