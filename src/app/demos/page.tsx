"use client";

import React, { useState, useEffect, useRef } from "react";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

const C = {
  bg: "#FBF8F3",
  bgAlt: "#F2EFE9",
  green: "#1d9e75",
  text: "#1A1A1A",
  text2: "#5C5C5C",
};

type Cat = "Tous" | "Café" | "Boulangerie" | "Barbershop" | "Restaurant" | "Manucure" | "Spa";

interface Demo {
  name: string;
  city: string;
  cat: Cat;
  badge?: string;
  img: string;
  href: string;
}

const DEMOS: Demo[] = [
  {
    name: "Spa Essence",
    city: "Genève",
    cat: "Spa",
    badge: "⭐ Le plus demandé",
    img: "photo-1540555700478-4be289fbecef",
    href: "https://loyalty-cards-rho.vercel.app/lessence-spa.html",
  },
  {
    name: "Café Lumière",
    city: "Genève",
    cat: "Café",
    img: "photo-1509042239860-f550ce710b93",
    href: "#",
  },
  {
    name: "Bistrot du Coin",
    city: "Neuchâtel",
    cat: "Restaurant",
    img: "photo-1414235077428-338989a2e8c0",
    href: "#",
  },
  {
    name: "Boulangerie Martin",
    city: "Lausanne",
    cat: "Boulangerie",
    img: "photo-1509440159596-0249088772ff",
    href: "#",
  },
  {
    name: "Black Scissors",
    city: "Fribourg",
    cat: "Barbershop",
    img: "photo-1503951914875-452162b0f3f1",
    href: "#",
  },
  {
    name: "Nail Studio Rose",
    city: "Lausanne",
    cat: "Manucure",
    img: "photo-1604654894610-df63bc536371",
    href: "#",
  },
];

const FILTERS: Cat[] = ["Tous", "Café", "Boulangerie", "Barbershop", "Restaurant", "Manucure", "Spa"];

