import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loyalty Cards",
  description: "Gérez vos cartes de fidélité",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
