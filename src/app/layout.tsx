import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollAnimationInit from '@/components/ScrollAnimationInit';

export const metadata: Metadata = {
  title: 'Stampify — Carte fidélité digitale pour commerçants locaux | Suisse romande',
  description: 'Donnez à votre commerce une carte fidélité sur smartphone et un site vitrine. 990 CHF, tout inclus, en ligne en 48h. Genève, Lausanne, Fribourg.',
  keywords: ['carte fidélité digitale Suisse', 'site web boulangerie Genève', 'site vitrine commerçant Lausanne', 'carte fidélité sans application', 'fidélisation clients commerce local Suisse romande'],
  manifest: '/manifest.json',
  alternates: { canonical: 'https://www.stampify.ch' },
  openGraph: {
    title: 'Stampify — Fidélisez vos clients en 48h | 990 CHF',
    description: 'Site web + carte fidélité sur smartphone. 990 CHF, livraison 48h, zéro abonnement.',
    url: 'https://www.stampify.ch',
    siteName: 'Stampify',
    locale: 'fr_CH',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#1d9e75" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Navbar />
        <ScrollAnimationInit />
        {children}
        <Footer />
      </body>
    </html>
  );
}
