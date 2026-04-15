"use client";

import { useState, useEffect, useRef } from "react";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

type Category = "Tous" | "Café" | "Spa" | "Barbershop" | "Restaurant" | "Boulangerie" | "Manucure";

interface Demo {
  name: string;
  type: Category;
  city: string;
  badge?: string;
  img: string;
  link: string;
  external?: boolean;
  features: string[];
}

const demos: Demo[] = [
  {
    name: "Spa Essence",
    type: "Spa",
    city: "Genève",
    badge: "⭐ Plus populaire",
    img: "photo-1540555700478-4be289fbecef",
    link: "https://loyalty-cards-rho.vercel.app/lessence-spa.html",
    external: true,
    features: ["Réservation soins", "Carte fidélité", "Packages"],
  },
  {
    name: "Café Lumière",
    type: "Café",
    city: "Genève",
    img: "photo-1495474472287-4d71bcdd2085",
    link: "/demos/cafe-lumiere.html",
    features: ["Réservation table", "Pré-commande", "Carte fidélité"],
  },
  {
    name: "Black Scissors",
    type: "Barbershop",
    city: "Genève",
    img: "photo-1503951914875-452162b0f3f1",
    link: "/demos/black-scissors.html",
    features: ["Réservation coupe", "Carte VIP", "Galerie"],
  },
  {
    name: "Bistrot du Coin",
    type: "Restaurant",
    city: "Fribourg",
    img: "photo-1414235077428-338989a2e8c0",
    link: "/demos/bistrot-du-coin.html",
    features: ["Résa table", "Carte des vins", "Menu QR · Fidélité"],
  },
  {
    name: "Boulangerie Martin",
    type: "Boulangerie",
    city: "Lausanne",
    img: "photo-1509440159596-0249088772ff",
    link: "/demos/boulangerie-martin.html",
    features: ["Commande en ligne", "Retrait QR code", "Fidélité"],
  },
  {
    name: "Nail Studio",
    type: "Manucure",
    city: "Lausanne",
    img: "photo-1604654894610-df63bc536371",
    link: "/demos/nail-studio.html",
    features: ["Prise de RDV", "Galerie poses", "Carte récompenses"],
  },
];

