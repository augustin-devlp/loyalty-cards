"use client";

import { useState, useEffect } from "react";

const STEP_DURATION = 3200;

const STEPS = [
  { num: 1, label: "Le client scanne", sub: "Il pointe son appareil photo vers le QR code en caisse — sans télécharger d'app." },
  { num: 2, label: "Sa carte se crée", sub: "La carte fidélité vierge s'ouvre instantanément. Prête à recevoir ses premiers tampons." },
  { num: 3, label: "Les tampons s'ajoutent", sub: "À chaque visite, un tampon de plus. Le client voit sa progression en temps réel." },
  { num: 4, label: "Récompense débloquée", sub: "Le 8ème tampon s'allume — le café offert se débloque et le client reçoit une notification." },
];

/* ── shared phone frame SVG ── */
const PHONE = (
  <>
    <rect x="2" y="2" width="156" height="286" rx="24" fill="#1a1a2e"/>
    <rect x="2" y="2" width="156" height="286" rx="24" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
    <rect x="10" y="22" width="140" height="244" rx="9" fill="#f2f2f7"/>
    <rect x="52" y="9" width="56" height="11" rx="5.5" fill="#111"/>
    <rect x="55" y="272" width="50" height="3" rx="1.5" fill="rgba(0,0,0,0.1)"/>
  </>
);

/* ── shared card header — 8 stamps ── */
function CardHeader({ name = "Café Lumière" }: { name?: string }) {
  return (
    <>
      <rect x="16" y="32" width="128" height="94" rx="12" fill="#1d9e75"/>
      <defs>
        <linearGradient id="lfcg" x1="16" y1="32" x2="144" y2="126" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.17)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.07)"/>
        </linearGradient>
      </defs>
      <rect x="16" y="32" width="128" height="94" rx="12" fill="url(#lfcg)"/>
      <circle cx="32" cy="48" r="10" fill="rgba(255,255,255,0.2)"/>
      <text x="32" y="52" textAnchor="middle" fontSize="10" fill="#fff">☕</text>
      <text x="50" y="48" fontSize="11" fill="rgba(255,255,255,0.95)" fontFamily="Georgia,serif" fontWeight="bold">{name}</text>
      <text x="20" y="62" fontSize="7" fill="rgba(255,255,255,0.55)" fontFamily="sans-serif" letterSpacing="0.8">CARTE FIDÉLITÉ · 8 TAMPONS</text>
    </>
  );
}

/* 4 cols × 2 rows = 8 stamps, perfectly centered in card (x=16→144) */
function stampPos(i: number) {
  const col = i % 4;
  const row = Math.floor(i / 4);
  return { cx: 41 + col * 26, cy: 80 + row * 24 };
}

/* ── Step 1 : QR scan ── */
function StepScan() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <style>{`
        @keyframes lfscanLine { 0%{transform:translateY(0)} 100%{transform:translateY(88px)} }
        @keyframes lfpulse { 0%,100%{opacity:0.45} 50%{opacity:1} }
      `}</style>
      <div style={{ width: "100%", maxWidth: 200 }}>
        <svg width="100%" viewBox="0 0 160 290" fill="none">
          {PHONE}
          <rect x="28" y="44" width="104" height="104" rx="8" fill="rgba(0,0,0,0.04)"/>
          <path d="M28 64 L28 44 L48 44" stroke="#1d9e75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M112 44 L132 44 L132 64" stroke="#1d9e75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M28 128 L28 148 L48 148" stroke="#1d9e75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M112 148 L132 148 L132 128" stroke="#1d9e75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <rect x="36" y="52" width="22" height="22" rx="3" fill="none" stroke="#0f172a" strokeWidth="2"/>
          <rect x="40" y="56" width="14" height="14" rx="1" fill="#0f172a"/>
          <rect x="102" y="52" width="22" height="22" rx="3" fill="none" stroke="#0f172a" strokeWidth="2"/>
          <rect x="106" y="56" width="14" height="14" rx="1" fill="#0f172a"/>
          <rect x="36" y="118" width="22" height="22" rx="3" fill="none" stroke="#0f172a" strokeWidth="2"/>
          <rect x="40" y="122" width="14" height="14" rx="1" fill="#0f172a"/>
          {[[70,52],[78,52],[86,52],[70,60],[86,60],[70,68],[78,68],[86,68],[70,76],[78,84],[86,84],[70,84],[70,92],[78,92],[86,92],[70,100],[86,100],[70,108],[78,108],[86,108],[70,116],[78,116],[86,124],[70,124]].map(([x,y],i)=>(
            <rect key={i} x={x} y={y} width="5" height="5" rx="1" fill="#0f172a"/>
          ))}
          <circle cx="80" cy="90" r="7" fill="rgba(29,158,117,0.12)"/>
          <text x="80" y="94" textAnchor="middle" fontSize="8" fill="#1d9e75" fontWeight="bold" fontFamily="sans-serif">S</text>
          <line x1="30" y1="44" x2="130" y2="44" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"
            style={{ animation: "lfscanLine 1.1s linear infinite alternate" }}/>
          <text x="80" y="170" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="sans-serif"
            style={{ animation: "lfpulse 1.4s ease-in-out infinite" }}>📷 Appareil photo</text>
        </svg>
      </div>
    </div>
  );
}

