"use client"

import { useEffect, useState } from "react"

const WA_MAIN = "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F"

type DemoType = "Tous" | "Café" | "Boulangerie" | "Barbershop" | "Restaurant" | "Manucure" | "Spa"

const demos = [
  {
    name: "Spa Essence",
    type: "Spa",
    city: "Genève",
    badge: "⭐ Plus populaire",
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    features: ["Réservation soins", "Carte fidélité", "Packages"],
    link: "https://loyalty-cards-rho.vercel.app/lessence-spa.html",
    external: true,
  },
  {
    name: "Café Lumière",
    type: "Café",
    city: "Genève",
    badge: null,
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    features: ["Réservation table", "Pré-commande", "Carte fidélité"],
    link: "/demos/cafe-lumiere.html",
    external: false,
  },
  {
    name: "Black Scissors",
    type: "Barbershop",
    city: "Genève",
    badge: null,
    img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    features: ["Réservation coupe", "Carte VIP", "Galerie"],
    link: "/demos/black-scissors.html",
    external: false,
  },
  {
    name: "Bistrot du Coin",
    type: "Restaurant",
    city: "Fribourg",
    badge: null,
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    features: ["Résa table", "Carte des vins", "Menu QR · Fidélité"],
    link: "/demos/bistrot-du-coin.html",
    external: false,
  },
  {
    name: "Boulangerie Martin",
    type: "Boulangerie",
    city: "Lausanne",
    badge: null,
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    features: ["Commande en ligne", "Retrait QR code", "Fidélité"],
    link: "/demos/boulangerie-martin.html",
    external: false,
  },
  {
    name: "Nail Studio",
    type: "Manucure",
    city: "Lausanne",
    badge: null,
    img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
    features: ["Prise de RDV", "Galerie poses", "Carte récompenses"],
    link: "/demos/nail-studio.html",
    external: false,
  },
]

const FILTERS: DemoType[] = ["Tous", "Café", "Boulangerie", "Barbershop", "Restaurant", "Manucure", "Spa"]

