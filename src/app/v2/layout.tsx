import type { Metadata } from "next";
import NavbarV2 from "./NavbarV2";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stampify v2 — Design preview",
  description: "Version preview du nouveau design Stampify",
  robots: "noindex",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --color-bg: #ffffff;
            --color-bg-alt: #f5f5f7;
            --color-text: #1d1d1f;
            --color-text-secondary: #6e6e73;
            --color-accent-blue: #0071e3;
            --color-accent-blue-hover: #0077ed;
            --color-accent-green: #1d9e75;
            --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; font-family: var(--font-family); }
          body { font-family: var(--font-family); color: #1d1d1f; background: #ffffff; -webkit-font-smoothing: antialiased; }
          .fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
          .fade-up.visible { opacity: 1; transform: translateY(0); }
          img { display: block; }
          a { font-family: var(--font-family); }
        `}</style>
      </head>
      <NavbarV2 />
      <main>{children}</main>

      {/* Footer */}
      <footer
        style={{
          background: "#f5f5f7",
          padding: "60px 20px 40px",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div style={{ maxWidth: "980px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          {/* Logo */}
          <Link href="/v2" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "#1d1d1f",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5" r="2.5" stroke="white" strokeWidth="1.5" />
                <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontSize: "17px", fontWeight: 600, color: "#1d1d1f" }}>Stampify</span>
          </Link>

          {/* Footer links */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 24px",
              justifyContent: "center",
            }}
          >
            {[
              { label: "Fonctionnalités", href: "/v2/fonctionnalites" },
              { label: "Tarif", href: "/v2/tarif" },
              { label: "Démos", href: "/v2/demos" },
              { label: "Blog", href: "/blog" },
              { label: "Mentions légales", href: "/mentions-legales" },
              { label: "CGV", href: "/conditions-utilisation" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "13px",
                  color: "#6e6e73",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p style={{ fontSize: "12px", color: "#6e6e73" }}>© 2026 Stampify</p>
        </div>
      </footer>
    </>
  );
}