/* ── Step 2 : Empty card just created ── */
function StepCard() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <style>{`
        @keyframes lfcardAppear {
          0% { opacity: 0; transform: scale(0.88) translateY(10px); }
          60% { transform: scale(1.03) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes lfcardPulse { 0%,100%{ opacity:0.5 } 50%{ opacity:1 } }
      `}</style>
      <div style={{ width: "100%", maxWidth: 200 }}>
        <svg width="100%" viewBox="0 0 160 290" fill="none">
          {PHONE}
          <g style={{ animation: "lfcardAppear 0.55s 0.2s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <CardHeader />
            {/* 8 empty stamps */}
            {Array.from({length:8},(_,i)=>{
              const {cx,cy}=stampPos(i);
              return (
                <circle key={i} cx={cx} cy={cy} r="8"
                  fill="rgba(255,255,255,0.12)"
                  stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"
                  strokeDasharray="2.5 2.5"/>
              );
            })}
            <rect x="16" y="136" width="128" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
            <text x="80" y="152" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.75)" fontFamily="sans-serif">0 / 8 — Carte prête !</text>
          </g>
          {/* success badge */}
          <g style={{ animation: "lfcardPulse 1.6s 0.8s ease-in-out infinite" }}>
            <rect x="24" y="161" width="112" height="22" rx="6" fill="rgba(255,255,255,0.15)"/>
            <text x="80" y="175" textAnchor="middle" fontSize="9" fill="#fff" fontFamily="sans-serif" fontWeight="600">✨ Carte créée avec succès</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ── Step 3 : Stamps appear one by one (7 stamps, gradual) ── */
function StepStamp() {
  /* 7 stamps pop in with 340ms stagger — total 7×340 = 2380ms */
  const stampDelay = (i: number) => i * 340;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <style>{`
        @keyframes sPop {
          0%   { transform: scale(0);    opacity: 0; }
          55%  { transform: scale(1.28); opacity: 1; }
          78%  { transform: scale(0.90); }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes sIcon { 0%,35%{ opacity:0 } 70%,100%{ opacity:1 } }
        @keyframes s3notif { 0%,72%{ opacity:0; transform:translateY(5px) } 85%,100%{ opacity:1; transform:translateY(0) } }
        @keyframes s3bar { from{ width:0 } to{ width:112px } }
      `}</style>
      <div style={{ width: "100%", maxWidth: 200 }}>
        <svg width="100%" viewBox="0 0 160 290" fill="none">
          {PHONE}
          <CardHeader />

          {/* Stamps 0–6 pop in with stagger, stamp 7 stays empty */}
          {Array.from({length:8},(_,i) => {
            const {cx,cy} = stampPos(i);
            if (i === 7) {
              return (
                <circle key={i} cx={cx} cy={cy} r="8"
                  fill="rgba(255,255,255,0.12)"
                  stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"
                  strokeDasharray="2.5 2.5"/>
              );
            }
            const delay = stampDelay(i);
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="8"
                  fill="rgba(255,255,255,0.88)"
                  stroke="rgba(255,255,255,0.4)" strokeWidth="1"
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    animation: `sPop 0.48s ${delay}ms cubic-bezier(0.36,0.07,0.19,0.97) both`,
                  }}/>
                <text x={cx} y={cy+4} textAnchor="middle" fontSize="9" fill="#1d9e75"
                  style={{ animation: `sIcon 0.48s ${delay + 60}ms ease both` }}>☕</text>
              </g>
            );
          })}

          {/* Progress bar growing to 7/8 */}
          <rect x="16" y="136" width="128" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
          <rect x="16" y="136" width="112" height="4" rx="2" fill="#fff" opacity="0.7"
            style={{ animation: "s3bar 2.38s ease both" }}/>
          <text x="80" y="152" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.85)" fontFamily="sans-serif">
            7 / 8 — Encore un !
          </text>

          {/* Notification — appears after last stamp */}
          <g style={{ animation: "s3notif 0.4s ease both", animationDuration: "0.4s", animationDelay: "2400ms" }}>
            <rect x="16" y="160" width="128" height="22" rx="7" fill="rgba(255,255,255,0.15)"/>
            <text x="80" y="174" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="sans-serif" fontWeight="600">✦ 7 tampons ajoutés</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ── Step 4 : 8th stamp + reward + SMS notification ── */
