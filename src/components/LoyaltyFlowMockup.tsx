"use client";

import { useState, useEffect } from "react";

const STEP_DURATION = 2800;

const STEPS = [
  { num: 1, label: "Le client scanne", sub: "Il pointe son appareil photo vers le QR code en caisse — sans télécharger d'app." },
  { num: 2, label: "Sa carte s'ouvre", sub: "La carte fidélité apparaît instantanément sur son téléphone." },
  { num: 3, label: "Tampon ajouté", sub: "Tu valides en un clic depuis ton tableau de bord. Le client voit la mise à jour en temps réel." },
  { num: 4, label: "C'est dans la poche", sub: "Il voit sa progression vers la récompense et revient." },
];

/* ── Step 1 : QR scan ── */
function StepScan() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <style>{`
        @keyframes lfscan { 0%{transform:translateY(0)} 100%{transform:translateY(88px)} }
        @keyframes lfpulse { 0%,100%{opacity:0.45} 50%{opacity:1} }
      `}</style>
      <div style={{ width: "100%", maxWidth: 200, position: "relative" }}>
        {/* Phone SVG — full width, scales with container */}
        <svg width="100%" viewBox="0 0 160 290" fill="none">
          <rect x="2" y="2" width="156" height="286" rx="24" fill="#1a1a2e"/>
          <rect x="2" y="2" width="156" height="286" rx="24" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
          <rect x="10" y="22" width="140" height="244" rx="9" fill="#f8f9fa"/>
          <rect x="52" y="9" width="56" height="11" rx="5.5" fill="#111"/>
          {/* camera finder */}
          <rect x="28" y="44" width="104" height="104" rx="8" fill="rgba(0,0,0,0.04)"/>
          {/* corner brackets */}
          <path d="M28 64 L28 44 L48 44" stroke="#1d9e75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M112 44 L132 44 L132 64" stroke="#1d9e75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M28 128 L28 148 L48 148" stroke="#1d9e75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M112 148 L132 148 L132 128" stroke="#1d9e75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          {/* QR code simplified */}
          <rect x="36" y="52" width="22" height="22" rx="3" fill="none" stroke="#0f172a" strokeWidth="2"/>
          <rect x="40" y="56" width="14" height="14" rx="1" fill="#0f172a"/>
          <rect x="102" y="52" width="22" height="22" rx="3" fill="none" stroke="#0f172a" strokeWidth="2"/>
          <rect x="106" y="56" width="14" height="14" rx="1" fill="#0f172a"/>
          <rect x="36" y="118" width="22" height="22" rx="3" fill="none" stroke="#0f172a" strokeWidth="2"/>
          <rect x="40" y="122" width="14" height="14" rx="1" fill="#0f172a"/>
          {/* data dots */}
          {[[70,52],[78,52],[86,52],[70,60],[86,60],[70,68],[78,68],[86,68],[70,76],[78,84],[86,84],[70,84],[70,92],[78,92],[86,92],[70,100],[86,100],[70,108],[78,108],[86,108],[70,116],[78,116],[86,124],[70,124]].map(([x,y],i)=>(
            <rect key={i} x={x} y={y} width="5" height="5" rx="1" fill="#0f172a"/>
          ))}
          {/* Stampify S */}
          <circle cx="80" cy="90" r="7" fill="rgba(29,158,117,0.12)"/>
          <text x="80" y="94" textAnchor="middle" fontSize="8" fill="#1d9e75" fontWeight="bold" fontFamily="sans-serif">S</text>
          {/* scan line */}
          <line x1="30" y1="44" x2="130" y2="44" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"
            style={{ animation: "lfscan 1.1s linear infinite alternate" }}/>
          {/* hint text */}
          <text x="80" y="170" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="sans-serif" style={{ animation: "lfpulse 1.4s ease-in-out infinite" }}>📷 Appareil photo</text>
          {/* home bar */}
          <rect x="55" y="272" width="50" height="3" rx="1.5" fill="rgba(0,0,0,0.1)"/>
        </svg>
      </div>
    </div>
  );
}

