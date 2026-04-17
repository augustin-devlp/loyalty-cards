"use client";

import Link from "next/link";
import { useState } from "react";

const CHECK = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="9" cy="9" r="9" fill="#E8F8F3"/>
    <path d="M5 9l3 3 5-5" stroke="#1d9e75" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function SpaPreviewSection() {
  const [iframeError, setIframeError] = useState(false);

  return (
    <section style={{ background: "#fff", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 80 }}>
        {/* Text left */}
        <div style={{ flex: "0 0 40%", maxWidth: "40%" }}>
          <div style={{
            width: 40, height: 2, background: "#1d9e75", marginBottom: 12,
          }} />
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

        {/* Browser mockup right */}
        <div style={{ flex: 1 }}>
          <div style={{
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
                overflow: "hidden", whiteSpace: "nowrap",
              }}>
                lessence-spa.stampify.ch
              </div>
            </div>

            {iframeError ? (
              <div style={{
                background: "#f9fafb",
                height: 460,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"
                  alt="L'Essence Spa"
                  style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }}
                />
                <a
                  href="https://loyalty-cards-rho.vercel.app/lessence-spa.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    position: "relative",
                    background: "#1d9e75",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "12px 24px",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontWeight: 500,
                    textDecoration: "none",
                    zIndex: 1,
                  }}
                >
                  Ouvrir en direct →
                </a>
              </div>
            ) : (
              <iframe
                src="https://loyalty-cards-rho.vercel.app/lessence-spa.html"
                width="100%"
                height="460"
                style={{ border: "none", display: "block" }}
                loading="lazy"
                scrolling="no"
                onError={() => setIframeError(true)}
                title="L'Essence Spa — démo Stampify"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
