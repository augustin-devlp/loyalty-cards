"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import StampifyLogo from "@/components/StampifyLogo";

export default function V2Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const links = [
    { label: "Fonctionnalités", href: "/v2#features" },
    { label: "Tarif", href: "/v2#pricing" },
    { label: "Démos", href: "/v2/demos" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: "64px",
          background: scrolled
            ? "rgba(255,255,255,0.95)"
            : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          transition: "background 0.3s ease",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {/* Logo */}
          <Link href="/v2" style={{ textDecoration: "none" }}>
            <StampifyLogo size="md" color="dark" />
          </Link>

          {/* Desktop links */}
          <div
            className="v2n-links"
            style={{ display: "flex", alignItems: "center", gap: "36px" }}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontSize: "15px",
                  color: "#6B7280",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#0A0A0A")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#6B7280")
                }
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div
            className="v2n-cta"
            style={{ display: "flex", alignItems: "center", gap: "20px" }}
          >
            <Link
              href="/login"
              style={{
                fontSize: "14px",
                color: "#6B7280",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#0A0A0A")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#6B7280")
              }
            >
              Se connecter
            </Link>
            <Link
              href="/v2/subscribe"
              style={{
                background: "#1d9e75",
                color: "#fff",
                borderRadius: "980px",
                padding: "10px 22px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
                transition: "background 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#0D7A5A";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1d9e75";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Obtenir mon site
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="v2n-ham"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "none",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: "24px",
                  height: "2px",
                  background: "#0A0A0A",
                  borderRadius: "2px",
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1100,
          background: "rgba(255,255,255,0.98)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          display: "flex",
          flexDirection: "column",
          padding: "0 24px 40px",
          opacity: mobileOpen ? 1 : 0,
          transform: mobileOpen ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: mobileOpen ? "auto" : "none",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "64px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            marginBottom: "32px",
            flexShrink: 0,
          }}
        >
          <Link
            href="/v2"
            onClick={() => setMobileOpen(false)}
            style={{ textDecoration: "none" }}
          >
            <StampifyLogo size="md" color="dark" />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Fermer le menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "24px",
              color: "#0A0A0A",
              lineHeight: 1,
              padding: "8px",
            }}
          >
            ✕
          </button>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#0A0A0A",
                textDecoration: "none",
                padding: "16px 0",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: "#6B7280",
              textDecoration: "none",
              padding: "16px 0",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            Se connecter
          </Link>
        </div>
        <Link
          href="/v2/subscribe"
          onClick={() => setMobileOpen(false)}
          style={{
            background: "#1d9e75",
            color: "#fff",
            borderRadius: "980px",
            padding: "18px 24px",
            fontSize: "17px",
            fontWeight: 600,
            textDecoration: "none",
            textAlign: "center",
            display: "block",
            marginTop: "32px",
          }}
        >
          Obtenir mon site — 990 CHF
        </Link>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .v2n-links { display: none !important; }
          .v2n-cta { display: none !important; }
          .v2n-ham { display: flex !important; }
        }
      `}</style>
    </>
  );
}
