"use client";

import { useEffect } from "react";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #fafaf8;
  }

  .fade-up {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }

  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .feat-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
  }

  .feat-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    color: #1a1a1a;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .feat-list li::before {
    content: '✓';
    color: #1d9e75;
    font-weight: 700;
    font-size: 15px;
    width: 22px;
    height: 22px;
    background: rgba(29,158,117,0.12);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .section-inner {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    gap: 64px;
  }

  .section-inner.reverse {
    flex-direction: row-reverse;
  }

  .section-text {
    flex: 1;
  }

  .section-visual {
    flex: 0 0 280px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .section-title {
    font-size: 64px;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: #1a1a1a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.05;
  }

  .section-body {
    font-size: 19px;
    color: #555555;
    line-height: 1.6;
    margin-top: 16px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .cta-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #1d9e75;
    color: #fff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 16px;
    font-weight: 700;
    padding: 14px 28px;
    border-radius: 999px;
    text-decoration: none;
    transition: background 0.2s ease, transform 0.2s ease;
    cursor: pointer;
    border: none;
    white-space: nowrap;
  }

  .cta-pill:hover {
    background: #18886a;
    transform: translateY(-2px);
  }

  @media (max-width: 700px) {
    .section-inner,
    .section-inner.reverse {
      flex-direction: column;
      gap: 40px;
    }

    .section-visual {
      flex: none;
      width: 100%;
    }

    .section-title {
      font-size: 44px;
    }
  }
`;

/* ─── Visual Mockups ─── */

function BrowserMockup() {
  return (
    <div
      style={{
        width: 260,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        overflow: "hidden",
        border: "1px solid #e8e8e6",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: "#f0f0ee",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          borderBottom: "1px solid #e0e0de",
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
        <div
          style={{
            flex: 1,
            marginLeft: 8,
            background: "#e0e0de",
            borderRadius: 4,
            height: 14,
          }}
        />
      </div>
      {/* Content */}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ height: 20, background: "#1d9e75", borderRadius: 4, width: "60%" }} />
        <div style={{ height: 10, background: "#e8e8e6", borderRadius: 4, width: "90%" }} />
        <div style={{ height: 10, background: "#e8e8e6", borderRadius: 4, width: "75%" }} />
        <div style={{ height: 10, background: "#e8e8e6", borderRadius: 4, width: "85%" }} />
        <div style={{ height: 60, background: "#f0f0ee", borderRadius: 6, marginTop: 4 }} />
        <div style={{ height: 10, background: "#e8e8e6", borderRadius: 4, width: "70%" }} />
        <div style={{ height: 10, background: "#e8e8e6", borderRadius: 4, width: "55%" }} />
      </div>
    </div>
  );
}

function LoyaltyCardMockup() {
  const stamps = Array.from({ length: 9 });
  return (
    <div
      style={{
        width: 260,
        background: "linear-gradient(135deg, #1d9e75 0%, #0d7a5a 100%)",
        borderRadius: 18,
        padding: 24,
        boxShadow: "0 8px 40px rgba(29,158,117,0.28)",
        color: "#fff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.75, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Carte Fidélité
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>Mon Commerce</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          marginTop: 20,
        }}
      >
        {stamps.map((_, i) => (
          <div
            key={i}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: i < 6 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            {i < 6 ? "✓" : ""}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: 12, opacity: 0.7 }}>6 / 9 tampons</div>
    </div>
  );
}

function SmsMockup() {
  return (
    <div
      style={{
        width: 240,
        background: "linear-gradient(160deg, #1a1a1a 0%, #2a2a2a 100%)",
        borderRadius: 20,
        padding: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.20)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>SMS</div>
      <div
        style={{
          background: "#fff",
          borderRadius: "16px 16px 16px 4px",
          padding: "12px 14px",
          maxWidth: "85%",
        }}
      >
        <div style={{ fontSize: 13, color: "#1a1a1a", lineHeight: 1.5 }}>
          Offre spéciale ce weekend : -20% sur toute la carte ! 🎉
        </div>
        <div style={{ fontSize: 10, color: "#aaa", marginTop: 4 }}>Mon Commerce</div>
      </div>
      <div
        style={{
          background: "#1d9e75",
          borderRadius: "16px 16px 4px 16px",
          padding: "12px 14px",
          maxWidth: "85%",
          alignSelf: "flex-end",
        }}
      >
        <div style={{ fontSize: 13, color: "#fff", lineHeight: 1.5 }}>
          Merci ! J&apos;arrive demain 😊
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Vous</div>
      </div>
      <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>Taux d&apos;ouverture 98%</div>
    </div>
  );
}

function DocumentMockup() {
  return (
    <div
      style={{
        width: 200,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        padding: 20,
        border: "1px solid #e0e0de",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div
        style={{
          height: 16,
          background: "#1d9e75",
          borderRadius: 3,
          width: "70%",
          marginBottom: 14,
        }}
      />
      {[85, 95, 60, 80, 75, 90, 55].map((w, i) => (
        <div
          key={i}
          style={{
            height: 8,
            background: "#e8e8e6",
            borderRadius: 3,
            width: `${w}%`,
            marginBottom: 8,
          }}
        />
      ))}
      <div
        style={{
          marginTop: 12,
          width: 44,
          height: 44,
          background: "#1a1a1a",
          borderRadius: 4,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 2,
          padding: 4,
        }}
      >
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: Math.random() > 0.4 ? "#fff" : "transparent",
              borderRadius: 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function CalendarMockup() {
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  const dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  const booked = [3, 8, 11, 15, 17];
  return (
    <div
      style={{
        width: 240,
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        padding: 18,
        border: "1px solid #e8e8e6",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>Avril 2026</span>
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "#f0f0ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, cursor: "pointer" }}>‹</div>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: "#f0f0ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, cursor: "pointer" }}>›</div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 3,
          textAlign: "center",
        }}
      >
        {days.map((d) => (
          <div key={d} style={{ fontSize: 10, color: "#aaa", fontWeight: 600, padding: "2px 0" }}>
            {d}
          </div>
        ))}
        {dates.map((d) => (
          <div
            key={d}
            style={{
              fontSize: 12,
              padding: "5px 2px",
              borderRadius: 6,
              background: booked.includes(d) ? "#1d9e75" : d === 15 ? "#1a1a1a" : "transparent",
              color: booked.includes(d) || d === 15 ? "#fff" : "#1a1a1a",
              fontWeight: booked.includes(d) || d === 15 ? 700 : 400,
              cursor: "pointer",
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

function QrMockup() {
  const pattern = [
    [1,1,1,0,1,0,1,1,1],
    [1,0,1,0,1,0,1,0,1],
    [1,0,1,1,0,1,1,0,1],
    [0,0,0,1,0,0,0,0,0],
    [1,1,0,0,1,0,0,1,1],
    [0,0,0,1,0,1,0,0,0],
    [1,0,1,0,0,1,1,0,1],
    [1,0,1,0,1,0,0,0,1],
    [1,1,1,1,0,0,1,1,1],
  ];
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        border: "1px solid #e8e8e6",
        display: "inline-block",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 16px)",
          gap: 2,
        }}
      >
        {pattern.flat().map((cell, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 16,
              background: cell ? "#1a1a1a" : "#fff",
              borderRadius: 2,
            }}
          />
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 10, fontWeight: 600 }}>
        Menu digital
      </div>
    </div>
  );
}

function DashboardMockup() {
  const bars = [40, 65, 50, 80, 60, 90, 70];
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <div
      style={{
        width: 260,
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        padding: 20,
        border: "1px solid #e8e8e6",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Tampons cette semaine</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#1d9e75", marginBottom: 16 }}>+247</div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          height: 80,
        }}
      >
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div
              style={{
                width: "100%",
                height: h,
                background: i === 5 ? "#1d9e75" : "#e8e8e6",
                borderRadius: "4px 4px 0 0",
                transition: "height 0.3s ease",
              }}
            />
            <div style={{ fontSize: 10, color: "#aaa" }}>{days[i]}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 14,
          padding: "10px 12px",
          background: "#f8f8f6",
          borderRadius: 8,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 12, color: "#555" }}>Clients actifs</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>183</span>
      </div>
    </div>
  );
}

function NfcMockup() {
  return (
    <div
      style={{
        width: 200,
        height: 126,
        background: "linear-gradient(135deg, #1a1a1a 0%, #2e2e2e 100%)",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Shine */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div style={{ color: "#fff", fontSize: 15, fontWeight: 800, letterSpacing: "-0.02em" }}>
        Stampify
      </div>
      {/* NFC symbol */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M10 14 Q14 8 18 14" stroke="#1d9e75" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M7 14 Q14 4 21 14" stroke="#1d9e75" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M4 14 Q14 0 24 14" stroke="#1d9e75" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600 }}>NFC</span>
      </div>
      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.08em" }}>
        MON COMMERCE ••••
      </div>
    </div>
  );
}

function ServerMockup() {
  return (
    <div
      style={{
        width: 200,
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        padding: 20,
        border: "1px solid #e8e8e6",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Server units */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            background: "#f4f4f2",
            borderRadius: 8,
            padding: "10px 12px",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid #e8e8e6",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: i === 1 ? "#28c840" : i === 2 ? "#1d9e75" : "#28c840",
              boxShadow: `0 0 6px ${i === 2 ? "#1d9e75" : "#28c840"}`,
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ height: 6, background: "#e0e0de", borderRadius: 3, width: "75%" }} />
          </div>
          <div style={{ fontSize: 9, color: "#aaa", fontWeight: 600 }}>
            {i === 1 ? "SSL" : i === 2 ? "CDN" : "BKP"}
          </div>
        </div>
      ))}
      {/* Uptime bar */}
      <div style={{ marginTop: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 11, color: "#aaa" }}>Uptime</span>
          <span style={{ fontSize: 11, color: "#1d9e75", fontWeight: 700 }}>99.9%</span>
        </div>
        <div style={{ height: 5, background: "#e8e8e6", borderRadius: 99 }}>
          <div style={{ height: "100%", width: "99.9%", background: "#1d9e75", borderRadius: 99 }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Section component ─── */

interface SectionProps {
  bg: string;
  reverse?: boolean;
  title: string;
  body: string;
  features: string[];
  visual: React.ReactNode;
}

function Section({ bg, reverse, title, body, features, visual }: SectionProps) {
  return (
    <section style={{ background: bg, padding: "180px 0" }}>
      <div className={`section-inner${reverse ? " reverse" : ""}`}>
        <div className="section-text fade-up">
          <h2 className="section-title">{title}</h2>
          <p className="section-body">{body}</p>
          <ul className="feat-list">
            {features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div className="section-visual fade-up">{visual}</div>
      </div>
    </section>
  );
}

/* ─── Page ─── */

export default function FonctionnalitesPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll(".fade-up");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{globalStyles}</style>

      {/* Hero */}
      <section
        style={{
          background: "#fafaf8",
          padding: "140px 24px 80px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h1
            className="fade-up"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#1a1a1a",
              lineHeight: 1.05,
            }}
          >
            Tout ce qu&apos;il faut.
            <br />
            Rien de trop.
          </h1>
          <p
            className="fade-up"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 21,
              color: "#555555",
              marginTop: 20,
              lineHeight: 1.5,
            }}
          >
            Un site qui travaille pour vous 24h/24.
          </p>
          <div className="fade-up" style={{ marginTop: 36 }}>
            <a href={WA_MAIN} className="cta-pill">
              Obtenir mon site — 990 CHF
            </a>
          </div>
        </div>
      </section>

      {/* Section 1 — Le site web */}
      <Section
        bg="#fafaf8"
        title="Le site."
        body="Un site rapide, beau, et optimisé pour Google. Vos clients vous trouvent — et restent."
        features={[
          "Optimisé SEO local Suisse romande",
          "Chargement < 2 secondes",
          "Adapté mobile & desktop",
          "Domaine personnalisé inclus",
        ]}
        visual={<BrowserMockup />}
      />

      {/* Section 2 — La carte fidélité */}
      <Section
        bg="#f4f4f2"
        reverse
        title="La carte."
        body="Vos clients reviennent. Automatiquement. La carte fidélité digitale s'active en 1 tap — pas d'app à télécharger."
        features={[
          "Tampons digitaux",
          "Récompenses automatiques",
          "Aucune app à installer",
          "Compatible iPhone & Android",
        ]}
        visual={<LoyaltyCardMockup />}
      />

      {/* Section 3 — Les SMS */}
      <Section
        bg="#fafaf8"
        title="Les SMS."
        body="Envoyez des offres directement dans la poche de vos clients. Taux d'ouverture : 98%."
        features={[
          "SMS personnalisés",
          "Offres flash",
          "Rappels automatiques",
          "Statistiques en temps réel",
        ]}
        visual={<SmsMockup />}
      />

      {/* Section 4 — La plaquette */}
      <Section
        bg="#f4f4f2"
        reverse
        title="La plaquette."
        body="Une présentation professionnelle à envoyer à vos clients. PDF prêt à imprimer ou à partager."
        features={[
          "Design sur mesure",
          "Format A4 & numérique",
          "QR code intégré",
          "Livraison en 48h",
        ]}
        visual={<DocumentMockup />}
      />

      {/* Section 5 — Les réservations */}
      <Section
        bg="#fafaf8"
        title="Les réservations."
        body="Vos clients réservent en ligne, 24h/24. Zéro appel manqué."
        features={[
          "Calendrier en ligne",
          "Confirmation automatique",
          "Rappel SMS",
          "Synchronisation Google Cal",
        ]}
        visual={<CalendarMockup />}
      />

      {/* Section 6 — Le menu QR */}
      <Section
        bg="#f4f4f2"
        reverse
        title="Le menu QR."
        body="Mettez à jour votre menu en 30 secondes. Vos clients scannent, vous économisez sur l'impression."
        features={[
          "Mise à jour instantanée",
          "Zéro impression",
          "Photos incluses",
          "Multi-langues",
        ]}
        visual={<QrMockup />}
      />

      {/* Section 7 — Le tableau de bord */}
      <Section
        bg="#fafaf8"
        title="Le tableau de bord."
        body="Suivez vos clients, vos tampons, vos réservations. Tout en un seul endroit."
        features={[
          "Statistiques en temps réel",
          "Export Excel",
          "Historique clients",
          "Alertes personnalisées",
        ]}
        visual={<DashboardMockup />}
      />

      {/* Section 8 — La carte NFC */}
      <Section
        bg="#f4f4f2"
        reverse
        title="La carte NFC."
        body="Une carte physique qui ouvre votre site en 1 tap. Vos clients l'ont toujours sur eux."
        features={[
          "Compatible tous les smartphones",
          "Aucune app requise",
          "Design personnalisé",
          "Livraison en 48h",
        ]}
        visual={<NfcMockup />}
      />

      {/* Section 9 — L'hébergement */}
      <Section
        bg="#fafaf8"
        title="L'hébergement."
        body="On s'occupe de tout. Hébergement, mises à jour, sécurité. Vous vous concentrez sur votre commerce."
        features={[
          "Hébergement inclus",
          "SSL gratuit",
          "Mises à jour incluses",
          "Support 7j/7",
        ]}
        visual={<ServerMockup />}
      />

      {/* Section 10 — CTA final */}
      <section
        style={{
          background: "#1a1a1a",
          padding: "180px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2
            className="fade-up"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#fff",
              lineHeight: 1.05,
            }}
          >
            Prêt à lancer ?
          </h2>
          <p
            className="fade-up"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 19,
              color: "rgba(255,255,255,0.6)",
              marginTop: 20,
              lineHeight: 1.6,
            }}
          >
            Votre site en 48h. Accompagnement complet inclus.
          </p>
          <div className="fade-up" style={{ marginTop: 40 }}>
            <a href={WA_MAIN} className="cta-pill">
              Obtenir mon site — 990 CHF
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
