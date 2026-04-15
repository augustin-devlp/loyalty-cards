"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

/* ── WhatsApp links ── */
const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";
const WA_ESSENTIEL =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20activer%20l%27add-on%20Essentiel%20%2849%20CHF%2Fmois%29%20pour%20mon%20site%20Stampify.";
const WA_PRO =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20activer%20l%27add-on%20Pro%20%2879%20CHF%2Fmois%29%20pour%20mon%20site%20Stampify.";

/* ── Unsplash images (hardcoded, no API call needed) ── */
const HERO_IMG = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80";
const CTA_BG   = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=80";

/* ── Shared styles ── */
const inner: React.CSSProperties = { maxWidth: "860px", margin: "0 auto" };
const sectionPad = (bg: string, pt = 180, pb = 180): React.CSSProperties => ({
  background: bg,
  padding: `${pt}px 20px ${pb}px`,
});

const pillDark: React.CSSProperties = {
  display: "inline-block",
  background: "#1d1d1f",
  color: "#ffffff",
  borderRadius: "980px",
  padding: "14px 28px",
  fontSize: "17px",
  fontWeight: 500,
  textDecoration: "none",
  transition: "transform 0.2s ease",
  cursor: "pointer",
};

const pillBlue: React.CSSProperties = {
  display: "inline-block",
  background: "transparent",
  color: "#0071e3",
  border: "1px solid #0071e3",
  borderRadius: "980px",
  padding: "14px 28px",
  fontSize: "17px",
  fontWeight: 500,
  textDecoration: "none",
  transition: "background 0.2s ease, transform 0.2s ease",
  cursor: "pointer",
};

