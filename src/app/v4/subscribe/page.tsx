"use client";

import { useEffect, useRef } from "react";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

const WA_DEVIS =
  "https://wa.me/41791342997?text=Je%20souhaite%20un%20devis%20personnalis%C3%A9%20Stampify";

const FORFAIT_FEATURES = [
  "Site vitrine",
  "Carte fidélité",
  "Plaquette NFC",
  "Domaine .ch",
  "SEO local",
  "Menu QR",
  "Réservations",
  "1 SMS offert",
  "Hébergement 1 an",
  "Support 7j/7",
  "Livraison 48h",
  "2 retouches",
];

const SUR_MESURE_FEATURES = [
  "Volume multi-sites",
  "NFC avancé",
  "Intégrations",
  "Support dédié",
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

function FeatureRow({
  text,
  dark = false,
}: {
  text: string;
  dark?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
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
        style={{
          fontSize: 15,
          color: dark ? "rgba(255,255,255,0.85)" : "#1a1a1a",
          fontWeight: 500,
          lineHeight: 1.5,
        }}
      >
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
            Votre site à vie.
          </h1>
          <p
            style={{
              fontSize: 21,
              color: "#555555",
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            Commencez en 48h.
          </p>
        </div>
      </section>

      {/* Section 1 — Formules */}
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
            Choisissez votre formule.
          </h2>

          <div
            className="fade-up"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              justifyContent: "center",
              maxWidth: 760,
              margin: "0 auto",
            }}
          >
            {/* Card 1 — Forfait Complet */}
            <div
              style={{
                flex: "1 1 320px",
                background: "#ffffff",
                borderRadius: 20,
                padding: 40,
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
                  marginBottom: 16,
                }}
              >
                Forfait Complet
              </p>
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#1a1a1a",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                990 CHF
              </div>
              <p style={{ fontSize: 14, color: "#555555", marginBottom: 24 }}>
                Paiement unique · Tout inclus
              </p>
              <div
                style={{
                  height: 1,
                  background: "#f4f4f2",
                  marginBottom: 24,
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  flex: 1,
                  marginBottom: 28,
                }}
              >
                {FORFAIT_FEATURES.map((f) => (
                  <FeatureRow key={f} text={f} />
                ))}
              </div>
              <a
                href={WA_MAIN}
                className="btn-green"
                style={{ textAlign: "center" }}
              >
                Obtenir mon site →
              </a>
            </div>

            {/* Card 2 — Sur Mesure */}
            <div
              style={{
                flex: "1 1 320px",
                background: "#f4f4f2",
                borderRadius: 20,
                padding: 40,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  letterSpacing: "-0.02em",
                  marginBottom: 6,
                }}
              >
                Sur mesure
              </p>
              <p style={{ fontSize: 14, color: "#555555", marginBottom: 16 }}>
                Devis gratuit · Réponse 2h
              </p>
              <p
                style={{
                  fontSize: 15,
                  color: "#555555",
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                Plusieurs commerces, NFC avancé, intégrations spéciales. On s&apos;adapte à vos besoins.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  flex: 1,
                  marginBottom: 28,
                }}
              >
                {SUR_MESURE_FEATURES.map((f) => (
                  <FeatureRow key={f} text={f} />
                ))}
              </div>
              <a
                href={WA_DEVIS}
                className="btn-outline"
                style={{ textAlign: "center" }}
              >
                Demander un devis →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Separator */}
      <div
        style={{
          padding: "0 20px 20px",
          textAlign: "center",
          background: "#fafaf8",
          paddingTop: 40,
        }}
      >
        <p
          className="fade-up"
          style={{ fontSize: 13, color: "#555555", letterSpacing: "0.02em" }}
        >
          — Suivi mensuel optionnel —
        </p>
      </div>

      {/* Section 2 — Abonnements */}
      <section
        style={{
          background: "#fafaf8",
          padding: "60px 20px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
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
                  flex: 1,
                  marginBottom: 24,
                }}
              >
                {ESSENTIEL_FEATURES.map((f) => (
                  <FeatureRow key={f} text={f} />
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
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
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
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: 20,
                }}
              >
                Sans engagement
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  flex: 1,
                  marginBottom: 24,
                }}
              >
                {PRO_FEATURES.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
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
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              marginBottom: 12,
              lineHeight: 1.05,
            }}
          >
            Prêt à démarrer ?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.55)",
              marginBottom: 36,
            }}
          >
            990 CHF. 48h. Propriétaire à 100%.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <a href={WA_MAIN} className="btn-green">
              Obtenir mon site — 990 CHF
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
