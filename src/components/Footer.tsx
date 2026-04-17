import Link from "next/link";

export default function Footer() {
  const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 10 };
  const colTitle: React.CSSProperties = {
    fontFamily: "var(--font-dm-sans), sans-serif",
    fontSize: 12,
    fontWeight: 600,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 4,
  };
  const colLink: React.CSSProperties = {
    fontFamily: "var(--font-dm-sans), sans-serif",
    fontSize: 14,
    color: "rgba(255,255,255,0.55)",
    textDecoration: "none",
    transition: "color 0.15s",
  };

  return (
    <footer style={{ background: "#0f1a15", padding: "72px 24px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                {([0,1,2] as const).map(row => ([0,1,2] as const).map(col => (
                  <circle key={`${row}-${col}`} cx={5 + col * 9} cy={5 + row * 9} r="3" fill="#1d9e75" opacity={1 - row * 0.15} />
                )))}
              </svg>
              <span style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>Stampify</span>
            </div>
            <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 240 }}>
              Carte fidélité digitale · Suisse romande
            </p>
          </div>

          {/* Navigation */}
          <div style={col}>
            <span style={colTitle}>Navigation</span>
            {[
              { href: "/#produit", label: "Produit" },
              { href: "/demos", label: "Démos" },
              { href: "/#tarif", label: "Tarif" },
              { href: "/features", label: "Fonctionnalités" },
            ].map(l => <Link key={l.label} href={l.href} style={colLink}>{l.label}</Link>)}
          </div>

          {/* Légal */}
          <div style={col}>
            <span style={colTitle}>Légal</span>
            {[
              { href: "/cgv", label: "CGV" },
              { href: "/confidentialite", label: "Confidentialité" },
              { href: "/mentions-legales", label: "Mentions légales" },
            ].map(l => <Link key={l.label} href={l.href} style={colLink}>{l.label}</Link>)}
          </div>

          {/* Régions */}
          <div style={col}>
            <span style={colTitle}>Régions</span>
            {["Genève", "Lausanne", "Fribourg", "Nyon", "Annecy"].map(r => (
              <span key={r} style={colLink}>{r}</span>
            ))}
          </div>

          {/* Contact */}
          <div style={col}>
            <span style={colTitle}>Contact</span>
            <a href="mailto:contact@stampify.ch" style={colLink}>contact@stampify.ch</a>
            <a href="https://instagram.com/stampify.ch" target="_blank" rel="noopener noreferrer" style={colLink}>Instagram</a>
            <a href="https://linkedin.com/company/stampify" target="_blank" rel="noopener noreferrer" style={colLink}>LinkedIn</a>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 24,
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 12,
          color: "rgba(255,255,255,0.3)",
          textAlign: "center",
        }}>
          © 2025 Stampify · Fait en Suisse
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
