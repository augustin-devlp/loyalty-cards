"use client";

import { useEffect, useRef, useState } from "react";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

const FORFAIT_FEATURES = [
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

const SUR_MESURE_FEATURES = [
  "Développement sur mesure",
  "Intégrations API complexes",
  "Prix selon complexité",
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

function FeatureRow({ text, dark = false }: { text: string; dark?: boolean }) {
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
          color: dark ? "rgba(255,255,255,0.85)" : "#1A1A1A",
          fontWeight: 500,
          lineHeight: 1.5,
        }}
      >
        {text}
      </span>
    </div>
  );
}

function DevisForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: "#ffffff",
    border: "1.5px solid #F2EFE9",
    borderRadius: 10,
    padding: "12px 16px",
    width: "100%",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    color: "#1A1A1A",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#5C5C5C",
    marginBottom: 6,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Bonjour ! Je souhaite un devis Stampify sur mesure. Prénom: ${name}. Email: ${email}. Projet: ${description}`;
    window.open(`https://wa.me/41791342997?text=${encodeURIComponent(msg)}`, "_blank");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        style={{
          fontSize: 15,
          color: "#1d9e75",
          background: "#E8F7F2",
          borderRadius: 12,
          padding: 16,
          textAlign: "center",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 500,
        }}
      >
        ✓ Demande envoyée ! On vous répond sous 2h.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label style={labelStyle}>Prénom</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <div>
        <label style={labelStyle}>Décrivez votre projet</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>
      <button
        type="submit"
        style={{
          marginTop: 8,
          width: "100%",
          background: "#1d9e75",
          color: "#ffffff",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          fontSize: 16,
          borderRadius: 980,
          padding: "16px 32px",
          border: "none",
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        Envoyer ma demande
      </button>
    </form>
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
        .fade-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        @media (max-width: 640px) {
          .cards-row { flex-direction: column !important; }
          .hero-title { font-size: 40px !important; }
          .hero-subtitle { font-size: 17px !important; }
          .btn-full { width: 100% !important; }
        }
      `}</style>

      {/* HERO */}
      <section
        style={{
          background: "#FBF8F3",
          padding: "120px 20px 80px",
          textAlign: "center",
        }}
      >
        <div className="fade-up" style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1
            className="hero-title"
            style={{
              fontSize: "clamp(48px, 7vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#1A1A1A",
              lineHeight: 1.05,
              marginBottom: 20,
            }}
          >
            Votre site à vie.
          </h1>
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
            Un seul paiement. Aucun engagement. Propriétaire à 100%.
          </p>
        </div>
      </section>

      {/* SECTION 1 — 2 CARDS */}
      <section
        style={{
          background: "#FBF8F3",
          padding: "0 20px 80px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            className="fade-up cards-row"
            style={{
              display: "flex",
              gap: 24,
              alignItems: "flex-start",
            }}
          >
            {/* Card Left — 990 CHF */}
            <div
              style={{
                flex: 1,
                background: "#FFFFFF",
                borderRadius: 20,
                padding: 40,
                border: "2px solid #1d9e75",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  display: "block",
                  background: "#E8F7F2",
                  color: "#1d9e75",
                  borderRadius: 980,
                  padding: "6px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  textAlign: "center",
                  alignSelf: "center",
                }}
              >
                ✦ LE CHOIX DE NOS CLIENTS
              </span>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  marginTop: 16,
                  marginBottom: 8,
                }}
              >
                Forfait Complet
              </h2>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#1A1A1A",
                  lineHeight: 1,
                }}
              >
                990 CHF
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#5C5C5C",
                  marginTop: 4,
                  marginBottom: 0,
                }}
              >
                paiement unique · aucun abonnement
              </p>
              <div
                style={{
                  height: 1,
                  background: "#F2EFE9",
                  margin: "20px 0",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  flex: 1,
                }}
              >
                {FORFAIT_FEATURES.map((f) => (
                  <FeatureRow key={f} text={f} />
                ))}
              </div>
              <a
                href={WA_MAIN}
                className="btn-full"
                style={{
                  display: "block",
                  marginTop: 24,
                  width: "100%",
                  background: "#1d9e75",
                  color: "#ffffff",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 980,
                  padding: "16px 32px",
                  textDecoration: "none",
                  textAlign: "center",
                  border: "none",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                Obtenir mon site — 990 CHF
              </a>
            </div>

            {/* Card Right — Sur Mesure */}
            <div
              style={{
                flex: 1,
                background: "#F2EFE9",
                borderRadius: 20,
                padding: 40,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  display: "block",
                  background: "#F2EFE9",
                  color: "#5C5C5C",
                  borderRadius: 980,
                  border: "1px solid #5C5C5C",
                  padding: "6px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  textAlign: "center",
                  alignSelf: "center",
                }}
              >
                PROJET COMPLEXE
              </span>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  marginTop: 16,
                  marginBottom: 8,
                }}
              >
                Sur Mesure
              </h2>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#1A1A1A",
                  lineHeight: 1,
                }}
              >
                Devis gratuit
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#5C5C5C",
                  marginTop: 4,
                  marginBottom: 0,
                }}
              >
                Back-end, SAAS, 3D, e-commerce avancé...
              </p>
              <div
                style={{
                  height: 1,
                  background: "rgba(0,0,0,0.08)",
                  margin: "20px 0",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {SUR_MESURE_FEATURES.map((f) => (
                  <FeatureRow key={f} text={f} />
                ))}
              </div>
              <DevisForm />
            </div>
          </div>
        </div>
      </section>

      {/* SEPARATOR */}
      <div
        style={{
          background: "#FBF8F3",
          padding: "24px 20px",
          textAlign: "center",
        }}
      >
        <p
          className="fade-up"
          style={{
            fontSize: 13,
            color: "#5C5C5C",
            margin: 0,
          }}
        >
          ─── Suivi mensuel optionnel ───
        </p>
        <p
          style={{
            fontSize: 14,
            color: "#5C5C5C",
            marginTop: 4,
            marginBottom: 0,
          }}
        >
          À partir du 2ème mois. Sans engagement.
        </p>
      </div>

      {/* SECTION 2 — ADD-ON CARDS */}
      <section
        style={{
          background: "#F2EFE9",
          padding: "80px 20px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            className="fade-up cards-row"
            style={{
              display: "flex",
              gap: 24,
              maxWidth: 640,
              margin: "0 auto",
              alignItems: "flex-start",
            }}
          >
            {/* Essentiel */}
            <div
              style={{
                flex: 1,
                background: "#F2EFE9",
                borderRadius: 20,
                padding: 32,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  margin: "0 0 2px",
                  letterSpacing: "-0.02em",
                }}
              >
                Essentiel
              </p>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#1A1A1A",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                49 CHF
                <span style={{ fontSize: 16, fontWeight: 500, color: "#5C5C5C" }}>/mois</span>
              </div>
              <p style={{ fontSize: 12, color: "#5C5C5C", margin: "4px 0 20px" }}>
                Sans engagement
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  flex: 1,
                  marginBottom: 24,
                }}
              >
                {ESSENTIEL_FEATURES.map((f) => (
                  <FeatureRow key={f} text={f} />
                ))}
              </div>
              <a
                href={WA_MAIN}
                className="btn-full"
                style={{
                  display: "block",
                  width: "100%",
                  background: "transparent",
                  color: "#1A1A1A",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 980,
                  padding: "14px 24px",
                  textDecoration: "none",
                  textAlign: "center",
                  border: "1.5px solid #1A1A1A",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                Choisir Essentiel
              </a>
            </div>

            {/* Pro */}
            <div
              style={{
                flex: 1,
                background: "#1A1A1A",
                borderRadius: 20,
                padding: 32,
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
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: "0 0 2px",
                  letterSpacing: "-0.02em",
                }}
              >
                Pro
              </p>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                79 CHF
                <span style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>
                  /mois
                </span>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "4px 0 20px" }}>
                Sans engagement
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  flex: 1,
                  marginBottom: 24,
                }}
              >
                {PRO_FEATURES.map((f) => (
                  <FeatureRow key={f} text={f} dark />
                ))}
              </div>
              <a
                href={WA_MAIN}
                className="btn-full"
                style={{
                  display: "block",
                  width: "100%",
                  background: "#ffffff",
                  color: "#1A1A1A",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 980,
                  padding: "14px 24px",
                  textDecoration: "none",
                  textAlign: "center",
                  border: "none",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                Choisir Pro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* NOTE */}
      <section
        style={{
          background: "#FBF8F3",
          padding: "40px 20px",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#5C5C5C",
              marginBottom: 8,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Note importante
          </p>
          <p
            style={{
              fontSize: 14,
              color: "#5C5C5C",
              lineHeight: 1.6,
              fontStyle: "italic",
              background: "#F2EFE9",
              borderRadius: 12,
              padding: 16,
              margin: 0,
            }}
          >
            Les fonctionnalités SMS (campagnes manuelles et automatiques) sont réservées aux membres add-on. Sans add-on, accès complet au reste indéfiniment.
          </p>
        </div>
      </section>
    </>
  );
}
