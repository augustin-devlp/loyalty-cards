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
  "Site vitrine 5 pages", "Carte fidélité 10 tampons", "SEO local optimisé",
  "Hébergement 1 an inclus", "Domaine .ch inclus", "QR code + affichage A4/A5",
  "1 campagne SMS offerte", "Guide vidéo d'utilisation", "2 révisions incluses", "Mise en ligne en 48h",
];
const mensItems = [
  "1 campagne SMS par mois", "Rapport mensuel d'activité",
  "Mises à jour mineures", "Support prioritaire 4h", "Renouvellement domaine inclus",
];

const compareRows = [
  { label: "Prix", agence: "2000–5000 CHF", freelance: "800–2000 CHF", stampify: "990 CHF" },
  { label: "Délai", agence: "4–8 semaines", freelance: "2–4 semaines", stampify: "48h" },
  { label: "Fidélité", agence: "Non", freelance: "Non", stampify: "Oui" },
  { label: "SEO local", agence: "Option", freelance: "Rarement", stampify: "Inclus" },
  { label: "Support", agence: "Non", freelance: "Non", stampify: "Inclus" },
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
            Pas de frais cachés. Pas de surprise.
          </p>
        </div>

        {/* Cards */}
        <div className="pricing-2col" style={{ display: "flex", gap: 24, maxWidth: 880, margin: "0 auto 56px" }}>
          {/* Essentiel */}
          <div style={{
            flex: 1.1,
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
                fontWeight: 900, fontSize: 60,
                color: "#1d9e75", lineHeight: 1,
              }}>990</span>
              <span style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 24, color: "#1d9e75",
              }}> CHF</span>
            </div>
            <p style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13, color: "#94a3b8",
              marginBottom: 24,
            }}>paiement unique · sans abonnement</p>

            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 24, marginBottom: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
                {essItems.map(item => CHECK(item))}
              </div>
            </div>

            <Link href="https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20d%C3%A9marrer%20avec%20Stampify%20%28990%20CHF%29." style={{
              display: "block",
              width: "100%",
              textAlign: "center",
              background: "#1d9e75",
              color: "#fff",
              borderRadius: 10,
              padding: "16px 0",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 16, fontWeight: 500,
              textDecoration: "none",
              marginBottom: 12,
              transition: "background 0.15s",
            }}>
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

          {/* Mensuel */}
          <div style={{
            flex: 1,
            background: "#FAFAFA",
            border: "1px solid #e5e7eb",
            borderRadius: 20,
            padding: 40,
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: -14, left: 32,
              background: "#f1f5f9", color: "#64748b",
              borderRadius: 50, padding: "4px 14px",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13, fontWeight: 500,
            }}>Optionnel</div>

            <h3 style={{
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 700, fontSize: 28,
              color: "#0f172a", marginBottom: 16,
            }}>Suivi mensuel</h3>

            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
              <span style={{
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 900, fontSize: 60,
                color: "#0f172a", lineHeight: 1,
              }}>49</span>
              <span style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 24, color: "#0f172a",
              }}> CHF</span>
            </div>
            <p style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13, color: "#94a3b8",
              marginBottom: 24,
            }}>par mois · après le pack Essentiel</p>

            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 24, marginBottom: 24 }}>
              {mensItems.map(item => CHECK(item))}
            </div>

            <Link href="https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20en%20savoir%20plus%20sur%20le%20suivi%20mensuel%20Stampify." style={{
              display: "block",
              width: "100%",
              textAlign: "center",
              background: "#fff",
              color: "#1d9e75",
              border: "1px solid #1d9e75",
              borderRadius: 10,
              padding: "16px 0",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 16, fontWeight: 500,
              textDecoration: "none",
              transition: "background 0.15s",
            }}>
              En savoir plus
            </Link>
          </div>
        </div>

        {/* Comparison table */}
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 15, fontWeight: 500,
            color: "#94a3b8", textAlign: "center",
            marginBottom: 24,
          }}>
            Pourquoi pas une agence ?
          </p>

          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #f0f0f0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
              {/* Header */}
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

              {/* Rows */}
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
        </div>
      </div>
    </section>
  );
}
