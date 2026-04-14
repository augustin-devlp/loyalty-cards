import Link from "next/link";

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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: "#3D31B0",
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="4"
                stroke="white"
                strokeWidth="2"
              />
              <circle cx="12" cy="9" r="3" stroke="white" strokeWidth="2" />
              <path
                d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span
            style={{
              color: "white",
              fontWeight: 700,
              fontSize: 16,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Stampify
          </span>
        </div>
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
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {l}
            </Link>
          ))}
        </div>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
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
