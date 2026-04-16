"use client";

import { useEffect, useRef } from "react";

const TESTIMONIALS = [
  {
    name: "Sophie M.",
    role: "Gérante, Café Lumière · Genève",
    avatar: "SM",
    rating: 5,
    text: "Stampify m'a livré en 2 jours ce que j'ai abandonné après 3h sur Wix. Mon site est beau, ma carte fidélité fonctionne, et mes clients reviennent. C'est exactement ce dont j'avais besoin.",
  },
  {
    name: "Thomas R.",
    role: "Propriétaire, Black Scissors · Fribourg",
    avatar: "TR",
    rating: 5,
    text: "La plaquette NFC en bois est magnifique. Mes clients adorent scanner et voir leur carte fidélité s'ouvrir instantanément. Plus besoin de cartes papier perdues. Je recommande à 100%.",
  },
  {
    name: "Marie-Claire D.",
    role: "Directrice, Spa Essence · Genève",
    avatar: "MC",
    rating: 5,
    text: "Le SEO local a changé la donne. En un mois, j'apparaissais en première position sur 'spa Genève'. Et les campagnes SMS ? +30% de retours sur ma dernière promo. Impressionnant.",
  },
];

export default function Testimonials() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    refs.current.forEach((el) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("v2-visible");
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const delays = ["v2-d1", "v2-d2", "v2-d3"];

  return (
    <div className="v2-testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
      {TESTIMONIALS.map((t, i) => (
        <div
          key={t.name}
          ref={el => { refs.current[i] = el; }}
          className={`v2-animate ${delays[i]}`}
          style={{
            background: "#fff", border: "1px solid #E5E7EB",
            borderRadius: 16, padding: 28,
            display: "flex", flexDirection: "column", gap: 16,
          }}
        >
          {/* Stars */}
          <div style={{ color: "#F59E0B", fontSize: 16, letterSpacing: 2 }}>
            {"★".repeat(t.rating)}
          </div>

          {/* Quote */}
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.65, flex: 1, fontStyle: "italic" }}>
            &ldquo;{t.text}&rdquo;
          </p>

          {/* Author */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "linear-gradient(135deg, #1d9e75, #0D7A5A)",
              color: "#fff", fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {t.avatar}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>{t.name}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>{t.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
