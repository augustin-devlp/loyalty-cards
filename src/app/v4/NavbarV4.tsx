"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

export default function NavbarV4() {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > 80 && current > lastScrollY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { label: "Fonctionnalités", href: "/v4/fonctionnalites" },
    { label: "Tarif", href: "/v4/tarif" },
    { label: "Démos", href: "/v4/demos" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          height: "52px",
          background: "rgba(250,250,248,0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.3s ease",
          display: "flex",
          alignItems: "center",
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "860px",
            margin: "0 auto",
            padding: "0 20px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {/* Logo */}
          <Link href="/v4" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "22px",
                height: "22px",
                background: "#1d9e75",
                borderRadius: "5px",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
              Stampify
            </span>
          </Link>

          {/* Desktop links */}
          <div className="nav4-desktop-links" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: "14px", color: "#1a1a1a", textDecoration: "none", fontWeight: 400, opacity: 0.7, transition: "opacity 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="nav4-desktop-cta">
            <a
              href={WA_MAIN}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#1d9e75",
                color: "#ffffff",
                borderRadius: "980px",
                padding: "8px 18px",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
                transition: "transform 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.background = "#18875f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "#1d9e75";
              }}
            >
              Obtenir mon site
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav4-hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "none", flexDirection: "column", gap: "5px" }}
          >
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#1a1a1a", borderRadius: "2px" }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#1a1a1a", borderRadius: "2px" }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#1a1a1a", borderRadius: "2px" }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1100,
          background: "rgba(250,250,248,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 24px 40px",
          transform: mobileOpen ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease",
          overflowY: "auto",
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <Link href="/v4" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "22px", height: "22px", background: "#1d9e75", borderRadius: "5px" }} />
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>Stampify</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} aria-label="Fermer" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "24px", color: "#1a1a1a" }}>✕</button>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{ fontSize: "24px", fontWeight: 600, color: "#1a1a1a", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              {link.label}
            </Link>
          ))}
        </div>
        <a href={WA_MAIN} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} style={{ background: "#1d9e75", color: "#ffffff", borderRadius: "980px", padding: "16px 24px", fontSize: "17px", fontWeight: 600, textDecoration: "none", textAlign: "center", display: "block", marginTop: "32px" }}>
          Obtenir mon site — 990 CHF
        </a>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .nav4-desktop-links { display: none !important; }
          .nav4-desktop-cta { display: none !important; }
          .nav4-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
