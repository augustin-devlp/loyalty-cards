import Link from "next/link";

// Symboles SVG qui flottent en arrière-plan — dans la continuité de la charte #1d9e75
function FloatingSymbols() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <style>{`
        @keyframes symFloat1 { 0%,100%{transform:translate(0,0) rotate(-8deg)} 50%{transform:translate(6px,-18px) rotate(-4deg)} }
        @keyframes symFloat2 { 0%,100%{transform:translate(0,0) rotate(12deg)} 50%{transform:translate(-8px,-14px) rotate(8deg)} }
        @keyframes symFloat3 { 0%,100%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(10px,-10px) rotate(5deg)} }
        @keyframes symFloat4 { 0%,100%{transform:translate(0,0) rotate(-5deg)} 50%{transform:translate(-6px,-16px) rotate(-10deg)} }
        @keyframes symFloat5 { 0%,100%{transform:translate(0,0) rotate(8deg)} 50%{transform:translate(8px,-12px) rotate(14deg)} }
      `}</style>

      {/* Socle NFC en bois — bas gauche */}
      <div style={{ position:"absolute", bottom:"8%", left:"5%", opacity:0.18, animation:"symFloat1 5s ease-in-out infinite" }}>
        <svg width="100" height="72" viewBox="0 0 100 72" fill="none">
          <rect x="5" y="20" width="90" height="45" rx="8" fill="#fff"/>
          <rect x="5" y="20" width="90" height="45" rx="8" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
          {/* grain bois */}
          <line x1="15" y1="20" x2="15" y2="65" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
          <line x1="30" y1="20" x2="30" y2="65" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
          <line x1="55" y1="20" x2="55" y2="65" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
          <line x1="80" y1="20" x2="80" y2="65" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
          {/* ondes NFC */}
          <path d="M44 38 Q50 32 56 38" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          <path d="M40 43 Q50 33 60 43" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
          <path d="M36 48 Q50 34 64 48" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.4"/>
          <circle cx="50" cy="36" r="2.5" fill="#fff"/>
          {/* pied */}
          <rect x="35" y="0" width="30" height="22" rx="4" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
          <text x="50" y="15" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.6)" fontFamily="sans-serif" letterSpacing="1">STAMPIFY</text>
        </svg>
      </div>

      {/* Carte fidélité — haut gauche */}
      <div style={{ position:"absolute", top:"12%", left:"8%", opacity:0.16, animation:"symFloat2 6.5s ease-in-out infinite" }}>
        <svg width="110" height="70" viewBox="0 0 110 70" fill="none">
          <rect x="1" y="1" width="108" height="68" rx="10" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
          {/* header bande */}
          <rect x="1" y="1" width="108" height="20" rx="10" fill="rgba(255,255,255,0.15)"/>
          <rect x="1" y="10" width="108" height="11" fill="rgba(255,255,255,0.08)"/>
          {/* tampons grille 5×2 */}
          {Array.from({length:10}, (_,i) => {
            const c = i % 5, r = Math.floor(i / 5);
            const filled = i < 7;
            return <circle key={i} cx={14 + c * 18} cy={34 + r * 18} r="6"
              fill={filled ? "rgba(255,255,255,0.5)" : "none"}
              stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>;
          })}
        </svg>
      </div>

      {/* Symbole page web — haut droite */}
      <div style={{ position:"absolute", top:"15%", right:"6%", opacity:0.15, animation:"symFloat3 7s ease-in-out infinite" }}>
        <svg width="90" height="72" viewBox="0 0 90 72" fill="none">
          {/* fenêtre browser */}
          <rect x="1" y="1" width="88" height="70" rx="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
          {/* barre chrome */}
          <rect x="1" y="1" width="88" height="16" rx="8" fill="rgba(255,255,255,0.2)"/>
          <rect x="9" y="16" width="88" height="1" fill="rgba(255,255,255,0.15)"/>
          {/* dots */}
          <circle cx="11" cy="9" r="3" fill="rgba(255,255,255,0.4)"/>
          <circle cx="21" cy="9" r="3" fill="rgba(255,255,255,0.3)"/>
          <circle cx="31" cy="9" r="3" fill="rgba(255,255,255,0.25)"/>
          {/* URL bar */}
          <rect x="40" y="5" width="42" height="8" rx="4" fill="rgba(255,255,255,0.15)"/>
          {/* contenu lignes */}
          <rect x="10" y="24" width="70" height="5" rx="2" fill="rgba(255,255,255,0.25)"/>
          <rect x="10" y="33" width="55" height="4" rx="2" fill="rgba(255,255,255,0.15)"/>
          <rect x="10" y="41" width="40" height="4" rx="2" fill="rgba(255,255,255,0.12)"/>
          {/* bouton CTA */}
          <rect x="10" y="52" width="30" height="12" rx="4" fill="rgba(255,255,255,0.3)"/>
        </svg>
      </div>

      {/* SMS / message — bas droite */}
      <div style={{ position:"absolute", bottom:"12%", right:"7%", opacity:0.15, animation:"symFloat4 5.5s ease-in-out infinite" }}>
        <svg width="88" height="72" viewBox="0 0 88 72" fill="none">
          {/* bulle SMS */}
          <rect x="1" y="1" width="80" height="52" rx="12" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
          <path d="M10 53 L6 66 L22 57" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          {/* lignes texte */}
          <rect x="12" y="14" width="56" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
          <rect x="12" y="22" width="44" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
          <rect x="12" y="30" width="50" height="4" rx="2" fill="rgba(255,255,255,0.15)"/>
          {/* emoji */}
          <text x="14" y="46" fontSize="11" fill="rgba(255,255,255,0.5)">🥐 −20% ce weekend !</text>
        </svg>
      </div>

      {/* Étoile / note — milieu haut */}
      <div style={{ position:"absolute", top:"30%", right:"18%", opacity:0.12, animation:"symFloat5 8s ease-in-out infinite" }}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <path d="M28 4l5.5 11.2 12.3 1.8-8.9 8.7 2.1 12.3L28 32l-11 5.8 2.1-12.3-8.9-8.7 12.3-1.8z" fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
        </svg>
      </div>

      {/* QR code — milieu gauche */}
      <div style={{ position:"absolute", top:"45%", left:"3%", opacity:0.13, animation:"symFloat2 9s ease-in-out infinite reverse" }}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <rect x="2" y="2" width="56" height="56" rx="6" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
          {/* motif QR simplifié */}
          <rect x="8" y="8" width="18" height="18" rx="2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
          <rect x="12" y="12" width="10" height="10" rx="1" fill="rgba(255,255,255,0.3)"/>
          <rect x="34" y="8" width="18" height="18" rx="2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
          <rect x="38" y="12" width="10" height="10" rx="1" fill="rgba(255,255,255,0.3)"/>
          <rect x="8" y="34" width="18" height="18" rx="2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
          <rect x="12" y="38" width="10" height="10" rx="1" fill="rgba(255,255,255,0.3)"/>
          <rect x="34" y="34" width="6" height="6" rx="1" fill="rgba(255,255,255,0.25)"/>
          <rect x="42" y="34" width="6" height="6" rx="1" fill="rgba(255,255,255,0.25)"/>
          <rect x="34" y="42" width="6" height="6" rx="1" fill="rgba(255,255,255,0.25)"/>
          <rect x="42" y="42" width="6" height="6" rx="1" fill="rgba(255,255,255,0.25)"/>
        </svg>
      </div>
    </div>
  );
}

