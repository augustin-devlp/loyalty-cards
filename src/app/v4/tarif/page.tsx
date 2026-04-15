"use client";

import { useEffect, useRef, useState } from "react";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

const FEATURES = [
  "Site web professionnel",
  "Carte fidélité digitale",
  "Menu QR code",
  "Réservations en ligne",
  "SMS marketing (1er mois offert)",
  "Tableau de bord",
  "Hébergement 1 an inclus",
  "SSL & sécurité inclus",
  "Domaine personnalisé",
  "Support 7j/7",
  "Livraison en 48h",
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

const FAQS = [
  {
    q: "Qu'est-ce qui est inclus dans les 990 CHF ?",
    a: "Tout : le site web, la carte fidélité, le menu QR, les réservations en ligne, l'hébergement pour 1 an, le domaine, et le support. Pas de frais cachés.",
  },
  {
    q: "Y a-t-il un abonnement mensuel ?",
    a: "Non. Le paiement est unique. Après la première année, l'hébergement est de 99 CHF/an seulement.",
  },
  {
    q: "En combien de temps mon site est-il prêt ?",
    a: "48 heures ouvrables après validation de votre contenu. Souvent moins.",
  },
  {
    q: "Puis-je modifier mon site moi-même ?",
    a: "Oui, via un tableau de bord simple. Sinon, on s'en occupe gratuitement dans le cadre du support inclus.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Par virement bancaire ou TWINT, après validation du devis. Aucune carte de crédit requise.",
  },
  {
    q: "Que se passe-t-il après 1 an ?",
    a: "On vous envoie un rappel. Vous pouvez renouveler l'hébergement pour 99 CHF/an ou transférer votre site ailleurs.",
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
            fontSize: 20,
            color: "#555555",
            flexShrink: 0,
            transition: "transform 0.2s ease",
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
          transition: "max-height 0.3s ease",
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .fade-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .pricing-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .pricing-card:hover {
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
          font-size: 16px;
          border-radius: 999px;
          padding: 16px 32px;
          text-decoration: none;
          text-align: center;
          transition: background 0.2s ease, transform 0.2s ease;
          cursor: pointer;
          border: none;
          width: 100%;
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
            Simple. Transparent.
          </h1>
          <p
            style={{
              fontSize: 21,
              color: "#555555",
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            Un seul forfait. Tout inclus.
          </p>
        </div>
      </section>

      {/* Main Pricing Card */}
      <section
        style={{
          background: "#f4f4f2",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div
          className="fade-up pricing-card"
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: 48,
            maxWidth: 560,
            margin: "0 auto",
            boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
            position: "relative",
          }}
        >
          {/* Popular pill */}
          <div
            style={{
              position: "absolute",
              top: -18,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#1d9e75",
              color: "#ffffff",
              borderRadius: 999,
              padding: "6px 20px",
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: "nowrap",
              letterSpacing: "0.02em",
            }}
          >
            Le plus populaire
          </div>

          {/* Price */}
          <div
            style={{
              fontSize: 120,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#1a1a1a",
              lineHeight: 1,
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            990{" "}
            <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em" }}>
              CHF
            </span>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#555555",
              marginBottom: 32,
            }}
          >
            Paiement unique · Pas d&apos;abonnement
          </p>

          {/* Separator */}
          <div
            style={{
              height: 1,
              background: "rgba(0,0,0,0.08)",
              marginBottom: 32,
            }}
          />

          {/* Feature list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginBottom: 40,
              textAlign: "left",
            }}
          >
            {FEATURES.map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    color: "#1d9e75",
                    fontWeight: 700,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
                <span style={{ fontSize: 15, color: "#1a1a1a", fontWeight: 500 }}>
                  {f}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a href={WA_MAIN} className="cta-btn">
            Obtenir mon site →
          </a>
        </div>
      </section>

      {/* Add-ons Section */}
      <section
        style={{
          background: "#fafaf8",
          padding: "80px 24px",
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
              marginBottom: 48,
            }}
          >
            Options supplémentaires
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

      {/* FAQ Section */}
      <section
        style={{
          background: "#f4f4f2",
          padding: "80px 24px",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2
            className="fade-up"
            style={{
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#1a1a1a",
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Questions fréquentes
          </h2>
          <div
            className="fade-up"
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
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
