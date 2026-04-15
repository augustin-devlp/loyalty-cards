import type { Metadata } from "next";
import NavbarV4 from "./NavbarV4";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stampify — Site web pour commerces locaux",
  description: "Stampify crée votre site web professionnel avec carte de fidélité digitale en 48h. 990 CHF, livraison rapide, Suisse romande.",
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
            --color-bg: #fafaf8;
            --color-bg-alt: #f4f4f2;
            --color-text: #1a1a1a;
            --color-text-secondary: #555555;
            --color-green: #1d9e75;
            --color-green-dark: #18875f;
            --font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html { scroll-behavior: smooth; font-family: var(--font-family); }
          body { font-family: var(--font-family); color: #1a1a1a; background: #fafaf8; -webkit-font-smoothing: antialiased; }
          .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
          .fade-up.visible { opacity: 1; transform: translateY(0); }
          img { display: block; }
          a { font-family: var(--font-family); }
        `}</style>
      </head>
      <NavbarV4 />
      <main>{children}</main>

      {/* Footer */}
      <footer style={{ background: "#1a1a1a", padding: "60px 20px 40px", fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "28px" }}>
          <Link href="/v4" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "22px", height: "22px", background: "#1d9e75", borderRadius: "5px", flexShrink: 0 }} />
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>Stampify</span>
          </Link>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", justifyContent: "center" }}>
            {[
              { label: "Fonctionnalités", href: "/v4/fonctionnalites" },
              { label: "Tarif", href: "/v4/tarif" },
              { label: "Démos", href: "/v4/demos" },
              { label: "Blog", href: "/blog" },
              { label: "Mentions légales", href: "/mentions-legales" },
              { label: "CGV", href: "/conditions-utilisation" },
            ].map((link) => (
              <Link key={link.href} href={link.href} style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>© 2026 Stampify</p>
        </div>
      </footer>
    </>
  );
}