export default function FinalCTASection() {
  return (
    <section className="cta-final-section" style={{
      background: "#1d9e75",
      position: "relative",
      overflow: "hidden",
      padding: "120px 24px",
      textAlign: "center",
    }}>
      <FloatingSymbols />

      <div style={{ position: "relative", zIndex: 2 }}>
        <h2 style={{
          fontFamily: "var(--font-fraunces), serif",
          fontWeight: 700,
          fontSize: "clamp(32px, 4vw, 52px)",
          color: "#fff",
          lineHeight: 1.15,
          marginBottom: 20,
        }}>
          Prêt à fidéliser tes clients ?
        </h2>

        <p style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 18,
          color: "rgba(255,255,255,0.85)",
          maxWidth: 480,
          margin: "0 auto 40px",
          lineHeight: 1.7,
        }}>
          Rejoins les commerçants romands qui ont arrêté de perdre leurs clients.
        </p>

        <style>{`
          @media (max-width: 640px) {
            .cta-final-btns { flex-direction: column !important; gap: 12px !important; align-items: stretch !important; }
            .cta-final-btn { display: block !important; text-align: center !important; width: 100% !important; }
            .cta-final-title { font-size: 36px !important; }
            .cta-final-section { padding: 80px 20px !important; }
            .cta-final-badges { gap: 12px !important; }
            .cta-final-badge { font-size: 12px !important; }
          }
        `}</style>
        <div className="cta-final-btns" style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
          <Link
            href="https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20d%C3%A9marrer%20avec%20Stampify%20%28990%20CHF%29."
            className="cta-final-btn"
            style={{
              background: "#fff", color: "#1d9e75",
              borderRadius: 10, padding: "16px 32px",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 16, fontWeight: 500, textDecoration: "none",
              minHeight: 44, display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}
          >
            Démarrer maintenant
          </Link>
          <Link
            href="https://wa.me/41791342997"
            className="cta-final-btn"
            style={{
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: 10, padding: "16px 32px",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 16, fontWeight: 500, textDecoration: "none",
              minHeight: 44, display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}
          >
            Parler à Augustin
          </Link>
        </div>

        <div className="cta-final-badges" style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {["Paiement sécurisé", "Remboursé si insatisfait", "En ligne en 48h"].map(badge => (
            <span key={badge} className="cta-final-badge" style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13, color: "rgba(255,255,255,0.75)",
            }}>
              ✓ {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
