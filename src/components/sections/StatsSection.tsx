"use client";

import { useCountUp } from "@/hooks/useCountUp";

const stats = [
  { end: 400000, display: (n: number) => n > 0 ? `${n.toLocaleString("fr-FR")}+` : "400 000+", label: "Tampons distribués" },
  { end: 67, display: (n: number) => `${n > 0 ? n : 67}%`, label: "Taux de retour client" },
  { end: 48, display: (n: number) => `${n > 0 ? n : 48}h`, label: "Mise en ligne garantie" },
  { end: 49, display: () => "4.9", label: "Note de satisfaction" },
];

function Stat({ end, display, label, index }: { end: number; display: (n: number) => string; label: string; index: number }) {
  const { count, elementRef } = useCountUp(end, 1800, index * 150);
  return (
    <div className="stat-item" style={{
      textAlign: "center",
      padding: "0 32px",
      borderRight: index < 3 ? "1px solid rgba(255,255,255,0.2)" : "none",
    }}>
      <div
        ref={elementRef as React.RefObject<HTMLDivElement>}
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontWeight: 700,
          fontSize: "clamp(36px, 4vw, 56px)",
          color: "#fff",
          lineHeight: 1.1,
          marginBottom: 8,
        }}
      >
        {display(count)}
      </div>
      <div style={{
        fontFamily: "var(--font-dm-sans), sans-serif",
        fontSize: 15,
        color: "rgba(255,255,255,0.8)",
      }}>
        {label}
      </div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section style={{ background: "#1d9e75", padding: "80px 24px" }}>
      <div
        className="stats-4col"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
        }}
      >
        {stats.map((s, i) => (
          <Stat key={i} {...s} index={i} />
        ))}
      </div>
    </section>
  );
}
