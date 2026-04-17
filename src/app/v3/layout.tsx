import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ScrollProgress from
  '@/components/v3/ScrollProgress'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400','500','600','700','800'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Stampify — Site vitrine + carte fidélité',
  description: 'Site vitrine professionnel +' +
    ' carte de fidélité digitale + plaquette NFC.' +
    ' 990 CHF, 48h. Suisse romande.',
  robots: { index: false },
  themeColor: '#1d9e75',
}

export default function V3Layout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <meta name="theme-color"
          content="#1d9e75" />
      </head>
      <body style={{
        fontFamily: 'var(--font-inter), sans-serif',
        background: '#FFFFFF',
        color: '#0A0A0A',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}>
        <ScrollProgress />
        {children}
      </body>
    </html>
  )
}
