"use client";

import { useEffect, useRef } from "react";

const FEATURES = [
  {
    icon: "🌐",
    title: "Site vitrine 5 pages",
    tag: "Domaine .ch inclus",
    desc: "Un site professionnel optimisé, avec vos horaires, menu, galerie photos et formulaire de contact. Prêt à accueillir vos clients en ligne.",
  },
  {
    icon: "🎟️",
    title: "Carte fidélité digitale",
    tag: "Sans app requise",
    desc: "Vos clients scannent un QR code et tamponnent leur carte depuis leur smartphone. Aucune app à télécharger, aucune carte papier à imprimer.",
  },
  {
    icon: "🪵",
    title: "Plaquette NFC en bois gravée",
    tag: "Livrée en 5 jours",
    desc: "Une plaquette élégante en bois gravé avec votre logo. Vos clients l'approchent de leur téléphone pour accéder à leur carte fidélité.",
  },
  {
    icon: "📍",
    title: "SEO local optimisé",
    tag: "Google Maps optimisé",
    desc: "Votre commerce apparaît en premier quand vos clients cherchent 'café Lausanne' ou 'coiffeur Genève'. Référencement local inclus.",
  },
  {
    icon: "📊",
    title: "Dashboard clients en temps réel",
    tag: "Accès mobile inclus",
    desc: "Visualisez vos clients actifs, tampons distribués et récompenses en cours. Envoyez des campagnes SMS directement depuis votre tableau de bord.",
  },
  {
    icon: "💬",
    title: "Campagnes SMS & push",
    tag: "1 campagne offerte",
    desc: "Rappelez vos clients absents depuis plus de 30 jours, annoncez vos promotions ou nouveautés. Un outil marketing puissant, simple à utiliser.",
  },
];

export default function FeatureGrid() {
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

  const delays = ["v2-d1", "v2-d2", "v2-d3", "v2-d4", "v2-d5", "v2-d6"];

  return (
    <div className="v2-feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
      {FEATURES.map((f, i) => (
        <div
          key={f.title}
          ref={el => { refs.current[i] = el; }}
          className={`v2-animate ${delays[i]}`}
          style={{
            background: "#fff", border: "1px solid #E5E7EB",
            borderRadius: 16, padding: 28,
            transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
            cursor: "default",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(29,158,117,0.35)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(29,158,117,0.08)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#E5E7EB";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>{f.title}</h3>
            <span style={{
              fontSize: 11, fontWeight: 500, color: "#1d9e75",
              background: "#E8F7F2", borderRadius: 980,
              padding: "2px 8px", whiteSpace: "nowrap",
            }}>{f.tag}</span>
          </div>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