/* ── Step 2 : Card appears ── */
function StepCard() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 200 }}>
        <svg width="100%" viewBox="0 0 160 290" fill="none">
          <rect x="2" y="2" width="156" height="286" rx="24" fill="#1a1a2e"/>
          <rect x="2" y="2" width="156" height="286" rx="24" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
          <rect x="10" y="22" width="140" height="244" rx="9" fill="#f2f2f7"/>
          <rect x="52" y="9" width="56" height="11" rx="5.5" fill="#111"/>
          {/* Loyalty card */}
          <rect x="16" y="32" width="128" height="84" rx="12" fill="#1d9e75"/>
          <defs>
            <linearGradient id="lfc1" x1="16" y1="32" x2="144" y2="116" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,0.08)"/>
            </linearGradient>
          </defs>
          <rect x="16" y="32" width="128" height="84" rx="12" fill="url(#lfc1)"/>
          {/* Icon + name */}
          <circle cx="32" cy="48" r="10" fill="rgba(255,255,255,0.2)"/>
          <text x="32" y="52" textAnchor="middle" fontSize="10" fill="#fff">☕</text>
          <text x="50" y="48" fontSize="11" fill="rgba(255,255,255,0.95)" fontFamily="Georgia,serif" fontWeight="bold">Café Lumière</text>
          <text x="20" y="62" fontSize="7.5" fill="rgba(255,255,255,0.6)" fontFamily="sans-serif" letterSpacing="1">CARTE FIDÉLITÉ · 10 TAMPONS</text>
          {/* Stamp grid 5×2 */}
          {Array.from({length:10},(_,i)=>{
            const c=i%5, r=Math.floor(i/5);
            return <circle key={i} cx={24+c*20} cy={76+r*18} r="7"
              fill={i<7?"rgba(255,255,255,0.88)":"rgba(255,255,255,0.18)"}
              stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>;
          })}
          {/* stamp icons */}
          {Array.from({length:7},(_,i)=>{
            const c=i%5, r=Math.floor(i/5);
            return <text key={i} x={24+c*20} y={80+r*18} textAnchor="middle" fontSize="8" fill="#1d9e75">☕</text>;
          })}
          {/* Progress */}
          <rect x="16" y="124" width="128" height="4" rx="2" fill="#e2e8f0"/>
          <rect x="16" y="124" width="90" height="4" rx="2" fill="#1d9e75"/>
          <text x="80" y="140" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="sans-serif">7 tampons sur 10 — plus que 3 !</text>
          {/* home bar */}
          <rect x="55" y="272" width="50" height="3" rx="1.5" fill="rgba(0,0,0,0.1)"/>
        </svg>
      </div>
    </div>
  );
}

/* ── Step 3 : Stamp added ── */
function StepStamp() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
      <style>{`
        @keyframes lfstamp { 0%{transform:scale(0) rotate(-20deg);opacity:0} 60%{transform:scale(1.2) rotate(4deg);opacity:1} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes lfadmin { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
      `}</style>
      {/* Admin dashboard */}
      <div style={{ textAlign: "center", flexShrink: 0 }}>
        <div style={{
          background: "#0f172a", borderRadius: 14, padding: "14px 16px",
          width: 130, animation: "lfadmin 1.8s ease-in-out infinite",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}>
          <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 8, color: "rgba(255,255,255,0.45)", marginBottom: 8, letterSpacing: 1 }}>TABLEAU DE BORD</div>
          <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 10, color: "rgba(255,255,255,0.8)", marginBottom: 10 }}>Marie D. · 7 → 8 ☕</div>
          <div style={{ background: "#1d9e75", borderRadius: 8, padding: "9px 0", fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 12, fontWeight: 600, color: "#fff" }}>
            ✦ Ajouter tampon
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 10, color: "#94a3b8", marginTop: 8 }}>Le commerçant</div>
      </div>

      <div style={{ fontSize: 22, color: "#1d9e75", fontWeight: 700, flexShrink: 0 }}>→</div>

      {/* Client phone */}
      <div style={{ textAlign: "center", flexShrink: 0 }}>
        <div style={{ position: "relative", width: 120 }}>
          <svg width="100%" viewBox="0 0 120 220" fill="none">
            <rect x="2" y="2" width="116" height="216" rx="20" fill="#1a1a2e"/>
            <rect x="8" y="18" width="104" height="180" rx="8" fill="#f2f2f7"/>
            <rect x="40" y="8" width="40" height="9" rx="4.5" fill="#111"/>
            {/* Card */}
            <rect x="12" y="26" width="96" height="68" rx="10" fill="#1d9e75"/>
            <text x="60" y="42" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.9)" fontFamily="Georgia,serif">Café Lumière</text>
            {/* 8 stamps */}
            {Array.from({length:10},(_,i)=>{
              const c=i%5, r=Math.floor(i/5);
              return <circle key={i} cx={18+c*16} cy={56+r*14} r="5.5"
                fill={i<8?"rgba(255,255,255,0.88)":"rgba(255,255,255,0.15)"}
                stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/>;
            })}
            {/* home bar */}
            <rect x="40" y="206" width="40" height="2.5" rx="1.25" fill="rgba(0,0,0,0.1)"/>
          </svg>
          {/* +1 badge */}
          <div style={{
            position: "absolute", top: 12, right: -8,
            background: "#1d9e75", color: "#fff", borderRadius: "50%",
            width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, boxShadow: "0 4px 14px rgba(29,158,117,0.55)",
            animation: "lfstamp 0.55s cubic-bezier(0.36,0.07,0.19,0.97) forwards",
          }}>+1</div>
        </div>
        <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 10, color: "#94a3b8", marginTop: 8 }}>Le client</div>
      </div>
    </div>
  );
}

