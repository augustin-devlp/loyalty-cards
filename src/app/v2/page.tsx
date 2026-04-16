"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import Link from "next/link";

// ── Fade-up animation wrapper ──────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  style: extraStyle,
}: {
  children: ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: reduced
          ? "none"
          : `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        ...extraStyle,
      }}
    >
      {children}
    </div>
  );
}

// ── Reusable section-title block ───────────────────────────────────────────
function SectionHeader({
  badge,
  title,
  subtitle,
  light = false,
}: {
  badge?: string;
  title: ReactNode;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div style={{ textAlign: "center", marginBottom: "72px" }}>
      {badge && (
        <FadeUp>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: light ? "rgba(232,247,242,0.15)" : "#E8F7F2",
              border: `1px solid rgba(29,158,117,${light ? "0.3" : "0.2"})`,
              borderRadius: "980px",
              padding: "6px 16px",
              fontSize: "13px",
              color: light ? "rgba(255,255,255,0.85)" : "#1d9e75",
              fontWeight: 500,
              marginBottom: "24px",
            }}
          >
            {badge}
          </div>
        </FadeUp>
      )}
      <FadeUp delay={0.05}>
        <h2
          style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: light ? "#fff" : "#0A0A0A",
            marginBottom: subtitle ? "20px" : 0,
          }}
        >
          {title}
        </h2>
      </FadeUp>
      {subtitle && (
        <FadeUp delay={0.1}>
          <p
            style={{
              fontSize: "19px",
              color: light ? "rgba(255,255,255,0.75)" : "#6B7280",
              maxWidth: "580px",
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            {subtitle}
          </p>
        </FadeUp>
      )}
    </div>
  );
}

// ── Check mark icon ────────────────────────────────────────────────────────
function Check() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1d9e75"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function V2Page() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div
      style={{
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#0A0A0A",
        overflowX: "hidden",
      }}
    >
      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          paddingTop: "120px",
          paddingBottom: "100px",
          textAlign: "center",
          overflow: "hidden",
          background: "#FFFFFF",
        }}
      >
        {/* Gradient orbs */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(29,158,117,0.07) 0%, transparent 70%)",
            filter: "blur(1px)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-60px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(29,158,117,0.05) 0%, transparent 70%)",
            filter: "blur(2px)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(29,158,117,0.04) 0%, transparent 70%)",
            filter: "blur(2px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
          }}
        >
          {/* Badge */}
          <FadeUp>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#E8F7F2",
                border: "1px solid rgba(29,158,117,0.2)",
                borderRadius: "980px",
                padding: "7px 18px",
                fontSize: "13px",
                color: "#1d9e75",
                fontWeight: 500,
                marginBottom: "36px",
                letterSpacing: "-0.01em",
              }}
            >
              ✦ Livraison en 48h garantie · Suisse romande
            </div>
          </FadeUp>

          {/* Title */}
          <FadeUp delay={0.07}>
            <h1
              style={{
                fontSize: "clamp(52px, 8vw, 96px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.02,
                marginBottom: "28px",
                color: "#0A0A0A",
              }}
            >
              Vos clients
              <br />
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                }}
              >
                reviennent.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 18"
                  style={{
                    position: "absolute",
                    bottom: "-6px",
                    left: 0,
                    width: "100%",
                    height: "auto",
                    overflow: "visible",
                  }}
                >
                  <path
                    d="M4 12 C60 4, 120 16, 180 8 C240 2, 280 14, 296 10"
                    stroke="#1d9e75"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
              </span>
              <br />À chaque fois.
            </h1>
          </FadeUp>

          {/* Subtitle */}
          <FadeUp delay={0.12}>
            <p
              style={{
                fontSize: "21px",
                color: "#6B7280",
                maxWidth: "540px",
                margin: "0 auto 40px",
                lineHeight: 1.6,
                letterSpacing: "-0.01em",
              }}
            >
              Site vitrine professionnel + carte fidélité digitale + plaquette
              NFC gravée en bois. 990 CHF, une fois. Livré en 48 heures.
            </p>
          </FadeUp>

          {/* CTAs */}
          <FadeUp delay={0.16}>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "28px",
              }}
            >
              <Link
                href="/v2/subscribe"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#1d9e75",
                  color: "#fff",
                  borderRadius: "980px",
                  padding: "0 32px",
                  height: "56px",
                  fontSize: "16px",
                  fontWeight: 700,
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                  transition: "background 0.2s, transform 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#0D7A5A";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1d9e75";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Obtenir mon site → 990 CHF
              </Link>
              <Link
                href="/v2/demos"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "transparent",
                  color: "#1d9e75",
                  border: "1.5px solid #1d9e75",
                  borderRadius: "980px",
                  padding: "0 32px",
                  height: "56px",
                  fontSize: "16px",
                  fontWeight: 600,
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                  transition: "background 0.2s, color 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#E8F7F2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Voir les démos →
              </Link>
            </div>
          </FadeUp>

          {/* Metrics */}
          <FadeUp delay={0.2}>
            <p
              style={{
                fontSize: "13px",
                color: "#9CA3AF",
                letterSpacing: "0.01em",
              }}
            >
              990 CHF · Paiement unique · 48h · 100% propriétaire
            </p>
          </FadeUp>
        </div>

        {/* Dashboard mockup */}
        <FadeUp delay={0.24} style={{ marginTop: "64px" }}>
          <div
            style={{
              maxWidth: "860px",
              margin: "0 auto",
              padding: "0 24px",
            }}
          >
            <div
              style={{
                borderRadius: "16px",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.08)",
                overflow: "hidden",
                background: "#fff",
              }}
            >
              {/* Browser bar */}
              <div
                style={{
                  background: "#F5F5F5",
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  borderBottom: "1px solid rgba(0,0,0,0.07)",
                }}
              >
                <div style={{ display: "flex", gap: "6px" }}>
                  {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
                    <div
                      key={c}
                      style={{
                        width: "11px",
                        height: "11px",
                        borderRadius: "50%",
                        background: c,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "#fff",
                    borderRadius: "8px",
                    padding: "5px 12px",
                    fontSize: "12px",
                    color: "#6B7280",
                    border: "1px solid rgba(0,0,0,0.08)",
                    textAlign: "center",
                    maxWidth: "300px",
                    margin: "0 auto",
                  }}
                >
                  🔒 cafe-lumiere.stampify.ch
                </div>
              </div>

              {/* Dashboard body */}
              <div
                className="mock-body"
                style={{ display: "flex", minHeight: "320px" }}
              >
                {/* Sidebar */}
                <div
                  className="mock-sidebar"
                  style={{
                    width: "192px",
                    background: "#F9FAFB",
                    borderRight: "1px solid rgba(0,0,0,0.06)",
                    padding: "20px 14px",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      marginBottom: "20px",
                      color: "#0A0A0A",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    ☕ Café Lumière
                  </div>
                  {[
                    { icon: "▪", label: "Dashboard", active: true },
                    { icon: "○", label: "Clients" },
                    { icon: "◈", label: "Campagnes" },
                    { icon: "⬡", label: "Carte fidélité" },
                    { icon: "⚙", label: "Paramètres" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        marginBottom: "2px",
                        background: item.active ? "#E8F7F2" : "transparent",
                        color: item.active ? "#1d9e75" : "#6B7280",
                        fontSize: "12px",
                        fontWeight: item.active ? 600 : 400,
                      }}
                    >
                      <span style={{ fontSize: "9px" }}>{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div style={{ flex: 1, padding: "20px 24px", overflowY: "hidden" }}>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      marginBottom: "16px",
                      color: "#0A0A0A",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Bonjour, Sophie 👋
                  </div>

                  {/* Stat cards */}
                  <div
                    className="mock-stats"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    {[
                      { v: "247", l: "clients actifs", s: "+12 ce mois" },
                      { v: "1 834", l: "tampons", s: "+89 cette semaine" },
                      { v: "43", l: "récompenses", s: "+6 ce mois" },
                      { v: "68%", l: "taux retour", s: "+4% ce mois" },
                    ].map((st) => (
                      <div
                        key={st.l}
                        style={{
                          background: "#F9FAFB",
                          borderRadius: "10px",
                          padding: "10px",
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: 800,
                            color: "#0A0A0A",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {st.v}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#6B7280",
                            lineHeight: 1.3,
                          }}
                        >
                          {st.l}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#1d9e75",
                            fontWeight: 600,
                            marginTop: "2px",
                          }}
                        >
                          {st.s}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bar chart */}
                  <div
                    style={{
                      background: "#F9FAFB",
                      borderRadius: "10px",
                      padding: "12px",
                      border: "1px solid rgba(0,0,0,0.06)",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        marginBottom: "10px",
                        color: "#0A0A0A",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Activité des 7 derniers jours
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "5px",
                        height: "48px",
                      }}
                    >
                      {[60, 85, 45, 90, 75, 95, 55].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            borderRadius: "3px 3px 0 0",
                            background: `rgba(29,158,117,${0.5 + (h / 100) * 0.5})`,
                            height: `${h * 0.48}px`,
                          }}
                        />
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
                      {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            fontSize: "8px",
                            color: "#9CA3AF",
                            textAlign: "center",
                          }}
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SMS preview */}
                  <div
                    style={{
                      background: "#E8F7F2",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      border: "1px solid rgba(29,158,117,0.15)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#0D7A5A",
                        marginBottom: "4px",
                      }}
                    >
                      Campagne SMS en cours...
                    </div>
                    <div style={{ fontSize: "12px", color: "#0A0A0A" }}>
                      🥐 Viennoiseries -20% ce weekend !
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#6B7280",
                        marginTop: "4px",
                      }}
                    >
                      Envoyé à 247 clients
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── 2. SOCIAL PROOF BAR ───────────────────────────────────────────── */}
      <section
        style={{
          background: "#F9FAFB",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "24px 0",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            fontWeight: 600,
            color: "#9CA3AF",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "18px",
          }}
        >
          Ils nous font confiance
        </p>
        <div style={{ overflow: "hidden", position: "relative" }}>
          <div className="marquee-track">
            {[...Array(2)].map((_, ri) => (
              <div
                key={ri}
                style={{
                  display: "flex",
                  gap: "24px",
                  alignItems: "center",
                  paddingRight: "24px",
                  flexShrink: 0,
                }}
              >
                {[
                  "☕ Café Lumière · Genève",
                  "🥐 Boulangerie Martin · Lausanne",
                  "✂️ Black Scissors · Fribourg",
                  "🧖 Spa Essence · Genève",
                  "💅 Nail Studio · Lausanne",
                  "🍽️ Le Comptoir · Neuchâtel",
                  "☕ Le Torréfacteur · Vevey",
                  "💆 Institut Belle · Sion",
                ].map((name) => (
                  <div
                    key={name + ri}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "#fff",
                      border: "1px solid rgba(0,0,0,0.06)",
                      borderRadius: "980px",
                      padding: "8px 20px",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#0A0A0A",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURES ──────────────────────────────────────────────────── */}
      <section
        id="features"
        style={{
          background: "#FFFFFF",
          padding: "120px 24px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionHeader
            title={
              <>
                Tout ce dont votre commerce
                <br />
                a besoin. En une seule commande.
              </>
            }
            subtitle="Vous n'avez pas besoin d'une agence web, d'un logiciel de fidélité, et d'un outil SMS. Vous avez besoin de Stampify."
          />

          <div className="feat-grid">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d9e75" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                ),
                title: "Site vitrine 5 pages",
                desc: "À vos couleurs, mobile-first, domaine .ch inclus, SEO local optimisé dès le départ.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d9e75" strokeWidth="2">
                    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                ),
                title: "Carte fidélité digitale",
                desc: "10 tampons personnalisables. Sans app, sans compte client. QR code ou NFC.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d9e75" strokeWidth="2">
                    <path d="M12 22V12M12 12C12 7 7 3 2 3s0 9 10 9M12 12c0-5 5-9 10-9s0 9-10 9"/>
                  </svg>
                ),
                title: "Plaquette NFC en bois gravée",
                desc: "Livrée avec votre commande. Posée sur votre comptoir. Vos clients approchent leur téléphone — c'est tout.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d9e75" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                ),
                title: "SEO local optimisé",
                desc: "Apparaissez sur Google Maps avant vos concurrents. Mots-clés locaux intégrés dès la mise en ligne.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d9e75" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                ),
                title: "Dashboard clients en temps réel",
                desc: "Combien de clients actifs, tampons distribués, récompenses utilisées. Visible depuis votre téléphone.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d9e75" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                ),
                title: "Campagnes SMS & push",
                desc: "Envoyez une promo à tous vos clients fidèles en 2 clics. 1 campagne offerte le premier mois.",
              },
            ].map((feat, i) => (
              <FadeUp key={feat.title} delay={i * 0.07}>
                <div
                  style={{
                    padding: "36px",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: "20px",
                    background: "#fff",
                    height: "100%",
                    boxSizing: "border-box",
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 12px 40px rgba(0,0,0,0.07)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "#E8F7F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    {feat.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "17px",
                      fontWeight: 700,
                      color: "#0A0A0A",
                      marginBottom: "10px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "15px",
                      color: "#6B7280",
                      lineHeight: 1.65,
                    }}
                  >
                    {feat.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ──────────────────────────────────────────────── */}
      <section
        style={{
          background: "#F9FAFB",
          padding: "120px 24px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <SectionHeader
            badge="Simple et rapide"
            title={
              <>
                De zéro à votre site
                <br />
                en 48 heures.
              </>
            }
          />

          <div className="steps-row">
            {[
              {
                n: "1",
                emoji: "💬",
                title: "Parlez-nous de votre commerce",
                desc: "Un échange rapide sur WhatsApp. On note vos couleurs, votre adresse, vos horaires, votre style. Réponse sous 2h, 7j/7.",
              },
              {
                n: "2",
                emoji: "⚡",
                title: "On crée tout en 48h",
                desc: "Site, carte fidélité, plaquette NFC gravée, SEO local. Vous ne faites rien. On vous envoie le lien pour valider. 2 retouches gratuites incluses.",
              },
              {
                n: "3",
                emoji: "🚀",
                title: "Vos clients reviennent",
                desc: "Votre commerce est en ligne sur Google. La plaquette est sur votre comptoir. Les clients scannent, les tampons s'accumulent. Vous voyez tout en direct.",
              },
            ].map((step, i) => (
              <FadeUp key={step.n} delay={i * 0.1}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "0 16px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "#1d9e75",
                      color: "#fff",
                      fontSize: "20px",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {step.n}
                  </div>
                  <div style={{ fontSize: "28px", marginBottom: "12px" }}>
                    {step.emoji}
                  </div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#0A0A0A",
                      marginBottom: "12px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "15px",
                      color: "#6B7280",
                      lineHeight: 1.7,
                      maxWidth: "260px",
                      margin: "0 auto",
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* CTA */}
          <FadeUp delay={0.3}>
            <div style={{ textAlign: "center", marginTop: "64px" }}>
              <Link
                href="/v2/subscribe"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#1d9e75",
                  color: "#fff",
                  borderRadius: "980px",
                  padding: "0 36px",
                  height: "56px",
                  fontSize: "16px",
                  fontWeight: 700,
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                Démarrer — 990 CHF →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 5. STATS ─────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#FFFFFF",
          padding: "100px 24px",
        }}
      >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div className="stats-row">
            {[
              { value: "400 000+", label: "commerces sans site web en Suisse" },
              { value: "67%", label: "dépenses supplémentaires du client fidèle" },
              { value: "48h", label: "délai de livraison garanti" },
              { value: "990 CHF", label: "tout inclus, une seule fois" },
            ].map((stat, i) => (
              <FadeUp key={stat.label} delay={i * 0.08}>
                <div style={{ textAlign: "center", padding: "0 16px" }}>
                  <div
                    style={{
                      fontSize: "clamp(40px, 6vw, 72px)",
                      fontWeight: 800,
                      color: "#1d9e75",
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      marginBottom: "12px",
                    }}
                  >
                    {stat.value}
                  </div>
                  <p
                    style={{
                      fontSize: "15px",
                      color: "#6B7280",
                      lineHeight: 1.5,
                      maxWidth: "160px",
                      margin: "0 auto",
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.35}>
            <p
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: "#9CA3AF",
                fontStyle: "italic",
                marginTop: "48px",
              }}
            >
              Sources : OFS Suisse, Bain &amp; Company, études internes 2024-2025
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── 6. AVANT / APRÈS ─────────────────────────────────────────────── */}
      <section
        style={{
          background: "#F9FAFB",
          padding: "100px 24px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2
                style={{
                  fontSize: "clamp(36px, 5vw, 56px)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  marginBottom: "12px",
                }}
              >
                Avant et après Stampify.
              </h2>
              <p style={{ fontSize: "18px", color: "#6B7280" }}>
                La différence est réelle.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                border: "1px solid rgba(0,0,0,0.06)",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  background: "#F9FAFB",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {["", "❌ Sans Stampify", "✅ Avec Stampify"].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "16px 20px",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: i === 0 ? "#9CA3AF" : i === 1 ? "#EF4444" : "#1d9e75",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {[
                [
                  "Carte fidélité",
                  "Papier perdu en 2 jours",
                  "Digitale, sur le téléphone, toujours là",
                ],
                [
                  "Site web",
                  "Inexistant ou Wix bâclé",
                  "5 pages pro, domaine .ch, SEO inclus",
                ],
                [
                  "Visibilité Google",
                  "Invisible sur Maps",
                  "Premier résultat local de votre ville",
                ],
                [
                  "Rappel clients",
                  "Vous espérez qu'ils reviennent",
                  "SMS automatique qui les rappelle",
                ],
                [
                  "Plaquette NFC",
                  "Pas de plaquette",
                  "Bois gravé livré, posé sur le comptoir",
                ],
                [
                  "Coût",
                  "Agence = 1 500–5 000 CHF (site seul)",
                  "990 CHF tout inclus, une seule fois",
                ],
              ].map((row, ri) => (
                <div
                  key={ri}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    borderBottom:
                      ri < 5 ? "1px solid rgba(0,0,0,0.05)" : "none",
                    background: ri % 2 === 0 ? "#fff" : "#FAFAFA",
                  }}
                >
                  <div
                    style={{
                      padding: "16px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#0A0A0A",
                    }}
                  >
                    {row[0]}
                  </div>
                  <div
                    style={{
                      padding: "16px 20px",
                      fontSize: "13px",
                      color: "#9CA3AF",
                      lineHeight: 1.5,
                    }}
                  >
                    {row[1]}
                  </div>
                  <div
                    style={{
                      padding: "16px 20px",
                      fontSize: "13px",
                      color: "#0A0A0A",
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    {row[2]}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 7. DEMOS ─────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#FFFFFF",
          padding: "120px 24px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionHeader
            title="Voyez le résultat avant de commander."
            subtitle="Chaque démo est un vrai site créé avec Stampify."
          />

          <div className="demo-grid">
            {[
              {
                name: "Spa Essence",
                city: "Genève",
                cat: "Spa & Bien-être",
                imgId: "photo-1540555700478-4be289fbecef",
                href: "/demo/spa",
                badge: "⭐ Le plus demandé",
              },
              {
                name: "Café Lumière",
                city: "Lausanne",
                cat: "Café & Brunch",
                imgId: "photo-1495474472287-4d71bcdd2085",
                href: "/demo/cafe",
                badge: null,
              },
              {
                name: "Le Comptoir",
                city: "Neuchâtel",
                cat: "Restaurant",
                imgId: "photo-1414235077428-338989a2e8c0",
                href: "/demo/restaurant",
                badge: null,
              },
              {
                name: "Boulangerie Martin",
                city: "Lausanne",
                cat: "Boulangerie",
                imgId: "photo-1556742049-0cfed4f6a45d",
                href: "/demo/boulangerie",
                badge: null,
              },
              {
                name: "Black Scissors",
                city: "Fribourg",
                cat: "Barbershop",
                imgId: "photo-1503951914875-452162b0f3f1",
                href: "/demo/barbershop",
                badge: null,
              },
              {
                name: "Nail Studio",
                city: "Lausanne",
                cat: "Beauté",
                imgId: "photo-1604902396020-c7b77965a820",
                href: "/demo/manucure",
                badge: null,
              },
            ].map((d, i) => (
              <FadeUp key={d.name} delay={i * 0.07}>
                <Link href={d.href} style={{ textDecoration: "none", display: "block" }}>
                  <div
                    style={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid rgba(0,0,0,0.06)",
                      background: "#fff",
                      transition: "box-shadow 0.2s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.10)";
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "16/9",
                        background: "#E8F7F2",
                      }}
                    >
                      <img
                        src={`https://images.unsplash.com/${d.imgId}?w=640&q=80&fit=crop`}
                        alt={d.name}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)",
                        }}
                      />
                      {d.badge && (
                        <div
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            background: "#1d9e75",
                            color: "#fff",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "4px 12px",
                            borderRadius: "980px",
                          }}
                        >
                          {d.badge}
                        </div>
                      )}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "14px",
                          left: "16px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.8)",
                            marginBottom: "2px",
                            fontWeight: 500,
                          }}
                        >
                          {d.cat} · {d.city}
                        </div>
                        <div
                          style={{
                            fontSize: "17px",
                            fontWeight: 700,
                            color: "#fff",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {d.name}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "13px",
                        color: "#1d9e75",
                        fontWeight: 600,
                      }}
                    >
                      Voir la démo
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.4}>
            <div style={{ textAlign: "center", marginTop: "48px" }}>
              <Link
                href="/v2/demos"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "1.5px solid #1d9e75",
                  color: "#1d9e75",
                  borderRadius: "980px",
                  padding: "0 32px",
                  height: "52px",
                  fontSize: "15px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Voir toutes les démos →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 8. TESTIMONIALS ──────────────────────────────────────────────── */}
      <section
        style={{
          background: "#F9FAFB",
          padding: "120px 24px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionHeader
            badge="Ce que disent nos commerçants"
            title="Ils nous font confiance."
          />

          <div className="testi-grid">
            {[
              {
                quote:
                  "J'avais essayé de créer mon site sur Wix — j'ai abandonné après 3 heures. Stampify m'a livré un site complet en 2 jours. Mes clients adorent la carte fidélité.",
                name: "Sophie M.",
                role: "Boulangerie artisanale · Lausanne",
              },
              {
                quote:
                  "La plaquette NFC sur mon comptoir fait souvent réagir les clients. Ils trouvent ça moderne. Et moi, j'ai enfin une carte fidélité qui fonctionne — plus de cartes perdues.",
                name: "Karim B.",
                role: "Café & brunch · Genève",
              },
              {
                quote:
                  "990 CHF pour le site, la carte, et la plaquette. Mon ancienne agence me demandait 3 500 CHF juste pour le site. Le rapport qualité-prix est franchement imbattable.",
                name: "Marie-Claire F.",
                role: "Salon de coiffure · Fribourg",
              },
            ].map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.08}>
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: "20px",
                    padding: "40px",
                    height: "100%",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Stars */}
                  <div style={{ display: "flex", gap: "3px", marginBottom: "20px" }}>
                    {[...Array(5)].map((_, si) => (
                      <svg key={si} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>

                  <p
                    style={{
                      fontSize: "17px",
                      color: "#1A1A1A",
                      fontStyle: "italic",
                      lineHeight: 1.7,
                      flex: 1,
                      marginBottom: "24px",
                    }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div
                    style={{
                      borderTop: "1px solid rgba(0,0,0,0.06)",
                      paddingTop: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#0A0A0A",
                        marginBottom: "2px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {t.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "#6B7280" }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. PRICING ───────────────────────────────────────────────────── */}
      <section
        id="pricing"
        style={{
          background: "#FFFFFF",
          padding: "120px 24px",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <SectionHeader
            badge="Tarif"
            title={
              <>
                Un investissement unique.
                <br />
                Zéro abonnement.
              </>
            }
            subtitle="Vous payez une fois. C'est à vous pour toujours. Domaine, hébergement, tout inclus."
          />

          {/* Pricing card */}
          <FadeUp delay={0.1}>
            <div
              style={{
                maxWidth: "520px",
                margin: "0 auto 80px",
                background: "#fff",
                border: "2px solid #1d9e75",
                borderRadius: "24px",
                padding: "56px",
                boxShadow: "0 24px 80px rgba(29,158,117,0.12)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#E8F7F2",
                  border: "1px solid rgba(29,158,117,0.2)",
                  borderRadius: "980px",
                  padding: "6px 16px",
                  fontSize: "13px",
                  color: "#1d9e75",
                  fontWeight: 600,
                  marginBottom: "28px",
                }}
              >
                ⭐ Le forfait unique
              </div>

              <div
                style={{
                  fontSize: "80px",
                  fontWeight: 800,
                  color: "#0A0A0A",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                990{" "}
                <span style={{ fontSize: "32px", fontWeight: 700, color: "#6B7280" }}>
                  CHF
                </span>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "32px",
                }}
              >
                paiement unique — aucun abonnement
              </p>

              <div
                style={{
                  height: "1px",
                  background: "rgba(0,0,0,0.06)",
                  marginBottom: "28px",
                }}
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  textAlign: "left",
                  marginBottom: "36px",
                }}
              >
                {[
                  "Site web vitrine 5 pages personnalisé",
                  "Domaine .ch + hébergement 1ère année",
                  "Carte de fidélité digitale 10 cases",
                  "Plaquette NFC en bois gravée à votre nom",
                  "SEO local complet (Google Maps + Search)",
                  "QR code imprimable A4/A5",
                  "1 campagne SMS offerte le premier mois",
                  "2 retouches gratuites incluses",
                  "Livraison en 48h garantie",
                  "Dashboard clients en temps réel",
                ].map((feat) => (
                  <div
                    key={feat}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      fontSize: "15px",
                      color: "#0A0A0A",
                    }}
                  >
                    <Check />
                    {feat}
                  </div>
                ))}
              </div>

              <Link
                href="/v2/subscribe"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "18px",
                  background: "#1d9e75",
                  color: "#fff",
                  borderRadius: "980px",
                  fontSize: "17px",
                  fontWeight: 700,
                  textDecoration: "none",
                  textAlign: "center",
                  letterSpacing: "-0.01em",
                  transition: "background 0.2s",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#0D7A5A")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#1d9e75")
                }
              >
                Obtenir mon site maintenant →
              </Link>

              <p
                style={{
                  fontSize: "13px",
                  color: "#9CA3AF",
                  marginTop: "16px",
                  fontStyle: "italic",
                }}
              >
                2.71 CHF par jour. Moins que votre café du matin.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: "#9CA3AF",
                fontStyle: "italic",
                marginBottom: "56px",
              }}
            >
              Add-on optionnel : 49 CHF/mois — campagnes SMS + mises à jour
              mensuelles + rapport mensuel. Sans engagement.
            </p>
          </FadeUp>

          {/* Comparison table */}
          <FadeUp delay={0.2}>
            <div
              style={{
                background: "#F9FAFB",
                borderRadius: "20px",
                border: "1px solid rgba(0,0,0,0.06)",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  background: "#F3F4F6",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {["Agence classique", "DIY (Wix + outils)", "Stampify"].map(
                  (h, i) => (
                    <div
                      key={h}
                      style={{
                        padding: "16px 24px",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: i === 2 ? "#1d9e75" : "#0A0A0A",
                        borderLeft:
                          i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none",
                      }}
                    >
                      {h}
                    </div>
                  )
                )}
              </div>
              {/* Rows */}
              {[
                [
                  "1 500 – 5 000 CHF",
                  "684 CHF/an, sans qualité",
                  "990 CHF une fois",
                ],
                [
                  "Site seul",
                  "Deux outils séparés",
                  "Site + carte + NFC + SEO",
                ],
                [
                  "3 mois de délai",
                  "20-40h de votre temps",
                  "48h garanti",
                ],
              ].map((row, ri) => (
                <div
                  key={ri}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    borderBottom:
                      ri < 2 ? "1px solid rgba(0,0,0,0.05)" : "none",
                    background: ri % 2 === 0 ? "#fff" : "#F9FAFB",
                  }}
                >
                  {row.map((cell, ci) => (
                    <div
                      key={ci}
                      style={{
                        padding: "14px 24px",
                        fontSize: "14px",
                        color: ci === 2 ? "#0A0A0A" : "#6B7280",
                        fontWeight: ci === 2 ? 600 : 400,
                        borderLeft:
                          ci > 0 ? "1px solid rgba(0,0,0,0.06)" : "none",
                      }}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 10. POINZ COMPARISON ─────────────────────────────────────────── */}
      <section
        style={{
          background: "#F9FAFB",
          padding: "100px 24px",
        }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <FadeUp>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <h2
                style={{
                  fontSize: "clamp(32px, 5vw, 56px)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  marginBottom: "16px",
                }}
              >
                Pourquoi Stampify plutôt que Poinz ?
              </h2>
              <p
                style={{
                  fontSize: "17px",
                  color: "#6B7280",
                  lineHeight: 1.65,
                  maxWidth: "480px",
                  margin: "0 auto",
                }}
              >
                Poinz est gratuit. Mais votre branding, votre site, votre
                relation client — tout reste sous leur marque.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                border: "1px solid rgba(0,0,0,0.06)",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr",
                  background: "#F3F4F6",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {["Fonctionnalité", "Stampify ✅", "Poinz ❌"].map((h, i) => (
                  <div
                    key={h}
                    style={{
                      padding: "14px 20px",
                      fontSize: "12px",
                      fontWeight: 700,
                      color:
                        i === 1 ? "#1d9e75" : i === 2 ? "#EF4444" : "#6B7280",
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      borderLeft:
                        i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none",
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>

              {[
                ["Site vitrine personnalisé", "✅", "❌"],
                ["Votre propre branding", "✅", "❌ (logo Poinz)"],
                ["Carte fidélité digitale", "✅", "✅"],
                ["Plaquette NFC physique", "✅", "❌"],
                ["Domaine .ch à votre nom", "✅", "❌"],
                ["SEO local optimisé", "✅", "❌"],
                ["Campagnes SMS", "✅", "Limité"],
                ["Dashboard analytics", "✅", "Basique"],
                ["Support en français CH", "✅", "❌"],
                ["Prix", "990 CHF one-time", "Gratuit mais limité"],
                ["100% propriétaire", "✅", "❌"],
              ].map((row, ri) => (
                <div
                  key={ri}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr",
                    borderBottom:
                      ri < 10 ? "1px solid rgba(0,0,0,0.05)" : "none",
                    background: ri % 2 === 0 ? "#fff" : "#FAFAFA",
                  }}
                >
                  <div
                    style={{
                      padding: "13px 20px",
                      fontSize: "13px",
                      color: "#0A0A0A",
                      fontWeight: 500,
                    }}
                  >
                    {row[0]}
                  </div>
                  <div
                    style={{
                      padding: "13px 20px",
                      fontSize: "13px",
                      color: "#1d9e75",
                      fontWeight: 600,
                      borderLeft: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    {row[1]}
                  </div>
                  <div
                    style={{
                      padding: "13px 20px",
                      fontSize: "13px",
                      color: "#9CA3AF",
                      borderLeft: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    {row[2]}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 11. FAQ ──────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#FFFFFF",
          padding: "100px 24px",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <FadeUp>
            <h2
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                textAlign: "center",
                marginBottom: "56px",
              }}
            >
              Questions fréquentes
            </h2>
          </FadeUp>

          {[
            {
              q: "Combien de temps faut-il pour créer mon site ?",
              a: "48 heures après réception de vos informations (logo, couleurs, horaires, photos). Vous validez, on met en ligne. 2 retouches gratuites incluses.",
            },
            {
              q: "Est-ce que mes clients ont besoin de télécharger une application ?",
              a: "Non — c'est notre grande force. La carte fidélité s'ouvre directement dans Safari ou Chrome via QR code ou NFC. Zéro friction pour vos clients.",
            },
            {
              q: "Que se passe-t-il après la première année d'hébergement ?",
              a: "Le renouvellement est d'environ 120 CHF/an (domaine + hébergement). Vous n'avez aucune obligation.",
            },
            {
              q: "Est-ce que je peux modifier le site moi-même après livraison ?",
              a: "Pour les modifications courantes (horaires, menu, photos), passez par WhatsApp — on les fait dans la journée. Un éditeur en libre-service est en cours de développement.",
            },
            {
              q: "La plaquette NFC fonctionne avec tous les téléphones ?",
              a: "Oui — compatible avec tous les iPhones depuis 2018 et tous les Android depuis 2015. Soit 99% des smartphones actuels. Si le client préfère, le QR code imprimable est toujours disponible.",
            },
          ].map((faq, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div
                style={{
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "24px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: "16px",
                    fontFamily: "inherit",
                  }}
                >
                  <span
                    style={{
                      fontSize: "17px",
                      fontWeight: 600,
                      color: "#0A0A0A",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.q}
                  </span>
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "#E8F7F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "transform 0.25s ease",
                      transform:
                        faqOpen === i ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1d9e75"
                      strokeWidth="2.5"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: faqOpen === i ? "300px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.35s ease",
                  }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#6B7280",
                      lineHeight: 1.7,
                      paddingBottom: "24px",
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── 12. CTA FINAL ────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#1d9e75",
          padding: "140px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle background pattern (stamp icons) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 32 32' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='2' y='2' width='28' height='28' rx='7' ry='7' stroke='white' stroke-width='2' fill='transparent'/%3E%3Ccircle cx='10' cy='11' r='2.2'/%3E%3Ccircle cx='16' cy='11' r='2.2'/%3E%3Ccircle cx='22' cy='11' r='2.2'/%3E%3Ccircle cx='10' cy='17' r='2.2'/%3E%3Ccircle cx='16' cy='17' r='2.2'/%3E%3Ccircle cx='22' cy='17' r='2.2'/%3E%3Ccircle cx='10' cy='23' r='2.2'/%3E%3C/svg%3E")`,
            backgroundSize: "80px 80px",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
          <FadeUp>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.75)",
                fontStyle: "italic",
                marginBottom: "20px",
                letterSpacing: "0.02em",
              }}
            >
              Suisse romande &amp; France
            </p>
          </FadeUp>
          <FadeUp delay={0.07}>
            <h2
              style={{
                fontSize: "clamp(48px, 7vw, 80px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.02,
                color: "#fff",
                marginBottom: "24px",
              }}
            >
              Votre commerce mérite
              <br />
              d&rsquo;être en ligne.
            </h2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p
              style={{
                fontSize: "19px",
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.6,
                marginBottom: "48px",
                maxWidth: "480px",
                margin: "0 auto 48px",
              }}
            >
              Rejoignez les commerçants locaux qui ont choisi Stampify pour
              leur présence digitale.
            </p>
          </FadeUp>
          <FadeUp delay={0.16}>
            <Link
              href="/v2/subscribe"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#fff",
                color: "#1d9e75",
                borderRadius: "980px",
                padding: "0 40px",
                height: "60px",
                fontSize: "17px",
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "-0.01em",
                transition: "box-shadow 0.2s, transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Obtenir mon site — 990 CHF →
            </Link>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.7)",
                marginTop: "24px",
                lineHeight: 1.6,
              }}
            >
              📱 Réponse sous 2h · 7j/7 · ⚡ Livraison 48h garantie ·
              🔒 Paiement sécurisé
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── GLOBAL STYLES ────────────────────────────────────────────────── */}
      <style>{`
        /* Marquee */
        .marquee-track {
          display: flex;
          animation: marquee 30s linear infinite;
          width: max-content;
        }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Features grid */
        .feat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* Steps */
        .steps-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
          position: relative;
        }
        .steps-row::before {
          content: '';
          position: absolute;
          top: 28px;
          left: calc(16.67% + 28px);
          right: calc(16.67% + 28px);
          height: 2px;
          border-top: 2px dashed rgba(29,158,117,0.3);
          pointer-events: none;
        }

        /* Stats row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }

        /* Demo grid */
        .demo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* Testimonials */
        .testi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .feat-grid { grid-template-columns: repeat(2, 1fr); }
          .demo-grid { grid-template-columns: repeat(2, 1fr); }
          .testi-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 767px) {
          .feat-grid { grid-template-columns: 1fr; }
          .steps-row { grid-template-columns: 1fr; gap: 40px; }
          .steps-row::before { display: none; }
          .stats-row { grid-template-columns: repeat(2, 1fr); gap: 24px; }
          .demo-grid { grid-template-columns: 1fr; }
          .testi-grid { grid-template-columns: 1fr; }
          .mock-sidebar { display: none !important; }
          .mock-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }

        @media (max-width: 480px) {
          .stats-row { grid-template-columns: 1fr; }
          .mock-stats { grid-template-columns: 1fr 1fr !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
