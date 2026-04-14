import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Démo site web café | Stampify Suisse romande",
  description:
    "Exemple de site vitrine pour café créé par Stampify. Livraison 48h, 990 CHF, carte fidélité digitale incluse.",
};

export default function CafeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