function StepSuccess() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <style>{`
        @keyframes s8pop {
          0%  { transform: scale(0);    opacity: 0; }
          55% { transform: scale(1.3);  opacity: 1; }
          78% { transform: scale(0.88); }
          100%{ transform: scale(1);    opacity: 1; }
        }
        @keyframes s8icon {
          0%,35%{ opacity:0; transform:scale(0); }
          65%,100%{ opacity:1; transform:scale(1); }
        }
        @keyframes s8glow {
          0%,100%{ opacity:0.5; r:9; }
          50%{ opacity:1; r:11; }
        }
        @keyframes rewardSlide {
          0%,38%{ opacity:0; transform:translateY(10px); }
          55%,100%{ opacity:1; transform:translateY(0); }
        }
        @keyframes smsSlide {
          0%,58%{ opacity:0; transform:translateY(8px); }
          75%,100%{ opacity:1; transform:translateY(0); }
        }
      `}</style>
      <div style={{ width: "100%", maxWidth: 200 }}>
        <svg width="100%" viewBox="0 0 160 290" fill="none">
          {PHONE}
          <CardHeader />

          {/* Stamps 0–6 filled */}
          {Array.from({length:8},(_,i) => {
            const {cx,cy} = stampPos(i);
            if (i === 7) return null; // animated separately
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="8" fill="rgba(255,255,255,0.88)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                <text x={cx} y={cy+4} textAnchor="middle" fontSize="9" fill="#1d9e75">☕</text>
              </g>
            );
          })}

          {/* Stamp 7 (8th) — animated pop */}
          {(()=>{
            const {cx,cy} = stampPos(7);
            return (
              <g key="s7">
                <circle cx={cx} cy={cy} r="11" fill="rgba(255,255,255,0.2)"
                  style={{ transformBox:"fill-box", transformOrigin:"center", animation:"s8glow 1.2s 0.6s ease-in-out infinite" }}/>
                <circle cx={cx} cy={cy} r="8" fill="rgba(255,255,255,0.88)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"
                  style={{ transformBox:"fill-box", transformOrigin:"center", animation:"s8pop 0.5s 0.25s cubic-bezier(0.36,0.07,0.19,0.97) both" }}/>
                <text x={cx} y={cy+4} textAnchor="middle" fontSize="9" fill="#1d9e75"
                  style={{ transformBox:"fill-box", transformOrigin:"center", animation:"s8icon 0.45s 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both" }}>☕</text>
              </g>
            );
          })()}

          {/* Progress — full */}
          <rect x="16" y="136" width="128" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
          <rect x="16" y="136" width="128" height="4" rx="2" fill="#fff" opacity="0.85"/>
          <text x="80" y="152" textAnchor="middle" fontSize="9" fill="#fff" fontFamily="sans-serif" fontWeight="600">
            8 / 8 🎉
          </text>

          {/* Reward banner */}
          <g style={{ animation: "rewardSlide 0.5s 0.55s ease both" }}>
            <rect x="12" y="158" width="136" height="30" rx="8" fill="rgba(255,255,255,0.95)"/>
            <text x="80" y="170" textAnchor="middle" fontSize="10" fill="#1d9e75" fontFamily="sans-serif" fontWeight="700">☕ Café offert !</text>
            <text x="80" y="181" textAnchor="middle" fontSize="7.5" fill="#64748b" fontFamily="sans-serif">Montre ce message en caisse</text>
          </g>

          {/* SMS notification */}
          <g style={{ animation: "smsSlide 0.4s 0.9s ease both" }}>
            <rect x="10" y="196" width="140" height="34" rx="8" fill="#0f172a"/>
            <rect x="16" y="202" width="18" height="18" rx="9" fill="#1d9e75"/>
            <text x="25" y="214" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">S</text>
            <text x="40" y="210" fontSize="8" fill="rgba(255,255,255,0.55)" fontFamily="sans-serif">Stampify</text>
            <text x="40" y="221" fontSize="7.5" fill="#fff" fontFamily="sans-serif">🎉 Ton café offert t&apos;attend !</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function LoyaltyFlowMockup() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const tick = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setStep(s => (s + 1) % 4);
          return 0;
        }
        return p + 100 / (STEP_DURATION / 60);
      });
    }, 60);
    return () => clearInterval(tick);
  }, [step]);

  return (
    <div style={{ width: "100%" }}>
      <style>{`
        .lf-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 14px; }
        @media (max-width: 540px) { .lf-steps { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      {/* Step indicators */}
      <div className="lf-steps">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => { setStep(i); setProgress(0); }}
            style={{
              background: step === i ? "#1d9e75" : "#f1f5f9",
              border: "none", borderRadius: 10,
              padding: "10px 10px", cursor: "pointer",
              transition: "all 0.2s", textAlign: "left",
            }}
          >
            <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 9, fontWeight: 600, color: step===i?"rgba(255,255,255,0.65)":"#94a3b8", marginBottom: 2 }}>
              {s.num} / 4
            </div>
            <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 11, fontWeight: 600, color: step===i?"#fff":"#374151", lineHeight: 1.3 }}>
              {s.label}
            </div>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: "#f1f5f9", borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "#1d9e75", borderRadius: 2, transition: "width 0.06s linear" }} />
      </div>

      {/* Visual */}
      <div style={{ background: "#f8fafc", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "32px 24px 16px" }}>
          {step === 0 && <StepScan />}
          {step === 1 && <StepCard />}
          {step === 2 && <StepStamp />}
          {step === 3 && <StepSuccess />}
        </div>
        <div style={{ padding: "14px 24px 18px", borderTop: "1px solid #f0f0f0", background: "#fff", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
            {STEPS[step].sub}
          </div>
        </div>
      </div>
    </div>
  );
}
