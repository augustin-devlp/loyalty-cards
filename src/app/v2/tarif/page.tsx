"use client";

import { useEffect, useState } from "react";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";
const WA_ESSENTIEL =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20activer%20l%27add-on%20Essentiel%20%2849%20CHF%2Fmois%29%20pour%20mon%20site%20Stampify.";
const WA_PRO =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20activer%20l%27add-on%20Pro%20%2879%20CHF%2Fmois%29%20pour%20mon%20site%20Stampify.";

/* ─── Feature check item ─── */
function Check({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
      <span style={{ color: "#1d9e75", fontSize: "16px", lineHeight: "1.6", flexShrink: 0 }}>✓</span>
      <span style={{ fontSize: "15px", color: "#1d1d1f", lineHeight: "1.6" }}>{text}</span>
    </div>
  );
}

/* ─── FAQ Accordion ─── */
const FAQ_ITEMS = [
  {
    q: "Est-ce que le 990 CHF est vraiment tout inclus ?",
    a: "Oui. Site, domaine .ch, hébergement première année, carte fidélité, plaquette NFC gravée, SEO, QR code et guide vidéo. Aucun frais caché.",
  },
  {
    q: "Je garde mon site si je résilie ?",
    a: "Votre site vous appartient à 100%. Vous pouvez le transférer chez n'importe quel hébergeur. Aucune dépendance à Stampify.",
  },
  {
    q: "Les add-ons sont-ils obligatoires ?",
    a: "Non. Le forfait 990 CHF est complet sans add-on. Les add-ons (49 ou 79 CHF/mois) débloquent les SMS automatiques, les campagnes mensuelles et le support prioritaire.",
  },
  {
    q: "Combien de temps faut-il vraiment ?",
    a: "48 heures en général. Parfois moins. Nous commençons dès votre premier message WhatsApp.",
  },
  {
    q: "Je ne suis pas à l'aise avec la technologie. C'est un problème ?",
    a: "Pas du tout. On s'occupe de tout. Vous recevez votre site clé en main, avec un guide vidéo de 5 minutes pour gérer les mises à jour simples.",
  },
  {
    q: "Que se passe-t-il après la première année d'hébergement ?",
    a: "L'hébergement est d'environ 100–150 CHF/an après la première année offerte. Vous pouvez aussi transférer le site ailleurs si vous préférez.",
  },
];

function AccordionItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={onToggle}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <span style={{ fontSize: "17px", fontWeight: 600, color: "#1d1d1f", lineHeight: 1.4 }}>{q}</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            flexShrink: 0,
            transition: "transform 0.3s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: "#6e6e73",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? "400px" : "0px",
          transition: "max-height 0.3s ease",
        }}
      >
        <p
          style={{
            marginTop: "14px",
            fontSize: "16px",
            color: "#6e6e73",
            lineHeight: 1.6,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function TarifPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const mainFeatures = [
    "Site vitrine 5 pages",
    "Carte fidélité 10 cases",
    "Plaquette NFC gravée",
    "Domaine .ch + hébergement 1ère année",
    "SEO local complet",
    "QR code A4/A5",
    "1 campagne SMS offerte",
    "2 retouches incluses",
    "Guide vidéo",
    "Livraison 48h garantie",
  ];

  const essentielFeatures = [
    "5 SMS automatiques",
    "1 campagne SMS / mois",
    "Statistiques basiques",
    "Support email",
  ];

  const proFeatures = [
    "15 SMS automatiques",
    "Campagnes illimitées",
    "Statistiques avancées",
    "Support prioritaire WhatsApp",
    "Retouches mensuelles incluses",
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="fade-up"
        style={{
          background: "#ffffff",
          padding: "140px 20px 120px",
          textAlign: "center",
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .hero-title-tarif { font-size: 44px !important; }
            .price-number { font-size: 60px !important; }
            .pricing-card-inner { padding: 32px 24px !important; }
            .features-grid { grid-template-columns: 1fr !important; }
            .addon-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <h1
            className="hero-title-tarif"
            style={{
              fontSize: "72px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#1d1d1f",
              lineHeight: 1.05,
              marginBottom: "24px",
            }}
          >
            Un seul paiement.<br />Pour toujours.
          </h1>
          <p
            style={{
              fontSize: "21px",
              color: "#6e6e73",
              maxWidth: "640px",
              margin: "0 auto",
              lineHeight: 1.5,
            }}
          >
            Propriétaire à 100%. Aucun engagement. Livraison garantie en 48h.
          </p>
        </div>
      </section>

      {/* ── Pricing card ── */}
      <section
        className="fade-up"
        style={{
          background: "#ffffff",
          padding: "0 20px 120px",
        }}
      >
        <div
          className="pricing-card-inner"
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: "24px",
            padding: "48px",
            boxShadow: "0 2px 40px rgba(0,0,0,0.08)",
          }}
        >
          {/* Badge */}
          <div style={{ marginBottom: "28px", textAlign: "center" }}>
            <span
              style={{
                display: "inline-block",
                background: "#e6f7f1",
                color: "#1d9e75",
                borderRadius: "980px",
                padding: "6px 16px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Le choix de nos clients
            </span>
          </div>

          {/* Price */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              className="price-number"
              style={{
                fontSize: "80px",
                fontWeight: 700,
                letterSpacing: "-3px",
                color: "#1d1d1f",
                lineHeight: 1,
              }}
            >
              990
            </div>
            <div
              style={{
                fontSize: "17px",
                color: "#6e6e73",
                marginTop: "8px",
              }}
            >
              CHF · paiement unique · aucun abonnement
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#f5f5f7", margin: "28px 0" }} />

          {/* Features 2-col grid */}
          <div
            className="features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px 24px",
              marginBottom: "28px",
            }}
          >
            {mainFeatures.map((f, i) => (
              <Check key={i} text={f} />
            ))}
          </div>

          {/* Comparatif box */}
          <div
            style={{
              background: "#f5f5f7",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "28px",
            }}
          >
            <p style={{ fontSize: "14px", color: "#6e6e73", lineHeight: 1.7, margin: 0 }}>
              Une agence suisse facture 1 500–5 000 CHF pour un site seul. Stampify livre site + carte + NFC + SEO.{" "}
              <strong style={{ color: "#1d1d1f" }}>Pour 990 CHF. En 48h.</strong>
            </p>
          </div>

          {/* Main CTA */}
          <a
            href={WA_MAIN}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              width: "100%",
              background: "#1d1d1f",
              color: "#ffffff",
              borderRadius: "980px",
              padding: "16px 28px",
              fontSize: "17px",
              fontWeight: 500,
              textDecoration: "none",
              textAlign: "center",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Obtenir mon site — 990 CHF
          </a>

          {/* Separator */}
          <div
            style={{
              textAlign: "center",
              margin: "40px 0 32px",
              fontSize: "13px",
              color: "#6e6e73",
              letterSpacing: "0.02em",
            }}
          >
            ━━━ VOUS POUVEZ AUSSI AJOUTER UN SUIVI MENSUEL ━━━
          </div>

          {/* Add-on cards */}
          <div
            className="addon-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {/* Essentiel */}
            <div
              style={{
                background: "#f5f5f7",
                borderRadius: "18px",
                padding: "28px 24px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#6e6e73", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>
                Essentiel
              </div>
              <div style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-1px", color: "#1d1d1f", lineHeight: 1 }}>
                49
              </div>
              <div style={{ fontSize: "13px", color: "#6e6e73", marginBottom: "20px" }}>CHF / mois</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                {essentielFeatures.map((f, i) => (
                  <Check key={i} text={f} />
                ))}
              </div>
              <a
                href={WA_ESSENTIEL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  color: "#0071e3",
                  border: "1px solid #0071e3",
                  borderRadius: "980px",
                  padding: "12px 20px",
                  fontSize: "15px",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#0071e3"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0071e3"; }}
              >
                Activer
              </a>
            </div>

            {/* Pro */}
            <div
              style={{
                background: "#1d1d1f",
                borderRadius: "18px",
                padding: "28px 24px",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#f5a623",
                  color: "#ffffff",
                  borderRadius: "980px",
                  padding: "4px 12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Recommandé
              </span>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>
                Pro
              </div>
              <div style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-1px", color: "#ffffff", lineHeight: 1 }}>
                79
              </div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>CHF / mois</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                {proFeatures.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ color: "#1d9e75", fontSize: "16px", lineHeight: "1.6", flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.85)", lineHeight: "1.6" }}>{f}</span>
                  </div>
                ))}
              </div>
              <a
                href={WA_PRO}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  background: "#ffffff",
                  color: "#1d1d1f",
                  borderRadius: "980px",
                  padding: "12px 20px",
                  fontSize: "15px",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Activer
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        className="fade-up"
        style={{
          background: "#f5f5f7",
          padding: "100px 20px",
        }}
      >
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "48px",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "#1d1d1f",
              lineHeight: 1.1,
              marginBottom: "48px",
              textAlign: "center",
            }}
          >
            Questions fréquentes.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                q={item.q}
                a={item.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA bottom ── */}
      <section
        className="fade-up"
        style={{
          background: "#ffffff",
          padding: "100px 20px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "21px",
            color: "#6e6e73",
            marginBottom: "32px",
            maxWidth: "500px",
            margin: "0 auto 32px",
          }}
        >
          Prêt à lancer votre site en 48h ?
        </p>
        <a
          href={WA_MAIN}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "#1d1d1f",
            color: "#ffffff",
            borderRadius: "980px",
            padding: "14px 28px",
            fontSize: "17px",
            fontWeight: 500,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Obtenir mon site — 990 CHF
        </a>
      </section>
    </>
  );
}
