"use client";

export default function NFCStandMockup() {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "16px 0", userSelect: "none" }}>
      <style>{`
        @keyframes nfcPhone2 {
          0%    { transform: translateY(-58px); }
          40%   { transform: translateY(4px); }
          60%   { transform: translateY(4px); }
          100%  { transform: translateY(-58px); }
        }
        @keyframes nfcW1 {
          0%,32% { opacity:0; transform:scaleX(0.5) scaleY(0.5); }
          44%,58%{ opacity:1; transform:scaleX(1) scaleY(1); }
          72%,100%{ opacity:0; transform:scaleX(1.7) scaleY(1.7); }
        }
        @keyframes nfcW2 {
          0%,38%{ opacity:0; transform:scaleX(0.5) scaleY(0.5); }
          50%,62%{ opacity:0.6; transform:scaleX(1) scaleY(1); }
          78%,100%{ opacity:0; transform:scaleX(1.8) scaleY(1.8); }
        }
        @keyframes nfcW3 {
          0%,44%{ opacity:0; transform:scaleX(0.5) scaleY(0.5); }
          56%,66%{ opacity:0.32; transform:scaleX(1) scaleY(1); }
          84%,100%{ opacity:0; transform:scaleX(1.9) scaleY(1.9); }
        }
        @keyframes nfcCheck2 {
          0%,52%{ opacity:0; transform:scale(0) rotate(-15deg); }
          64%,86%{ opacity:1; transform:scale(1) rotate(0deg); }
          95%,100%{ opacity:0; transform:scale(1.1); }
        }
        @keyframes nfcGlow2 {
          0%,34%{ filter:drop-shadow(0 12px 28px rgba(0,0,0,0.2)); }
          46%,64%{ filter:drop-shadow(0 12px 36px rgba(29,158,117,0.38)) drop-shadow(0 0 14px rgba(29,158,117,0.16)); }
          82%,100%{ filter:drop-shadow(0 12px 28px rgba(0,0,0,0.2)); }
        }
        /* Phone screen states */
        @keyframes nfcScreenLock {
          0%,38%{ opacity:1; }
          46%,100%{ opacity:0; }
        }
        @keyframes nfcScreenCard {
          0%,40%{ opacity:0; transform:translateY(10px); }
          52%,92%{ opacity:1; transform:translateY(0); }
          98%,100%{ opacity:0; }
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: 380 }}>
        <svg width="100%" viewBox="0 0 380 430" fill="none" style={{ overflow: "visible", display: "block" }}>
          <defs>
            <linearGradient id="nw2" x1="40" y1="230" x2="340" y2="360" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#d4956a"/>
              <stop offset="45%" stopColor="#b07035"/>
              <stop offset="100%" stopColor="#7a4f2a"/>
            </linearGradient>
            <linearGradient id="nwTop2" x1="40" y1="230" x2="340" y2="265" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e8b07a"/>
              <stop offset="100%" stopColor="#c4843a"/>
            </linearGradient>
            <linearGradient id="nwSide2" x1="40" y1="350" x2="340" y2="375" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8a5230"/>
              <stop offset="100%" stopColor="#5a3018"/>
            </linearGradient>
            <linearGradient id="nwCounter2" x1="0" y1="370" x2="380" y2="420" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#e8d5b7"/>
              <stop offset="100%" stopColor="#ccb898"/>
            </linearGradient>
            <filter id="nwCk"><feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="rgba(29,158,117,0.5)"/></filter>
          </defs>

          {/* ── PHONE ── */}
          <g style={{ animation: "nfcPhone2 4s cubic-bezier(0.33,1,0.68,1) infinite", transformOrigin: "190px 120px" }}>
            {/* body */}
            <rect x="131" y="10" width="118" height="215" rx="22" fill="#1a1a2e"/>
            <rect x="131" y="10" width="118" height="215" rx="22" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
            {/* side buttons */}
            <rect x="249" y="62" width="4" height="26" rx="2" fill="#2a2a3e"/>
            <rect x="127" y="72" width="4" height="18" rx="2" fill="#2a2a3e"/>
            <rect x="127" y="96" width="4" height="18" rx="2" fill="#2a2a3e"/>
            {/* screen */}
            <rect x="141" y="28" width="98" height="177" rx="9" fill="#111"/>
            {/* notch */}
            <rect x="168" y="16" width="44" height="10" rx="5" fill="#111"/>

            {/* ── LOCK SCREEN (visible before tap) ── */}
            <g style={{ animation: "nfcScreenLock 4s cubic-bezier(0.33,1,0.68,1) infinite" }}>
              {/* simple lock screen - time */}
              <rect x="141" y="28" width="98" height="177" rx="9" fill="#1a2a1a"/>
              {/* subtle dots pattern */}
              {Array.from({length:12},(_,i)=>(
                <circle key={i} cx={152+((i%4)*22)} cy={50+(Math.floor(i/4)*24)} r="1.5" fill="rgba(255,255,255,0.04)"/>
              ))}
              {/* time display */}
              <text x="190" y="90" textAnchor="middle" fontSize="28" fill="rgba(255,255,255,0.85)" fontFamily="sans-serif" fontWeight="200">09:41</text>
              <text x="190" y="108" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">Samedi 18 avril</text>
              {/* lock icon */}
              <rect x="183" y="126" width="14" height="11" rx="3" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2"/>
              <path d="M186 126 Q190 119 194 126" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none"/>
              <circle cx="190" cy="131" r="1.5" fill="rgba(255,255,255,0.3)"/>
              {/* home bar */}
              <rect x="165" y="196" width="50" height="2.5" rx="1.25" fill="rgba(255,255,255,0.15)"/>
            </g>

            {/* ── LOYALTY CARD SCREEN (appears after tap) ── */}
            <g style={{ animation: "nfcScreenCard 4s cubic-bezier(0.33,1,0.68,1) infinite", transformOrigin: "190px 117px" }}>
              <rect x="141" y="28" width="98" height="177" rx="9" fill="#f2f2f7"/>
              {/* card */}
              <rect x="148" y="36" width="84" height="68" rx="9" fill="#1d9e75"/>
              <defs>
                <linearGradient id="nwCard" x1="148" y1="36" x2="232" y2="104" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.18)"/>
                  <stop offset="100%" stopColor="rgba(0,0,0,0.06)"/>
                </linearGradient>
              </defs>
              <rect x="148" y="36" width="84" height="68" rx="9" fill="url(#nwCard)"/>
              {/* card name */}
              <text x="190" y="52" textAnchor="middle" fontSize="9.5" fill="rgba(255,255,255,0.95)" fontFamily="Georgia,serif" fontWeight="bold">Boulangerie</text>
              <text x="190" y="64" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.85)" fontFamily="Georgia,serif">Martin</text>
              {/* stamp grid 5×2 */}
              {Array.from({length:10},(_,i)=>{
                const c=i%5, r=Math.floor(i/5);
                const cx = 153 + c*14;
                const cy = 76 + r*12;
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="4.5"
                      fill={i<9?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.18)"}
                      stroke="rgba(255,255,255,0.3)" strokeWidth="0.7"/>
                    {i<9 && <text x={cx} y={cy+3.5} textAnchor="middle" fontSize="5.5" fill="#1d9e75">☕</text>}
                  </g>
                );
              })}
              {/* notification */}
              <rect x="148" y="112" width="84" height="20" rx="6" fill="rgba(255,255,255,0.92)"/>
              <text x="190" y="125" textAnchor="middle" fontSize="7.5" fill="#1d9e75" fontFamily="sans-serif" fontWeight="600">Plus que 1 tampon ! 🎉</text>
              {/* home bar */}
              <rect x="165" y="196" width="50" height="2.5" rx="1.25" fill="rgba(0,0,0,0.1)"/>
            </g>
          </g>

          {/* ── NFC WAVES ── */}
          <g style={{ transformOrigin: "190px 298px", animation: "nfcW1 4s ease-in-out infinite" }}>
            <path d="M142 298 Q190 260 238 298" stroke="#1d9e75" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
          </g>
          <g style={{ transformOrigin: "190px 308px", animation: "nfcW2 4s ease-in-out infinite" }}>
            <path d="M120 310 Q190 254 260 310" stroke="#1d9e75" strokeWidth="2.3" fill="none" strokeLinecap="round"/>
          </g>
          <g style={{ transformOrigin: "190px 318px", animation: "nfcW3 4s ease-in-out infinite" }}>
            <path d="M98 322 Q190 248 282 322" stroke="#1d9e75" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </g>

          {/* ── CHECKMARK ── */}
          <g style={{ animation: "nfcCheck2 4s ease-in-out infinite", transformOrigin: "272px 234px" }}>
            <circle cx="272" cy="234" r="22" fill="#1d9e75" filter="url(#nwCk)"/>
            <text x="272" y="242" textAnchor="middle" fontSize="20" fill="#fff" fontWeight="bold">✓</text>
          </g>

          {/* ── WOOD STAND ── */}
          <g style={{ animation: "nfcGlow2 4s ease-in-out infinite" }}>
            {/* counter */}
            <rect x="0" y="378" width="380" height="52" rx="6" fill="url(#nwCounter2)"/>
            <rect x="0" y="378" width="380" height="4" rx="2" fill="rgba(255,255,255,0.35)"/>
            {/* shadow */}
            <ellipse cx="190" cy="384" rx="128" ry="8" fill="rgba(0,0,0,0.13)"/>
            {/* stand bottom */}
            <rect x="40" y="358" width="300" height="24" rx="0" fill="url(#nwSide2)"/>
            <rect x="40" y="370" width="300" height="12" fill="rgba(0,0,0,0.18)"/>
            {/* stand body */}
            <rect x="40" y="230" width="300" height="132" rx="16" fill="url(#nw2)"/>
            {/* top highlight */}
            <rect x="40" y="230" width="300" height="36" rx="16" fill="url(#nwTop2)"/>
            <rect x="40" y="250" width="300" height="16" fill="url(#nwTop2)"/>
            {/* grain */}
            {[70,100,140,190,248,290,318].map((x,i)=>(
              <line key={i} x1={x} y1="230" x2={x} y2="358" stroke="rgba(0,0,0,0.065)" strokeWidth="1.4"/>
            ))}
            <line x1="40" y1="292" x2="340" y2="292" stroke="rgba(0,0,0,0.03)" strokeWidth="1"/>
            <line x1="40" y1="330" x2="340" y2="330" stroke="rgba(0,0,0,0.025)" strokeWidth="1"/>
            {/* border */}
            <rect x="40" y="230" width="300" height="132" rx="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
            {/* NFC symbol */}
            <circle cx="190" cy="252" r="7" fill="rgba(255,255,255,0.65)"/>
            <path d="M167 265 Q190 248 213 265" stroke="rgba(255,255,255,0.58)" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M154 276 Q190 246 226 276" stroke="rgba(255,255,255,0.36)" strokeWidth="2.3" strokeLinecap="round" fill="none"/>
            <path d="M141 287 Q190 244 239 287" stroke="rgba(255,255,255,0.2)" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
            {/* engraved text */}
            <text x="190" y="318" textAnchor="middle" fontSize="18" fill="rgba(255,255,255,0.56)" fontFamily="Georgia,serif" letterSpacing="4" fontWeight="bold">BOULANGERIE</text>
            <text x="190" y="342" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,0.38)" fontFamily="Georgia,serif" letterSpacing="3">MARTIN</text>
            <text x="330" y="356" textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.2)" fontFamily="sans-serif">by Stampify</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
