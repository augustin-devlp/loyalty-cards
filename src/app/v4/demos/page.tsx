"use client";

import { useState, useEffect, useRef } from "react";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

type Category =
  | "Tous"
  | "Café"
  | "Boulangerie"
  | "Barbershop"
  | "Restaurant"
  | "Manucure"
  | "Spa";

interface Demo {
  name: string;
  type: Category;
  city: string;
  badge?: string;
  img: string;
  link: string;
  external?: boolean;
}

const demos: Demo[] = [
  {
    name: "Spa Essence",
    type: "Spa",
    city: "Genève",
    badge: "⭐ Le plus demandé",
    img: "photo-1540555700478-4be289fbecef",
    link: "https://loyalty-cards-rho.vercel.app/lessence-spa.html",
    external: true,
  },
  {
    name: "Café Lumière",
    type: "Café",
    city: "Genève",
    img: "photo-1495474472287-4d71bcdd2085",
    link: "/demos/cafe-lumiere.html",
  },
  {
    name: "Bistrot du Coin",
    type: "Restaurant",
    city: "Fribourg",
    img: "photo-1414235077428-338989a2e8c0",
    link: "/demos/bistrot-du-coin.html",
  },
  {
    name: "Boulangerie Martin",
    type: "Boulangerie",
    city: "Lausanne",
    img: "photo-1509440159596-0249088772ff",
    link: "/demos/boulangerie-martin.html",
  },
  {
    name: "Black Scissors",
    type: "Barbershop",
    city: "Genève",
    img: "photo-1503951914875-452162b0f3f1",
    link: "/demos/black-scissors.html",
  },
  {
    name: "Nail Studio",
    type: "Manucure",
    city: "Lausanne",
    img: "photo-1604654894610-df63bc536371",
    link: "/demos/nail-studio.html",
  },
];

const categories: Category[] = [
  "Tous",
  "Café",
  "Boulangerie",
  "Barbershop",
  "Restaurant",
  "Manucure",
  "Spa",
];

