import Link from "next/link";

const WA_LINK =
  "https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Stampify.";

export default function DemoBanner() {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "white",
        borderBottom: "1px solid #E2D9CC",
        padding: "14px 32px",
      }}
    >
      {/* Desktop layout */}
      <div className="hidden md:flex flex-row items-center justify-between">
        <div>
          <p style={{ fontSize: 13, color: "#6B6259", margin: 0, lineHeight: 1.4 }}>
            Exemple de site livré en 48h par Stampify
          </p>
          <p
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "#1A1410",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            990 CHF · Site + carte fidélité + plaquette NFC · Paiement unique
          </p>
        </div>
        <Link
          href={WA_LINK}
          style={{
            background: "#3D31B0",
            color: "white",
            padding: "10px 22px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Obtenir mon site
        </Link>
      </div>

      {/* Mobile layout */}
      <div
        className="flex md:hidden flex-col items-center"
        style={{ gap: 12, textAlign: "center" }}
      >
        <div>
          <p style={{ fontSize: 12, color: "#6B6259", margin: 0, lineHeight: 1.4 }}>
            Exemple de site livré en 48h par Stampify
          </p>
          <p
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#1A1410",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            990 CHF · Site + carte fidélité + plaquette NFC
          </p>
        </div>
        <Link
          href={WA_LINK}
          style={{
            background: "#3D31B0",
            color: "white",
            padding: "10px 22px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
            display: "block",
            width: "100%",
            textAlign: "center",
          }}
        >
          Obtenir mon site
        </Link>
      </div>
    </div>
  );
}
