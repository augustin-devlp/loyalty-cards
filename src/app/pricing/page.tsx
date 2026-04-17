import Link from "next/link";

const CHECK = (label: string) => (
  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M3 8l3.5 3.5L13 5" stroke="#1d9e75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 14, color: "#374151" }}>{label}</span>
  </div>
);

const CROSS = (label: string) => (
  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="8" cy="8" r="7" fill="#f1f5f9"/>
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
    <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 14, color: "#94a3b8" }}>{label}</span>
  </div>
);

export default function PricingPage() {
  return (
    <main style={{ paddingTop: 68 }}>
      {/* Header */}
      <section style={{ background: "#FBF8F3", padding: "80px 24px", textAlign: "center" }}>
        <span style={{
          display: "inline-block",
          background: "#E8F8F3", color: "#1d9e75",
          borderRadius: 50, padding: "6px 14px",
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 13, fontWeight: 500, marginBottom: 20,
        }}>Tarifs</span>
        <h1 style={{
          fontFamily: "var(--font-fraunces), serif",
          fontWeight: 900,
          fontSize: "clamp(36px, 5vw, 56px)",
          color: "#0f172a",
          lineHeight: 1.1, marginBottom: 16,
        }}>
          Transparent. Simple. Sans surprise.
        </h1>
        <p style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 18, color: "#64748b",
          maxWidth: 520, margin: "0 auto", lineHeight: 1.7,
        }}>
          Tu sais exactement ce que tu paies avant de commencer.
        </p>
      </section>

      {/* Pack Essentiel + Devis */}
      <section style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 700, fontSize: 32, color: "#0f172a",
            textAlign: "center", marginBottom: 48,
          }}>
            Pour démarrer
          </h2>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {/* 990 CHF */}
            <div style={{
              flex: "1 1 400px",
              border: "2px solid #1d9e75",
              borderRadius: 20, padding: 40,
              position: "relative",
            }}>
              <div style={{
                position: "absolute", top: -14, left: 32,
                background: "#1d9e75", color: "#fff",
                borderRadius: 50, padding: "4px 14px",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 13, fontWeight: 500,
              }}>Le plus populaire</div>

              <h3 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 700, fontSize: 28, color: "#0f172a", marginBottom: 16 }}>Pack Essentiel</h3>

              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 900, fontSize: 64, color: "#1d9e75", lineHeight: 1 }}>990</span>
                <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 26, color: "#1d9e75" }}> CHF</span>
              </div>
              <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
                paiement unique · sans abonnement · sans surprise
              </p>

              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 24, marginBottom: 28 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
                  {["Site vitrine 5 pages", "Carte fidélité 10 tampons", "SEO local optimisé", "Hébergement 1 an inclus", "Domaine .ch inclus", "QR code + affichage A4/A5", "1 campagne SMS offerte", "Guide vidéo d'utilisation", "2 révisions incluses", "Mis en ligne en 48h"].map(item => CHECK(item))}
                </div>
              </div>

              <Link href="https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20d%C3%A9marrer%20avec%20Stampify%20%28990%20CHF%29." style={{
                display: "block", textAlign: "center",
                background: "#1d9e75", color: "#fff",
                borderRadius: 10, padding: "16px 0",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 16, fontWeight: 500, textDecoration: "none", marginBottom: 12,
              }}>
                Démarrer maintenant
              </Link>
              <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, fontStyle: "italic", color: "#94a3b8", textAlign: "center" }}>
                Pas satisfait dans les 14 jours → remboursé intégralement.
              </p>
            </div>

            {/* Devis */}
            <div style={{ flex: "1 1 280px", background: "#FAFAFA", border: "1px solid #e5e7eb", borderRadius: 20, padding: 40 }}>
              <span style={{ background: "#f1f5f9", color: "#64748b", borderRadius: 50, padding: "4px 12px", fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 12, fontWeight: 500, display: "inline-block", marginBottom: 20 }}>Sur mesure</span>
              <h3 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 700, fontSize: 28, color: "#0f172a", marginBottom: 16 }}>Devis personnalisé</h3>
              <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 16, color: "#64748b", lineHeight: 1.7, marginBottom: 24 }}>
                Plusieurs points de vente, branding avancé, fonctionnalités spécifiques — on s'adapte à ton projet.
              </p>
              {["Multi-points de vente", "Intégrations spécifiques", "Branding avancé", "Accompagnement dédié"].map(item => CHECK(item))}
              <Link href="https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20un%20devis%20sur%20mesure%20Stampify." style={{
                display: "block", textAlign: "center",
                background: "#fff", color: "#1d9e75", border: "1px solid #1d9e75",
                borderRadius: 10, padding: "16px 0",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 16, fontWeight: 500, textDecoration: "none", marginTop: 24,
              }}>
                Demander un devis →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Options complémentaires */}
      <section style={{ background: "#FBF8F3", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 700, fontSize: 32, color: "#0f172a", textAlign: "center", marginBottom: 12 }}>
            Options après le pack
          </h2>
          <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 16, color: "#64748b", textAlign: "center", marginBottom: 48 }}>
            Entièrement optionnel. Aucun engagement.
          </p>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {/* Suivi mensuel 49 */}
            <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 20, padding: 36, border: "1px solid #e5e7eb" }}>
              <h3 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 700, fontSize: 22, color: "#0f172a", marginBottom: 8 }}>Suivi mensuel</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 800, fontSize: 40, color: "#0f172a", lineHeight: 1 }}>49</span>
                <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 18, color: "#64748b" }}> CHF/mois</span>
              </div>
              <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>sans engagement · résiliable à tout moment</p>
              {["1 campagne SMS par mois", "Rapport mensuel d'activité", "Mises à jour mineures du site", "Support prioritaire 4h", "Renouvellement domaine inclus"].map(item => CHECK(item))}
              {[CROSS("Pack Essentiel non inclus")]}
            </div>

            {/* SMS 79 */}
            <div style={{ flex: "1 1 280px", background: "#fff", borderRadius: 20, padding: 36, border: "1px solid #e5e7eb" }}>
              <h3 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 700, fontSize: 22, color: "#0f172a", marginBottom: 8 }}>Campagnes SMS</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 800, fontSize: 40, color: "#0f172a", lineHeight: 1 }}>79</span>
                <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 18, color: "#64748b" }}> CHF/mois</span>
              </div>
              <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>jusqu&apos;à 500 SMS/mois · sans engagement</p>
              {["4 campagnes SMS par mois", "Jusqu'à 500 destinataires", "Ciblage par segment client", "Statistiques d'ouverture", "98% de taux de lecture"].map(item => CHECK(item))}
            </div>

            {/* Tout compris */}
            <div style={{ flex: "1 1 280px", background: "#0f1a15", borderRadius: 20, padding: 36 }}>
              <span style={{ background: "rgba(29,158,117,0.2)", color: "#1d9e75", borderRadius: 50, padding: "4px 12px", fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 12, fontWeight: 500, display: "inline-block", marginBottom: 16 }}>Meilleur rapport</span>
              <h3 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 8 }}>Tout compris</h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 800, fontSize: 40, color: "#1d9e75", lineHeight: 1 }}>99</span>
                <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 18, color: "rgba(255,255,255,0.6)" }}> CHF/mois</span>
              </div>
              <p style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>suivi + SMS illimités · sans engagement</p>
              {["Suivi mensuel complet", "SMS illimités (jusqu'à 1000/mois)", "Priorité absolue au support", "Renouvellement domaine inclus", "Optimisation SEO mensuelle"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M3 8l3.5 3.5L13 5" stroke="#1d9e75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{item}</span>
                </div>
              ))}
              <Link href="https://wa.me/41791342997?text=Bonjour%20%21%20Je%20suis%20int%C3%A9ress%C3%A9%20par%20l%27option%20Tout%20compris%20Stampify." style={{
                display: "block", textAlign: "center",
                background: "#1d9e75", color: "#fff",
                borderRadius: 10, padding: "14px 0",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 15, fontWeight: 500, textDecoration: "none", marginTop: 24,
              }}>
                En savoir plus →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#1d9e75", padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 700, fontSize: "clamp(26px, 3.5vw, 40px)", color: "#fff", marginBottom: 32 }}>
          Des questions sur le tarif ?
        </h2>
        <Link href="https://wa.me/41791342997" style={{
          background: "#fff", color: "#1d9e75",
          borderRadius: 10, padding: "16px 32px",
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 16, fontWeight: 500, textDecoration: "none", display: "inline-block",
        }}>
          Parler à Augustin →
        </Link>
      </section>
    </main>
  );
}
