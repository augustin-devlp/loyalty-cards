"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import BrandPattern from "../../components/BrandPattern";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

const IMG = {
  // Comptoir boutique — montre l'usage réel Stampify en magasin
  heroCtx: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=85",
  // Main qui tape téléphone sur terminal NFC
  nfcUsage: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=800&q=80",
  // Carte de fidélité digitale — paiement premium
  plaque: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
};

const DEMOS = [
  { name: "Spa Essence", city: "Genève", cat: "Spa", badge: "⭐ Le plus demandé", img: "photo-1540555700478-4be289fbecef", href: "https://loyalty-cards-rho.vercel.app/lessence-spa.html" },
  { name: "Café Lumière", city: "Genève", cat: "Café", img: "photo-1509042239860-f550ce710b93", href: "#" },
  { name: "Bistrot du Coin", city: "Neuchâtel", cat: "Restaurant", img: "photo-1414235077428-338989a2e8c0", href: "#" },
  { name: "Boulangerie Martin", city: "Lausanne", cat: "Boulangerie", img: "photo-1507003211169-0a1dd7228f2d", href: "#" },
  { name: "Black Scissors", city: "Fribourg", cat: "Barbershop", img: "photo-1503951914875-452162b0f3f1", href: "#" },
  { name: "Nail Studio Rose", city: "Lausanne", cat: "Manucure", img: "photo-1604654894610-df63bc536371", href: "#" },
];

const LOGOS = [
  "Café Lumière · Genève", "Boulangerie Martin · Lausanne", "Black Scissors · Fribourg",
  "Spa Essence · Genève", "Nail Studio Rose · Lausanne", "Bistrot du Coin · Neuchâtel",
  "Le Petit Torréfacteur · Vevey", "Institut Belle Peau · Sion",
];

/* ─── Stamp motif ─── */
function StampMotif({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", pointerEvents: "none", zIndex: 0, ...style }}>
      <div style={{ width: "200px", height: "200px", borderRadius: "50%", border: "1.5px solid #1d9e75", opacity: 0.04 }} />
      <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", bottom: "20px", borderRadius: "50%", border: "1px solid #1d9e75", opacity: 0.03 }} />
    </div>
  );
}

