import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Démo site web salon coiffure | Stampify Suisse romande",
  description:
    "Exemple de site pour salon de coiffure. Carte fidélité digitale, plaquette NFC, 990 CHF tout inclus.",
};

export default function BarbershopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
