import Link from "next/link";
import FloatingHands from "@/components/FloatingHands";

export default function FinalCTASection() {
  return (
    <section style={{
      background: "#1d9e75",
      position: "relative",
      overflow: "hidden",
      padding: "120px 24px",
      textAlign: "center",
    }}>
      <FloatingHands />

      <div style={{ position: "relative", zIndex: 2 }}>
        <h2 style={{
          fontFamily: "var(--font-fraunces), serif",
          fontWeight: 700,
          fontSize: "clamp(32px, 4vw, 52px)",
          color: "#fff",
          lineHeight: 1.15,
          marginBottom: 20,
        }}>
          Prêt à fidéliser tes clients ?
        </h2>

        <p style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 18,
          color: "rgba(255,255,255,0.85)",
          marginBottom: 40,
          maxWidth: 480,
          margin: "0 auto 40px",
        }}>
          Rejoins les commerçants romands qui ont arrêté de perdre leurs clients.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
          <Link href="https://wa.me/41791342997?text=Bonjour%20%21%20Je%20souhaite%20d%C3%A9marrer%20avec%20Stampify%20%28990%20CHF%29." style={{
            background: "#fff",
            color: "#1d9e75",
            borderRadius: 10,
            padding: "16px 32px",
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 16, fontWeight: 500,
            textDecoration: "none",
            display: "inline-block",
            transition: "transform 0.15s",
          }}>
            Démarrer pour 990 CHF
          </Link>
          <Link href="https://wa.me/41791342997" style={{
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: 10,
            padding: "16px 32px",
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 16, fontWeight: 500,
            textDecoration: "none",
            display: "inline-block",
            transition: "border-color 0.15s",
          }}>
            Parler à Augustin
          </Link>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {["Paiement sécurisé", "Remboursé si insatisfait", "En ligne en 48h"].map(badge => (
            <span key={badge} style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13,
              color: "rgba(255,255,255,0.75)",
            }}>✓ {badge}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
