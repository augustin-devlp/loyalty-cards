import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "./posts";

export const metadata: Metadata = {
  title: "Blog Stampify — Conseils fidélisation clients pour commerçants",
  description:
    "Conseils pratiques pour fidéliser vos clients, créer votre site web et booster votre commerce local en Suisse romande.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <nav
        style={{
          background: "#F5F0E8",
          borderBottom: "1px solid #E2D9CC",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1152,
            margin: "0 auto",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: "#3D31B0",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="1.8" />
                <circle cx="12" cy="9" r="3" stroke="white" strokeWidth="1.8" />
                <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ color: "#1A1410", fontWeight: 600, fontSize: 18 }}>Stampify</span>
          </Link>
          <Link href="/" style={{ color: "#3D31B0", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
            ← Retour au site
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#3D31B0",
              marginBottom: 12,
            }}
          >
            Ressources
          </div>
          <h1
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: 36,
              fontWeight: 700,
              color: "#1A1410",
              margin: "0 0 12px 0",
            }}
          >
            Blog Stampify
          </h1>
          <p style={{ color: "#6B6259", fontSize: 16, maxWidth: 520, margin: "0 auto" }}>
            Conseils pratiques pour fidéliser vos clients et faire grandir votre commerce local en Suisse romande.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              style={{
                background: "white",
                border: "1px solid #E2D9CC",
                borderRadius: 12,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#3D31B0",
                }}
              >
                {post.category}
              </span>
              <h2
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1A1410",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {post.title}
              </h2>
              <p
                style={{
                  color: "#6B6259",
                  fontSize: 14,
                  lineHeight: 1.6,
                  margin: 0,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.excerpt}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "auto",
                  paddingTop: 8,
                }}
              >
                <span style={{ fontSize: 12, color: "#9C9085" }}>{post.readingTime} min de lecture</span>
                <Link
                  href={`/blog/${post.slug}`}
                  style={{
                    color: "#3D31B0",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                  }}
                >
                  Lire →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
