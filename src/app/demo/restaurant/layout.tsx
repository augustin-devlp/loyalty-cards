import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Démo site web restaurant | Stampify Suisse romande",
  description:
    "Exemple de site vitrine restaurant créé en 48h. SEO local, carte fidélité, domaine .ch inclus.",
};

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
