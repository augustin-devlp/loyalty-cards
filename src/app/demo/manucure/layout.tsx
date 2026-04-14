import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Démo site web nail art | Stampify",
  description:
    "Exemple de site vitrine pour onglerie et nail art. Site + carte fidélité en 48h pour 990 CHF.",
};

export default function ManucureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
