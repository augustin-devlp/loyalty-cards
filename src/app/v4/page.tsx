"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

/* ─── Shared styles ─── */
const s = {
  greenBtn: {
    background: "#1d9e75", color: "#fff", borderRadius: "980px",
    padding: "16px 32px", fontSize: "17px", fontWeight: 600,
    textDecoration: "none", display: "inline-block",
    transition: "background 0.2s, transform 0.2s",
  } as React.CSSProperties,
  outlineBtn: {
    background: "transparent", color: "#1a1a1a",
    border: "1.5px solid #1a1a1a", borderRadius: "980px",
    padding: "16px 32px", fontSize: "17px", fontWeight: 600,
    textDecoration: "none", display: "inline-block",
    transition: "background 0.2s, color 0.2s",
  } as React.CSSProperties,
};

/* ─── Word-by-word title ─── */
function WordTitle({ text, style }: { text: string; style?: React.CSSProperties }) {
  const words = text.split(" ");
  return (
    <h1 style={style}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: "0.22em",
            opacity: 0,
            transform: "translateY(12px)",
            animation: "wordIn 0.5s ease forwards",
            animationDelay: `${i * 0.06}s`,
          }}
        >
          {w}
        </span>
      ))}
    </h1>
  );
}

/* ─── Hero illustration ─── */
function HeroIllustration() {
  return (
    <div style={{
      position: "relative", width: "380px", maxWidth: "100%",
      height: "200px", margin: "0 auto",
      animation: "float 4s ease-in-out infinite",
    }}>
      {/* NFC plaque — left */}
      <div style={{
        position: "absolute", top: "50px", left: "0px",
        width: "110px", height: "70px", borderRadius: "10px",
        background: "linear-gradient(135deg, #8B6914 0%, #6B4F10 100%)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
        transform: "rotate(-8deg)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "4px",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none" />
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" fill="none" />
          <circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.8)" />
        </svg>
        <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.8)", textAlign: "center", fontWeight: 600, lineHeight: 1.2 }}>
          Boulangerie<br />Martin
        </span>
      </div>

      {/* Loyalty card — center */}
      <div style={{
        position: "absolute", top: "20px", left: "50px",
        width: "240px", height: "150px", borderRadius: "16px",
        background: "linear-gradient(135deg, #1d9e75 0%, #17886a 100%)",
        boxShadow: "0 24px 60px rgba(29,158,117,0.25)",
        padding: "16px", display: "flex", flexDirection: "column", gap: "8px",
        zIndex: 2,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Stampify</span>
          <div style={{ width: "16px", height: "16px", background: "rgba(255,255,255,0.15)", borderRadius: "3px" }} />
        </div>
        <span style={{ fontSize: "14px", color: "#fff", fontWeight: 700 }}>Boulangerie Martin</span>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              width: "16px", height: "16px", borderRadius: "50%",
              background: i < 7 ? "#fff" : "rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {i < 7 && <span style={{ fontSize: "8px", color: "#1d9e75", fontWeight: 700 }}>✓</span>}
            </div>
          ))}
        </div>
        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.75)" }}>7 / 10 tampons · encore 3 pour votre café</span>
      </div>

      {/* Phone — right */}
      <div style={{
        position: "absolute", top: "10px", right: "0px",
        width: "80px", height: "160px", borderRadius: "20px",
        background: "#1a1a1a",
        boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
        transform: "rotate(6deg)",
        padding: "8px",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          flex: 1, background: "#fafaf8", borderRadius: "14px",
          padding: "10px", display: "flex", flexDirection: "column",
          alignItems: "center", gap: "6px",
        }}>
          <div style={{ width: "50px", height: "30px", background: "#1d9e75", borderRadius: "6px" }} />
          <span style={{ fontSize: "8px", color: "#1d9e75", fontWeight: 600 }}>✓ Tampon ajouté</span>
        </div>
        <div style={{ width: "30px", height: "3px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", margin: "6px auto 2px" }} />
      </div>
    </div>
  );
}

/* ─── Loyalty card animated ─── */
function LoyaltyCardAnimated() {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = useCallback(() => {
    countRef.current += 1;
    if (countRef.current > 10) {
      countRef.current = 0;
      setCount(0);
      timerRef.current = setTimeout(step, 1000);
    } else {
      setCount(countRef.current);
      timerRef.current = setTimeout(step, 400);
    }
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(step, 800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [step]);

  return (
    <div style={{
      width: "320px", maxWidth: "100%", height: "200px",
      borderRadius: "20px",
      background: "linear-gradient(135deg, #1d9e75 0%, #17886a 100%)",
      boxShadow: "0 32px 80px rgba(29,158,117,0.2)",
      padding: "24px", display: "flex", flexDirection: "column", gap: "12px",
      margin: "0 auto",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: "16px", color: "#fff", fontWeight: 700 }}>Café Lumière</span>
        <div style={{ width: "20px", height: "20px", background: "rgba(255,255,255,0.15)", borderRadius: "4px" }} />
      </div>
      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>1 café offert à la 10ème visite</span>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{
            width: "22px", height: "22px", borderRadius: "50%",
            background: i < count ? "#fff" : "rgba(255,255,255,0.2)",
            transform: i < count ? "scale(1)" : "scale(0.85)",
            transition: "all 0.3s ease",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {i < count && <span style={{ fontSize: "10px", color: "#1d9e75", fontWeight: 700 }}>✓</span>}
          </div>
        ))}
      </div>
      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)" }}>
        {count} / 10 tampons{count > 0 ? ` · encore ${Math.max(0, 10 - count)} pour votre récompense` : ""}
      </span>
    </div>
  );
}

