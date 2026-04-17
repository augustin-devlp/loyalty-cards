"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .nav-link-item {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          transition: color 0.15s;
        }
        .nav-link-item:hover { color: #1d9e75; }
        .nav-btn-login {
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          transition: color 0.15s;
        }
        .nav-btn-login:hover { color: #1d9e75; }
        .nav-btn-cta {
          background: #1d9e75;
          color: #fff;
          border-radius: 8px;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 20px;
          text-decoration: none;
          transition: background 0.15s, transform 0.15s;
          display: inline-block;
          white-space: nowrap;
        }
        .nav-btn-cta:hover { background: #0d7a5a; transform: scale(1.02); }
        .nav-desktop { display: flex; align-items: center; gap: 32px; }
        .nav-actions { display: flex; align-items: center; gap: 20px; }
        .nav-hamburger { display: none !important; }
        @media (max-width: 768px) {
          .nav-hamburger { display: block !important; background: none; border: none; cursor: pointer; padding: 4px; }
          .nav-desktop { display: none !important; }
          .nav-actions { display: none !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
        borderBottom: scrolled ? "1px solid #f0f0f0" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              {([0,1,2] as const).map(row => ([0,1,2] as const).map(col => (
                <circle key={`${row}-${col}`} cx={5 + col * 9} cy={5 + row * 9} r="3" fill="#1d9e75" opacity={1 - row * 0.15} />
              )))}
            </svg>
            <span style={{
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 700,
              fontSize: 18,
              color: "#0f172a",
            }}>Stampify</span>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-desktop" style={{ flex: 1, justifyContent: "center" }}>
            <Link href="/#produit" className="nav-link-item">Produit</Link>
            <Link href="/demos" className="nav-link-item">Démos</Link>
            <Link href="/#tarif" className="nav-link-item">Tarif</Link>
            <Link href="/features" className="nav-link-item">Fonctionnalités</Link>
          </div>

          {/* Actions */}
          <div className="nav-actions">
            <Link href="/login" className="nav-btn-login">Se connecter</Link>
            <Link href="/#tarif" className="nav-btn-cta">Démarrer — 990 CHF</Link>
          </div>

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {menuOpen
                ? <><path d="M6 6l12 12M18 6L6 18" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round"/></>
                : <>
                    <rect y="5" width="24" height="2" rx="1" fill="#0f172a"/>
                    <rect y="11" width="24" height="2" rx="1" fill="#0f172a"/>
                    <rect y="17" width="24" height="2" rx="1" fill="#0f172a"/>
                  </>
              }
            </svg>
          </button>
        </div>

        {/* Mobile fullscreen menu */}
        {menuOpen && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "#1d9e75",
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}>
            <button
              onClick={() => setMenuOpen(false)}
              style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", cursor: "pointer" }}
              aria-label="Fermer"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M6 6l16 16M22 6L6 22" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            {[
              { href: "/#produit", label: "Produit" },
              { href: "/demos", label: "Démos" },
              { href: "/#tarif", label: "Tarif" },
              { href: "/features", label: "Fonctionnalités" },
            ].map(item => (
              <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={{
                color: "#fff", textDecoration: "none",
                fontFamily: "var(--font-fraunces), serif",
                fontSize: 28, fontWeight: 700,
              }}>
                {item.label}
              </Link>
            ))}
            <Link href="/#tarif" onClick={() => setMenuOpen(false)} style={{
              background: "#fff", color: "#1d9e75", borderRadius: 10,
              padding: "14px 32px",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 600, fontSize: 16, textDecoration: "none",
              marginTop: 8,
            }}>
              Démarrer — 990 CHF
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
