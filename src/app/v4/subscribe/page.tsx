"use client";

import { useEffect, useRef } from "react";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

const STARTER_FEATURES = [
  "Site web professionnel",
  "Carte fidélité digitale",
  "Menu QR code",
  "Réservations en ligne",
  "1 mois SMS offert",
  "Tableau de bord",
  "Hébergement 1 an",
  "SSL inclus",
  "Domaine inclus",
  "Support 7j/7",
  "Livraison 48h",
  "1 mise à jour/mois",
];

const PRO_EXTRA = [
  "Mises à jour illimitées",
  "SMS mensuel inclus",
  "Priorité support",
  "Nouvelles fonctions automatiques",
];

const NFC_EXTRA = [
  "3 cartes NFC personnalisées",
  "Livraison sous 5 jours",
];

const ADDONS = [
  {
    name: "NFC Cards",
    description: "3 cartes NFC personnalisées",
    price: "+199 CHF",
  },
  {
    name: "Pack SMS",
    description: "500 SMS supplémentaires/mois",
    price: "+49 CHF/mois",
  },
  {
    name: "Maintenance",
    description: "Mises à jour mensuelles",
    price: "+79 CHF/mois",
  },
];

function FeatureItem({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
      }}
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
      <span style={{ fontSize: 14, color: "#1a1a1a", fontWeight: 500, lineHeight: 1.5 }}>
        {text}
      </span>
    </div>
  );
}