/* ─── Word-by-word title ─── */
function WordTitle({ text, style }: { text: string; style?: React.CSSProperties }) {
  let idx = 0;
  return (
    <h1 style={style}>
      {text.split("\n").map((line, li) => (
        <span key={li} style={{ display: "block" }}>
          {line.split(" ").map((word) => {
            const i = idx++;
            return (
              <span key={i} style={{
                display: "inline-block", marginRight: "0.25em",
                opacity: 0, animation: `wordIn 0.5s ease forwards`,
                animationDelay: `${i * 0.06}s`,
              }}>{word}</span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

/* ─── 4-step hero animation ─── */
function HeroStepAnimation({ step }: { step: number }) {
  // Track how many times each step has been entered — lets us restart CSS animations (e.g. typewriter)
  const visits = useRef([0, 0, 0, 0]);
  const prev = useRef(-1);
  if (prev.current !== step) {
    visits.current[step]++;
    prev.current = step;
  }
  const v = visits.current;

  const labels = [
    "Client approche son téléphone — NFC tap",
    "8ème tampon ajouté automatiquement",
    "Récompense débloquée — soin offert !",
    "SMS de rappel envoyé automatiquement",
  ];

  // All panels are always mounted — opacity+transform give smooth crossfades
  const panel = (s: number, extra?: React.CSSProperties): React.CSSProperties => ({
    position: "absolute", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: s === step ? 1 : 0,
    transform: s === step ? "translateY(0)" : "translateY(10px)",
    transition: "opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)",
    pointerEvents: "none",
    ...extra,
  });

  return (
    <div style={{ position: "relative", maxWidth: "420px", width: "100%" }}>
      {/* Step pills */}
      <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginBottom: "20px" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            height: "6px", borderRadius: "3px",
            width: i === step ? "22px" : "6px",
            background: i === step ? "#1d9e75" : "#C8E6DB",
            transition: "width 0.4s ease, background 0.4s ease",
          }} />
        ))}
      </div>

      <div style={{ height: "260px", position: "relative" }}>

        {/* ── Step 0 — NFC tap ── */}
        <div style={{ ...panel(0), gap: "24px", alignItems: "flex-end", paddingBottom: "20px" }}>
          {/* Wooden NFC tag on counter */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: "84px", height: "54px", borderRadius: "10px",
                background: "linear-gradient(160deg, #A0714F 0%, #7A5230 50%, #9B6B40 100%)",
                boxShadow: "0 6px 20px rgba(122,82,48,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px",
                position: "relative", overflow: "hidden", zIndex: 2,
              }}>
                {/* Wood grain */}
                {[12,26,40,52].map(t => (
                  <div key={t} style={{ position: "absolute", left: "-10%", right: "-10%", top: `${t}%`, height: "1px", background: "rgba(0,0,0,0.12)", transform: "rotate(-1deg)" }} />
                ))}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ position: "relative", zIndex: 1 }}>
                  <path d="M6 12C6 8.686 8.686 6 12 6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M3 12C3 7.029 7.029 3 12 3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M9 12C9 10.343 10.343 9 12 9" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="1.8" fill="white"/>
                </svg>
                <span style={{ fontSize: "7px", color: "rgba(255,255,255,0.95)", fontWeight: 700, letterSpacing: "0.06em", position: "relative", zIndex: 1 }}>STAMPIFY</span>
              </div>
              {/* Ripple rings from NFC tag */}
              {[0,1,2].map(i => (
                <div key={i} style={{ position: "absolute", inset: "-8px", borderRadius: "18px", border: "1.5px solid rgba(29,158,117,0.45)", animation: `rippleAnim 2s ${i*0.6}s ease-out infinite` }} />
              ))}
            </div>
            {/* Counter surface */}
            <div style={{ width: "120px", height: "6px", borderRadius: "3px", background: "linear-gradient(180deg, #D4B896 0%, #C4A07A 100%)", boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }} />
            <div style={{ fontSize: "9px", color: "#5C5C5C", fontWeight: 500 }}>Plaquette NFC gravée</div>
          </div>

          {/* Signal arcs */}
          <div style={{ display: "flex", gap: "3px", alignItems: "center", paddingBottom: "28px" }}>
            {[0,1,2].map(i => (
              <svg key={i} width="11" height="20" style={{ opacity: 0, animation: `arcFade 1.8s ${i*0.35}s infinite` }}>
                <path d="M2 2 Q7 10 2 18" stroke="#1d9e75" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              </svg>
            ))}
          </div>

          {/* Realistic phone approaching */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", animation: "phoneApproach 2.2s ease-in-out infinite alternate" }}>
            <div style={{
              width: "58px", height: "112px", borderRadius: "16px",
              background: "linear-gradient(160deg, #2C2C2E, #1C1C1E)",
              boxShadow: "0 0 0 1.5px #3A3A3C, inset 0 0 0 1px rgba(255,255,255,0.07), 0 16px 40px rgba(0,0,0,0.35)",
              position: "relative", flexShrink: 0,
            }}>
              {/* Dynamic Island */}
              <div style={{ position: "absolute", top: "8px", left: "50%", transform: "translateX(-50%)", width: "20px", height: "6px", borderRadius: "3px", background: "#000" }} />
              {/* Screen */}
              <div style={{ position: "absolute", top: "20px", bottom: "10px", left: "3px", right: "3px", borderRadius: "13px", background: "#FBF8F3", overflow: "hidden", padding: "7px 6px", display: "flex", flexDirection: "column", gap: "5px" }}>
                <div style={{ height: "22px", borderRadius: "5px", background: "linear-gradient(135deg,#1d9e75,#0D7A5A)" }} />
                <div style={{ fontSize: "5.5px", color: "#5C5C5C", textAlign: "center", fontWeight: 600 }}>Spa Essence</div>
                <div style={{ display: "flex", gap: "3px", justifyContent: "center", flexWrap: "wrap" }}>
                  {Array.from({length:6},(_,i) => <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i<4?"#1d9e75":"rgba(29,158,117,0.22)" }} />)}
                </div>
                <div style={{ fontSize: "5px", color: "#1d9e75", textAlign: "center" }}>4 / 10 tampons</div>
              </div>
              {/* Home bar */}
              <div style={{ position: "absolute", bottom: "3px", left: "50%", transform: "translateX(-50%)", width: "22px", height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.25)" }} />
              {/* Side button */}
              <div style={{ position: "absolute", right: "-2px", top: "32px", width: "2px", height: "18px", borderRadius: "1px", background: "#3A3A3C" }} />
            </div>
            {/* Hand/wrist hint */}
            <div style={{ width: "46px", height: "14px", borderRadius: "8px 8px 0 0", background: "linear-gradient(180deg, #D4A882, #C49070)", opacity: 0.7 }} />
          </div>
        </div>

        {/* ── Step 1 — Stamp card (8th stamp bouncing) ── */}
        <div style={panel(1)}>
          <div style={{ width: "300px", background: "linear-gradient(135deg,#1d9e75,#0D7A5A)", borderRadius: "18px", padding: "22px 24px", boxShadow: "0 24px 60px rgba(29,158,117,0.25)" }}>
            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.6)", marginBottom: "2px" }}>Stampify</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "white", marginBottom: "16px" }}>Spa Essence — Genève</div>
            <div style={{ display: "flex", gap: "8px" }}>
              {Array.from({ length: 10 }, (_, i) => (
                // key on the bouncing stamp restarts animation each time we re-enter step 1
                <div key={i === 7 ? `s7-${v[1]}` : i} style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: i < 8 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
                  animation: i === 7 ? "stampBounce 0.7s 0.25s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
                }} />
              ))}
            </div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", marginTop: "10px" }}>8 / 10 · encore 2 pour votre soin offert</div>
          </div>
        </div>

        {/* ── Step 2 — Full card + reward popup ── */}
        <div style={{ ...panel(2), flexDirection: "column", gap: "12px" }}>
          <div style={{ width: "300px", background: "linear-gradient(135deg,#1d9e75,#0D7A5A)", borderRadius: "18px", padding: "20px 24px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} style={{ width: "22px", height: "22px", borderRadius: "50%", background: "rgba(255,255,255,0.9)" }} />
              ))}
            </div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)", marginTop: "8px" }}>Carte complète ✓</div>
          </div>
          {/* key restarts the pop animation each time step 2 is entered */}
          <div key={`reward-${v[2]}`} style={{ background: "white", borderRadius: "16px", padding: "16px 28px", textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,0.12)", animation: "rewardPop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
            <div style={{ fontSize: "28px", marginBottom: "4px" }}>🎉</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A1A", marginBottom: "4px" }}>Soin offert !</div>
            <div style={{ fontSize: "12px", color: "#5C5C5C" }}>Présentez ceci à l&apos;accueil</div>
          </div>
        </div>

        {/* ── Step 3 — SMS typewriter ── */}
        <div style={panel(3)}>
          <div style={{ width: "230px", background: "#1A1A1A", borderRadius: "28px", padding: "14px", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ background: "#FBF8F3", borderRadius: "20px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, color: "#1A1A1A", textAlign: "center", borderBottom: "1px solid #F2EFE9", paddingBottom: "8px" }}>Messages</div>
              <div style={{ background: "#E8F7F2", borderRadius: "10px 10px 10px 2px", padding: "10px 12px", fontSize: "11px", color: "#1A1A1A", lineHeight: 1.5 }}>
                {/* key restarts typewriter each time step 3 is entered */}
                <span key={`tw-${v[3]}`} style={{ display: "inline-block", overflow: "hidden", whiteSpace: "nowrap", animation: "typewriterAnim 2.2s steps(42) forwards" }}>
                  2 tampons restants chez Spa Essence !
                </span>
                <span key={`cur-${v[3]}`} style={{ animation: "cursorBlink 0.7s 2.2s infinite", color: "#1d9e75", marginLeft: "1px", opacity: 0 }}>|</span>
              </div>
              <div key={`sms2-${v[3]}`} style={{ background: "#1d9e75", borderRadius: "10px 10px 2px 10px", padding: "10px 12px", fontSize: "11px", color: "white", lineHeight: 1.5, opacity: 0, animation: "smsFadeIn 0.4s 2s ease forwards" }}>
                Votre soin est prêt — à bientôt !
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step labels — all rendered, opacity transitions */}
      <div style={{ position: "relative", height: "20px", marginTop: "16px" }}>
        {labels.map((label, i) => (
          <p key={i} style={{
            position: "absolute", inset: 0, margin: 0,
            textAlign: "center", fontSize: "13px", color: "#5C5C5C", fontWeight: 500,
            opacity: i === step ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}>
            {label}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ─── Hero CSS illustration ─── */
function HeroIllustration() {
  return (
    <div style={{ position: "relative", width: "340px", height: "190px", margin: "0 auto", animation: "float 4s ease-in-out infinite" }}>
      {/* Plaquette NFC */}
      <div style={{
        position: "absolute", left: "0", top: "50%", marginTop: "-34px",
        width: "108px", height: "66px", borderRadius: "10px",
        background: "linear-gradient(135deg, #8B6914, #6B4F10)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.22)",
        transform: "rotate(-8deg) translateX(-20px) translateY(8px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 12C6 8.686 8.686 6 12 6" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M3 12C3 7.029 7.029 3 12 3" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M9 12C9 10.343 10.343 9 12 9" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="1.5" fill="white"/>
        </svg>
        <span style={{ fontSize: "7px", color: "white", opacity: 0.9, textAlign: "center", lineHeight: 1.3 }}>Boulangerie<br/>Martin</span>
      </div>

      {/* Loyalty card */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
        width: "190px", height: "116px", borderRadius: "12px",
        background: "linear-gradient(135deg, #1d9e75 0%, #0D7A5A 100%)",
        boxShadow: "0 24px 60px rgba(29,158,117,0.25)",
        padding: "13px 15px", zIndex: 2,
      }}>
        <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.55)", marginBottom: "3px" }}>Stampify</div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "white", marginBottom: "8px" }}>Boulangerie Martin</div>
        <div style={{ display: "flex", gap: "5px" }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{
              width: "11px", height: "11px", borderRadius: "50%",
              background: i < 7 ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.18)",
            }} />
          ))}
        </div>
        <div style={{ fontSize: "7.5px", color: "rgba(255,255,255,0.65)", marginTop: "6px" }}>7 / 10 · encore 3 pour votre café</div>
      </div>

      {/* Phone */}
      <div style={{
        position: "absolute", right: "0", top: "50%", marginTop: "-56px",
        width: "62px", height: "112px", borderRadius: "14px",
        background: "#1A1A1A", boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
        transform: "rotate(6deg) translateX(20px) translateY(4px)",
        padding: "5px", zIndex: 1,
      }}>
        <div style={{ background: "#FBF8F3", borderRadius: "10px", height: "100%", padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
          <div style={{ width: "100%", height: "26px", borderRadius: "5px", background: "#1d9e75" }} />
          <div style={{ fontSize: "6.5px", color: "#1d9e75", textAlign: "center" }}>✓ Tampon ajouté</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Loyalty card animated ─── */
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
      <div style={{ display: "flex", gap: "9px", flexWrap: "wrap", marginBottom: "12px" }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} style={{
            width: "20px", height: "20px", borderRadius: "50%",
            background: i < count ? "white" : "rgba(255,255,255,0.2)",
            transition: "all 0.3s ease",
            transform: i === count - 1 && count > 0 ? "scale(1.25)" : "scale(1)",
          }} />
        ))}
      </div>
      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
        {count} / 10 · {count < 10 ? `encore ${10 - count} pour votre récompense` : "🎉 Récompense disponible !"}
      </div>
    </div>
  );
}

/* ─── Wheel SVG ─── */
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
      {/* Spinning wheel only — the pointer is outside */}
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
      {/* Fixed pointer — never spins */}
      <svg style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }} viewBox="0 0 300 300" width={size} height={size}>
        <polygon points="150,2 144,18 156,18" fill="#1A1A1A" />
      </svg>
    </div>
  );
}

