"use client";
import Link from "next/link";
import { V2Logo } from "./Navbar";

export default function V2Footer() {
  const linkStyle = {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)" as const,
    textDecoration: "none" as const,
    display: "block" as const,
    marginBottom: 12,
    transition: "color 0.15s" as const,
  };
  return (
    <footer style={{ background: "#0A0A0A", color: "#fff", padding: "80px 0 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        {/* 4 columns */}
        <div className="v2-footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48 }}>
          {/* Col 1 brand */}
          <div>
            <V2Logo color="white" />
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, maxWidth: 240, marginTop: 16 }}>
              La solution tout-en-un pour les commerçants locaux de Suisse romande et de France.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {["LinkedIn", "Instagram"].map(s => (
                <a key={s} href="#" aria-label={s}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: "rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, color: "rgba(255,255,255,0.6)",
                    textDecoration: "none", transition: "background 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                >
                  {s === "LinkedIn" ? "in" : "ig"}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 produit */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>PRODUIT</div>
            {[["Fonctionnalités", "/v5/#features"], ["Tarif", "/v5/#pricing"], ["Démos", "/v5/demos"], ["Blog", "/blog"], ["Se connecter", "/login"]].map(([l, h]) => (
              <Link key={h} href={h} style={linkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >{l}</Link>
            ))}
          </div>

          {/* Col 3 légal */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>LÉGAL</div>
            {[["Mentions légales", "/mentions-legales"], ["CGV", "/conditions-utilisation"], ["Confidentialité", "/politique-de-confidentialite"]].map(([l, h]) => (
              <Link key={h} href={h} style={linkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >{l}</Link>
            ))}
          </div>

          {/* Col 4 contact */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>CONTACT</div>
            {[
              { icon: "💬", label: "WhatsApp", href: "https://wa.me/41791234567" },
              { icon: "✉️", label: "contact@stampify.ch", href: "mailto:contact@stampify.ch" },
            ].map(item => (
              <a key={item.label} href={item.href} style={{ ...linkStyle, display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                {item.icon} {item.label}
              </a>
            ))}
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>📍 Suisse romande & France</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>⏰ Réponse sous 2h, 7j/7</div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 40, paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>© 2026 Stampify · Tous droits réservés</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Fait avec ❤️ en Suisse romande</span>
          <div style={{ display: "flex", gap: 20 }}>
            {[["Mentions légales", "/mentions-legales"], ["CGV", "/conditions-utilisation"]].map(([l, h]) => (
              <Link key={h} href={h} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
                onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
              >{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
