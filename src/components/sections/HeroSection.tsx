"use client";

import Link from "next/link";
import PhoneMockup from "@/components/PhoneMockup";
import { useEffect, useState } from "react";

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop",
];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section id="produit" style={{
      background: "#FFFFFF",
      position: "relative",
      overflow: "hidden",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      paddingTop: 68,
    }}>
      <style>{`
        @keyframes drift {
          0%   { transform: translate(0px, 0px) rotate(0deg); }
          25%  { transform: translate(8px, -12px) rotate(2deg); }
          50%  { transform: translate(-6px, 8px) rotate(-1deg); }
          75%  { transform: translate(10px, 4px) rotate(3deg); }
          100% { transform: translate(0px, 0px) rotate(0deg); }
        }
        @keyframes heroBadgeFadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroBadgeFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroBadgeFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes pingGreen {
          0%   { transform: scale(1); opacity: 0.9; }
          100% { transform: scale(2); opacity: 0; }
        }
        .hero-cta-primary {
          background: #1d9e75;
          color: #fff;
          border-radius: 10px;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 16px;
          font-weight: 500;
          padding: 16px 28px;
          text-decoration: none;
          display: inline-block;
          transition: background 0.15s, transform 0.15s;
        }
        .hero-cta-primary:hover { background: #0d7a5a; transform: scale(1.02); }
        .hero-cta-secondary {
          color: #1d9e75;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 16px;
          font-weight: 500;
          text-decoration: underline;
          text-decoration-color: transparent;
          transition: text-decoration-color 0.15s;
        }
        .hero-cta-secondary:hover { text-decoration-color: #1d9e75; }
        .hero-cta-primary:active, .hero-cta-secondary:active { transform: scale(0.95) !important; }
        @media (max-width: 640px) {
          .hero-badge-float { display: none !important; }
          .hero-left-col { flex: none !important; max-width: 100% !important; padding-right: 0 !important; }
          .hero-title { font-size: 38px !important; line-height: 1.15 !important; }
          .hero-subtitle { font-size: 16px !important; max-width: 100% !important; }
          .hero-ctas-wrap { flex-direction: column !important; gap: 12px !important; }
          .hero-cta-primary { width: 100% !important; text-align: center !important; min-height: 44px; display: flex !important; align-items: center; justify-content: center; }
          .hero-cta-secondary { width: 100% !important; text-align: center !important; min-height: 44px; display: flex !important; align-items: center; justify-content: center; }
          .hero-phone-inner { max-width: 260px !important; }
          .hero-phone-shadow { display: block; width: 120px; height: 20px; background: radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, transparent 70%); filter: blur(8px); margin: 0 auto; }
          .hero-social-proof { flex-wrap: wrap !important; justify-content: center !important; }
        }
      `}</style>

      {/* SVG background drift shapes */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <svg style={{ position: "absolute", top: "8%", right: "5%", animation: "drift 18s infinite" }} width="240" height="240" viewBox="0 0 240 240" fill="none">
          <circle cx="120" cy="120" r="119" stroke="#1d9e75" strokeWidth="1" opacity="0.04"/>
        </svg>
        <svg style={{ position: "absolute", bottom: "10%", left: "3%", animation: "drift 24s infinite reverse" }} width="160" height="160" viewBox="0 0 160 160" fill="none">
          <circle cx="80" cy="80" r="79" stroke="#1d9e75" strokeWidth="1" opacity="0.03"/>
        </svg>
        <svg style={{ position: "absolute", top: "40%", left: "20%", animation: "drift 20s infinite" }} width="200" height="2" viewBox="0 0 200 2">
          <line x1="0" y1="1" x2="200" y2="1" stroke="#1d9e75" strokeWidth="1" opacity="0.03"/>
        </svg>
        <svg style={{ position: "absolute", top: "20%", right: "25%", animation: "drift 28s infinite reverse" }} width="80" height="80" viewBox="0 0 80 80" fill="none">
          <polygon points="40,4 76,28 76,60 40,76 4,60 4,28" stroke="#1d9e75" strokeWidth="1" opacity="0.03"/>
        </svg>
        <svg style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-20%, -50%)", animation: "drift 32s infinite" }} width="400" height="400" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="199" stroke="#1d9e75" strokeWidth="1" opacity="0.02"/>
        </svg>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", position: "relative", zIndex: 1, width: "100%" }}>
        <div className="hero-split" style={{ display: "flex", alignItems: "center", gap: 64 }}>
          {/* Left column */}
          <div className="hero-left-col" style={{ flex: "0 0 55%", maxWidth: "55%", paddingRight: 0 }}>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#E8F8F3", color: "#1d9e75",
              borderRadius: 50, padding: "6px 14px",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13, fontWeight: 500,
              marginBottom: 24,
              animation: mounted ? "heroBadgeFadeDown 0.5s ease both" : "none",
            }}>
              <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8, flexShrink: 0 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#1d9e75", animation: "pingGreen 1.8s ease-out infinite" }} />
                <span style={{ position: "relative", display: "block", width: "100%", height: "100%", borderRadius: "50%", background: "#1d9e75" }} />
              </span>
              Carte fidélité digitale · Suisse romande
            </div>

            {/* H1 */}
            <h1 className="hero-title" style={{
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 900,
              fontSize: "clamp(42px, 5.5vw, 68px)",
              lineHeight: 1.1,
              color: "#0f172a",
              marginBottom: 20,
              animation: mounted ? "heroBadgeFadeDown 0.6s 0.1s ease both" : "none",
            }}>
              Tes clients reviennent.<br />
              <span style={{ color: "#1d9e75" }}>Sans carte papier.</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle" style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 19,
              color: "#64748b",
              lineHeight: 1.7,
              maxWidth: 460,
              marginBottom: 32,
              animation: mounted ? "heroBadgeFadeDown 0.6s 0.2s ease both" : "none",
            }}>
              Stampify donne à ton commerce une carte fidélité sur smartphone, un site vitrine soigné et un SEO local qui te fait trouver. En 48h, tout est prêt.
            </p>

            {/* CTAs */}
            <div className="hero-ctas-wrap" style={{
              display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
              marginBottom: 28,
              animation: mounted ? "heroBadgeFadeDown 0.6s 0.3s ease both" : "none",
            }}>
              <Link href="/#tarif" className="hero-cta-primary">
                Démarrer maintenant
              </Link>
              <Link href="/demos" className="hero-cta-secondary">
                Voir une démo →
              </Link>
            </div>

            {/* Social proof */}
            <div className="hero-social-proof" style={{
              display: "flex", alignItems: "center", gap: 12,
              animation: mounted ? "heroBadgeFadeDown 0.6s 0.4s ease both" : "none",
            }}>
              <div style={{ display: "flex" }}>
                {AVATARS.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt="" width={32} height={32}
                    style={{
                      borderRadius: "50%",
                      border: "2px solid #fff",
                      marginLeft: i === 0 ? 0 : -8,
                      objectFit: "cover",
                    }}
                  />
                ))}
              </div>
              <span style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 13, color: "#94a3b8",
              }}>
                40+ commerçants romands · Genève · Lausanne · Fribourg
              </span>
            </div>
          </div>

          {/* Right column */}
          <div className="hero-img-col" style={{ flex: 1, position: "relative", display: "flex", justifyContent: "center" }}>
            <div className="hero-phone-inner" style={{ position: "relative" }}>
              <PhoneMockup />

              {/* Badge 1 — top right */}
              <div className="hero-badge-float" style={{
                position: "absolute",
                top: -20, right: -60,
                background: "#fff",
                borderRadius: 12,
                padding: "10px 14px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 13,
                color: "#374151",
                display: "flex", alignItems: "center", gap: 6,
                animation: mounted ? "heroBadgeFadeDown 0.4s 1s ease both, badgeFloat 3.5s 1.4s ease-in-out infinite" : "none",
              }}>
                <span style={{ color: "#1d9e75", fontWeight: 700 }}>✓</span>
                Tampon ajouté — Café Lumière
              </div>

              {/* Badge 2 — bottom left */}
              <div className="hero-badge-float" style={{
                position: "absolute",
                bottom: 60, left: -60,
                background: "#1d9e75",
                borderRadius: 12,
                padding: "10px 14px",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 13,
                color: "#fff",
                fontWeight: 500,
                animation: mounted ? "heroBadgeFadeUp 0.4s 1.4s ease both, badgeFloat 4s 1.8s ease-in-out infinite reverse" : "none",
              }}>
                67% de retour client
              </div>

              {/* Badge 3 — bottom right */}
              <div className="hero-badge-float" style={{
                position: "absolute",
                bottom: -20, right: -40,
                background: "#fff",
                borderRadius: 12,
                padding: "8px 12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 12,
                color: "#374151",
                display: "flex", alignItems: "center", gap: 6,
                animation: mounted ? "heroBadgeFadeIn 0.4s 1.8s ease both" : "none",
              }}>
                <span style={{ color: "#f59e0b" }}>⚡</span>
                En ligne en 48h
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
