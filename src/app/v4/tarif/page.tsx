"use client";

import { useEffect, useRef, useState } from "react";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

const MAIN_FEATURES = [
  "Site vitrine 5 pages sur mesure",
  "Carte fidélité digitale 10 cases",
  "Plaquette NFC en bois gravée à votre nom",
  "Domaine .ch + hébergement 1ère année",
  "SEO local optimisé",
  "QR code imprimable A4/A5",
  "1 campagne SMS offerte",
  "2 retouches incluses",
  "Guide vidéo d'utilisation",
  "Livraison en 48h garantie",
];

const ESSENTIEL_FEATURES = [
  "Campagnes SMS manuelles",
  "15+ SMS automatiques",
  "Rapport mensuel",
  "Mises à jour mineures",
  "Support email",
];

const PRO_FEATURES = [
  "Tout l'Essentiel",
  "2 campagnes SMS/mois rédigées par nous",
  "Support prioritaire sous 4h",
  "Modifications avancées",
  "Revue stratégique trimestrielle",
];

const FAQS = [
  {
    q: "Est-ce que mes clients doivent télécharger une application ?",
    a: "Non. La carte s'ouvre directement dans Safari ou Chrome via QR code ou NFC. Aucun téléchargement, aucun compte.",
  },
  {
    q: "Que se passe-t-il après la première année ?",
    a: "Domaine .ch ~25 CHF/an. Hébergement ~5 CHF/mois offert la 1ère année. Carte et dashboard : à vie. Aucun abonnement imposé.",
  },
  {
    q: "Est-ce que je suis propriétaire du site ?",
    a: "Oui, à 100%. Code source, domaine, contenu — tout est à vous. Liberté totale.",
  },
  {
    q: "Combien de temps pour mon site en ligne ?",
    a: "48h à partir de vos infos : photos, textes, horaires, couleurs. Garanti sans exception.",
  },
  {
    q: "Vous travaillez en France aussi ?",
    a: "Oui. Suisse romande et France. Même forfait, mêmes délais, même qualité.",
  },
  {
    q: "Quelle différence avec Poinz ?",
    a: "Poinz est gratuit mais tout reste sous leur marque. Avec Stampify : votre site, votre nom, votre relation client. 100% personnalisé.",
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
        marginBottom: 0,
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
            color: "#1A1A1A",
            lineHeight: 1.4,
          }}
        >
          {q}
        </span>
        <span
          style={{
            fontSize: 18,
            color: "#5C5C5C",
            flexShrink: 0,
            transition: "transform 0.3s ease",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ↓
        </span>
      </div>
      <div
        style={{
          maxHeight: open ? 400 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <p
          style={{
            marginTop: 12,
            fontSize: 16,
            color: "#5C5C5C",
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          margin: 0;
          padding: 0;
          background: #FBF8F3;
          color: #1A1A1A;
        }

        .fade-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .feature-fade {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .btn-green-pill {
          display: block;
          width: 100%;
          background: #1d9e75;
          color: #ffffff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 17px;
          border-radius: 980px;
          padding: 18px 32px;
          text-decoration: none;
          text-align: center;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .btn-green-pill:hover {
          background: #17886a;
          transform: translateY(-1px);
        }

        .btn-green-large {
          display: inline-block;
          background: #1d9e75;
          color: #ffffff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 18px;
          border-radius: 980px;
          padding: 20px 48px;
          text-decoration: none;
          text-align: center;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .btn-green-large:hover {
          background: #17886a;
          transform: translateY(-1px);
        }

        .btn-outline-dark {
          display: block;
          width: 100%;
          background: transparent;
          color: #1A1A1A;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 16px;
          border-radius: 980px;
          padding: 14px 24px;
          text-decoration: none;
          text-align: center;
          border: 1.5px solid #1A1A1A;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .btn-outline-dark:hover {
          background: rgba(26,26,26,0.05);
          transform: translateY(-1px);
        }

        .btn-white-pill {
          display: block;
          width: 100%;
          background: #ffffff;
          color: #1A1A1A;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 16px;
          border-radius: 980px;
          padding: 14px 24px;
          text-decoration: none;
          text-align: center;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
        }
        .btn-white-pill:hover {
          background: #f0f0f0;
          transform: translateY(-1px);
        }

        .addon-cards {
          display: flex;
          gap: 16px;
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: clamp(38px, 10vw, 56px) !important;
          }
          .hero-subtitle {
            font-size: 17px !important;
          }
          .main-card {
            padding: 32px 24px !important;
          }
          .price-number {
            font-size: 72px !important;
          }
          .price-currency {
            font-size: 22px !important;
          }
          .addon-cards {
            flex-direction: column;
          }
          .faq-title {
            font-size: 36px !important;
          }
          .cta-title {
            font-size: 36px !important;
          }
          .cta-subtitle {
            font-size: 17px !important;
          }
          .btn-green-large {
            padding: 18px 32px !important;
            font-size: 17px !important;
          }
          .section-hero {
            padding: 80px 20px 60px !important;
          }
          .section-main-card {
            padding: 0 16px 60px !important;
          }
          .section-faq {
            padding: 60px 16px !important;
          }
          .section-cta-bottom {
            padding: 60px 16px !important;
          }
        }
      `}</style>

      {/* HERO */}
      <section
        className="section-hero"
        style={{
          background: "#FBF8F3",
          padding: "120px 20px 80px",
          textAlign: "center",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div className="fade-up" style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Badge */}
          <div style={{ marginBottom: 28 }}>
            <span
              style={{
                display: "inline-block",
                background: "#E8F7F2",
                color: "#1d9e75",
                borderRadius: 980,
                padding: "8px 20px",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.01em",
              }}
            >
              ✦ Paiement unique · Aucun abonnement
            </span>
          </div>

          {/* Title */}
          <h1
            className="hero-title"
            style={{
              fontSize: "clamp(48px, 7vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#1A1A1A",
              lineHeight: 1.05,
              margin: "0 0 20px 0",
            }}
          >
            Un seul paiement.
            <br />
            Pour toujours.
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle"
            style={{
              fontSize: 21,
              color: "#5C5C5C",
              fontWeight: 400,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Propriétaire à 100%. Aucun engagement. Livraison garantie en 48h.
          </p>
        </div>
      </section>

      {/* MAIN CARD */}
      <section
        className="section-main-card"
        style={{
          background: "#FBF8F3",
          padding: "0 20px 80px",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div
          className="main-card fade-up"
          style={{
            maxWidth: 580,
            margin: "0 auto",
            background: "#ffffff",
            borderRadius: 24,
            padding: "48px 40px",
            boxShadow: "0 8px 48px rgba(0,0,0,0.08)",
          }}
        >
          {/* Badge */}
          <div style={{ textAlign: "center", marginBottom: 0 }}>
            <span
              style={{
                display: "inline-block",
                background: "#E8F7F2",
                color: "#1d9e75",
                borderRadius: 980,
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 500,
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
              marginTop: 16,
            }}
          >
            <span
              className="price-number"
              style={{
                fontSize: 96,
                fontWeight: 800,
                letterSpacing: "-4px",
                color: "#1A1A1A",
                lineHeight: 1,
              }}
            >
              990
            </span>
            <span
              className="price-currency"
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: "#5C5C5C",
              }}
            >
              CHF
            </span>
          </div>

          <p
            style={{
              fontSize: 15,
              color: "#5C5C5C",
              textAlign: "center",
              marginTop: 8,
              marginBottom: 0,
            }}
          >
            paiement unique · aucun abonnement
          </p>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "#F2EFE9",
              margin: "24px 0",
            }}
          />

          {/* Features with stagger */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              textAlign: "left",
            }}
          >
            {MAIN_FEATURES.map((feature, i) => (
              <div
                key={feature}
                className="feature-fade fade-up"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  transitionDelay: `${i * 0.05}s`,
                }}
              >
                <span
                  style={{
                    color: "#1d9e75",
                    fontWeight: 700,
                    fontSize: 16,
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontSize: 16,
                    color: "#1A1A1A",
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Comparatif block */}
          <div
            style={{
              background: "#F2EFE9",
              borderRadius: 12,
              padding: "16px 20px",
              marginTop: 24,
            }}
          >
            <p
              style={{
                fontSize: 14,
                color: "#5C5C5C",
                fontStyle: "italic",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Une agence suisse facture 1 500–5 000 CHF pour un site seul.
              Stampify livre site + carte + NFC + SEO. Pour 990 CHF. En 48h.
            </p>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 32 }}>
            <a href={WA_MAIN} className="btn-green-pill">
              Obtenir mon site — 990 CHF
            </a>
          </div>

          {/* Separator */}
          <p
            style={{
              fontSize: 13,
              color: "#5C5C5C",
              textAlign: "center",
              marginTop: 32,
              marginBottom: 0,
            }}
          >
            ─── Suivi mensuel optionnel ───
          </p>

          {/* Add-on cards */}
          <div className="addon-cards" style={{ marginTop: 20 }}>
            {/* ESSENTIEL */}
            <div
              style={{
                flex: 1,
                background: "#F2EFE9",
                borderRadius: 16,
                padding: 28,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  margin: "0 0 4px 0",
                  letterSpacing: "-0.02em",
                }}
              >
                49 CHF / mois
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "#5C5C5C",
                  margin: "0 0 20px 0",
                }}
              >
                Sans engagement · résiliable à tout moment
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 24,
                  flex: 1,
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
                    <span
                      style={{
                        fontSize: 14,
                        color: "#1A1A1A",
                        lineHeight: 1.5,
                      }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <a href={WA_MAIN} className="btn-outline-dark">
                Ajouter l'Essentiel
              </a>
            </div>

            {/* PRO */}
            <div
              style={{
                flex: 1,
                background: "#1A1A1A",
                borderRadius: 16,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* RECOMMANDÉ badge */}
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    background: "#1d9e75",
                    color: "#ffffff",
                    borderRadius: 980,
                    padding: "4px 12px",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}
                >
                  RECOMMANDÉ
                </span>
              </div>

              <p
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: "0 0 4px 0",
                  letterSpacing: "-0.02em",
                }}
              >
                79 CHF / mois
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  margin: "0 0 20px 0",
                }}
              >
                Sans engagement
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginBottom: 24,
                  flex: 1,
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
                    <span
                      style={{
                        fontSize: 14,
                        color: "#ffffff",
                        lineHeight: 1.5,
                      }}
                    >
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <a href={WA_MAIN} className="btn-white-pill">
                Ajouter le Pro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section
        className="section-faq"
        style={{
          background: "#FBF8F3",
          padding: "80px 20px",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2
            className="faq-title fade-up"
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#1A1A1A",
              textAlign: "center",
              marginBottom: 40,
              marginTop: 0,
            }}
          >
            Questions fréquentes.
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section
        className="section-cta-bottom"
        style={{
          background: "#1A1A1A",
          padding: "80px 20px",
          textAlign: "center",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div className="fade-up" style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2
            className="cta-title"
            style={{
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              margin: "0 0 16px 0",
              lineHeight: 1.1,
            }}
          >
            Votre commerce mérite d'être en ligne.
          </h2>
          <p
            className="cta-subtitle"
            style={{
              fontSize: 19,
              color: "rgba(255,255,255,0.55)",
              margin: "0 0 40px 0",
              lineHeight: 1.5,
            }}
          >
            990 CHF. 48h. Propriétaire à 100%.
          </p>
          <a href={WA_MAIN} className="btn-green-large">
            Obtenir mon site — 990 CHF
          </a>
        </div>
      </section>
    </>
  );
}
