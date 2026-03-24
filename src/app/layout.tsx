import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stampify",
  description: "Gérez vos cartes de fidélité",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Stampify",
  },
  openGraph: {
    title: "Stampify",
    description: "Gérez vos cartes de fidélité",
    images: [{ url: "/icon-512.svg" }],
  },
  twitter: {
    card: "summary",
    title: "Stampify",
    description: "Gérez vos cartes de fidélité",
    images: ["/icon-512.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#534AB7" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
