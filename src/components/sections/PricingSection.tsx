import Link from "next/link";

const CHECK = (label: string) => (
  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M3 8l3.5 3.5L13 5" stroke="#1d9e75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 14, color: "#374151" }}>{label}</span>
  </div>
);

const essItems = [
  "Site vitrine 5 pages",
  "Carte fidélité 10 tampons",
  "SEO local optimisé",
  "Hébergement 1 an inclus",
  "Domaine .ch inclus",
  "QR code + affichage A4/A5",
  "1 campagne SMS offerte",
  "Guide vidéo d'utilisation",
  "2 révisions incluses",
  "Mis en ligne en 48h",
];

const compareRows = [
  { label: "Prix",     agence: "2000–5000 CHF",  freelance: "800–2000 CHF",  stampify: "990 CHF" },
  { label: "Délai",   agence: "4–8 semaines",    freelance: "2–4 semaines",  stampify: "48h" },
  { label: "Fidélité",agence: "Non",              freelance: "Non",           stampify: "Oui" },
  { label: "SEO local",agence: "Option payante", freelance: "Rarement",      stampify: "Inclus" },
  { label: "Support", agence: "Non",              freelance: "Non",           stampify: "Inclus" },
];

export default function PricingSection() {
  return (
    <section id="tarif" style={{ background: "#fff", padding: "120px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 2, background: "#1d9e75" }} />
            <span style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 11, fontWeight: 500,
              color: "#1d9e75",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>TARIF</span>
            <div style={{ width: 32, height: 2, background: "#1d9e75" }} />
          </div>
          <h2 style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 3.5vw, 44px)",
            color: "#0f172a",
            marginBottom: 12,
          }}>
            Un seul prix. Tout inclus.
          </h2>
          <p style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 17, color: "#64748b",
          }}>
            Pas de frais cachés. Pas d&rsquo;abonnement. Pas de surprise.
          </p>
        </div>

        {/* 2 cards */}
        <div style={{ display: "flex", gap: 24, maxWidth: 880, margin: "0 auto 56px", flexWrap: "wrap" }}>

          {/* Pack Essentiel */}
          <div style={{
            flex: "1 1 400px",
            border: "2px solid #1d9e75",
            borderRadius: 20,
            padding: 40,
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: -14, left: 32,
              background: "#1d9e75", color: "#fff",
              borderRadius: 50, padding: "4px 14px",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13, fontWeight: 500,
            }}>Le plus populaire</div>

            <h3 style={{
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 700, fontSize: 28,
              color: "#0f172a", marginBottom: 16,
            }}>Pack Essentiel</h3>

            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
              <span style={{
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 900, fontSize: 64,
                color: "#1d9e75", lineHeight: 1,
              }}>990</span>
              <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 26, color: "#1d9e75" }}> CHF</span>
            </div>
            <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
              paiement unique · sans abonnement
            </p>

            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 24, marginBottom: 28 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
                {essItems.map(item => CHECK(item))}
              </div>
            </div>

            <Link
              href="https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20d%C3%A9marrer%20avec%20Stampify%20%28990%20CHF%29."
              style={{
                display: "block", textAlign: "center",
                background: "#1d9e75", color: "#fff",
                borderRadius: 10, padding: "16px 0",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 16, fontWeight: 500,
                textDecoration: "none",
                marginBottom: 12,
              }}
            >
              Démarrer maintenant
            </Link>
            <p style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13, fontStyle: "italic",
              color: "#94a3b8", textAlign: "center",
            }}>
              Pas satisfait dans les 14 jours → remboursé.
            </p>
          </div>

          {/* Devis sur mesure */}
          <div style={{
            flex: "1 1 280px",
            background: "#FAFAFA",
            border: "1px solid #e5e7eb",
            borderRadius: 20,
            padding: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}>
            <div>
              <span style={{
                background: "#f1f5f9", color: "#64748b",
                borderRadius: 50, padding: "4px 12px",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 12, fontWeight: 500,
                display: "inline-block",
                marginBottom: 20,
              }}>Pour les projets sur mesure</span>

              <h3 style={{
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 700, fontSize: 28,
                color: "#0f172a", marginBottom: 16,
              }}>Devis personnalisé</h3>

              <p style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 16, color: "#64748b", lineHeight: 1.7, marginBottom: 24,
              }}>
                Tu as un projet plus complexe — plusieurs points de vente, des besoins spécifiques ou une enseigne avec plusieurs équipes ? On te fait un devis sur mesure.
              </p>

              {["Multi-points de vente", "Intégrations personnalisées", "Branding avancé", "Accompagnement dédié"].map(item => CHECK(item))}
            </div>

            <Link
              href="https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20un%20devis%20sur%20mesure%20Stampify."
              style={{
                display: "block", textAlign: "center",
                background: "#fff",
                color: "#1d9e75",
                border: "1px solid #1d9e75",
                borderRadius: 10, padding: "16px 0",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 16, fontWeight: 500,
                textDecoration: "none",
                marginTop: 24,
              }}
            >
              Demander un devis →
            </Link>
          </div>
        </div>

        {/* Comparatif */}
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 15, fontWeight: 500,
            color: "#94a3b8", textAlign: "center", marginBottom: 24,
          }}>
            Pourquoi pas une agence ?
          </p>
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #f0f0f0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
              {["", "Agence", "Freelance", "Stampify"].map((h, i) => (
                <div key={i} style={{
                  padding: "12px 16px",
                  background: i === 3 ? "#E8F8F3" : "#f9fafb",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: 13, fontWeight: 600,
                  color: i === 3 ? "#1d9e75" : "#64748b",
                  borderBottom: "1px solid #f0f0f0",
                  textAlign: i > 0 ? "center" : "left",
                }}>{h}</div>
              ))}
              {compareRows.map((row, ri) => (
                [row.label, row.agence, row.freelance, row.stampify].map((cell, ci) => (
                  <div key={`${ri}-${ci}`} style={{
                    padding: "11px 16px",
                    background: ci === 3 ? "rgba(232,248,243,0.4)" : (ri % 2 === 0 ? "#fff" : "#fafafa"),
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: 14,
                    color: ci === 3 ? "#1d9e75" : (ci === 0 ? "#374151" : "#94a3b8"),
                    fontWeight: ci === 3 ? 600 : 400,
                    borderBottom: ri < compareRows.length - 1 ? "1px solid #f5f5f5" : "none",
                    textAlign: ci > 0 ? "center" : "left",
                  }}>{cell}</div>
                ))
              ))}
            </div>
          </div>

          {/* Lien vers la page tarifs complète */}
          <p style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/pricing" style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 14, color: "#64748b",
              textDecoration: "underline",
            }}>
              Voir toutes les options (suivi mensuel, SMS…) →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
