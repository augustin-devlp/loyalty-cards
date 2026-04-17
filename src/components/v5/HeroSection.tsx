"use client";

import { useRef } from "react";
import Link from "next/link";
import HeroCanvas from "./HeroCanvas";
import DashboardMockup from "./DashboardMockup";
import { useTilt } from "@/hooks/v2/useTilt";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const { elementRef: mockupRef, handleMouseMove, handleMouseLeave } = useTilt(7, 1200);

  return (
    <section
      ref={heroRef}
      style={{
        position: "relative",
        overflow: "hidden",
        // ITER 10 — fond légèrement plus profond aux bords pour que les orbs
        // verts ressortent davantage (comme handhold.io : blanc pur au centre,
        // légèrement vert-foncé aux bords).
        // ITER 23 — nappe verte subtile en haut (reinforcement orb[0] dominant)
        // ITER 44 — 2ème nappe top-droite (reinforcement orb[1]+orb[3] haut-droit)
        background: [
          "radial-gradient(70% 55% at 50% 0%, rgba(29,158,117,0.075) 0%, transparent 100%)", // ITER 48: 0.055→0.075
          "radial-gradient(38% 32% at 82% 8%, rgba(29,158,117,0.030) 0%, transparent 100%)",
          "radial-gradient(140% 90% at 50% 38%, #FDFFFE 0%, #F3F9F5 40%, #E6F1EA 100%)",
        ].join(", "),
        padding: "100px 24px",
        minHeight: 640, // ITER 42: hauteur minimale stable pour canvas proportions
      }}
      onMouseMove={handleMouseMove as React.MouseEventHandler<HTMLElement>}
      onMouseLeave={handleMouseLeave}
    >
      <HeroCanvas />

      <div className="v2-hero-grid" style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "55% 45%",
        gap: 80, alignItems: "center",
        position: "relative", zIndex: 1,
      }}>
        {/* Left - text */}
        <div>
          {/* Badge with ping */}
          <div className="v2-hero-badge" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#E8F7F2", border: "1px solid rgba(29,158,117,0.25)",
            borderRadius: 980, padding: "6px 14px 6px 10px",
            marginBottom: 24,
          }}>
            <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8, flexShrink: 0 }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#1d9e75", animation: "pingPulse 1.8s ease-out infinite" }} />
              <span style={{ position: "relative", display: "block", width: "100%", height: "100%", borderRadius: "50%", background: "#1d9e75" }} />
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#1d9e75" }}>Livraison en 48h garantie</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: "clamp(36px,5.5vw,72px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 24 }}>
            <span className="v2-hero-line v2-hero-line-1" style={{ display: "block" }}>Vos clients</span>
            <span className="v2-hero-line v2-hero-line-2" style={{ display: "block" }}>
              <span className="v2-underline-word">reviennent.</span>
            </span>
            <span className="v2-hero-line v2-hero-line-3" style={{ display: "block" }}>À chaque fois.</span>
          </h1>

          {/* Subtitle */}
          <p className="v2-hero-subtitle" style={{ fontSize: "clamp(16px,1.5vw,19px)", fontWeight: 400, lineHeight: 1.65, color: "#6B7280", maxWidth: 460, marginBottom: 40 }}>
            Site vitrine professionnel + carte fidélité digitale + plaquette NFC gravée en bois.
            990 CHF, une fois. Livré en 48 heures.
          </p>

          {/* CTAs */}
          <div className="v2-hero-btns" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
            <Link href="/v5/subscribe" style={{
              display: "inline-flex", alignItems: "center",
              background: "#1d9e75", color: "#fff",
              borderRadius: 980, height: 52, padding: "0 28px",
              fontSize: 15, fontWeight: 600, textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background="#0D7A5A"; e.currentTarget.style.transform="translateY(-1.5px)"; e.currentTarget.style.boxShadow="0 4px 12px rgba(29,158,117,0.28),0 8px 24px rgba(29,158,117,0.18)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#1d9e75"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
              onMouseDown={e => { e.currentTarget.style.transform="translateY(0) scale(0.975)"; e.currentTarget.style.boxShadow="0 1px 4px rgba(29,158,117,0.15)"; }}
            >
              Obtenir mon site → 990 CHF
            </Link>
            <Link href="/v5/demos" style={{
              display: "inline-flex", alignItems: "center",
              background: "transparent", color: "#0A0A0A",
              border: "1.5px solid #E5E7EB",
              borderRadius: 980, height: 52, padding: "0 24px",
              fontSize: 15, fontWeight: 500, textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "border-color 0.2s, color 0.2s, background 0.2s, transform 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="#1d9e75"; e.currentTarget.style.color="#1d9e75"; e.currentTarget.style.background="rgba(29,158,117,0.04)"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.color="#0A0A0A"; e.currentTarget.style.background="transparent"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              Voir les démos →
            </Link>
          </div>

          {/* Metrics */}
          <p className="v2-hero-metrics" style={{ fontSize: 13, color: "#9CA3AF" }}>
            990 CHF · Paiement unique · 48h garanties · 100% propriétaire
          </p>

          {/* Social proof */}
          <div className="v2-hero-social" style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "linear-gradient(135deg,#1d9e75,#0D7A5A)",
              color: "#fff", fontSize: 14, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>SM</div>
            <div>
              <p style={{ fontSize: 14, color: "#6B7280", fontStyle: "italic", lineHeight: 1.5 }}>
                &ldquo;Stampify m&rsquo;a livré en 2 jours ce que j&rsquo;ai abandonné après 3h sur Wix.&rdquo;
              </p>
              <p style={{ fontSize: 13, color: "#F59E0B", marginTop: 2 }}>★★★★★</p>
            </div>
          </div>
        </div>

        {/* Right - mockup with tilt */}
        <div
          ref={mockupRef}
          style={{ display: "flex", justifyContent: "flex-end", willChange: "transform", transformStyle: "preserve-3d" }}
        >
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
