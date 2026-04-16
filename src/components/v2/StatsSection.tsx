"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  format?: (n: number) => string;
}

const STATS: Stat[] = [
  {
    value: 400000,
    suffix: "+",
    label: "commerces en France et Suisse sans outil de fidélité digitale",
    format: (n) => Math.round(n).toLocaleString("fr-CH").replace(/,/g, "\u202F"),
  },
  {
    value: 67,
    suffix: "%",
    label: "de dépenses supplémentaires d'un client fidèle vs nouveau",
  },
  {
    value: 48,
    suffix: "h",
    label: "délai de livraison garanti, site + carte + plaquette NFC",
  },
  {
    value: 990,
    suffix: " CHF",
    label: "tout inclus, paiement unique, aucun abonnement",
  },
];

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

function StatCard({ stat, active, delay }: { stat: Stat; active: boolean; delay: string }) {
  const count = useCountUp(stat.value, 1800, active);
  const displayed = stat.format ? stat.format(count) : count.toString();

  return (
    <div
      className={`v2-animate ${delay}`}
      style={{
        textAlign: "center", padding: "40px 24px",
        borderRight: "1px solid #E5E7EB",
      }}
    >
      <div style={{
        fontSize: "clamp(40px, 5vw, 64px)",
        fontWeight: 800,
        letterSpacing: "-0.04em",
        color: "#1d9e75",
        lineHeight: 1,
        marginBottom: 12,
      }}>
        {stat.prefix ?? ""}{displayed}{stat.suffix}
      </div>
      <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.55, maxWidth: 180, margin: "0 auto" }}>
        {stat.label}
      </p>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          // also trigger animate classes
          el.querySelectorAll(".v2-animate").forEach(e => e.classList.add("v2-visible"));
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const delays = ["v2-d1", "v2-d2", "v2-d3", "v2-d4"];

  return (
    <div
      ref={ref}
      className="v2-stats-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      {STATS.map((s, i) => (
        <StatCard key={s.label} stat={s} active={active} delay={delays[i]} />
      ))}
    </div>
  );
}
