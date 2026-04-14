"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const WA_OBTENIR =
  "https://wa.me/41791342997?text=Bonjour%2C%20je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(245,240,232,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid #E2D9CC"
          : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1152,
          margin: "0 auto",
          padding: "0 24px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              background: "#3D31B0",
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="4"
                stroke="white"
                strokeWidth="1.8"
              />
              <circle cx="12" cy="9" r="3" stroke="white" strokeWidth="1.8" />
              <path
                d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span
            style={{
              color: "#1A1410",
              fontWeight: 700,
              fontSize: 18,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            Stampify
          </span>
        </Link>

        {/* Desktop links */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 32 }}
          className="hidden md:flex"
        >
          <Link
            href="/fonctionnalites"
            style={{
              color: "#6B6259",
              fontSize: 15,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Fonctionnalités
          </Link>
          <Link
            href="/tarif"
            style={{
              color: "#6B6259",
              fontSize: 15,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Tarif
          </Link>
          <Link
            href="/demos"
            style={{
              color: "#6B6259",
              fontSize: 15,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Démos
          </Link>
          <Link
            href="/blog"
            style={{
              color: "#6B6259",
              fontSize: 15,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Blog
          </Link>
          <Link
            href="/subscribe"
            style={{
              background: "#3D31B0",
              color: "white",
              borderRadius: 8,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Obtenir mon site
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
          }}
          className="md:hidden"
          aria-label="Menu"
        >
          <span
            style={{
              width: 22,
              height: 2,
              background: "#1A1410",
              borderRadius: 2,
              transition: "all 0.2s",
              transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none",
            }}
          />
          <span
            style={{
              width: 22,
              height: 2,
              background: "#1A1410",
              borderRadius: 2,
              opacity: menuOpen ? 0 : 1,
              transition: "all 0.2s",
            }}
          />
          <span
            style={{
              width: 22,
              height: 2,
              background: "#1A1410",
              borderRadius: 2,
              transition: "all 0.2s",
              transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          style={{
            background: "#F5F0E8",
            borderTop: "1px solid #E2D9CC",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
          className="md:hidden"
        >
          <Link
            href="/fonctionnalites"
            onClick={() => setMenuOpen(false)}
            style={{
              color: "#1A1410",
              fontSize: 16,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Fonctionnalités
          </Link>
          <Link
            href="/tarif"
            onClick={() => setMenuOpen(false)}
            style={{
              color: "#1A1410",
              fontSize: 16,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Tarif
          </Link>
          <Link
            href="/demos"
            onClick={() => setMenuOpen(false)}
            style={{
              color: "#1A1410",
              fontSize: 16,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Démos
          </Link>
          <Link
            href="/blog"
            onClick={() => setMenuOpen(false)}
            style={{
              color: "#1A1410",
              fontSize: 16,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Blog
          </Link>
          <Link
            href="/subscribe"
            onClick={() => setMenuOpen(false)}
            style={{
              background: "#3D31B0",
              color: "white",
              borderRadius: 8,
              padding: "12px 20px",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Obtenir mon site
          </Link>
        </div>
      )}
    </nav>
  );
}
