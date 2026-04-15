import type { Metadata } from "next";
import NavbarV4 from "./NavbarV4";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stampify — Site vitrine + Carte fidélité + NFC · 990 CHF · 48h",
  description:
    "Site vitrine professionnel + carte fidélité digitale + plaquette NFC gravée. 990 CHF paiement unique. Livré en 48h. Suisse romande & France.",
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
            --bg: #FBF8F3;
            --bg-alt: #F2EFE9;
            --text: #1A1A1A;
            --text2: #5C5C5C;
            --green: #1d9e75;
            --green-dark: #0D7A5A;
            --green-light: #E8F7F2;
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
          .fade-up.visible { opacity: 1; transform: translateY(0); }
          img { display: block; max-width: 100%; }
          a { font-family: var(--font); }
          .sec-pad { padding: 160px 20px; }
          .sec-pad-sm { padding: 80px 20px; }
          @media (max-width: 900px) {
            .sec-pad { padding: 90px 20px; }
            .sec-pad-sm { padding: 48px 20px; }
          }
          @media (max-width: 600px) {
            .sec-pad { padding: 60px 20px; }
            .sec-pad-sm { padding: 40px 20px; }
          }
          @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; transition: none !important; }
          }
        `}</style>
      </head>
      <NavbarV4 />
      <main>{children}</main>

      {/* Footer */}
      <footer style={{
        background: "#F2EFE9",
        padding: "56px 20px 40px",
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      }}>
        <div style={{
          maxWidth: "900px", margin: "0 auto",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "24px",
        }}>
          <Link href="/v4" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "18px", height: "18px", background: "#1d9e75", borderRadius: "4px", flexShrink: 0 }} />
            <span style={{ fontSize: "17px", fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>Stampify</span>
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
              <Link key={link.href} href={link.href} style={{ fontSize: "14px", color: "#5C5C5C", textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "#5C5C5C" }}>© 2026 Stampify · Suisse romande &amp; France</p>
        </div>
      </footer>
    </>
  );
}