export default function SubscribePage() {
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .fade-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .plan-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .plan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 48px rgba(0,0,0,0.12) !important;
        }
        .addon-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .addon-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .cta-btn {
          display: inline-block;
          background: #1d9e75;
          color: #ffffff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          border-radius: 999px;
          padding: 14px 28px;
          text-decoration: none;
          text-align: center;
          transition: background 0.2s ease, transform 0.2s ease;
          cursor: pointer;
          border: none;
          width: 100%;
          margin-top: auto;
        }
        .cta-btn:hover {
          background: #179168;
          transform: translateY(-1px);
        }
        .cta-btn-dark {
          display: inline-block;
          background: #1d9e75;
          color: #ffffff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 17px;
          border-radius: 999px;
          padding: 18px 40px;
          text-decoration: none;
          text-align: center;
          transition: background 0.2s ease, transform 0.2s ease;
          max-width: 400px;
          width: 100%;
        }
        .cta-btn-dark:hover {
          background: #179168;
          transform: translateY(-1px);
        }
        @media (max-width: 860px) {
          .plans-grid {
            flex-direction: column !important;
            align-items: center !important;
          }
          .plan-card-wrap {
            max-width: 480px !important;
            width: 100% !important;
          }
        }
      `}</style>

      {/* Hero */}
      <section
        style={{
          background: "#fafaf8",
          padding: "140px 24px 80px",
          textAlign: "center",
        }}
      >
        <div
          className="fade-up"
          style={{ maxWidth: 860, margin: "0 auto" }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#1a1a1a",
              lineHeight: 1.05,
              marginBottom: 20,
            }}
          >
            Choisissez votre formule.
          </h1>
          <p
            style={{
              fontSize: 21,
              color: "#555555",
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            Commencez en 48h. Résiliez quand vous voulez.
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <section
        style={{
          background: "#f4f4f2",
          padding: "80px 24px",
        }}
      >
        <div
          className="plans-grid"
          style={{
            maxWidth: 860,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {/* Card 1 — Starter */}
          <div
            className="fade-up plan-card plan-card-wrap"
            style={{
              flex: "1 1 240px",
              maxWidth: 268,
              background: "#ffffff",
              borderRadius: 20,
              padding: 32,
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#555555",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              Starter
            </p>
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#1a1a1a",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              990{" "}
              <span style={{ fontSize: 22, fontWeight: 700 }}>CHF</span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#555555",
                marginBottom: 24,
              }}
            >
              Paiement unique
            </p>
            <div
              style={{
                height: 1,
                background: "rgba(0,0,0,0.08)",
                marginBottom: 20,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                flex: 1,
                marginBottom: 28,
              }}
            >
              {STARTER_FEATURES.map((f) => (
                <FeatureItem key={f} text={f} />
              ))}
            </div>
            <a href={WA_MAIN} className="cta-btn">
              Obtenir mon site →
            </a>
          </div>

          {/* Card 2 — Pro (featured) */}
          <div
            className="fade-up plan-card plan-card-wrap"
            style={{
              flex: "1 1 240px",
              maxWidth: 268,
              background: "#ffffff",
              borderRadius: 20,
              padding: 32,
              boxShadow: "0 4px 32px rgba(29,158,117,0.18)",
              border: "2px solid #1d9e75",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Badge */}
            <div
              style={{
                position: "absolute",
                top: -16,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#1d9e75",
                color: "#ffffff",
                borderRadius: 999,
                padding: "5px 18px",
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
              }}
            >
              Recommandé
            </div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#1d9e75",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 12,
                marginTop: 8,
              }}
            >
              Pro
            </p>
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#1a1a1a",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              990{" "}
              <span style={{ fontSize: 22, fontWeight: 700 }}>CHF</span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#1d9e75",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              + 79 CHF/mois
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#555555",
                marginBottom: 24,
              }}
            >
              Paiement initial + maintenance
            </p>
            <div
              style={{
                height: 1,
                background: "rgba(0,0,0,0.08)",
                marginBottom: 20,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                flex: 1,
                marginBottom: 28,
              }}
            >
              {STARTER_FEATURES.map((f) => (
                <FeatureItem key={f} text={f} />
              ))}
              {PRO_EXTRA.map((f) => (
                <FeatureItem key={f} text={f} />
              ))}
            </div>
            <a href={WA_MAIN} className="cta-btn">
              Choisir Pro →
            </a>
          </div>

          {/* Card 3 — NFC Pack */}
          <div
            className="fade-up plan-card plan-card-wrap"
            style={{
              flex: "1 1 240px",
              maxWidth: 268,
              background: "#ffffff",
              borderRadius: 20,
              padding: 32,
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#555555",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              NFC Pack
            </p>
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#1a1a1a",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              990{" "}
              <span style={{ fontSize: 18, fontWeight: 700 }}>CHF</span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#1d9e75",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              + 199 CHF
            </p>
            <p
              style={{
                fontSize: 13,
                color: "#555555",
                marginBottom: 24,
              }}
            >
              Pack complet
            </p>
            <div
              style={{
                height: 1,
                background: "rgba(0,0,0,0.08)",
                marginBottom: 20,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                flex: 1,
                marginBottom: 28,
              }}
            >
              {STARTER_FEATURES.map((f) => (
                <FeatureItem key={f} text={f} />
              ))}
              {NFC_EXTRA.map((f) => (
                <FeatureItem key={f} text={f} />
              ))}
            </div>
            <a href={WA_MAIN} className="cta-btn">
              Obtenir le Pack →
            </a>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section
        style={{
          background: "#fafaf8",
          padding: "60px 24px",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2
            className="fade-up"
            style={{
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#1a1a1a",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Options à la carte
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              justifyContent: "center",
            }}
          >
            {ADDONS.map((addon) => (
              <div
                key={addon.name}
                className="fade-up addon-card"
                style={{
                  background: "#ffffff",
                  borderRadius: 16,
                  padding: 28,
                  border: "1px solid rgba(0,0,0,0.08)",
                  flex: "1 1 220px",
                  maxWidth: 260,
                }}
              >
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    marginBottom: 6,
                  }}
                >
                  {addon.name}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "#555555",
                    marginBottom: 16,
                    lineHeight: 1.5,
                  }}
                >
                  {addon.description}
                </p>
                <p
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: "#1d9e75",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {addon.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section
        style={{
          background: "#1a1a1a",
          padding: "120px 24px",
          textAlign: "center",
        }}
      >
        <div
          className="fade-up"
          style={{ maxWidth: 860, margin: "0 auto" }}
        >
          <h2
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              marginBottom: 40,
              lineHeight: 1.05,
            }}
          >
            Lancez-vous.
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <a href={WA_MAIN} className="cta-btn-dark">
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
