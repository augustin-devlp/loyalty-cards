import Link from "next/link";
import StampifyLogo from "./StampifyLogo";

export default function Footer() {
  return (
    <footer style={{ background: "#1A1410", padding: "40px 32px" }}>
      <div
        style={{
          maxWidth: 1152,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <StampifyLogo size="sm" color="white" />
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[
            ["Fonctionnalités", "/fonctionnalites"],
            ["Tarif", "/tarif"],
            ["Démos", "/demos"],
            ["Blog", "/blog"],
            ["Mentions légales", "/mentions-legales"],
            ["CGV", "/conditions-utilisation"],
          ].map(([l, h]) => (
            <Link
              key={h}
              href={h}
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 13,
                textDecoration: "none",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {l}
            </Link>
          ))}
        </div>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          © 2026 Stampify
        </span>
      </div>
    </footer>
  );
}
