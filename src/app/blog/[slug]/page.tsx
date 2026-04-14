import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, getPost } from "../posts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      <Navbar />

      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "100px 24px 60px" }}>
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

            {/* Voir la démo */}
            <div
              style={{
                background: "white",
                border: "1px solid #E2D9CC",
                borderRadius: 12,
                padding: "24px 32px",
                marginTop: 48,
              }}
            >
              <h3
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1A1410",
                  margin: "0 0 12px 0",
                }}
              >
                Voir la démo
              </h3>
              <p style={{ color: "#6B6259", fontSize: 15, margin: "0 0 16px 0", lineHeight: 1.6 }}>
                Découvrez des exemples concrets de sites et cartes fidélité créés pour des commerces locaux :
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link
                  href="/demo/boulangerie"
                  style={{
                    color: "#3D31B0",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    background: "#EEF0FC",
                    padding: "8px 16px",
                    borderRadius: 6,
                  }}
                >
                  Démo boulangerie →
                </Link>
                <Link
                  href="/demo/cafe"
                  style={{
                    color: "#3D31B0",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    background: "#EEF0FC",
                    padding: "8px 16px",
                    borderRadius: 6,
                  }}
                >
                  Démo café →
                </Link>
                <Link
                  href="/demo/restaurant"
                  style={{
                    color: "#3D31B0",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    background: "#EEF0FC",
                    padding: "8px 16px",
                    borderRadius: 6,
                  }}
                >
                  Démo restaurant →
                </Link>
                <Link
                  href="/demo/barbershop"
                  style={{
                    color: "#3D31B0",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    background: "#EEF0FC",
                    padding: "8px 16px",
                    borderRadius: 6,
                  }}
                >
                  Démo barbershop →
                </Link>
              </div>
            </div>

            {/* End CTA */}
            <div
              style={{
                background: "#3D31B0",
                borderRadius: 16,
                padding: "32px 40px",
                marginTop: 32,
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontFamily: "Fraunces, Georgia, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "white",
                  margin: "0 0 12px 0",
                }}
              >
                Prêt à fidéliser vos clients ?
              </h3>
              <p style={{ color: "rgba(255,255,255,0.85)", margin: "0 0 24px 0", fontSize: 16, lineHeight: 1.6 }}>
                Obtenez votre site web + carte fidélité + plaquette NFC pour 990 CHF, livré en 48h.
              </p>
              <a
                href="https://wa.me/41791342997?text=Bonjour%2C%20j%27ai%20une%20question%20pour%20l%27%C3%A9quipe%20Stampify."
                style={{
                  display: "inline-block",
                  background: "white",
                  color: "#3D31B0",
                  padding: "14px 32px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                }}
              >
                Nous contacter sur WhatsApp →
              </a>
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
      <Footer />
    </div>
  );
}
