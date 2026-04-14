import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo site web boulangerie | Stampify Suisse romande",
  description: "Exemple de site vitrine pour boulangerie cree par Stampify. Livraison 48h, 990 CHF, carte fidelite digitale incluse.",
};

export default function BoulangerieLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
