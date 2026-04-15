"use client";

import { useEffect } from "react";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

const globalStyles = `
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
    font-size: 17px;
    color: #1a1a1a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.7;
  }

  .feat-list li::before {
    content: '✓';
    color: #1d9e75;
    font-weight: 700;
    font-size: 13px;
    width: 22px;
    height: 22px;
    min-width: 22px;
    background: #e8f7f2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .section-inner {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    gap: 72px;
  }

  .section-inner.reverse {
    flex-direction: row-reverse;
  }

  .section-text {
    flex: 1;
  }

  .section-visual {
    flex: 0 0 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .section-badge {
    display: inline-flex;
    align-items: center;
    background: #e8f7f2;
    color: #1d9e75;
    font-size: 13px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 999px;
    margin-bottom: 20px;
    letter-spacing: 0.01em;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .section-title {
    font-size: 56px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #1a1a1a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.05;
  }

  .section-body {
    font-size: 17px;
    color: #555555;
    line-height: 1.7;
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
    padding: 14px 30px;
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

  @media (max-width: 768px) {
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
      font-size: 40px;
    }
  }
`;

/* ─── Visual Mockups ─── */

function BrowserMockup() {
  return (
    <div
      style={{
        width: 320,
        height: 220,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        overflow: "hidden",
        border: "1px solid #e8e8e6",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          background: "#f4f4f2",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          borderBottom: "1px solid #e8e8e6",
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57", flexShrink: 0 }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e", flexShrink: 0 }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840", flexShrink: 0 }} />
        <div
          style={{
            flex: 1,
            marginLeft: 8,
            background: "#f4f4f2",
            border: "1px solid #e0e0de",
            borderRadius: 4,
            height: 16,
          }}
        />
      </div>
      {/* Content */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Green hero rect */}
        <div style={{ height: 40, background: "#1d9e75", borderRadius: 4 }} />
        <div style={{ height: 8, background: "#f4f4f2", borderRadius: 4, width: "90%" }} />
        <div style={{ height: 8, background: "#f4f4f2", borderRadius: 4, width: "75%" }} />
        <div style={{ height: 8, background: "#f4f4f2", borderRadius: 4, width: "85%" }} />
        <div style={{ height: 8, background: "#f4f4f2", borderRadius: 4, width: "60%" }} />
        <div style={{ height: 8, background: "#f4f4f2", borderRadius: 4, width: "80%" }} />
        <div style={{ height: 8, background: "#f4f4f2", borderRadius: 4, width: "70%" }} />
      </div>
    </div>
  );
}

function LoyaltyCardMockup() {
  const filled = 7;
  const total = 10;
  return (
    <div
      style={{
        width: 280,
        height: 160,
        background: "linear-gradient(135deg, #1d9e75, #17886a)",
        borderRadius: 16,
        padding: "20px 24px",
        boxShadow: "0 8px 32px rgba(29,158,117,0.28)",
        color: "#fff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 700 }}>Mon Commerce</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: i < filled ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.25)",
              border: "2px solid rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function NfcMockup() {
  return (
    <div
      style={{
        width: 200,
        height: 130,
        background: "linear-gradient(135deg, #8B6914, #6B4F10)",
        borderRadius: 12,
        padding: "16px 20px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* NFC concentric circles */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: 20,
          transform: "translateY(-50%)",
          width: 50,
          height: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {[44, 32, 20].map((size, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.6)",
            }}
          />
        ))}
      </div>
      <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>Stampify</div>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Mon Commerce</div>
    </div>
  );
}

function WheelMockup() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "conic-gradient(#1d9e75 0% 17%, #f4f4f2 17% 33%, #1a1a1a 33% 50%, #e8f7f2 50% 67%, #555555 67% 83%, #fff 83% 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 800,
            color: "#1d9e75",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            zIndex: 2,
          }}
        >
          S
        </div>
      </div>
    </div>
  );
}

