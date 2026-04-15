import type { Metadata } from "next";
import "./globals.css";
import "../styles/brand.css";

export const metadata: Metadata = {
  title: "Stampify — Site web + carte fidélité pour commerçants | Suisse romande",
  description:
    "Site vitrine professionnel + carte de fidélité digitale + plaquette NFC en bois. Livraison 48h, 990 CHF tout inclus, domaine .ch + hébergement offerts. Pour boulangers, cafés, restaurants et salons en Suisse romande.",
  keywords: [
    "carte fidélité digitale Suisse",
    "site web boulangerie Genève",
    "site vitrine commerçant Lausanne",
    "carte fidélité sans application",
    "fidélisation clients commerce local Suisse romande",
    "site web restaurant Fribourg",
    "carte fidélité café Suisse",
    "création site web 48h Suisse",
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
    title: "Stampify — Fidélisez vos clients en 48h | 990 CHF",
    description:
      "Site web + carte fidélité + plaquette NFC. 990 CHF, livraison 48h, zéro abonnement.",
    url: "https://www.stampify.ch",
    siteName: "Stampify",
    locale: "fr_CH",
    type: "website",
    images: [{ url: "/icon-512.svg" }],
  },
  twitter: {
    card: "summary",
    title: "Stampify — Fidélisez vos clients en 48h | 990 CHF",
    description:
      "Site web + carte fidélité + plaquette NFC. 990 CHF, livraison 48h, zéro abonnement.",
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
        <meta name="theme-color" content="#1d9e75" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="alternate" hrefLang="fr-CH" href="https://www.stampify.ch/" />
        <link rel="alternate" hrefLang="de-CH" href="https://www.stampify.ch/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.stampify.ch/" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,600&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
