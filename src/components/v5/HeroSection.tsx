"use client";

import { useRef } from "react";
import Link from "next/link";
import PhoneMockup from "./PhoneMockup";

/**
 * v5 Hero — ITER 90 : mockup iPhone central, fond blanc minimaliste.
 *
 * Inspiration : topanga.io, searchable.com, karumi.ai
 * - fond #FFFFFF avec halo vert extrêmement discret derrière le phone
 * - texte à gauche, phone flottant à droite
 * - aucun canvas, aucun orb, aucun beam
 * - typographie claire et respirante
 * - CTA primaire teal plein, secondaire outline
 */
export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#FFFFFF",
        padding: "120px 24px 96px",
        minHeight: 720,
        color: "#0A2218",
      }}
    >
      {/* Halo vert très discret derrière le phone pour donner de la profondeur */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "10%",
          right: "-8%",
          width: "48%",
          height: "90%",
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(29,158,117,0.10) 0%, rgba(29,158,117,0.04) 40%, transparent 75%)",
          filter: "blur(40px)",
        }}
      />

      <div className="v2-hero-grid" style={{
        maxWidth: 1180, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 72, alignItems: "center",
        position: "relative", zIndex: 1,
      }}>
        {/* LEFT — text */}
        <div>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#E8F7F2",
            border: "1px solid rgba(29,158,117,0.2)",
            borderRadius: 980, padding: "6px 14px 6px 10px",
            marginBottom: 28,
          }}>
            <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8, flexShrink: 0 }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#1d9e75", animation: "pingPulse 1.8s ease-out infinite" }} />
              <span style={{ position: "relative", display: "block", width: "100%", height: "100%", borderRadius: "50%", background: "#1d9e75" }} />
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#0D7A5A" }}>Livraison en 48h garantie</span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: "clamp(38px, 5.2vw, 68px)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.06,
            marginBottom: 24,
            color: "#0A2218",
          }}>
            Vos clients<br />
            <span style={{
              background: "linear-gradient(90deg, #1d9e75 0%, #3EE5A8 50%, #1d9e75 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}>reviennent.</span>
            <br />
            À chaque fois.
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: "clamp(16px, 1.5vw, 19px)",
            fontWeight: 400,
            lineHeight: 1.6,
            color: "#4A5A52",
            maxWidth: 480,
            marginBottom: 40,
          }}>
            Site vitrine professionnel + carte fidélité digitale + plaquette NFC gravée en bois.
            <span style={{ color: "#0A2218", fontWeight: 600 }}> 990 CHF, une fois.</span> Livré en 48 heures.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
            <Link href="/v5/subscribe" style={{
              display: "inline-flex", alignItems: "center",
              background: "#1d9e75", color: "#fff",
              borderRadius: 980, height: 52, padding: "0 28px",
              fontSize: 15, fontWeight: 600, textDecoration: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 1px 0 rgba(255,255,255,0.2) inset, 0 6px 18px -4px rgba(29,158,117,0.45)",
              transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#0D7A5A"; e.currentTarget.style.transform = "translateY(-1.5px)"; e.currentTarget.style.boxShadow = "0 1px 0 rgba(255,255,255,0.2) inset, 0 10px 24px -4px rgba(29,158,117,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#1d9e75"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 0 rgba(255,255,255,0.2) inset, 0 6px 18px -4px rgba(29,158,117,0.45)"; }}
              onMouseDown={e => { e.currentTarget.style.transform = "translateY(0) scale(0.975)"; }}
            >
              Obtenir mon site → 990 CHF
            </Link>
            <Link href="/v5/demos" style={{
              display: "inline-flex", alignItems: "center",
              background: "transparent", color: "#0A2218",
              border: "1.5px solid #D9E2DD",
              borderRadius: 980, height: 52, padding: "0 24px",
              fontSize: 15, fontWeight: 500, textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "border-color 0.2s, color 0.2s, background 0.2s, transform 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#1d9e75"; e.currentTarget.style.color = "#1d9e75"; e.currentTarget.style.background = "rgba(29,158,117,0.04)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#D9E2DD"; e.currentTarget.style.color = "#0A2218"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Voir les démos →
            </Link>
          </div>

          {/* Metrics */}
          <p style={{ fontSize: 13, color: "#8A988F", marginBottom: 28 }}>
            990 CHF · Paiement unique · 48h garanties · 100% propriétaire
          </p>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "linear-gradient(135deg,#3EE5A8,#1d9e75)",
              color: "#fff", fontSize: 14, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(29,158,117,0.25)",
            }}>SM</div>
            <div>
              <p style={{ fontSize: 14, color: "#4A5A52", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
                &ldquo;Stampify m&rsquo;a livré en 2 jours ce que j&rsquo;ai abandonné après 3h sur Wix.&rdquo;
              </p>
              <p style={{ fontSize: 13, color: "#F59E0B", marginTop: 2, marginBottom: 0 }}>★★★★★</p>
            </div>
          </div>
        </div>

        {/* RIGHT — phone mockup */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 600,
        }}>
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
