"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Components
import BrandPattern from "@/components/BrandPattern";
import HeroBackground from "@/components/v3/HeroBackground";
import FloatingHands from "@/components/v3/FloatingHands";
import DashboardMockup from "@/components/v3/DashboardMockup";
import MarqueeBar from "@/components/v3/MarqueeBar";

// Hooks
import { useScrollAnimation } from "@/hooks/v3/useScrollAnimation";
import { useCountUp } from "@/hooks/v3/useCountUp";

const WA_MAIN = "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

const IMG = {
  nfcUsage: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=800&q=80",
};

const DEMOS = [
  { name: "Spa Essence", city: "Genève", cat: "Spa", badge: "⭐ Le plus demandé", img: "photo-1540555700478-4be289fbecef", href: "https://loyalty-cards-rho.vercel.app/lessence-spa.html" },
  { name: "Café Lumière", city: "Genève", cat: "Café", img: "photo-1509042239860-f550ce710b93", href: "#" },
  { name: "Bistrot du Coin", city: "Neuchâtel", cat: "Restaurant", img: "photo-1414235077428-338989a2e8c0", href: "#" },
  { name: "Boulangerie Martin", city: "Lausanne", cat: "Boulangerie", img: "photo-1507003211169-0a1dd7228f2d", href: "#" },
  { name: "Black Scissors", city: "Fribourg", cat: "Barbershop", img: "photo-1503951914875-452162b0f3f1", href: "#" },
  { name: "Nail Studio Rose", city: "Lausanne", cat: "Manucure", img: "photo-1604654894610-df63bc536371", href: "#" },
];

function StampMotif({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", pointerEvents: "none", zIndex: 0, ...style }}>
      <div style={{ width: "200px", height: "200px", borderRadius: "50%", border: "1.5px solid #1d9e75", opacity: 0.04 }} />
      <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", bottom: "20px", borderRadius: "50%", border: "1px solid #1d9e75", opacity: 0.03 }} />
    </div>
  );
}

function SpaDropIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13z"
        fill={filled ? "rgba(255,255,255,0.9)" : "none"}
        stroke={filled ? "none" : "rgba(255,255,255,0.3)"}
        strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  );
}

function CoffeeCupIcon({ filled }: { filled: boolean }) {
  const clr = filled ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.28)";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 7h12l-2 12H8L6 7z" fill={filled ? "rgba(255,255,255,0.15)" : "none"} stroke={clr} strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M18 9h2a2 2 0 0 1 0 4h-2" stroke={clr} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M9 7V5M13 7V5" stroke={clr} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function LoyaltyCardAnimated() {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loop = useCallback(() => {
    const fill = () => {
      countRef.current += 1;
      setCount(countRef.current);
      if (countRef.current < 10) {
        timerRef.current = setTimeout(fill, 380);
      } else {
        timerRef.current = setTimeout(() => {
          countRef.current = 0;
          setCount(0);
          timerRef.current = setTimeout(fill, 600);
        }, 1500);
      }
    };
    timerRef.current = setTimeout(fill, 800);
  }, []);

  useEffect(() => {
    loop();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [loop]);

  return (
    <div style={{
      width: "320px", height: "200px", borderRadius: "20px",
      background: "linear-gradient(135deg, #1d9e75, #0D7A5A)",
      boxShadow: "0 32px 80px rgba(29,158,117,0.2)",
      padding: "28px 24px", margin: "0 auto",
    }}>
      <div style={{ fontSize: "18px", fontWeight: 700, color: "white", marginBottom: "4px" }}>Café Lumière</div>
      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", marginBottom: "18px" }}>1 café offert à la 10ème visite</div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} style={{
            width: "26px", height: "26px", borderRadius: "7px",
            background: i < count ? "rgba(255,255,255,0.18)" : "transparent",
            border: i >= count ? "1.5px solid rgba(255,255,255,0.2)" : "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s ease",
            transform: i === count - 1 && count > 0 ? "scale(1.3)" : "scale(1)",
          }}>
            <CoffeeCupIcon filled={i < count} />
          </div>
        ))}
      </div>
      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
        {count} / 10 · {count < 10 ? `encore ${10 - count} pour votre récompense` : "🎉 Récompense disponible !"}
      </div>
    </div>
  );
}

function WheelSVG({ size = 300 }: { size?: number }) {
  const segs = [
    { d: "M150,150 L150,20 A130,130,0,0,1,262.58,85 Z", fill: "#1d9e75", tc: "white", label: "Avis Google", tx: 192.5, ty: 76 },
    { d: "M150,150 L262.58,85 A130,130,0,0,1,262.58,215 Z", fill: "#F2EFE9", tc: "#1A1A1A", label: "−10%", tx: 234, ty: 150 },
    { d: "M150,150 L262.58,215 A130,130,0,0,1,150,280 Z", fill: "#1A1A1A", tc: "white", label: "Tampon ×2", tx: 192.5, ty: 224 },
    { d: "M150,150 L150,280 A130,130,0,0,1,37.42,215 Z", fill: "#E8F7F2", tc: "#0D7A5A", label: "−20%", tx: 108, ty: 224 },
    { d: "M150,150 L37.42,215 A130,130,0,0,1,37.42,85 Z", fill: "#5C5C5C", tc: "white", label: "Surprise !", tx: 66, ty: 150 },
    { d: "M150,150 L37.42,85 A130,130,0,0,1,150,20 Z", fill: "#FFFFFF", tc: "#1A1A1A", label: "−5%", tx: 108, ty: 76 },
  ];
  return (
    <div style={{ position: "relative", width: `${size}px`, height: `${size}px`, margin: "0 auto" }}>
      <div className="wheel-wrap" style={{ width: `${size}px`, height: `${size}px`, filter: "drop-shadow(0 16px 48px rgba(0,0,0,0.08))" }}>
        <svg viewBox="0 0 300 300" width={size} height={size}>
          {segs.map((seg, i) => (
            <g key={i}>
              <path d={seg.d} fill={seg.fill} stroke="#F2EFE9" strokeWidth="2" />
              <text x={seg.tx} y={seg.ty} fill={seg.tc} fontSize="8.5" fontWeight="600" textAnchor="middle" dominantBaseline="middle" fontFamily="Plus Jakarta Sans, sans-serif">{seg.label}</text>
            </g>
          ))}
          <circle cx="150" cy="150" r="30" fill="white" stroke="#F2EFE9" strokeWidth="2" />
          <text x="150" y="150" fill="#1d9e75" fontSize="15" fontWeight="800" textAnchor="middle" dominantBaseline="middle" fontFamily="Plus Jakarta Sans, sans-serif">S</text>
        </svg>
      </div>
      <svg style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }} viewBox="0 0 300 300" width={size} height={size}>
        <polygon points="150,2 144,18 156,18" fill="#1A1A1A" />
      </svg>
    </div>
  );
}

