import Link from "next/link";

const feats = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="14" fill="#E8F8F3"/>
        {Array.from({ length: 9 }, (_, i) => {
          const c = i % 3; const r = Math.floor(i / 3);
          return <circle key={i} cx={8 + c * 6} cy={9 + r * 5} r="1.8" fill={i < 7 ? "#1d9e75" : "#c8e6d8"} />;
        })}
      </svg>
    ),
    title: "Carte fidélité digitale",
    desc: "QR code en caisse, zéro app, tampon en 3 secondes.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="14" fill="#E8F8F3"/>
        <rect x="5" y="8" width="18" height="13" rx="3" fill="none" stroke="#1d9e75" strokeWidth="1.6"/>
        <rect x="5" y="8" width="18" height="5" rx="3" fill="#1d9e75" opacity="0.2"/>
        <line x1="8" y1="17" x2="16" y2="17" stroke="#1d9e75" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="8" y1="20" x2="13" y2="20" stroke="#1d9e75" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    title: "Site vitrine 5 pages",
    desc: "Design soigné, hébergé, en ligne en 48h.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="14" fill="#E8F8F3"/>
        <circle cx="14" cy="14" r="6" fill="none" stroke="#1d9e75" strokeWidth="1.5"/>
        <path d="M14 8 Q16 14 14 20" stroke="#1d9e75" strokeWidth="1.2" fill="none"/>
        <path d="M8 14 Q14 16 20 14" stroke="#1d9e75" strokeWidth="1.2" fill="none"/>
        <circle cx="14" cy="8" r="1.5" fill="#1d9e75"/>
        <path d="M6 18l2-2" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="5.5" cy="18.5" r="1.5" fill="#1d9e75"/>
      </svg>
    ),
    title: "SEO local",
    desc: "En premier sur Google pour les gens du quartier.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="14" fill="#E8F8F3"/>
        <rect x="7" y="13" width="14" height="9" rx="2" fill="#a07340" opacity="0.7"/>
        <path d="M10 13 Q14 9 18 13" stroke="#1d9e75" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        <path d="M8 15 Q14 8 20 15" stroke="#1d9e75" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.6"/>
        <circle cx="14" cy="12" r="1.5" fill="#1d9e75"/>
      </svg>
    ),
    title: "Socle NFC en bois",
    desc: "Gravé à ton nom, posé sur ton comptoir.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="14" fill="#E8F8F3"/>
        <rect x="6" y="8" width="12" height="14" rx="3" fill="none" stroke="#1d9e75" strokeWidth="1.5"/>
        <rect x="8" y="11" width="8" height="2" rx="1" fill="#1d9e75" opacity="0.6"/>
        <rect x="8" y="15" width="6" height="2" rx="1" fill="#1d9e75" opacity="0.4"/>
        <rect x="8" y="19" width="7" height="2" rx="1" fill="#1d9e75" opacity="0.3"/>
        <path d="M20 11l2 2-2 2" stroke="#1d9e75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Campagnes SMS",
    desc: "Messages automatisés. Taux d'ouverture 98%.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="14" fill="#E8F8F3"/>
        <rect x="6" y="16" width="4" height="7" rx="1" fill="#1d9e75" opacity="0.5"/>
        <rect x="12" y="12" width="4" height="11" rx="1" fill="#1d9e75" opacity="0.7"/>
        <rect x="18" y="8" width="4" height="15" rx="1" fill="#1d9e75"/>
        <path d="M7 14 Q10 10 14 11 Q18 12 21 7" stroke="#1d9e75" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    title: "Tableau de bord",
    desc: "Stats temps réel. Décisions basées sur des données.",
  },
];

export default function FeaturesPeekSection() {
  return (
    <section style={{ background: "#fff", padding: "120px 24px" }}>
      <style>{`
        .feat-peek-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08) !important;
        }
      `}</style>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span style={{
            display: "inline-block",
            background: "#E8F8F3", color: "#1d9e75",
            borderRadius: 50, padding: "6px 14px",
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 13, fontWeight: 500, marginBottom: 20,
          }}>Ce qui est inclus</span>
          <h2 style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 700,
            fontSize: "clamp(30px, 4vw, 48px)",
            color: "#0f172a",
            lineHeight: 1.15,
            marginBottom: 16,
          }}>
            Tout ce qu&rsquo;il te faut.<br />En un seul pack.
          </h2>
          <p style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 17, color: "#64748b",
            maxWidth: 440, margin: "0 auto", lineHeight: 1.7,
          }}>
            Six outils pensés pour les commerçants romands. Aucun abonnement caché.
          </p>
        </div>

        {/* Feature grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          marginBottom: 56,
        }}>
          {feats.map((f, i) => (
            <div
              key={i}
              className="feat-peek-card"
              style={{
                background: "#FAFAFA",
                border: "1px solid #f0f0f0",
                borderRadius: 16,
                padding: "28px 24px",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 600, fontSize: 17,
                color: "#0f172a", marginBottom: 8,
              }}>{f.title}</h3>
              <p style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0,
              }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Responsive grid for mobile */}
        <style>{`
          @media (max-width: 768px) {
            .feat-peek-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 480px) {
            .feat-peek-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link href="/features" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#0f172a", color: "#fff",
            borderRadius: 12, padding: "16px 32px",
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 16, fontWeight: 500, textDecoration: "none",
            transition: "background 0.15s, transform 0.15s",
          }}>
            Voir toutes les fonctionnalités
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <p style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 13, color: "#94a3b8", marginTop: 14,
          }}>
            Carte fidélité · Site vitrine · SEO · NFC · SMS · Dashboard
          </p>
        </div>
      </div>
    </section>
  );
}