/* ─── Wheel SVG ─── */
function WheelSVG() {
  const segments = [
    { color: "#1d9e75", textColor: "#fff", label: "Café\noffert" },
    { color: "#f4f4f2", textColor: "#1a1a1a", label: "-10%" },
    { color: "#1a1a1a", textColor: "#fff", label: "Tampon\n×2" },
    { color: "#e8f7f2", textColor: "#1d9e75", label: "-20%" },
    { color: "#555555", textColor: "#fff", label: "Surprise\n!" },
    { color: "#ffffff", textColor: "#1a1a1a", label: "-5%" },
  ];

  const cx = 150, cy = 150, r = 130;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });

  const textPts = Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 + 30) * Math.PI) / 180;
    return { x: cx + 85 * Math.cos(a), y: cy + 85 * Math.sin(a) };
  });

  return (
    <div style={{ position: "relative", width: "280px", height: "280px", margin: "0 auto" }}>
      {/* Arrow */}
      <div style={{
        position: "absolute", top: "-6px", left: "50%",
        transform: "translateX(-50%)",
        width: 0, height: 0,
        borderLeft: "10px solid transparent",
        borderRight: "10px solid transparent",
        borderTop: "20px solid #1a1a1a",
        zIndex: 10,
      }} />

      <svg
        width="280" height="280" viewBox="0 0 300 300"
        style={{ animation: "spin 10s linear infinite" }}
      >
        {segments.map((seg, i) => {
          const s0 = pts[i];
          const s1 = pts[(i + 1) % 6];
          const tp = textPts[i];
          const lines = seg.label.split("\n");
          return (
            <g key={i}>
              <path
                d={`M ${cx} ${cy} L ${s0.x.toFixed(1)} ${s0.y.toFixed(1)} A ${r} ${r} 0 0 1 ${s1.x.toFixed(1)} ${s1.y.toFixed(1)} Z`}
                fill={seg.color}
                stroke={seg.color === "#ffffff" ? "#e0e0e0" : seg.color}
                strokeWidth="1"
              />
              {lines.map((line, li) => (
                <text
                  key={li}
                  x={tp.x}
                  y={tp.y + li * 13 - (lines.length - 1) * 6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={seg.textColor}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
        {/* Center */}
        <circle cx={cx} cy={cy} r="40" fill="white" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="800" fill="#1d9e75" fontFamily="'Plus Jakarta Sans', sans-serif">
          S
        </text>
        {/* Shadow ring */}
        <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
      </svg>
    </div>
  );
}

/* ─── SMS mockup ─── */
function SMSMockup() {
  const bubbles = [
    { text: "Il vous reste 2 tampons chez la Boulangerie Martin 🥐", from: false, delay: "0s" },
    { text: "Ce weekend −20% sur les viennoiseries !", from: false, delay: "1.5s" },
    { text: "🎉 Votre récompense est prête !", from: true, delay: "3s" },
  ];

  return (
    <div style={{
      width: "240px", background: "#1a1a1a", borderRadius: "36px",
      padding: "16px 10px", boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
      margin: "0 auto", position: "relative",
    }}>
      {/* Notch */}
      <div style={{ width: "80px", height: "22px", background: "#1a1a1a", borderRadius: "0 0 14px 14px", margin: "0 auto 10px" }} />
      {/* Screen */}
      <div style={{ background: "#fafaf8", borderRadius: "24px", minHeight: "300px", padding: "14px 10px", display: "flex", flexDirection: "column", gap: "10px", overflow: "hidden" }}>
        <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, color: "#1a1a1a", marginBottom: "4px" }}>Messages</div>
        {bubbles.map((b, i) => (
          <div
            key={i}
            style={{
              background: b.from ? "#1d9e75" : "#e8f7f2",
              color: b.from ? "#fff" : "#1a1a1a",
              borderRadius: b.from ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              padding: "10px 12px",
              fontSize: "11px",
              lineHeight: 1.45,
              maxWidth: "90%",
              alignSelf: b.from ? "flex-end" : "flex-start",
              opacity: 0,
              animation: `smsBubble 4.5s ${b.delay} infinite`,
            }}
          >
            {b.text}
          </div>
        ))}
      </div>
      {/* Home bar */}
      <div style={{ width: "60px", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", margin: "10px auto 2px" }} />
    </div>
  );
}

/* ─── FAQ Item ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: "#fff", borderRadius: "16px", padding: "22px 24px",
        cursor: "pointer", marginBottom: "8px",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <span style={{ fontWeight: 600, fontSize: "16px", color: "#1a1a1a", lineHeight: 1.4 }}>{q}</span>
        <span style={{
          flexShrink: 0, fontSize: "20px", color: "#1d9e75", fontWeight: 300,
          transform: open ? "rotate(45deg)" : "none",
          transition: "transform 0.25s ease",
        }}>+</span>
      </div>
      <div style={{
        maxHeight: open ? "300px" : "0",
        overflow: "hidden",
        transition: "max-height 0.3s ease",
      }}>
        <p style={{ marginTop: "14px", fontSize: "15px", color: "#555555", lineHeight: 1.7 }}>{a}</p>
      </div>
    </div>
  );
}

/* ─── NFC animation ─── */
function NFCAnimation() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "24px 0" }}>
      {/* Plaque */}
      <div style={{
        width: "80px", height: "52px", borderRadius: "8px",
        background: "linear-gradient(135deg, #8B6914, #6B4F10)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.9)", fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>NFC</span>
      </div>
      {/* Arcs SVG */}
      <svg width="40" height="40" viewBox="0 0 40 40">
        {[12, 20, 28].map((r, i) => (
          <path
            key={i}
            d={`M 5 20 Q 20 ${20 - r / 2} 35 20`}
            fill="none"
            stroke="#1d9e75"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0"
            style={{ animation: `arcFade 1.5s ${i * 0.4}s ease-in-out infinite` }}
          />
        ))}
      </svg>
      {/* Phone */}
      <div style={{
        width: "36px", height: "64px", borderRadius: "10px",
        background: "#1a1a1a", padding: "5px",
        display: "flex", flexDirection: "column",
        animation: "phoneApproach 2s ease-in-out infinite alternate",
        flexShrink: 0,
      }}>
        <div style={{ flex: 1, background: "#fafaf8", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "12px", height: "8px", background: "#1d9e75", borderRadius: "2px" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Demo card ─── */
const demos = [
  { name: "Spa Essence", type: "Spa", city: "Genève", badge: "⭐ Le plus demandé", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80", link: "https://loyalty-cards-rho.vercel.app/lessence-spa.html", ext: true },
  { name: "Café Lumière", type: "Café", city: "Genève", badge: null, img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", link: "/demos/cafe-lumiere.html", ext: false },
  { name: "Bistrot du Coin", type: "Restaurant", city: "Fribourg", badge: null, img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", link: "/demos/bistrot-du-coin.html", ext: false },
  { name: "Boulangerie Martin", type: "Boulangerie", city: "Lausanne", badge: null, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80", link: "/demos/boulangerie-martin.html", ext: false },
  { name: "Black Scissors", type: "Barbershop", city: "Genève", badge: null, img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", link: "/demos/black-scissors.html", ext: false },
  { name: "Nail Studio", type: "Manucure", city: "Lausanne", badge: null, img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80", link: "/demos/nail-studio.html", ext: false },
];

const features = [
  {
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#1d9e75" strokeWidth="1.5" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="#1d9e75" strokeWidth="1.5" /></svg>,
    title: "Site professionnel",
    desc: "5 pages, SEO local, domaine .ch inclus.",
  },
  {
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#1d9e75" strokeWidth="1.5" /><path d="M3 9h18" stroke="#1d9e75" strokeWidth="1.5" /></svg>,
    title: "Carte fidélité digitale",
    desc: "QR code ou NFC. Aucune app requise.",
  },
  {
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#1d9e75" strokeWidth="1.5" strokeLinejoin="round" /></svg>,
    title: "Plaquette NFC gravée",
    desc: "En bois, à votre nom, sur votre comptoir.",
  },
  {
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#1d9e75" strokeWidth="1.5" /></svg>,
    title: "Campagnes SMS",
    desc: "Envoyez une promo en 2 clics.",
  },
  {
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#1d9e75" strokeWidth="1.5" /><path d="M16 2v4M8 2v4M3 10h18" stroke="#1d9e75" strokeWidth="1.5" /></svg>,
    title: "Réservations & commandes",
    desc: "Table, RDV, pré-commande en ligne.",
  },
  {
    svg: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20v-6" stroke="#1d9e75" strokeWidth="2" strokeLinecap="round" /></svg>,
    title: "Tableau de bord",
    desc: "Stats temps réel, accessible partout.",
  },
];

const comparatif = [
  { feature: "Site vitrine personnalisé", st: "✓", pz: "✗" },
  { feature: "Votre propre branding", st: "✓", pz: "✗ (logo Poinz)" },
  { feature: "Carte fidélité digitale", st: "✓", pz: "✓" },
  { feature: "Plaquette NFC gravée", st: "✓", pz: "✗" },
  { feature: "Domaine .ch à votre nom", st: "✓", pz: "✗" },
  { feature: "SEO local optimisé", st: "✓", pz: "✗" },
  { feature: "Campagnes SMS", st: "✓", pz: "Limité" },
  { feature: "Dashboard analytics", st: "✓", pz: "Limité" },
  { feature: "Sans abonnement obligatoire", st: "✓", pz: "✗" },
  { feature: "Propriétaire à 100%", st: "✓", pz: "✗" },
];

const faqs = [
  { q: "Est-ce que mes clients doivent télécharger une application ?", a: "Non. La carte s'ouvre directement dans Safari ou Chrome via QR code ou NFC. Aucune app, aucun compte." },
  { q: "Que se passe-t-il après la première année ?", a: "Domaine ~25 CHF/an. Hébergement ~5 CHF/mois (offert la 1ère année). Carte fidélité et dashboard : à vie. Aucun abonnement imposé." },
  { q: "Est-ce que je suis propriétaire du site ?", a: "Oui, à 100%. Code source, domaine, contenu — tout est à vous. Vous êtes libre." },
  { q: "Combien de temps pour mon site en ligne ?", a: "48h à partir de vos infos : photos, textes, horaires, couleurs. Garanti." },
  { q: "Vous travaillez en France aussi ?", a: "Oui. Suisse romande et France. Contactez-nous pour en discuter." },
  { q: "Quelle différence avec Poinz ?", a: "Poinz est gratuit mais tout reste sous leur marque. Avec Stampify : votre site, votre nom, votre relation client. 100% personnalisé." },
];

/* ─── Main page ─── */
export default function V4Page() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes wordIn { to { opacity: 1; transform: translateY(0); } }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes smsBubble {
          0%, 8% { opacity: 0; transform: translateY(8px); }
          14%, 60% { opacity: 1; transform: translateY(0); }
          68%, 100% { opacity: 0; transform: translateY(0); }
        }
        @keyframes arcFade {
          0%, 20% { opacity: 0; }
          50% { opacity: 0.9; }
          80%, 100% { opacity: 0; }
        }
        @keyframes phoneApproach {
          from { transform: translateX(16px); }
          to { transform: translateX(0px); }
        }
        .demo-card4:hover { transform: translateY(-6px); box-shadow: 0 12px 40px rgba(0,0,0,0.10) !important; }
        .feat-card4:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.08) !important; }
        .green-btn:hover { background: #17886a !important; transform: scale(1.02); }
        .outline-btn:hover { background: #1a1a1a !important; color: #fff !important; }
        @media (max-width: 700px) {
          .hero-title4 { font-size: 52px !important; line-height: 1.05 !important; }
          .sec-title4 { font-size: 40px !important; }
          .split4 { flex-direction: column !important; }
          .split4-rev { flex-direction: column !important; }
          .btn-row4 { flex-direction: column !important; align-items: stretch !important; }
          .demo-grid4 { grid-template-columns: 1fr !important; }
          .feat-grid4 { grid-template-columns: 1fr !important; }
          .steps4 { flex-direction: column !important; }
          .tarif-addons4 { flex-direction: column !important; }
        }
      `}</style>

      {/* ══ 1. HERO ══ */}
      <section style={{ background: "#fafaf8", padding: "120px 20px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Badge */}
          <div className="fade-up" style={{ marginBottom: "28px" }}>
            <span style={{
              display: "inline-block", background: "#e8f7f2", color: "#1d9e75",
              borderRadius: "980px", padding: "6px 16px", fontSize: "13px", fontWeight: 600,
            }}>
              ✦ Livraison en 48h garantie
            </span>
          </div>

          <WordTitle
            text="Vos clients reviennent. À chaque fois."
            style={{
              fontSize: "80px", fontWeight: 800, letterSpacing: "-0.04em",
              lineHeight: 1.0, color: "#1a1a1a", marginBottom: "24px",
            }}
          />

          <p className="fade-up" style={{
            fontSize: "21px", color: "#555555", maxWidth: "520px",
            margin: "0 auto 40px", lineHeight: 1.55,
          }}>
            Site vitrine + carte fidélité digitale + plaquette NFC.<br />
            990 CHF, une fois, à vous pour toujours.
          </p>

          <div className="fade-up btn-row4" style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={WA_MAIN} target="_blank" rel="noopener noreferrer"
              className="green-btn"
              style={s.greenBtn}
            >
              Obtenir mon site — 990 CHF
            </a>
            <Link href="/v4/demos" className="outline-btn" style={s.outlineBtn}>
              Voir les démos →
            </Link>
          </div>

          <p className="fade-up" style={{ marginTop: "32px", fontSize: "13px", color: "#555555", letterSpacing: "0.02em" }}>
            990 CHF · Paiement unique · 48h · Suisse romande
          </p>

          {/* CSS illustration */}
          <div className="fade-up" style={{ marginTop: "64px" }}>
            <HeroIllustration />
          </div>

          {/* Hero context image fallback (Banana Pro — using Unsplash fallback) */}
          <div className="fade-up" style={{ marginTop: "48px" }}>
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80"
              alt="Exemple réel d'utilisation Stampify — boulangerie avec carte fidélité digitale"
              loading="lazy"
              style={{
                width: "100%", maxWidth: "800px", borderRadius: "20px",
                boxShadow: "0 32px 80px rgba(0,0,0,0.12)", margin: "0 auto",
              }}
            />
            <p style={{ marginTop: "10px", fontSize: "13px", color: "#555555" }}>
              Exemple réel d&apos;utilisation Stampify
            </p>
          </div>
        </div>
      </section>

      {/* ══ 2. AVIS ══ */}
      <section style={{ background: "#f4f4f2", padding: "160px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 className="fade-up sec-title4" style={{ fontSize: "56px", fontWeight: 700, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "56px" }}>
            Ils nous font confiance.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
            {[
              { name: "Sophie M.", biz: "Spa Essence, Lausanne", text: "Mon site était prêt en 36h. Les clients scannent la carte fidélité directement à la caisse. Parfait.", init: "SM" },
              { name: "Karim B.", biz: "Black Scissors, Genève", text: "Franchement impressionné. En 48h j'avais tout : site, carte, NFC. Le dashboard est ultra simple.", init: "KB" },
              { name: "Marie-Claire F.", biz: "Boulangerie Martin, Lausanne", text: "Le QR menu a tout changé. On économise sur l'impression et les clients adorent commander en ligne.", init: "MF" },
            ].map((r, i) => (
              <div
                key={i}
                className="fade-up"
                style={{
                  background: "#fff", borderRadius: "20px", padding: "32px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  transition: "transform 0.3s ease",
                  transitionDelay: `${i * 0.08}s`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                <div style={{ color: "#f5a623", fontSize: "16px", marginBottom: "10px" }}>★★★★★</div>
                <div style={{ fontSize: "48px", color: "#e8f7f2", lineHeight: 1, marginBottom: "8px", fontFamily: "Georgia, serif" }}>&ldquo;</div>
                <p style={{ fontSize: "16px", color: "#1a1a1a", lineHeight: 1.7, marginBottom: "20px" }}>{r.text}</p>
                <div style={{ height: "1px", background: "#f4f4f2", marginBottom: "16px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "#e8f7f2", color: "#1d9e75",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: 700, flexShrink: 0,
                  }}>
                    {r.init}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a" }}>{r.name}</div>
                    <div style={{ fontSize: "12px", color: "#555555" }}>{r.biz}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. DÉMOS ══ */}
      <section style={{ background: "#fafaf8", padding: "160px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 className="fade-up sec-title4" style={{ fontSize: "56px", fontWeight: 700, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "16px" }}>
            Voyez ce qu&apos;on peut faire<br />pour votre commerce.
          </h2>
          <p className="fade-up" style={{ fontSize: "19px", color: "#555555", textAlign: "center", marginBottom: "48px", lineHeight: 1.5 }}>
            6 exemples réels. Fonctionnels. À vos couleurs. En 48h.
          </p>
          <div className="demo-grid4" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "40px" }}>
            {demos.map((d, i) => (
              <div
                key={i}
                className="fade-up demo-card4"
                style={{
                  background: "#fff", borderRadius: "20px", overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  transitionDelay: `${i * 0.06}s`,
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={d.img} alt={d.name} loading="lazy"
                    style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }}
                  />
                  {d.badge && (
                    <div style={{
                      position: "absolute", top: "10px", left: "10px",
                      background: "#1d9e75", color: "#fff",
                      borderRadius: "980px", padding: "3px 10px", fontSize: "11px", fontWeight: 600,
                    }}>
                      {d.badge}
                    </div>
                  )}
                </div>
                <div style={{ padding: "20px" }}>
                  <div style={{
                    display: "inline-block", background: "#e8f7f2", color: "#1d9e75",
                    borderRadius: "980px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, marginBottom: "8px",
                  }}>
                    {d.type}
                  </div>
                  <div style={{ fontSize: "17px", fontWeight: 600, color: "#1a1a1a", marginBottom: "2px" }}>{d.name}</div>
                  <div style={{ fontSize: "13px", color: "#555555", marginBottom: "12px" }}>{d.city}</div>
                  <a
                    href={d.link}
                    target={d.ext ? "_blank" : undefined}
                    rel={d.ext ? "noopener noreferrer" : undefined}
                    style={{ fontSize: "13px", color: "#1d9e75", fontWeight: 600, textDecoration: "none", transition: "letter-spacing 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.letterSpacing = "0.02em")}
                    onMouseLeave={(e) => (e.currentTarget.style.letterSpacing = "0")}
                  >
                    Voir la démo →
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="fade-up" style={{ textAlign: "center" }}>
            <Link href="/v4/demos" style={{ fontSize: "15px", color: "#1d9e75", fontWeight: 600, textDecoration: "none" }}>
              Voir toutes les démos →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 4. FEATURES ══ */}
      <section style={{ background: "#f4f4f2", padding: "160px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 className="fade-up sec-title4" style={{ fontSize: "56px", fontWeight: 700, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "16px" }}>
            Tout ce dont votre commerce<br />a besoin. Réuni.
          </h2>
          <p className="fade-up" style={{ fontSize: "19px", color: "#555555", textAlign: "center", marginBottom: "48px" }}>Un seul produit. Zéro app. Prêt en 48h.</p>
          <div className="feat-grid4" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="fade-up feat-card4"
                style={{
                  background: "#fff", borderRadius: "20px", padding: "32px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  transitionDelay: `${i * 0.06}s`,
                }}
              >
                <div style={{
                  width: "56px", height: "56px", borderRadius: "12px",
                  background: "#e8f7f2", display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: "16px",
                }}>
                  {f.svg}
                </div>
                <div style={{ fontSize: "17px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>{f.title}</div>
                <div style={{ fontSize: "14px", color: "#555555", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <div className="fade-up" style={{ textAlign: "center", marginTop: "36px" }}>
            <Link href="/v4/fonctionnalites" style={{ fontSize: "15px", color: "#1d9e75", fontWeight: 600, textDecoration: "none" }}>
              Toutes les fonctionnalités →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 5. PLAQUETTE NFC ══ */}
      <section style={{ background: "#fafaf8", padding: "160px 20px" }}>
        <div className="split4" style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap" }}>
          {/* Image */}
          <div className="fade-up" style={{ flex: "1 1 360px", display: "flex", justifyContent: "center" }}>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=880&q=80"
              alt="Plaquette NFC en bois gravée Stampify — produit premium pour commerce local"
              loading="lazy"
              style={{ width: "100%", maxWidth: "440px", borderRadius: "20px", boxShadow: "0 24px 60px rgba(0,0,0,0.10)" }}
            />
          </div>
          {/* Text */}
          <div style={{ flex: "1 1 320px" }}>
            <div className="fade-up" style={{ marginBottom: "16px" }}>
              <span style={{ display: "inline-block", background: "#e8f7f2", color: "#1d9e75", borderRadius: "980px", padding: "6px 14px", fontSize: "13px", fontWeight: 600 }}>
                Plaquette NFC incluse
              </span>
            </div>
            <h2 className="fade-up sec-title4" style={{ fontSize: "56px", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "20px" }}>
              En bois.<br />Gravée à votre nom.<br />Livrée avec votre commande.
            </h2>
            <p className="fade-up" style={{ fontSize: "17px", color: "#555555", lineHeight: 1.7, marginBottom: "24px" }}>
              La plaquette est posée sur votre comptoir. Vos clients approchent leur téléphone. Leur carte fidélité s&apos;ouvre instantanément. Sans app. Sans compte. Sans friction.
            </p>
            <ul className="fade-up" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {["Gravure laser personnalisée", "Compatible iPhone et Android", "Fonctionne aussi avec QR code imprimable", "Livrée avec le reste de votre commande"].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", color: "#1a1a1a", transitionDelay: `${i * 0.08}s` }}>
                  <span style={{ color: "#1d9e75", fontWeight: 700 }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <NFCAnimation />
          </div>
        </div>
      </section>

      {/* ══ 6. USAGE RÉEL ══ */}
      <section style={{ background: "#f4f4f2", padding: "160px 20px" }}>
        <div className="split4-rev" style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap" }}>
          {/* Text */}
          <div style={{ flex: "1 1 320px" }}>
            <h2 className="fade-up sec-title4" style={{ fontSize: "56px", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "20px" }}>
              Vos clients adorent.<br />Vos concurrents, moins.
            </h2>
            <p className="fade-up" style={{ fontSize: "17px", color: "#555555", lineHeight: 1.7, marginBottom: "28px" }}>
              Chaque commerçant Stampify reçoit sa propre marque, son propre site, sa propre relation client. Pas un profil sur une plateforme tierce. Le vôtre. À 100%.
            </p>
            <div className="fade-up">
              <a
                href="https://loyalty-cards-rho.vercel.app/lessence-spa.html"
                target="_blank" rel="noopener noreferrer"
                className="green-btn"
                style={s.greenBtn}
              >
                Voir un exemple →
              </a>
            </div>
          </div>
          {/* Image */}
          <div className="fade-up" style={{ flex: "1 1 360px", display: "flex", justifyContent: "center" }}>
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=880&q=80"
              alt="Commerçante regardant sa carte fidélité Stampify sur son téléphone — usage réel"
              loading="lazy"
              style={{ width: "100%", maxWidth: "440px", borderRadius: "20px", boxShadow: "0 24px 60px rgba(0,0,0,0.10)" }}
            />
          </div>
        </div>
      </section>

      {/* ══ 7. CARTE FIDÉLITÉ ANIMÉE ══ */}
      <section style={{ background: "#fafaf8", padding: "160px 20px" }}>
        <div className="split4" style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap" }}>
          <div className="fade-up" style={{ flex: "1 1 320px", display: "flex", justifyContent: "center" }}>
            <LoyaltyCardAnimated />
          </div>
          <div style={{ flex: "1 1 320px" }}>
            <div className="fade-up" style={{ marginBottom: "16px" }}>
              <span style={{ display: "inline-block", background: "#e8f7f2", color: "#1d9e75", borderRadius: "980px", padding: "6px 14px", fontSize: "13px", fontWeight: 600 }}>
                Zéro application requise
              </span>
            </div>
            <h2 className="fade-up sec-title4" style={{ fontSize: "56px", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "20px" }}>
              La carte papier<br />finit à la poubelle.<br />La digitale, jamais.
            </h2>
            <p className="fade-up" style={{ fontSize: "17px", color: "#555555", lineHeight: 1.7, marginBottom: "24px" }}>
              Vos clients ne perdent plus leur carte. Chaque passage est enregistré. Vous choisissez la récompense, le nombre de tampons, les couleurs.
            </p>
            <ul className="fade-up" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {["10 cases personnalisables", "QR code ou NFC tap", "Aucune app à télécharger", "Tampons qui n'expirent jamais", "Dashboard en temps réel"].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", color: "#1a1a1a", transitionDelay: `${i * 0.08}s` }}>
                  <span style={{ color: "#1d9e75", fontWeight: 700 }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ 8. ROUE ══ */}
      <section style={{ background: "#f4f4f2", padding: "160px 20px" }}>
        <div className="split4-rev" style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 320px" }}>
            <div className="fade-up" style={{ marginBottom: "16px" }}>
              <span style={{ display: "inline-block", background: "#e8f7f2", color: "#1d9e75", borderRadius: "980px", padding: "6px 14px", fontSize: "13px", fontWeight: 600 }}>
                Gamification incluse
              </span>
            </div>
            <h2 className="fade-up sec-title4" style={{ fontSize: "56px", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "20px" }}>
              Vos clients jouent.<br />Ils reviennent.
            </h2>
            <p className="fade-up" style={{ fontSize: "17px", color: "#555555", lineHeight: 1.7, marginBottom: "28px" }}>
              Activez la roue de la fortune sur la carte fidélité. À chaque visite, vos clients ont une chance de gagner. Taux de retour augmenté de 40%+.
            </p>
            <div className="fade-up">
              <Link href="/v4/demos" className="outline-btn" style={s.outlineBtn}>
                Voir la démo →
              </Link>
            </div>
          </div>
          <div className="fade-up" style={{ flex: "1 1 280px", display: "flex", justifyContent: "center" }}>
            <WheelSVG />
          </div>
        </div>
      </section>

      {/* ══ 9. SMS ══ */}
      <section style={{ background: "#fafaf8", padding: "160px 20px" }}>
        <div className="split4" style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 320px" }}>
            <div className="fade-up" style={{ marginBottom: "16px" }}>
              <span style={{ display: "inline-block", background: "#e8f7f2", color: "#1d9e75", borderRadius: "980px", padding: "6px 14px", fontSize: "13px", fontWeight: 600 }}>
                Add-on à partir de 49 CHF/mois
              </span>
            </div>
            <h2 className="fade-up sec-title4" style={{ fontSize: "56px", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "20px" }}>
              Vos clients reviennent.<br />Automatiquement.
            </h2>
            <p className="fade-up" style={{ fontSize: "17px", color: "#555555", lineHeight: 1.7, marginBottom: "24px" }}>
              15 triggers SMS configurables. Anniversaire, inactivité, récompense, promo flash. Tout se fait sans vous.
            </p>
            <ul className="fade-up" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {["SMS anniversaire automatique", "Relance inactif 14/30/60j", "Rappel réservation automatique", "Promo flash en 2 clics", "SMS récompense fidélité"].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", color: "#1a1a1a", transitionDelay: `${i * 0.08}s` }}>
                  <span style={{ color: "#1d9e75", fontWeight: 700 }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="fade-up" style={{ flex: "1 1 260px", display: "flex", justifyContent: "center" }}>
            <SMSMockup />
          </div>
        </div>
      </section>

      {/* ══ 10. COMPARATIF ══ */}
      <section style={{ background: "#f4f4f2", padding: "160px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 className="fade-up sec-title4" style={{ fontSize: "56px", fontWeight: 700, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "16px" }}>
            Pourquoi Stampify<br />plutôt que Poinz ?
          </h2>
          <p className="fade-up" style={{ fontSize: "19px", color: "#555555", textAlign: "center", maxWidth: "560px", margin: "0 auto 48px", lineHeight: 1.5 }}>
            Poinz est un outil de fidélité gratuit. Stampify est différent : vous obtenez votre propre site, votre propre marque, votre propre relation client. 100% à vous.
          </p>

          {/* 2 mini cards */}
          <div className="fade-up" style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "32px", maxWidth: "600px", margin: "0 auto 32px" }}>
            <div style={{ flex: "1 1 220px", background: "#f4f4f2", borderRadius: "16px", padding: "24px", opacity: 0.7 }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>Avec Poinz</div>
              <div style={{ display: "inline-block", background: "rgba(255,80,80,0.1)", color: "#cc3333", borderRadius: "980px", padding: "3px 10px", fontSize: "11px", fontWeight: 600, marginBottom: "8px" }}>Logo Poinz imposé</div>
              <p style={{ fontSize: "14px", color: "#555555" }}>Votre commerce, leur marque.</p>
            </div>
            <div style={{ flex: "1 1 220px", background: "#e8f7f2", borderRadius: "16px", padding: "24px", border: "2px solid #1d9e75" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>Avec Stampify</div>
              <div style={{ display: "inline-block", background: "#1d9e75", color: "#fff", borderRadius: "980px", padding: "3px 10px", fontSize: "11px", fontWeight: 600, marginBottom: "8px" }}>100% votre marque</div>
              <p style={{ fontSize: "14px", color: "#1a1a1a" }}>Boulangerie Martin — votre nom, votre site.</p>
            </div>
          </div>

          {/* Table */}
          <div className="fade-up" style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", maxWidth: "700px", margin: "0 auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#1a1a1a" }}>
                  <th style={{ textAlign: "left", padding: "14px 20px", color: "#fff", fontWeight: 500 }}>Fonctionnalité</th>
                  <th style={{ textAlign: "center", padding: "14px 16px", color: "#1d9e75", fontWeight: 700 }}>Stampify</th>
                  <th style={{ textAlign: "center", padding: "14px 16px", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Poinz</th>
                </tr>
              </thead>
              <tbody>
                {comparatif.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", background: i % 2 === 0 ? "#fff" : "#fafaf8" }}>
                    <td style={{ padding: "13px 20px", color: "#1a1a1a" }}>{row.feature}</td>
                    <td style={{ textAlign: "center", padding: "13px 16px", color: "#1d9e75", fontWeight: 700 }}>{row.st}</td>
                    <td style={{ textAlign: "center", padding: "13px 16px", color: row.pz === "✗" ? "#cc3333" : "#555", fontWeight: row.pz === "✗" ? 700 : 400 }}>{row.pz}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══ 11. TARIF ══ */}
      <section style={{ background: "#fafaf8", padding: "160px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 className="fade-up sec-title4" style={{ fontSize: "64px", fontWeight: 800, letterSpacing: "-0.04em", textAlign: "center", lineHeight: 1.05, marginBottom: "48px" }}>
            Un seul paiement.<br />Pour toujours.
          </h2>

          {/* Main card */}
          <div className="fade-up" style={{
            background: "#fff", borderRadius: "24px", padding: "48px",
            boxShadow: "0 8px 48px rgba(0,0,0,0.08)",
            maxWidth: "600px", margin: "0 auto 32px",
          }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <span style={{ display: "inline-block", background: "#e8f7f2", color: "#1d9e75", borderRadius: "980px", padding: "6px 16px", fontSize: "13px", fontWeight: 600 }}>
                ✦ LE CHOIX DE NOS CLIENTS
              </span>
            </div>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "96px", fontWeight: 800, letterSpacing: "-4px", color: "#1a1a1a", lineHeight: 1 }}>990</span>
              <span style={{ fontSize: "28px", color: "#555555", fontWeight: 500, verticalAlign: "bottom", marginLeft: "4px" }}> CHF</span>
            </div>
            <p style={{ textAlign: "center", fontSize: "15px", color: "#555555", marginBottom: "24px" }}>paiement unique · aucun abonnement</p>
            <div style={{ height: "1px", background: "#f4f4f2", marginBottom: "24px" }} />
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
              {[
                "Site vitrine 5 pages sur mesure",
                "Carte fidélité digitale 10 cases",
                "Plaquette NFC en bois gravée",
                "Domaine .ch + hébergement 1ère année",
                "SEO local optimisé",
                "QR code imprimable A4/A5",
                "1 campagne SMS offerte",
                "2 retouches incluses",
                "Guide vidéo d'utilisation",
                "Livraison en 48h garantie",
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", color: "#1a1a1a" }}>
                  <span style={{ color: "#1d9e75", fontWeight: 700 }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <div style={{ background: "#f4f4f2", borderRadius: "12px", padding: "16px 20px", marginBottom: "28px" }}>
              <p style={{ fontSize: "14px", color: "#555555", lineHeight: 1.6 }}>
                Une agence suisse facture 1&nbsp;500–5&nbsp;000 CHF pour un site seul. Stampify livre site + carte + NFC + SEO. Pour 990 CHF. En 48h.
              </p>
            </div>
            <a
              href={WA_MAIN} target="_blank" rel="noopener noreferrer"
              className="green-btn"
              style={{ ...s.greenBtn, display: "block", textAlign: "center", width: "100%" }}
            >
              Obtenir mon site — 990 CHF
            </a>
          </div>

          {/* Add-ons */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "#555555", marginBottom: "20px", letterSpacing: "0.04em" }}>
            — Suivi mensuel optionnel —
          </p>
          <div className="tarif-addons4" style={{ display: "flex", gap: "16px", flexWrap: "wrap", maxWidth: "600px", margin: "0 auto" }}>
            {/* Essentiel */}
            <div className="fade-up" style={{ flex: "1 1 220px", background: "#f4f4f2", borderRadius: "16px", padding: "28px" }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginBottom: "4px" }}>49 CHF<span style={{ fontSize: "14px", fontWeight: 400, color: "#555" }}> / mois</span></div>
              <div style={{ fontSize: "12px", color: "#555", marginBottom: "16px" }}>Sans engagement</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                {["SMS manuels débloqués", "15+ triggers automatiques", "Rapport mensuel", "Mises à jour mineures", "Support email"].map((i, idx) => (
                  <li key={idx} style={{ fontSize: "14px", color: "#1a1a1a", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#1d9e75" }}>✓</span> {i}
                  </li>
                ))}
              </ul>
              <a href={WA_MAIN} target="_blank" rel="noopener noreferrer" className="outline-btn" style={{ ...s.outlineBtn, display: "block", textAlign: "center", padding: "12px 20px", fontSize: "15px" }}>
                Choisir Essentiel
              </a>
            </div>
            {/* Pro */}
            <div className="fade-up" style={{ flex: "1 1 220px", background: "#1a1a1a", borderRadius: "16px", padding: "28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "12px", right: "12px", background: "#f5a623", color: "#fff", borderRadius: "980px", padding: "3px 10px", fontSize: "10px", fontWeight: 700 }}>
                RECOMMANDÉ
              </div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>79 CHF<span style={{ fontSize: "14px", fontWeight: 400, color: "rgba(255,255,255,0.5)" }}> / mois</span></div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "16px" }}>Sans engagement</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                {["Tout l'Essentiel", "2 campagnes SMS/mois rédigées", "Support prioritaire 4h", "Modifications avancées", "Revue trimestrielle"].map((i, idx) => (
                  <li key={idx} style={{ fontSize: "14px", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#1d9e75" }}>✓</span> {i}
                  </li>
                ))}
              </ul>
              <a href={WA_MAIN} target="_blank" rel="noopener noreferrer" style={{
                display: "block", textAlign: "center", background: "#fff", color: "#1a1a1a",
                borderRadius: "980px", padding: "12px 20px", fontSize: "15px", fontWeight: 600,
                textDecoration: "none",
              }}>
                Choisir Pro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 12. FAQ ══ */}
      <section style={{ background: "#f4f4f2", padding: "160px 20px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <h2 className="fade-up" style={{ fontSize: "48px", fontWeight: 700, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "48px" }}>
            Questions fréquentes.
          </h2>
          {faqs.map((faq, i) => (
            <div key={i} className="fade-up" style={{ transitionDelay: `${i * 0.06}s` }}>
              <FAQItem q={faq.q} a={faq.a} />
            </div>
          ))}
        </div>
      </section>

      {/* ══ 13. PROCESSUS ══ */}
      <section style={{ background: "#fafaf8", padding: "160px 20px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 className="fade-up" style={{ fontSize: "48px", fontWeight: 700, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "64px" }}>
            De zéro à votre site en 48h.
          </h2>
          <div className="steps4" style={{ display: "flex", gap: "48px", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { n: "01", title: "Parlez-nous", desc: "Un échange WhatsApp. 10 minutes. Couleurs, horaires, style." },
              { n: "02", title: "On crée tout", desc: "Site, carte, NFC, SEO. 48h. Vous validez. On met en ligne." },
              { n: "03", title: "Vos clients reviennent", desc: "Sur Google. Plaquette sur le comptoir. Fidélité automatique." },
            ].map((step, i) => (
              <div key={i} className="fade-up" style={{ flex: "1 1 200px", textAlign: "center", transitionDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: "64px", fontWeight: 800, color: "#e8f7f2", lineHeight: 1, marginBottom: "12px" }}>{step.n}</div>
                <div style={{ fontSize: "21px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>{step.title}</div>
                <div style={{ fontSize: "15px", color: "#555555", lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 14. CTA FINAL ══ */}
      <section style={{ background: "#1a1a1a", padding: "160px 20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=40')",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.10,
        }} />
        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          <h2
            className="fade-up"
            style={{ fontSize: "64px", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.05, marginBottom: "20px" }}
          >
            Votre commerce mérite<br />d&apos;être en ligne.
          </h2>
          <p className="fade-up" style={{ fontSize: "19px", color: "rgba(255,255,255,0.55)", marginBottom: "40px", lineHeight: 1.5 }}>
            990 CHF. 48h. Propriétaire à 100%.<br />Réponse en moins de 2h, 7j/7.
          </p>
          <div className="fade-up">
            <a
              href={WA_MAIN} target="_blank" rel="noopener noreferrer"
              className="green-btn"
              style={{ ...s.greenBtn, padding: "18px 48px", fontSize: "19px" }}
            >
              Obtenir mon site — 990 CHF →
            </a>
          </div>
          <p className="fade-up" style={{ marginTop: "20px", fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
            📱 Réponse sous 2h · 7j/7
          </p>
        </div>
      </section>
    </>
  );
}
