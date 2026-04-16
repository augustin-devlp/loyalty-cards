import Link from "next/link";

export default function FinalCTA() {
  return (
    <section style={{
      background: "#1d9e75",
      padding: "160px 24px",
      position: "relative",
      overflow: "hidden",
      textAlign: "center",
    }}>
      {/* Background pattern */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 26 26' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='1' width='24' height='24' rx='7' stroke='white' stroke-width='2' fill='none'/%3E%3Ccircle cx='8' cy='9' r='2.2' fill='white'/%3E%3Ccircle cx='13' cy='9' r='2.2' fill='white'/%3E%3Ccircle cx='18' cy='9' r='2.2' fill='white'/%3E%3Ccircle cx='8' cy='14' r='2.2' fill='white'/%3E%3Ccircle cx='13' cy='14' r='2.2' fill='white'/%3E%3Ccircle cx='18' cy='14' r='2.2' fill='white'/%3E%3Ccircle cx='8' cy='19' r='2.2' fill='white'/%3E%3C/svg%3E")`,
        backgroundSize: "80px 80px",
        pointerEvents: "none",
      }} />
      {/* Orbs */}
      <div aria-hidden="true" style={{ position: "absolute", top: -100, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.10), transparent)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "absolute", bottom: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,0,0,0.10), transparent)", filter: "blur(60px)", pointerEvents: "none" }} />
      {/* Emoji decorations */}
      <div aria-hidden="true" style={{ position: "absolute", bottom: -20, right: -20, fontSize: 200, opacity: 0.08, transform: "rotate(-15deg)", pointerEvents: "none", userSelect: "none" }}>🤲</div>
      <div aria-hidden="true" style={{ position: "absolute", top: -40, left: -40, fontSize: 160, opacity: 0.06, transform: "rotate(15deg) scaleX(-1)", pointerEvents: "none", userSelect: "none" }}>🤝</div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
          Suisse romande & France
        </p>
        <h2 style={{ fontSize: "clamp(48px,7vw,80px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.02, color: "#fff", marginBottom: 24 }}>
          Votre commerce mérite<br />d&rsquo;être en ligne.
        </h2>
        <p style={{ fontSize: 19, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, maxWidth: 480, margin: "0 auto 48px" }}>
          Rejoignez les commerçants locaux qui ont choisi Stampify pour leur présence digitale et leur fidélisation client.
        </p>
        <Link href="/v2/subscribe" style={{
          display: "inline-flex", alignItems: "center",
          background: "#fff", color: "#1d9e75",
          borderRadius: 12, height: 60, padding: "0 40px",
          fontSize: 17, fontWeight: 700,
          textDecoration: "none",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}>
          Obtenir mon site — 990 CHF →
        </Link>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 20 }}>
          📱 Réponse sous 2h · 7j/7 &nbsp;·&nbsp; ⚡ 48h garanties
        </p>
      </div>
    </section>
  );
}
