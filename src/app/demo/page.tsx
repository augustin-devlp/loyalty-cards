"use client";

import Link from "next/link";

const demos = [
  {
    slug: "cafe",
    name: "Café Lumière",
    subtitle: "Lyon 2",
    emoji: "☕",
    niche: "Café",
    description: "Carte fidélité, roue des récompenses & site vitrine pour votre café.",
    bg: "#3E1F0A",
    accent: "#C9A84C",
    light: "#F5F0E8",
    tagline: "1 café offert tous les 10",
  },
  {
    slug: "boulangerie",
    name: "Boulangerie Martin",
    subtitle: "Lyon 6",
    emoji: "🥐",
    niche: "Boulangerie",
    description: "Fidélisez vos habitués avec des tampons et des lots gourmands.",
    bg: "#5C3D11",
    accent: "#C8960C",
    light: "#FFF8E7",
    tagline: "1 viennoiserie offerte tous les 8",
  },
  {
    slug: "barbershop",
    name: "Black Scissors",
    subtitle: "Lyon 1",
    emoji: "✂️",
    niche: "Barbershop",
    description: "Programme VIP pour votre barbershop avec récompenses exclusives.",
    bg: "#1A1A1A",
    accent: "#C41E3A",
    light: "#F8F8F8",
    tagline: "1 coupe offerte à la 6e",
  },
  {
    slug: "restaurant",
    name: "Le Bistrot du Coin",
    subtitle: "Lyon 3",
    emoji: "🍽️",
    niche: "Restaurant",
    description: "Récompensez la fidélité de vos clients avec des offres exclusives.",
    bg: "#722F37",
    accent: "#B8960C",
    light: "#F5F0E8",
    tagline: "1 dessert offert tous les 5 repas",
  },
  {
    slug: "manucure",
    name: "Nail Studio",
    subtitle: "Lyon 2",
    emoji: "💅",
    niche: "Manucure",
    description: "Fidélisez votre clientèle avec une carte beauté digitale.",
    bg: "#D4AF37",
    accent: "#D4AF37",
    light: "#FFF5F7",
    tagline: "1 soin offert à la 6e visite",
  },
];

export default function DemoIndex() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="font-black text-xl text-gray-900">Stampify</span>
          </Link>
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            Commencer gratuitement
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
          5 démos interactives disponibles
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
          Découvrez Stampify
          <br />
          <span className="text-indigo-600">par secteur d&apos;activité</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
          Explorez des démos complètes et interactives adaptées à votre commerce. Carte fidélité, roue de la fortune, site vitrine — tout est là.
        </p>
        <p className="text-sm text-indigo-600 font-semibold">
          🎯 Votre version sera entièrement personnalisée à votre image
        </p>
      </section>

      {/* Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo) => (
            <Link
              key={demo.slug}
              href={`/demo/${demo.slug}`}
              className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card top — colored */}
              <div
                className="relative h-40 flex flex-col items-center justify-center p-6"
                style={{ backgroundColor: demo.bg }}
              >
                <span className="text-5xl mb-2 drop-shadow-lg">{demo.emoji}</span>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: demo.accent, color: demo.bg === "#1A1A1A" ? "#fff" : "#1a1a1a" }}
                >
                  {demo.niche}
                </span>
                {/* Hover arrow */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" />
                  </svg>
                </div>
              </div>

              {/* Card bottom — white */}
              <div className="bg-white p-5">
                <h2 className="font-black text-gray-900 text-lg leading-tight">
                  {demo.name}
                </h2>
                <p className="text-xs text-gray-500 mb-2">{demo.subtitle}</p>
                <p className="text-sm text-gray-600 mb-3">{demo.description}</p>
                <div
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: demo.light, color: demo.bg }}
                >
                  <span>🎁</span> {demo.tagline}
                </div>
                <div className="mt-4 flex items-center gap-1 text-indigo-600 text-sm font-bold group-hover:gap-2 transition-all">
                  Voir la démo
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}

          {/* CTA Card */}
          <div className="rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-indigo-600 to-purple-600 flex flex-col items-center justify-center p-8 text-center text-white">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="font-black text-xl mb-2">Votre commerce</h3>
            <p className="text-indigo-100 text-sm mb-6">
              Créez votre propre programme fidélité en moins de 5 minutes.
            </p>
            <Link
              href="/signup"
              className="bg-white text-indigo-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Démarrer gratuitement
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <p>© 2025 Stampify — La fidélité digitale pour les commerçants</p>
      </footer>
    </div>
  );
}
