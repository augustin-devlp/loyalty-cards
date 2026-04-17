"use client";

import Link from "next/link";
import { useRef } from "react";

const cards = [
  { name: "Boulangerie du Valentin", city: "Lausanne", type: "Boulangerie", note: "4.9", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80", href: "#" },
  { name: "Café Lumière", city: "Genève", type: "Café", note: "5.0", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80", href: "#" },
  { name: "Best Cut Barbershop", city: "Fribourg", type: "Barbier", note: "4.8", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80", href: "#" },
  { name: "Institut Rose", city: "Nyon", type: "Institut beauté", note: "4.7", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80", href: "#" },
  { name: "Pizzeria Da Marco", city: "Morges", type: "Restaurant", note: "4.9", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80", href: "#" },
  { name: "L'Essence Spa", city: "Lausanne", type: "Spa", note: "4.8", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80", href: "/lessence-spa.html", live: true },
];

export default function DemosPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <main style={{ paddingTop: 68 }}>
      {/* Header */}
      <section style={{ background: "#FBF8F3", padding: "80px 24px", textAlign: "center" }}>
        <span style={{
          display: "inline-block",
          background: "#E8F8F3", color: "#1d9e75",
          borderRadius: 50, padding: "6px 14px",
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 13, fontWeight: 500,
          marginBottom: 20,
        }}>Nos réalisations</span>
        <h1 style={{
          fontFamily: "var(--font-fraunces), serif",
          fontWeight: 900,
          fontSize: "clamp(36px, 5vw, 56px)",
          color: "#0f172a",
          lineHeight: 1.1,
          marginBottom: 20,
        }}>
          Des sites créés pour nos clients.
        </h1>
        <p style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 18, color: "#64748b",
          maxWidth: 520, margin: "0 auto",
          lineHeight: 1.7,
        }}>
          Chaque site est livré en 48h avec carte fidélité, SEO local et hébergement inclus.
        </p>
      </section>

      {/* L'Essence Spa iframe */}
      <section style={{ background: "#fff", padding: "40px 24px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 13, color: "#94a3b8",
            textAlign: "center", marginBottom: 16,
          }}>
            Exemple en direct · L&rsquo;Essence Spa · Lausanne
          </p>
          <div style={{
            borderRadius: "12px 12px 8px 8px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.08), 0 40px 80px rgba(0,0,0,0.06)",
          }}>
            <div style={{
              height: 36, background: "#E8E8E8",
              display: "flex", alignItems: "center", padding: "0 14px", gap: 8,
            }}>
              <div style={{ display: "flex", gap: 5 }}>
                {["#ef4444","#f59e0b","#22c55e"].map((c,i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{
                flex: 1, background: "#fff", borderRadius: 6, height: 22,
                display: "flex", alignItems: "center", paddingLeft: 10,
                fontSize: 11, color: "#9ca3af",
                fontFamily: "var(--font-dm-sans), sans-serif",
              }}>
                lessence-spa.stampify.ch
              </div>
            </div>
            <iframe
              src="/lessence-spa.html"
              width="100%"
              height="600"
              style={{ border: "none", display: "block" }}
              loading="lazy"
              title="L'Essence Spa"
            />
          </div>
        </div>
      </section>

      {/* Scroll gallery */}
      <section style={{ background: "#FBF8F3", paddingBottom: 120 }}>
        <div style={{ padding: "0 24px 32px", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 700,
            fontSize: "clamp(24px, 3vw, 36px)",
            color: "#0f172a",
          }}>D&rsquo;autres exemples.</h2>
        </div>

        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: 20,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            padding: "24px 40px",
          }}
        >
          {cards.map((card, i) => (
            <div key={i} style={{
              minWidth: 320,
              flexShrink: 0,
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              scrollSnapAlign: "start",
              transition: "transform 0.2s",
              cursor: card.href !== "#" ? "pointer" : "default",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.img}
                alt={card.name}
                style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{
                      fontFamily: "var(--font-fraunces), serif",
                      fontWeight: 600, fontSize: 18,
                      color: "#0f172a", marginBottom: 4,
                    }}>{card.name}</div>
                    <div style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 13, color: "#94a3b8",
                    }}>{card.city} · {card.type}</div>
                  </div>
                  {"live" in card && card.live && (
                    <span style={{
                      background: "#E8F8F3", color: "#1d9e75",
                      borderRadius: 50, padding: "3px 10px",
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 11, fontWeight: 500,
                      flexShrink: 0,
                    }}>En direct</span>
                  )}
                </div>
                <div style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: 14, color: "#1d9e75", fontWeight: 500,
                  marginBottom: 12,
                }}>★ {card.note}</div>
                {card.href !== "#" ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 14, fontWeight: 500,
                      color: "#1d9e75",
                      textDecoration: "none",
                    }}
                  >
                    Voir le site →
                  </a>
                ) : (
                  <span style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: 14, color: "#94a3b8",
                  }}>Bientôt disponible</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 13, color: "#94a3b8",
          textAlign: "center", marginTop: 16,
        }}>
          ← Fais défiler pour voir plus →
        </p>
      </section>

      {/* CTA */}
      <section style={{ background: "#1d9e75", padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{
          fontFamily: "var(--font-fraunces), serif",
          fontWeight: 700,
          fontSize: "clamp(26px, 3.5vw, 40px)",
          color: "#fff",
          marginBottom: 32,
        }}>
          Tu veux le même pour ton commerce ?
        </h2>
        <Link href="https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20d%C3%A9marrer%20avec%20Stampify%20%28990%20CHF%29." style={{
          background: "#fff", color: "#1d9e75",
          borderRadius: 10, padding: "16px 32px",
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 16, fontWeight: 500,
          textDecoration: "none",
          display: "inline-block",
        }}>
          Démarrer pour 990 CHF
        </Link>
      </section>
    </main>
  );
}
