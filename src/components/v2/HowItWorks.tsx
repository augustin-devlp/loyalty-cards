"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  {
    number: "01",
    title: "Vous nous envoyez un message",
    desc: "Un simple WhatsApp avec vos infos : nom du commerce, activité, ville. On s'occupe du reste.",
    icon: "💬",
  },
  {
    number: "02",
    title: "On construit tout en 48h",
    desc: "Site vitrine, carte fidélité, NFC, SEO local. Tout est prêt et configuré à votre image.",
    icon: "⚡",
  },
  {
    number: "03",
    title: "Vos clients reviennent",
    desc: "Vous gérez vos tampons, vos campagnes SMS et vos stats depuis votre téléphone. Simple.",
    icon: "🎯",
  },
];

export default function HowItWorks() {
  const numRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    numRefs.current.forEach((el) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("v2-visible");
            obs.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div className="v2-steps-row" style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
      {STEPS.map((step, i) => (
        <div key={step.number} style={{ display: "flex", alignItems: "flex-start", flex: 1 }}>
          {/* Step card */}
          <div style={{ flex: 1, textAlign: "center", padding: "0 24px" }}>
            {/* Number circle */}
            <div
              ref={el => { numRefs.current[i] = el; }}
              className={`v2-animate-scale v2-d${i + 1}`}
              style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "linear-gradient(135deg, #1d9e75, #0D7A5A)",
                color: "#fff", fontSize: 22, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px",
                boxShadow: "0 8px 32px rgba(29,158,117,0.25)",
              }}
            >
              {step.number}
            </div>
            <div style={{ fontSize: 28, marginBottom: 16 }}>{step.icon}</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", marginBottom: 12, lineHeight: 1.3 }}>{step.title}</h3>
            <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.65, maxWidth: 260, margin: "0 auto" }}>{step.desc}</p>
          </div>

          {/* Divider arrow (between steps) */}
          {i < STEPS.length - 1 && (
            <div className="v2-steps-divider" style={{
              display: "flex", alignItems: "center", paddingTop: 36, flexShrink: 0,
            }}>
              <svg width="40" height="2" viewBox="0 0 40 2" fill="none">
                <line x1="0" y1="1" x2="32" y2="1" stroke="#D1D5DB" strokeWidth="1.5" strokeDasharray="4 3"/>
              </svg>
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" style={{ marginLeft: -2 }}>
                <path d="M1 1l6 5-6 5" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