export default function DemosPage() {
  const [active, setActive] = useState<Category>("Tous");
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const targets = el.querySelectorAll<HTMLElement>(".fade-up");
    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, []);

  // Re-observe cards when filter changes
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const targets = el.querySelectorAll<HTMLElement>(".fade-up:not(.visible)");
    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, [active]);

  const filtered =
    active === "Tous" ? demos : demos.filter((d) => d.type === active);

  return (
    <>
      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .demos-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1a1a1a;
          background: #fafaf8;
        }

        /* Hero */
        .demos-hero {
          background: #fafaf8;
          padding: 120px 20px 80px;
          text-align: center;
        }

        .demos-hero-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .demos-hero h1 {
          font-size: 72px;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.08;
          color: #1a1a1a;
          margin-bottom: 24px;
        }

        .demos-hero-subtitle {
          font-size: 21px;
          color: #555555;
          margin-bottom: 40px;
          line-height: 1.5;
        }

        .demos-cta-row {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .demos-btn-green {
          display: inline-flex;
          align-items: center;
          background: #1d9e75;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          padding: 16px 32px;
          border-radius: 980px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }

        .demos-btn-green:hover {
          background: #17886a;
          transform: translateY(-1px);
        }

        .demos-btn-outline {
          display: inline-flex;
          align-items: center;
          background: transparent;
          color: #1d9e75;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          padding: 16px 32px;
          border-radius: 980px;
          border: 1.5px solid #1d9e75;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }

        .demos-btn-outline:hover {
          background: #e8f7f2;
          transform: translateY(-1px);
        }

        /* Filter + Cards section */
        .demos-cards-section {
          background: #f4f4f2;
          padding: 80px 20px;
        }

        .demos-cards-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .demos-filter-row {
          display: flex;
          gap: 8px;
          justify-content: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .demos-filter-pill {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 980px;
          border: none;
          background: #fff;
          color: #555555;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          white-space: nowrap;
        }

        .demos-filter-pill:hover {
          background: #e8f7f2;
          color: #1d9e75;
        }

        .demos-filter-pill.demos-active {
          background: #1d9e75;
          color: #fff;
        }

        .demos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .demos-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
          transition: transform 0.22s, box-shadow 0.22s;
          display: flex;
          flex-direction: column;
        }

        .demos-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.10);
        }

        .demos-card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
        }

        .demos-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .demos-card-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #1d9e75;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 980px;
          z-index: 2;
        }

        .demos-card-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .demos-type-pill {
          display: inline-block;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 980px;
          background: #e8f7f2;
          color: #1d9e75;
          align-self: flex-start;
        }

        .demos-card-name {
          font-size: 17px;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1.3;
        }

        .demos-card-city {
          font-size: 13px;
          color: #555555;
        }

        .demos-card-link {
          display: inline-block;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #1d9e75;
          text-decoration: none;
          margin-top: 4px;
        }

        .demos-card-link:hover {
          text-decoration: underline;
        }

        /* CTA section */
        .demos-cta-section {
          background: #fafaf8;
          padding: 120px 20px;
          text-align: center;
        }

        .demos-cta-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .demos-cta-section h2 {
          font-size: 48px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.12;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        .demos-cta-section p {
          font-size: 16px;
          color: #555555;
          margin-bottom: 40px;
          line-height: 1.6;
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 700px) {
          .demos-hero h1 {
            font-size: 42px;
          }
          .demos-hero {
            padding: 100px 20px 60px;
          }
          .demos-cta-section h2 {
            font-size: 32px;
          }
          .demos-cta-section {
            padding: 80px 20px;
          }
        }
      `}</style>

      <div className="demos-page" ref={pageRef}>
        {/* Hero */}
        <section className="demos-hero">
          <div className="demos-hero-inner">
            <h1 className="fade-up">Voyez ce qu&apos;on peut faire.</h1>
            <p
              className="demos-hero-subtitle fade-up"
              style={{ transitionDelay: "0.1s" }}
            >
              6 exemples réels. Fonctionnels. À vos couleurs. En 48h.
            </p>
            <div
              className="demos-cta-row fade-up"
              style={{ transitionDelay: "0.2s" }}
            >
              <a
                href={WA_MAIN}
                target="_blank"
                rel="noopener noreferrer"
                className="demos-btn-green"
              >
                Obtenir mon site — 990 CHF
              </a>
              <a href="/v4/tarif" className="demos-btn-outline">
                Voir le tarif
              </a>
            </div>
          </div>
        </section>

        {/* Filter + Cards */}
        <section className="demos-cards-section">
          <div className="demos-cards-inner">
            <div className="demos-filter-row fade-up">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`demos-filter-pill${
                    active === cat ? " demos-active" : ""
                  }`}
                  onClick={() => setActive(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="demos-grid">
              {filtered.map((demo, i) => (
                <div
                  key={demo.name}
                  className="demos-card fade-up"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className="demos-card-img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://images.unsplash.com/${demo.img}?w=600&q=80`}
                      alt={demo.name}
                      loading="lazy"
                    />
                    {demo.badge && (
                      <span className="demos-card-badge">{demo.badge}</span>
                    )}
                  </div>

                  <div className="demos-card-body">
                    <span className="demos-type-pill">{demo.type}</span>
                    <div className="demos-card-name">{demo.name}</div>
                    <div className="demos-card-city">{demo.city}</div>
                    <a
                      href={demo.link}
                      className="demos-card-link"
                      {...(demo.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      Voir la démo →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="demos-cta-section">
          <div className="demos-cta-inner">
            <h2 className="fade-up">
              Votre commerce n&apos;est pas dans la liste&nbsp;?
            </h2>
            <p className="fade-up" style={{ transitionDelay: "0.1s" }}>
              On fait des sites pour tous les commerces locaux. Quel que soit
              votre secteur, on s&apos;adapte à vos couleurs et votre
              identité — livré en 48h.
            </p>
            <div
              className="demos-cta-row fade-up"
              style={{ transitionDelay: "0.2s" }}
            >
              <a
                href={WA_MAIN}
                target="_blank"
                rel="noopener noreferrer"
                className="demos-btn-green"
              >
                Obtenir mon site — 990 CHF
              </a>
              <a href="/v4/tarif" className="demos-btn-outline">
                Voir le tarif
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
