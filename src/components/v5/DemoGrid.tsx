"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const DEMOS = [
  {
    name: "Spa Essence",
    city: "Genève",
    category: "Spa & Bien-être",
    imgId: "photo-1540555700478-4be289fbecef",
    badge: "⭐ Le plus demandé",
    domain: "spa-essence.stampify.ch",
  },
  {
    name: "Café Lumière",
    city: "Genève",
    category: "Café & Restauration",
    imgId: "photo-1495474472287-4d71bcdd2085",
    badge: null,
    domain: "cafe-lumiere.stampify.ch",
  },
  {
    name: "Le Comptoir",
    city: "Lausanne",
    category: "Restaurant",
    imgId: "photo-1414235077428-338989a2e8c0",
    badge: null,
    domain: "le-comptoir.stampify.ch",
  },
  {
    name: "Boulangerie Martin",
    city: "Lausanne",
    category: "Boulangerie",
    imgId: "photo-1556742049-0cfed4f6a45d",
    badge: null,
    domain: "boulangerie-martin.stampify.ch",
  },
  {
    name: "Black Scissors",
    city: "Fribourg",
    category: "Coiffure",
    imgId: "photo-1503951914875-452162b0f3f1",
    badge: null,
    domain: "black-scissors.stampify.ch",
  },
  {
    name: "Nail Studio Rose",
    city: "Lausanne",
    category: "Beauté & Ongles",
    imgId: "photo-1604902396020-c7b77965a820",
    badge: null,
    domain: "nail-studio-rose.stampify.ch",
  },
];

const UNSPLASH_KEY = "kGAMBUPNPxPJAEHSdIqL3qwT3b_n4T-LTmHAzgOsKzw";

export default function DemoGrid() {
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
        { threshold: 0.1 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const delays = ["v2-d1", "v2-d2", "v2-d3", "v2-d4", "v2-d5", "v2-d6"];

  return (
    <div className="v2-demo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
      {DEMOS.map((demo, i) => (
        <div
          key={demo.name}
          ref={el => { refs.current[i] = el; }}
          className={`v2-animate ${delays[i]}`}
          style={{
            borderRadius: 16, overflow: "hidden",
            border: "1px solid #E5E7EB",
            background: "#fff",
            transition: "box-shadow 0.2s, transform 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.12)";
            e.currentTarget.style.transform = "translateY(-4px)";
            const img = e.currentTarget.querySelector(".demo-img") as HTMLElement | null;
            if (img) img.style.transform = "scale(1.05)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translateY(0)";
            const img = e.currentTarget.querySelector(".demo-img") as HTMLElement | null;
            if (img) img.style.transform = "scale(1)";
          }}
        >
          {/* Image area */}
          <div style={{ position: "relative", height: 200, overflow: "hidden", background: "#F3F4F6" }}>
            {/* Browser overlay */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: 32, background: "rgba(243,244,246,0.95)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", padding: "0 10px", gap: 6,
              zIndex: 2,
            }}>
              <div style={{ display: "flex", gap: 4 }}>
                {["#FF5F57","#FEBC2E","#28C840"].map(c => (
                  <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{ flex: 1, background: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: 9, color: "#9CA3AF", textAlign: "center", border: "1px solid #E5E7EB", maxWidth: 160, margin: "0 auto" }}>
                🔒 {demo.domain}
              </div>
            </div>

            {/* Image */}
            <img
              className="demo-img"
              src={`https://images.unsplash.com/${demo.imgId}?w=600&h=340&fit=crop&auto=format&q=75&client_id=${UNSPLASH_KEY}`}
              alt={demo.name}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                transition: "transform 0.4s ease",
                display: "block",
              }}
            />

            {/* Badge */}
            {demo.badge && (
              <div style={{
                position: "absolute", bottom: 10, left: 10, zIndex: 2,
                background: "#1d9e75", color: "#fff",
                borderRadius: 980, padding: "4px 10px",
                fontSize: 11, fontWeight: 600,
              }}>
                {demo.badge}
              </div>
            )}

            {/* Name overlay */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
              padding: "20px 12px 10px",
              zIndex: 1,
            }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{demo.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{demo.city}</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#6B7280", background: "#F3F4F6", borderRadius: 980, padding: "3px 10px" }}>
              {demo.category}
            </span>
            <Link
              href="/v5/demos"
              style={{
                fontSize: 13, fontWeight: 600, color: "#1d9e75",
                textDecoration: "none", display: "flex", alignItems: "center", gap: 4,
                transition: "gap 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.gap = "8px"; }}
              onMouseLeave={e => { e.currentTarget.style.gap = "4px"; }}
            >
              Voir la démo →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
