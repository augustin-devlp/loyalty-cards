import type { Metadata } from "next";
import { Inter } from "next/font/google";
import V2Navbar from "./_components/V2Navbar";
import V2Footer from "./_components/V2Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Stampify v2 — Site vitrine + Carte fidélité + NFC | 990 CHF",
  description:
    "Site vitrine professionnel, carte fidélité digitale et plaquette NFC gravée en bois. 990 CHF une seule fois. Livré en 48h. Pour les commerçants de Suisse romande.",
  robots: "noindex, nofollow",
};

export default function V2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={inter.className}
      style={{
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#FFFFFF",
        color: "#0A0A0A",
      }}
    >
      <V2Navbar />
      <main style={{ paddingTop: "64px" }}>{children}</main>
      <V2Footer />
    </div>
  );
}
