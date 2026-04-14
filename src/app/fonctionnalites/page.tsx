import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Fonctionnalités Stampify — Site web, carte fidélité, NFC, SMS",
  description:
    "Découvrez toutes les fonctionnalités Stampify : site vitrine professionnel, carte de fidélité digitale, plaquette NFC en bois, campagnes SMS, tableau de bord analytics. 990 CHF tout inclus.",
  alternates: { canonical: "https://www.stampify.ch/fonctionnalites" },
};

const WA_OBTENIR =
  "https://wa.me/41791342997?text=Bonjour%2C%20je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

const features = [
  {
    tag: "Site vitrine professionnel",
    title: "Un site qui vous ressemble, sur Google en 1 semaine.",
    desc: "5 pages à vos couleurs : accueil, menu/services, galerie, avis clients, contact. Domaine .ch inclus la première année, hébergement offert, certificat SSL actif. Optimisé pour apparaître sur Google lorsque vos clients cherchent « boulangerie Genève » ou « café Lausanne ».",
    items: [
      "Domaine .ch + hébergement inclus 1ère année",
      "SEO local optimisé (balises, Schema.org, Google Business)",
      "Mobile-first, score Lighthouse > 90",
      "5 pages : accueil, menu, galerie, avis, contact",
      "Mise en ligne en 48h après validation",
    ],
    emoji: "🌐",
    flip: false,
    visual: (
      <div style={{ background: "#F5F0E8", borderRadius: 16, border: "1px solid #E2D9CC", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ background: "#E2D9CC", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF6057" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
          <div style={{ flex: 1, background: "white", borderRadius: 6, padding: "4px 12px", marginLeft: 8, fontSize: 11, color: "#6B6259" }}>cafe-lumiere.ch</div>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#1A1410", marginBottom: 6 }}>Café Lumière</div>
          <div style={{ fontSize: 12, color: "#6B6259", marginBottom: 16 }}>Rue du Lac 8, Genève · Lun–Sam 7h–18h</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {["☕ Espresso", "🥐 Croissant", "🧁 Muffins", "🍵 Thé"].map((item) => (
              <div key={item} style={{ background: "white", borderRadius: 8, padding: "8px 10px", fontSize: 12, border: "1px solid #E2D9CC" }}>{item}</div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: "Carte de fidélité digitale",
    title: "Vos clients ne perdent plus leur carte.",
    desc: "Accessible depuis le téléphone via QR code ou NFC — sans téléchargement, sans compte. Vous choisissez le nombre de cases, la récompense, les couleurs. Chaque tampon est enregistré en temps réel dans votre tableau de bord.",
    items: [
      "10 cases personnalisables (couleurs, icônes, récompense)",
      "Accès instantané : QR code ou NFC tap",
      "Aucune application à télécharger pour vos clients",
      "Roue de la fortune incluse en bonus",
      "Notifications automatiques à la récompense",
    ],
    emoji: "🎟️",
    flip: true,
    visual: (
      <div style={{ background: "white", borderRadius: 20, boxShadow: "0 12px 40px rgba(0,0,0,0.1)", padding: "28px 32px", maxWidth: 300, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 17, fontWeight: 700, color: "#1A1410", marginBottom: 6 }}>Café Lumière</div>
        <div style={{ fontSize: 12, color: "#6B6259", marginBottom: 18 }}>1 café offert à la 10ème visite</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 14 }}>
          {[0,1,2,3,4,5,6,7,8,9].map((i) => (
            <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: i < 7 ? "#3D31B0" : "#EEF0FC", border: "2px solid " + (i < 7 ? "#3D31B0" : "#E2D9CC"), display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i < 7 && <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 8l3 3L12.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#6B6259", textAlign: "center" }}>7 / 10 — encore 3 pour votre récompense</div>
      </div>
    ),
  },
  {
    tag: "Plaquette NFC en bois gravée",
    title: "Sur votre comptoir, elle fait le travail à votre place.",
    desc: "Fabriquée en bois naturel, gravée à votre nom et logo. Posée sur votre comptoir, elle invite vos clients à approcher leur téléphone pour ouvrir instantanément leur carte fidélité. Moderne, durable, aucune batterie.",
    items: [
      "Gravure laser personnalisée (nom, logo, couleurs)",
      "Compatible tous les iPhones et Android depuis 2018",
      "Fonctionne aussi avec un QR code imprimable inclus",
      "Livrée dans votre commande avec le reste",
    ],
    emoji: "🪵",
    flip: false,
    visual: (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ width: 220, height: 140, background: "linear-gradient(135deg, #8B6335 0%, #C8960C 50%, #8B6335 100%)", borderRadius: 18, boxShadow: "0 12px 40px rgba(139,99,53,0.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, border: "2px solid rgba(255,255,255,0.2)" }}>
          <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="8" stroke="rgba(255,255,255,0.9)" strokeWidth="2" fill="none"/>
            <path d="M10 20 Q10 8 20 8 Q30 8 30 20" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <path d="M6 20 Q6 4 20 4 Q34 4 34 20" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.95)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Café Lumière</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Approchez votre téléphone</div>
        </div>
        <div style={{ background: "#EEF0FC", borderRadius: 10, padding: "10px 20px", fontSize: 13, color: "#3D31B0", fontWeight: 600 }}>✓ Livrée avec votre commande</div>
      </div>
    ),
  },
  {
    tag: "Campagnes SMS & push",
    title: "Ramenez vos clients le weekend.",
    desc: "Depuis votre tableau de bord, envoyez une campagne SMS à tous vos clients fidèles en 2 clics. « Ce weekend −20% sur les viennoiseries. » 1 campagne offerte le premier mois. Les notifications push navigateur sont incluses sans frais supplémentaires.",
    items: [
      "Campagne SMS à tous vos clients en 2 clics",
      "Notifications push navigateur (sans app, sans frais)",
      "1 campagne SMS offerte le 1er mois",
      "Add-on 49 CHF/mois pour campagnes illimitées",
    ],
    emoji: "📩",
    flip: true,
    visual: (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          "🥐 Ce weekend : viennoiseries à −20% au Café Lumière !",
          "☕ Il vous reste 2 tampons pour votre café offert.",
          "🎉 Votre récompense est prête — montrez ce message.",
        ].map((msg, i) => (
          <div key={i} style={{ background: "#1A1410", borderRadius: 12, padding: "14px 18px", display: "flex", gap: 12 }}>
            <div style={{ width: 32, height: 32, background: "#3D31B0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="2"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>Stampify · maintenant</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{msg}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "Tableau de bord analytics",
    title: "Savoir qui revient. Et pourquoi.",
    desc: "Accédez à votre tableau de bord depuis votre téléphone, tablette ou PC. Voyez en temps réel combien de clients sont actifs, les tampons donnés ce mois, les récompenses utilisées. Rapport mensuel automatique par email.",
    items: [
      "Clients actifs, tampons donnés, récompenses utilisées",
      "Rapport mensuel automatique par email",
      "Accessible depuis mobile, tablette, PC",
      "Historique complet de chaque client",
    ],
    emoji: "📊",
    flip: false,
    visual: (
      <div style={{ background: "#F5F0E8", borderRadius: 16, border: "1px solid #E2D9CC", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ background: "#1A1410", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 22, height: 22, background: "#3D31B0", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="2"/></svg>
          </div>
          <span style={{ color: "white", fontWeight: 600, fontSize: 12 }}>Dashboard</span>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Clients actifs", value: "247" },
              { label: "Tampons ce mois", value: "834" },
              { label: "Récompenses", value: "43" },
              { label: "Taux retour", value: "68%" },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "white", borderRadius: 10, padding: "12px 14px", border: "1px solid #E2D9CC" }}>
                <div style={{ fontSize: 10, color: "#6B6259", marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 20, fontWeight: 700, color: "#1A1410" }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

export default function FonctionnalitesPage() {
  return (
    <div style={{ background: "#F5F0E8", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: 128, paddingBottom: 80, paddingLeft: 24, paddingRight: 24, textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            Tout inclus · 990 CHF · livraison 48h
          </div>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 600, color: "#1A1410", margin: "0 0 20px 0", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Tout ce qu&apos;il faut.<br /><em style={{ fontStyle: "italic" }}>Rien de superflu.</em>
          </h1>
          <p style={{ fontSize: 18, color: "#6B6259", lineHeight: 1.65, margin: "0 0 36px 0" }}>
            Site vitrine, carte fidélité, plaquette NFC, campagnes SMS, analytics. Un seul paiement. Livré en 48h.
          </p>
          <Link href={WA_OBTENIR} style={{ display: "inline-block", background: "#3D31B0", color: "white", padding: "16px 32px", borderRadius: 10, fontSize: 16, fontWeight: 600, textDecoration: "none" }}>
            Obtenir mon site →
          </Link>
        </div>
      </section>

      {/* Feature sections */}
      {features.map((f, idx) => (
        <section key={idx} style={{ background: idx % 2 === 0 ? "white" : "#F5F0E8", padding: "80px 24px" }}>
          <div style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}
              className={`max-[768px]:!grid-cols-1${f.flip ? " max-[768px]:!flex max-[768px]:!flex-col-reverse" : ""}`}
            >
              {/* Text side */}
              <div style={{ order: f.flip ? 2 : 1 }} className={f.flip ? "md:order-2" : "md:order-1"}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#EEF0FC", color: "#3D31B0", borderRadius: 999, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                  <span>{f.emoji}</span>
                  <span>{f.tag}</span>
                </div>
                <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 600, color: "#1A1410", margin: "0 0 16px 0", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  {f.title}
                </h2>
                <p style={{ fontSize: 16, color: "#6B6259", lineHeight: 1.7, margin: "0 0 24px 0" }}>{f.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {f.items.map((item) => (
                    <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: "#3D31B0", fontWeight: 700, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 15, color: "#1A1410" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Visual side */}
              <div style={{ order: f.flip ? 1 : 2 }} className={f.flip ? "md:order-1" : "md:order-2"}>
                {f.visual}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section style={{ background: "#3D31B0", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, color: "white", margin: "0 0 16px 0", letterSpacing: "-0.02em" }}>
            Tout ça pour 990 CHF.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", margin: "0 0 32px 0" }}>
            Site + carte fidélité + NFC + SMS + analytics. Livré en 48h. Paiement unique.
          </p>
          <Link href={WA_OBTENIR} style={{ display: "inline-block", background: "white", color: "#3D31B0", padding: "16px 36px", borderRadius: 10, fontWeight: 600, fontSize: 16, textDecoration: "none" }}>
            Obtenir mon site →
          </Link>
          <div style={{ marginTop: 16 }}>
            <Link href="/tarif" style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", textDecoration: "underline" }}>
              Voir le détail du tarif →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
