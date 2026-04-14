import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo site web spa institut de beaute | Stampify",
  description: "Exemple de site vitrine pour spa et institut de beaute. Site professionnel + carte fidelite + plaquette NFC en 48h.",
};

export default function SpaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
