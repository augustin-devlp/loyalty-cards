"use client";

import Link from "next/link";

const WHATSAPP_URL =
  "https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Stampify.";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E8E4DC]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="28" height="28" rx="8" fill="#534AB7" />
            <path
              d="M8 14C8 10.686 10.686 8 14 8s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6z"
              fill="white"
            />
            <circle cx="14" cy="14" r="2.5" fill="#534AB7" />
          </svg>
          <span className="font-bold text-[#1A1714] text-lg">Stampify</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/demo" className="text-[#1A1714] text-sm font-medium">
            Démos
          </Link>
          <Link
            href="/services"
            className="text-[#6B6560] hover:text-[#1A1714] text-sm font-medium transition-colors"
          >
            Services
          </Link>
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#534AB7] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#4339a8] transition-colors"
        >
          Nous contacter
        </a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-[#111009] text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="28" height="28" rx="8" fill="#534AB7" />
                <path
                  d="M8 14C8 10.686 10.686 8 14 8s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6z"
                  fill="white"
                />
                <circle cx="14" cy="14" r="2.5" fill="#534AB7" />
              </svg>
              <span className="font-bold text-white text-lg">Stampify</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              La fidélisation digitale pour les commerces de proximité.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/demo"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  Démos
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  Services
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:augustindom999@gmail.com"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  augustindom999@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Légal</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-de-confidentialite"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/conditions-utilisation"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  Conditions d&apos;utilisation
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8">
          <p className="text-white/30 text-sm text-center">
            © 2026 Stampify. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

const demos = [
  {
    name: "L'Essence Spa",
    city: "Lausanne, Suisse",
    sector: "Spa & Institut",
    description:
      "Site vitrine luxe + carte fidélité digitale pour ce spa premium lausannois.",
    reward: "🎁 Soin offert à la 8e visite",
    image:
      "https://images.pexels.com/photos/6667430/pexels-photo-6667430.jpeg?auto=compress&cs=tinysrgb&w=600",
    isNew: true,
    isExternal: true,
    href: "https://loyalty-cards-rho.vercel.app/lessence-spa.html",
  },
  {
    name: "Café Lumière",
    city: "Lyon 2",
    sector: "Café",
    description:
      "Carte fidélité, roue des récompenses & site vitrine.",
    reward: "🎁 1 café offert tous les 10",
    image:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600",
    isNew: false,
    isExternal: false,
    href: "/demo/cafe",
  },
  {
    name: "Boulangerie Martin",
    city: "Lyon 6",
    sector: "Boulangerie",
    description:
      "Fidélisez vos habitués avec des tampons et des lots gourmands.",
    reward: "🎁 1 viennoiserie tous les 8",
    image:
      "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600",
    isNew: false,
    isExternal: false,
    href: "/demo/boulangerie",
  },
  {
    name: "Black Scissors",
    city: "Lyon 1",
    sector: "Barbershop",
    description: "Programme VIP pour votre barbershop.",
    reward: "🎁 1 coupe offerte à la 6e",
    image:
      "https://images.pexels.com/photos/1805600/pexels-photo-1805600.jpeg?auto=compress&cs=tinysrgb&w=600",
    isNew: false,
    isExternal: false,
    href: "/demo/barbershop",
  },
  {
    name: "Le Bistrot du Coin",
    city: "Lyon 3",
    sector: "Restaurant",
    description: "Récompensez la fidélité de vos clients.",
    reward: "🎁 1 dessert tous les 5 repas",
    image:
      "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=600",
    isNew: false,
    isExternal: false,
    href: "/demo/restaurant",
  },
  {
    name: "Nail Studio",
    city: "Lyon 2",
    sector: "Manucure",
    description: "Carte beauté digitale pour votre clientèle.",
    reward: "🎁 1 soin offert à la 6e visite",
    image:
      "https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=600",
    isNew: false,
    isExternal: false,
    href: "/demo/manucure",
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      <Navbar />

      {/* HERO */}
      <section className="bg-[#F8F6F1] py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E8E4DC] rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-[#534AB7] rounded-full"></span>
            <span className="text-sm text-[#6B6560] font-medium">
              7 démos disponibles
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1714] mb-6 leading-tight">
            Voyez ce qu&apos;on livre pour votre commerce
          </h1>
          <p className="text-lg text-[#6B6560] leading-relaxed">
            Des démos réelles dans votre secteur. Ce que vous voyez est
            exactement ce que vous recevrez.
          </p>
        </div>
      </section>

      {/* GRILLE DÉMOS */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {demos.map((demo) => (
              <div
                key={demo.name}
                className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={demo.image}
                    alt={demo.name}
                    style={{ height: "200px", width: "100%", objectFit: "cover" }}
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {demo.isNew && (
                      <span className="bg-[#D1FAE5] text-[#059669] text-xs font-bold px-2 py-1 rounded-full">
                        Nouveau
                      </span>
                    )}
                    <span className="bg-white/90 text-[#1A1714] text-xs font-semibold px-2 py-1 rounded-full">
                      {demo.sector}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-[#1A1714] mb-1">{demo.name}</h3>
                  <p className="text-xs text-[#6B6560] mb-3">{demo.city}</p>
                  <p className="text-sm text-[#6B6560] mb-3 leading-relaxed">
                    {demo.description}
                  </p>
                  <p className="text-sm font-medium text-[#1A1714] mb-4">
                    {demo.reward}
                  </p>
                  {demo.isExternal ? (
                    <a
                      href={demo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#534AB7] font-semibold text-sm hover:underline"
                    >
                      Voir la démo →
                    </a>
                  ) : (
                    <Link
                      href={demo.href}
                      className="text-[#534AB7] font-semibold text-sm hover:underline"
                    >
                      Voir la démo →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAS */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#534AB7] rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Votre commerce n&apos;est pas dans la liste ?
            </h2>
            <p className="text-white/60 mb-8">
              Contactez-nous et on vous montre ce qu&apos;on ferait pour vous.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#534AB7] font-semibold px-8 py-4 rounded-full hover:bg-white/90 transition-colors"
            >
              Nous contacter sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