/* ── Step 4 : Success ── */
function StepSuccess() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <style>{`
        @keyframes lfsuccess { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
      `}</style>
      <div style={{ width: "100%", maxWidth: 200 }}>
        <svg width="100%" viewBox="0 0 160 290" fill="none">
          <rect x="2" y="2" width="156" height="286" rx="24" fill="#1a1a2e"/>
          <rect x="10" y="22" width="140" height="244" rx="9" fill="#f2f2f7"/>
          <rect x="52" y="9" width="56" height="11" rx="5.5" fill="#111"/>
          {/* Success circle */}
          <circle cx="80" cy="90" r="36" fill="#E8F8F3" style={{ animation: "lfsuccess 0.5s cubic-bezier(0.36,0.07,0.19,0.97) forwards" }}/>
          <text x="80" y="102" textAnchor="middle" fontSize="34" style={{ animation: "lfsuccess 0.5s 0.1s cubic-bezier(0.36,0.07,0.19,0.97) forwards", opacity: 0 }}>✓</text>
          <text x="80" y="150" textAnchor="middle" fontSize="13" fill="#0f172a" fontFamily="Georgia,serif" fontWeight="bold">8 tampons sur 10 !</text>
          <text x="80" y="167" textAnchor="middle" fontSize="8.5" fill="#64748b" fontFamily="sans-serif">Plus que 2 pour ton café offert</text>
          <text x="80" y="180" textAnchor="middle" fontSize="8.5" fill="#64748b" fontFamily="sans-serif">chez Café Lumière ☕</text>
          {/* Progress bar */}
          <rect x="20" y="196" width="120" height="7" rx="3.5" fill="#e2e8f0"/>
          <rect x="20" y="196" width="96" height="7" rx="3.5" fill="#1d9e75"/>
          <text x="80" y="215" textAnchor="middle" fontSize="8" fill="#94a3b8" fontFamily="sans-serif">80% vers ta récompense</text>
          {/* home bar */}
          <rect x="55" y="272" width="50" height="3" rx="1.5" fill="rgba(0,0,0,0.1)"/>
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
            <div style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 9, fontWeight: 600,
              color: step === i ? "rgba(255,255,255,0.65)" : "#94a3b8",
              marginBottom: 2,
            }}>
              {s.num} / 4
            </div>
            <div style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 11, fontWeight: 600,
              color: step === i ? "#fff" : "#374151",
              lineHeight: 1.3,
            }}>
              {s.label}
            </div>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: "#f1f5f9", borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "#1d9e75", borderRadius: 2, transition: "width 0.06s linear" }} />
      </div>

      {/* Visual card */}
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
