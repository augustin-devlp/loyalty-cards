"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import StampifyLogo from "../../components/StampifyLogo";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

export default function NavbarV4() {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const cur = window.scrollY;
      setHidden(cur > 80 && cur > lastScrollY.current);
      lastScrollY.current = cur;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const links = [
    { label: "Fonctionnalités", href: "/v4/fonctionnalites" },
    { label: "Tarif", href: "/v4/tarif" },
    { label: "Démos", href: "/v4/demos" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 1000,
        height: "52px",
        background: "rgba(251,248,243,0.9)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.25s ease",
        display: "flex", alignItems: "center",
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      }}>
        <div style={{
          maxWidth: "900px", margin: "0 auto", padding: "0 20px",
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", height: "100%",
        }}>
          {/* Logo */}
          <Link href="/v4" style={{ textDecoration: "none" }}>
            <StampifyLogo size="md" color="dark" />
          </Link>

          {/* Desktop links */}
          <div className="nav4-links" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {links.map((l) => (
              <Link
                key={l.href} href={l.href}
                style={{ fontSize: "14px", color: "#5C5C5C", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1A1A1A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#5C5C5C")}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="nav4-cta">
            <a
              href={WA_MAIN} target="_blank" rel="noopener noreferrer"
              style={{
                background: "#1d9e75", color: "#fff", borderRadius: "980px",
                padding: "8px 20px", fontSize: "13px", fontWeight: 600,
                textDecoration: "none", display: "inline-block",
                transition: "background 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#0D7A5A"; e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1d9e75"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              Obtenir mon site
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="nav4-ham"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "none", flexDirection: "column", gap: "5px" }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ display: "block", width: "22px", height: "1.5px", background: "#1A1A1A", borderRadius: "2px" }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1100,
        background: "rgba(251,248,243,0.97)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        display: "flex", flexDirection: "column",
        padding: "20px 24px 40px",
        opacity: mobileOpen ? 1 : 0,
        transform: mobileOpen ? "translateY(0)" : "translateY(-8px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
        pointerEvents: mobileOpen ? "auto" : "none",
        overflowY: "auto",
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
          <Link href="/v4" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
            <StampifyLogo size="md" color="dark" />
          </Link>
          <button onClick={() => setMobileOpen(false)} aria-label="Fermer" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "22px", color: "#1A1A1A", lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          {links.map((l) => (
            <Link
              key={l.href} href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{ fontSize: "28px", fontWeight: 700, color: "#1A1A1A", textDecoration: "none", padding: "14px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <a
          href={WA_MAIN} target="_blank" rel="noopener noreferrer"
          onClick={() => setMobileOpen(false)}
          style={{
            background: "#1d9e75", color: "#fff", borderRadius: "980px",
            padding: "18px 24px", fontSize: "17px", fontWeight: 600,
            textDecoration: "none", textAlign: "center", display: "block", marginTop: "32px",
          }}
        >
          Obtenir mon site — 990 CHF
        </a>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .nav4-links { display: none !important; }
          .nav4-cta { display: none !important; }
          .nav4-ham { display: flex !important; }
        }
      `}</style>
    </>
  );
}
