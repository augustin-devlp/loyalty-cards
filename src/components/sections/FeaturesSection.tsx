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
    // Phone scanning QR code / loyalty interaction
    img: "https://images.unsplash.com/photo-1598128558393-70ff21433be0?w=800&q=85",
    bg: "#fff",
    imgLeft: true,
  },
  {
    tag: "SITE VITRINE",
    title: "Ton site, livré clé en main. Sans une ligne de code.",
    text: "5 pages soignées avec tes horaires, photos, menu et carte fidélité — tout en un. Tu valides, on publie. Hébergé, référencé, en ligne en 48h.",
    checks: ["Design adapté à ton image de marque", "Hébergement + domaine .ch inclus"],
    // Beautiful website on MacBook
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=85",
    bg: "#FBF8F3",
    imgLeft: false,
  },
  {
    tag: "SEO LOCAL",
    title: "Les gens du quartier te trouvent en premier sur Google.",
    text: "On optimise ta fiche Google, tes mots-clés locaux et ta présence en ligne pour que les clients autour de toi te trouvent avant la concurrence.",
    checks: ["Optimisation Google My Business", "Résultats visibles en 4 à 6 semaines"],
    // Google Maps / local search on phone
    img: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=85",
    bg: "#fff",
    imgLeft: true,
  },
  {
    tag: "SOCLE NFC EN BOIS",
    title: "Posé sur ton comptoir. Tes clients tapent et c'est fait.",
    text: "Le socle NFC gravé à ton nom remplace des centaines de cartes papier. Beau, durable, discret — il s'intègre à n'importe quel comptoir en 2 minutes.",
    checks: ["Bois naturel, gravure laser personnalisée", "Livré et installé avec le pack"],
    // NFC / contactless payment wood
    img: "https://images.unsplash.com/photo-1612810806695-30f7a8258391?w=800&q=85",
    bg: "#FBF8F3",
    imgLeft: false,
  },
];

export default function FeaturesSection() {
  return (
    <div>
      {features.map((f, i) => (
        <section key={i} style={{ background: f.bg, padding: "120px 24px" }}>
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 80,
              flexDirection: f.imgLeft ? "row" : "row-reverse",
            }}
          >
            {/* Image */}
            <div style={{ flex: 1, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.08)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.img}
                alt={f.title}
                loading="lazy"
                style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }}
              />
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
