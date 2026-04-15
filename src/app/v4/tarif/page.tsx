"use client";

import { useEffect, useRef, useState } from "react";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

const MAIN_FEATURES = [
  "Site vitrine 5 pages sur mesure",
  "Carte fidélité digitale 10 cases",
  "Plaquette NFC en bois gravée",
  "Domaine .ch + hébergement 1ère année",
  "SEO local optimisé",
  "QR code imprimable A4/A5",
  "1 campagne SMS offerte",
  "2 retouches incluses",
  "Guide vidéo d'utilisation",
  "Livraison en 48h garantie",
];

const ESSENTIEL_FEATURES = [
  "SMS manuels débloqués",
  "15+ triggers auto",
  "Rapport mensuel",
  "Mises à jour mineures",
  "Support email",
];

const PRO_FEATURES = [
  "Tout l'Essentiel",
  "2 campagnes SMS/mois rédigées",
  "Support prioritaire 4h",
  "Modifications avancées",
  "Revue trimestrielle",
];

const FAQS = [
  {
    q: "Est-ce que mes clients doivent télécharger une application ?",
    a: "Non. La carte s'ouvre directement dans Safari ou Chrome via QR code ou NFC.",
  },
  {
    q: "Que se passe-t-il après la première année ?",
    a: "Domaine ~25 CHF/an. Hébergement ~5 CHF/mois (offert la 1ère année). Carte fidélité et dashboard : à vie.",
  },
  {
    q: "Est-ce que je suis propriétaire du site ?",
    a: "Oui, à 100%. Code source, domaine, contenu — tout est à vous.",
  },
  {
    q: "Combien de temps pour mon site en ligne ?",
    a: "48h à partir de vos infos : photos, textes, horaires, couleurs. Garanti.",
  },
  {
    q: "Vous travaillez en France aussi ?",
    a: "Oui. Suisse romande et France. Contactez-nous pour en discuter.",
  },
  {
    q: "Quelle différence avec Poinz ?",
    a: "Poinz est gratuit mais tout reste sous leur marque. Avec Stampify : votre site, votre nom, votre relation client.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: "#ffffff",
        borderRadius: 12,
        padding: "20px 24px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: "#1a1a1a",
            lineHeight: 1.4,
          }}
        >
          {q}
        </span>
        <span
          style={{
            fontSize: 18,
            color: "#555555",
            flexShrink: 0,
            transition: "transform 0.25s ease",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ↓
        </span>
      </div>
      <div
        style={{
          maxHeight: open ? 300 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s ease",
        }}
      >
        <p
          style={{
            marginTop: 12,
            fontSize: 15,
            color: "#555555",
            lineHeight: 1.6,
            marginBottom: 0,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function TarifPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".fade-up");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .btn-green {
          display: inline-block;
          background: #1d9e75;
          color: #ffffff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 17px;
          border-radius: 980px;
          padding: 16px 32px;
          text-decoration: none;
          text-align: center;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .btn-green:hover {
          background: #17886a;
          transform: translateY(-1px);
        }
        .btn-outline {
          display: inline-block;
          background: transparent;
          color: #1a1a1a;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 17px;
          border-radius: 980px;
          padding: 16px 32px;
          text-decoration: none;
          text-align: center;
          border: 1.5px solid #1a1a1a;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .btn-outline:hover {
          background: rgba(26,26,26,0.05);
          transform: translateY(-1px);
        }
        .btn-white {
          display: inline-block;
          background: #ffffff;
          color: #1a1a1a;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 17px;
          border-radius: 980px;
          padding: 16px 32px;
          text-decoration: none;
          text-align: center;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .btn-white:hover {
          background: #f0f0f0;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Hero */}
      <section
        style={{
          background: "#fafaf8",
          padding: "120px 20px 80px",
          textAlign: "center",
        }}
      >
        <div className="fade-up" style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#1a1a1a",
              lineHeight: 1.05,
              marginBottom: 20,
            }}
          >
            Un seul paiement.
          </h1>
          <p
            style={{
              fontSize: 21,
              color: "#555555",
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            Simple, transparent, et définitif.
          </p>
        </div>
      </section>

      {/* Main Pricing Card */}
      <section
        style={{
          background: "#f4f4f2",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >
        <div
          className="fade-up"
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: 48,
            maxWidth: 580,
            margin: "0 auto",
            boxShadow: "0 8px 48px rgba(0,0,0,0.08)",
          }}
        >
          {/* Badge */}
          <div style={{ marginBottom: 32 }}>
            <span
              style={{
                display: "inline-block",
                background: "#e8f7f2",
                color: "#1d9e75",
                borderRadius: 980,
                padding: "6px 18px",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              ✦ LE CHOIX DE NOS CLIENTS
            </span>
          </div>

          {/* Price */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 96,
                fontWeight: 800,
                letterSpacing: "-4px",
                color: "#1a1a1a",
                lineHeight: 1,
              }}
            >
              990
            </span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: "#555555",
                letterSpacing: "-0.02em",
              }}
            >
              CHF
            </span>
          </div>
          <p
            style={{
              fontSize: 15,
              color: "#555555",
              marginBottom: 32,
            }}
          >
            paiement unique · aucun abonnement
          </p>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "#f4f4f2",
              marginBottom: 32,
            }}
          />

          {/* Features */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 32,
              textAlign: "left",
            }}
          >
            {MAIN_FEATURES.map((f) => (
              <div
                key={f}
                style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
              >
                <span
                  style={{
                    color: "#1d9e75",
                    fontWeight: 700,
                    fontSize: 15,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{ fontSize: 15, color: "#1a1a1a", fontWeight: 500, lineHeight: 1.5 }}
                >
                  {f}
                </span>
              </div>
            ))}
          </div>

          {/* Context box */}
          <div
            style={{
              background: "#f4f4f2",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 32,
              textAlign: "left",
            }}
          >
            <p style={{ fontSize: 14, color: "#555555", lineHeight: 1.6 }}>
              Une agence suisse facture 1 500–5 000 CHF pour un site seul. Stampify livre site + carte + NFC + SEO. Pour 990 CHF. En 48h.
            </p>
          </div>

          {/* CTA */}
          <a href={WA_MAIN} className="btn-green" style={{ width: "100%", display: "block" }}>
            Obtenir mon site — 990 CHF
          </a>
        </div>
      </section>

      {/* Add-ons Section */}
      <section
        style={{
          background: "#fafaf8",
          padding: "60px 20px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            className="fade-up"
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#1a1a1a",
              textAlign: "center",
              marginBottom: 40,
              letterSpacing: "-0.02em",
            }}
          >
            Options supplémentaires
          </h2>

          <p
            className="fade-up"
            style={{
              fontSize: 13,
              color: "#555555",
              textAlign: "center",
              marginBottom: 20,
              letterSpacing: "0.02em",
            }}
          >
            — Suivi mensuel optionnel —
          </p>

          <div
            className="fade-up"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            {/* Essentiel */}
            <div
              style={{
                flex: "1 1 260px",
                background: "#f4f4f2",
                borderRadius: 16,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  marginBottom: 4,
                  letterSpacing: "-0.02em",
                }}
              >
                49 CHF / mois
              </p>
              <p style={{ fontSize: 12, color: "#555555", marginBottom: 20 }}>
                Sans engagement
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                {ESSENTIEL_FEATURES.map((f) => (
                  <div
                    key={f}
                    style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                  >
                    <span
                      style={{
                        color: "#1d9e75",
                        fontWeight: 700,
                        fontSize: 14,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      ✓
                    </span>
                    <span style={{ fontSize: 14, color: "#1a1a1a", lineHeight: 1.5 }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <a href={WA_MAIN} className="btn-outline" style={{ textAlign: "center" }}>
                Choisir Essentiel
              </a>
            </div>

            {/* Pro */}
            <div
              style={{
                flex: "1 1 260px",
                background: "#1a1a1a",
                borderRadius: 16,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 0,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  background: "transparent",
                  color: "#f5a623",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                RECOMMANDÉ
              </span>
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: 4,
                  letterSpacing: "-0.02em",
                }}
              >
                79 CHF / mois
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>
                Sans engagement
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                {PRO_FEATURES.map((f) => (
                  <div
                    key={f}
                    style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                  >
                    <span
                      style={{
                        color: "#1d9e75",
                        fontWeight: 700,
                        fontSize: 14,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      ✓
                    </span>
                    <span style={{ fontSize: 14, color: "#ffffff", lineHeight: 1.5 }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <a href={WA_MAIN} className="btn-white" style={{ textAlign: "center" }}>
                Choisir Pro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        style={{
          background: "#f4f4f2",
          padding: "80px 20px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            className="fade-up"
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#1a1a1a",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Questions fréquentes.
          </h2>
          <div
            className="fade-up"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              maxWidth: 720,
              margin: "0 auto",
            }}
          >
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section
        style={{
          background: "#1a1a1a",
          padding: "120px 20px",
          textAlign: "center",
        }}
      >
        <div className="fade-up" style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              marginBottom: 36,
              lineHeight: 1.05,
            }}
          >
            Lancez-vous.
          </h2>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <a href={WA_MAIN} className="btn-green">
              Obtenir mon site — 990 CHF
            </a>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.4)",
              marginTop: 16,
            }}
          >
            📱 Réponse sous 2h · 7j/7
          </p>
        </div>
      </section>
    </>
  );
}
