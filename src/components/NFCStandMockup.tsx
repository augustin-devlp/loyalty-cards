"use client";

export default function NFCStandMockup() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px 0", userSelect: "none" }}>
      <style>{`
        @keyframes nfcPhoneFloat {
          0%,100% { transform: translateX(-50%) translateY(-60px); }
          38%,62% { transform: translateX(-50%) translateY(4px); }
        }
        @keyframes nfcArc1 {
          0%,28% { opacity: 0; transform: scaleX(0.6) scaleY(0.6); }
          42%,56% { opacity: 1; transform: scaleX(1) scaleY(1); }
          68%,100% { opacity: 0; transform: scaleX(1.6) scaleY(1.6); }
        }
        @keyframes nfcArc2 {
          0%,34% { opacity: 0; transform: scaleX(0.6) scaleY(0.6); }
          48%,60% { opacity: 0.65; transform: scaleX(1) scaleY(1); }
          74%,100% { opacity: 0; transform: scaleX(1.7) scaleY(1.7); }
        }
        @keyframes nfcArc3 {
          0%,40% { opacity: 0; transform: scaleX(0.6) scaleY(0.6); }
          54%,64% { opacity: 0.38; transform: scaleX(1) scaleY(1); }
          80%,100% { opacity: 0; transform: scaleX(1.8) scaleY(1.8); }
        }
        @keyframes nfcStampPop {
          0%,50%  { opacity: 0; transform: scale(0) rotate(-15deg); }
          62%,84% { opacity: 1; transform: scale(1) rotate(0deg); }
          94%,100%{ opacity: 0; transform: scale(1.1) rotate(0deg); }
        }
        @keyframes standGlow {
          0%,30%  { filter: drop-shadow(0 8px 24px rgba(0,0,0,0.18)); }
          45%,65% { filter: drop-shadow(0 8px 32px rgba(29,158,117,0.35)) drop-shadow(0 0 12px rgba(29,158,117,0.2)); }
          80%,100%{ filter: drop-shadow(0 8px 24px rgba(0,0,0,0.18)); }
        }
      `}</style>

      <div style={{ position: "relative", width: 340, height: 420 }}>

        {/* Phone */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%) translateY(-60px)",
          animation: "nfcPhoneFloat 3.4s cubic-bezier(0.45,0,0.55,1) infinite",
          width: 100,
          zIndex: 10,
        }}>
          <svg width="100" height="188" viewBox="0 0 100 188" fill="none">
            {/* Phone body */}
            <rect x="2" y="2" width="96" height="184" rx="20" fill="#1a1a2e"/>
            <rect x="2" y="2" width="96" height="184" rx="20" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
            {/* Side buttons */}
            <rect x="98" y="52" width="4" height="24" rx="2" fill="#2a2a3e"/>
            <rect x="-2" y="60" width="4" height="18" rx="2" fill="#2a2a3e"/>
            <rect x="-2" y="84" width="4" height="18" rx="2" fill="#2a2a3e"/>
            {/* Screen */}
            <rect x="10" y="18" width="80" height="148" rx="10" fill="#f2f2f7"/>
            {/* Notch */}
            <rect x="32" y="8" width="36" height="10" rx="5" fill="#111"/>
            {/* Loyalty card on screen */}
            <rect x="14" y="26" width="72" height="48" rx="8" fill="#1d9e75"/>
            <rect x="14" y="26" width="72" height="48" rx="8" fill="url(#cardShine)"/>
            <defs>
              <linearGradient id="cardShine" x1="14" y1="26" x2="86" y2="74" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)"/>
                <stop offset="100%" stopColor="rgba(0,0,0,0.1)"/>
              </linearGradient>
            </defs>
            <text x="50" y="40" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.9)" fontFamily="Georgia, serif" fontWeight="bold">Boulangerie Martin</text>
            {/* Stamp grid 5x2 */}
            {Array.from({ length: 10 }, (_, i) => {
              const c = i % 5; const r = Math.floor(i / 5);
              return (
                <circle key={i}
                  cx={20 + c * 12} cy={50 + r * 12} r="4.5"
                  fill={i < 9 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.15)"}
                  stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"
                />
              );
            })}
            {/* Notification badge */}
            <rect x="14" y="82" width="72" height="22" rx="6" fill="rgba(255,255,255,0.92)"/>
            <text x="50" y="96" textAnchor="middle" fontSize="7.5" fill="#1d9e75" fontFamily="sans-serif" fontWeight="600">Plus que 1 tampon ! ☕</text>
            {/* Home indicator */}
            <rect x="35" y="158" width="30" height="3" rx="1.5" fill="rgba(0,0,0,0.12)"/>
          </svg>
        </div>

        {/* NFC waves — centered between phone bottom and stand top */}
        <div style={{
          position: "absolute",
          top: 202,
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          zIndex: 5,
        }}>
          <svg width="160" height="70" viewBox="0 0 160 70" fill="none" overflow="visible">
            <g style={{ transformOrigin: "80px 35px", animation: "nfcArc1 3.4s ease-in-out infinite" }}>
              <path d="M52 42 Q80 16 108 42" stroke="#1d9e75" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </g>
            <g style={{ transformOrigin: "80px 42px", animation: "nfcArc2 3.4s ease-in-out infinite" }}>
              <path d="M36 50 Q80 10 124 50" stroke="#1d9e75" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
            </g>
            <g style={{ transformOrigin: "80px 49px", animation: "nfcArc3 3.4s ease-in-out infinite" }}>
              <path d="M20 58 Q80 4 140 58" stroke="#1d9e75" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
            </g>
          </svg>
        </div>

        {/* Stamp pop badge */}
        <div style={{
          position: "absolute",
          top: 160,
          right: 40,
          zIndex: 20,
          animation: "nfcStampPop 3.4s ease-in-out infinite",
          background: "#1d9e75",
          color: "#fff",
          borderRadius: "50%",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 700,
          boxShadow: "0 8px 24px rgba(29,158,117,0.55)",
        }}>✓</div>

        {/* NFC Wood Stand — large, detailed */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          animation: "standGlow 3.4s ease-in-out infinite",
        }}>
          <svg width="300" height="150" viewBox="0 0 300 150" fill="none">
            <defs>
              <linearGradient id="nfcWood" x1="30" y1="18" x2="270" y2="110" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d4956a"/>
                <stop offset="40%" stopColor="#b87340"/>
                <stop offset="100%" stopColor="#7a4f2a"/>
              </linearGradient>
              <linearGradient id="nfcWoodTop" x1="30" y1="18" x2="270" y2="42" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e8b07a"/>
                <stop offset="100%" stopColor="#c4843a"/>
              </linearGradient>
              <linearGradient id="nfcWoodSide" x1="30" y1="100" x2="270" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8a5230"/>
                <stop offset="100%" stopColor="#5a3018"/>
              </linearGradient>
              <linearGradient id="nfcCounter" x1="0" y1="110" x2="300" y2="150" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e8d5b7"/>
                <stop offset="100%" stopColor="#ccb898"/>
              </linearGradient>
              <filter id="nfcShadow">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="rgba(0,0,0,0.2)"/>
              </filter>
            </defs>

            {/* Counter surface */}
            <rect x="0" y="110" width="300" height="40" rx="4" fill="url(#nfcCounter)"/>
            <rect x="0" y="110" width="300" height="3" rx="2" fill="rgba(255,255,255,0.35)"/>

            {/* Stand shadow on counter */}
            <ellipse cx="150" cy="116" rx="100" ry="8" fill="rgba(0,0,0,0.14)"/>

            {/* Stand — 3D look with side face */}
            {/* Side face (bottom darker) */}
            <rect x="30" y="100" width="240" height="14" rx="0" fill="url(#nfcWoodSide)"/>
            <rect x="30" y="108" width="240" height="6" rx="0" fill="rgba(0,0,0,0.15)"/>

            {/* Main body */}
            <rect x="30" y="18" width="240" height="90" rx="14" fill="url(#nfcWood)" filter="url(#nfcShadow)"/>

            {/* Top face highlight */}
            <rect x="30" y="18" width="240" height="28" rx="14" fill="url(#nfcWoodTop)"/>
            <rect x="30" y="32" width="240" height="14" fill="url(#nfcWoodTop)"/>

            {/* Wood grain lines */}
            {[55, 80, 110, 150, 195, 230, 255].map((x, i) => (
              <line key={i} x1={x} y1="18" x2={x} y2="108" stroke="rgba(0,0,0,0.06)" strokeWidth="1.2"/>
            ))}
            {/* Subtle horizontal grain */}
            <line x1="30" y1="55" x2="270" y2="55" stroke="rgba(0,0,0,0.03)" strokeWidth="1"/>
            <line x1="30" y1="78" x2="270" y2="78" stroke="rgba(0,0,0,0.03)" strokeWidth="1"/>

            {/* Border */}
            <rect x="30" y="18" width="240" height="90" rx="14" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>

            {/* NFC symbol — top center, large */}
            <circle cx="150" cy="34" r="5" fill="rgba(255,255,255,0.7)"/>
            <path d="M133 42 Q150 28 167 42" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M124 50 Q150 26 176 50" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M115 58 Q150 24 185 58" stroke="rgba(255,255,255,0.25)" strokeWidth="1.6" strokeLinecap="round" fill="none"/>

            {/* Engraved name — central, large */}
            <text x="150" y="80" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,0.6)" fontFamily="Georgia, serif" letterSpacing="3" fontWeight="bold">BOULANGERIE</text>
            <text x="150" y="98" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.42)" fontFamily="Georgia, serif" letterSpacing="2.5">MARTIN</text>

            {/* Stampify small logo bottom right */}
            <text x="258" y="106" textAnchor="end" fontSize="7" fill="rgba(255,255,255,0.25)" fontFamily="sans-serif" letterSpacing="0.5">by Stampify</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
