"use client";

import { useEffect } from "react";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .fade-up {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .split-inner {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 64px;
  }
  .split-inner.reverse {
    flex-direction: row-reverse;
  }
  .split-text { flex: 1; min-width: 0; }
  .split-visual {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    background: #e8f7f2;
    color: #1d9e75;
    font-size: 13px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 999px;
    margin-bottom: 18px;
    letter-spacing: 0.01em;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .badge-addon {
    background: #E8F7F2;
    color: #1d9e75;
  }

  .split-title {
    font-size: 48px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #1A1A1A;
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.08;
    margin: 0 0 16px;
  }
  .split-body {
    font-size: 17px;
    color: #5C5C5C;
    line-height: 1.7;
    font-family: 'Plus Jakarta Sans', sans-serif;
    margin: 0 0 24px;
  }

  .check-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .check-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    color: #1A1A1A;
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.5;
  }
  .check-list li .chk {
    width: 22px;
    height: 22px;
    min-width: 22px;
    border-radius: 50%;
    background: #e8f7f2;
    color: #1d9e75;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .trigger-cols {
    column-count: 2;
    column-gap: 16px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .trigger-cols li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #5C5C5C;
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.6;
    break-inside: avoid;
  }
  .trigger-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #1d9e75;
    flex-shrink: 0;
  }

  .cta-white-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    color: #1d9e75;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 17px;
    font-weight: 600;
    padding: 16px 40px;
    border-radius: 980px;
    text-decoration: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    cursor: pointer;
    border: none;
    white-space: nowrap;
  }
  .cta-white-pill:hover {
    opacity: 0.92;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .split-inner,
    .split-inner.reverse {
      flex-direction: column;
      gap: 36px;
    }
    .split-visual {
      order: -1;
      width: 100%;
    }
    .split-title {
      font-size: 34px;
    }
    .trigger-cols {
      column-count: 1;
    }
  }
