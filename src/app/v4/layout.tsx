import type { Metadata } from "next";
import NavbarV4 from "./NavbarV4";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stampify v4 — Preview",
  description: "Site vitrine + carte fidélité digitale + plaquette NFC pour commerces locaux. 990 CHF, livraison 48h.",
  robots: "noindex",
};

export default function V4Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            --bg: #fafaf8;
            --bg-alt: #f4f4f2;
            --text: #1a1a1a;
            --text2: #555555;
            --green: #1d9e75;
            --green-hover: #17886a;
            --green-light: #e8f7f2;
          }
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; font-family: var(--font); }
          body {
            font-family: var(--font);
            color: var(--text);
            background: var(--bg);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .fade-up {
            opacity: 0;
            transform: translateY(24px);
            transition: opacity 0.6s ease, transform 0.6s ease;
          }
          .fade-up.visible {
            opacity: 1;
            transform: translateY(0);
          }
          img { display: block; max-width: 100%; }
          a { font-family: var(--font); }
          @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; transition: none !important; }
          }
        `}</style>
      </head>
      <NavbarV4 />
      <main>{children}</main>

      {/* Footer */}
      <footer style={{
        background: "#f4f4f2",
        padding: "56px 20px 40px",
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          <Link href="/v4" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "18px", height: "18px", background: "#1d9e75", borderRadius: "4px", flexShrink: 0 }} />
            <span style={{ fontSize: "17px", fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.02em" }}>Stampify</span>
          </Link>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", justifyContent: "center" }}>
            {[
              { label: "Fonctionnalités", href: "/v4/fonctionnalites" },
              { label: "Tarif", href: "/v4/tarif" },
              { label: "Démos", href: "/v4/demos" },
              { label: "Blog", href: "/blog" },
              { label: "Mentions légales", href: "/mentions-legales" },
              { label: "CGV", href: "/conditions-utilisation" },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{ fontSize: "13px", color: "#555555", textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "#999" }}>© 2026 Stampify · Suisse romande &amp; France</p>
        </div>
      </footer>
    </>
  );
}
