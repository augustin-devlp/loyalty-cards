"use client";

import { useEffect } from "react";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

/* ─── Animated Fortune Wheel ─── */
function FortuneWheel() {
  const segments = [
    { color: "#1d9e75", label: "Café offert" },
    { color: "#f5a623", label: "-10%" },
    { color: "#0071e3", label: "Dessert" },
    { color: "#e74c3c", label: "Replay" },
    { color: "#9b59b6", label: "Boisson" },
    { color: "#1d1d1f", label: "+2 pts" },
  ];
  const r = 120;
  const cx = 140;
  const cy = 140;
  const total = segments.length;

  const paths = segments.map((seg, i) => {
    const startAngle = (i / total) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((i + 1) / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const midAngle = (startAngle + endAngle) / 2;
    const lx = cx + (r * 0.65) * Math.cos(midAngle);
    const ly = cy + (r * 0.65) * Math.sin(midAngle);
    return { d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`, lx, ly, color: seg.color, label: seg.label };
  });

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <style>{`
        @keyframes wheelSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .wheel-svg { animation: wheelSpin 8s linear infinite; transform-origin: 140px 140px; }
      `}</style>
      <svg width="280" height="280" viewBox="0 0 280 280" className="wheel-svg">
        {paths.map((p, i) => (
          <g key={i}>
            <path d={p.d} fill={p.color} stroke="white" strokeWidth="2" />
            <text
              x={p.lx}
              y={p.ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="10"
              fontWeight="600"
              fontFamily="Inter, sans-serif"
            >
              {p.label}
            </text>
          </g>
        ))}
        <circle cx={cx} cy={cy} r="14" fill="white" stroke="#e0e0e0" strokeWidth="2" />
        <circle cx={cx} cy={cy} r="6" fill="#1d1d1f" />
        {/* Pointer */}
        <polygon points="140,8 133,22 147,22" fill="#e74c3c" />
      </svg>
    </div>
  );
}

/* ─── Feature list item ─── */
function Feature({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
      <span style={{ color: "#1d9e75", fontSize: "18px", lineHeight: "27px", flexShrink: 0 }}>✓</span>
      <span style={{ fontSize: "17px", color: "#1d1d1f", lineHeight: "1.6" }}>{text}</span>
    </div>
  );
}

/* ─── Section split layout ─── */
interface SplitSectionProps {
  bg: string;
  reverse?: boolean;
  badge?: string;
  title: string;
  features: string[];
  visual: React.ReactNode;
}

function SplitSection({ bg, reverse, badge, title, features, visual }: SplitSectionProps) {
  return (
    <section
      className="fade-up"
      style={{ background: bg, padding: "100px 20px" }}
    >
      <style>{`
        @media (max-width: 768px) {
          .split-inner { flex-direction: column !important; }
          .split-title { font-size: 36px !important; }
          .split-section-pad { padding: 80px 20px !important; }
        }
      `}</style>
      <div
        className="split-inner"
        style={{
          maxWidth: "980px",
          margin: "0 auto",
          display: "flex",
          flexDirection: reverse ? "row-reverse" : "row",
          gap: "64px",
          alignItems: "center",
        }}
      >
        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {badge && (
            <span
              style={{
                display: "inline-block",
                background: "transparent",
                color: "#0071e3",
                border: "1px solid #0071e3",
                borderRadius: "980px",
                padding: "6px 16px",
                fontSize: "13px",
                fontWeight: 500,
                marginBottom: "20px",
              }}
            >
              {badge}
            </span>
          )}
          <h2
            className="split-title"
            style={{
              fontSize: "48px",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: "#1d1d1f",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            {title}
          </h2>
          <div style={{ marginTop: "8px" }}>
            {features.map((f, i) => (
              <Feature key={i} text={f} />
            ))}
          </div>
        </div>
        {/* Visual */}
        <div style={{ flex: 1, minWidth: 0 }}>{visual}</div>
      </div>
    </section>
  );
}

/* ─── Unsplash image visual ─── */
function UnsplashImg({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{
        width: "100%",
        borderRadius: "18px",
        objectFit: "cover",
        aspectRatio: "4/3",
        display: "block",
      }}
    />
  );
}

/* ─── Page ─── */
export default function FonctionnalitesPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
            .hero-title-feat { font-size: 44px !important; }
            .hero-section-feat { padding: 80px 20px 60px !important; }
          }
        `}</style>
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <h1
            className="hero-title-feat"
            style={{
              fontSize: "72px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#1d1d1f",
              lineHeight: 1.05,
              marginBottom: "24px",
            }}
          >
            Tout ce qu&apos;il faut.<br />Rien de superflu.
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
            Site vitrine, carte fidélité, NFC, SMS, réservations, commandes. 990 CHF. 48h.
          </p>
        </div>
      </section>

      {/* ── Section 1 — Site vitrine (white) ── */}
      <SplitSection
        bg="#ffffff"
        title="Le site que vos clients méritent."
        features={[
          "5 pages personnalisées",
          "Domaine .ch inclus",
          "SEO local complet",
          "Mobile-first",
          "Hébergement 1ère année offert",
        ]}
        visual={
          <UnsplashImg
            src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=700&q=80"
            alt="Site vitrine"
          />
        }
      />

      {/* ── Section 2 — Carte fidélité (#f5f5f7) ── */}
      <SplitSection
        bg="#f5f5f7"
        reverse
        title="La carte fidélité qui ne finit jamais à la poubelle."
        features={[
          "10 cases personnalisables",
          "Accessible sans app",
          "QR code ou NFC",
          "Tampons permanents",
          "Récompense configurable",
        ]}
        visual={
          <UnsplashImg
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80"
            alt="Carte fidélité"
          />
        }
      />

      {/* ── Section 3 — NFC (white) ── */}
      <SplitSection
        bg="#ffffff"
        title="Approchez. Voilà."
        features={[
          "Plaquette NFC en bois gravée",
          "À votre nom et logo",
          "Sur votre comptoir",
          "Fonctionne sur tous les iPhones",
          "Durée de vie illimitée",
        ]}
        visual={
          <UnsplashImg
            src="https://images.unsplash.com/photo-1556742111-a301076d9d18?w=700&q=80"
            alt="NFC"
          />
        }
      />

      {/* ── Section 4 — Roue de la fortune (#f5f5f7) ── */}
      <SplitSection
        bg="#f5f5f7"
        reverse
        title="Vos clients jouent. Ils reviennent."
        features={[
          "Roue de la fortune sur la carte",
          "6 segments configurables",
          "Taux de retour +40%",
          "Aucune app requise",
        ]}
        visual={<FortuneWheel />}
      />

      {/* ── Section 5 — SMS manuel (white) ── */}
      <SplitSection
        bg="#ffffff"
        title="Un message. Des dizaines de clients qui reviennent."
        features={[
          "Campagnes SMS manuelles",
          "1 campagne offerte le 1er mois",
          "Envoi en 2 clics depuis le dashboard",
          "Statistiques d'ouverture",
        ]}
        visual={
          <UnsplashImg
            src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80"
            alt="Campagnes SMS"
          />
        }
      />

      {/* ── Section 6 — 15 SMS automatiques (#f5f5f7) ── */}
      <SplitSection
        bg="#f5f5f7"
        reverse
        badge="Add-on à partir de 49 CHF/mois"
        title="15 SMS automatiques. Zéro effort."
        features={[
          "Bienvenue (1er tampon)",
          "Mi-parcours (5e tampon)",
          "Récompense obtenue",
          "Anniversaire",
          "Inactif 14 jours",
          "Inactif 30 jours",
          "Inactif 60 jours",
          "Rappel de réservation (24h avant)",
          "Confirmation de commande",
          "Commande prête",
          "Nouvelle offre saisonnière",
          "Parrainage réussi",
          "2e visite",
          "10e visite",
          "Flash promo weekend",
        ]}
        visual={
          <UnsplashImg
            src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=700&q=80"
            alt="SMS automatiques"
          />
        }
      />

      {/* ── Section 7 — Réservations (white) ── */}
      <SplitSection
        bg="#ffffff"
        title="Réservez depuis votre site. Gérez depuis votre téléphone."
        features={[
          "Table",
          "RDV",
          "Pré-commande",
          "Confirmation automatique",
          "Vue agenda 7 jours",
          "Supabase Realtime",
        ]}
        visual={
          <UnsplashImg
            src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=700&q=80"
            alt="Réservations"
          />
        }
      />

      {/* ── Section 8 — Commandes (#f5f5f7) ── */}
      <SplitSection
        bg="#f5f5f7"
        reverse
        title="Commandez en ligne. Récupérez avec un QR code."
        features={[
          "Catalogue produits",
          "Panier en ligne",
          "Confirmation par QR",
          "Retrait en boutique",
          "Statistiques commandes",
        ]}
        visual={
          <UnsplashImg
            src="https://images.unsplash.com/photo-1556742400-b5b7c512ad13?w=700&q=80"
            alt="Commandes en ligne"
          />
        }
      />

      {/* ── Section 9 — Menu QR (white) ── */}
      <SplitSection
        bg="#ffffff"
        title="Menu QR. Modifiable en 10 secondes."
        features={[
          "Carte numérique accessible en 1 scan",
          "Modifiable depuis le dashboard",
          "Photos produits",
          "Prix et disponibilité en temps réel",
          "Aucune impression nécessaire",
        ]}
        visual={
          <UnsplashImg
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80"
            alt="Menu QR"
          />
        }
      />

      {/* ── Section 10 — Dashboard (#f5f5f7) ── */}
      <SplitSection
        bg="#f5f5f7"
        reverse
        title="Tout votre commerce. Dans votre poche."
        features={[
          "Clients actifs et nouveaux",
          "Tampons distribués",
          "Récompenses réclamées",
          "Campagnes envoyées",
          "Réservations à venir",
        ]}
        visual={
          <UnsplashImg
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80"
            alt="Dashboard analytics"
          />
        }
      />

      {/* ── CTA bottom (white) ── */}
      <section
        className="fade-up"
        style={{
          background: "#ffffff",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >
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
