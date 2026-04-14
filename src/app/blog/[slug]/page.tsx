import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, getPost } from "../posts";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title + " | Stampify",
    description: post.metaDescription,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `https://www.stampify.ch/blog/${post.slug}`,
      siteName: "Stampify",
      locale: "fr_CH",
      type: "article",
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      {/* Navbar */}
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
          <Link href="/blog" style={{ color: "#3D31B0", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
            ← Tous les articles
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 48, alignItems: "start" }}>
          {/* Main content */}
          <article>
            <div style={{ marginBottom: 32 }}>
              <span
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
                {post.category}
              </span>
              <h1
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#1A1410",
                  margin: "0 0 16px 0",
                  lineHeight: 1.2,
                }}
              >
                {post.title}
              </h1>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "#9C9085" }}>{post.readingTime} min de lecture</span>
              </div>
            </div>

            <div
              className="prose-stampify"
              style={{
                fontSize: 18,
                lineHeight: 1.8,
                color: "#3A3028",
                fontFamily: "DM Sans, sans-serif",
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* End CTA */}
            <div
              style={{
                background: "#3D31B0",
                borderRadius: 16,
                padding: "32px 40px",
                marginTop: 48,
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "white",
                  margin: "0 0 8px 0",
                }}
              >
                Prêt à fidéliser vos clients ?
              </h3>
              <p style={{ color: "rgba(255,255,255,0.8)", margin: "0 0 20px 0", fontSize: 15 }}>
                990 CHF tout inclus · Site + carte fidélité + plaquette NFC · Livraison 48h
              </p>
              <Link
                href="/"
                style={{
                  display: "inline-block",
                  background: "white",
                  color: "#3D31B0",
                  padding: "12px 28px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                }}
              >
                Découvrir Stampify →
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ position: "sticky", top: 80 }}>
            <div
              style={{
                background: "white",
                border: "1px solid #E2D9CC",
                borderRadius: 12,
                padding: 24,
                marginBottom: 24,
              }}
            >
              <h4
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6B6259",
                  margin: "0 0 16px 0",
                }}
              >
                Articles récents
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          color: "#3D31B0",
                          marginTop: 2,
                          flexShrink: 0,
                        }}
                      >
                        {r.category}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#1A1410",
                        fontWeight: 500,
                        margin: "4px 0 0 0",
                        lineHeight: 1.4,
                      }}
                    >
                      {r.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "#3D31B0",
                borderRadius: 12,
                padding: 20,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: 15,
                  margin: "0 0 8px 0",
                  fontFamily: "Fraunces, Georgia, serif",
                }}
              >
                990 CHF tout inclus
              </p>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: "0 0 16px 0" }}>
                Site + carte fidélité + plaquette NFC
              </p>
              <Link
                href="/"
                style={{
                  display: "block",
                  background: "white",
                  color: "#3D31B0",
                  padding: "10px 0",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                Obtenir mon site
              </Link>
            </div>
          </aside>
        </div>

        {/* Related posts */}
        <div style={{ marginTop: 80, borderTop: "1px solid #E2D9CC", paddingTop: 48 }}>
          <h3
            style={{
              fontFamily: "Fraunces, Georgia, serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#1A1410",
              marginBottom: 24,
            }}
          >
            Articles similaires
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {related.map((r) => (
              <article
                key={r.slug}
                style={{
                  background: "white",
                  border: "1px solid #E2D9CC",
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#3D31B0",
                    marginBottom: 8,
                  }}
                >
                  {r.category}
                </span>
                <h4
                  style={{
                    fontFamily: "Fraunces, Georgia, serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#1A1410",
                    margin: "0 0 8px 0",
                    lineHeight: 1.3,
                  }}
                >
                  {r.title}
                </h4>
                <Link
                  href={`/blog/${r.slug}`}
                  style={{ color: "#3D31B0", fontWeight: 600, fontSize: 14, textDecoration: "none" }}
                >
                  Lire →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