const iconStroke = {
  stroke: "#0071e3",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

/* ── Word-by-word animated title ── */
function AnimatedTitle({ text, style }: { text: string; style?: React.CSSProperties }) {
  const words = text.split(" ");
  return (
    <h1 style={style}>
      {words.map((word, i) => (
        <span
          key={i}
          className="word-anim"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {word}{i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </h1>
  );
}

/* ── MacBook V3 (with trackpad, Apple logo glow, screen reflection) ── */
function MacBookV3({ img }: { img: string }) {
  return (
    <div style={{ maxWidth: "800px", width: "100%", margin: "0 auto" }}>
      {/* Lid */}
      <div
        style={{
          background: "#e8e8ed",
          borderRadius: "16px 16px 4px 4px",
          padding: "12px 12px 0",
          boxShadow: "0 40px 80px rgba(0,0,0,0.18)",
          position: "relative",
        }}
      >
        {/* Apple logo on lid back (subtle glow-through) */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "32px",
            height: "38px",
            opacity: 0.08,
            pointerEvents: "none",
          }}
        >
          <svg viewBox="0 0 814 1000" fill="#1d1d1f" xmlns="http://www.w3.org/2000/svg">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.3-150.3-110.8C69.7 716.3 32 586.3 32 462.5c0-247.4 160.3-375.9 318.5-375.9 84 0 154.2 55.4 206.2 55.4 49.8 0 128.4-58.2 222.9-58.2 37.2 0 166.2 3.2 247.1 120.9zm-156.8-125c-36 0-73.1-50.1-118.6-50.1-45.4 0-91.4 47.9-136.5 47.9-41.5 0-78.2-42.3-115.7-42.3-41.5 0-83.9 41.5-116.3 41.5-25.2 0-49.4-14.5-72.7-35.6 25.5-127.4 106.7-178.5 185.9-178.5 62.8 0 109.7 37.2 153.6 37.2 39.5 0 101-39.5 162.6-39.5 24.7 0 88.5 4.5 143.5 69.4z"/>
          </svg>
        </div>

        {/* Screen bezel */}
        <div style={{ background: "#1d1d1f", borderRadius: "8px 8px 0 0", padding: "12px", overflow: "hidden" }}>
          {/* Notch */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "12px", marginBottom: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3a3a3c" }} />
          </div>
          {/* Screen */}
          <div style={{ borderRadius: "4px", overflow: "hidden", aspectRatio: "16/10", position: "relative" }}>
            <img src={img} alt="Exemple de site Stampify" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="eager" />
            {/* Light reflection overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.03) 100%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Base */}
      <div style={{ background: "#d1d1d6", height: "16px", borderRadius: "0 0 4px 4px", position: "relative" }}>
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "120px", height: "6px", background: "#c7c7cc", borderRadius: "0 0 6px 6px" }} />
      </div>

      {/* Trackpad */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "4px" }}>
        <div
          style={{
            width: "96px",
            height: "60px",
            background: "linear-gradient(180deg, #d8d8dc 0%, #c7c7cc 100%)",
            borderRadius: "8px",
            border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08) inset",
          }}
        />
      </div>

      {/* Stand shadow */}
      <div style={{ height: "4px", background: "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, transparent 100%)", borderRadius: "0 0 8px 8px" }} />
    </div>
  );
}

/* ── iPhone V3 (volume/power buttons, iMessage tails, input bar) ── */
function IphoneV3() {
  const bubbles = [
    { text: "Il vous reste 2 tampons chez la Boulangerie Martin 🥐", delay: "0s" },
    { text: "Ce weekend −20% sur les viennoiseries !", delay: "0.8s" },
    { text: "🎉 Votre récompense est prête !", reward: true, delay: "1.6s" },
  ];

  return (
    <>
      <style>{`
        @keyframes smsLoop3 {
          0%, 14% { opacity: 0; transform: translateY(10px) scale(0.96); }
          20%, 80% { opacity: 1; transform: translateY(0) scale(1); }
          88%, 100% { opacity: 0; transform: translateY(0) scale(1); }
        }
        .sms3-0 { animation: smsLoop3 4s ease 0s infinite; }
        .sms3-1 { animation: smsLoop3 4s ease 0.8s infinite; }
        .sms3-2 { animation: smsLoop3 4s ease 1.6s infinite; }
      `}</style>

      <div style={{ position: "relative", display: "inline-block", flexShrink: 0 }}>
        {/* Volume buttons (left) */}
        <div style={{ position: "absolute", left: "-6px", top: "88px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ width: "4px", height: "28px", background: "#2a2a2c", borderRadius: "2px 0 0 2px" }} />
          <div style={{ width: "4px", height: "28px", background: "#2a2a2c", borderRadius: "2px 0 0 2px" }} />
          <div style={{ width: "4px", height: "20px", background: "#2a2a2c", borderRadius: "2px 0 0 2px", marginTop: "8px" }} />
        </div>

        {/* Power button (right) */}
        <div style={{ position: "absolute", right: "-6px", top: "110px" }}>
          <div style={{ width: "4px", height: "44px", background: "#2a2a2c", borderRadius: "0 2px 2px 0" }} />
        </div>

        {/* iPhone body */}
        <div
          style={{
            width: "280px",
            background: "#1d1d1f",
            borderRadius: "44px",
            padding: "12px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
          }}
        >
          {/* Dynamic Island */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
            <div style={{ width: "120px", height: "34px", background: "#000000", borderRadius: "20px" }} />
          </div>

          {/* Screen */}
          <div style={{ background: "#ffffff", borderRadius: "36px", overflow: "hidden", aspectRatio: "9/19.5", position: "relative", display: "flex", flexDirection: "column" }}>
            {/* Status bar */}
            <div style={{ background: "#f5f5f7", padding: "10px 16px 8px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#1d1d1f", textAlign: "center" }}>Messages</p>
            </div>

            {/* Sender header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              <div style={{ width: "32px", height: "32px", background: "#e8f4fd", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>🥐</div>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "#1d1d1f" }}>Stampify</p>
                <p style={{ fontSize: "9px", color: "#6e6e73" }}>Notifications fidélité</p>
              </div>
            </div>

            {/* Bubbles */}
            <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {bubbles.map((b, i) => (
                <div
                  key={i}
                  className={`sms3-${i}`}
                  style={{
                    alignSelf: b.reward ? "flex-end" : "flex-start",
                    background: b.reward ? "#1d9e75" : "#f5f5f7",
                    color: b.reward ? "#ffffff" : "#1d1d1f",
                    padding: "8px 12px",
                    fontSize: "10px",
                    lineHeight: 1.4,
                    maxWidth: "88%",
                    position: "relative",
                    /* iMessage tail */
                    borderRadius: b.reward
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  {b.text}
                  {/* Triangle tail */}
                  {!b.reward && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "0px",
                        left: "-6px",
                        width: 0,
                        height: 0,
                        borderTop: "7px solid #f5f5f7",
                        borderLeft: "7px solid transparent",
                      }}
                    />
                  )}
                  {b.reward && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "0px",
                        right: "-6px",
                        width: 0,
                        height: 0,
                        borderTop: "7px solid #1d9e75",
                        borderRight: "7px solid transparent",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* iMessage input bar */}
            <div
              style={{
                padding: "8px 10px",
                borderTop: "1px solid rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#ffffff",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "26px",
                  background: "#f5f5f7",
                  borderRadius: "13px",
                  border: "1px solid rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "10px",
                }}
              >
                <span style={{ fontSize: "9px", color: "#c7c7cc" }}>iMessage</span>
              </div>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#1d9e75", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Lottery Wheel V3 (3D perspective, center logo, better pin) ── */
function WheelV3() {
  const segments = [
    { color: "#1d9e75", label: "Café offert", textColor: "#ffffff" },
    { color: "#f5f5f7", label: "-10%", textColor: "#1d1d1f" },
    { color: "#0071e3", label: "Tampon x2", textColor: "#ffffff" },
    { color: "#e8e8ed", label: "-20%", textColor: "#1d1d1f" },
    { color: "#1d1d1f", label: "Surprise", textColor: "#ffffff" },
    { color: "#e8f4fd", label: "Tampon bonus", textColor: "#1d1d1f" },
  ];
  const n = segments.length;
  const r = 140;
  const cx = 160, cy = 160;
  const angleStep = (2 * Math.PI) / n;

  const paths = segments.map((seg, i) => {
    const startAngle = i * angleStep - Math.PI / 2;
    const endAngle = startAngle + angleStep;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const midAngle = startAngle + angleStep / 2;
    const lx = cx + r * 0.65 * Math.cos(midAngle);
    const ly = cy + r * 0.65 * Math.sin(midAngle);
    const labelDeg = (midAngle * 180) / Math.PI + 90;
    return { seg, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`, lx, ly, labelDeg };
  });

  return (
    <div style={{ position: "relative", display: "inline-block", perspective: "600px" }}>
      <style>{`
        @keyframes wheelSpin3 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .wheel-svg-v3 {
          animation: wheelSpin3 8s linear infinite;
          transform-origin: center;
          transform-style: preserve-3d;
        }
        .wheel-svg-v3:hover { animation-duration: 3.5s; }
        .wheel-3d-wrap {
          transform: perspective(600px) rotateX(12deg);
          transform-style: preserve-3d;
          filter: drop-shadow(0 12px 40px rgba(0,0,0,0.18));
        }
      `}</style>

      {/* Styled pin */}
      <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
        <div style={{
          width: "20px",
          height: "20px",
          background: "linear-gradient(135deg, #ff453a, #ff6b6b)",
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(-45deg)",
          boxShadow: "0 2px 8px rgba(255,69,58,0.45)",
          border: "2px solid white",
        }} />
      </div>

      <div className="wheel-3d-wrap">
        <svg width="320" height="320" viewBox="0 0 320 320" className="wheel-svg-v3">
          {/* Outer ring shadow */}
          <circle cx={cx} cy={cy} r={r + 2} fill="rgba(0,0,0,0.06)" />

          {paths.map(({ seg, d, lx, ly, labelDeg }, i) => (
            <g key={i}>
              <path d={d} fill={seg.color} stroke="#ffffff" strokeWidth="2" />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill={seg.textColor} fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif" transform={`rotate(${labelDeg}, ${lx}, ${ly})`}>
                {seg.label}
              </text>
            </g>
          ))}

          {/* Center white circle */}
          <circle cx={cx} cy={cy} r="22" fill="white" />
          <circle cx={cx} cy={cy} r="21" fill="white" stroke="#e8e8ed" strokeWidth="1.5" />

          {/* Stampify logo mark in center */}
          <circle cx={cx} cy={cy - 5} r="7" stroke="#1d1d1f" strokeWidth="1.8" fill="none" />
          <path d={`M${cx - 9},${cy + 8} Q${cx},${cy + 2} ${cx + 9},${cy + 8}`} stroke="#1d1d1f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    </div>
  );
}

/* ── Feature icon ── */
function FeatureIcon({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "#e8f4fd", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", flexShrink: 0 }}>
      {children}
    </div>
  );
}

/* ── Stars ── */
function Stars() {
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="18" height="18" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#f5a623" />
        </svg>
      ))}
    </div>
  );
}

/* ── Check ── */
function Check() {
  return <span style={{ color: "#1d9e75", fontWeight: 600, marginRight: "8px", fontSize: "15px" }}>✓</span>;
}

/* ════════════════════════ PAGE ════════════════════════ */
export default function V3Page() {
  const observerSetup = useRef(false);

  /* Intersection observer */
  useEffect(() => {
    if (observerSetup.current) return;
    observerSetup.current = true;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Parallax on demo cards */
  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll<HTMLElement>(".demo-parallax-card");
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2 - window.innerHeight / 2;
        const offset = centerY * 0.04 * (i % 2 === 0 ? 1 : -1);
        card.style.transform = `translateY(${offset}px)`;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes wordFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .word-anim {
          display: inline-block;
          opacity: 0;
          animation: wordFadeIn 0.5s ease forwards;
        }
        @media (max-width: 767px) {
          .section-padding { padding-top: 80px !important; padding-bottom: 80px !important; }
          .hero-title-v3 { font-size: 48px !important; }
          .section-title-v3 { font-size: 44px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .split-layout { flex-direction: column !important; gap: 48px !important; }
          .pricing-addons { flex-direction: column !important; }
          .process-steps { flex-direction: column !important; gap: 40px !important; }
          .demos-grid-v3 { grid-template-columns: 1fr 1fr !important; }
          .hero-buttons { flex-direction: column !important; align-items: center !important; }
        }
        @media (max-width: 480px) {
          .demos-grid-v3 { grid-template-columns: 1fr !important; }
          .hero-title-v3 { font-size: 40px !important; }
        }
        .pill-dark-hover:hover { transform: scale(1.02); }
        .pill-blue-hover:hover { background: #f0f7ff !important; transform: scale(1.02); }
        .demo-parallax-card { transition: box-shadow 0.25s ease; will-change: transform; }
      `}</style>

      {/* ═══ 1. HERO ═══ */}
      <section style={{ background: "#ffffff", padding: "120px 20px 100px", textAlign: "center" }} className="section-padding">
        <div style={{ ...inner, display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          <AnimatedTitle
            text="Le site vitrine et la carte fidélité que votre commerce mérite."
            style={{
              fontSize: "96px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              color: "#1d1d1f",
              maxWidth: "860px",
            } as React.CSSProperties}
          />

          <p
            className="fade-up"
            style={{
              fontSize: "21px",
              color: "#6e6e73",
              maxWidth: "560px",
              lineHeight: 1.5,
              animationDelay: "0.3s",
            }}
          >
            990 CHF. Une seule fois. À vous pour toujours.
          </p>

          {/* Buttons */}
          <div className="fade-up hero-buttons" style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center", flexWrap: "wrap", animationDelay: "0.35s" }}>
            <a href={WA_MAIN} target="_blank" rel="noopener noreferrer" style={pillDark} className="pill-dark-hover">Obtenir mon site →</a>
            <Link href="/v3/demos" style={pillBlue} className="pill-blue-hover">Voir les démos</Link>
          </div>

          {/* Single metrics line */}
          <p className="fade-up" style={{ fontSize: "13px", color: "#6e6e73", letterSpacing: "0.02em", animationDelay: "0.4s" }}>
            990 CHF · 48h · Suisse romande
          </p>

          {/* MacBook */}
          <div className="fade-up" style={{ width: "100%", marginTop: "16px", animationDelay: "0.45s" }}>
            <MacBookV3 img={HERO_IMG} />
          </div>

          <p className="fade-up" style={{ fontSize: "13px", color: "#6e6e73", marginTop: "-4px" }}>
            Exemple réel créé avec Stampify
          </p>
          <a href="https://loyalty-cards-rho.vercel.app/lessence-spa.html" target="_blank" rel="noopener noreferrer" style={{ ...pillBlue, fontSize: "15px", padding: "10px 22px" }} className="fade-up pill-blue-hover">
            Voir la démo complète →
          </a>
        </div>
      </section>

      {/* ═══ 2. LE SITE ═══ */}
      <section style={sectionPad("#f5f5f7")} className="section-padding">
        <div style={inner}>
          <h2
            className="fade-up section-title-v3"
            style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", textAlign: "center", marginBottom: "72px", lineHeight: 1.05 }}
          >
            Le site.
          </h2>
          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {[
              {
                icon: <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg>,
                title: "5 pages à vos couleurs",
                text: "Accueil, menu, carte fidélité, réservation, contact. Domaine .ch inclus. SEO local optimisé. Mobile-first.",
              },
              {
                icon: <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>,
                title: "Carte fidélité digitale",
                text: "10 cases personnalisables. QR code ou NFC. Aucune app requise. Tampons permanents, même hors connexion.",
              },
              {
                icon: <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0" /><circle cx="12" cy="20" r="1" fill="#0071e3" stroke="none" /></svg>,
                title: "Plaquette NFC gravée",
                text: "En bois naturel, à votre nom. Sur votre comptoir. Vos clients approchent leur téléphone. C'est tout.",
              },
              {
                icon: <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
                title: "Campagnes SMS",
                text: "Envoyez une promo à tous vos clients en 2 clics. 1 campagne offerte le 1er mois. Taux d'ouverture 98%.",
              },
              {
                icon: <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
                title: "Réservations & commandes",
                text: "Table, RDV, pré-commande. Vos clients réservent depuis votre site. Vous gérez depuis le dashboard.",
              },
              {
                icon: <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}><path d="M18 20V10M12 20V4M6 20v-6" /></svg>,
                title: "Tableau de bord",
                text: "Clients actifs, tampons, récompenses. Accessible depuis votre téléphone, 24h/24.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="fade-up"
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
                  padding: "40px",
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <FeatureIcon>{f.icon}</FeatureIcon>
                <h3 style={{ fontSize: "21px", fontWeight: 600, color: "#1d1d1f", marginBottom: "10px", letterSpacing: "-0.02em" }}>{f.title}</h3>
                <p style={{ fontSize: "17px", color: "#6e6e73", lineHeight: 1.6 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. LA CARTE ═══ */}
      <section style={sectionPad("#ffffff")} className="section-padding">
        <div style={{ ...inner, display: "flex", alignItems: "center", gap: "80px" }} className="split-layout">
          <div className="fade-up" style={{ flex: 1, minWidth: 0 }}>
            <h2 className="section-title-v3" style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", marginBottom: "20px", lineHeight: 1.05 }}>
              La carte.
            </h2>
            <p style={{ fontSize: "19px", color: "#6e6e73", lineHeight: 1.6, marginBottom: "32px" }}>
              Activez la roue de la fortune sur votre carte fidélité. Chaque visite = une chance de gagner.
              Taux de retour augmenté de 40%+.
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
              {["Roue personnalisable", "QR code ou NFC", "Aucune app requise", "Dashboard en temps réel"].map((item, i) => (
                <li key={item} className="fade-up" style={{ fontSize: "17px", color: "#1d1d1f", display: "flex", alignItems: "center", animationDelay: `${i * 0.1}s` }}>
                  <Check />{item}
                </li>
              ))}
            </ul>
            <a href="/v3/demos" style={pillDark} className="pill-dark-hover">Voir la démo →</a>
          </div>
          <div className="fade-up" style={{ flexShrink: 0, display: "flex", justifyContent: "center" }}>
            <WheelV3 />
          </div>
        </div>
      </section>

      {/* ═══ 4. LES SMS ═══ */}
      <section style={sectionPad("#f5f5f7")} className="section-padding">
        <div style={{ ...inner, display: "flex", alignItems: "center", gap: "80px" }} className="split-layout">
          <div className="fade-up" style={{ flex: 1, minWidth: 0 }}>
            <h2 className="section-title-v3" style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", marginBottom: "20px", lineHeight: 1.05 }}>
              Les SMS.
            </h2>
            <p style={{ fontSize: "19px", color: "#6e6e73", lineHeight: 1.6, marginBottom: "28px" }}>
              15 triggers configurables. Anniversaire, inactivité, récompense. Tout se fait sans vous.
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
              {["SMS mi-parcours", "Relance client inactif 14/30/60j", "Rappel réservation auto", "Promo flash en 2 clics"].map((item, i) => (
                <li key={item} className="fade-up" style={{ fontSize: "17px", color: "#1d1d1f", display: "flex", alignItems: "center", animationDelay: `${i * 0.1}s` }}>
                  <Check />{item}
                </li>
              ))}
            </ul>
            <span style={{ display: "inline-block", background: "#e8f4fd", color: "#0071e3", borderRadius: "980px", padding: "6px 16px", fontSize: "13px", fontWeight: 500 }}>
              Add-on à partir de 49 CHF/mois
            </span>
          </div>
          <div className="fade-up" style={{ flexShrink: 0, display: "flex", justifyContent: "center" }}>
            <IphoneV3 />
          </div>
        </div>
      </section>

      {/* ═══ 5. BROWSER FRAME ═══ */}
      <section style={{ ...sectionPad("#ffffff"), textAlign: "center" }} className="section-padding">
        <div style={{ ...inner, display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
          <h2 className="fade-up section-title-v3" style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", maxWidth: "600px", lineHeight: 1.05 }}>
            La plaquette.
          </h2>
          <p className="fade-up" style={{ fontSize: "19px", color: "#6e6e73", maxWidth: "500px", lineHeight: 1.6 }}>
            En bois naturel gravé à votre nom. Sur votre comptoir. Vos clients approchent leur téléphone. C'est tout.
          </p>
          <div
            className="fade-up browser-frame"
            style={{ maxWidth: "880px", width: "100%", boxShadow: "0 40px 80px rgba(0,0,0,0.1)", borderRadius: "12px", overflow: "hidden" }}
          >
            <div style={{ background: "#f5f5f7", height: "40px", display: "flex", alignItems: "center", padding: "0 16px", gap: "8px" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                {["#ff5f57", "#ffbd2e", "#28ca41"].map((c, i) => (
                  <div key={i} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{ flex: 1, textAlign: "center", fontSize: "13px", color: "#6e6e73" }}>
                lessence-spa.stampify.ch
              </div>
              <div style={{ width: "48px" }} />
            </div>
            <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
              <img src={HERO_IMG} alt="Exemple de site Stampify" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
            </div>
          </div>
          <a href="https://loyalty-cards-rho.vercel.app/lessence-spa.html" target="_blank" rel="noopener noreferrer" style={pillBlue} className="fade-up pill-blue-hover">
            Voir la démo complète →
          </a>
        </div>
      </section>

      {/* ═══ 6. REVIEWS ═══ */}
      <section style={sectionPad("#f5f5f7")} className="section-padding">
        <div style={inner}>
          <h2 className="fade-up section-title-v3" style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", textAlign: "center", marginBottom: "60px", lineHeight: 1.05 }}>
            Ils nous font confiance.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }} className="features-grid">
            {[
              { text: "Notre café a vu ses visites récurrentes augmenter de 30% en 2 mois. La carte fidélité NFC, c'est magique.", name: "Sophie M.", role: "Café des Artistes, Lausanne" },
              { text: "Stampify a livré notre site en 36h. Design parfait, notre boulangerie n'a jamais eu autant de commandes en ligne.", name: "Jean-Pierre B.", role: "Boulangerie Martin, Lausanne" },
              { text: "La roue de la fortune fait que nos clientes reviennent chaque semaine. Le ROI est incroyable.", name: "Aline K.", role: "Nail Studio, Lausanne" },
            ].map((r, i) => (
              <div key={i} className="fade-up" style={{ background: "#ffffff", borderRadius: "18px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)", padding: "32px", animationDelay: `${i * 0.1}s` }}>
                <Stars />
                <p style={{ fontSize: "17px", color: "#1d1d1f", lineHeight: 1.6, marginBottom: "20px" }}>"{r.text}"</p>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#1d1d1f" }}>{r.name}</p>
                <p style={{ fontSize: "13px", color: "#6e6e73", marginTop: "2px" }}>{r.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. PRICING ═══ */}
      <section style={{ ...sectionPad("#ffffff"), textAlign: "center" }} className="section-padding">
        <div style={{ ...inner, display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
          <h2 className="fade-up section-title-v3" style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", lineHeight: 1.05 }}>
            Un investissement. Pour toujours.
          </h2>
          <div
            className="fade-up pricing-card-v3"
            style={{
              maxWidth: "560px",
              width: "100%",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "48px",
              boxShadow: "0 2px 40px rgba(0,0,0,0.08)",
              textAlign: "left",
              transition: "box-shadow 0.3s ease, transform 0.25s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px rgba(0,0,0,0.14)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 40px rgba(0,0,0,0.08)";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <span style={{ display: "inline-block", background: "#e6f7f1", color: "#1d9e75", borderRadius: "980px", padding: "6px 16px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                Le choix de nos clients
              </span>
            </div>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <span style={{ fontSize: "120px", fontWeight: 700, letterSpacing: "-4px", color: "#1d1d1f", lineHeight: 1 }}>990</span>
              <p style={{ fontSize: "17px", color: "#6e6e73", marginTop: "8px" }}>CHF · paiement unique · aucun abonnement</p>
            </div>
            <div style={{ height: "1px", background: "#f5f5f7", margin: "24px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
              {[
                "Site vitrine 5 pages",
                "Carte fidélité 10 cases",
                "Plaquette NFC gravée",
                "Domaine .ch + hébergement 1ère année",
                "SEO local complet",
                "QR code A4/A5",
                "1 campagne SMS offerte",
                "2 retouches incluses",
                "Guide vidéo",
                "Livraison 48h garantie",
              ].map((f, i) => (
                <div key={f} className="fade-up" style={{ display: "flex", alignItems: "center", fontSize: "15px", color: "#1d1d1f", animationDelay: `${i * 0.1}s` }}>
                  <Check /><span>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#f5f5f7", borderRadius: "12px", padding: "20px", fontSize: "15px", color: "#6e6e73", lineHeight: 1.6, marginBottom: "28px" }}>
              Une agence suisse facture 1 500–5 000 CHF pour un site seul. Stampify livre site + carte + NFC + SEO. Pour{" "}
              <strong style={{ color: "#1d1d1f" }}>990 CHF</strong>. En 48h.
            </div>
            <a href={WA_MAIN} target="_blank" rel="noopener noreferrer" style={{ ...pillDark, display: "block", textAlign: "center", width: "100%", padding: "16px 28px" }} className="pill-dark-hover">
              Obtenir mon site — 990 CHF
            </a>
            <p style={{ textAlign: "center", fontSize: "13px", color: "#6e6e73", margin: "28px 0", letterSpacing: "0.03em" }}>
              ━━━ VOUS POUVEZ AUSSI AJOUTER UN SUIVI MENSUEL ━━━
            </p>
            <div className="pricing-addons" style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1, background: "#f5f5f7", borderRadius: "18px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Essentiel</p>
                <p style={{ fontSize: "32px", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em" }}>49 <span style={{ fontSize: "17px", fontWeight: 400, color: "#6e6e73" }}>CHF/mois</span></p>
                {["Mises à jour contenu", "Support 5j/7", "Rapport mensuel", "1 campagne SMS/mois"].map((f, i) => (
                  <div key={f} className="fade-up" style={{ display: "flex", alignItems: "center", fontSize: "13px", color: "#1d1d1f", animationDelay: `${i * 0.1}s` }}>
                    <Check /><span>{f}</span>
                  </div>
                ))}
                <a href={WA_ESSENTIEL} target="_blank" rel="noopener noreferrer" style={{ ...pillDark, display: "block", textAlign: "center", fontSize: "14px", padding: "11px 20px", marginTop: "8px" }}>
                  Activer l&apos;Essentiel
                </a>
              </div>
              <div style={{ flex: 1, background: "#1d1d1f", borderRadius: "18px", padding: "28px", display: "flex", flexDirection: "column", gap: "12px", position: "relative" }}>
                <span style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#ff9f0a", color: "#ffffff", borderRadius: "980px", padding: "3px 12px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                  Recommandé
                </span>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Pro</p>
                <p style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>79 <span style={{ fontSize: "17px", fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>CHF/mois</span></p>
                {["Tout l'Essentiel", "SMS illimités", "Roue de la fortune", "A/B test campagnes", "Support prioritaire 7j/7"].map((f, i) => (
                  <div key={f} className="fade-up" style={{ display: "flex", alignItems: "center", fontSize: "13px", color: "rgba(255,255,255,0.85)", animationDelay: `${i * 0.1}s` }}>
                    <span style={{ color: "#1d9e75", fontWeight: 600, marginRight: "8px" }}>✓</span><span>{f}</span>
                  </div>
                ))}
                <a href={WA_PRO} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#ffffff", color: "#1d1d1f", borderRadius: "980px", padding: "11px 20px", fontSize: "14px", fontWeight: 500, textDecoration: "none", textAlign: "center", marginTop: "8px", transition: "transform 0.2s ease" }} className="pill-dark-hover">
                  Activer le Pro
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 8. PROCESS ═══ */}
      <section style={sectionPad("#f5f5f7")} className="section-padding">
        <div style={inner}>
          <h2 className="fade-up section-title-v3" style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", textAlign: "center", marginBottom: "80px", lineHeight: 1.05 }}>
            De zéro à votre site en 48h.
          </h2>
          <div className="process-steps" style={{ display: "flex", gap: "48px", alignItems: "flex-start" }}>
            {[
              { num: "01", title: "Parlez-nous de votre commerce", text: "Un échange sur WhatsApp. On note vos couleurs, horaires, style. 10 minutes.", icon: <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg> },
              { num: "02", title: "On crée tout en 48h", text: "Site, carte, plaquette NFC, SEO. Vous validez. On met en ligne.", icon: <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg> },
              { num: "03", title: "Vos clients reviennent", text: "Votre commerce est sur Google. La plaquette est sur votre comptoir. Les clients fidèles reviennent automatiquement.", icon: <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}><path d="M4 17l4 4L22 7" strokeLinecap="round" strokeLinejoin="round" /></svg> },
            ].map((step, i) => (
              <div key={i} className="fade-up" style={{ flex: 1, animationDelay: `${i * 0.15}s` }}>
                <p style={{ fontSize: "80px", fontWeight: 700, color: "#e8e8ed", lineHeight: 1, marginBottom: "-16px", letterSpacing: "-0.04em" }}>{step.num}</p>
                <div style={{ marginBottom: "16px" }}>{step.icon}</div>
                <h3 style={{ fontSize: "21px", fontWeight: 600, color: "#1d1d1f", marginBottom: "10px", letterSpacing: "-0.02em" }}>{step.title}</h3>
                <p style={{ fontSize: "17px", color: "#6e6e73", lineHeight: 1.6 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 9. DEMOS PREVIEW ═══ */}
      <section style={{ ...sectionPad("#ffffff"), textAlign: "center" }} className="section-padding">
        <div style={{ ...inner, display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" }}>
          <div className="fade-up">
            <h2 className="section-title-v3" style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", marginBottom: "12px", lineHeight: 1.05 }}>
              Voyez le résultat.
            </h2>
            <p style={{ fontSize: "19px", color: "#6e6e73" }}>6 exemples réels. À vos couleurs. En 48h.</p>
          </div>
          <div className="demos-grid-v3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", width: "100%" }}>
            {[
              { img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80", badge: "Spa & Beauté", name: "L'Essence Spa", city: "Lausanne", href: "https://loyalty-cards-rho.vercel.app/lessence-spa.html" },
              { img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", badge: "Café", name: "Café Lumière", city: "Genève", href: "/demos/cafe-lumiere.html" },
              { img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", badge: "Restaurant", name: "Bistrot du Coin", city: "Fribourg", href: "/demos/bistrot-du-coin.html" },
              { img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80", badge: "Boulangerie", name: "Boulangerie Martin", city: "Lausanne", href: "/demos/boulangerie-martin.html" },
              { img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80", badge: "Coiffure", name: "Black Scissors", city: "Genève", href: "/demos/black-scissors.html" },
              { img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80", badge: "Nail Studio", name: "Nail Studio K", city: "Lausanne", href: "/demos/nail-studio.html" },
            ].map((demo, i) => (
              <div
                key={i}
                className="fade-up demo-parallax-card"
                style={{
                  background: "#f5f5f7",
                  borderRadius: "18px",
                  overflow: "hidden",
                  textAlign: "left",
                  animationDelay: `${i * 0.08}s`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                  <img src={demo.img} alt={demo.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                </div>
                <div style={{ padding: "24px" }}>
                  <span style={{ background: "#e8f4fd", color: "#0071e3", borderRadius: "980px", padding: "4px 10px", fontSize: "11px", fontWeight: 500, display: "inline-block", marginBottom: "10px" }}>{demo.badge}</span>
                  <p style={{ fontSize: "19px", fontWeight: 600, color: "#1d1d1f", marginBottom: "4px" }}>{demo.name}</p>
                  <p style={{ fontSize: "15px", color: "#6e6e73", marginBottom: "16px" }}>{demo.city}</p>
                  <a href={demo.href} target={demo.href.startsWith("http") ? "_blank" : undefined} rel={demo.href.startsWith("http") ? "noopener noreferrer" : undefined} style={{ ...pillBlue, fontSize: "13px", padding: "8px 16px" }} className="pill-blue-hover">
                    Voir la démo →
                  </a>
                </div>
              </div>
            ))}
          </div>
          <Link href="/v3/demos" className="fade-up" style={{ fontSize: "17px", color: "#0071e3", textDecoration: "none", fontWeight: 500 }}>
            Voir toutes les démos →
          </Link>
        </div>
      </section>

      {/* ═══ 10. CTA FINAL — black + city night ═══ */}
      <section
        style={{
          position: "relative",
          background: "#000000",
          padding: "180px 20px",
          textAlign: "center",
          overflow: "hidden",
        }}
        className="section-padding"
      >
        {/* City night lights background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${CTA_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
            zIndex: 0,
          }}
        />
        <div style={{ position: "relative", zIndex: 1, ...inner, display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>
          <h2
            className="fade-up section-title-v3"
            style={{ fontSize: "80px", fontWeight: 700, letterSpacing: "-0.04em", color: "#ffffff", maxWidth: "720px", lineHeight: 1.05 }}
          >
            Votre commerce mérite d&apos;être en ligne.
          </h2>
          <p className="fade-up" style={{ fontSize: "19px", color: "rgba(255,255,255,0.6)", maxWidth: "480px", lineHeight: 1.6 }}>
            990 CHF. 48h. Propriétaire à 100%. Réponse en moins de 2h, 7j/7.
          </p>
          <a
            href={WA_MAIN}
            target="_blank"
            rel="noopener noreferrer"
            className="fade-up pill-dark-hover"
            style={{
              display: "inline-block",
              background: "#ffffff",
              color: "#1d1d1f",
              borderRadius: "980px",
              padding: "18px 40px",
              fontSize: "17px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.03)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(255,255,255,0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            Obtenir mon site — 990 CHF →
          </a>
          <p className="fade-up" style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
            📱 Réponse sous 2h · 7j/7 · Sans engagement
          </p>
        </div>
      </section>
    </>
  );
}