/* ─── SMS mockup ─── */
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

/* ─── NFC animation ─── */
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

/* ─── FAQ item ─── */
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

/* ─── Shared button styles ─── */
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
const badge = (green = true): React.CSSProperties => ({
  display: "inline-block",
  background: green ? "#E8F7F2" : "#F2EFE9",
  color: green ? "#1d9e75" : "#5C5C5C",
  borderRadius: "980px", padding: "6px 16px",
  fontSize: "13px", fontWeight: 500, marginBottom: "20px",
});
const checkItem: React.CSSProperties = { display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "16px", color: "#1A1A1A", lineHeight: 1.5 };

/* ─── Main page ─── */
export default function V4Page() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setStep(s => (s + 1) % 4), 3000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.07 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const maxW = { maxWidth: "900px", margin: "0 auto" };

  return (
    <>
      {/* ══════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#FBF8F3", position: "relative", overflow: "hidden", paddingTop: "120px", paddingBottom: "80px" }}>
        <BrandPattern opacity={0.03} />
        <StampMotif style={{ right: "-60px", top: "80px" }} />
        <div style={{ ...maxW, position: "relative", zIndex: 1 }}>
          <div className="hero-split" style={{ display: "flex", gap: "56px", alignItems: "center" }}>
            {/* Left — text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="fade-up" style={badge()}>✦ Livraison en 48h garantie</div>
              <WordTitle
                text={"Vos clients\nreviennent.\nÀ chaque fois."}
                style={{ fontSize: "clamp(40px,6vw,68px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, color: "#1A1A1A", marginBottom: "24px" }}
              />
              <p className="fade-up" style={{ fontSize: "19px", color: "#5C5C5C", marginBottom: "32px", lineHeight: 1.5, animationDelay: "0.3s" }}>
                Site vitrine + carte fidélité digitale + plaquette NFC gravée.<br/>990 CHF, une fois. À vous pour toujours.
              </p>
              <div className="fade-up hero-btns" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px", animationDelay: "0.4s" }}>
                <a href={WA_MAIN} target="_blank" rel="noopener noreferrer" style={greenBtn}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#0D7A5A"; e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#1d9e75"; e.currentTarget.style.transform = "scale(1)"; }}>
                  Obtenir mon site — 990 CHF
                </a>
                <a href="https://loyalty-cards-rho.vercel.app/lessence-spa.html" target="_blank" rel="noopener noreferrer" style={outlineBtn}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1A1A1A"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1A1A1A"; }}>
                  Voir la démo →
                </a>
              </div>
              <p className="fade-up" style={{ fontSize: "13px", color: "#5C5C5C", letterSpacing: "0.04em", animationDelay: "0.5s" }}>
                990 CHF · Paiement unique · 48h · Suisse romande
              </p>
            </div>
            {/* Right — animated steps */}
            <div className="fade-up hero-anim" style={{ flex: "0 0 auto", animationDelay: "0.4s" }}>
              <HeroStepAnimation step={step} />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — AVANT / APRÈS
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#F2EFE9" }}>
        <div style={maxW}>
          <h2 className="fade-up" style={{ fontSize: "clamp(36px,5vw,48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", textAlign: "center", marginBottom: "48px" }}>
            Le commerce local en 2026.<br />Avant et après Stampify.
          </h2>
          <div className="fade-up" style={{ maxWidth: "720px", margin: "0 auto", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {/* Header */}
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

      {/* ══════════════════════════════════════════
          SECTION 3 — STATS MACRO
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#FBF8F3", position: "relative", overflow: "hidden" }}>
        <StampMotif style={{ left: "-60px", bottom: "40px" }} />
        <div style={{ ...maxW, position: "relative", zIndex: 1 }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", maxWidth: "700px", margin: "0 auto 24px" }}>
            {[
              { n: "400 000+", l: "commerces locaux en Suisse et France sans outil de fidélité digitale" },
              { n: "67%", l: "de dépenses supplémentaires d'un client fidèle vs un nouveau client" },
              { n: "40%+", l: "d'augmentation du taux de retour client avec une carte fidélité digitale" },
              { n: "48h", l: "pour avoir votre site en ligne, carte fidélité et plaquette NFC incluses" },
            ].map((s, i) => (
              <div key={i} className="fade-up" style={{ textAlign: "center", padding: "32px 16px", transitionDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: "clamp(40px,6vw,64px)", fontWeight: 800, color: "#1d9e75", lineHeight: 1, marginBottom: "12px" }}>{s.n}</div>
                <div style={{ fontSize: "15px", color: "#5C5C5C", lineHeight: 1.5 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <p className="fade-up" style={{ textAlign: "center", fontSize: "11px", color: "#5C5C5C", fontStyle: "italic" }}>
            Sources : Invesp, Bain &amp; Company, études internes Stampify 2024-2025
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — LOGOS CLIENTS (marquee)
      ══════════════════════════════════════════ */}
      <section className="sec-pad-sm" style={{ background: "#F2EFE9", overflow: "hidden" }}>
        <p className="fade-up" style={{ textAlign: "center", fontSize: "17px", fontWeight: 600, color: "#5C5C5C", marginBottom: "32px" }}>
          Ils nous font confiance pour leur présence digitale
        </p>
        <div style={{ overflow: "hidden", position: "relative" }}>
          <div style={{ display: "flex", gap: "12px", width: "max-content", animation: "marquee 30s linear infinite" }}>
            {[...LOGOS, ...LOGOS].map((name, i) => (
              <div key={i} style={{ background: "#FBF8F3", borderRadius: "980px", padding: "10px 20px", fontSize: "14px", fontWeight: 600, color: "#1A1A1A", whiteSpace: "nowrap", flexShrink: 0 }}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — AVIS CLIENTS
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#FBF8F3" }}>
        <div style={maxW}>
          <h2 className="fade-up" style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", textAlign: "center", marginBottom: "48px" }}>
            Ils nous font confiance.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "24px" }}>
            {[
              { initials: "SM", quote: "J'avais essayé de créer mon site sur Wix — j'ai abandonné après 3 heures. Stampify m'a livré un site complet en 2 jours. Mes clients adorent la carte fidélité.", name: "Sophie M.", commerce: "Boulangerie artisanale, Lausanne" },
              { initials: "KB", quote: "La plaquette NFC sur mon comptoir fait souvent réagir les clients. Ils trouvent ça moderne. Et moi, j'ai enfin une carte fidélité qui fonctionne — plus de cartes perdues.", name: "Karim B.", commerce: "Café & brunch, Genève" },
              { initials: "MF", quote: "990 CHF pour le site, la carte, et la plaquette. Mon ancienne agence me demandait 3 500 CHF juste pour le site. Le rapport qualité-prix est imbattable.", name: "Marie-Claire F.", commerce: "Salon de coiffure, Fribourg" },
            ].map((r, i) => (
              <div key={i} className="fade-up" style={{ background: "#FFFFFF", borderRadius: "20px", padding: "32px", transition: "transform 0.3s ease, box-shadow 0.3s ease", transitionDelay: `${i * 0.1}s`, cursor: "default" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: "40px", color: "#E8F7F2", fontWeight: 800, lineHeight: 1, marginBottom: "8px" }}>"</div>
                <div style={{ color: "#f5a623", fontSize: "15px", marginBottom: "12px" }}>★★★★★</div>
                <p style={{ fontSize: "15px", color: "#1A1A1A", lineHeight: 1.7, fontStyle: "italic", marginBottom: "16px" }}>"{r.quote}"</p>
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

      {/* ══════════════════════════════════════════
          SECTION 5b — SAAS METRICS (dark)
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#1A1A1A", position: "relative", overflow: "hidden" }}>
        <BrandPattern opacity={0.05} color="#1d9e75" />
        <div style={{ ...maxW, position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="fade-up" style={{ display: "inline-block", background: "rgba(29,158,117,0.15)", color: "#1d9e75", borderRadius: "980px", padding: "6px 16px", fontSize: "13px", fontWeight: 500, marginBottom: "20px" }}>Résultats prouvés</div>
            <h2 className="fade-up" style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "white", marginBottom: "16px" }}>
              Des chiffres qui parlent.
            </h2>
            <p className="fade-up" style={{ fontSize: "17px", color: "rgba(255,255,255,0.45)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
              Nos clients voient leurs clients revenir plus souvent, dès les premières semaines.
            </p>
          </div>

          {/* Metrics row */}
          <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", marginBottom: "24px" }}>
            {[
              { n: "67%", label: "taux de retour moyen", sub: "vs 32% sans fidélité" },
              { n: "4.8★", label: "satisfaction client", sub: "sur 140+ avis Google" },
              { n: "2×", label: "panier moyen", sub: "clients fidèles vs nouveaux" },
            ].map((m, i) => (
              <div key={i} className="fade-up" style={{ background: "#252525", borderRadius: "20px", padding: "28px 24px", transitionDelay: `${i*0.1}s` }}>
                <div style={{ fontSize: "clamp(36px,4vw,52px)", fontWeight: 800, color: "#1d9e75", lineHeight: 1, marginBottom: "8px" }}>{m.n}</div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "white", marginBottom: "4px" }}>{m.label}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Chart + comparison */}
          <div className="charts-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* Line chart */}
            <div className="fade-up" style={{ background: "#252525", borderRadius: "20px", padding: "28px 24px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", marginBottom: "4px" }}>TAUX DE RETOUR CLIENT</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "white", marginBottom: "24px" }}>+35% en 4 mois</div>
              <svg viewBox="0 0 260 90" width="100%" style={{ overflow: "visible" }}>
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1d9e75" stopOpacity="0.28"/>
                    <stop offset="100%" stopColor="#1d9e75" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {[0,22,45,67,90].map(y => <line key={y} x1="0" y1={y} x2="260" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>)}
                <path d="M0,78 L43,68 L87,52 L130,38 L173,24 L217,14 L260,6 L260,90 L0,90 Z" fill="url(#cg)"/>
                <path d="M0,78 L43,68 L87,52 L130,38 L173,24 L217,14 L260,6" stroke="#1d9e75" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                {[[0,78],[43,68],[87,52],[130,38],[173,24],[217,14],[260,6]].map(([x,y],i) => (
                  <circle key={i} cx={x} cy={y} r="3.5" fill="#1d9e75"/>
                ))}
                {["Jan","Fév","Mar","Avr","Mai","Jun","Jul"].map((m, i) => (
                  <text key={i} x={i*43} y="105" fill="rgba(255,255,255,0.25)" fontSize="8" textAnchor="middle">{m}</text>
                ))}
              </svg>
            </div>
            {/* Price comparison */}
            <div className="fade-up" style={{ background: "#252525", borderRadius: "20px", padding: "28px 24px", transitionDelay: "0.1s" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", marginBottom: "4px" }}>PRIX DU MARCHÉ SUISSE</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "white", marginBottom: "24px" }}>5× moins cher</div>
              {[
                { label: "Agence", price: "3 500–6 000 CHF", w: "100%", color: "#ef4444", sub: "site seul, sans fidélité" },
                { label: "Freelance", price: "1 500–2 500 CHF", w: "60%", color: "#f59e0b", sub: "délais variables" },
                { label: "Stampify", price: "990 CHF tout inclus", w: "25%", color: "#1d9e75", sub: "site + carte + NFC + 48h" },
              ].map((r, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? "16px" : "0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{r.label}</span>
                    <span style={{ fontSize: "12px", color: r.color, fontWeight: 600 }}>{r.price}</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px", height: "7px", overflow: "hidden" }}>
                    <div style={{ width: r.w, height: "100%", background: r.color, borderRadius: "4px" }} />
                  </div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", marginTop: "3px" }}>{r.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6 — DÉMO SPA SHOWCASE
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#F2EFE9" }}>
        <div style={maxW}>
          <div className="spa-showcase" style={{ display: "flex", gap: "56px", alignItems: "center" }}>
            {/* Left — browser mockup */}
            <div className="fade-up spa-mock" style={{ flex: "0 0 auto", maxWidth: "460px", width: "100%" }}>
              <div style={{ background: "#E2E2E2", borderRadius: "14px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.14)" }}>
                {/* Browser chrome */}
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
                {/* Live iframe preview of the actual spa demo */}
                <div style={{ position: "relative", overflow: "hidden", height: "290px" }}>
                  <iframe
                    src="https://loyalty-cards-rho.vercel.app/lessence-spa.html"
                    title="Démo Spa Essence — Stampify"
                    loading="lazy"
                    style={{
                      position: "absolute", top: 0, left: 0,
                      width: "260%", height: "775px",
                      transform: "scale(0.385)", transformOrigin: "top left",
                      border: "none", pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Right — text + CTA */}
            <div className="fade-up" style={{ flex: 1 }}>
              <div style={badge()}>⭐ Le plus demandé</div>
              <h2 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "16px" }}>
                Voyez ce qu&apos;on<br/>peut faire pour<br/>votre commerce.
              </h2>
              <p style={{ fontSize: "17px", color: "#5C5C5C", lineHeight: 1.7, marginBottom: "28px" }}>
                Spa Essence, Genève — site vitrine 5 pages, carte fidélité &ldquo;soin offert&rdquo;, plaquette NFC gravée. Livré en 48h. Exactement ce que nous ferons pour vous.
              </p>
              <a href="https://loyalty-cards-rho.vercel.app/lessence-spa.html" target="_blank" rel="noopener noreferrer"
                style={{ ...greenBtn, display: "inline-block", marginBottom: "20px" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#0D7A5A"; e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#1d9e75"; e.currentTarget.style.transform = "scale(1)"; }}>
                Accéder à la démo complète →
              </a>
              <div>
                <Link href="/v4/demos" style={{ fontSize: "14px", color: "#5C5C5C", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#1A1A1A"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#5C5C5C"; }}>
                  Voir d&apos;autres exemples (café, restaurant, barbershop…) →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 7 — FEATURES
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#FBF8F3" }}>
        <div style={maxW}>
          <h2 className="fade-up" style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", textAlign: "center", marginBottom: "48px" }}>
            Tout ce dont votre commerce<br />a besoin. Réuni.
          </h2>
          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "20px" }}>
            {[
              {
                icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="11" stroke="#1d9e75" strokeWidth="1.5"/><ellipse cx="14" cy="14" rx="5" ry="11" stroke="#1d9e75" strokeWidth="1.5"/><path d="M3 14h22" stroke="#1d9e75" strokeWidth="1.5"/></svg>,
                title: "Site professionnel", desc: "5 pages, SEO local, domaine .ch inclus.",
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="7" width="20" height="14" rx="3" stroke="#1d9e75" strokeWidth="1.5"/><circle cx="14" cy="14" r="3" stroke="#1d9e75" strokeWidth="1.5"/></svg>,
                title: "Carte fidélité digitale", desc: "QR code ou NFC. Aucune app requise.",
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M7 14C7 10.134 10.134 7 14 7" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"/><path d="M4 14C4 8.477 8.477 4 14 4" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 14C10 11.791 11.791 10 14 10" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"/><circle cx="14" cy="14" r="2" fill="#1d9e75"/></svg>,
                title: "Plaquette NFC gravée", desc: "En bois, à votre nom, sur votre comptoir.",
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="6" width="17" height="13" rx="3" stroke="#1d9e75" strokeWidth="1.5"/><path d="M13 19v3M9 22h8" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"/><path d="M21 9h3M21 14h3" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"/></svg>,
                title: "Campagnes SMS", desc: "Envoyez une promo à tous vos clients en 2 clics.",
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="4" width="20" height="20" rx="3" stroke="#1d9e75" strokeWidth="1.5"/><path d="M4 10h20M10 4v6M18 4v6" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"/></svg>,
                title: "Réservations & commandes", desc: "Table, RDV, pré-commande depuis votre site.",
              },
              {
                icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="20" width="4" height="4" rx="1" fill="#1d9e75"/><rect x="10" y="14" width="4" height="10" rx="1" fill="#1d9e75"/><rect x="16" y="8" width="4" height="16" rx="1" fill="#1d9e75"/><rect x="22" y="4" width="4" height="20" rx="1" fill="#1d9e75"/></svg>,
                title: "Tableau de bord", desc: "Stats en temps réel depuis votre téléphone.",
              },
            ].map((f, i) => (
              <div key={i} className="fade-up feature-card" style={{ background: "#FFFFFF", borderRadius: "20px", padding: "32px", transition: "transform 0.3s ease, box-shadow 0.3s ease", transitionDelay: `${i * 0.08}s` }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)"; }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "#E8F7F2", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>{f.icon}</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A1A", marginBottom: "8px" }}>{f.title}</div>
                <div style={{ fontSize: "15px", color: "#5C5C5C", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 8 — PLAQUETTE NFC
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#F2EFE9" }}>
        <div style={maxW}>
          <div className="split-section" style={{ display: "flex", gap: "64px", alignItems: "center" }}>
            <div className="fade-up split-img" style={{ flex: "0 0 auto", maxWidth: "440px", width: "100%" }}>
              <img
                src={IMG.plaque}
                alt="Paiement digital par carte — expérience client fluide"
                loading="lazy"
                decoding="async"
                width={800}
                height={533}
                style={{ width: "100%", borderRadius: "20px", boxShadow: "0 24px 60px rgba(0,0,0,0.10)", aspectRatio: "3/2", objectFit: "cover", display: "block" }}
              />
              <p style={{ fontSize: "11px", color: "#5C5C5C", marginTop: "8px" }}>Photo : Unsplash</p>
            </div>
            <div className="fade-up" style={{ flex: 1 }}>
              <div style={badge()}>✦ Incluse dans le forfait</div>
              <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "20px" }}>
                En bois.<br />Gravée à votre nom.<br />Livrée avec votre commande.
              </h2>
              <p style={{ fontSize: "17px", color: "#5C5C5C", lineHeight: 1.7, marginBottom: "24px" }}>
                La plaquette est posée sur votre comptoir. Vos clients approchent leur téléphone. Leur carte fidélité s&apos;ouvre instantanément. Sans app. Sans compte. Sans friction.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {["Gravure laser personnalisée (nom, logo)", "Compatible iPhone et Android", "Fonctionne aussi avec QR code imprimable", "Bois naturel, durable, élégant", "Livrée avec le reste de votre commande"].map((item, i) => (
                  <div key={i} className="fade-up" style={{ ...checkItem, transitionDelay: `${i * 0.08}s` }}>
                    <span style={{ color: "#1d9e75", fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                  </div>
                ))}
              </div>
              <NFCAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 9 — USAGE RÉEL
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#FBF8F3" }}>
        <div style={maxW}>
          <div className="split-section-reverse" style={{ display: "flex", gap: "64px", alignItems: "center", flexDirection: "row-reverse" }}>
            <div className="fade-up split-img" style={{ flex: "0 0 auto", maxWidth: "440px", width: "100%" }}>
              <img
                src={IMG.nfcUsage}
                alt="Client qui tape son téléphone sur le terminal NFC Stampify"
                loading="lazy"
                decoding="async"
                width={800}
                height={533}
                style={{ width: "100%", borderRadius: "20px", boxShadow: "0 24px 60px rgba(0,0,0,0.10)", aspectRatio: "3/2", objectFit: "cover", display: "block" }}
              />
              <p style={{ fontSize: "11px", color: "#5C5C5C", marginTop: "8px" }}>Photo : Unsplash</p>
            </div>
            <div className="fade-up" style={{ flex: 1 }}>
              <div style={badge()}>Résultats réels</div>
              <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "20px" }}>
                Vos clients adorent.<br />Vos concurrents, moins.
              </h2>
              <p style={{ fontSize: "17px", color: "#5C5C5C", lineHeight: 1.7, marginBottom: "32px" }}>
                Chaque commerçant Stampify reçoit son propre site, sa propre marque, sa propre relation client. Pas un profil sur une plateforme tierce. Le vôtre. 100% à vous.
              </p>
              <a href="https://loyalty-cards-rho.vercel.app/lessence-spa.html" target="_blank" rel="noopener noreferrer" style={outlineBtn}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1A1A1A"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1A1A1A"; }}>
                Voir un exemple réel →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 10 — CARTE FIDÉLITÉ ANIMÉE
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#F2EFE9" }}>
        <div style={maxW}>
          <div className="split-section" style={{ display: "flex", gap: "64px", alignItems: "center" }}>
            <div className="fade-up" style={{ flex: "0 0 auto" }}>
              <LoyaltyCardAnimated />
            </div>
            <div className="fade-up" style={{ flex: 1 }}>
              <div style={badge()}>✦ Zéro application requise</div>
              <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "20px" }}>
                La carte papier<br />finit à la poubelle.<br />La digitale, jamais.
              </h2>
              <p style={{ fontSize: "17px", color: "#5C5C5C", lineHeight: 1.7, marginBottom: "24px" }}>
                Vos clients ne perdent plus leur carte. Chaque passage est enregistré automatiquement. Vous choisissez la récompense, le nombre de tampons, les couleurs.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {["10 cases personnalisables (couleurs, icônes)", "QR code ou NFC tap — sans app", "Tampons qui n'expirent jamais", "Notifications automatiques à la récompense", "Dashboard temps réel"].map((item, i) => (
                  <div key={i} className="fade-up" style={{ ...checkItem, transitionDelay: `${i * 0.08}s` }}>
                    <span style={{ color: "#1d9e75", fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 11 — ROUE
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#FBF8F3", position: "relative", overflow: "hidden" }}>
        <StampMotif style={{ right: "-60px", top: "50px" }} />
        <div style={{ ...maxW, position: "relative", zIndex: 1 }}>
          <div className="split-section-reverse" style={{ display: "flex", gap: "64px", alignItems: "center", flexDirection: "row-reverse" }}>
            <div className="fade-up" style={{ flex: "0 0 auto" }}>
              <WheelSVG size={280} />
            </div>
            <div className="fade-up" style={{ flex: 1 }}>
              <div style={badge()}>Gamification + avis Google inclus</div>
              <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "20px" }}>
                Vos clients jouent,<br />laissent un avis,<br />reviennent.
              </h2>
              <p style={{ fontSize: "17px", color: "#5C5C5C", lineHeight: 1.7, marginBottom: "20px" }}>
                La roue de la fortune et la loterie offrent un produit à votre client — en échange d&apos;un avis Google. Vos avis augmentent automatiquement, votre réputation aussi.
              </p>

              {/* Google reviews stats */}
              <div style={{ background: "#F2EFE9", borderRadius: "16px", padding: "16px 20px", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { stat: "3×", text: "plus de visites pour les commerces avec 50+ avis Google" },
                  { stat: "88%", text: "des clients consultent les avis Google avant de visiter" },
                  { stat: "8/10", text: "clients qui jouent laissent un avis après avoir gagné" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "20px", fontWeight: 800, color: "#1d9e75", minWidth: "40px", flexShrink: 0 }}>{s.stat}</span>
                    <span style={{ fontSize: "14px", color: "#5C5C5C", lineHeight: 1.4 }}>{s.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
                {["Lots 100% personnalisables (produit, réduction, café offert…)", "Échange automatique : lot contre avis Google en 1 clic", "Fréquence et probabilité configurables depuis le dashboard", "Roue + loterie — deux mécaniques, une seule interface"].map((item, i) => (
                  <div key={i} style={checkItem}><span style={{ color: "#1d9e75", fontWeight: 700, flexShrink: 0 }}>✓</span> {item}</div>
                ))}
              </div>
              <Link href="/v4/demos" style={outlineBtn}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1A1A1A"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1A1A1A"; }}>
                Voir la démo →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 12 — SMS MOCKUP
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#F2EFE9" }}>
        <div style={maxW}>
          <div className="split-section" style={{ display: "flex", gap: "64px", alignItems: "center" }}>
            <div className="fade-up" style={{ flex: 1 }}>
              <div style={{ ...badge(), background: "#E8F7F2", color: "#1d9e75" }}>Add-on à partir de 49 CHF/mois</div>
              <h2 style={{ fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", marginBottom: "20px" }}>
                Vos clients reviennent.<br />Automatiquement.
              </h2>
              <p style={{ fontSize: "17px", color: "#5C5C5C", lineHeight: 1.7, marginBottom: "24px" }}>
                15 triggers SMS configurables. Anniversaire, inactivité, récompense, promo flash. Zéro effort de votre part.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {["SMS anniversaire automatique", "Relance client inactif (14/30/60 jours)", "Rappel réservation automatique", "Promo flash en 2 clics depuis le dashboard", "Notification récompense fidélité"].map((item, i) => (
                  <div key={i} className="fade-up" style={{ ...checkItem, transitionDelay: `${i * 0.08}s` }}>
                    <span style={{ color: "#1d9e75", fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="fade-up" style={{ flex: "0 0 auto" }}>
              <SMSMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 13 — COMPARATIF POINZ
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#FBF8F3" }}>
        <div style={maxW}>
          <h2 className="fade-up" style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", textAlign: "center", marginBottom: "12px" }}>
            Pourquoi Stampify<br />plutôt que Poinz ?
          </h2>
          <p className="fade-up" style={{ fontSize: "19px", color: "#5C5C5C", textAlign: "center", maxWidth: "560px", margin: "0 auto 40px", lineHeight: 1.5 }}>
            Poinz est un outil de fidélité gratuit. Stampify est différent — votre site, votre marque, votre relation client. 100% à vous.
          </p>

          {/* Mini cards */}
          <div className="comparatif-mini" style={{ display: "flex", gap: "16px", maxWidth: "600px", margin: "0 auto 32px" }}>
            <div style={{ flex: 1, background: "#F2EFE9", borderRadius: "16px", padding: "24px", opacity: 0.75 }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#5C5C5C", marginBottom: "10px" }}>Avec Poinz</div>
              <div style={{ fontSize: "14px", color: "#ef4444" }}>❌ Logo Poinz imposé partout</div>
              <div style={{ fontSize: "13px", color: "#5C5C5C", marginTop: "6px" }}>Votre commerce, leur marque.</div>
            </div>
            <div style={{ flex: 1, background: "#E8F7F2", borderRadius: "16px", padding: "24px", border: "2px solid #1d9e75" }}>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#1d9e75", marginBottom: "10px" }}>Avec Stampify</div>
              <div style={{ fontSize: "14px", color: "#1d9e75" }}>✓ 100% votre nom, votre marque</div>
              <div style={{ fontSize: "13px", color: "#5C5C5C", marginTop: "6px" }}>Boulangerie Martin — votre site, votre carte.</div>
            </div>
          </div>

          {/* Full table */}
          <div className="fade-up" style={{ maxWidth: "720px", margin: "0 auto", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", background: "#1A1A1A", padding: "16px 24px" }}>
              {["Fonctionnalité", "Stampify", "Poinz"].map((h) => (
                <div key={h} style={{ fontSize: "14px", fontWeight: 600, color: "white" }}>{h}</div>
              ))}
            </div>
            {[
              ["Site vitrine personnalisé", "✓", "✗"],
              ["Votre propre branding", "✓", "✗ (logo Poinz)"],
              ["Carte fidélité digitale", "✓", "✓"],
              ["Plaquette NFC gravée", "✓", "✗"],
              ["Domaine .ch à votre nom", "✓", "✗"],
              ["SEO local optimisé", "✓", "✗"],
              ["Campagnes SMS", "✓", "Limité"],
              ["Dashboard analytics", "✓", "Limité"],
              ["Prix", "990 CHF · une fois", "Gratuit mais limité"],
              ["Propriétaire à 100%", "✓", "✗"],
            ].map(([feature, stampify, poinz], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", background: i % 2 === 0 ? "#FFFFFF" : "#FBF8F3", padding: "14px 24px", borderBottom: "1px solid #F2EFE9" }}>
                <div style={{ fontSize: "14px", color: "#1A1A1A" }}>{feature}</div>
                <div style={{ fontSize: "14px", color: stampify === "✓" ? "#1d9e75" : "#1A1A1A", fontWeight: stampify === "✓" ? 600 : 400 }}>{stampify}</div>
                <div style={{ fontSize: "14px", color: poinz === "✗" || poinz.startsWith("✗") ? "#ef4444" : "#5C5C5C" }}>{poinz}</div>
              </div>
            ))}
          </div>
          <p className="fade-up" style={{ textAlign: "center", fontSize: "13px", color: "#5C5C5C", fontStyle: "italic", marginTop: "20px", maxWidth: "560px", margin: "20px auto 0" }}>
            Poinz est excellent pour la fidélité basique. Stampify est pour les commerçants qui veulent leur propre marque et une présence digitale complète.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 14 — TARIF
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#F2EFE9", position: "relative", overflow: "hidden" }}>
        <BrandPattern opacity={0.03} />
        <StampMotif style={{ left: "50%", marginLeft: "-100px", top: "40px" }} />
        <div style={{ ...maxW, position: "relative", zIndex: 1 }}>
          <h2 className="fade-up" style={{ fontSize: "clamp(40px,6vw,64px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", textAlign: "center", marginBottom: "48px" }}>
            Un seul paiement.<br />Pour toujours.
          </h2>
          <div className="fade-up" style={{ maxWidth: "580px", margin: "0 auto", background: "#FFFFFF", borderRadius: "24px", padding: "48px 40px", boxShadow: "0 8px 48px rgba(0,0,0,0.08)" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={badge()}>✦ LE CHOIX DE NOS CLIENTS</div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
                <span style={{ fontSize: "96px", fontWeight: 800, letterSpacing: "-4px", color: "#1A1A1A", lineHeight: 1 }}>990</span>
                <span style={{ fontSize: "28px", fontWeight: 500, color: "#5C5C5C" }}>CHF</span>
              </div>
              <p style={{ fontSize: "15px", color: "#5C5C5C", marginTop: "8px" }}>paiement unique · aucun abonnement</p>
            </div>
            <div style={{ borderTop: "1px solid #F2EFE9", margin: "24px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              {["Site vitrine 5 pages sur mesure", "Carte fidélité digitale 10 cases", "Plaquette NFC en bois gravée à votre nom", "Domaine .ch + hébergement 1ère année", "SEO local optimisé", "QR code imprimable A4/A5", "1 campagne SMS offerte", "2 retouches incluses", "Guide vidéo d'utilisation", "Livraison en 48h garantie"].map((item, i) => (
                <div key={i} className="fade-up" style={{ ...checkItem, transitionDelay: `${i * 0.05}s` }}>
                  <span style={{ color: "#1d9e75", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: "16px" }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#F2EFE9", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", fontSize: "14px", color: "#5C5C5C", fontStyle: "italic", lineHeight: 1.6 }}>
              Une agence suisse facture 1 500–5 000 CHF pour un site seul. Stampify livre site + carte + NFC + SEO. Pour 990 CHF. En 48h.
            </div>
            <a href={WA_MAIN} target="_blank" rel="noopener noreferrer"
              style={{ ...greenBtn, display: "block", textAlign: "center" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#0D7A5A"; e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1d9e75"; e.currentTarget.style.transform = "scale(1)"; }}>
              Obtenir mon site — 990 CHF
            </a>

            <div style={{ textAlign: "center", fontSize: "13px", color: "#5C5C5C", margin: "32px 0 16px" }}>─── Suivi mensuel optionnel ───</div>
            <div className="addon-cards" style={{ display: "flex", gap: "16px" }}>
              {/* Essentiel */}
              <div style={{ flex: 1, background: "#F2EFE9", borderRadius: "16px", padding: "24px" }}>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#1A1A1A", marginBottom: "4px" }}>49 CHF <span style={{ fontSize: "14px", fontWeight: 400 }}>/ mois</span></div>
                <div style={{ fontSize: "12px", color: "#5C5C5C", marginBottom: "16px" }}>Sans engagement · résiliable à tout moment</div>
                {["Campagnes SMS manuelles", "15+ SMS automatiques", "Rapport mensuel", "Mises à jour mineures", "Support email"].map((f, i) => (
                  <div key={i} style={{ fontSize: "13px", color: "#1A1A1A", marginBottom: "6px", display: "flex", gap: "6px" }}>
                    <span style={{ color: "#1d9e75" }}>✓</span>{f}
                  </div>
                ))}
                <a href={WA_MAIN} target="_blank" rel="noopener noreferrer"
                  style={{ ...outlineBtn, display: "block", textAlign: "center", marginTop: "16px", padding: "12px 16px", fontSize: "14px" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1A1A1A"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1A1A1A"; }}>
                  Ajouter l&apos;Essentiel
                </a>
              </div>
              {/* Pro */}
              <div style={{ flex: 1, background: "#1A1A1A", borderRadius: "16px", padding: "24px", position: "relative" }}>
                <div style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "#1d9e75", color: "white", borderRadius: "980px", padding: "4px 12px", fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap" }}>RECOMMANDÉ</div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: "white", marginBottom: "4px" }}>79 CHF <span style={{ fontSize: "14px", fontWeight: 400 }}>/ mois</span></div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "16px" }}>Sans engagement</div>
                {["Tout l'Essentiel", "2 campagnes SMS/mois rédigées par nous", "Support prioritaire sous 4h", "Modifications avancées", "Revue stratégique trimestrielle"].map((f, i) => (
                  <div key={i} style={{ fontSize: "13px", color: "white", marginBottom: "6px", display: "flex", gap: "6px" }}>
                    <span style={{ color: "#1d9e75" }}>✓</span>{f}
                  </div>
                ))}
                <a href={WA_MAIN} target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", textAlign: "center", marginTop: "16px", padding: "12px 16px", fontSize: "14px", fontWeight: 600, borderRadius: "980px", background: "white", color: "#1A1A1A", textDecoration: "none", transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
                  Ajouter le Pro
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 15 — FAQ
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#FBF8F3" }}>
        <div style={maxW}>
          <h2 className="fade-up" style={{ fontSize: "clamp(36px,5vw,48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", textAlign: "center", marginBottom: "48px" }}>
            Questions fréquentes.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "680px", margin: "0 auto" }}>
            {[
              { q: "Est-ce que mes clients doivent télécharger une application ?", a: "Non. La carte s'ouvre directement dans Safari ou Chrome via QR code ou NFC. Aucun téléchargement, aucun compte." },
              { q: "Que se passe-t-il après la première année ?", a: "Domaine .ch ~25 CHF/an. Hébergement ~5 CHF/mois offert la 1ère année. Carte et dashboard : à vie. Aucun abonnement imposé." },
              { q: "Est-ce que je suis propriétaire du site ?", a: "Oui, à 100%. Code source, domaine, contenu — tout est à vous. Liberté totale." },
              { q: "Combien de temps pour mon site en ligne ?", a: "48h à partir de vos infos : photos, textes, horaires, couleurs. Garanti sans exception." },
              { q: "Vous travaillez en France aussi ?", a: "Oui. Suisse romande et France. Même forfait, mêmes délais, même qualité." },
              { q: "Quelle différence avec Poinz ?", a: "Poinz est gratuit mais tout reste sous leur marque. Avec Stampify : votre site, votre nom, votre relation client. 100% personnalisé." },
            ].map((item, i) => (
              <div key={i} className="fade-up" style={{ transitionDelay: `${i * 0.06}s` }}>
                <FAQItem q={item.q} a={item.a} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 16 — PROCESSUS
      ══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ background: "#F2EFE9" }}>
        <div style={maxW}>
          <h2 className="fade-up" style={{ fontSize: "clamp(36px,5vw,48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1A1A1A", textAlign: "center", marginBottom: "64px" }}>
            De zéro à votre site en 48h.
          </h2>
          <div className="process-steps" style={{ display: "flex", gap: "48px", alignItems: "flex-start", justifyContent: "center" }}>
            {[
              { n: "01", title: "Parlez-nous de votre commerce", desc: "Un échange WhatsApp de 10 minutes. Couleurs, horaires, style, logo." },
              { n: "02", title: "On crée tout en 48h", desc: "Site, carte, plaquette NFC gravée, SEO. Vous validez. On met en ligne." },
              { n: "03", title: "Vos clients reviennent", desc: "Sur Google. Plaquette sur votre comptoir. Fidélité automatique et SMS intelligents." },
            ].map((step, i) => (
              <div key={i} className="fade-up" style={{ flex: 1, maxWidth: "280px", transitionDelay: `${i * 0.12}s` }}>
                <div style={{ fontSize: "64px", fontWeight: 800, color: "#E8F7F2", lineHeight: 1, marginBottom: "8px" }}>{step.n}</div>
                <div style={{ fontSize: "21px", fontWeight: 700, color: "#1A1A1A", marginBottom: "8px", lineHeight: 1.3 }}>{step.title}</div>
                <div style={{ fontSize: "15px", color: "#5C5C5C", lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════ */}
      <section style={{ background: "#1A1A1A", padding: "120px 20px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <BrandPattern opacity={0.05} color="#FFFFFF" />
        <StampMotif style={{ left: "50%", marginLeft: "-100px", top: "40px", opacity: 1 }} />
        <div style={{ ...maxW, position: "relative", zIndex: 1 }}>
          <h2 className="fade-up" style={{ fontSize: "clamp(40px,6vw,64px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "white", marginBottom: "20px" }}>
            Votre commerce mérite<br />d&apos;être en ligne.
          </h2>
          <p className="fade-up" style={{ fontSize: "19px", color: "rgba(255,255,255,0.55)", marginBottom: "40px", lineHeight: 1.5 }}>
            990 CHF. 48h. Propriétaire à 100%.<br />Réponse en moins de 2h, 7j/7.
          </p>
          <div className="fade-up">
            <a href={WA_MAIN} target="_blank" rel="noopener noreferrer"
              style={{ ...greenBtn, padding: "20px 48px", fontSize: "18px" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#0D7A5A"; e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1d9e75"; e.currentTarget.style.transform = "scale(1)"; }}>
              Obtenir mon site maintenant →
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CSS ANIMATIONS + RESPONSIVE
      ══════════════════════════════════════════ */}
      <style>{`
        @keyframes wordIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes smsBubble {
          0% { opacity: 0; transform: translateY(8px); }
          10%, 60% { opacity: 1; transform: translateY(0); }
          68%, 100% { opacity: 0; transform: translateY(-4px); }
        }
        @keyframes arcFade {
          0% { opacity: 0; }
          30%, 60% { opacity: 0.8; }
          90%, 100% { opacity: 0; }
        }
        @keyframes phoneApproach {
          from { transform: translateX(20px); }
          to { transform: translateX(2px); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes rippleAnim {
          0% { transform: scale(0.8); opacity: 0.7; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes stampBounce {
          0% { transform: scale(1); }
          30% { transform: scale(1.55) rotate(-10deg); }
          60% { transform: scale(1.12) rotate(4deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes rewardPop {
          0% { transform: scale(0.4) translateY(16px); opacity: 0; }
          65% { transform: scale(1.06) translateY(-3px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes typewriterAnim {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes stepFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes smsFadeIn {
          from { opacity: 0; transform: translateX(-6px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .wheel-wrap { animation: spin 10s linear infinite; }
        .wheel-wrap:hover { animation-duration: 3s; }
        .demo-card:hover { transform: translateY(-6px) !important; box-shadow: 0 12px 40px rgba(0,0,0,0.1) !important; }
        @media (max-width: 900px) {
          .hero-split { flex-direction: column !important; }
          .hero-anim { width: 100% !important; }
          .spa-showcase { flex-direction: column !important; }
          .spa-mock { max-width: 100% !important; }
          .metrics-grid { grid-template-columns: 1fr 1fr !important; }
          .charts-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .hero-btns { flex-direction: column !important; align-items: flex-start !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .demos-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .split-section { flex-direction: column !important; }
          .split-section-reverse { flex-direction: column !important; }
          .split-img { order: -1 !important; max-width: 100% !important; }
          .addon-cards { flex-direction: column !important; }
          .comparatif-mini { flex-direction: column !important; }
          .process-steps { flex-direction: column !important; align-items: center !important; }
          .metrics-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .metrics-grid { grid-template-columns: 1fr !important; }
          .charts-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
