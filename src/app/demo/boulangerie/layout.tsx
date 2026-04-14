import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Démo site web boulangerie | Stampify Suisse romande",
  description:
    "Exemple de site vitrine pour boulangerie créé par Stampify. Livraison 48h, 990 CHF, carte fidélité digitale incluse.",
};

export default function BoulangerieLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
