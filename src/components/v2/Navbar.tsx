"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function StampIcon({ size = 28, color = "#1d9e75" }: { size?: number; color?: string }) {
  const circles = [
    { cx: 8, cy: 9 }, { cx: 13, cy: 9 }, { cx: 18, cy: 9 },
    { cx: 8, cy: 14 }, { cx: 13, cy: 14 }, { cx: 18, cy: 14 },
    { cx: 8, cy: 19 },
    { cx: 13, cy: 19 }, { cx: 18, cy: 19 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="24" height="24" rx="7" stroke={color} strokeWidth="2"/>
      {circles.map((c, i) => (
        <circle
          key={i}
          cx={c.cx}
          cy={c.cy}
          r={2.2}
          fill={i < 7 ? color : "none"}
          stroke={i >= 7 ? color : undefined}
          strokeWidth={i >= 7 ? 1.5 : undefined}
        />
      ))}
    </svg>
  );
}

export function V2Logo({ color = "dark" }: { color?: "dark" | "white" }) {
  const iconColor = color === "dark" ? "#1d9e75" : "#FFFFFF";
  const textColor = color === "dark" ? "#0A0A0A" : "#FFFFFF";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <StampIcon size={28} color={iconColor} />
      <span style={{ fontSize: 20, fontWeight: 800, color: textColor, letterSpacing: "-0.02em", lineHeight: 1 }}>
        Stampify
      </span>
    </div>
  );
}

const NAV_LINKS = [
  { label: "Fonctionnalités", href: "/v2/#features" },
  { label: "Tarif", href: "/v2/#pricing" },
  { label: "Démos", href: "/v2/demos" },
  { label: "Blog", href: "/blog" },
];

export default function V2Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      const prog = document.getElementById("v2-progress");
      if (prog) {
        const total = document.body.scrollHeight - window.innerHeight;
        prog.style.width = total > 0 ? `${(y / total) * 100}%` : "0%";
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Progress bar */}
      <div id="v2-progress" aria-hidden="true" />

      {/* Fixed wrapper: announce bar + navbar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 1000,
        transform: scrolled ? "translateY(-40px)" : "translateY(0)",
        transition: "transform 0.3s ease",
      }}>
        {/* Announce bar */}
        <div style={{
          height: 40,
          background: "#E8F7F2",
          borderBottom: "1px solid rgba(29,158,117,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 500,
          color: "#1d9e75",
          padding: "0 24px",
          gap: 6,
        }}>
          <span>🎉</span>
          <span className="v2-announce-text">
            Stampify livre votre site en 48h — 990 CHF tout inclus.{" "}
            <Link href="/v2/#pricing" style={{ color: "#1d9e75", fontWeight: 700, textDecoration: "underline" }}>
              En savoir plus →
            </Link>
          </span>
        </div>

        {/* Navbar */}
        <nav style={{
          height: 64,
          background: scrolled ? "rgba(255,255,255,0.93)" : "rgba(255,255,255,0.85)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
          transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
          display: "flex",
          alignItems: "center",
        }}>
          <div style={{
            maxWidth: 1200, margin: "0 auto", padding: "0 24px",
            width: "100%", display: "flex", alignItems: "center",
            justifyContent: "space-between",
          }}>
            {/* Logo */}
            <Link href="/v2" style={{ textDecoration: "none", opacity: 1, transition: "opacity 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              <V2Logo color="dark" />
            </Link>

            {/* Desktop nav links */}
            <div className="v2-nav-links" style={{ display: "flex", gap: 32 }}>
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href}
                  style={{ fontSize: 14, fontWeight: 500, color: "#6B7280", textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#0A0A0A"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#6B7280"; }}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="v2-nav-cta" style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Link href="/login"
                style={{ fontSize: 14, fontWeight: 500, color: "#6B7280", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#0A0A0A"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#6B7280"; }}
              >
                Se connecter
              </Link>
              <Link href="/v2/subscribe"
                style={{
                  background: "#1d9e75", color: "#fff", borderRadius: 980,
                  padding: "10px 20px", fontSize: 14, fontWeight: 600,
                  textDecoration: "none", transition: "background 0.2s, transform 0.1s, box-shadow 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#0D7A5A";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(29,158,117,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1d9e75";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Obtenir mon site
              </Link>
            </div>

            {/* Hamburger */}
            <button
              className="v2-nav-ham"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
              style={{
                display: "none", background: "none", border: "none",
                cursor: "pointer", padding: 8, flexDirection: "column", gap: 4,
              }}
            >
              {[0,1,2].map(i => (
                <span key={i} style={{ display: "block", width: 20, height: 2, background: "#0A0A0A", borderRadius: 2 }} />
              ))}
            </button>
          </div>
        </nav>
      </div>

      {/* Spacer for fixed header */}
      <div style={{ height: 104 }} aria-hidden="true" />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1100,
          background: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column",
          padding: "0 24px 40px",
          overflowY: "auto",
        }}>
          <div style={{
            height: 64, display: "flex", justifyContent: "space-between",
            alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.06)",
            marginBottom: 32, flexShrink: 0,
          }}>
            <V2Logo color="dark" />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Fermer"
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, color: "#0A0A0A", padding: 8 }}
            >
              ✕
            </button>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: 24, fontWeight: 700, color: "#0A0A0A",
                  textDecoration: "none", padding: "16px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/login"
              onClick={() => setMobileOpen(false)}
              style={{ fontSize: 24, fontWeight: 700, color: "#6B7280", textDecoration: "none", padding: "16px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
            >
              Se connecter
            </Link>
          </div>
          <Link href="/v2/subscribe"
            onClick={() => setMobileOpen(false)}
            style={{
              background: "#1d9e75", color: "#fff", borderRadius: 980,
              padding: "18px 24px", fontSize: 17, fontWeight: 600,
              textDecoration: "none", textAlign: "center", display: "block", marginTop: 32,
            }}
          >
            Obtenir mon site — 990 CHF
          </Link>
        </div>
      )}
    </>
  );
}
