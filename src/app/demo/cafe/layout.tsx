import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo site web cafe coffee shop | Stampify Suisse romande",
  description: "Exemple de site vitrine pour cafe cree par Stampify. Avec carte de fidelite digitale et plaquette NFC. 990 CHF tout inclus.",
};

export default function CafeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