const categories: Category[] = [
  "Tous",
  "Café",
  "Spa",
  "Barbershop",
  "Restaurant",
  "Boulangerie",
  "Manucure",
];

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-up-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const targets = el.querySelectorAll<HTMLElement>(".fade-up");
    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function DemosPage() {
  const [active, setActive] = useState<Category>("Tous");
  const sectionRef = useFadeUp();

  const filtered =
    active === "Tous" ? demos : demos.filter((d) => d.type === active);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fafaf8;
          color: #1a1a1a;
          -webkit-font-smoothing: antialiased;
        }

        .page-wrap {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1a1a1a;
        }

        /* Hero */
        .hero {
          background: #fafaf8;
          padding: 140px 24px 80px;
          text-align: center;
        }

        .hero-inner {
          max-width: 860px;
          margin: 0 auto;
        }

        .hero h1 {
          font-size: 72px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.08;
          color: #1a1a1a;
          margin-bottom: 24px;
        }

        .hero-subtitle {
          font-size: 21px;
          color: #555555;
          margin-bottom: 40px;
          line-height: 1.5;
        }

        .cta-row {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-green {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1d9e75;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          padding: 16px 32px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }

        .btn-green:hover {
          background: #179067;
          transform: translateY(-1px);
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: #1d9e75;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          padding: 16px 32px;
          border-radius: 100px;
          border: 1.5px solid #1d9e75;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }

        .btn-outline:hover {
          background: #e8f6f1;
          transform: translateY(-1px);
        }

        /* Cards section */
        .cards-section {
          background: #f4f4f2;
          padding: 80px 24px;
        }

        .cards-inner {
          max-width: 860px;
          margin: 0 auto;
        }

        /* Filter pills */
        .filter-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }

        .filter-pill {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 8px 20px;
          border-radius: 100px;
          border: 1.5px solid #d0d0cc;
          background: transparent;
          color: #555555;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }

        .filter-pill:hover {
          border-color: #1d9e75;
          color: #1d9e75;
        }

        .filter-pill.active {
          background: #1d9e75;
          border-color: #1d9e75;
          color: #fff;
        }

        /* Grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        /* Card */
        .demo-card {
          background: #fff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          transition: transform 0.22s, box-shadow 0.22s;
          display: flex;
          flex-direction: column;
        }

        .demo-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
        }

        .card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          overflow: hidden;
        }

        .card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s;
        }

        .demo-card:hover .card-img-wrap img {
          transform: scale(1.04);
        }

        .card-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #1d9e75;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 100px;
          z-index: 2;
        }

        .card-body {
          padding: 20px 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .type-pill {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 100px;
          background: #e8f6f1;
          color: #1d9e75;
        }

        .card-city {
          font-size: 13px;
          color: #555555;
          font-weight: 500;
        }

        .card-name {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .card-features {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .feature-tag {
          font-size: 12px;
          font-weight: 600;
          color: #555555;
          background: #f4f4f2;
          border-radius: 6px;
          padding: 4px 10px;
        }

        .card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #1d9e75;
          background: transparent;
          border: 1.5px solid #1d9e75;
          border-radius: 100px;
          padding: 10px 20px;
          text-decoration: none;
          transition: background 0.18s, transform 0.15s;
          margin-top: auto;
          align-self: flex-start;
        }

        .card-cta:hover {
          background: #e8f6f1;
          transform: translateY(-1px);
        }

        /* CTA section */
        .cta-section {
          background: #fafaf8;
          padding: 140px 24px;
          text-align: center;
        }

        .cta-inner {
          max-width: 860px;
          margin: 0 auto;
        }

        .cta-section h2 {
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.12;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        .cta-section p {
          font-size: 18px;
          color: #555555;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        /* Fade-up animation */
        .fade-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .fade-up-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 700px) {
          .hero h1 {
            font-size: 40px;
          }

          .cta-section h2 {
            font-size: 32px;
          }

          .hero {
            padding: 100px 20px 60px;
          }

          .cta-section {
            padding: 100px 20px;
          }

          .cards-section {
            padding: 60px 20px;
          }
        }
      `}</style>

      <div className="page-wrap" ref={sectionRef}>
        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            <h1 className="fade-up">
              Voyez ce qu&apos;on peut faire pour votre commerce.
            </h1>
            <p className="hero-subtitle fade-up" style={{ transitionDelay: "0.08s" }}>
              6 exemples réels. À vos couleurs. Livré en 48h.
            </p>
            <div className="cta-row fade-up" style={{ transitionDelay: "0.16s" }}>
              <a href={WA_MAIN} target="_blank" rel="noopener noreferrer" className="btn-green">
                Obtenir mon site — 990 CHF
              </a>
              <a href="/v4/tarif" className="btn-outline">
                Voir le tarif
              </a>
            </div>
          </div>
        </section>

        {/* Cards section */}
        <section className="cards-section">
          <div className="cards-inner">
            {/* Filter pills */}
            <div className="filter-row fade-up">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill${active === cat ? " active" : ""}`}
                  onClick={() => setActive(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="cards-grid">
              {filtered.map((demo, i) => (
                <div
                  key={demo.name}
                  className="demo-card fade-up"
                  style={{ transitionDelay: `${i * 0.07}s` }}
                >
                  <div className="card-img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://images.unsplash.com/${demo.img}?auto=format&fit=crop&w=600&q=80`}
                      alt={demo.name}
                      loading="lazy"
                    />
                    {demo.badge && (
                      <span className="card-badge">{demo.badge}</span>
                    )}
                  </div>

                  <div className="card-body">
                    <div className="card-meta">
                      <span className="type-pill">{demo.type}</span>
                      <span className="card-city">{demo.city}</span>
                    </div>

                    <div className="card-name">{demo.name}</div>

                    <div className="card-features">
                      {demo.features.map((f) => (
                        <span key={f} className="feature-tag">
                          {f}
                        </span>
                      ))}
                    </div>

                    <a
                      href={demo.link}
                      className="card-cta"
                      {...(demo.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      Voir la démo interactive →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="cta-section">
          <div className="cta-inner">
            <h2 className="fade-up">
              Votre commerce n&apos;est pas dans la liste&nbsp;?
            </h2>
            <p className="fade-up" style={{ transitionDelay: "0.08s" }}>
              On crée votre site sur mesure, quelle que soit votre activité.
            </p>
            <div className="cta-row fade-up" style={{ transitionDelay: "0.16s" }}>
              <a href={WA_MAIN} target="_blank" rel="noopener noreferrer" className="btn-green">
                Obtenir mon site — 990 CHF
              </a>
              <a href="/v4/tarif" className="btn-outline">
                Voir le tarif
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
