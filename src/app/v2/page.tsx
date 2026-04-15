"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────── WhatsApp links ── */
const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";
const WA_ESSENTIEL =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20activer%20l%27add-on%20Essentiel%20%2849%20CHF%2Fmois%29%20pour%20mon%20site%20Stampify.";
const WA_PRO =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20activer%20l%27add-on%20Pro%20%2879%20CHF%2Fmois%29%20pour%20mon%20site%20Stampify.";

/* ─────────────────────────────────────────── Shared styles ─── */
const sectionBase = (bg: string, pt = 140, pb = 140): React.CSSProperties => ({
  background: bg,
  padding: `${pt}px 20px ${pb}px`,
});

const inner: React.CSSProperties = {
  maxWidth: "980px",
  margin: "0 auto",
};

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

const card: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "18px",
  boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
  padding: "40px",
};

/* ─────────────────────────────────────────── Unsplash fetch ── */
const UNSPLASH_KEY = "OksWssteVjTyPX2KW0lqIdY_Y9zpzNIf-NpPi16W6D0";

async function fetchUnsplash(query: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0]?.urls?.regular ?? null;
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────── Wheel SVG ──────── */
function LotteryWheel() {
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
  const cx = 160;
  const cy = 160;
  const angleStep = (2 * Math.PI) / n;

  const paths = segments.map((seg, i) => {
    const startAngle = i * angleStep - Math.PI / 2;
    const endAngle = startAngle + angleStep;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const midAngle = startAngle + angleStep / 2;
    const labelR = r * 0.65;
    const lx = cx + labelR * Math.cos(midAngle);
    const ly = cy + labelR * Math.sin(midAngle);
    const labelDeg = (midAngle * 180) / Math.PI + 90;

    return { seg, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`, lx, ly, labelDeg };
  });

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <style>{`
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .wheel-svg { animation: wheelSpin 8s linear infinite; transform-origin: center; }
        .wheel-svg:hover { animation-duration: 4s; }
      `}</style>
      {/* Triangle indicator */}
      <div
        style={{
          position: "absolute",
          top: "-12px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "20px solid #1d1d1f",
          zIndex: 2,
        }}
      />
      <svg
        width="320"
        height="320"
        viewBox="0 0 320 320"
        className="wheel-svg"
        style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.12))" }}
      >
        {paths.map(({ seg, d, lx, ly, labelDeg }, i) => (
          <g key={i}>
            <path d={d} fill={seg.color} stroke="#ffffff" strokeWidth="2" />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={seg.textColor}
              fontSize="11"
              fontWeight="600"
              fontFamily="Inter, sans-serif"
              transform={`rotate(${labelDeg}, ${lx}, ${ly})`}
            >
              {seg.label}
            </text>
          </g>
        ))}
        <circle cx={cx} cy={cy} r="16" fill="#ffffff" stroke="#e8e8ed" strokeWidth="2" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────── iPhone SMS ──────── */
function IphoneSMS() {
  const bubbles = [
    {
      text: "Il vous reste 2 tampons chez la Boulangerie Martin 🥐",
      bg: "#f5f5f7",
      color: "#1d1d1f",
      delay: "0s",
    },
    {
      text: "Ce weekend −20% sur les viennoiseries !",
      bg: "#f5f5f7",
      color: "#1d1d1f",
      delay: "0.8s",
    },
    {
      text: "🎉 Votre récompense est prête !",
      bg: "#1d9e75",
      color: "#ffffff",
      delay: "1.6s",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes bubbleFadeIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .sms-bubble {
          opacity: 0;
          animation: bubbleFadeIn 0.4s ease forwards;
          animation-iteration-count: infinite;
          animation-direction: normal;
        }
        .sms-bubble-0 { animation-delay: 0s; animation-duration: 0.4s; }
        .sms-bubble-1 { animation-delay: 0.8s; animation-duration: 0.4s; }
        .sms-bubble-2 { animation-delay: 1.6s; animation-duration: 0.4s; }

        @keyframes smsLoop {
          0%, 14% { opacity: 0; transform: translateY(12px); }
          18%, 85% { opacity: 1; transform: translateY(0); }
          90%, 100% { opacity: 0; transform: translateY(0); }
        }
        .sms-anim-0 { animation: smsLoop 4s ease 0s infinite; }
        .sms-anim-1 { animation: smsLoop 4s ease 0.8s infinite; }
        .sms-anim-2 { animation: smsLoop 4s ease 1.6s infinite; }
      `}</style>
      <div
        style={{
          width: "280px",
          background: "#1d1d1f",
          borderRadius: "44px",
          padding: "12px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          flexShrink: 0,
        }}
      >
        {/* Dynamic Island */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
          <div
            style={{
              width: "120px",
              height: "34px",
              background: "#000000",
              borderRadius: "20px",
            }}
          />
        </div>

        {/* Screen */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "36px",
            overflow: "hidden",
            aspectRatio: "9/19.5",
            position: "relative",
          }}
        >
          {/* Status bar */}
          <div
            style={{
              background: "#f5f5f7",
              padding: "10px 16px 8px",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ fontSize: "11px", fontWeight: 600, color: "#1d1d1f", textAlign: "center" }}>
              Messages
            </p>
          </div>

          {/* Sender header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "#e8f4fd",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                flexShrink: 0,
              }}
            >
              🥐
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#1d1d1f" }}>Stampify</p>
              <p style={{ fontSize: "9px", color: "#6e6e73" }}>Notifications fidélité</p>
            </div>
          </div>

          {/* Bubbles */}
          <div
            style={{
              padding: "12px 10px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {bubbles.map((b, i) => (
              <div
                key={i}
                className={`sms-anim-${i}`}
                style={{
                  alignSelf: "flex-start",
                  background: b.bg,
                  color: b.color,
                  borderRadius: "16px 16px 16px 4px",
                  padding: "8px 12px",
                  fontSize: "10px",
                  lineHeight: 1.4,
                  maxWidth: "90%",
                  fontWeight: 400,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────── Feature icon helpers */
function FeatureIcon({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "56px",
        height: "56px",
        borderRadius: "12px",
        background: "#e8f4fd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

const iconStroke = { stroke: "#0071e3", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

/* ─────────────────────────────────────────── Stars */
function Stars() {
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="18" height="18" viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="#f5a623"
          />
        </svg>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────── CHECK mark */
function Check({ green }: { green?: boolean }) {
  return (
    <span
      style={{
        color: green ? "#1d9e75" : "#1d9e75",
        fontWeight: 600,
        marginRight: "8px",
        fontSize: "15px",
      }}
    >
      ✓
    </span>
  );
}

/* ═══════════════════════════════════════════ PAGE COMPONENT ══ */
export default function V2Page() {
  const [heroImg, setHeroImg] = useState<string>("https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80");
  const [browserImg, setBrowserImg] = useState<string>("https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80");
  const observerSetup = useRef(false);

  /* Unsplash fetch */
  useEffect(() => {
    fetchUnsplash("luxury spa interior white clean").then((url) => {
      if (url) setHeroImg(url);
    });
    fetchUnsplash("luxury spa white interior minimalist").then((url) => {
      if (url) setBrowserImg(url);
    });
  }, []);

  /* Intersection observer for fade-up */
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

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .section-padding { padding-top: 80px !important; padding-bottom: 80px !important; }
          .hero-title { font-size: 44px !important; }
          .section-title-lg { font-size: 36px !important; }
          .section-title-md { font-size: 32px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .metrics-row { flex-wrap: wrap !important; gap: 32px !important; justify-content: center !important; }
          .hero-buttons { flex-direction: column !important; align-items: center !important; }
          .split-layout { flex-direction: column !important; gap: 48px !important; }
          .pricing-addons { flex-direction: column !important; }
          .process-steps { flex-direction: column !important; gap: 40px !important; }
          .demos-grid { grid-template-columns: 1fr 1fr !important; }
          .macbook-frame { max-width: 100% !important; }
          .browser-frame { max-width: 100% !important; }
          .wheel-svg { width: 240px !important; height: 240px !important; }
        }
        @media (max-width: 480px) {
          .demos-grid { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 36px !important; }
        }
        .pill-dark-hover:hover { transform: scale(1.02); }
        .pill-blue-hover:hover { background: #f0f7ff !important; transform: scale(1.02); }
      `}</style>

      {/* ═══════════ 1. HERO ═══════════ */}
      <section style={{ ...sectionBase("#ffffff", 100, 100), textAlign: "center" }} className="section-padding">
        <div style={{ ...inner, display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>
          {/* Badge */}
          <div className="fade-up">
            <span
              style={{
                background: "#f5f5f7",
                borderRadius: "980px",
                padding: "6px 16px",
                fontSize: "13px",
                color: "#1d1d1f",
                fontWeight: 500,
                display: "inline-block",
              }}
            >
              ⚡ Livraison en 48h · Suisse romande &amp; France
            </span>
          </div>

          {/* H1 */}
          <h1
            className="fade-up hero-title"
            style={{
              fontSize: "80px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#1d1d1f",
              maxWidth: "820px",
            }}
          >
            Le site vitrine et la carte fidélité que votre commerce mérite.
          </h1>

          {/* Subtitle */}
          <p
            className="fade-up"
            style={{
              fontSize: "21px",
              color: "#6e6e73",
              maxWidth: "600px",
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            990 CHF. Une seule fois. À vous pour toujours. Votre commerce en ligne en 48h.
          </p>

          {/* Buttons */}
          <div
            className="fade-up hero-buttons"
            style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}
          >
            <a href={WA_MAIN} target="_blank" rel="noopener noreferrer" style={pillDark} className="pill-dark-hover">
              Obtenir mon site →
            </a>
            <Link href="/v2/demos" style={pillBlue} className="pill-blue-hover">
              Voir les démos
            </Link>
          </div>

          {/* Metrics */}
          <div
            className="fade-up metrics-row"
            style={{ display: "flex", gap: "48px", marginTop: "16px", alignItems: "center", justifyContent: "center" }}
          >
            {[
              { num: "48h", label: "Livraison garantie" },
              { num: "990 CHF", label: "Paiement unique" },
              { num: "100%", label: "Propriétaire du site" },
              { num: "0 CHF", label: "Abonnement mensuel" },
            ].map((m) => (
              <div key={m.num} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "28px", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em" }}>
                  {m.num}
                </p>
                <p style={{ fontSize: "13px", color: "#6e6e73", marginTop: "4px" }}>{m.label}</p>
              </div>
            ))}
          </div>

          {/* MacBook frame */}
          <div className="fade-up macbook-frame" style={{ maxWidth: "800px", width: "100%", marginTop: "24px" }}>
            <div
              style={{
                background: "#e8e8ed",
                borderRadius: "16px 16px 4px 4px",
                padding: "12px 12px 0",
                boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
              }}
            >
              {/* Screen bezel */}
              <div
                style={{
                  background: "#1d1d1f",
                  borderRadius: "8px 8px 0 0",
                  padding: "12px",
                  overflow: "hidden",
                }}
              >
                {/* Notch bar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "12px",
                    marginBottom: "6px",
                  }}
                >
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3a3a3c" }} />
                </div>
                {/* Screen image */}
                <div style={{ borderRadius: "4px", overflow: "hidden", aspectRatio: "16/10" }}>
                  <img
                    src={heroImg}
                    alt="Exemple de site Stampify — spa de luxe"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="eager"
                  />
                </div>
              </div>
            </div>
            {/* MacBook base */}
            <div
              style={{
                background: "#d1d1d6",
                height: "16px",
                borderRadius: "0 0 4px 4px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "120px",
                  height: "6px",
                  background: "#c7c7cc",
                  borderRadius: "0 0 6px 6px",
                }}
              />
            </div>
          </div>

          {/* Caption + CTA */}
          <p style={{ fontSize: "13px", color: "#6e6e73", marginTop: "-8px" }} className="fade-up">
            Exemple réel créé avec Stampify
          </p>
          <a
            href="https://loyalty-cards-rho.vercel.app/lessence-spa.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...pillBlue, fontSize: "15px", padding: "10px 22px" }}
            className="fade-up pill-blue-hover"
          >
            Voir la démo complète →
          </a>
        </div>
      </section>

      {/* ═══════════ 2. FEATURES ═══════════ */}
      <section style={sectionBase("#f5f5f7")} className="section-padding">
        <div style={inner}>
          <h2
            className="fade-up section-title-md"
            style={{
              fontSize: "48px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1d1d1f",
              textAlign: "center",
              marginBottom: "64px",
            }}
          >
            Tout ce dont votre commerce a besoin. Dans un seul forfait.
          </h2>

          <div
            className="features-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
          >
            {[
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                  </svg>
                ),
                title: "Site professionnel",
                text: "5 pages à vos couleurs. Domaine .ch inclus. SEO local optimisé. Mobile-first.",
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}>
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                ),
                title: "Carte fidélité digitale",
                text: "10 cases personnalisables. QR code ou NFC. Aucune app requise. Tampons permanents.",
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}>
                    <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0" />
                    <circle cx="12" cy="20" r="1" fill="#0071e3" stroke="none" />
                  </svg>
                ),
                title: "Plaquette NFC gravée",
                text: "En bois naturel, à votre nom. Sur votre comptoir. Vos clients approchent leur téléphone. C'est tout.",
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}>
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                ),
                title: "Campagnes SMS",
                text: "Envoyez une promo à tous vos clients en 2 clics. 1 campagne offerte le 1er mois.",
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}>
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                ),
                title: "Réservations & commandes",
                text: "Table, RDV, pré-commande. Vos clients réservent depuis votre site. Vous gérez depuis le dashboard.",
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}>
                    <path d="M18 20V10M12 20V4M6 20v-6" />
                  </svg>
                ),
                title: "Tableau de bord",
                text: "Clients actifs, tampons, récompenses. Accessible depuis votre téléphone, 24h/24.",
              },
            ].map((f, i) => (
              <div key={i} className="fade-up" style={card}>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <h3
                  style={{
                    fontSize: "21px",
                    fontWeight: 600,
                    color: "#1d1d1f",
                    marginBottom: "10px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: "17px", color: "#6e6e73", lineHeight: 1.6 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 3. ROUE ═══════════ */}
      <section style={sectionBase("#ffffff")} className="section-padding">
        <div
          style={{ ...inner, display: "flex", alignItems: "center", gap: "80px" }}
          className="split-layout"
        >
          {/* Text left */}
          <div className="fade-up" style={{ flex: 1, minWidth: 0 }}>
            <h2
              className="section-title-md"
              style={{
                fontSize: "48px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#1d1d1f",
                marginBottom: "20px",
                lineHeight: 1.1,
              }}
            >
              Vos clients jouent. Ils reviennent.
            </h2>
            <p style={{ fontSize: "19px", color: "#6e6e73", lineHeight: 1.6, marginBottom: "32px" }}>
              Activez la roue de la fortune sur la carte fidélité. Chaque visite = une chance de gagner.
              Taux de retour augmenté de 40%+.
            </p>
            <a href="/v2/demos" style={pillDark} className="pill-dark-hover">
              Voir la démo →
            </a>
          </div>

          {/* Wheel right */}
          <div className="fade-up" style={{ flexShrink: 0, display: "flex", justifyContent: "center" }}>
            <LotteryWheel />
          </div>
        </div>
      </section>

      {/* ═══════════ 4. SMS ═══════════ */}
      <section style={sectionBase("#f5f5f7")} className="section-padding">
        <div
          style={{ ...inner, display: "flex", alignItems: "center", gap: "80px" }}
          className="split-layout"
        >
          {/* Text left */}
          <div className="fade-up" style={{ flex: 1, minWidth: 0 }}>
            <h2
              className="section-title-md"
              style={{
                fontSize: "48px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#1d1d1f",
                marginBottom: "20px",
                lineHeight: 1.1,
              }}
            >
              Vos clients reviennent. Automatiquement.
            </h2>
            <p style={{ fontSize: "19px", color: "#6e6e73", lineHeight: 1.6, marginBottom: "28px" }}>
              15 triggers SMS configurables. Anniversaire, inactivité, récompense. Tout se fait sans vous.
            </p>

            {/* Checklist */}
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
              {[
                "SMS mi-parcours",
                "Relance client inactif 14/30/60j",
                "Rappel réservation auto",
                "Promo flash en 2 clics",
              ].map((item) => (
                <li key={item} style={{ fontSize: "17px", color: "#1d1d1f", display: "flex", alignItems: "flex-start" }}>
                  <Check green />
                  {item}
                </li>
              ))}
            </ul>

            {/* Badge */}
            <span
              style={{
                display: "inline-block",
                background: "#e8f4fd",
                color: "#0071e3",
                borderRadius: "980px",
                padding: "6px 16px",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              Add-on à partir de 49 CHF/mois
            </span>
          </div>

          {/* iPhone right */}
          <div className="fade-up" style={{ flexShrink: 0, display: "flex", justifyContent: "center" }}>
            <IphoneSMS />
          </div>
        </div>
      </section>

      {/* ═══════════ 5. BROWSER FRAME ═══════════ */}
      <section style={{ ...sectionBase("#ffffff"), textAlign: "center" }} className="section-padding">
        <div style={{ ...inner, display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
          <h2
            className="fade-up section-title-lg"
            style={{
              fontSize: "56px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1d1d1f",
              maxWidth: "720px",
            }}
          >
            Votre site. Livré en 48 heures.
          </h2>

          {/* Browser */}
          <div
            className="fade-up browser-frame"
            style={{
              maxWidth: "880px",
              width: "100%",
              boxShadow: "0 40px 80px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* Chrome bar */}
            <div
              style={{
                background: "#f5f5f7",
                height: "40px",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                gap: "8px",
              }}
            >
              {/* Traffic lights */}
              <div style={{ display: "flex", gap: "6px" }}>
                {[["#ff5f57"], ["#ffbd2e"], ["#28ca41"]].map(([c], i) => (
                  <div
                    key={i}
                    style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }}
                  />
                ))}
              </div>
              {/* URL bar */}
              <div
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: "13px",
                  color: "#6e6e73",
                  fontWeight: 400,
                }}
              >
                lessence-spa.stampify.ch
              </div>
              <div style={{ width: "48px" }} />
            </div>
            {/* Screen */}
            <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
              <img
                src={browserImg}
                alt="Exemple de site Stampify"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
            </div>
          </div>

          <a
            href="https://loyalty-cards-rho.vercel.app/lessence-spa.html"
            target="_blank"
            rel="noopener noreferrer"
            style={pillBlue}
            className="fade-up pill-blue-hover"
          >
            Voir la démo complète →
          </a>
          <p className="fade-up" style={{ fontSize: "13px", color: "#6e6e73" }}>
            Exemple réel créé avec Stampify
          </p>
        </div>
      </section>

      {/* ═══════════ 6. REVIEWS ═══════════ */}
      <section style={sectionBase("#f5f5f7")} className="section-padding">
        <div style={inner}>
          <h2
            className="fade-up section-title-md"
            style={{
              fontSize: "48px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1d1d1f",
              textAlign: "center",
              marginBottom: "60px",
            }}
          >
            Ils nous font confiance.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }} className="features-grid">
            {[
              {
                text: "Notre café a vu ses visites récurrentes augmenter de 30% en 2 mois. La carte fidélité NFC, c'est magique.",
                name: "Sophie M.",
                role: "Café des Artistes, Lausanne",
              },
              {
                text: "Stampify a livré notre site en 36h. Design parfait, notre boulangerie n'a jamais eu autant de commandes en ligne.",
                name: "Jean-Pierre B.",
                role: "Boulangerie Martin, Lausanne",
              },
              {
                text: "La roue de la fortune fait que nos clientes reviennent chaque semaine. Le ROI est incroyable.",
                name: "Aline K.",
                role: "Nail Studio, Lausanne",
              },
            ].map((r, i) => (
              <div key={i} className="fade-up" style={{ ...card, padding: "32px" }}>
                <Stars />
                <p style={{ fontSize: "17px", color: "#1d1d1f", lineHeight: 1.6, marginBottom: "20px" }}>
                  "{r.text}"
                </p>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#1d1d1f" }}>{r.name}</p>
                <p style={{ fontSize: "13px", color: "#6e6e73", marginTop: "2px" }}>{r.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 7. PRICING ═══════════ */}
      <section style={{ ...sectionBase("#ffffff"), textAlign: "center" }} className="section-padding">
        <div style={{ ...inner, display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
          <h2
            className="fade-up section-title-lg"
            style={{
              fontSize: "56px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1d1d1f",
            }}
          >
            Un investissement. Pour toujours.
          </h2>

          {/* Main card */}
          <div
            className="fade-up"
            style={{
              maxWidth: "640px",
              width: "100%",
              background: "#ffffff",
              borderRadius: "24px",
              padding: "48px",
              boxShadow: "0 2px 40px rgba(0,0,0,0.08)",
              textAlign: "left",
            }}
          >
            {/* Badge */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <span
                style={{
                  background: "#e6f7f1",
                  color: "#1d9e75",
                  borderRadius: "980px",
                  padding: "6px 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                }}
              >
                Le choix de nos clients
              </span>
            </div>

            {/* Price */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <span
                style={{
                  fontSize: "80px",
                  fontWeight: 700,
                  letterSpacing: "-3px",
                  color: "#1d1d1f",
                  lineHeight: 1,
                }}
              >
                990
              </span>
              <p style={{ fontSize: "17px", color: "#6e6e73", marginTop: "8px" }}>
                CHF · paiement unique · aucun abonnement
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "#f5f5f7", margin: "24px 0" }} />

            {/* Features 2 columns */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px 20px",
                marginBottom: "28px",
              }}
            >
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
              ].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", fontSize: "15px", color: "#1d1d1f" }}>
                  <Check />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Comparatif */}
            <div
              style={{
                background: "#f5f5f7",
                borderRadius: "12px",
                padding: "20px",
                fontSize: "15px",
                color: "#6e6e73",
                lineHeight: 1.6,
                marginBottom: "28px",
              }}
            >
              Une agence suisse facture 1 500–5 000 CHF pour un site seul. Stampify livre site + carte + NFC
              + SEO. Pour <strong style={{ color: "#1d1d1f" }}>990 CHF</strong>. En 48h.
            </div>

            {/* Main CTA */}
            <a
              href={WA_MAIN}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...pillDark,
                display: "block",
                textAlign: "center",
                width: "100%",
                padding: "16px 28px",
              }}
              className="pill-dark-hover"
            >
              Obtenir mon site — 990 CHF
            </a>

            {/* Separator */}
            <p
              style={{
                textAlign: "center",
                fontSize: "13px",
                color: "#6e6e73",
                margin: "28px 0",
                letterSpacing: "0.03em",
              }}
            >
              ━━━ VOUS POUVEZ AUSSI AJOUTER UN SUIVI MENSUEL ━━━
            </p>

            {/* Add-on cards */}
            <div
              className="pricing-addons"
              style={{ display: "flex", gap: "16px", flexDirection: "row" }}
            >
              {/* Essentiel */}
              <div
                style={{
                  flex: 1,
                  background: "#f5f5f7",
                  borderRadius: "18px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Essentiel
                </p>
                <p style={{ fontSize: "32px", fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.02em" }}>
                  49{" "}
                  <span style={{ fontSize: "17px", fontWeight: 400, color: "#6e6e73" }}>CHF/mois</span>
                </p>
                {["Mises à jour contenu", "Support 5j/7", "Rapport mensuel", "1 campagne SMS/mois"].map(
                  (f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", fontSize: "13px", color: "#1d1d1f" }}>
                      <Check />
                      <span>{f}</span>
                    </div>
                  )
                )}
                <a
                  href={WA_ESSENTIEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...pillDark,
                    display: "block",
                    textAlign: "center",
                    fontSize: "14px",
                    padding: "11px 20px",
                    marginTop: "8px",
                  }}
                  className="pill-dark-hover"
                >
                  Activer l'Essentiel
                </a>
              </div>

              {/* Pro */}
              <div
                style={{
                  flex: 1,
                  background: "#1d1d1f",
                  borderRadius: "18px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  position: "relative",
                }}
              >
                {/* Recommended badge */}
                <span
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#ff9f0a",
                    color: "#ffffff",
                    borderRadius: "980px",
                    padding: "3px 12px",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                  }}
                >
                  Recommandé
                </span>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Pro
                </p>
                <p style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>
                  79{" "}
                  <span style={{ fontSize: "17px", fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>
                    CHF/mois
                  </span>
                </p>
                {[
                  "Tout l'Essentiel",
                  "SMS illimités",
                  "Roue de la fortune",
                  "A/B test campagnes",
                  "Support prioritaire 7j/7",
                ].map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", fontSize: "13px", color: "rgba(255,255,255,0.85)" }}>
                    <span style={{ color: "#1d9e75", fontWeight: 600, marginRight: "8px" }}>✓</span>
                    <span>{f}</span>
                  </div>
                ))}
                <a
                  href={WA_PRO}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    background: "#ffffff",
                    color: "#1d1d1f",
                    borderRadius: "980px",
                    padding: "11px 20px",
                    fontSize: "14px",
                    fontWeight: 500,
                    textDecoration: "none",
                    textAlign: "center",
                    marginTop: "8px",
                    transition: "transform 0.2s ease",
                  }}
                  className="pill-dark-hover"
                >
                  Activer le Pro
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 8. PROCESS ═══════════ */}
      <section style={sectionBase("#f5f5f7")} className="section-padding">
        <div style={inner}>
          <h2
            className="fade-up section-title-md"
            style={{
              fontSize: "48px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1d1d1f",
              textAlign: "center",
              marginBottom: "72px",
            }}
          >
            De zéro à votre site en 48h.
          </h2>

          <div
            className="process-steps"
            style={{ display: "flex", gap: "48px", alignItems: "flex-start" }}
          >
            {[
              {
                num: "01",
                title: "Parlez-nous de votre commerce",
                text: "Un échange sur WhatsApp. On note vos couleurs, horaires, style. 10 minutes.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}>
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                ),
              },
              {
                num: "02",
                title: "On crée tout en 48h",
                text: "Site, carte, plaquette NFC, SEO. Vous validez. On met en ligne.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}>
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                ),
              },
              {
                num: "03",
                title: "Vos clients reviennent",
                text: "Votre commerce est sur Google. La plaquette est sur votre comptoir. Les clients fidèles reviennent automatiquement.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" {...iconStroke}>
                    <path d="M22 7l-11.5 11.5-5-5M18 7l-7.5 7.5M15 7l-4.5 4.5" />
                    <path d="M4 17l4 4L22 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((step, i) => (
              <div key={i} className="fade-up" style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "80px",
                    fontWeight: 700,
                    color: "#e8e8ed",
                    lineHeight: 1,
                    marginBottom: "-16px",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {step.num}
                </p>
                <div style={{ marginBottom: "16px" }}>
                  {step.icon}
                </div>
                <h3
                  style={{
                    fontSize: "21px",
                    fontWeight: 600,
                    color: "#1d1d1f",
                    marginBottom: "10px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: "17px", color: "#6e6e73", lineHeight: 1.6 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 9. DEMOS PREVIEW ═══════════ */}
      <section style={{ ...sectionBase("#ffffff"), textAlign: "center" }} className="section-padding">
        <div style={{ ...inner, display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" }}>
          <div className="fade-up">
            <h2
              className="section-title-md"
              style={{
                fontSize: "48px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "#1d1d1f",
                marginBottom: "12px",
              }}
            >
              Voyez le résultat.
            </h2>
            <p style={{ fontSize: "19px", color: "#6e6e73" }}>
              6 exemples réels. À vos couleurs. En 48h.
            </p>
          </div>

          <div
            className="demos-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              width: "100%",
            }}
          >
            {[
              {
                img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
                badge: "Spa & Beauté",
                name: "L'Essence Spa",
                city: "Lausanne",
                href: "https://loyalty-cards-rho.vercel.app/lessence-spa.html",
              },
              {
                img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
                badge: "Café",
                name: "Café Lumière",
                city: "Genève",
                href: "/demos/cafe-lumiere.html",
              },
              {
                img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
                badge: "Restaurant",
                name: "Bistrot du Léman",
                city: "Lausanne",
                href: "/demos/bistrot-leman.html",
              },
              {
                img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
                badge: "Boulangerie",
                name: "Boulangerie Martin",
                city: "Lausanne",
                href: "/demos/boulangerie-martin.html",
              },
              {
                img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
                badge: "Coiffure",
                name: "Black Scissors",
                city: "Genève",
                href: "/demos/black-scissors.html",
              },
              {
                img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
                badge: "Nail Studio",
                name: "Nail Studio K",
                city: "Lausanne",
                href: "/demos/nail-studio.html",
              },
            ].map((demo, i) => (
              <div
                key={i}
                className="fade-up"
                style={{
                  background: "#f5f5f7",
                  borderRadius: "18px",
                  overflow: "hidden",
                  textAlign: "left",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                  <img
                    src={demo.img}
                    alt={demo.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: "24px" }}>
                  <span
                    style={{
                      background: "#e8f4fd",
                      color: "#0071e3",
                      borderRadius: "980px",
                      padding: "4px 10px",
                      fontSize: "11px",
                      fontWeight: 500,
                      display: "inline-block",
                      marginBottom: "10px",
                    }}
                  >
                    {demo.badge}
                  </span>
                  <p style={{ fontSize: "19px", fontWeight: 600, color: "#1d1d1f", marginBottom: "4px" }}>
                    {demo.name}
                  </p>
                  <p style={{ fontSize: "15px", color: "#6e6e73", marginBottom: "16px" }}>{demo.city}</p>
                  <a
                    href={demo.href}
                    target={demo.href.startsWith("http") ? "_blank" : undefined}
                    rel={demo.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{
                      ...pillBlue,
                      fontSize: "13px",
                      padding: "8px 16px",
                    }}
                    className="pill-blue-hover"
                  >
                    Voir la démo →
                  </a>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/v2/demos"
            className="fade-up"
            style={{ fontSize: "17px", color: "#0071e3", textDecoration: "none", fontWeight: 500 }}
          >
            Voir toutes les démos →
          </Link>
        </div>
      </section>

      {/* ═══════════ 10. BLOG PREVIEW ═══════════ */}
      <section style={sectionBase("#f5f5f7")} className="section-padding">
        <div style={inner}>
          <h2
            className="fade-up section-title-md"
            style={{
              fontSize: "48px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1d1d1f",
              textAlign: "center",
              marginBottom: "60px",
            }}
          >
            Conseils pour votre commerce.
          </h2>

          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}
            className="features-grid"
          >
            {[
              {
                category: "Fidélisation",
                title: "Carte de fidélité digitale pour boulangerie en Suisse : le guide complet 2026",
                excerpt:
                  "Les cartes tampons papier disparaissent. Découvrez comment une carte fidélité digitale peut transformer votre boulangerie.",
                readTime: "6 min",
                href: "/blog/carte-fidelite-digitale-boulangerie-suisse",
              },
              {
                category: "SEO local",
                title: "Comment apparaître en premier sur Google Maps pour votre commerce local",
                excerpt:
                  "Le SEO local, c'est l'arme secrète des commerçants en 2026. Voici les 7 étapes pour dominer les recherches locales.",
                readTime: "8 min",
                href: "/blog",
              },
              {
                category: "Marketing",
                title: "SMS marketing pour restaurants : 15 messages qui font revenir vos clients",
                excerpt:
                  "Les SMS ont un taux d'ouverture de 98%. Voici les templates que nos clients utilisent pour remplir leurs tables.",
                readTime: "5 min",
                href: "/blog",
              },
            ].map((post, i) => (
              <Link
                key={i}
                href={post.href}
                className="fade-up"
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
                  overflow: "hidden",
                  textDecoration: "none",
                  display: "block",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 20px rgba(0,0,0,0.06)";
                }}
              >
                {/* Color accent top */}
                <div style={{ height: "4px", background: "linear-gradient(90deg, #0071e3, #1d9e75)" }} />
                <div style={{ padding: "28px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "#e8f4fd",
                      color: "#0071e3",
                      borderRadius: "980px",
                      padding: "3px 10px",
                      fontSize: "11px",
                      fontWeight: 500,
                      marginBottom: "12px",
                    }}
                  >
                    {post.category}
                  </span>
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: 600,
                      color: "#1d1d1f",
                      lineHeight: 1.4,
                      marginBottom: "12px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {post.title}
                  </h3>
                  <p style={{ fontSize: "15px", color: "#6e6e73", lineHeight: 1.6, marginBottom: "16px" }}>
                    {post.excerpt}
                  </p>
                  <p style={{ fontSize: "13px", color: "#0071e3", fontWeight: 500 }}>
                    Lire · {post.readTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 11. CTA FINAL ═══════════ */}
      <section
        style={{
          background: "#1d1d1f",
          padding: "140px 20px",
          textAlign: "center",
        }}
        className="section-padding"
      >
        <div style={{ ...inner, display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>
          <h2
            className="fade-up section-title-lg"
            style={{
              fontSize: "56px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#ffffff",
              maxWidth: "720px",
              lineHeight: 1.1,
            }}
          >
            Votre commerce mérite d'être en ligne.
          </h2>
          <p
            className="fade-up"
            style={{
              fontSize: "19px",
              color: "rgba(255,255,255,0.7)",
              maxWidth: "520px",
              lineHeight: 1.6,
            }}
          >
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
              padding: "16px 32px",
              fontSize: "17px",
              fontWeight: 500,
              textDecoration: "none",
              transition: "transform 0.2s ease",
            }}
          >
            Obtenir mon site maintenant →
          </a>
        </div>
      </section>
    </>
  );
}
