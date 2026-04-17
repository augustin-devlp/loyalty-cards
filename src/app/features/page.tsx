"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import DashboardMockup from "@/components/DashboardMockup";

const CHECK = (label: string) => (
  <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="9" cy="9" r="9" fill="#E8F8F3"/>
      <path d="M5 9l3 3 5-5" stroke="#1d9e75" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 15, fontWeight: 500, color: "#374151" }}>{label}</span>
  </div>
);

function SMSPhoneMockup() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "24px 0" }}>
      <style>{`
        @keyframes smsSlide0 { 0%,100%{opacity:0;transform:translateY(12px)} 10%,90%{opacity:1;transform:translateY(0)} }
        @keyframes smsSlide1 { 0%,20%{opacity:0;transform:translateY(12px)} 30%,90%{opacity:1;transform:translateY(0)} 100%{opacity:0} }
        @keyframes smsSlide2 { 0%,40%{opacity:0;transform:translateY(12px)} 50%,90%{opacity:1;transform:translateY(0)} 100%{opacity:0} }
        @keyframes smsSlide3 { 0%,60%{opacity:0;transform:translateY(12px)} 70%,90%{opacity:1;transform:translateY(0)} 100%{opacity:0} }
      `}</style>
      {/* Phone frame */}
      <div style={{
        width: 300, background: "#1a1a2e", borderRadius: 40, padding: "12px 8px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08)",
      }}>
        {/* Notch */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <div style={{ width: 90, height: 28, background: "#111", borderRadius: 20 }} />
        </div>
        {/* Screen */}
        <div style={{
          background: "#f2f2f7", borderRadius: 28, overflow: "hidden", minHeight: 380,
          padding: "16px 14px",
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #e0e0e5" }}>
            <div style={{ width: 36, height: 36, background: "#1d9e75", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>S</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontWeight: 600, fontSize: 14, color: "#000" }}>Stampify</div>
              <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 11, color: "#8e8e93" }}>Messages automatisés</div>
            </div>
          </div>

          {/* SMS bubbles */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ animation: "smsSlide0 4s ease 0s infinite", alignSelf: "flex-start", maxWidth: "85%" }}>
              <div style={{
                background: "#e5e5ea", borderRadius: "18px 18px 18px 4px",
                padding: "10px 14px",
                fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#000", lineHeight: 1.4,
              }}>
                Bonjour Marie 👋<br/>Tu as <strong>9 tampons sur 10</strong> — plus qu&apos;un café pour ton prochain offert !
              </div>
              <div style={{ fontSize: 10, color: "#8e8e93", marginTop: 3, marginLeft: 6 }}>Lun 09:14</div>
            </div>

            <div style={{ animation: "smsSlide1 4s ease 0s infinite", alignSelf: "flex-start", maxWidth: "85%" }}>
              <div style={{
                background: "#e5e5ea", borderRadius: "18px 18px 18px 4px",
                padding: "10px 14px",
                fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#000", lineHeight: 1.4,
              }}>
                🥐 Ce weekend : <strong>−20% sur toutes nos viennoiseries.</strong> Valable sam & dim avec ta carte fidélité.
              </div>
              <div style={{ fontSize: 10, color: "#8e8e93", marginTop: 3, marginLeft: 6 }}>Ven 08:00</div>
            </div>

            <div style={{ animation: "smsSlide2 4s ease 0s infinite", alignSelf: "flex-start", maxWidth: "85%" }}>
              <div style={{
                background: "#e5e5ea", borderRadius: "18px 18px 18px 4px",
                padding: "10px 14px",
                fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#000", lineHeight: 1.4,
              }}>
                🎉 Ton <strong>café offert</strong> t&apos;attend ! Montre ce message à la caisse. Valable 7 jours.
              </div>
              <div style={{ fontSize: 10, color: "#8e8e93", marginTop: 3, marginLeft: 6 }}>Mar 10:30</div>
            </div>

            <div style={{ animation: "smsSlide3 4s ease 0s infinite", alignSelf: "flex-start", maxWidth: "85%", opacity: 0 }}>
              <div style={{
                background: "#e5e5ea", borderRadius: "18px 18px 18px 4px",
                padding: "10px 14px",
                fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#000", lineHeight: 1.4,
              }}>
                Nouveau : notre <strong>pain de la semaine</strong> 🍞 Le pain de seigle aux noix. En édition limitée.
              </div>
              <div style={{ fontSize: 10, color: "#8e8e93", marginTop: 3, marginLeft: 6 }}>Mer 07:45</div>
            </div>
          </div>

          {/* Input bar */}
          <div style={{
            marginTop: 16, display: "flex", alignItems: "center", gap: 8,
            background: "#fff", borderRadius: 20, padding: "8px 14px",
            border: "1px solid #e0e0e5",
          }}>
            <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 13, color: "#c7c7cc", flex: 1 }}>Message automatisé...</span>
            <div style={{ width: 28, height: 28, background: "#1d9e75", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
        {/* Home indicator */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
          <div style={{ width: 100, height: 4, background: "rgba(255,255,255,0.3)", borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    tag: "CARTE FIDÉLITÉ",
    title: "La carte que tes clients gardent vraiment.",
    text: "Fini les cartes papier perdues. Tes clients scannent un QR code et leurs tampons s'ajoutent en 3 secondes. Pas d'app à télécharger.",
    checks: ["QR code prêt à afficher en caisse", "Zéro application à installer"],
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=85",
    bg: "#fff", imgLeft: true,
    visual: null,
  },
  {
    tag: "SITE VITRINE",
    title: "Un site qui te représente vraiment.",
    text: "5 pages soignées avec tes horaires, photos, menu et carte fidélité — tout en un. Livré en 48h, sans que tu aies à faire quoi que ce soit.",
    checks: ["Design adapté à ton image", "Hébergement + domaine .ch inclus"],
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85",
    bg: "#FBF8F3", imgLeft: false,
    visual: null,
  },
  {
    tag: "SEO LOCAL",
    title: "Tes voisins te trouvent sur Google.",
    text: "On optimise ta présence locale pour que les gens du quartier te trouvent quand ils cherchent un café, une boulangerie ou un coiffeur près d'eux.",
    checks: ["Optimisation Google My Business", "Résultats visibles en 4 à 6 semaines"],
    img: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&q=85",
    bg: "#fff", imgLeft: true,
    visual: null,
  },
  {
    tag: "SOCLE NFC",
    title: "Gravé à ton nom. Chaque client, une expérience unique.",
    text: "Le socle NFC en bois est personnalisé avec le nom de ton commerce, gravé au laser. Tes clients posent leur téléphone — le tampon s'ajoute. Premium, durable, sans aucun effort.",
    checks: ["Bois naturel, gravure laser personnalisée", "Livré et installé avec le pack"],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85",
    bg: "#FBF8F3", imgLeft: false,
    visual: null,
  },
  {
    tag: "CAMPAGNES SMS",
    title: "Parle à tes clients quand tu veux.",
    text: "Configure une fois, et les messages partent automatiquement — rappel de tampon manquant, promo du weekend, récompense fidélité. Taux d'ouverture : 98%.",
    checks: ["1 campagne offerte dans le pack", "Taux d'ouverture SMS : 98%"],
    img: null,
    bg: "#fff", imgLeft: true,
    visual: "sms",
  },
  {
    tag: "TABLEAU DE BORD",
    title: "Des données simples pour de meilleures décisions.",
    text: "Combien de clients reviennent, à quelle fréquence, quels jours sont les plus fréquentés. Tout en un coup d'œil depuis ton tableau de bord.",
    checks: ["Tableau de bord en temps réel", "Rapport mensuel inclus dans le suivi"],
    img: null,
    bg: "#FBF8F3", imgLeft: false,
    visual: "dashboard",
  },
  {
    tag: "HÉBERGEMENT & DOMAINE",
    title: "Ton site hébergé, ton domaine .ch inclus.",
    text: "Pas de configuration, pas de surprise. L'hébergement de la première année et le domaine .ch sont inclus dans le pack Essentiel.",
    checks: ["Hébergement haute performance", "Renouvellement domaine 149 CHF/an"],
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=85",
    bg: "#fff", imgLeft: true,
    visual: null,
  },
];

export default function FeaturesPage() {
  return (
    <>
      <main style={{ paddingTop: 68 }}>
        {/* Header */}
        <section style={{ background: "#fff", padding: "80px 24px", textAlign: "center" }}>
          <span style={{
            display: "inline-block",
            background: "#E8F8F3", color: "#1d9e75",
            borderRadius: 50, padding: "6px 14px",
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 13, fontWeight: 500,
            marginBottom: 20,
          }}>Fonctionnalités</span>
          <h1 style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 900,
            fontSize: "clamp(36px, 5vw, 56px)",
            color: "#0f172a",
            lineHeight: 1.1,
            marginBottom: 20,
          }}>
            Tout ce qu&rsquo;il faut.<br />Rien de superflu.
          </h1>
          <p style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 18, color: "#64748b",
            maxWidth: 480, margin: "0 auto",
            lineHeight: 1.7,
          }}>
            Un seul outil qui fait le travail de trois.
          </p>
        </section>

        {/* Feature alternating sections */}
        {features.map((f, i) => (
          <section key={i} style={{ background: f.bg, padding: "120px 24px" }}>
            <div style={{
              maxWidth: 1200, margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 80,
              flexDirection: f.imgLeft ? "row" : "row-reverse",
            }}>
              {/* Visual */}
              <div style={{ flex: 1 }}>
                {f.visual === "sms" ? (
                  <SMSPhoneMockup />
                ) : f.visual === "dashboard" ? (
                  <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.08)" }}>
                    <DashboardMockup />
                  </div>
                ) : (
                  <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.08)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.img!}
                      alt={f.title}
                      width={600} height={400}
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
                    color: "#1d9e75", letterSpacing: "0.1em",
                    textTransform: "uppercase", margin: 0,
                  }}>{f.tag}</p>
                </div>
                <h2 style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontWeight: 700,
                  fontSize: "clamp(26px, 2.8vw, 38px)",
                  color: "#0f172a", lineHeight: 1.2, marginBottom: 20,
                }}>{f.title}</h2>
                <p style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: 16, color: "#64748b", lineHeight: 1.9, marginBottom: 24,
                }}>{f.text}</p>
                {f.checks.map(c => CHECK(c))}
              </div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section style={{ background: "#1d9e75", padding: "80px 24px", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 700,
            fontSize: "clamp(26px, 3.5vw, 44px)",
            color: "#fff", marginBottom: 32,
          }}>
            Tout ça pour 990 CHF.
          </h2>
          <Link href="https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20d%C3%A9marrer%20avec%20Stampify%20%28990%20CHF%29." style={{
            background: "#fff", color: "#1d9e75",
            borderRadius: 10, padding: "16px 32px",
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 16, fontWeight: 500,
            textDecoration: "none", display: "inline-block",
          }}>
            Démarrer maintenant →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