function SmsMockup() {
  return (
    <div
      style={{
        width: 160,
        height: 280,
        background: "#1a1a1a",
        borderRadius: 28,
        padding: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
      }}
    >
      <div
        style={{
          background: "#fafaf8",
          borderRadius: 20,
          height: "100%",
          padding: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "#aaa",
            textAlign: "center",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            paddingTop: 4,
          }}
        >
          SMS
        </div>
        {/* Received bubble */}
        <div
          style={{
            background: "#e8f7f2",
            borderRadius: "12px 12px 12px 3px",
            padding: "8px 10px",
            maxWidth: "85%",
          }}
        >
          <div style={{ fontSize: 11, color: "#1a1a1a", lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Bonne fête ! -15% aujourd&apos;hui 🎂
          </div>
        </div>
        {/* Sent bubble */}
        <div
          style={{
            background: "#1d9e75",
            borderRadius: "12px 12px 3px 12px",
            padding: "8px 10px",
            maxWidth: "80%",
            alignSelf: "flex-end",
          }}
        >
          <div style={{ fontSize: 11, color: "#fff", lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Merci ! J&apos;arrive 😊
          </div>
        </div>
        {/* Another received */}
        <div
          style={{
            background: "#e8f7f2",
            borderRadius: "12px 12px 12px 3px",
            padding: "8px 10px",
            maxWidth: "85%",
          }}
        >
          <div style={{ fontSize: 11, color: "#1a1a1a", lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Flash : 2h restantes !
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationMockup() {
  const steps = ["Visite", "Tampon", "Récompense"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {steps.map((label, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: "12px 14px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              border: "1px solid #e8e8e6",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#1d9e75",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                fontSize: 18,
                color: "#1d9e75",
                fontWeight: 700,
              }}
            >
              →
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CalendarMockup() {
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  const dates = Array.from({ length: 21 }, (_, i) => i + 1);
  const booked = [3, 8, 11, 15, 17];
  const today = 15;
  return (
    <div
      style={{
        width: 280,
        height: 200,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        padding: 18,
        border: "1px solid #e8e8e6",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>Avril 2026</span>
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, background: "#f4f4f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>‹</div>
          <div style={{ width: 20, height: 20, borderRadius: 4, background: "#f4f4f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>›</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" }}>
        {days.map((d, i) => (
          <div key={i} style={{ fontSize: 9, color: "#aaa", fontWeight: 600, padding: "2px 0" }}>{d}</div>
        ))}
        {dates.map((d) => (
          <div
            key={d}
            style={{
              fontSize: 11,
              padding: "4px 2px",
              borderRadius: 4,
              background: booked.includes(d) ? "#1d9e75" : d === today ? "#1a1a1a" : "transparent",
              color: booked.includes(d) || d === today ? "#fff" : "#1a1a1a",
              fontWeight: booked.includes(d) || d === today ? 700 : 400,
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderMockup() {
  const items = [
    { name: "Croissant x2", price: "3.40" },
    { name: "Café allongé", price: "3.00" },
    { name: "Pain au choc.", price: "2.20" },
  ];
  return (
    <div
      style={{
        width: 260,
        height: 160,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        padding: "16px 18px",
        border: "1px solid #e8e8e6",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>Commande #042</div>
      {items.map((item) => (
        <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 4, background: "#f4f4f2" }} />
            <span style={{ fontSize: 12, color: "#555" }}>{item.name}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1d9e75" }}>{item.price}</span>
        </div>
      ))}
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
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        border: "1px solid #e8e8e6",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 12px)", gap: 2 }}>
        {pattern.flat().map((cell, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              background: cell ? "#1a1a1a" : "#fff",
              borderRadius: 1,
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Menu digital</div>
    </div>
  );
}

function DashboardMockup() {
  const bars = [40, 65, 50, 80, 60, 90, 70];
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <div
      style={{
        width: 300,
        height: 180,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        padding: 16,
        border: "1px solid #e8e8e6",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>Tampons cette semaine</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1d9e75" }}>+247</div>
        </div>
        <div style={{ fontSize: 11, color: "#1d9e75", background: "#e8f7f2", padding: "3px 8px", borderRadius: 999, fontWeight: 600 }}>
          +12%
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 64, flex: 1 }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div
              style={{
                width: "100%",
                height: (h / 100) * 56,
                background: i === 5 ? "#1d9e75" : "#e8e8e6",
                borderRadius: "3px 3px 0 0",
              }}
            />
            <div style={{ fontSize: 9, color: "#aaa" }}>{days[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Section component ─── */

interface SectionProps {
  bg: string;
  reverse?: boolean;
  badge: string;
  title: string;
  body: string;
  features: string[];
  visual: React.ReactNode;
}

function Section({ bg, reverse, badge, title, body, features, visual }: SectionProps) {
  return (
    <section style={{ background: bg, padding: "160px 20px" }}>
      <div className={`section-inner${reverse ? " reverse" : ""}`}>
        <div className="section-text fade-up">
          <span className="section-badge">{badge}</span>
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
          padding: "120px 20px 80px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1
            className="fade-up"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#1a1a1a",
              lineHeight: 1.05,
            }}
          >
            Tout ce qu&apos;il faut.
          </h1>
          <p
            className="fade-up"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 21,
              color: "#555555",
              marginTop: 20,
              lineHeight: 1.7,
            }}
          >
            Un site qui travaille pour vous, 24h/24.
          </p>
          <div className="fade-up" style={{ marginTop: 36 }}>
            <a href={WA_MAIN} className="cta-pill">
              Obtenir mon site — 990 CHF
            </a>
          </div>
        </div>
      </section>

      {/* Section 1 — Le site */}
      <Section
        bg="#fafaf8"
        badge="Visibilité en ligne"
        title="Le site."
        body="Un site rapide, beau, et optimisé pour Google. Vos clients vous trouvent — et restent."
        features={[
          "SEO local Suisse romande",
          "Chargement < 2 secondes",
          "Adapté mobile & desktop",
          "Domaine .ch inclus",
        ]}
        visual={<BrowserMockup />}
      />

      {/* Section 2 — La carte */}
      <Section
        bg="#f4f4f2"
        reverse
        badge="Fidélité digitale"
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

      {/* Section 3 — La plaquette */}
      <Section
        bg="#fafaf8"
        badge="NFC gravée"
        title="La plaquette."
        body="Une plaquette NFC en bois gravée à votre nom, posée sur votre comptoir. Vos clients tapent, leur carte s'ouvre."
        features={[
          "Gravure laser personnalisée",
          "Compatible tous smartphones",
          "QR code imprimable inclus",
          "Livrée en 48h",
        ]}
        visual={<NfcMockup />}
      />

      {/* Section 4 — La roue */}
      <Section
        bg="#f4f4f2"
        reverse
        badge="Gamification"
        title="La roue."
        body="Activez la roue de la fortune. À chaque visite, une chance de gagner. Taux de retour +40%."
        features={[
          "6 récompenses configurables",
          "Animation CSS fluide",
          "Aucune app requise",
          "Statistiques incluses",
        ]}
        visual={<WheelMockup />}
      />

      {/* Section 5 — Les SMS */}
      <Section
        bg="#fafaf8"
        badge="Marketing automatique"
        title="Les SMS."
        body="15 triggers configurables. Anniversaire, inactivité, promo flash. 98% de taux d'ouverture."
        features={[
          "SMS anniversaire auto",
          "Relance inactif 14/30/60j",
          "Promo flash 2 clics",
          "Statistiques temps réel",
        ]}
        visual={<SmsMockup />}
      />

      {/* Section 6 — L'automatique */}
      <Section
        bg="#f4f4f2"
        reverse
        badge="Zéro effort"
        title="L'automatique."
        body="Tout se déclenche tout seul. Vous n'avez rien à faire. Le système travaille pendant que vous servez vos clients."
        features={[
          "Tampons enregistrés auto",
          "Récompenses envoyées auto",
          "Rappels automatiques",
          "Rapports mensuels",
        ]}
        visual={<AutomationMockup />}
      />

      {/* Section 7 — Les réservations */}
      <Section
        bg="#fafaf8"
        badge="24h/24"
        title="Les réservations."
        body="Vos clients réservent en ligne, n'importe quand. Zéro appel manqué. Confirmation automatique."
        features={[
          "Calendrier en ligne",
          "Confirmation automatique",
          "Rappel SMS",
          "Compatible Google Agenda",
        ]}
        visual={<CalendarMockup />}
      />

      {/* Section 8 — Les commandes */}
      <Section
        bg="#f4f4f2"
        reverse
        badge="Pré-commandes"
        title="Les commandes."
        body="Vos clients commandent à l'avance. Ils arrivent, c'est prêt. Parfait pour les boulangeries, cafés, traiteurs."
        features={[
          "Commande en ligne",
          "Retrait QR code",
          "Paiement en ligne ou sur place",
          "Notifications en temps réel",
        ]}
        visual={<OrderMockup />}
      />

      {/* Section 9 — Le menu */}
      <Section
        bg="#fafaf8"
        badge="QR code menu"
        title="Le menu."
        body="Mettez à jour votre menu en 30 secondes. Vos clients scannent, zéro impression, zéro gaspillage."
        features={[
          "Mise à jour instantanée",
          "Zéro impression",
          "Photos incluses",
          "Multi-langues",
        ]}
        visual={<QrMockup />}
      />

      {/* Section 10 — Le dashboard */}
      <Section
        bg="#f4f4f2"
        reverse
        badge="Tableau de bord"
        title="Le dashboard."
        body="Suivez tout : clients, tampons, réservations, SMS. En temps réel, depuis votre téléphone."
        features={[
          "Stats temps réel",
          "Export données",
          "Historique clients",
          "Alertes personnalisées",
        ]}
        visual={<DashboardMockup />}
      />

      {/* CTA Final */}
      <section
        style={{
          background: "#1a1a1a",
          padding: "120px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            className="fade-up"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: "-0.03em",
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
              color: "rgba(255,255,255,0.55)",
              marginTop: 20,
              lineHeight: 1.7,
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