`;

/* ─── Visual Mockups ─── */

function LoyaltyCardMini() {
  const filled = 7;
  const total = 10;
  return (
    <div
      style={{
        width: 260,
        height: 160,
        background: "linear-gradient(135deg, #1d9e75 0%, #17886a 100%)",
        borderRadius: 16,
        padding: "20px 24px",
        boxShadow: "0 8px 32px rgba(29,158,117,0.3)",
        color: "#fff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700 }}>Café Lumière</div>
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

function WheelMini() {
  return (
    <div
      style={{
        width: 200,
        height: 200,
        borderRadius: "50%",
        background:
          "conic-gradient(from 0deg, #1d9e75 0deg 60deg, #F2EFE9 60deg 120deg, #1A1A1A 120deg 180deg, #E8F7F2 180deg 240deg, #5C5C5C 240deg 300deg, #FFFFFF 300deg 360deg)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 800,
          color: "#1d9e75",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        }}
      >
        S
      </div>
    </div>
  );
}

function LotteryMiniCard() {
  return (
    <div style={{ width: "130px", background: "#FBF8F3", borderRadius: "14px", padding: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
      <div style={{ fontSize: "7px", fontWeight: 700, color: "#5C5C5C", letterSpacing: "0.08em", marginBottom: "8px", textAlign: "center" }}>TIRAGE DU MOIS</div>
      <div style={{ background: "linear-gradient(135deg, #1d9e75, #0D7A5A)", borderRadius: "8px", padding: "8px 10px", marginBottom: "6px", textAlign: "center" }}>
        <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.7)", marginBottom: "2px" }}>À GAGNER</div>
        <div style={{ fontSize: "10px", fontWeight: 800, color: "white", lineHeight: 1.2 }}>1 mois offert</div>
      </div>
      <div style={{ background: "#fff", borderRadius: "6px", padding: "6px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px dashed #C8E6DB", marginBottom: "6px" }}>
        <div style={{ fontSize: "11px", fontWeight: 800, color: "#1d9e75" }}>#0742</div>
        <div style={{ fontSize: "8px", color: "#5C5C5C" }}>47 part.</div>
      </div>
      <div style={{ background: "#1d9e75", borderRadius: "7px", padding: "5px 8px", textAlign: "center" }}>
        <div style={{ fontSize: "8px", fontWeight: 700, color: "white", lineHeight: 1.4 }}>Avis Google = ticket</div>
      </div>
    </div>
  );
}

function PhoneSMSMockup() {
  return (
    <div
      style={{
        width: 200,
        height: 360,
        background: "#1A1A1A",
        borderRadius: 28,
        padding: 14,
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          background: "#fafaf8",
          borderRadius: 18,
          flex: 1,
          padding: "12px 10px",
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
          }}
        >
          SMS
        </div>
        <div
          style={{
            background: "#e8f7f2",
            borderRadius: "12px 12px 12px 3px",
            padding: "8px 10px",
            maxWidth: "86%",
          }}
        >
          <div style={{ fontSize: 11, color: "#1A1A1A", lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Bonne fête ! -15% aujourd&apos;hui 🎂
          </div>
        </div>
        <div
          style={{
            background: "#1d9e75",
            borderRadius: "12px 12px 3px 12px",
            padding: "8px 10px",
            maxWidth: "78%",
            alignSelf: "flex-end",
          }}
        >
          <div style={{ fontSize: 11, color: "#fff", lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Merci ! J&apos;arrive 😊
          </div>
        </div>
        <div
          style={{
            background: "#e8f7f2",
            borderRadius: "12px 12px 12px 3px",
            padding: "8px 10px",
            maxWidth: "86%",
          }}
        >
          <div style={{ fontSize: 11, color: "#1A1A1A", lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Flash : 2h restantes ⚡
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardMockup() {
  const stats = [
    { label: "Clients actifs", value: "248" },
    { label: "Tampons ce mois", value: "1 034" },
    { label: "Taux de retour", value: "68 %" },
  ];
  return (
    <div
      style={{
        width: 280,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.09)",
        padding: 20,
        border: "1px solid #e8e8e6",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        flexShrink: 0,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>Dashboard</div>
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 14px",
            background: "#FBF8F3",
            borderRadius: 10,
          }}
        >
          <span style={{ fontSize: 13, color: "#5C5C5C" }}>{s.label}</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#1d9e75" }}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Reusable Section ─── */

interface SectionProps {
  bg: string;
  reverse?: boolean;
  badge: string;
  badgeClass?: string;
  title: string;
  body: string;
  checks?: string[];
  visual: React.ReactNode;
  textChildren?: React.ReactNode;
}

function CalendarMockup() {
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const cells = [
    { d: 1 }, { d: 2 }, { d: 3 }, { d: 4 }, { d: 5 }, { d: 6 }, { d: 7 },
    { d: 8 }, { d: 9 }, { d: 10, booked: true, label: "14h00" }, { d: 11 }, { d: 12, booked: true, label: "11h30" }, { d: 13 }, { d: 14 },
    { d: 15 }, { d: 16, today: true }, { d: 17, booked: true, label: "10h00" }, { d: 18 }, { d: 19 }, { d: 20 }, { d: 21 },
    { d: 22 }, { d: 23 }, { d: 24 }, { d: 25, booked: true, label: "16h30" }, { d: 26 }, { d: 27 }, { d: 28 },
  ];

  return (
    <div style={{
      background: "white",
      borderRadius: 20,
      boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
      padding: "24px",
      width: 340,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 13, color: "#5C5C5C", fontWeight: 600 }}>Avril 2025</div>
          <div style={{ fontSize: 17, color: "#1A1A1A", fontWeight: 700 }}>Réservations</div>
        </div>
        <div style={{
          background: "#1d9e75", color: "white", borderRadius: 10,
          padding: "8px 14px", fontSize: 13, fontWeight: 700,
        }}>+ Nouveau RDV</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
        {days.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF", fontWeight: 600, padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map(({ d, booked, today, label }) => (
          <div key={d} style={{
            textAlign: "center",
            padding: "6px 2px",
            borderRadius: 8,
            background: today ? "#1d9e75" : booked ? "#E8F7F2" : "transparent",
            position: "relative",
          }}>
            <div style={{
              fontSize: 13,
              fontWeight: today ? 700 : booked ? 600 : 400,
              color: today ? "white" : booked ? "#1d9e75" : "#1A1A1A",
            }}>{d}</div>
            {booked && label && (
              <div style={{ fontSize: 9, color: "#1d9e75", fontWeight: 700, marginTop: 1 }}>{label}</div>
            )}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 20,
        padding: "12px 16px",
        background: "#E8F7F2",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1d9e75", flexShrink: 0 }} />
        <div style={{ fontSize: 13, color: "#1A1A1A", fontWeight: 500 }}>
          SMS de rappel envoyé <span style={{ color: "#1d9e75", fontWeight: 700 }}>automatiquement</span>
        </div>
      </div>
    </div>
  );
}

function SplitSection({
  bg,
  reverse,
  badge,
  badgeClass,
  title,
  body,
  checks,
  visual,
  textChildren,
}: SectionProps) {
  return (
    <section
      style={{
        background: bg,
        padding: "120px 20px",
      }}
    >
      <div className={`split-inner${reverse ? " reverse" : ""}`}>
        <div className="split-text fade-up">
          <span className={`badge${badgeClass ? " " + badgeClass : ""}`}>{badge}</span>
          <h2 className="split-title">{title}</h2>
          <p className="split-body">{body}</p>
          {checks && (
            <ul className="check-list">
              {checks.map((c) => (
                <li key={c}>
                  <span className="chk">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          )}
          {textChildren}
        </div>
        <div className="split-visual fade-up">{visual}</div>
      </div>
    </section>
  );
}

/* ─── Trigger list for section 6 ─── */

const TRIGGERS = [
  "Anniversaire client",
  "Inactivité 14 jours",
  "Inactivité 30 jours",
  "Inactivité 60 jours",
  "Récompense atteinte",
  "Rappel avant expiration",
  "Bienvenue nouveau client",
  "Après 1ère visite",
  "Rappel réservation J-1",
  "Rappel réservation H-2",
  "Promo flash",
  "Mise à jour menu",
  "Événement spécial",
  "Réouverture après congé",
  "Nouveau produit dispo",
];

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
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll(".fade-up");
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{globalStyles}</style>

      {/* ── HERO ── */}
      <section
        style={{
          background: "#FBF8F3",
          padding: "120px 20px 80px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1
            className="fade-up"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(48px, 7vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#1A1A1A",
              lineHeight: 1.1,
              margin: "0 0 20px",
              whiteSpace: "pre-line",
            }}
          >
            {"Tout ce qu'il faut.\nRien de superflu."}
          </h1>
          <p
            className="fade-up"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 21,
              color: "#5C5C5C",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Site, carte, NFC, SMS, réservations, commandes. 990 CHF. 48h.
          </p>
        </div>
      </section>

      {/* ── Section 1 — Le site ── */}
      <SplitSection
        bg="#FBF8F3"
        badge="Inclus dans le forfait"
        title="Votre vitrine en ligne."
        body="Un site 5 pages, rapide, mobile-first, optimisé pour Google. Domaine .ch à votre nom. Livré en 48h."
        checks={[
          "5 pages professionnelles sur mesure",
          "SEO local optimisé dès le lancement",
          "Domaine .ch + hébergement inclus 1ère année",
        ]}
        visual={
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=85"
            alt="MacBook avec tableau de bord analytics — site vitrine professionnel"
            loading="lazy"
            decoding="async"
            width={600}
            height={400}
            style={{
              borderRadius: 16,
              width: "100%",
              maxWidth: 440,
              display: "block",
              aspectRatio: "3/2",
              objectFit: "cover",
            }}
          />
        }
      />

      {/* ── Section 2 — La carte ── */}
      <SplitSection
        bg="#F2EFE9"
        reverse
        badge="Zéro application requise"
        title="Plus de cartes perdues."
        body="Vos clients scannent le QR code ou approchent leur téléphone. La carte s'ouvre instantanément. Aucune app, aucun compte."
        checks={[
          "QR code + NFC — les deux inclus",
          "10 cases personnalisables (couleurs, lots)",
          "Tampons automatiques, notifications incluses",
        ]}
        visual={<LoyaltyCardMini />}
      />

      {/* ── Section 3 — La plaquette ── */}
      <SplitSection
        bg="#FBF8F3"
        badge="Incluse dans le forfait"
        title="En bois. À votre nom."
        body="Plaquette NFC gravée au laser. Posée sur votre comptoir. Vos clients approchent leur téléphone. Sans friction."
        checks={[
          "Gravure laser nom + logo",
          "Compatible iPhone et Android",
          "Livrée avec votre commande en 48h",
        ]}
        visual={
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=85"
            alt="Commerçant et client au comptoir — interaction avec la plaquette NFC"
            loading="lazy"
            decoding="async"
            width={600}
            height={400}
            style={{
              borderRadius: 16,
              width: "100%",
              maxWidth: 440,
              display: "block",
              aspectRatio: "3/2",
              objectFit: "cover",
            }}
          />
        }
      />

      {/* ── Section 4 — La roue + loterie ── */}
      <SplitSection
        bg="#F2EFE9"
        reverse
        badge="Gamification + avis Google inclus"
        title="Jouez. Gagnez. Revenez."
        body="Roue de la fortune ou tirage au sort mensuel — deux mécaniques, un seul objectif. La roue offre un lot immédiat en échange d'un avis Google. La loterie inscrit chaque client qui laisse un avis dans un tirage mensuel : 1 chance sur X de remporter un mois de produit offert."
        checks={[
          "Roue : lot immédiat contre avis Google",
          "Loterie : avis Google = 1 ticket dans l'urne",
          "1 gagnant par mois, lot 100% personnalisable",
          "100% des joueurs laissent un avis",
        ]}
        visual={
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <WheelMini />
              <span style={{ fontSize: "11px", color: "#5C5C5C", fontWeight: 600 }}>Roue de la fortune</span>
            </div>
            <div style={{ fontSize: "20px", color: "#C8E6DB", fontWeight: 700, alignSelf: "center" }}>+</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <LotteryMiniCard />
              <span style={{ fontSize: "11px", color: "#5C5C5C", fontWeight: 600 }}>Tirage au sort mensuel</span>
            </div>
          </div>
        }
      />

      {/* ── Section 5 — Les SMS ── */}
      <SplitSection
        bg="#FBF8F3"
        badge="Add-on 49 CHF/mois"
        badgeClass="badge-addon"
        title="Le bon message. Au bon moment."
        body="15 triggers configurables. Anniversaire, inactivité, promo flash, récompense. Entièrement automatiques."
        checks={[
          "15+ déclencheurs automatiques",
          "Promo flash manuelle en 2 clics",
          "SMS anniversaire, relance, récompense",
        ]}
        visual={<PhoneSMSMockup />}
      />

      {/* ── Section 6 — L'automatique ── */}
      <SplitSection
        bg="#F2EFE9"
        reverse
        badge="Add-on 49 CHF/mois"
        badgeClass="badge-addon"
        title="Zéro effort. Résultats réels."
        body="Une fois configuré, tout se passe seul. Vos clients reçoivent le bon message au bon moment, sans que vous leviez le petit doigt."
        visual={
          <ul className="trigger-cols">
            {TRIGGERS.map((t) => (
              <li key={t}>
                <span className="trigger-dot" />
                {t}
              </li>
            ))}
          </ul>
        }
      />

      {/* ── Section 7 — Les réservations ── */}
      <SplitSection
        bg="#FBF8F3"
        badge="Fonctionnalité incluse"
        title="Plus de no-show."
        body="Système de réservation intégré à votre site. Vos clients réservent depuis leur téléphone. Rappels SMS automatiques."
        checks={[
          "Réservation table, RDV, service",
          "Rappels SMS automatiques J-1 et H-2",
          "Annulation en 1 clic côté client",
        ]}
        visual={<CalendarMockup />}
      />

      {/* ── Section 8 — Les commandes ── */}
      <SplitSection
        bg="#F2EFE9"
        reverse
        badge="Click & Collect"
        title="Commandez. Récupérez. C'est tout."
        body="Pré-commande et click & collect depuis votre site. Moins d'attente, moins de gaspillage, plus de satisfaction."
        checks={[
          "Pré-commande en ligne 24h/24",
          "Paiement sécurisé en ligne optionnel",
          "Notification dès que la commande est prête",
        ]}
        visual={
          <img
            src="https://images.unsplash.com/photo-1601972602237-8c79241e468b?auto=format&fit=crop&w=600&q=85"
            alt="Application de commande en ligne sur téléphone — click & collect"
            loading="lazy"
            decoding="async"
            width={600}
            height={400}
            style={{
              borderRadius: 16,
              width: "100%",
              maxWidth: 440,
              display: "block",
              aspectRatio: "3/2",
              objectFit: "cover",
            }}
          />
        }
      />

      {/* ── Section 9 — Le menu QR ── */}
      <SplitSection
        bg="#FBF8F3"
        badge="Fonctionnalité incluse"
        title="Votre menu toujours à jour."
        body="QR code sur chaque table. Vos clients scannent, votre menu apparaît. Mettez à jour les prix depuis votre téléphone en 10 secondes."
        checks={[
          "Menu dynamique mis à jour en temps réel",
          "QR code imprimable format A5/A6",
          "Multilingue (FR/DE/EN) en option",
        ]}
        visual={
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=85"
            alt="Table de restaurant — menu QR code dynamique Stampify"
            loading="lazy"
            decoding="async"
            width={600}
            height={400}
            style={{
              borderRadius: 16,
              width: "100%",
              maxWidth: 440,
              display: "block",
              aspectRatio: "3/2",
              objectFit: "cover",
            }}
          />
        }
      />

      {/* ── Section 10 — Le dashboard ── */}
      <SplitSection
        bg="#F2EFE9"
        reverse
        badge="Inclus dans le forfait"
        title="Tout voir. Tout piloter."
        body="Depuis votre téléphone, en temps réel : clients actifs, tampons distribués, SMS envoyés, taux de retour. Toutes vos données, zéro complexité."
        checks={[
          "Stats clients en temps réel",
          "Historique de chaque visite",
          "Accès depuis téléphone ou ordinateur",
        ]}
        visual={<DashboardMockup />}
      />

      {/* ── CTA BOTTOM ── */}
      <section
        style={{
          background: "#1d9e75",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2
            className="fade-up"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 40,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 16px",
            }}
          >
            Prêt à démarrer ?
          </h2>
          <p
            className="fade-up"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 17,
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7,
              margin: "0 0 36px",
            }}
          >
            990 CHF · Livraison 48h garantie.
          </p>
          <div className="fade-up">
            <a href={WA_MAIN} className="cta-white-pill">
              Obtenir mon site
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
