"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const WA_MAIN =
  "https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20obtenir%20mon%20site%20Stampify%20%28990%20CHF%29.%20Pouvez-vous%20me%20contacter%20%3F";

/* ─── Animated hero title (word-by-word) ─── */
function AnimatedTitle({ text, style }: { text: string; style?: React.CSSProperties }) {
  const words = text.split(" ");
  return (
    <h1 style={{ ...style, overflow: "hidden" }}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: "0.25em",
            opacity: 0,
            transform: "translateY(24px)",
            animation: `wordIn 0.6s ease forwards`,
            animationDelay: `${i * 0.06}s`,
          }}
        >
          {word}
        </span>
      ))}
    </h1>
  );
}

/* ─── MacBook mockup ─── */
function MacBookV4({ imgSrc }: { imgSrc: string }) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "520px", margin: "0 auto" }}>
      {/* Outer body */}
      <div
        style={{
          background: "linear-gradient(180deg, #e8e8e6 0%, #d4d4d2 100%)",
          borderRadius: "14px 14px 0 0",
          padding: "12px 12px 0",
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          position: "relative",
        }}
      >
        {/* Camera */}
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#b0b0ae", margin: "0 auto 6px" }} />
        {/* Screen */}
        <div style={{ borderRadius: "6px", overflow: "hidden", position: "relative", background: "#000" }}>
          <img
            src={imgSrc}
            alt="Demo site"
            style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", display: "block" }}
          />
          {/* Reflection */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 50%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
      {/* Base */}
      <div
        style={{
          background: "linear-gradient(180deg, #d0d0ce 0%, #c4c4c2 100%)",
          height: "12px",
          borderRadius: "0 0 4px 4px",
          position: "relative",
        }}
      >
        {/* Trackpad hint */}
        <div style={{ width: "60px", height: "8px", background: "rgba(0,0,0,0.08)", borderRadius: "2px", margin: "0 auto", position: "relative", top: "2px" }} />
      </div>
      {/* Apple logo back-glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "24px",
          height: "24px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "50%",
          filter: "blur(8px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ─── iPhone mockup ─── */
function IphoneV4({ messages }: { messages: Array<{ text: string; from: "us" | "them" }> }) {
  return (
    <div
      style={{
        width: "220px",
        background: "#1a1a1a",
        borderRadius: "36px",
        padding: "14px 8px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
        position: "relative",
        margin: "0 auto",
      }}
    >
      {/* Volume buttons */}
      {[28, 64, 92].map((top, i) => (
        <div key={i} style={{ position: "absolute", left: "-4px", top: `${top}px`, width: "4px", height: i === 0 ? "20px" : "28px", background: "#2a2a2a", borderRadius: "2px 0 0 2px" }} />
      ))}
      {/* Power button */}
      <div style={{ position: "absolute", right: "-4px", top: "60px", width: "4px", height: "44px", background: "#2a2a2a", borderRadius: "0 2px 2px 0" }} />
      {/* Notch */}
      <div style={{ width: "80px", height: "20px", background: "#1a1a1a", borderRadius: "0 0 14px 14px", margin: "0 auto 10px" }} />
      {/* Screen */}
      <div style={{ background: "#f5f5f7", borderRadius: "24px", minHeight: "280px", padding: "12px 8px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", fontSize: "11px", fontWeight: 600, color: "#1a1a1a", marginBottom: "4px" }}>
          Stampify SMS
        </div>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.from === "us" ? "flex-end" : "flex-start", position: "relative" }}>
            <div
              style={{
                background: msg.from === "us" ? "#1d9e75" : "#ffffff",
                color: msg.from === "us" ? "#ffffff" : "#1a1a1a",
                borderRadius: msg.from === "us" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding: "8px 12px",
                fontSize: "11px",
                lineHeight: 1.4,
                maxWidth: "80%",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {/* Input bar */}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "6px", background: "#ffffff", borderRadius: "18px", padding: "6px 10px" }}>
          <div style={{ flex: 1, fontSize: "10px", color: "#c0c0c0" }}>Message</div>
          <div style={{ width: "18px", height: "18px", background: "#1d9e75", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: "10px", lineHeight: 1 }}>↑</span>
          </div>
        </div>
      </div>
      {/* Home indicator */}
      <div style={{ width: "60px", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", margin: "8px auto 0" }} />
    </div>
  );
}

/* ─── Loyalty card wheel ─── */
function LoyaltyWheel() {
  const [rotation, setRotation] = useState(0);
  const rafRef = useRef<number | null>(null);
  const rotRef = useRef(0);

  useEffect(() => {
    const animate = () => {
      rotRef.current += 0.12;
      setRotation(rotRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const stamps = Array.from({ length: 8 });
  const radius = 78;

  return (
    <div
      style={{
        width: "260px",
        height: "260px",
        perspective: "600px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `rotateX(12deg) rotateZ(${rotation}deg)`,
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        {/* Outer ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1d9e75 0%, #18875f 100%)",
            boxShadow: "0 12px 40px rgba(29,158,117,0.35)",
          }}
        />
        {/* Stamps */}
        {stamps.map((_, i) => {
          const angle = (i / stamps.length) * 360;
          const rad = (angle * Math.PI) / 180;
          const x = 130 + radius * Math.cos(rad) - 14;
          const y = 130 + radius * Math.sin(rad) - 14;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.20)",
                border: "2px solid rgba(255,255,255,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px" }}>✓</span>
            </div>
          );
        })}
        {/* Center */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) rotateZ(${-rotation}deg)`,
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ width: "22px", height: "22px", background: "#1d9e75", borderRadius: "5px" }} />
        </div>
      </div>
      {/* Pin */}
      <div
        style={{
          position: "absolute",
          top: "-8px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "16px",
          height: "16px",
          background: "linear-gradient(135deg, #ff453a, #ff6b6b)",
          borderRadius: "50% 50% 50% 0",
          rotate: "-45deg",
          boxShadow: "0 2px 8px rgba(255,69,58,0.5)",
        }}
      />
    </div>
  );
}

/* ─── Comparatif table ─── */
function ComparatifTable() {
  const rows = [
    { feature: "Site web professionnel", stampify: true, poinz: false },
    { feature: "Carte fidélité digitale", stampify: true, poinz: true },
    { feature: "Menu QR code", stampify: true, poinz: false },
    { feature: "Réservations en ligne", stampify: true, poinz: false },
    { feature: "SMS marketing", stampify: true, poinz: false },
    { feature: "Tableau de bord", stampify: true, poinz: true },
    { feature: "Sans abonnement mensuel", stampify: true, poinz: false },
    { feature: "Livraison en 48h", stampify: true, poinz: false },
    { feature: "Support 7j/7", stampify: true, poinz: false },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "14px 16px", color: "#555", fontWeight: 500, borderBottom: "2px solid rgba(0,0,0,0.08)" }}>Fonctionnalité</th>
            <th style={{ textAlign: "center", padding: "14px 16px", color: "#1d9e75", fontWeight: 700, borderBottom: "2px solid rgba(0,0,0,0.08)" }}>Stampify</th>
            <th style={{ textAlign: "center", padding: "14px 16px", color: "#555", fontWeight: 500, borderBottom: "2px solid rgba(0,0,0,0.08)" }}>Poinz</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}>
              <td style={{ padding: "14px 16px", color: "#1a1a1a" }}>{row.feature}</td>
              <td style={{ textAlign: "center", padding: "14px 16px", fontSize: "18px" }}>
                {row.stampify ? <span style={{ color: "#1d9e75" }}>✓</span> : <span style={{ color: "#ccc" }}>—</span>}
              </td>
              <td style={{ textAlign: "center", padding: "14px 16px", fontSize: "18px" }}>
                {row.poinz ? <span style={{ color: "#1d9e75" }}>✓</span> : <span style={{ color: "#ccc" }}>—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── FAQ accordion ─── */
const faqs = [
  { q: "Qu'est-ce qui est inclus dans les 990 CHF ?", a: "Tout : le site web, la carte fidélité, le menu QR, les réservations, l'hébergement 1 an, le domaine, et le support 7j/7. Pas de frais cachés." },
  { q: "Y a-t-il un abonnement mensuel ?", a: "Non. Le paiement est unique. Après la première année, l'hébergement est de 99 CHF/an seulement." },
  { q: "En combien de temps mon site est-il prêt ?", a: "48 heures ouvrables après validation de votre contenu. Souvent moins." },
  { q: "Puis-je modifier mon site moi-même ?", a: "Oui, via un tableau de bord simple. Sinon, on s'en occupe gratuitement dans le cadre du support inclus." },
  { q: "Comment se passe le paiement ?", a: "Par virement bancaire ou TWINT, après validation du devis. Aucune carte de crédit requise." },
  { q: "Quelle différence avec Poinz ou d'autres apps ?", a: "Stampify inclut un vrai site web — pas juste une carte fidélité dans une app partagée. Vos clients accèdent à votre univers complet, sans télécharger quoi que ce soit." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: "#ffffff",
        borderRadius: "14px",
        padding: "20px 24px",
        cursor: "pointer",
        border: "1px solid rgba(0,0,0,0.07)",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <span style={{ fontWeight: 600, fontSize: "16px", color: "#1a1a1a" }}>{q}</span>
        <span style={{ fontSize: "18px", color: "#1d9e75", flexShrink: 0, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
      </div>
      {open && (
        <p style={{ marginTop: "12px", fontSize: "15px", color: "#555555", lineHeight: 1.6 }}>{a}</p>
      )}
    </div>
  );
}

/* ─── Main page ─── */
export default function V4Page() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const reviews = [
    { name: "Marie C.", business: "Café Lumière, Genève", text: "Mon site était prêt en 36h. Les clients scannent la carte fidélité dès la caisse.", stars: 5 },
    { name: "Riad B.", business: "Black Scissors, Genève", text: "J'avais peur que ce soit compliqué. C'était simple et rapide. Le dashboard est top.", stars: 5 },
    { name: "Sophie M.", business: "Spa Essence, Lausanne", text: "Le QR menu a tout changé. On a économisé sur l'impression et les clients adorent.", stars: 5 },
  ];

  const demos = [
    { name: "Spa Essence", type: "Spa", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80", link: "https://loyalty-cards-rho.vercel.app/lessence-spa.html", external: true },
    { name: "Café Lumière", type: "Café", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", link: "/demos/cafe-lumiere.html", external: false },
    { name: "Black Scissors", type: "Barbershop", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", link: "/demos/black-scissors.html", external: false },
  ];

  const features = [
    { icon: "🌐", title: "Le site web", desc: "Rapide, beau, SEO local. Vos clients vous trouvent sur Google." },
    { icon: "🎯", title: "La carte fidélité", desc: "Tampons digitaux. Aucune app à télécharger. Marche sur tous les téléphones." },
    { icon: "📱", title: "Les SMS", desc: "Offres flash dans la poche de vos clients. Taux d'ouverture 98%." },
    { icon: "📋", title: "Le menu QR", desc: "Mettez à jour votre menu en 30 secondes. Zéro impression." },
    { icon: "📅", title: "Les réservations", desc: "En ligne 24h/24. Confirmation automatique. Zéro appel manqué." },
    { icon: "📊", title: "Le tableau de bord", desc: "Suivez tout : clients, tampons, réservations, SMS." },
  ];

  const process = [
    { n: "01", title: "Vous nous contactez", desc: "Sur WhatsApp. On vous répond en moins de 2h, 7j/7." },
    { n: "02", title: "On prépare votre site", desc: "En 48h, votre site est prêt, configuré, hébergé." },
    { n: "03", title: "Vous le lancez", desc: "On vous accompagne pour tout. Vos clients arrivent." },
  ];

  return (
    <>
      <style>{`
        @keyframes wordIn {
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .demo-card4 { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .demo-card4:hover { transform: translateY(-6px); box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important; }
        .feature-card4 { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .feature-card4:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.08) !important; }
        @media (max-width: 700px) {
          .hero-title4 { font-size: 48px !important; }
          .hero-sub4 { font-size: 18px !important; }
          .section-pad4 { padding: 100px 24px !important; }
          .btn-row4 { flex-direction: column !important; align-items: stretch !important; }
          .two-col4 { flex-direction: column !important; }
          .three-col4 { flex-direction: column !important; }
        }
      `}</style>

      {/* ── 1. HERO ── */}
      <section style={{ background: "#fafaf8", padding: "160px 24px 100px", textAlign: "center" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#e8f6f1", borderRadius: "980px", padding: "6px 14px", marginBottom: "28px" }}>
            <div style={{ width: "8px", height: "8px", background: "#1d9e75", borderRadius: "50%" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#1d9e75" }}>990 CHF · 48h · Suisse romande</span>
          </div>

          <AnimatedTitle
            text="Le site web de votre commerce. Simple. Rapide. Efficace."
            style={{
              fontSize: "80px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#1a1a1a",
              lineHeight: 1.0,
              marginBottom: "28px",
            }}
          />

          <p
            className="fade-up hero-sub4"
            style={{
              fontSize: "21px",
              color: "#555555",
              maxWidth: "560px",
              margin: "0 auto 40px",
              lineHeight: 1.55,
            }}
          >
            Carte fidélité digitale, réservations, SMS marketing — tout en un. Livré en 48h.
          </p>

          <div className="fade-up btn-row4" style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={WA_MAIN}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#1d9e75",
                color: "#ffffff",
                borderRadius: "980px",
                padding: "16px 32px",
                fontSize: "17px",
                fontWeight: 700,
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "transform 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.background = "#18875f"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#1d9e75"; }}
            >
              Obtenir mon site — 990 CHF
            </a>
            <Link
              href="/v4/demos"
              style={{
                background: "transparent",
                color: "#1a1a1a",
                borderRadius: "980px",
                padding: "16px 32px",
                fontSize: "17px",
                fontWeight: 600,
                textDecoration: "none",
                border: "1.5px solid rgba(0,0,0,0.15)",
                whiteSpace: "nowrap",
              }}
            >
              Voir les démos →
            </Link>
          </div>

          <p className="fade-up" style={{ marginTop: "20px", fontSize: "13px", color: "#999" }}>
            Réponse sous 2h · 7j/7
          </p>
        </div>
      </section>

      {/* ── 2. REVIEWS ── */}
      <section className="section-pad4" style={{ background: "#f4f4f2", padding: "100px 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p className="fade-up" style={{ textAlign: "center", fontSize: "13px", fontWeight: 600, color: "#1d9e75", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "16px" }}>
            Témoignages
          </p>
          <h2 className="fade-up" style={{ fontSize: "48px", fontWeight: 800, letterSpacing: "-0.03em", color: "#1a1a1a", textAlign: "center", marginBottom: "56px" }}>
            Ils l&apos;ont lancé.
          </h2>
          <div className="three-col4" style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {reviews.map((r, i) => (
              <div
                key={i}
                className="fade-up feature-card4"
                style={{
                  flex: "1 1 240px",
                  background: "#ffffff",
                  borderRadius: "18px",
                  padding: "28px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ color: "#1d9e75", fontSize: "18px", marginBottom: "12px" }}>{"★".repeat(r.stars)}</div>
                <p style={{ fontSize: "15px", color: "#1a1a1a", lineHeight: 1.6, marginBottom: "16px" }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a" }}>{r.name}</div>
                  <div style={{ fontSize: "12px", color: "#999" }}>{r.business}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. DEMOS PREVIEW ── */}
      <section className="section-pad4" style={{ background: "#fafaf8", padding: "180px 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p className="fade-up" style={{ fontSize: "13px", fontWeight: 600, color: "#1d9e75", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "16px" }}>
            Démos
          </p>
          <h2 className="fade-up" style={{ fontSize: "64px", fontWeight: 800, letterSpacing: "-0.04em", color: "#1a1a1a", marginBottom: "16px" }}>
            Voyez le résultat.
          </h2>
          <p className="fade-up" style={{ fontSize: "19px", color: "#555", marginBottom: "56px", lineHeight: 1.5 }}>
            Sites réels, livrés pour de vrais commerces en Suisse romande.
          </p>
          <div className="three-col4" style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "40px" }}>
            {demos.map((demo, i) => (
              <div key={i} className="fade-up demo-card4" style={{ flex: "1 1 220px", background: "#ffffff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                <img src={demo.img} alt={demo.name} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} loading="lazy" />
                <div style={{ padding: "18px" }}>
                  <div style={{ display: "inline-block", background: "#e8f6f1", color: "#1d9e75", borderRadius: "980px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>{demo.type}</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a", marginBottom: "10px" }}>{demo.name}</div>
                  <a href={demo.link} target={demo.external ? "_blank" : undefined} rel={demo.external ? "noopener noreferrer" : undefined} style={{ fontSize: "13px", color: "#1d9e75", fontWeight: 600, textDecoration: "none" }}>
                    Voir la démo →
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="fade-up" style={{ textAlign: "center" }}>
            <Link href="/v4/demos" style={{ fontSize: "15px", color: "#1d9e75", fontWeight: 600, textDecoration: "none" }}>
              Voir tous les exemples →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURES GRID ── */}
      <section className="section-pad4" style={{ background: "#f4f4f2", padding: "180px 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p className="fade-up" style={{ fontSize: "13px", fontWeight: 600, color: "#1d9e75", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "16px" }}>
            Fonctionnalités
          </p>
          <h2 className="fade-up" style={{ fontSize: "64px", fontWeight: 800, letterSpacing: "-0.04em", color: "#1a1a1a", marginBottom: "16px" }}>
            Tout ce qu&apos;il faut.
          </h2>
          <p className="fade-up" style={{ fontSize: "19px", color: "#555", marginBottom: "56px", lineHeight: 1.5 }}>
            Un seul produit. Zéro app à installer. Prêt en 48h.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
            {features.map((f, i) => (
              <div
                key={i}
                className="fade-up feature-card4"
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{f.icon}</div>
                <div style={{ fontSize: "17px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>{f.title}</div>
                <div style={{ fontSize: "14px", color: "#555", lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <div className="fade-up" style={{ textAlign: "center", marginTop: "40px" }}>
            <Link href="/v4/fonctionnalites" style={{ fontSize: "15px", color: "#1d9e75", fontWeight: 600, textDecoration: "none" }}>
              Toutes les fonctionnalités →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. WHEEL — La carte fidélité ── */}
      <section className="section-pad4" style={{ background: "#fafaf8", padding: "180px 24px" }}>
        <div className="two-col4" style={{ maxWidth: "860px", margin: "0 auto", display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 280px" }}>
            <p className="fade-up" style={{ fontSize: "13px", fontWeight: 600, color: "#1d9e75", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "16px" }}>
              Fidélité
            </p>
            <h2 className="fade-up" style={{ fontSize: "64px", fontWeight: 800, letterSpacing: "-0.04em", color: "#1a1a1a", marginBottom: "20px", lineHeight: 1.05 }}>
              La carte.
            </h2>
            <p className="fade-up" style={{ fontSize: "19px", color: "#555", lineHeight: 1.6, marginBottom: "28px" }}>
              Vos clients accumulent des tampons digitaux sur leur téléphone. Aucune app à télécharger. Fonctionne sur tous les smartphones.
            </p>
            <ul className="fade-up" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {["Tampons digitaux en 1 tap", "Récompenses automatiques", "Compatible iPhone & Android", "Sans application"].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: "#1a1a1a" }}>
                  <span style={{ color: "#1d9e75", fontWeight: 700 }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="fade-up" style={{ flex: "1 1 260px", display: "flex", justifyContent: "center" }}>
            <LoyaltyWheel />
          </div>
        </div>
      </section>

      {/* ── 6. NFC ── */}
      <section className="section-pad4" style={{ background: "#f4f4f2", padding: "180px 24px" }}>
        <div className="two-col4" style={{ maxWidth: "860px", margin: "0 auto", display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap" }}>
          <div className="fade-up" style={{ flex: "1 1 260px", display: "flex", justifyContent: "center" }}>
            {/* NFC card mockup */}
            <div
              style={{
                width: "240px",
                height: "150px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #1d9e75 0%, #18875f 100%)",
                boxShadow: "0 16px 48px rgba(29,158,117,0.4)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: "18px", height: "18px", background: "#1d9e75", borderRadius: "4px", border: "2px solid rgba(255,255,255,0.5)" }} />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.8 }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="white" strokeWidth="1.5" fill="none" />
                  <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" stroke="white" strokeWidth="1.5" fill="none" />
                  <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="white" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff", marginBottom: "2px" }}>Stampify</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>Carte NFC · Tap to open</div>
              </div>
              {/* Shimmer */}
              <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "100px", height: "100px", background: "rgba(255,255,255,0.06)", borderRadius: "50%" }} />
            </div>
          </div>
          <div style={{ flex: "1 1 280px" }}>
            <p className="fade-up" style={{ fontSize: "13px", fontWeight: 600, color: "#1d9e75", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "16px" }}>
              NFC
            </p>
            <h2 className="fade-up" style={{ fontSize: "64px", fontWeight: 800, letterSpacing: "-0.04em", color: "#1a1a1a", marginBottom: "20px", lineHeight: 1.05 }}>
              1 tap.
            </h2>
            <p className="fade-up" style={{ fontSize: "19px", color: "#555", lineHeight: 1.6, marginBottom: "28px" }}>
              Une carte physique NFC qui ouvre votre site instantanément. Vos clients l&apos;ont toujours sur eux.
            </p>
            <ul className="fade-up" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {["Compatible tous smartphones", "Aucune app requise", "Design personnalisé", "Livraison en 5 jours"].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: "#1a1a1a" }}>
                  <span style={{ color: "#1d9e75", fontWeight: 700 }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 7. SMS ── */}
      <section className="section-pad4" style={{ background: "#fafaf8", padding: "180px 24px" }}>
        <div className="two-col4" style={{ maxWidth: "860px", margin: "0 auto", display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 280px" }}>
            <p className="fade-up" style={{ fontSize: "13px", fontWeight: 600, color: "#1d9e75", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "16px" }}>
              SMS Marketing
            </p>
            <h2 className="fade-up" style={{ fontSize: "64px", fontWeight: 800, letterSpacing: "-0.04em", color: "#1a1a1a", marginBottom: "20px", lineHeight: 1.05 }}>
              Les SMS.
            </h2>
            <p className="fade-up" style={{ fontSize: "19px", color: "#555", lineHeight: 1.6, marginBottom: "28px" }}>
              Envoyez des offres flash directement dans la poche de vos clients. Taux d&apos;ouverture : 98%.
            </p>
            <ul className="fade-up" style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {["SMS personnalisés", "Offres flash en 1 clic", "Rappels automatiques", "Statistiques incluses"].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: "#1a1a1a" }}>
                  <span style={{ color: "#1d9e75", fontWeight: 700 }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="fade-up" style={{ flex: "1 1 260px", display: "flex", justifyContent: "center" }}>
            <IphoneV4
              messages={[
                { text: "☕ Offre flash : -20% sur votre prochain café. Valable aujourd'hui jusqu'à 18h.", from: "us" },
                { text: "Merci ! J'arrive !", from: "them" },
                { text: "Super ! On vous attend 🙂", from: "us" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── 8. COMPARATIF ── */}
      <section className="section-pad4" style={{ background: "#f4f4f2", padding: "180px 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p className="fade-up" style={{ fontSize: "13px", fontWeight: 600, color: "#1d9e75", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "16px", textAlign: "center" }}>
            Comparatif
          </p>
          <h2 className="fade-up" style={{ fontSize: "64px", fontWeight: 800, letterSpacing: "-0.04em", color: "#1a1a1a", marginBottom: "16px", textAlign: "center" }}>
            Stampify vs Poinz.
          </h2>
          <p className="fade-up" style={{ fontSize: "19px", color: "#555", marginBottom: "48px", lineHeight: 1.5, textAlign: "center" }}>
            Poinz n&apos;est qu&apos;une carte fidélité dans une app partagée. Stampify c&apos;est votre écosystème complet.
          </p>
          <div className="fade-up" style={{ background: "#ffffff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <ComparatifTable />
          </div>
        </div>
      </section>

      {/* ── 9. TARIF ── */}
      <section className="section-pad4" style={{ background: "#fafaf8", padding: "180px 24px" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
          <p className="fade-up" style={{ fontSize: "13px", fontWeight: 600, color: "#1d9e75", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "16px" }}>
            Tarif
          </p>
          <h2 className="fade-up" style={{ fontSize: "64px", fontWeight: 800, letterSpacing: "-0.04em", color: "#1a1a1a", marginBottom: "16px" }}>
            Simple.
          </h2>
          <div
            className="fade-up"
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              padding: "48px 40px",
              boxShadow: "0 4px 40px rgba(0,0,0,0.08)",
              marginBottom: "32px",
            }}
          >
            <div style={{ display: "inline-block", background: "#e8f6f1", color: "#1d9e75", borderRadius: "980px", padding: "5px 14px", fontSize: "12px", fontWeight: 700, marginBottom: "20px" }}>
              Tout inclus
            </div>
            <div style={{ fontSize: "96px", fontWeight: 800, letterSpacing: "-0.04em", color: "#1a1a1a", lineHeight: 1 }}>990</div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginBottom: "6px" }}>CHF</div>
            <div style={{ fontSize: "14px", color: "#999", marginBottom: "32px" }}>Paiement unique · Pas d&apos;abonnement</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px", textAlign: "left" }}>
              {["Site web professionnel", "Carte fidélité digitale", "Menu QR code", "Réservations en ligne", "SMS marketing (1er mois)", "Hébergement 1 an", "Domaine inclus", "Support 7j/7", "Livraison 48h"].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: "#1a1a1a" }}>
                  <span style={{ color: "#1d9e75", fontWeight: 700 }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <a
              href={WA_MAIN}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                background: "#1d9e75",
                color: "#ffffff",
                borderRadius: "980px",
                padding: "16px 32px",
                fontSize: "17px",
                fontWeight: 700,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Obtenir mon site →
            </a>
          </div>
          <Link href="/v4/tarif" style={{ fontSize: "14px", color: "#555", textDecoration: "none" }}>
            Voir toutes les options →
          </Link>
        </div>
      </section>

      {/* ── 10. FAQ ── */}
      <section className="section-pad4" style={{ background: "#f4f4f2", padding: "180px 24px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <h2 className="fade-up" style={{ fontSize: "64px", fontWeight: 800, letterSpacing: "-0.04em", color: "#1a1a1a", marginBottom: "56px", textAlign: "center" }}>
            FAQ.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {faqs.map((faq, i) => (
              <div key={i} className="fade-up">
                <FAQItem q={faq.q} a={faq.a} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. PROCESS ── */}
      <section className="section-pad4" style={{ background: "#fafaf8", padding: "180px 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p className="fade-up" style={{ fontSize: "13px", fontWeight: 600, color: "#1d9e75", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "16px", textAlign: "center" }}>
            Comment ça marche
          </p>
          <h2 className="fade-up" style={{ fontSize: "64px", fontWeight: 800, letterSpacing: "-0.04em", color: "#1a1a1a", marginBottom: "56px", textAlign: "center" }}>
            En 3 étapes.
          </h2>
          <div className="three-col4" style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {process.map((step, i) => (
              <div key={i} className="fade-up" style={{ flex: "1 1 200px", textAlign: "center" }}>
                <div style={{ fontSize: "40px", fontWeight: 800, color: "#1d9e75", marginBottom: "12px", letterSpacing: "-0.03em" }}>{step.n}</div>
                <div style={{ fontSize: "19px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>{step.title}</div>
                <div style={{ fontSize: "15px", color: "#555", lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. CTA FINAL DARK ── */}
      <section
        style={{
          background: "#0d0d0d",
          padding: "180px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* City night bg overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=60')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.10,
          }}
        />
        <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative" }}>
          <h2
            className="fade-up"
            style={{
              fontSize: "80px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              lineHeight: 1.0,
              marginBottom: "24px",
            }}
          >
            Votre commerce mérite mieux.
          </h2>
          <p className="fade-up" style={{ fontSize: "19px", color: "rgba(255,255,255,0.55)", marginBottom: "40px", lineHeight: 1.5, maxWidth: "520px", margin: "0 auto 40px" }}>
            Site web. Carte fidélité. SMS. Tout en 48h, pour 990 CHF.
          </p>
          <div className="fade-up btn-row4" style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
            <a
              href={WA_MAIN}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#1d9e75",
                color: "#ffffff",
                borderRadius: "980px",
                padding: "18px 40px",
                fontSize: "19px",
                fontWeight: 700,
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "transform 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.background = "#18875f"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#1d9e75"; }}
            >
              Obtenir mon site — 990 CHF →
            </a>
          </div>
          <p className="fade-up" style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
            📱 Réponse sous 2h · 7j/7
          </p>
        </div>
      </section>
    </>
  );
}