function LotteryMockup({ animKey }: { animKey: number }) {
  return (
    <div style={{ width: "240px", background: "#FBF8F3", borderRadius: "20px", padding: "20px", boxShadow: "0 16px 48px rgba(0,0,0,0.1)", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <span style={{ fontSize: "10px", fontWeight: 700, color: "#5C5C5C", letterSpacing: "0.08em" }}>TIRAGE DU MOIS</span>
        <span style={{ fontSize: "10px", color: "#1d9e75", fontWeight: 600 }}>Café Lumière</span>
      </div>
      <div key={`prize-${animKey}`} style={{
        background: "linear-gradient(135deg, #1d9e75 0%, #0D7A5A 100%)",
        borderRadius: "14px", padding: "14px 16px", marginBottom: "12px",
        animation: "rewardPop 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
        opacity: 0,
      }}>
        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", marginBottom: "4px" }}>LOT À GAGNER</div>
        <div style={{ fontSize: "18px", fontWeight: 800, color: "white", lineHeight: 1.1, marginBottom: "3px" }}>1 mois de café</div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>offert · valeur 60 CHF</div>
      </div>
      <div key={`ticket-${animKey}`} style={{
        background: "#FFFFFF", borderRadius: "12px", padding: "12px 14px",
        display: "flex", alignItems: "center", gap: "12px",
        border: "1.5px dashed #C8E6DB", marginBottom: "10px",
        animation: "rewardPop 0.5s 0.55s cubic-bezier(0.34,1.56,0.64,1) both",
        opacity: 0,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "9px", color: "#5C5C5C", marginBottom: "3px" }}>Votre ticket</div>
          <div style={{ fontSize: "18px", fontWeight: 800, color: "#1d9e75", letterSpacing: "0.04em" }}>#0742</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "9px", color: "#5C5C5C", marginBottom: "3px" }}>Participants</div>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A1A" }}>47</div>
        </div>
      </div>
      <div key={`cta-${animKey}`} style={{
        background: "#E8F7F2", borderRadius: "10px", padding: "10px 12px", textAlign: "center",
        animation: "rewardPop 0.5s 0.9s cubic-bezier(0.34,1.56,0.64,1) both",
        opacity: 0,
      }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#1d9e75", lineHeight: 1.4 }}>Laissez un avis Google</div>
        <div style={{ fontSize: "10px", color: "#0D7A5A", lineHeight: 1.4 }}>pour recevoir votre ticket →</div>
      </div>
    </div>
  );
}

function SMSMockup() {
  const bubbles = [
    { text: "🥐 Il vous reste 2 tampons chez Boulangerie Martin. Revenez !", delay: "0s", bg: "#E8F7F2", color: "#1A1A1A" },
    { text: "Ce weekend −20% sur les viennoiseries !", delay: "1.5s", bg: "#E8F7F2", color: "#1A1A1A" },
    { text: "🎉 Votre récompense est prête !", delay: "3s", bg: "#1d9e75", color: "white" },
  ];
  return (
    <div style={{ width: "240px", height: "480px", background: "#1A1A1A", borderRadius: "36px", padding: "18px", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", margin: "0 auto" }}>
      <div style={{ background: "#FBF8F3", borderRadius: "24px", height: "100%", padding: "16px", display: "flex", flexDirection: "column", gap: "10px", overflow: "hidden" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "#1A1A1A", textAlign: "center", paddingBottom: "8px", borderBottom: "1px solid #F2EFE9" }}>Messages</div>
        {bubbles.map((b, i) => (
          <div key={i} style={{ background: b.bg, borderRadius: "14px", padding: "10px 14px", fontSize: "11px", color: b.color, lineHeight: 1.5, opacity: 0, animation: `smsBubble 4.5s ${b.delay} infinite` }}>{b.text}</div>
        ))}
      </div>
    </div>
  );
}

function NFCAnimation() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "20px 0" }}>
      <div style={{ width: "80px", height: "50px", borderRadius: "8px", background: "linear-gradient(135deg,#8B6914,#6B4F10)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", flexShrink: 0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 12C6 8.686 8.686 6 12 6" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M3 12C3 7.029 7.029 3 12 3" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M9 12C9 10.343 10.343 9 12 9" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="1.5" fill="white"/>
        </svg>
        <span style={{ fontSize: "6px", color: "rgba(255,255,255,0.85)", textAlign: "center" }}>Boulangerie Martin</span>
      </div>
      <div style={{ position: "relative", width: "36px", height: "50px" }}>
        {[0, 1, 2].map((i) => (
          <svg key={i} width="16" height="28" style={{ position: "absolute", left: `${i * 7}px`, top: "11px", opacity: 0, animation: `arcFade 1.8s ${i * 0.4}s infinite` }}>
            <path d="M2 2 Q9 14 2 26" stroke="#1d9e75" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        ))}
      </div>
      <div style={{ width: "42px", height: "72px", borderRadius: "11px", background: "#1A1A1A", animation: "phoneApproach 2s ease-in-out infinite alternate", flexShrink: 0, padding: "4px" }}>
        <div style={{ borderRadius: "8px", background: "#FBF8F3", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "22px", height: "14px", borderRadius: "3px", background: "#1d9e75" }} />
        </div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{ background: "#FFFFFF", borderRadius: "16px", padding: "24px", cursor: "pointer", userSelect: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <span style={{ fontSize: "17px", fontWeight: 600, color: "#1A1A1A" }}>{q}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
          <path d="M5 7.5L10 12.5L15 7.5" stroke="#5C5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ maxHeight: open ? "400px" : "0", overflow: "hidden", transition: "max-height 0.3s ease" }}>
        <p style={{ fontSize: "15px", color: "#5C5C5C", lineHeight: 1.7, paddingTop: "16px" }}>{a}</p>
      </div>
    </div>
  );
}

const greenBtn: React.CSSProperties = {
  background: "#1d9e75", color: "#fff", borderRadius: "980px",
  padding: "16px 32px", fontSize: "17px", fontWeight: 600,
  textDecoration: "none", display: "inline-block",
  transition: "background 0.2s, transform 0.2s",
};
const outlineBtn: React.CSSProperties = {
  background: "transparent", color: "#1A1A1A",
  border: "1.5px solid #1A1A1A", borderRadius: "980px",
  padding: "16px 32px", fontSize: "17px", fontWeight: 600,
  textDecoration: "none", display: "inline-block",
  transition: "background 0.2s, color 0.2s",
};
const checkItem: React.CSSProperties = { display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "16px", color: "#1A1A1A", lineHeight: 1.5 };
const badgeStyle = (green = true): React.CSSProperties => ({
  display: "inline-block",
  background: green ? "#E8F7F2" : "#F2EFE9",
  color: green ? "#1d9e75" : "#5C5C5C",
  borderRadius: "980px", padding: "6px 16px",
  fontSize: "13px", fontWeight: 500, marginBottom: "20px",
});

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { count: c1, elementRef: r1 } = useCountUp(400000);
  const { count: c2, elementRef: r2 } = useCountUp(67);
  const { count: c3, elementRef: r3 } = useCountUp(40);
  const { count: c4, elementRef: r4 } = useCountUp(48);

  useScrollAnimation();

  const [wheelStep, setWheelStep] = useState(0);
  const wheelVisits = useRef([0, 0]);

  useEffect(() => {
    const iv = setInterval(() => setWheelStep(s => {
      const next = (s + 1) % 2;
      wheelVisits.current[next]++;
      return next;
    }), 4000);
    return () => clearInterval(iv);
  }, []);

  const maxW = { maxWidth: "900px", margin: "0 auto" };
  const easeMotion: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <>
      <HeroBackground heroRef={heroRef} />
      
      {/* SECTION 1 — HERO */}
      <section ref={heroRef} style={{ background: "#FBF8F3", position: "relative", overflow: "hidden", paddingTop: "140px", paddingBottom: "80px", padding: "140px 20px 80px" }}>
        <BrandPattern opacity={0.03} />
        
        <div style={{ ...maxW, position: "relative", zIndex: 5 }}>
          <div className="hero-split" style={{ display: "flex", gap: "56px", alignItems: "center", flexDirection: "row" }}>
            {/* Left — text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.00, duration: 0.5, ease: easeMotion }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#E8F7F2",
                  color: "#1d9e75",
                  borderRadius: "980px",
                  padding: "6px 16px",
                  fontSize: "13px",
                  fontWeight: 500,
                  marginBottom: "20px",
                }}
              >
                <span style={{ position: "relative", display: "inline-flex", width: "8px", height: "8px", flexShrink: 0, marginRight: "8px" }}>
                  <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#1d9e75", animation: "pingPulse 1.8s ease-out infinite" }} />
                  <span style={{ position: "relative", display: "block", width: "100%", height: "100%", borderRadius: "50%", background: "#1d9e75" }} />
                </span>
                Nouveau
              </motion.div>

              <h1 style={{ fontSize: "80px", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, color: "#1A1A1A", marginBottom: "24px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.7, ease: easeMotion }} style={{ display: "block" }}>Vos clients</motion.span>
                <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.7, ease: easeMotion }} style={{ display: "block", position: "relative", width: "fit-content" }}>
                  reviennent.
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.82, duration: 0.55, ease: easeMotion }}
                    style={{ position: "absolute", bottom: "-5px", left: 0, right: 0, height: "3px", borderRadius: "2px", background: "linear-gradient(90deg, #1d9e75, #0D7A5A)", transformOrigin: "left center" }}
                  />
                </motion.span>
                <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.7, ease: easeMotion }} style={{ display: "block" }}>À chaque fois.</motion.span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.6, ease: easeMotion }}
                style={{ fontSize: "19px", color: "#5C5C5C", marginBottom: "32px", lineHeight: 1.5, maxWidth: "440px" }}
              >
                Site vitrine professionnel + carte fidélité digitale + plaquette NFC gravée en bois. 990 CHF. Livré en 48h.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.55, ease: easeMotion }}
                className="hero-btns" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}
              >
                <Link href="/v3/subscribe" className="btn-primary" style={greenBtn}>
                  Obtenir mon site →
                </Link>
                <Link href="/v3/demos" className="nav-link" style={{ ...outlineBtn, border: "none", padding: "16px 20px" }}>
                  Voir les démos →
                </Link>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.88, duration: 0.5 }}
                style={{ fontSize: "13px", color: "#5C5C5C", letterSpacing: "0.04em", marginBottom: "16px" }}
              >
                990 CHF · Paiement unique · 48h · Suisse romande & France
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.00, duration: 0.45, ease: easeMotion }}
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#1d9e75", fontSize: "14px" }}>★</span>)}
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#1A1A1A" }}>Excellent — "Une agence au top"</div>
              </motion.div>
            </div>
            
            {/* Right — mockup */}
            <div className="hero-img-col" style={{ flex: "0 0 50%", maxWidth: "50%" }}>
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.93 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.40, duration: 0.9, ease: easeMotion }}
                style={{ animation: "mockupFloat 5.5s ease-in-out infinite 0.95s" }}
              >
                <DashboardMockup />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — AVANT / APRÈS */}
      <section style={{ background: "#F2EFE9", padding: "80px 20px" }}>
        <div style={maxW}>
          <h2 data-animate="fade-up" style={{ fontSize: "clamp(36px,5vw,48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", textAlign: "center", marginBottom: "48px" }}>
            Le commerce local en 2026.<br />Avant et après Stampify.
          </h2>
          <div data-animate="scale-spring" style={{ maxWidth: "720px", margin: "0 auto", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ background: "#F2EFE9", padding: "20px 28px", fontSize: "16px", fontWeight: 700, color: "#5C5C5C" }}>Avant Stampify</div>
              <div style={{ background: "#1d9e75", padding: "20px 28px", fontSize: "16px", fontWeight: 700, color: "white" }}>Avec Stampify</div>
            </div>
            {[
              ["Carte papier que les clients perdent", "Carte digitale dans le téléphone, toujours disponible"],
              ["Invisible sur Google", "Premier résultat Google local de votre ville"],
              ["Clients qui oublient de revenir", "SMS automatique qui les rappelle à votre place"],
              ["Site Wix bâclé créé en 2018", "Site professionnel livré en 48h"],
              ["Aucune idée de qui sont vos clients fidèles", "Dashboard : chaque client, chaque visite, en temps réel"],
              ["Plaquette à 0€ = logo générique imposé", "Plaquette NFC en bois gravée à votre nom"],
            ].map(([before, after], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: i % 2 === 0 ? "#FFFFFF" : "#FBF8F3" }}>
                <div style={{ padding: "16px 24px", fontSize: "14px", color: "#5C5C5C", display: "flex", alignItems: "center", gap: "8px", borderRight: "1px solid rgba(0,0,0,0.06)" }}>
                  <span style={{ color: "#ef4444", flexShrink: 0 }}>❌</span> {before}
                </div>
                <div style={{ padding: "16px 24px", fontSize: "14px", color: "#1A1A1A", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#1d9e75", flexShrink: 0 }}>✓</span> {after}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — STATS */}
      <section style={{ background: "#FBF8F3", position: "relative", overflow: "hidden", padding: "80px 20px" }}>
        <StampMotif style={{ left: "-60px", bottom: "40px" }} />
        <div style={{ ...maxW, position: "relative", zIndex: 1 }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", maxWidth: "700px", margin: "0 auto 24px" }}>
            
            <div data-animate="fade-up" data-delay="1" style={{ textAlign: "center", padding: "32px 16px" }}>
              <div style={{ fontSize: "clamp(40px,6vw,64px)", fontWeight: 800, color: "#1d9e75", lineHeight: 1, marginBottom: "12px" }}>
                <span ref={r1}>{c1 > 0 ? c1.toLocaleString('fr-FR') : "400\u202f000"}</span>+
              </div>
              <div style={{ fontSize: "15px", color: "#5C5C5C", lineHeight: 1.5 }}>
                commerces locaux en Suisse et France sans outil de fidélité digitale
              </div>
            </div>

            <div data-animate="fade-up" data-delay="2" style={{ textAlign: "center", padding: "32px 16px" }}>
              <div style={{ fontSize: "clamp(40px,6vw,64px)", fontWeight: 800, color: "#1d9e75", lineHeight: 1, marginBottom: "12px" }}>
                <span ref={r2}>{c2 > 0 ? c2 : 67}</span>%
              </div>
              <div style={{ fontSize: "15px", color: "#5C5C5C", lineHeight: 1.5 }}>
                de dépenses supplémentaires d'un client fidèle vs un nouveau client
              </div>
            </div>

            <div data-animate="fade-up" data-delay="3" style={{ textAlign: "center", padding: "32px 16px" }}>
              <div style={{ fontSize: "clamp(40px,6vw,64px)", fontWeight: 800, color: "#1d9e75", lineHeight: 1, marginBottom: "12px" }}>
                <span ref={r3}>{c3 > 0 ? c3 : 40}</span>%+
              </div>
              <div style={{ fontSize: "15px", color: "#5C5C5C", lineHeight: 1.5 }}>
                d'augmentation du taux de retour client avec une carte fidélité digitale
              </div>
            </div>

            <div data-animate="fade-up" data-delay="4" style={{ textAlign: "center", padding: "32px 16px" }}>
              <div style={{ fontSize: "clamp(40px,6vw,64px)", fontWeight: 800, color: "#1d9e75", lineHeight: 1, marginBottom: "12px" }}>
                <span ref={r4}>{c4 > 0 ? c4 : 48}</span>h
              </div>
              <div style={{ fontSize: "15px", color: "#5C5C5C", lineHeight: 1.5 }}>
                pour avoir votre site en ligne, carte fidélité et plaquette NFC incluses
              </div>
            </div>

          </div>
          <p data-animate="fade-up" data-delay="5" style={{ textAlign: "center", fontSize: "11px", color: "#5C5C5C", fontStyle: "italic" }}>
            Sources : Invesp, Bain &amp; Company, études internes Stampify 2024-2025
          </p>
        </div>
      </section>

      {/* SECTION 4 — MARQUEE */}
      <section style={{ background: "#F2EFE9", overflow: "hidden", padding: "60px 0" }}>
        <p data-animate="fade-up" style={{ textAlign: "center", fontSize: "17px", fontWeight: 600, color: "#5C5C5C", marginBottom: "32px" }}>
          Ils nous font confiance pour leur présence digitale
        </p>
        <MarqueeBar />
      </section>

      {/* SECTION 5 — AVIS */}
      <section style={{ background: "#FBF8F3", padding: "80px 20px" }}>
        <div style={maxW}>
          <h2 data-animate="fade-up" style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", textAlign: "center", marginBottom: "48px" }}>
            Ils nous font confiance.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "24px" }}>
            {[
              { initials: "SM", quote: "J'avais essayé de créer mon site sur Wix — j'ai abandonné après 3 heures. Stampify m'a livré un site complet en 2 jours. Mes clients adorent la carte fidélité.", name: "Sophie M.", commerce: "Boulangerie artisanale, Lausanne", delay: "1" },
              { initials: "KB", quote: "La plaquette NFC sur mon comptoir fait souvent réagir les clients. Ils trouvent ça moderne. Et moi, j'ai enfin une carte fidélité qui fonctionne — plus de cartes perdues.", name: "Karim B.", commerce: "Café & brunch, Genève", delay: "2" },
              { initials: "MF", quote: "990 CHF pour le site, la carte, et la plaquette. Mon ancienne agence me demandait 3 500 CHF juste pour le site. Le rapport qualité-prix est imbattable.", name: "Marie-Claire F.", commerce: "Salon de coiffure, Fribourg", delay: "4" },
            ].map((r, i) => (
              <div key={i} className="testimonial-card" data-animate={i===0?"fade-right":i===1?"fade-up":"fade-left"} data-delay={r.delay} style={{ background: "#FFFFFF", borderRadius: "20px", padding: "32px", cursor: "default", border: "1px solid transparent" }}>
                <div style={{ fontSize: "40px", color: "#E8F7F2", fontWeight: 800, lineHeight: 1, marginBottom: "8px" }}>&quot;</div>
                <div style={{ color: "#f5a623", fontSize: "15px", marginBottom: "12px" }}>★★★★★</div>
                <p style={{ fontSize: "15px", color: "#1A1A1A", lineHeight: 1.7, fontStyle: "italic", marginBottom: "16px" }}>&ldquo;{r.quote}&rdquo;</p>
                <div style={{ borderTop: "1px solid #F2EFE9", paddingTop: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#E8F7F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#1d9e75", flexShrink: 0 }}>{r.initials}</div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>{r.name}</div>
                    <div style={{ fontSize: "13px", color: "#5C5C5C" }}>{r.commerce}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — METRICS */}
      <section style={{ background: "#1A1A1A", position: "relative", overflow: "hidden", padding: "80px 20px" }}>
        <BrandPattern opacity={0.05} color="#1d9e75" />
        <div style={{ ...maxW, position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div data-animate="fade-up" style={{ display: "inline-block", background: "rgba(29,158,117,0.15)", color: "#1d9e75", borderRadius: "980px", padding: "6px 16px", fontSize: "13px", fontWeight: 500, marginBottom: "20px" }}>Résultats prouvés</div>
            <h2 data-animate="fade-up" data-delay="1" style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "white", marginBottom: "16px" }}>
              Des chiffres qui parlent.
            </h2>
            <p data-animate="fade-up" data-delay="2" style={{ fontSize: "17px", color: "rgba(255,255,255,0.45)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
              Nos clients voient leurs clients revenir plus souvent, dès les premières semaines.
            </p>
          </div>
          <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", marginBottom: "24px" }}>
            {[
              { n: "67%", label: "taux de retour moyen", sub: "vs 32% sans fidélité", d: "1" },
              { n: "4.8★", label: "satisfaction client", sub: "sur 140+ avis Google", d: "2" },
              { n: "2×", label: "panier moyen", sub: "clients fidèles vs nouveaux", d: "3" },
            ].map((m, i) => (
              <div key={i} data-animate="fade-up" data-delay={m.d} style={{ background: "#252525", borderRadius: "20px", padding: "28px 24px" }}>
                <div style={{ fontSize: "clamp(36px,4vw,52px)", fontWeight: 800, color: "#1d9e75", lineHeight: 1, marginBottom: "8px" }}>{m.n}</div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "white", marginBottom: "4px" }}>{m.label}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — DEMO SPA */}
      <section style={{ background: "#F2EFE9", padding: "80px 20px" }}>
        <div style={maxW}>
          <div className="spa-showcase" style={{ display: "flex", gap: "56px", alignItems: "center" }}>
            <div data-animate="fade-right" className="spa-mock" style={{ flex: "0 0 auto", maxWidth: "460px", width: "100%" }}>
              <div style={{ background: "#E2E2E2", borderRadius: "14px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.14)" }}>
                <div style={{ background: "#F0F0F0", padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                    {["#FF5F57","#FEBC2E","#28C840"].map((c,i) => (
                      <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
                    ))}
                  </div>
                  <div style={{ flex: 1, background: "white", borderRadius: "6px", padding: "4px 10px", fontSize: "10px", color: "#5C5C5C", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    stampify.ch/lessence-spa
                  </div>
                </div>
                <a href="https://loyalty-cards-rho.vercel.app/lessence-spa.html" target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", position: "relative", overflow: "hidden", aspectRatio: "16/10" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://api.microlink.io?url=https%3A%2F%2Floyalty-cards-rho.vercel.app%2Flessence-spa.html&screenshot=true&meta=false&embed=screenshot.url"
                    alt="Démo Spa Essence" loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </a>
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div data-animate="fade-up" style={badgeStyle()}>⭐ Le plus demandé</div>
              <h2 data-animate="fade-up" data-delay="1" style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "16px" }}>
                Voyez ce qu&apos;on<br/>peut faire pour<br/>votre commerce.
              </h2>
              <p data-animate="fade-up" data-delay="2" style={{ fontSize: "17px", color: "#5C5C5C", lineHeight: 1.7, marginBottom: "28px" }}>
                Spa Essence, Genève — site vitrine 5 pages, carte fidélité &ldquo;soin offert&rdquo;, plaquette NFC gravée. Livré en 48h. Exactement ce que nous ferons pour vous.
              </p>
              <div data-animate="fade-up" data-delay="3">
                <a href="https://loyalty-cards-rho.vercel.app/lessence-spa.html" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ ...greenBtn, display: "inline-block", marginBottom: "20px" }}>
                  Accéder à la démo complète →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FEATURES */}
      <section style={{ background: "#FBF8F3", padding: "80px 20px" }}>
        <div style={maxW}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 data-animate="fade-up" style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "10px" }}>
              Tout ce dont votre commerce<br />a besoin. Réuni.
            </h2>
          </div>
          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "20px" }}>
            {[
              { icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="11" stroke="#1d9e75" strokeWidth="1.5"/><ellipse cx="14" cy="14" rx="5" ry="11" stroke="#1d9e75" strokeWidth="1.5"/><path d="M3 14h22" stroke="#1d9e75" strokeWidth="1.5"/></svg>, title: "Site professionnel", desc: "5 pages, SEO local, domaine .ch inclus." },
              { icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="7" width="20" height="14" rx="3" stroke="#1d9e75" strokeWidth="1.5"/><circle cx="14" cy="14" r="3" stroke="#1d9e75" strokeWidth="1.5"/></svg>, title: "Carte fidélité digitale", desc: "QR code ou NFC. Aucune app requise." },
              { icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M7 14C7 10.134 10.134 7 14 7" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"/><path d="M4 14C4 8.477 8.477 4 14 4" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 14C10 11.791 11.791 10 14 10" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"/><circle cx="14" cy="14" r="2" fill="#1d9e75"/></svg>, title: "Plaquette NFC gravée", desc: "En bois, à votre nom, sur votre comptoir." },
              { icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="6" width="17" height="13" rx="3" stroke="#1d9e75" strokeWidth="1.5"/><path d="M13 19v3M9 22h8" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"/><path d="M21 9h3M21 14h3" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"/></svg>, title: "Campagnes SMS", desc: "Envoyez une promo à tous vos clients en 2 clics." },
            ].map((f, i) => (
              <div key={i} data-animate="fade-up" data-delay={(i % 3) + 1} className="feature-card" style={{ background: "#FFFFFF", borderRadius: "20px", padding: "32px", border: "1px solid transparent" }}>
                <div className="feature-icon" style={{ width: "56px", height: "56px", borderRadius: "12px", background: "#E8F7F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>{f.icon}</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A1A", marginBottom: "8px" }}>{f.title}</div>
                <div style={{ fontSize: "15px", color: "#5C5C5C", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — PLAQUETTE NFC */}
      <section style={{ background: "#F2EFE9", padding: "80px 20px" }}>
        <div style={maxW}>
          <div className="split-section" style={{ display: "flex", gap: "64px", alignItems: "center" }}>
            <div data-animate="fade-right" className="split-img" style={{ flex: "0 0 auto", maxWidth: "440px", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 0", background: "linear-gradient(to bottom right, rgba(232, 247, 242, 0.4), rgba(255,255,255,0.5))", borderRadius: "24px", border: "1px solid rgba(29, 158, 117, 0.1)" }}>
              <div style={{
                width: "200px", height: "120px",
                background: "linear-gradient(135deg, #8B6914 0%, #C9A84C 40%, #8B6914 100%)",
                borderRadius: "12px",
                boxShadow: "0 20px 60px rgba(139,105,20,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                border: "1px solid rgba(201,168,76,0.4)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px",
                animation: "floatAnim 4s ease-in-out infinite"
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4 Q12 12 4 20" stroke="#F5EDD6" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <path d="M9 7 Q15 12 9 17" stroke="#F5EDD6" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <path d="M14 10 Q17 12 14 14" stroke="#F5EDD6" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                </svg>
                <div style={{ fontSize: "13px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.85)", fontWeight: 600, textTransform: "uppercase" }}>Café Lumière</div>
              </div>
            </div>
            <div data-animate="fade-left" style={{ flex: 1 }}>
              <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "20px" }}>En bois.<br />Gravée à votre nom.<br />Livrée avec votre commande.</h2>
              <p style={{ fontSize: "17px", color: "#5C5C5C", lineHeight: 1.7, marginBottom: "24px" }}>La plaquette est posée sur votre comptoir. Vos clients approchent leur téléphone. Leur carte fidélité s&apos;ouvre instantanément. Sans app. Sans compte. Sans friction.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {["Gravure laser personnalisée (nom, logo)", "Compatible iPhone et Android", "Livrée avec le reste de votre commande"].map((item, i) => (
                  <div key={i} style={checkItem}><span style={{ color: "#1d9e75", fontWeight: 700, flexShrink: 0 }}>✓</span> {item}</div>
                ))}
              </div>
              <NFCAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9.5 — USAGE REEL */}
      <section style={{ background: "#FBF8F3", padding: "80px 20px" }}>
        <div style={maxW}>
          <div className="split-section-reverse" style={{ display: "flex", gap: "64px", alignItems: "center", flexDirection: "row-reverse" }}>
            <div data-animate="fade-left" data-delay="1" className="split-img" style={{ flex: "0 0 auto", maxWidth: "440px", width: "100%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.nfcUsage} alt="Client NFC" loading="lazy" width={800} height={533} style={{ width: "100%", borderRadius: "20px", boxShadow: "0 24px 60px rgba(0,0,0,0.10)", aspectRatio: "3/2", objectFit: "cover", display: "block" }} />
            </div>
            <div data-animate="fade-right" data-delay="2" style={{ flex: 1 }}>
              <div style={badgeStyle()}>Résultats réels</div>
              <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "20px" }}>Vos clients adorent.<br />Vos concurrents, moins.</h2>
              <p style={{ fontSize: "17px", color: "#5C5C5C", lineHeight: 1.7, marginBottom: "32px" }}>Chaque commerçant Stampify reçoit son propre site, sa propre marque, sa propre relation client. Pas un profil sur une plateforme tierce. Le vôtre.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10 — CARTE FIDÉLITÉ ANIMÉE */}
      <section style={{ background: "#F2EFE9", padding: "80px 20px" }}>
        <div style={maxW}>
          <div className="split-section" style={{ display: "flex", gap: "64px", alignItems: "center" }}>
            <div data-animate="scale-spring" data-delay="1" style={{ flex: "0 0 auto" }}><LoyaltyCardAnimated /></div>
            <div data-animate="fade-left" data-delay="2" style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "15px", color: "#C9A84C", marginBottom: "16px" }}>Sans friction</div>
              <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "20px" }}>La carte papier<br />finit à la poubelle.<br />La digitale, jamais.</h2>
              <p style={{ fontSize: "17px", color: "#5C5C5C", lineHeight: 1.7, marginBottom: "24px" }}>Vos clients ne perdent plus leur carte. Chaque passage est enregistré automatiquement. Vous choisissez la récompense, le nombre de tampons, les couleurs.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {["10 cases personnalisables (couleurs, icônes)", "QR code ou NFC tap — sans app", "Tampons qui n'expirent jamais"].map((item, i) => (
                  <div key={i} style={checkItem}><span style={{ color: "#1d9e75", fontWeight: 700, flexShrink: 0 }}>✓</span> {item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11 — ROUE */}
      <section style={{ background: "#FBF8F3", position: "relative", overflow: "hidden", padding: "80px 20px" }}>
        <StampMotif style={{ right: "-60px", top: "50px" }} />
        <div style={{ ...maxW, position: "relative", zIndex: 1 }}>
          <div className="split-section-reverse" style={{ display: "flex", gap: "64px", alignItems: "center", flexDirection: "row-reverse" }}>
            <div data-animate="scale-spring" data-delay="1" style={{ flex: "0 0 auto" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginBottom: "20px" }}>
                {[0,1].map(i => (<div key={i} style={{ height: "6px", borderRadius: "3px", width: i === wheelStep ? "22px" : "6px", background: i === wheelStep ? "#1d9e75" : "#C8E6DB", transition: "width 0.4s ease, background 0.4s ease" }} />))}
              </div>
              <div style={{ position: "relative", height: "300px", width: "280px" }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: wheelStep === 0 ? 1 : 0, transform: wheelStep === 0 ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.55s ease, transform 0.55s ease" }}><WheelSVG size={270} /></div>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: wheelStep === 1 ? 1 : 0, transform: wheelStep === 1 ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.55s ease, transform 0.55s ease", pointerEvents: wheelStep === 1 ? "auto" : "none" }}><LotteryMockup animKey={wheelVisits.current[1]} /></div>
              </div>
            </div>
            <div data-animate="fade-right" data-delay="2" style={{ flex: 1 }}>
              <div style={badgeStyle()}>Gamification + avis Google inclus</div>
              <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "20px" }}>Vos clients jouent,<br />laissent un avis,<br />reviennent.</h2>
              <p style={{ fontSize: "17px", color: "#5C5C5C", lineHeight: 1.7, marginBottom: "20px" }}>La roue de la fortune et la loterie offrent un produit à votre client — en échange d&apos;un avis Google. Vos avis augmentent automatiquement.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
                {["Lots 100% personnalisables", "Échange automatique : lot contre avis Google en 1 clic", "Roue + loterie — deux mécaniques"].map((item, i) => (
                  <div key={i} style={checkItem}><span style={{ color: "#1d9e75", fontWeight: 700, flexShrink: 0 }}>✓</span> {item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12 — SMS */}
      <section style={{ background: "#F2EFE9", padding: "80px 20px" }}>
        <div style={maxW}>
          <div className="split-section" style={{ display: "flex", gap: "64px", alignItems: "center" }}>
            <div data-animate="fade-right" data-delay="1" style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "15px", color: "#C9A84C", marginBottom: "16px" }}>Restez présent</div>
              <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "20px" }}>Vos clients reviennent.<br />Automatiquement.</h2>
              <p style={{ fontSize: "17px", color: "#5C5C5C", lineHeight: 1.7, marginBottom: "24px" }}>15 triggers SMS configurables. Anniversaire, inactivité, récompense, promo flash.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {["SMS anniversaire automatique", "Relance client inactif (14/30/60 jours)", "Promo flash en 2 clics depuis le dashboard"].map((item, i) => (
                  <div key={i} style={{ ...checkItem }}><span style={{ color: "#1d9e75", fontWeight: 700, flexShrink: 0 }}>✓</span> {item}</div>
                ))}
              </div>
            </div>
            <div data-animate="scale-spring" data-delay="2" style={{ flex: "0 0 auto" }}><SMSMockup /></div>
          </div>
        </div>
      </section>

      {/* SECTION 13 — COMPARATIF POINZ */}
      <section style={{ background: "#FBF8F3", padding: "80px 20px" }}>
        <div style={maxW}>
          <h2 data-animate="fade-up" style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", textAlign: "center", marginBottom: "12px" }}>Pourquoi Stampify<br />plutôt que Poinz ?</h2>
          <p data-animate="fade-up" data-delay="1" style={{ fontSize: "19px", color: "#5C5C5C", textAlign: "center", maxWidth: "560px", margin: "0 auto 40px", lineHeight: 1.5 }}>Poinz est gratuit mais c'est leur marque. Stampify : votre site, votre marque.</p>
          <div data-animate="fade-up" data-delay="2" style={{ maxWidth: "720px", margin: "0 auto", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", background: "#1A1A1A", padding: "16px 24px" }}>
              {["Fonctionnalité", "Stampify", "Poinz"].map((h) => (<div key={h} style={{ fontSize: "14px", fontWeight: 600, color: "white" }}>{h}</div>))}
            </div>
            {[["Site vitrine personnalisé","✓","✗"],["Votre branding","✓","✗"],["Carte fidélité digitale","✓","✓"],["Plaquette NFC en bois","✓","✗"]].map(([feature, stampify, poinz], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", background: i % 2 === 0 ? "#FFFFFF" : "#FBF8F3", padding: "14px 24px", borderBottom: "1px solid #F2EFE9" }}>
                <div style={{ fontSize: "14px", color: "#1A1A1A" }}>{feature}</div>
                <div style={{ fontSize: "14px", color: stampify === "✓" ? "#1d9e75" : "#1A1A1A", fontWeight: stampify === "✓" ? 600 : 400 }}>{stampify}</div>
                <div style={{ fontSize: "14px", color: poinz === "✗" || poinz.startsWith("✗") ? "#ef4444" : "#5C5C5C" }}>{poinz}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 14 — DÉMOS CARDS */}
      <section style={{ background: "#F2EFE9", padding: "80px 20px" }}>
        <div style={maxW}>
          <h2 data-animate="fade-up" style={{ fontSize: "clamp(36px,5vw,48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", textAlign: "center", marginBottom: "12px" }}>Exemples de sites Stampify.</h2>
          <p data-animate="fade-up" data-delay="1" style={{ fontSize: "17px", color: "#5C5C5C", textAlign: "center", margin: "0 auto 48px", maxWidth: "500px", lineHeight: 1.5 }}>Fonctionnels. Personnalisés. Livrés en 48h.</p>
          <div className="demos-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px" }}>
            {DEMOS.slice(0, 3).map((demo, i) => (
              <div key={demo.name} data-animate={i === 0 ? "scale-spring" : "fade-up"} data-delay={i + 1} className="demo-card" style={{ background: "#FFFFFF", borderRadius: "20px", overflow: "hidden" }}>
                <div style={{ position: "relative", paddingBottom: "75%", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://images.unsplash.com/${demo.img}?auto=format&fit=crop&w=600&q=80`} alt={demo.name} loading="lazy" className="demo-image" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: 20 }}>
                  {demo.badge && (<div style={{ display: "inline-block", background: "#E8F7F2", color: "#1d9e75", fontSize: 11, borderRadius: 980, padding: "4px 12px", marginBottom: 8, fontWeight: 600 }}>{demo.badge}</div>)}
                  <div style={{ fontSize: 17, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.3, marginBottom: 4 }}>{demo.name}</div>
                  <div style={{ fontSize: 14, color: "#5C5C5C", marginBottom: 12 }}>{demo.city} · {demo.cat}</div>
                  <a href={demo.href} target={demo.href !== "#" ? "_blank" : undefined} rel={demo.href !== "#" ? "noopener noreferrer" : undefined} className="nav-link" style={{ display: "inline-block", fontSize: 14, color: "#1d9e75", fontWeight: 500, textDecoration: "none" }}>Voir la démo →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 15 — TARIF */}
      <section style={{ background: "#FBF8F3", position: "relative", overflow: "hidden", padding: "80px 20px" }}>
        <BrandPattern opacity={0.03} />
        <div style={{ ...maxW, position: "relative", zIndex: 1 }}>
          <h2 data-animate="fade-up" style={{ fontSize: "clamp(40px,6vw,64px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", textAlign: "center", marginBottom: "48px" }}>Un seul paiement.<br />Pour toujours.</h2>
          
          <div data-animate="scale-spring" style={{ 
            maxWidth: "580px", margin: "0 auto", background: "#FFFFFF", 
            borderRadius: "24px", padding: "48px 40px", 
            animation: "pricingBreath 3.5s ease-in-out infinite",
            animationDelay: "-1s",
            overflow: "hidden",
            position: "relative"
          }}>
            {/* Shimmer element */}
            <div style={{
              position: "absolute", top: 0, bottom: 0, left: 0, width: "55%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8) 50%, transparent)",
              animation: "pricingShimmer 0.9s ease-out 1 forwards",
              animationDelay: "0.85s",
              pointerEvents: "none",
              zIndex: 10
            }} />
            
            <div style={{ textAlign: "center", marginBottom: "24px", position: "relative", zIndex: 2 }}>
              <div style={badgeStyle()}>✦ LE CHOIX DE NOS CLIENTS</div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
                <span style={{ fontSize: "96px", fontWeight: 800, letterSpacing: "-4px", color: "#1A1A1A", lineHeight: 1 }}>990</span>
                <span style={{ fontSize: "28px", fontWeight: 500, color: "#5C5C5C" }}>CHF</span>
              </div>
              <p style={{ fontSize: "15px", color: "#5C5C5C", marginTop: "8px" }}>paiement unique · aucun abonnement</p>
            </div>
            
            <div style={{ borderTop: "1px solid #F2EFE9", margin: "24px 0", position: "relative", zIndex: 2 }} />
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px", position: "relative", zIndex: 2 }}>
              {["Site vitrine 5 pages sur mesure","Carte fidélité digitale 10 cases","Plaquette NFC en bois gravée à votre nom","Domaine .ch + hébergement 1ère année","SEO local optimisé","Livraison en 48h garantie"].map((item, i) => (
                <div key={i} style={{ ...checkItem }}>
                  <span style={{ color: "#1d9e75", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: "16px" }}>{item}</span>
                </div>
              ))}
            </div>
            
            <Link href="/v3/subscribe" className="btn-primary" style={{ ...greenBtn, display: "block", textAlign: "center", position: "relative", zIndex: 2 }}>
              Obtenir mon site — 990 CHF
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 16 — FAQ */}
      <section style={{ background: "#F2EFE9", padding: "80px 20px" }}>
        <div style={maxW}>
          <h2 data-animate="fade-up" style={{ fontSize: "clamp(36px,5vw,48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", textAlign: "center", marginBottom: "48px" }}>Questions fréquentes.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "680px", margin: "0 auto" }}>
            {[
              { q: "Est-ce que mes clients doivent télécharger une application ?", a: "Non. La carte s'ouvre directement dans Safari ou Chrome via QR code ou NFC. Aucun téléchargement, aucun compte." },
              { q: "Que se passe-t-il après la première année ?", a: "Domaine .ch ~25 CHF/an. Hébergement ~5 CHF/mois offert la 1ère année. Carte et dashboard : à vie. Aucun abonnement imposé." },
              { q: "Est-ce que je suis propriétaire du site ?", a: "Oui, à 100%. Code source, domaine, contenu — tout est à vous. Liberté totale." },
              { q: "Combien de temps pour mon site en ligne ?", a: "48h à partir de vos infos : photos, textes, horaires, couleurs. Garanti sans exception." },
            ].map((item, i) => (
              <div key={i} className="faq-item" data-animate="fade-up" data-delay={i + 1}>
                <FAQItem q={item.q} a={item.a} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL WITH HANDS */}
      <section style={{ background: "#1A1A1A", padding: "120px 20px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <BrandPattern opacity={0.05} color="#FFFFFF" />
        
        <FloatingHands />

        <div style={{ ...maxW, position: "relative", zIndex: 2 }}>
          <div data-animate="fade-only" style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", color: "white", borderRadius: "980px", padding: "6px 16px", fontSize: "13px", fontWeight: 500, marginBottom: "20px" }}>
            Prêt à commencer ?
          </div>
          <h2 data-animate="fade-up" data-delay="1" style={{ fontSize: "clamp(40px,6vw,64px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "white", marginBottom: "20px" }}>Votre commerce mérite<br />d&apos;être en ligne.</h2>
          <p data-animate="fade-up" data-delay="2" style={{ fontSize: "19px", color: "rgba(255,255,255,0.55)", marginBottom: "40px", lineHeight: 1.5 }}>990 CHF. 48h. Propriétaire à 100%.<br />Réponse en moins de 2h, 7j/7.</p>
          <div data-animate="scale-spring" data-delay="3">
            <Link href="/v3/subscribe" className="btn-primary" style={{ ...greenBtn, padding: "20px 48px", fontSize: "18px" }}>
              Obtenir mon site maintenant →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
