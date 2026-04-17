import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Inter } from "next/font/google";
import V5Navbar from "@/components/v5/Navbar";
import V5Footer from "@/components/v5/Footer";
import "./v5.css";

const inter = Inter({ subsets: ["latin"], weight: ["400","500","600","700","800"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Stampify v5 — Site vitrine + carte fidélité digitale | Suisse romande",
  description: "Site vitrine professionnel + carte de fidélité digitale + plaquette NFC gravée en bois. 990 CHF, livraison en 48h. Pour les commerçants locaux de Suisse romande.",
  robots: "noindex, nofollow",
  themeColor: "#1d9e75",
  openGraph: {
    title: "Stampify v5 — 990 CHF tout inclus",
    description: "Site vitrine + carte fidélité + NFC. 48h. Suisse.",
    type: "website",
  },
};

const wrapStyle: CSSProperties = {
  fontFamily: "var(--font-inter), Inter, -apple-system, sans-serif",
  background: "#FFFFFF",
  color: "#0A0A0A",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
};

export default function V5Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={inter.variable} style={wrapStyle}>
      <V5Navbar />
      <main>{children}</main>
      <V5Footer />
    </div>
  );
}
