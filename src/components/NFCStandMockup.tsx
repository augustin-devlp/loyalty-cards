"use client";

export default function NFCStandMockup() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 0", userSelect: "none" }}>
      <style>{`
        @keyframes phoneFloat {
          0%,100% { transform: translateX(-50%) translateY(-40px); }
          35%,65% { transform: translateX(-50%) translateY(0px); }
        }
        @keyframes nfcArc1 {
          0%,30% { opacity: 0; transform: scale(0.7); }
          40%,55% { opacity: 0.8; transform: scale(1); }
          70%,100% { opacity: 0; transform: scale(1.4); }
        }
        @keyframes nfcArc2 {
          0%,36% { opacity: 0; transform: scale(0.7); }
          48%,60% { opacity: 0.55; transform: scale(1); }
          75%,100% { opacity: 0; transform: scale(1.5); }
        }
        @keyframes nfcArc3 {
          0%,42% { opacity: 0; transform: scale(0.7); }
          54%,65% { opacity: 0.3; transform: scale(1); }
          80%,100% { opacity: 0; transform: scale(1.6); }
        }
        @keyframes stampAppear {
          0%,50% { opacity: 0; transform: scale(0) rotate(-10deg); }
          60%,82% { opacity: 1; transform: scale(1) rotate(0deg); }
          92%,100% { opacity: 0; transform: scale(1.05) rotate(0deg); }
        }
        @keyframes counterGlow {
          0%,30% { box-shadow: none; }
          45%,65% { box-shadow: 0 0 0 6px rgba(29,158,117,0.15), 0 0 0 12px rgba(29,158,117,0.06); }
          80%,100% { box-shadow: none; }
        }
      `}</style>

      <div style={{ position: "relative", width: 300, height: 360 }}>

        {/* Phone */}
        <div style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%) translateY(-40px)",
          animation: "phoneFloat 3.2s cubic-bezier(0.45,0,0.55,1) infinite",
          width: 72,
          zIndex: 10,
        }}>
          <svg width="72" height="130" viewBox="0 0 72 130" fill="none">
            {/* frame */}
            <rect x="2" y="2" width="68" height="126" rx="14" fill="#1a1a2e" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
            {/* screen */}
            <rect x="8" y="14" width="56" height="96" rx="6" fill="#f2f2f7"/>
            {/* notch */}
            <rect x="24" y="6" width="24" height="6" rx="3" fill="#111"/>
            {/* loyalty card on screen */}
            <rect x="12" y="20" width="48" height="28" rx="5" fill="#1d9e75"/>
            <text x="36" y="32" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.9)" fontFamily="sans-serif" fontWeight="bold">Boulangerie Martin</text>
            {/* stamp grid 5×2 */}
            {Array.from({ length: 10 }, (_, i) => {
              const c = i % 5;
              const r = Math.floor(i / 5);
              return (
                <circle
                  key={i}
                  cx={16 + c * 9}
                  cy={43 + r * 8}
                  r="3"
                  fill={i < 9 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.2)"}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="0.5"
                />
              );
            })}
            {/* notification */}
            <rect x="12" y="62" width="48" height="18" rx="4" fill="rgba(255,255,255,0.9)"/>
            <text x="36" y="73" textAnchor="middle" fontSize="6" fill="#64748b" fontFamily="sans-serif">Plus qu&apos;1 tampon 🎉</text>
            {/* home bar */}
            <rect x="26" y="118" width="20" height="2.5" rx="1.5" fill="rgba(0,0,0,0.15)"/>
          </svg>
        </div>

        {/* NFC wave arcs — between phone and stand */}
        <div style={{ position: "absolute", top: 148, left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }}>
          <svg width="120" height="52" viewBox="0 0 120 52" fill="none" overflow="visible">
            <g style={{ transformOrigin: "60px 30px", animation: "nfcArc1 3.2s ease-in-out infinite" }}>
              <path d="M42 30 Q60 12 78 30" stroke="#1d9e75" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
            </g>
            <g style={{ transformOrigin: "60px 38px", animation: "nfcArc2 3.2s ease-in-out infinite" }}>
              <path d="M30 38 Q60 10 90 38" stroke="#1d9e75" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
            </g>
            <g style={{ transformOrigin: "60px 46px", animation: "nfcArc3 3.2s ease-in-out infinite" }}>
              <path d="M18 46 Q60 8 102 46" stroke="#1d9e75" strokeWidth="1" fill="none" strokeLinecap="round"/>
            </g>
          </svg>
        </div>

        {/* Stamp checkmark pop */}
        <div style={{
          position: "absolute",
          top: 108,
          right: 28,
          zIndex: 20,
          animation: "stampAppear 3.2s ease-in-out infinite",
          background: "#1d9e75",
          color: "#fff",
          borderRadius: "50%",
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 700,
          boxShadow: "0 6px 20px rgba(29,158,117,0.45)",
        }}>✓</div>

        {/* NFC Wood Stand */}
        <div style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          animation: "counterGlow 3.2s ease-in-out infinite",
          borderRadius: 12,
        }}>
          <svg width="230" height="110" viewBox="0 0 230 110" fill="none">
            <defs>
              <linearGradient id="wood" x1="45" y1="22" x2="185" y2="88" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d4956a"/>
                <stop offset="50%" stopColor="#b87340"/>
                <stop offset="100%" stopColor="#8a5230"/>
              </linearGradient>
              <linearGradient id="woodTop" x1="45" y1="22" x2="185" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e0a870"/>
                <stop offset="100%" stopColor="#c4843a"/>
              </linearGradient>
              <linearGradient id="counter" x1="0" y1="82" x2="230" y2="110" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e8d5b7"/>
                <stop offset="100%" stopColor="#d4bc96"/>
              </linearGradient>
            </defs>

            {/* Counter surface */}
            <rect x="0" y="82" width="230" height="28" rx="4" fill="url(#counter)"/>
            <rect x="0" y="82" width="230" height="3" rx="2" fill="rgba(255,255,255,0.3)"/>

            {/* Stand shadow */}
            <ellipse cx="115" cy="88" rx="70" ry="6" fill="rgba(0,0,0,0.12)"/>

            {/* Stand body */}
            <rect x="45" y="22" width="140" height="64" rx="12" fill="url(#wood)"/>

            {/* Top face highlight */}
            <rect x="45" y="22" width="140" height="20" rx="12" fill="url(#woodTop)"/>
            <rect x="45" y="30" width="140" height="12" fill="url(#woodTop)"/>

            {/* Wood grain lines */}
            {[62, 80, 105, 138, 162].map((x, i) => (
              <line key={i} x1={x} y1="22" x2={x} y2="86" stroke="rgba(0,0,0,0.07)" strokeWidth="1"/>
            ))}

            {/* Border / edge highlight */}
            <rect x="45" y="22" width="140" height="64" rx="12" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>

            {/* NFC symbol on stand top */}
            <path d="M104 36 Q115 28 126 36" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <path d="M99 41 Q115 29 131 41" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
            <circle cx="115" cy="32" r="2.5" fill="rgba(255,255,255,0.55)"/>

            {/* Engraved name */}
            <text x="115" y="62" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.55)" fontFamily="Georgia, serif" letterSpacing="2">BOULANGERIE</text>
            <text x="115" y="75" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)" fontFamily="Georgia, serif" letterSpacing="1.5">MARTIN</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
