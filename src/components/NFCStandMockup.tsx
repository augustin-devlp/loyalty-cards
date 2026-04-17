"use client";

export default function NFCStandMockup() {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "16px 0", userSelect: "none" }}>
      <style>{`
        @keyframes nfcPhone {
          0%,100% { transform: translateY(-52px); }
          38%,62% { transform: translateY(6px); }
        }
        @keyframes nfcW1 {
          0%,28%{ opacity:0; transform:scaleX(0.55) scaleY(0.55); }
          42%,56%{ opacity:1; transform:scaleX(1) scaleY(1); }
          70%,100%{ opacity:0; transform:scaleX(1.7) scaleY(1.7); }
        }
        @keyframes nfcW2 {
          0%,34%{ opacity:0; transform:scaleX(0.55) scaleY(0.55); }
          48%,60%{ opacity:0.6; transform:scaleX(1) scaleY(1); }
          76%,100%{ opacity:0; transform:scaleX(1.8) scaleY(1.8); }
        }
        @keyframes nfcW3 {
          0%,40%{ opacity:0; transform:scaleX(0.55) scaleY(0.55); }
          54%,64%{ opacity:0.35; transform:scaleX(1) scaleY(1); }
          82%,100%{ opacity:0; transform:scaleX(1.9) scaleY(1.9); }
        }
        @keyframes nfcCheck {
          0%,50%{ opacity:0; transform:scale(0) rotate(-15deg); }
          62%,84%{ opacity:1; transform:scale(1) rotate(0deg); }
          94%,100%{ opacity:0; transform:scale(1.1); }
        }
        @keyframes nfcGlow {
          0%,30%{ filter:drop-shadow(0 12px 28px rgba(0,0,0,0.2)); }
          45%,65%{ filter:drop-shadow(0 12px 36px rgba(29,158,117,0.4)) drop-shadow(0 0 16px rgba(29,158,117,0.18)); }
          80%,100%{ filter:drop-shadow(0 12px 28px rgba(0,0,0,0.2)); }
        }
      `}</style>

      {/* Outer container — scales with parent, max width */}
      <div style={{ width: "100%", maxWidth: 380, position: "relative" }}>

        {/* SVG — full width, fixed viewBox */}
        <svg
          width="100%"
          viewBox="0 0 380 430"
          fill="none"
          style={{ overflow: "visible", display: "block" }}
        >
          <defs>
            <linearGradient id="nfcWood2" x1="40" y1="230" x2="340" y2="360" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d4956a"/>
              <stop offset="45%" stopColor="#b07035"/>
              <stop offset="100%" stopColor="#7a4f2a"/>
            </linearGradient>
            <linearGradient id="nfcWoodTop2" x1="40" y1="230" x2="340" y2="265" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e8b07a"/>
              <stop offset="100%" stopColor="#c4843a"/>
            </linearGradient>
            <linearGradient id="nfcWoodSide2" x1="40" y1="350" x2="340" y2="375" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8a5230"/>
              <stop offset="100%" stopColor="#5a3018"/>
            </linearGradient>
            <linearGradient id="nfcCounter2" x1="0" y1="370" x2="380" y2="420" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e8d5b7"/>
              <stop offset="100%" stopColor="#ccb898"/>
            </linearGradient>
            <linearGradient id="nfcCardShine" x1="100" y1="30" x2="280" y2="190" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,0.06)"/>
            </linearGradient>
          </defs>

          {/* ── PHONE ── */}
          <g style={{ animation: "nfcPhone 3.6s cubic-bezier(0.45,0,0.55,1) infinite", transformOrigin: "190px 120px" }}>
            {/* Phone body */}
            <rect x="130" y="10" width="120" height="218" rx="22" fill="#1a1a2e"/>
            <rect x="130" y="10" width="120" height="218" rx="22" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
            {/* Side buttons */}
            <rect x="250" y="62" width="5" height="28" rx="2.5" fill="#2a2a3e"/>
            <rect x="125" y="72" width="5" height="20" rx="2.5" fill="#2a2a3e"/>
            <rect x="125" y="98" width="5" height="20" rx="2.5" fill="#2a2a3e"/>
            {/* Screen */}
            <rect x="140" y="28" width="100" height="180" rx="10" fill="#f2f2f7"/>
            {/* Notch */}
            <rect x="168" y="16" width="44" height="11" rx="5.5" fill="#111"/>
            {/* Loyalty card */}
            <rect x="144" y="36" width="92" height="70" rx="10" fill="#1d9e75"/>
            <rect x="144" y="36" width="92" height="70" rx="10" fill="url(#nfcCardShine)"/>
            {/* card content */}
            <circle cx="158" cy="52" r="8" fill="rgba(255,255,255,0.18)"/>
            <text x="158" y="56" textAnchor="middle" fontSize="9" fill="#fff">☕</text>
            <text x="173" y="50" fontSize="10" fill="rgba(255,255,255,0.95)" fontFamily="Georgia,serif" fontWeight="bold">Boulangerie</text>
            <text x="173" y="62" fontSize="9" fill="rgba(255,255,255,0.85)" fontFamily="Georgia,serif">Martin</text>
            <text x="148" y="75" fontSize="7" fill="rgba(255,255,255,0.55)" fontFamily="sans-serif" letterSpacing="0.8">10 TAMPONS · CARTE FIDÉLITÉ</text>
            {/* stamp grid 5×2 — perfectly contained */}
            {Array.from({length:10},(_,i)=>{
              const c=i%5, r=Math.floor(i/5);
              return <circle key={i} cx={152+c*16} cy={84+r*14} r="5.5"
                fill={i<9?"rgba(255,255,255,0.82)":"rgba(255,255,255,0.15)"}
                stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/>;
            })}
            {/* notification */}
            <rect x="144" y="114" width="92" height="22" rx="6" fill="rgba(255,255,255,0.92)"/>
            <text x="190" y="128" textAnchor="middle" fontSize="8" fill="#1d9e75" fontFamily="sans-serif" fontWeight="600">Plus que 1 tampon ! 🎉</text>
            {/* home bar */}
            <rect x="168" y="200" width="44" height="3" rx="1.5" fill="rgba(0,0,0,0.1)"/>
          </g>

          {/* ── NFC WAVES ── centered between phone and stand */}
          <g style={{ transformOrigin: "190px 298px", animation: "nfcW1 3.6s ease-in-out infinite" }}>
            <path d="M140 298 Q190 258 240 298" stroke="#1d9e75" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          </g>
          <g style={{ transformOrigin: "190px 308px", animation: "nfcW2 3.6s ease-in-out infinite" }}>
            <path d="M118 310 Q190 252 262 310" stroke="#1d9e75" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </g>
          <g style={{ transformOrigin: "190px 318px", animation: "nfcW3 3.6s ease-in-out infinite" }}>
            <path d="M96 322 Q190 246 284 322" stroke="#1d9e75" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
          </g>

          {/* ── CHECKMARK BADGE ── */}
          <g style={{ animation: "nfcCheck 3.6s ease-in-out infinite", transformOrigin: "276px 236px" }}>
            <circle cx="276" cy="236" r="24" fill="#1d9e75" filter="url(#ckShadow)"/>
            <text x="276" y="244" textAnchor="middle" fontSize="22" fill="#fff" fontWeight="bold">✓</text>
          </g>
          <defs>
            <filter id="ckShadow"><feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(29,158,117,0.5)"/></filter>
          </defs>

          {/* ── NFC WOOD STAND ── */}
          <g style={{ animation: "nfcGlow 3.6s ease-in-out infinite" }}>
            {/* Counter surface */}
            <rect x="0" y="378" width="380" height="52" rx="6" fill="url(#nfcCounter2)"/>
            <rect x="0" y="378" width="380" height="4" rx="2" fill="rgba(255,255,255,0.35)"/>
            {/* Stand shadow */}
            <ellipse cx="190" cy="385" rx="130" ry="9" fill="rgba(0,0,0,0.14)"/>
            {/* Stand bottom face */}
            <rect x="40" y="358" width="300" height="25" rx="0" fill="url(#nfcWoodSide2)"/>
            <rect x="40" y="370" width="300" height="13" rx="0" fill="rgba(0,0,0,0.18)"/>
            {/* Stand main body */}
            <rect x="40" y="230" width="300" height="132" rx="16" fill="url(#nfcWood2)"/>
            {/* Top face highlight */}
            <rect x="40" y="230" width="300" height="38" rx="16" fill="url(#nfcWoodTop2)"/>
            <rect x="40" y="252" width="300" height="16" fill="url(#nfcWoodTop2)"/>
            {/* Wood grain */}
            {[70,100,140,190,248,290,318].map((x,i)=>(
              <line key={i} x1={x} y1="230" x2={x} y2="358" stroke="rgba(0,0,0,0.065)" strokeWidth="1.4"/>
            ))}
            <line x1="40" y1="292" x2="340" y2="292" stroke="rgba(0,0,0,0.032)" strokeWidth="1"/>
            <line x1="40" y1="330" x2="340" y2="330" stroke="rgba(0,0,0,0.028)" strokeWidth="1"/>
            {/* Border edge */}
            <rect x="40" y="230" width="300" height="132" rx="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
            {/* NFC symbol on stand */}
            <circle cx="190" cy="252" r="7" fill="rgba(255,255,255,0.65)"/>
            <path d="M166 265 Q190 248 214 265" stroke="rgba(255,255,255,0.6)" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M153 276 Q190 246 227 276" stroke="rgba(255,255,255,0.38)" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
            <path d="M140 287 Q190 244 240 287" stroke="rgba(255,255,255,0.22)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            {/* Engraved name */}
            <text x="190" y="318" textAnchor="middle" fontSize="18" fill="rgba(255,255,255,0.58)" fontFamily="Georgia,serif" letterSpacing="4" fontWeight="bold">BOULANGERIE</text>
            <text x="190" y="342" textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.4)" fontFamily="Georgia,serif" letterSpacing="3">MARTIN</text>
            {/* Stampify mark */}
            <text x="330" y="356" textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.22)" fontFamily="sans-serif">by Stampify</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
