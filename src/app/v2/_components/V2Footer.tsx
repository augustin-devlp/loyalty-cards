"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import StampifyLogo from "@/components/StampifyLogo";

export default function V2Footer() {
  const col: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  const colTitle: CSSProperties = {
    fontSize: "11px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.35)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: "4px",
  };

  const colLink: CSSProperties = {
    fontSize: "14px",
    color: "rgba(255,255,255,0.6)",
    textDecoration: "none",
    transition: "color 0.2s",
    lineHeight: 1.4,
  };

  return (
    <footer
      style={{
        background: "#0A0A0A",
        color: "#fff",
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 24px 40px",
        }}
      >
        {/* 4 columns */}
        <div className="v2f-grid">
          {/* Col 1 — Brand */}
          <div style={col}>
            <StampifyLogo size="md" color="white" />
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.7,
                marginTop: "8px",
                maxWidth: "240px",
              }}
            >
              La solution tout-en-un pour les commerçants locaux de Suisse
              romande.
            </p>
            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
              <a
                href="https://www.linkedin.com/company/stampify"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.9)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                }
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/stampify.ch"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.9)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                }
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 — Produit */}
          <div style={col}>
            <span style={colTitle}>Produit</span>
            {[
              ["Fonctionnalités", "/v2#features"],
              ["Tarif", "/v2#pricing"],
              ["Démos", "/v2/demos"],
              ["Blog", "/blog"],
              ["Se connecter", "/login"],
            ].map(([label, href]) => (
              <Link key={href} href={href} style={colLink}>
                {label}
              </Link>
            ))}
          </div>

          {/* Col 3 — Légal */}
          <div style={col}>
            <span style={colTitle}>Légal</span>
            {[
              ["Mentions légales", "/mentions-legales"],
              ["CGV", "/conditions-utilisation"],
              ["Politique de confidentialité", "/politique-de-confidentialite"],
            ].map(([label, href]) => (
              <Link key={href} href={href} style={colLink}>
                {label}
              </Link>
            ))}
          </div>

          {/* Col 4 — Contact */}
          <div style={col}>
            <span style={colTitle}>Contact</span>
            <a
              href="https://wa.me/41791234567"
              target="_blank"
              rel="noopener noreferrer"
              style={colLink}
            >
              💬 WhatsApp
            </a>
            <a href="mailto:contact@stampify.ch" style={colLink}>
              contact@stampify.ch
            </a>
            <span
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.4)",
                marginTop: "4px",
              }}
            >
              Suisse romande &amp; France
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            marginTop: "60px",
            paddingTop: "28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
            © 2026 Stampify · Tous droits réservés
          </span>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
            Fait avec ❤️ en Suisse romande
          </span>
        </div>
      </div>

      <style>{`
        .v2f-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
        }
        @media (max-width: 767px) {
          .v2f-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }
        @media (max-width: 480px) {
          .v2f-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
