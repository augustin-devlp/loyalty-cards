import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo site web restaurant | Stampify Suisse romande",
  description: "Exemple de site vitrine restaurant cree par Stampify en 48h. SEO local, carte fidelite, domaine .ch inclus.",
};

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
