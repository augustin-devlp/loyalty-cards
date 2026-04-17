import Image from "next/image";

const CHECK = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="9" cy="9" r="9" fill="#E8F8F3"/>
    <path d="M5 9l3 3 5-5" stroke="#1d9e75" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const features = [
  {
    tag: "CARTE FIDÉLITÉ",
    title: "La carte que tes clients gardent vraiment.",
    text: "Fini les cartes papier perdues. Tes clients scannent un QR code et leurs tampons s'ajoutent en 3 secondes. Pas d'app à télécharger.",
    checks: ["QR code prêt à afficher en caisse", "Zéro application à installer"],
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=85",
    bg: "#fff",
    imgLeft: true,
  },
  {
    tag: "SITE VITRINE",
    title: "Un site qui te représente vraiment.",
    text: "5 pages soignées avec tes horaires, photos, menu et carte fidélité — tout en un. Livré en 48h, sans que tu aies à faire quoi que ce soit.",
    checks: ["Design adapté à ton image", "Hébergement + domaine .ch inclus"],
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=85",
    bg: "#FBF8F3",
    imgLeft: false,
  },
  {
    tag: "SEO LOCAL",
    title: "Tes voisins te trouvent sur Google.",
    text: "On optimise ta présence locale pour que les gens du quartier te trouvent quand ils cherchent un café, une boulangerie ou un coiffeur près d'eux.",
    checks: ["Optimisation Google My Business", "Résultats visibles en 4 à 6 semaines"],
    img: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&q=85",
    bg: "#fff",
    imgLeft: true,
  },
  {
    tag: "SOCLE NFC",
    title: "L'unique objet physique qu'on te livre.",
    text: "Le socle NFC en bois gravé est posé sur ton comptoir. Tes clients scannent en un geste. Beau, durable, discret — il remplace une caissette entière de cartes papier.",
    checks: ["Bois naturel, gravure laser personnalisée", "Livré et installé avec le pack"],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85",
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
            className={`features-alt${f.imgLeft ? "" : " reverse"}`}
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
            <div style={{ flex: 1, position: "relative", borderRadius: 16, overflow: "hidden" }}>
              <Image
                src={f.img}
                alt={f.title}
                width={600}
                height={400}
                style={{ width: "100%", height: "auto", display: "block", borderRadius: 16 }}
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

              {f.checks.map(c => (
                <div key={c} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                  {CHECK}
                  <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 15, fontWeight: 500, color: "#374151" }}>
                    {c}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
