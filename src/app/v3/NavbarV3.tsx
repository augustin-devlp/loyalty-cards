"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

export default function NavbarV3() {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > 200 && current > lastScrollY.current) {
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
    { label: "Fonctionnalités", href: "/v3/fonctionnalites" },
    { label: "Tarif", href: "/v3/tarif" },
    { label: "Démos", href: "/v3/demos" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          height: "44px",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 0.3s ease",
          display: "flex",
          alignItems: "center",
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
          {/* Logo icon only */}
          <Link href="/v3" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                background: "#1d1d1f",
                borderRadius: "7px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5" r="2.5" stroke="white" strokeWidth="1.5" />
                <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="navbar-desktop-links" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: "14px", color: "#1d1d1f", textDecoration: "none", fontWeight: 400, opacity: 0.8, transition: "opacity 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="navbar-desktop-cta">
            <a
              href={WA_MAIN}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#1d1d1f",
                color: "#ffffff",
                borderRadius: "980px",
                padding: "7px 16px",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-block",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Obtenir mon site
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="navbar-hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "none", flexDirection: "column", gap: "5px" }}
          >
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#1d1d1f", borderRadius: "2px" }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#1d1d1f", borderRadius: "2px" }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "#1d1d1f", borderRadius: "2px" }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1100,
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 24px 40px",
          transform: mobileOpen ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <Link href="/v3" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
            <div style={{ width: "28px", height: "28px", background: "#1d1d1f", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5" r="2.5" stroke="white" strokeWidth="1.5" />
                <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </Link>
          <button onClick={() => setMobileOpen(false)} aria-label="Fermer" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "24px", color: "#1d1d1f" }}>✕</button>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{ fontSize: "24px", fontWeight: 500, color: "#1d1d1f", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              {link.label}
            </Link>
          ))}
        </div>
        <a href={WA_MAIN} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} style={{ background: "#1d1d1f", color: "#ffffff", borderRadius: "980px", padding: "16px 24px", fontSize: "17px", fontWeight: 500, textDecoration: "none", textAlign: "center", display: "block", marginTop: "32px" }}>
          Obtenir mon site
        </a>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .navbar-desktop-links { display: none !important; }
          .navbar-desktop-cta { display: none !important; }
          .navbar-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
