import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stampify — Site web + carte fidelite pour commercants | Suisse romande",
  description:
    "Site vitrine professionnel + carte de fidélité digitale + plaquette NFC en bois. Livraison 48h, 990 CHF tout inclus, domaine .ch + hébergement offerts. Pour boulangers, cafés, restaurants et salons en Suisse romande.",
  keywords: [
    "carte fidelite digitale Suisse",
    "site web boulangerie Geneve",
    "site vitrine commercant Lausanne",
    "carte fidelite sans application",
    "fidelisation clients commerce local Suisse romande",
    "site web restaurant Fribourg",
    "carte fidelite cafe Suisse",
    "creation site web 48h Suisse",
    "carte fidelite digitale commercant",
    "site vitrine boulangerie Suisse",
  ],
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://www.stampify.ch",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Stampify",
  },
  openGraph: {
    title: "Stampify — Fidelisez vos clients en 48h | 990 CHF",
    description:
      "Site web + carte fidelite + plaquette NFC. 990 CHF, livraison 48h, zero abonnement.",
    url: "https://www.stampify.ch",
    siteName: "Stampify",
    locale: "fr_CH",
    type: "website",
    images: [{ url: "/icon-512.svg" }],
  },
  twitter: {
    card: "summary",
    title: "Stampify — Fidelisez vos clients en 48h | 990 CHF",
    description:
      "Site web + carte fidelite + plaquette NFC. 990 CHF, livraison 48h, zero abonnement.",
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
        <meta name="theme-color" content="#3D31B0" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
