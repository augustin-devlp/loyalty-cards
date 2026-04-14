import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Démo site web spa | Stampify",
  description:
    "Exemple de site vitrine pour spa et institut de beauté. Site professionnel + carte fidélité + plaquette NFC en 48h.",
};

export default function SpaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
