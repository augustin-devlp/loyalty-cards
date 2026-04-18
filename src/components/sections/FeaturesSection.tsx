import NFCStandMockup from "@/components/NFCStandMockup";
import LoyaltyFlowMockup from "@/components/LoyaltyFlowMockup";

const CHECK = (label: string) => (
  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="9" cy="9" r="9" fill="#E8F8F3"/>
      <path d="M5 9l3 3 5-5" stroke="#1d9e75" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 15, fontWeight: 500, color: "#374151" }}>{label}</span>
  </div>
);

const features = [
  {
    tag: "CARTE FIDÉLITÉ",
    title: "Tes clients scannent. Les tampons s'ajoutent. En 3 secondes.",
    text: "Fini les cartes papier perdues. Un QR code à ta caisse, un scan de l'appareil photo, et c'est dans le téléphone pour toujours. Zéro app, zéro friction.",
    checks: ["QR code prêt à afficher en caisse", "Zéro application à installer"],
    img: null,
    bg: "#fff",
    imgLeft: true,
    visual: "loyalty",
  },
  {
    tag: "SITE VITRINE",
    title: "Ton site, livré clé en main. Sans une ligne de code.",
    text: "5 pages soignées avec tes horaires, photos, menu et carte fidélité — tout en un. Tu valides, on publie. Hébergé, référencé, en ligne en 48h.",
    checks: ["Design adapté à ton image de marque", "Hébergement + domaine .ch inclus"],
    img: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=85",
    bg: "#FBF8F3",
    imgLeft: false,
    visual: null,
  },
  {
    tag: "SEO LOCAL",
    title: "Les gens du quartier te trouvent en premier sur Google.",
    text: "On optimise ta fiche Google, tes mots-clés locaux et ta présence en ligne pour que les clients autour de toi te trouvent avant la concurrence.",
    checks: ["Optimisation Google My Business", "Résultats visibles en 4 à 6 semaines"],
    img: null,
    bg: "#fff",
    imgLeft: true,
    visual: "seo",
  },
  {
    tag: "SOCLE NFC EN BOIS",
    title: "Posé sur ton comptoir. Tes clients tapent et c'est fait.",
    text: "Le socle NFC gravé à ton nom remplace des centaines de cartes papier. Beau, durable, discret — il s'intègre à n'importe quel comptoir en 2 minutes.",
    checks: ["Bois naturel, gravure laser personnalisée", "Livré et installé avec le pack"],
    img: null,
    bg: "#FBF8F3",
    imgLeft: false,
    visual: "nfc",
  },
];

function SEOSearchMockup() {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.08)",
      padding: 24,
      fontFamily: "Arial, sans-serif",
    }}>
      {/* Search bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, marginBottom: 24,
        background: "#f8f9fa", borderRadius: 24, padding: "10px 18px",
        border: "1px solid #dadce0",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#9aa0a6" strokeWidth="2"/><path d="M20 20l-3-3" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round"/></svg>
        <span style={{ fontSize: 15, color: "#202124" }}>boulangerie lausanne centre</span>
      </div>

      {/* Sponsored label */}
      <div style={{ fontSize: 11, color: "#70757a", marginBottom: 8 }}>Environ 4 230 résultats</div>

      {/* #1 result — highlighted */}
      <div style={{
        border: "2px solid #1d9e75", borderRadius: 12, padding: "14px 18px", marginBottom: 10,
        background: "#f0fdf8",
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: -10, right: 12, background: "#1d9e75", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "2px 8px", letterSpacing: "0.05em" }}>1ER RÉSULTAT</div>
        <div style={{ fontSize: 12, color: "#1d9e75", marginBottom: 2 }}>stampify.ch › boulangerie-martin</div>
        <div style={{ fontSize: 16, color: "#1a0dab", fontWeight: 500, marginBottom: 4 }}>Boulangerie Martin — Lausanne Centre · Carte fidélité</div>
        <div style={{ fontSize: 13, color: "#4d5156", lineHeight: 1.5 }}>Boulangerie artisanale au cœur de Lausanne. Pains, viennoiseries, carte fidélité digitale. Ouvert 7j/7. ★ 4.9 (238 avis)</div>
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          {["Horaires", "Menu", "Carte fidélité", "Avis"].map(tag => (
            <span key={tag} style={{ background: "#e8f0fe", color: "#1967d2", borderRadius: 12, padding: "2px 10px", fontSize: 12 }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* #2 result */}
      <div style={{ borderRadius: 8, padding: "12px 18px", marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: "#202124", marginBottom: 2 }}>lacigogneblanche.ch</div>
        <div style={{ fontSize: 15, color: "#1a0dab", marginBottom: 3 }}>La Cigogne Blanche – Boulangerie Lausanne</div>
        <div style={{ fontSize: 13, color: "#4d5156" }}>Boulangerie traditionnelle. Ouvert du lundi au samedi.</div>
      </div>

      {/* #3 result */}
      <div style={{ borderRadius: 8, padding: "12px 18px", opacity: 0.6 }}>
        <div style={{ fontSize: 12, color: "#202124", marginBottom: 2 }}>leboulanger.ch</div>
        <div style={{ fontSize: 15, color: "#1a0dab", marginBottom: 3 }}>Le Boulanger – Pains & Pâtisseries</div>
        <div style={{ fontSize: 13, color: "#4d5156" }}>Artisan boulanger depuis 1987. Lausanne.</div>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <div>
      <style>{`
        .feat-row { display: flex; align-items: center; gap: 80px; }
        @media (max-width: 900px) {
          .feat-row { flex-direction: column !important; gap: 40px; }
          .feat-section { padding: 72px 20px !important; overflow-x: hidden !important; }
          .feat-text h2 { font-size: clamp(22px,6vw,32px) !important; }
        }
        @media (max-width: 480px) {
          .feat-section { padding: 56px 16px !important; overflow-x: hidden !important; }
          .feat-row > div { max-width: 100% !important; min-width: 0 !important; }
        }
      `}</style>
      {features.map((f, i) => (
        <section key={i} className="feat-section" style={{ background: f.bg, padding: "120px 24px" }}>
          <div
            className="feat-row"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              flexDirection: f.imgLeft ? "row" : "row-reverse",
            }}
          >
            {/* Image or visual */}
            <div style={{ flex: 1 }}>
              {f.visual === "loyalty" ? (
                <LoyaltyFlowMockup />
              ) : f.visual === "seo" ? (
                <SEOSearchMockup />
              ) : f.visual === "nfc" ? (
                <NFCStandMockup />
              ) : (
                <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.08)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.img!}
                    alt={f.title}
                    loading="lazy"
                    style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }}
                  />
                </div>
              )}
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 2, background: "#1d9e75" }} />
                <p style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: 11, fontWeight: 500,
                  color: "#1d9e75",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  margin: 0,
                }}>
                  {f.tag}
                </p>
              </div>

              <h2 style={{
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 700,
                fontSize: "clamp(26px, 2.8vw, 38px)",
                color: "#0f172a",
                lineHeight: 1.2,
                marginBottom: 20,
              }}>
                {f.title}
              </h2>

              <p style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: 16,
                color: "#64748b",
                lineHeight: 1.9,
                marginBottom: 24,
              }}>
                {f.text}
              </p>

              {f.checks.map(c => CHECK(c))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
