"use client"
import Link from 'next/link'

const demos = [
  {
    slug: 'lessence',
    nom: "L'Essence Spa",
    ville: "Lausanne, Suisse",
    badge: "Spa & Institut",
    nouveau: true,
    desc: "Site vitrine luxe + carte fidélité digitale pour ce spa premium lausannois.",
    recompense: "Soin offert à la 8e visite",
    photo: "https://images.pexels.com/photos/6667430/pexels-photo-6667430.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "https://loyalty-cards-rho.vercel.app/lessence-spa.html",
    externe: true,
  },
  {
    slug: 'cafe',
    nom: "Café Lumière",
    ville: "Lyon 2",
    badge: "Café",
    nouveau: false,
    desc: "Carte fidélité + roue des récompenses & site vitrine pour votre café.",
    recompense: "1 café offert tous les 10",
    photo: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "https://loyalty-cards-rho.vercel.app/cafe-lumiere.html",
    externe: true,
  },
  {
    slug: 'boulangerie',
    nom: "Boulangerie Martin",
    ville: "Lyon 6",
    badge: "Boulangerie",
    nouveau: false,
    desc: "Fidélisez vos habitués avec des tampons digitaux et des lots gourmands.",
    recompense: "1 viennoiserie offerte tous les 8",
    photo: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "https://loyalty-cards-rho.vercel.app/boulangerie-martin.html",
    externe: true,
  },
  {
    slug: 'barbershop',
    nom: "Black Scissors",
    ville: "Lyon 1",
    badge: "Barbershop",
    nouveau: false,
    desc: "Programme VIP pour votre barbershop avec récompenses exclusives.",
    recompense: "1 coupe offerte à la 6e",
    photo: "https://images.pexels.com/photos/1805600/pexels-photo-1805600.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "https://loyalty-cards-rho.vercel.app/black-scissors.html",
    externe: true,
  },
  {
    slug: 'restaurant',
    nom: "Le Bistrot du Coin",
    ville: "Lyon 3",
    badge: "Restaurant",
    nouveau: false,
    desc: "Récompensez la fidélité de vos clients avec des offres exclusives.",
    recompense: "1 dessert offert tous les 5 repas",
    photo: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "https://loyalty-cards-rho.vercel.app/bistrot-du-coin.html",
    externe: true,
  },
  {
    slug: 'manucure',
    nom: "Nail Studio",
    ville: "Lyon 2",
    badge: "Manucure",
    nouveau: false,
    desc: "Carte beauté digitale pour fidéliser votre clientèle.",
    recompense: "1 soin offert à la 6e visite",
    photo: "https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=600",
    href: "https://loyalty-cards-rho.vercel.app/nail-studio.html",
    externe: true,
  },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      <nav className="sticky top-0 z-50 bg-[#F8F6F1]/95 backdrop-blur-sm border-b border-[#E8E4DC] h-16">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#534AB7] rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="1.8"/>
                <circle cx="12" cy="9" r="3" stroke="white" strokeWidth="1.8"/>
                <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M12 18l0 3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M10 20.5l2-2.5 2 2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[#1A1714] font-semibold text-lg tracking-tight">Stampify</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/demo" className="text-sm text-[#534AB7] font-medium">Démos</Link>
            <Link href="/services" className="text-sm text-[#6B6560] hover:text-[#1A1714] transition-colors">Services</Link>
          </div>
          <a href="https://wa.me/41791342997?text=Bonjour%2C%20j%27ai%20une%20question%20pour%20l%27%C3%A9quipe%20Stampify." className="bg-[#534AB7] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#4238A0] transition-colors font-medium">Nous contacter</a>
        </div>
      </nav>
      <section className="pt-16 pb-12 px-6 bg-[#F8F6F1]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#EEEDFE] text-[#534AB7] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 bg-[#534AB7] rounded-full"></span>
            6 démos disponibles
          </div>
          <h1 className="text-[#1A1714] text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-5">
            Voyez ce qu&apos;on livre<br />
            <span className="text-[#534AB7]">pour votre commerce</span>
          </h1>
          <p className="text-[#6B6560] text-lg leading-relaxed max-w-xl mx-auto">
            Des sites vitrines réels avec carte de fidélité intégrée. Ce que vous voyez est exactement ce que vous recevrez — à vos couleurs.
          </p>
        </div>
      </section>
      <section className="py-8 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {demos.map((d) => (
            <div key={d.slug} className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.photo} alt={`${d.nom} — ${d.badge} ${d.ville}`} className="w-full h-[220px] object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                <span className="absolute bottom-3 left-3 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">{d.badge}</span>
                {d.nouveau && <span className="absolute top-3 right-3 bg-[#D1FAE5] text-[#059669] text-xs font-bold px-2 py-1 rounded-full">Nouveau</span>}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-[#1A1714] text-lg mb-1">{d.nom}</h3>
                <p className="text-[#6B6560] text-sm mb-2">{d.ville}</p>
                <p className="text-[#6B6560] text-sm leading-relaxed mb-3">{d.desc}</p>
                <p className="text-xs text-[#6B6560] mb-4">🎁 {d.recompense}</p>
                <a href={d.href} target="_blank" rel="noopener noreferrer" className="text-[#534AB7] font-semibold text-sm hover:underline">Voir la démo →</a>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="py-16 px-6 bg-[#F8F6F1]">
        <div className="bg-[#534AB7] rounded-2xl p-10 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Votre commerce n&apos;est pas dans la liste ?</h2>
          <p className="text-white/60 mb-8">Contactez-nous et on vous montre ce qu&apos;on ferait pour vous spécifiquement.</p>
          <a href="https://wa.me/41791342997?text=Bonjour%2C%20je%20souhaite%20une%20d%C3%A9mo%20personnalis%C3%A9e%20pour%20mon%20commerce." className="inline-block bg-white text-[#534AB7] px-8 py-3 rounded-xl font-bold hover:bg-[#F0EDE6] transition-colors">Demander une démo personnalisée</a>
        </div>
      </section>
      <footer className="bg-[#111009] py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#534AB7] rounded-lg flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="1.8"/>
                    <circle cx="12" cy="9" r="3" stroke="white" strokeWidth="1.8"/>
                    <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M12 18l0 3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-white font-semibold">Stampify</span>
              </div>
              <p className="text-[#6B6560] text-sm max-w-xs">La fidélisation digitale pour les commerces de proximité.</p>
            </div>
            <div className="flex gap-12">
              <div>
                <div className="text-white font-semibold text-sm mb-3">Navigation</div>
                <Link href="/demo" className="text-[#6B6560] text-sm hover:text-white transition-colors block mb-2">Nos démos</Link>
                <Link href="/services" className="text-[#6B6560] text-sm hover:text-white transition-colors block">Services</Link>
              </div>
              <div>
                <div className="text-white font-semibold text-sm mb-3">Contact</div>
                <a href="https://wa.me/41791342997" className="text-[#6B6560] text-sm hover:text-white transition-colors block mb-2">WhatsApp</a>
                <a href="mailto:contact@stampify.ch" className="text-[#6B6560] text-sm hover:text-white transition-colors block">contact@stampify.ch</a>
              </div>
              <div>
                <div className="text-white font-semibold text-sm mb-3">Légal</div>
                <Link href="/mentions-legales" className="text-[#6B6560] text-sm hover:text-white transition-colors block mb-2">Mentions légales</Link>
                <Link href="/politique-de-confidentialite" className="text-[#6B6560] text-sm hover:text-white transition-colors block">Confidentialité</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 text-center text-[#4A4540] text-xs">© 2026 Stampify. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  )
}
