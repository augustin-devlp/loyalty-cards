"use client";

import { useState } from "react";

export interface Demo {
  name: string;
  type: "spa" | "cafe" | "boulangerie" | "barbershop" | "restaurant" | "manucure";
  typeLabel: string;
  city: string;
  slug: string;
  external: boolean;
  urlBar: string;
  badge: string | null;
  gradientFrom: string;
  gradientTo: string;
  features: string[];
  waLink: string;
}

const TYPE_LABELS: Record<Demo["type"], string> = {
  spa: "Spa",
  cafe: "Café",
  boulangerie: "Boulangerie",
  barbershop: "Barbershop",
  restaurant: "Restaurant",
  manucure: "Manucure",
};

const FILTERS: { key: "all" | Demo["type"]; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "cafe", label: "Café" },
  { key: "boulangerie", label: "Boulangerie" },
  { key: "barbershop", label: "Barbershop" },
  { key: "restaurant", label: "Restaurant" },
  { key: "manucure", label: "Manucure" },
  { key: "spa", label: "Spa" },
];

export default function DemoFilter({ demos }: { demos: Demo[] }) {
  const [active, setActive] = useState<"all" | Demo["type"]>("all");

  const filtered = active === "all" ? demos : demos.filter((d) => d.type === active);

  return (
    <div>
      {/* Filter tabs */}
      <div
        style={{
          position: "sticky",
          top: 72,
          zIndex: 40,
          background: "#F5F0E8",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {FILTERS.map((f) => {
            const isActive = active === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                style={{
                  background: isActive ? "#3D31B0" : "white",
                  color: isActive ? "white" : "#1A1410",
                  border: isActive ? "1.5px solid #3D31B0" : "1.5px solid #E2D9CC",
                  borderRadius: 999,
                  padding: "8px 18px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards grid */}
      <section style={{ padding: "16px 24px 80px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 32,
            }}
          >
            {filtered.map((d) => (
              <div
                key={d.slug}
                style={{
                  background: "white",
                  border: "1px solid #E2D9CC",
                  borderRadius: 20,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                {/* Browser mockup */}
                <div style={{ background: "#F0EDE8", padding: "10px 14px 0" }}>
                  {/* Chrome bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                        <div
                          key={c}
                          style={{ width: 10, height: 10, borderRadius: "50%", background: c }}
                        />
                      ))}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: "white",
                        borderRadius: 6,
                        padding: "4px 10px",
                        fontSize: 11,
                        color: "#6B6259",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z"
                          stroke="#28C840"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M5.5 8l1.5 1.5L10.5 6"
                          stroke="#28C840"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {d.urlBar}
                    </div>
                  </div>

                  {/* Mini site preview */}
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${d.gradientFrom}, ${d.gradientTo})`,
                      borderRadius: "8px 8px 0 0",
                      padding: "20px 16px",
                      minHeight: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      position: "relative",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 8,
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.6)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginBottom: 3,
                        }}
                      >
                        {d.typeLabel}
                      </div>
                      <div
                        style={{
                          fontFamily: "Fraunces, Georgia, serif",
                          fontSize: 16,
                          fontWeight: 700,
                          color: "white",
                          lineHeight: 1.2,
                        }}
                      >
                        {d.name}
                      </div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                        {d.city}, Suisse
                      </div>
                    </div>
                    {d.badge && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: "rgba(255,255,255,0.2)",
                          borderRadius: 999,
                          padding: "3px 8px",
                          fontSize: 9,
                          fontWeight: 700,
                          color: "white",
                        }}
                      >
                        {d.badge}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card body */}
                <div
                  style={{
                    padding: "20px 24px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {/* Business info */}
                  <div>
                    <div
                      style={{
                        fontFamily: "Fraunces, Georgia, serif",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#1A1410",
                        marginBottom: 2,
                      }}
                    >
                      {d.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B6259", marginBottom: 10 }}>
                      {d.typeLabel} · {d.city}
                    </div>

                    {/* Feature tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {d.features.map((f) => (
                        <span
                          key={f}
                          style={{
                            background: "#EEF0FC",
                            color: "#3D31B0",
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 999,
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "auto" }}>
                    <a
                      href={d.slug}
                      target={d.external ? "_blank" : undefined}
                      rel={d.external ? "noopener noreferrer" : undefined}
                      style={{
                        display: "block",
                        background: "#3D31B0",
                        color: "white",
                        padding: "12px",
                        borderRadius: 10,
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: 14,
                        textDecoration: "none",
                      }}
                    >
                      Voir la démo interactive →
                    </a>
                    <a
                      href={d.waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        background: "white",
                        color: "#3D31B0",
                        border: "1.5px solid #3D31B0",
                        padding: "12px",
                        borderRadius: 10,
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: 14,
                        textDecoration: "none",
                      }}
                    >
                      Obtenir mon site {TYPE_LABELS[d.type]} →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
