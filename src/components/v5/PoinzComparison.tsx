const ROWS = [
  { aspect: "Prix", stampify: "990 CHF · Paiement unique", poinz: "Gratuit (puis abonnement)" },
  { aspect: "Site vitrine", stampify: "✅ Inclus, 5 pages pro", poinz: "❌ Non inclus" },
  { aspect: "Votre marque", stampify: "✅ 100% à vos couleurs", poinz: "❌ Logo Poinz visible partout" },
  { aspect: "Domaine propre", stampify: "✅ votre-nom.ch", poinz: "❌ votre-nom.poinz.ch" },
  { aspect: "NFC en bois gravé", stampify: "✅ Inclus, livré en 5 jours", poinz: "❌ Non disponible" },
  { aspect: "SEO local", stampify: "✅ Google Maps optimisé", poinz: "❌ Aucun SEO" },
  { aspect: "Dashboard client", stampify: "✅ Temps réel, mobile", poinz: "⚠️ Limité en gratuit" },
  { aspect: "Campagnes SMS", stampify: "✅ 1 campagne offerte", poinz: "⚠️ Payant en option" },
  { aspect: "Vos données", stampify: "✅ Vous êtes propriétaire", poinz: "❌ Appartiennent à Poinz" },
  { aspect: "Support", stampify: "✅ WhatsApp 7j/7, 2h max", poinz: "❌ Email uniquement" },
  { aspect: "Formation", stampify: "✅ 30 min incluse", poinz: "❌ Tutoriels vidéo seulement" },
];

export default function PoinzComparison() {
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #E5E7EB" }}>
      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#F9FAFB", borderBottom: "2px solid #E5E7EB" }}>
        <div style={{ padding: "16px 20px", fontSize: 12, fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.06em", textTransform: "uppercase" }}>Fonctionnalité</div>
        <div style={{ padding: "16px 20px", background: "#E8F7F2", borderLeft: "1px solid rgba(29,158,117,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#1d9e75" }}>✅ Stampify</span>
        </div>
        <div style={{ padding: "16px 20px", borderLeft: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#6B7280" }}>Poinz</span>
        </div>
      </div>

      {ROWS.map((row, i) => (
        <div key={row.aspect} style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          borderBottom: i < ROWS.length - 1 ? "1px solid #E5E7EB" : "none",
          background: i % 2 === 0 ? "#fff" : "#FAFAFA",
        }}>
          <div style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>{row.aspect}</div>
          <div style={{ padding: "14px 20px", fontSize: 13, color: "#1d9e75", fontWeight: 500, background: "rgba(29,158,117,0.03)", borderLeft: "1px solid rgba(29,158,117,0.12)" }}>
            {row.stampify}
          </div>
          <div style={{ padding: "14px 20px", fontSize: 13, color: "#9CA3AF", borderLeft: "1px solid #E5E7EB" }}>
            {row.poinz}
          </div>
        </div>
      ))}
    </div>
  );
}
