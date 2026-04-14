import Link from "next/link";

const WA_LINK =
  "https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Stampify.";

export default function DemoBanner() {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-[#E2D9CC] px-8 py-3.5">
      {/* Desktop */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <p className="text-sm" style={{ color: "#6B6259" }}>
            Exemple de site livré en 48h par Stampify
          </p>
          <p className="text-sm font-medium" style={{ color: "#1A1410" }}>
            990 CHF · Site + carte fidélité + plaquette NFC · Paiement unique
          </p>
        </div>
        <Link
          href={WA_LINK}
          className="bg-[#3D31B0] text-white px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap"
        >
          Obtenir mon site →
        </Link>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden flex-col gap-3 text-center">
        <div>
          <p className="text-sm" style={{ color: "#6B6259" }}>
            Exemple de site livré en 48h par Stampify
          </p>
          <p className="text-sm font-medium" style={{ color: "#1A1410" }}>
            990 CHF · Site + carte fidélité + plaquette NFC · Paiement unique
          </p>
        </div>
        <Link
          href={WA_LINK}
          className="bg-[#3D31B0] text-white px-5 py-2.5 rounded-lg text-sm font-semibold w-full text-center block"
        >
          Obtenir mon site →
        </Link>
      </div>
    </div>
  );
}
