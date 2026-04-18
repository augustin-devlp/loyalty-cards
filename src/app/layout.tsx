import type { Metadata } from 'next';
import { Fraunces, DM_Sans } from 'next/font/google';
import './globals.css';
import ConditionalNavbar from '@/components/ConditionalNavbar';
import ConditionalFooter from '@/components/ConditionalFooter';
import ScrollAnimationInit from '@/components/ScrollAnimationInit';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-fraunces',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

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
    <html lang="fr" className={`${fraunces.variable} ${dmSans.variable}`}>
      <head>
        <meta name="theme-color" content="#1d9e75" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="antialiased">
        <ConditionalNavbar />
        <ScrollAnimationInit />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
