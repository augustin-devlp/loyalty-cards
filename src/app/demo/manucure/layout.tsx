import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo site web nail art manucure | Stampify",
  description: "Exemple de site vitrine pour onglerie et nail art. Stampify cree votre site + carte fidelite en 48h pour 990 CHF.",
};

export default function ManucureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