export default function DemosPage() {
  const [activeFilter, setActiveFilter] = useState<DemoType>("Tous")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll<HTMLElement>('.demo-card-parallax')
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect()
        const centerY = rect.top + rect.height / 2 - window.innerHeight / 2
        const offset = centerY * 0.04 * (i % 2 === 0 ? 1 : -1)
        card.style.transform = `translateY(${offset}px)`
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filtered = activeFilter === "Tous" ? demos : demos.filter(d => d.type === activeFilter)

  return (
    <>
      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .demo-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.10) !important;
        }
        .demo-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .filter-pill {
          transition: background 0.2s ease, color 0.2s ease;
          border: none;
          font-family: inherit;
          cursor: pointer;
        }
        @media (max-width: 700px) {
          .hero-title { font-size: 40px !important; }
          .hero-subtitle { font-size: 17px !important; }
          .section-pad { padding: 80px 24px !important; }
          .cta-title { font-size: 32px !important; }
          .btn-row { flex-direction: column !important; align-items: stretch !important; }
          .filter-row { flex-wrap: wrap !important; justify-content: center !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section style={{ background: "#ffffff", padding: "140px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h1 className="fade-up hero-title" style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#1d1d1f",
            margin: "0 0 20px",
            lineHeight: 1.05,
          }}>
            Voyez ce qu&apos;on peut faire pour votre commerce.
          </h1>

          <p className="fade-up hero-subtitle" style={{
            fontSize: 21,
            color: "#6e6e73",
            maxWidth: 640,
            margin: "0 auto 40px",
            lineHeight: 1.5,
          }}>
            6 exemples réels. À vos couleurs. Livré en 48h.
          </p>

          {/* CTA Buttons */}
          <div className="fade-up btn-row" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={WA_MAIN}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#1d1d1f",
                color: "#ffffff",
                borderRadius: 980,
                padding: "14px 28px",
                fontSize: 17,
                fontWeight: 500,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Obtenir mon site — 990 CHF
            </a>
            <a
              href="/v3/tarif"
              style={{
                background: "transparent",
                color: "#0071e3",
                borderRadius: 980,
                padding: "14px 28px",
                fontSize: 17,
                fontWeight: 500,
                textDecoration: "none",
                border: "1px solid #0071e3",
                whiteSpace: "nowrap",
              }}
            >
              Voir le tarif
            </a>
          </div>
        </div>
      </section>

      {/* ── Filter + Cards ── */}
      <section className="section-pad" style={{ background: "#f5f5f7", padding: "180px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Filter pills */}
          <div className="filter-row" style={{
            display: "flex",
            flexDirection: "row",
            gap: 8,
            justifyContent: "center",
            marginBottom: 40,
            flexWrap: "nowrap",
          }}>
            {FILTERS.map(filter => (
              <button
                key={filter}
                className="filter-pill"
                onClick={() => setActiveFilter(filter)}
                style={{
                  background: activeFilter === filter ? "#1d1d1f" : "#ffffff",
                  color: activeFilter === filter ? "#ffffff" : "#6e6e73",
                  borderRadius: 980,
                  padding: "8px 18px",
                  fontSize: 14,
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}>
            {filtered.map((demo) => (
              <div
                key={demo.name}
                className="fade-up demo-card demo-card-parallax"
                style={{
                  background: "#ffffff",
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
                }}
              >
                {/* Image */}
                <div style={{ position: "relative" }}>
                  <img
                    src={demo.img}
                    alt={demo.name}
                    loading="lazy"
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {demo.badge && (
                    <div style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background: "#1d9e75",
                      color: "#ffffff",
                      borderRadius: 980,
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                    }}>
                      {demo.badge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: 24 }}>
                  {/* Type pill */}
                  <div style={{
                    display: "inline-block",
                    background: "#e8f4fd",
                    color: "#0071e3",
                    borderRadius: 980,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    marginBottom: 10,
                  }}>
                    {demo.type}
                  </div>

                  <h3 style={{ fontSize: 19, fontWeight: 600, color: "#1d1d1f", margin: "0 0 4px" }}>
                    {demo.name}
                  </h3>
                  <p style={{ fontSize: 15, color: "#6e6e73", margin: "0 0 12px" }}>
                    {demo.city}
                  </p>

                  {/* Features */}
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
                    {demo.features.map((f, i) => (
                      <li key={i} style={{ fontSize: 13, color: "#6e6e73", marginBottom: 4 }}>
                        · {f}
                      </li>
                    ))}
                  </ul>

                  {/* Demo button */}
                  <a
                    href={demo.link}
                    target={demo.external ? "_blank" : undefined}
                    rel={demo.external ? "noopener noreferrer" : undefined}
                    style={{
                      display: "inline-block",
                      background: "transparent",
                      color: "#0071e3",
                      borderRadius: 980,
                      padding: "8px 16px",
                      fontSize: 14,
                      fontWeight: 500,
                      textDecoration: "none",
                      border: "1px solid #0071e3",
                    }}
                  >
                    Voir la démo interactive →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ background: "#ffffff", padding: "180px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 className="fade-up cta-title" style={{
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#1d1d1f",
            margin: "0 0 20px",
            lineHeight: 1.1,
          }}>
            Votre commerce n&apos;est pas dans la liste ?
          </h2>

          <p className="fade-up" style={{
            fontSize: 16,
            color: "#6e6e73",
            maxWidth: 600,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}>
            On fait des sites pour tous les commerces locaux en Suisse romande : fleuristes, pharmacies, boutiques, kinésithérapeutes, coiffeurs, tatoueurs... Contactez-nous et on vous montre ce qu&apos;on ferait pour vous spécifiquement.
          </p>

          <div className="fade-up btn-row" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
            <a
              href={WA_MAIN}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#1d1d1f",
                color: "#ffffff",
                borderRadius: 980,
                padding: "14px 28px",
                fontSize: 17,
                fontWeight: 500,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Obtenir mon site en 48h — 990 CHF →
            </a>
            <a
              href="/v3/tarif"
              style={{
                background: "transparent",
                color: "#0071e3",
                borderRadius: 980,
                padding: "14px 28px",
                fontSize: 17,
                fontWeight: 500,
                textDecoration: "none",
                border: "1px solid #0071e3",
                whiteSpace: "nowrap",
              }}
            >
              Voir le tarif
            </a>
          </div>

          <p className="fade-up" style={{ fontSize: 13, color: "#6e6e73", margin: 0 }}>
            📱 Réponse sous 2h · 7j/7
          </p>
        </div>
      </section>
    </>
  )
}
