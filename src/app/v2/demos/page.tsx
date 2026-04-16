"use client";

import Link from "next/link";

const DEMOS = [
  {
    id: "spa",
    name: "Spa Essence",
    category: "Spa & Bien-être",
    city: "Genève",
    url: "spa-essence.stampify.ch",
    badge: "⭐ Le plus demandé",
    imgId: "photo-1540555700478-4be289fbecef",
    imgAlt: "Spa luxueux intérieur marble blanc",
    desc: "Site vitrine élégant pour un spa premium genevois. Galerie de soins, réservation en ligne, carte fidélité digitale 10 cases.",
    color: "#8B5CF6",
    href: "/demo/spa",
  },
  {
    id: "cafe",
    name: "Café Lumière",
    category: "Café & Brunch",
    city: "Lausanne",
    url: "cafe-lumiere.stampify.ch",
    badge: null,
    imgId: "photo-1495474472287-4d71bcdd2085",
    imgAlt: "Café spécialisé intérieur chaleureux",
    desc: "Page vitrine moderne pour café artisanal. Menu du jour, horaires, carte fidélité et campagnes SMS intégrées.",
    color: "#F59E0B",
    href: "/demo/cafe",
  },
  {
    id: "restaurant",
    name: "Le Comptoir",
    category: "Restaurant & Bistrot",
    city: "Neuchâtel",
    url: "le-comptoir.stampify.ch",
    badge: null,
    imgId: "photo-1414235077428-338989a2e8c0",
    imgAlt: "Restaurant français élégant intérieur",
    desc: "Site bistrot avec menu complet, réservation WhatsApp, galerie plats et système de fidélité pour habitués.",
    color: "#EF4444",
    href: "/demo/restaurant",
  },
  {
    id: "boulangerie",
    name: "Boulangerie Martin",
    category: "Boulangerie & Pâtisserie",
    city: "Lausanne",
    url: "boulangerie-martin.stampify.ch",
    badge: null,
    imgId: "photo-1556742049-0cfed4f6a45d",
    imgAlt: "Boulangerie artisanale pains frais",
    desc: "Vitrine chaleureuse avec carte de spécialités, horaires, et carte tampon digitale 10 cases. Domaine .ch inclus.",
    color: "#D97706",
    href: "/demo/boulangerie",
  },
  {
    id: "barbershop",
    name: "Black Scissors",
    category: "Barbershop & Coiffure",
    city: "Fribourg",
    url: "black-scissors.stampify.ch",
    badge: null,
    imgId: "photo-1503951914875-452162b0f3f1",
    imgAlt: "Barbershop premium intérieur moderne",
    desc: "Design sombre et premium pour barbershop. Services et tarifs, réservation directe, carte fidélité masculine.",
    color: "#1F2937",
    href: "/demo/barbershop",
  },
  {
    id: "manucure",
    name: "Nail Studio",
    category: "Nail Art & Beauté",
    city: "Lausanne",
    url: "nail-studio.stampify.ch",
    badge: null,
    imgId: "photo-1604902396020-c7b77965a820",
    imgAlt: "Studio nail art élégant",
    desc: "Page vitrine pastel et raffinée pour nail studio. Galerie réalisations, prix, prise de RDV et fidélité digitale.",
    color: "#EC4899",
    href: "/demo/manucure",
  },
];

export default function DemosPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        paddingBottom: "120px",
      }}
    >
      {/* Hero */}
      <div
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,247,242,0.5) 0%, #ffffff 70%)",
          padding: "80px 24px 60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#E8F7F2",
            border: "1px solid rgba(29,158,117,0.2)",
            borderRadius: "980px",
            padding: "6px 16px",
            fontSize: "13px",
            color: "#1d9e75",
            fontWeight: 500,
            marginBottom: "28px",
          }}
        >
          ✦ Sites livrés en 48h
        </div>
        <h1
          style={{
            fontSize: "clamp(42px, 6vw, 72px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            marginBottom: "20px",
            color: "#0A0A0A",
          }}
        >
          Voyez le résultat
          <br />
          avant de commander.
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "#6B7280",
            maxWidth: "500px",
            margin: "0 auto 40px",
            lineHeight: 1.6,
          }}
        >
          Chaque démo est un vrai site créé avec Stampify. Même qualité,
          même vitesse de livraison.
        </p>
        <Link
          href="/v2/subscribe"
          style={{
            display: "inline-block",
            background: "#1d9e75",
            color: "#fff",
            borderRadius: "980px",
            padding: "16px 36px",
            fontSize: "16px",
            fontWeight: 600,
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          Obtenir mon site — 990 CHF →
        </Link>
      </div>

      {/* Grid */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div className="demos-grid">
          {DEMOS.map((demo) => (
            <DemoCard key={demo.id} demo={demo} />
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            textAlign: "center",
            marginTop: "80px",
            padding: "60px 40px",
            background: "#F9FAFB",
            borderRadius: "24px",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: "16px",
              color: "#0A0A0A",
            }}
          >
            Votre commerce mérite son site.
          </h2>
          <p
            style={{
              fontSize: "17px",
              color: "#6B7280",
              marginBottom: "32px",
              lineHeight: 1.6,
            }}
          >
            990 CHF, une seule fois. Livré en 48h. Sans abonnement.
          </p>
          <Link
            href="/v2/subscribe"
            style={{
              display: "inline-block",
              background: "#1d9e75",
              color: "#fff",
              borderRadius: "980px",
              padding: "18px 40px",
              fontSize: "17px",
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            Démarrer maintenant →
          </Link>
        </div>
      </div>

      <style>{`
        .demos-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-top: 60px;
        }
        @media (max-width: 1024px) {
          .demos-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .demos-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

function DemoCard({ demo }: { demo: typeof DEMOS[0] }) {
  return (
    <Link
      href={demo.href}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.06)",
          background: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          transition: "box-shadow 0.25s ease, transform 0.25s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.10)";
          e.currentTarget.style.transform = "translateY(-4px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Image with browser overlay */}
        <div
          style={{
            position: "relative",
            aspectRatio: "16/9",
            overflow: "hidden",
            background: "#E8F7F2",
          }}
        >
          <img
            src={`https://images.unsplash.com/${demo.imgId}?w=640&q=80&fit=crop`}
            alt={demo.imgAlt}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          {/* Browser bar overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              background: "rgba(245,245,245,0.95)",
              backdropFilter: "blur(8px)",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", gap: "5px" }}>
              {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
                <div
                  key={c}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: c,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                flex: 1,
                background: "#fff",
                borderRadius: "6px",
                padding: "3px 10px",
                fontSize: "10px",
                color: "#6B7280",
                border: "1px solid rgba(0,0,0,0.08)",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {demo.url}
            </div>
          </div>
          {/* Badge */}
          {demo.badge && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                right: "12px",
                background: "#1d9e75",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: "980px",
              }}
            >
              {demo.badge}
            </div>
          )}
          {/* Business name on image */}
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "16px",
              right: "16px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: demo.color,
                color: "#fff",
                fontSize: "11px",
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: "980px",
                marginBottom: "8px",
              }}
            >
              {demo.category}
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              {demo.name}
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}>
              {demo.city}
            </div>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "20px 24px 24px" }}>
          <p
            style={{
              fontSize: "14px",
              color: "#6B7280",
              lineHeight: 1.65,
              marginBottom: "16px",
            }}
          >
            {demo.desc}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "#1d9e75",
              fontWeight: 600,
            }}
          >
            Voir la démo
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