function DemoCard({ demo, delay }: { demo: Demo; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const [arrowHovered, setArrowHovered] = useState(false);

  return (
    <div
      className="fade-up"
      style={{
        backgroundColor: "white",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 12px 40px rgba(0,0,0,0.1)"
          : "0 4px 24px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transitionDelay: `${delay}s`,
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 4:3 image */}
      <div style={{ position: "relative", paddingBottom: "75%", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://images.unsplash.com/${demo.img}?auto=format&fit=crop&w=400&q=80`}
          alt={demo.name}
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* Body */}
      <div style={{ padding: 20 }}>
        {demo.badge && (
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#E8F7F2",
              color: C.green,
              fontSize: 11,
              borderRadius: 980,
              padding: "4px 12px",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            {demo.badge}
          </div>
        )}

        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: C.text,
            lineHeight: 1.3,
            marginBottom: 4,
          }}
        >
          {demo.name}
        </div>

        <div
          style={{
            fontSize: 14,
            color: C.text2,
            marginBottom: 12,
          }}
        >
          {demo.city} · {demo.cat}
        </div>

        <a
          href={demo.href}
          target={demo.href !== "#" ? "_blank" : undefined}
          rel={demo.href !== "#" ? "noopener noreferrer" : undefined}
          style={{
            display: "inline-block",
            fontSize: 14,
            color: C.green,
            fontWeight: 500,
            textDecoration: "none",
          }}
          onMouseEnter={() => setArrowHovered(true)}
          onMouseLeave={() => setArrowHovered(false)}
        >
          Voir la démo{" "}
          <span
            style={{
              display: "inline-block",
              transform: arrowHovered ? "translateX(4px)" : "translateX(0)",
              transition: "transform 0.2s ease",
            }}
          >
            →
          </span>
        </a>

        <div style={{ fontSize: 11, color: C.text2, marginTop: 8 }}>
          Photo : Unsplash
        </div>
      </div>
    </div>
  );
}

export default function DemosPage() {
  const [activeFilter, setActiveFilter] = useState<Cat>("Tous");
  const pageRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeFilter === "Tous" ? DEMOS : DEMOS.filter((d) => d.cat === activeFilter);

  // Observe fade-up elements on mount
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

  // Re-observe new cards after filter change
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
  }, [activeFilter]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
        }

        .fade-up {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .fade-up.visible {
          opacity: 1;
          transform: translateY(0) !important;
        }

        @media (max-width: 768px) {
          .demos-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-title {
            font-size: 40px !important;
          }
        }
      `}</style>

      <div
        ref={pageRef}
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          backgroundColor: C.bg,
          color: C.text,
          minHeight: "100vh",
        }}
      >
        {/* ── HERO ── */}
        <section
          style={{
            backgroundColor: C.bg,
            padding: "120px 20px 80px",
            textAlign: "center",
          }}
        >
          {/* Badge pill */}
          <div
            className="fade-up"
            style={{
              display: "inline-block",
              backgroundColor: "#E8F7F2",
              color: C.green,
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 980,
              padding: "6px 18px",
              marginBottom: 24,
            }}
          >
            ✦ 6 exemples réels
          </div>

          {/* Title */}
          <h1
            className="fade-up hero-title"
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: C.text,
              margin: "0 0 20px",
              lineHeight: 1.1,
              transitionDelay: "0.08s",
            }}
          >
            Voyez ce qu&apos;on peut faire.
          </h1>

          {/* Subtitle */}
          <p
            className="fade-up"
            style={{
              fontSize: 19,
              color: C.text2,
              margin: "0 auto 40px",
              maxWidth: 540,
              lineHeight: 1.5,
              transitionDelay: "0.16s",
            }}
          >
            6 exemples réels. Fonctionnels. Personnalisés. Livrés en 48h.
          </p>

          {/* CTA buttons */}
          <div
            className="fade-up"
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              transitionDelay: "0.24s",
            }}
          >
            <a
              href={WA_MAIN}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                backgroundColor: C.green,
                color: "white",
                fontSize: 15,
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: 980,
                textDecoration: "none",
                transition: "opacity 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            >
              Obtenir mon site — 990 CHF
            </a>

            <a
              href="/tarif"
              style={{
                display: "inline-block",
                backgroundColor: "transparent",
                color: C.text,
                fontSize: 15,
                fontWeight: 600,
                padding: "13px 28px",
                borderRadius: 980,
                textDecoration: "none",
                border: `2px solid ${C.text}`,
                transition: "background-color 0.2s ease, color 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.backgroundColor = C.text;
                el.style.color = "white";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.backgroundColor = "transparent";
                el.style.color = C.text;
              }}
            >
              Voir le tarif
            </a>
          </div>
        </section>

        {/* ── FILTER PILLS ── */}
        <section
          style={{
            backgroundColor: C.bgAlt,
            padding: "24px 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {FILTERS.map((f) => {
              const isActive = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    backgroundColor: isActive ? C.text : C.bg,
                    color: isActive ? "white" : C.text2,
                    fontSize: 14,
                    fontWeight: 500,
                    padding: "8px 20px",
                    borderRadius: 980,
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease, color 0.2s ease",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── DEMOS GRID ── */}
        <section
          style={{
            backgroundColor: C.bg,
            padding: "80px 20px",
          }}
        >
          <div
            className="demos-grid"
            style={{
              maxWidth: 900,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {filtered.map((demo, i) => (
              <DemoCard key={demo.name} demo={demo} delay={i * 0.06} />
            ))}
          </div>
        </section>

        {/* ── CTA SECTION ── */}
        <section
          style={{
            backgroundColor: C.bgAlt,
            padding: "80px 20px",
            textAlign: "center",
          }}
        >
          <h2
            className="fade-up"
            style={{
              fontSize: 21,
              fontWeight: 700,
              color: C.text,
              margin: "0 0 12px",
            }}
          >
            Votre commerce n&apos;est pas dans la liste&nbsp;?
          </h2>

          <p
            className="fade-up"
            style={{
              fontSize: 17,
              color: C.text2,
              margin: "0 auto 32px",
              maxWidth: 480,
              lineHeight: 1.55,
              transitionDelay: "0.1s",
            }}
          >
            On crée votre site sur mesure en 48h, quel que soit votre secteur.
          </p>

          <div className="fade-up" style={{ transitionDelay: "0.18s" }}>
            <a
              href={WA_MAIN}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                backgroundColor: C.green,
                color: "white",
                fontSize: 15,
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: 980,
                textDecoration: "none",
                transition: "opacity 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            >
              Obtenir mon site — 990 CHF
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
