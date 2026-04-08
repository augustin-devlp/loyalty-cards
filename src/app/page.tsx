"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F6F1] font-sans">

      {/* ══ NAVBAR ══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F6F1]/95 backdrop-blur-sm border-b border-[#E8E4DC]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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
            <Link href="/demo" className="text-[#6B6560] text-sm hover:text-[#1A1714] transition-colors">Démos</Link>
            <Link href="/services" className="text-[#6B6560] text-sm hover:text-[#1A1714] transition-colors">Services</Link>
            <Link
              href="https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Stampify."
              className="bg-[#534AB7] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#4238A0] transition-colors font-medium"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#EEEDFE] text-[#534AB7] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
                <span className="w-1.5 h-1.5 bg-[#534AB7] rounded-full"></span>
                Livraison en 72h · Réponse sous 2h
              </div>
              <h1 className="text-[#1A1714] text-5xl font-bold leading-[1.1] tracking-tight mb-6">
                Votre commerce mérite<br />
                <span className="text-[#534AB7]">mieux qu'une carte papier.</span>
              </h1>
              <p className="text-[#6B6560] text-lg leading-relaxed mb-8 max-w-lg">
                Site vitrine professionnel + carte de fidélité digitale livrés en 72h.
                Paiement unique, zéro abonnement. Vos clients reviennent automatiquement.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Stampify."
                  className="bg-[#534AB7] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#4238A0] transition-all hover:scale-[1.02] shadow-lg shadow-[#534AB7]/20"
                >
                  Obtenir mon site
                </Link>
                <Link
                  href="/demo"
                  className="bg-white text-[#1A1714] px-6 py-3 rounded-xl font-semibold hover:bg-[#F0EDE6] transition-colors border border-[#E8E4DC]"
                >
                  Voir les démos →
                </Link>
              </div>
              <div className="flex flex-wrap gap-5">
                {["Livraison 72h", "Zéro abonnement", "Support français", "Propriétaire de tout"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[#6B6560]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="8" fill="#D1FAE5"/>
                      <path d="M4.5 8l2.5 2.5L11.5 5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-black/10 overflow-hidden border border-[#E8E4DC]">
                <div className="bg-gradient-to-br from-[#534AB7] to-[#7B74D4] p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium opacity-80">Café Lumière · Paris</span>
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">Pro</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">Carte Fidélité</div>
                  <div className="text-sm opacity-70">Cumulez vos visites, gagnez des récompenses</div>
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {[1,2,3,4,5,6,7,8].map(i => (
                      <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= 5 ? "bg-[#534AB7] text-white" : "bg-[#F0EDE6] text-[#C0BBB5]"}`}>
                        {i <= 5 ? "✓" : i}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-[#6B6560] mb-4">5/8 tampons — encore 3 pour votre café offert</p>
                  <div className="bg-[#F8F6F1] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg border-2 border-dashed border-[#E8E4DC] flex items-center justify-center text-xs text-[#C0BBB5] text-center leading-tight">QR<br/>Code</div>
                    <div>
                      <div className="text-xs font-semibold text-[#1A1714] mb-1">Scannez à chaque visite</div>
                      <div className="text-xs text-[#6B6560]">Aucune app nécessaire</div>
                      <div className="text-[10px] text-[#C0BBB5] mt-2">Propulsé par Stampify</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-[#E8E4DC] px-4 py-3 text-sm">
                <div className="font-semibold text-[#1A1714]">+23 clients ce mois</div>
                <div className="text-[#059669] text-xs">↑ 40% vs mois dernier</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#534AB7] rounded-xl shadow-lg px-4 py-3 text-sm text-white">
                <div className="font-semibold">Livré en 72h ⚡</div>
                <div className="text-xs opacity-70">Prêt à utiliser</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="py-12 border-y border-[#E8E4DC] bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "72h", label: "Délai de livraison" },
              { num: "0€", label: "Abonnement mensuel" },
              { num: "100%", label: "Propriétaire du site" },
              { num: "2h", label: "Réponse garantie" },
            ].map(s => (
              <div key={s.num} className="text-center">
                <div className="text-3xl font-bold text-[#534AB7] mb-1">{s.num}</div>
                <div className="text-sm text-[#6B6560]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROBLÈME ══ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold tracking-widest uppercase text-[#534AB7] mb-3">Le problème</div>
            <h2 className="text-3xl font-bold text-[#1A1714]">Ce que vivent vos clients aujourd'hui</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🗑️", title: "Vos cartes papier se perdent", desc: "Vos clients les oublient, les perdent ou les jettent. Tous vos efforts de fidélisation partent à la poubelle." },
              { icon: "👋", title: "Vos clients vous oublient", desc: "Sans rappel ni engagement digital, ils vont chez le concurrent. Même s'ils ont adoré leur expérience." },
              { icon: "🔍", title: "Vos concurrents vous précèdent", desc: "Quand quelqu'un cherche votre type de commerce sur Google, c'est votre concurrent qui apparaît en premier." },
            ].map(p => (
              <div key={p.title} className="bg-white rounded-2xl p-6 border border-[#E8E4DC] hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="font-semibold text-[#1A1714] mb-2">{p.title}</h3>
                <p className="text-[#6B6560] text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SOLUTION ══ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold tracking-widest uppercase text-[#534AB7] mb-3">La solution Stampify</div>
            <h2 className="text-3xl font-bold text-[#1A1714]">Tout ce qu'il faut pour fidéliser et attirer</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📱", title: "Site vitrine professionnel", desc: "Un site sur mesure à vos couleurs, livré en 72h. Vos clients vous trouvent sur Google avant la concurrence.", tag: "Inclus dans les 2 packs" },
              { icon: "🎟️", title: "Carte fidélité digitale", desc: "Vos clients cumulent des tampons depuis leur téléphone. Pas d'app à télécharger, juste un QR code à scanner.", tag: "Inclus dans les 2 packs" },
              { icon: "📩", title: "SMS retargeting", desc: "Envoyez des campagnes SMS à tous vos clients fidèles. \"Ce weekend -20%\", \"Il vous reste 2 tampons\". Disponible en Premium.", tag: "Pack Premium" },
            ].map(s => (
              <div key={s.title} className="group">
                <div className="bg-[#EEEDFE] w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">{s.icon}</div>
                <div className="text-xs font-semibold text-[#534AB7] mb-2 uppercase tracking-wide">{s.tag}</div>
                <h3 className="font-semibold text-[#1A1714] text-lg mb-2">{s.title}</h3>
                <p className="text-[#6B6560] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DÉMOS ══ */}
      <section className="py-20 px-6 bg-[#F8F6F1]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold tracking-widest uppercase text-[#534AB7] mb-3">Démos interactives</div>
            <h2 className="text-3xl font-bold text-[#1A1714]">Voyez le résultat pour votre commerce</h2>
            <p className="text-[#6B6560] mt-3">Cliquez sur votre secteur pour voir une démo complète</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { emoji: "☕", label: "Café / Coffee shop", href: "/demo/cafe" },
              { emoji: "🥐", label: "Boulangerie", href: "/demo/boulangerie" },
              { emoji: "✂️", label: "Barbershop", href: "/demo/barbershop" },
              { emoji: "🍽️", label: "Restaurant", href: "/demo/restaurant" },
              { emoji: "💅", label: "Manucure", href: "/demo/manucure" },
              { emoji: "🧖", label: "Spa / Institut", href: "/public/lessence-spa%20(1).html" },
            ].map(d => (
              <Link
                key={d.label}
                href={d.href}
                className="bg-white rounded-2xl p-5 border border-[#E8E4DC] hover:border-[#534AB7] hover:shadow-md transition-all group flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-[#F8F6F1] rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">{d.emoji}</div>
                <div>
                  <div className="font-semibold text-[#1A1714] text-sm">{d.label}</div>
                  <div className="text-[#534AB7] text-xs mt-0.5">Voir la démo →</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/demo" className="text-[#534AB7] font-semibold text-sm hover:underline">🎯 Voir toutes les démos →</Link>
          </div>
        </div>
      </section>

      {/* ══ TARIFS ══ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold tracking-widest uppercase text-[#534AB7] mb-3">Nos formules</div>
            <h2 className="text-3xl font-bold text-[#1A1714]">Un investissement unique. Zéro abonnement.</h2>
            <p className="text-[#6B6560] mt-3 max-w-xl mx-auto">Vous payez une fois, c'est à vous pour toujours. Pas de frais cachés, pas d'engagement mensuel.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Pack Standard */}
            <div className="bg-[#F8F6F1] rounded-2xl p-8 border border-[#E8E4DC]">
              <div className="text-sm font-semibold text-[#6B6560] mb-2">Pack Standard</div>
              <div className="text-4xl font-bold text-[#1A1714] mb-1">CHF 1 200</div>
              <div className="text-sm text-[#6B6560] mb-6">ou €900 en France · paiement unique</div>
              <ul className="space-y-3 mb-8">
                {[
                  "Site vitrine professionnel sur mesure",
                  "Carte de fidélité digitale QR",
                  "SEO local complet",
                  "Livraison en 72h",
                  "Vous êtes propriétaire de tout",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#1A1714]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
                      <circle cx="8" cy="8" r="8" fill="#D1FAE5"/>
                      <path d="M4.5 8l2.5 2.5L11.5 5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20le%20Pack%20Standard%20Stampify."
                className="block text-center bg-white text-[#1A1714] px-6 py-3 rounded-xl font-semibold hover:bg-[#F0EDE6] transition-colors border border-[#E8E4DC]"
              >
                Nous contacter
              </Link>
            </div>

            {/* Pack Premium */}
            <div className="bg-[#534AB7] rounded-2xl p-8 border border-[#4238A0] relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">⭐ Recommandé</div>
              <div className="text-sm font-semibold text-white/70 mb-2">Pack Premium</div>
              <div className="text-4xl font-bold text-white mb-1">CHF 1 800</div>
              <div className="text-sm text-white/60 mb-6">ou €1 400 en France · paiement unique</div>
              <ul className="space-y-3 mb-8">
                {[
                  "Tout le Pack Standard",
                  "SMS retargeting (3 mois inclus)",
                  "Roue de la fortune",
                  "Parrainage automatique",
                  "Support prioritaire 6 mois",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
                      <circle cx="8" cy="8" r="8" fill="rgba(255,255,255,0.2)"/>
                      <path d="M4.5 8l2.5 2.5L11.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20le%20Pack%20Premium%20Stampify."
                className="block text-center bg-white text-[#534AB7] px-6 py-3 rounded-xl font-bold hover:bg-[#F0EDE6] transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ COMMENT ÇA MARCHE ══ */}
      <section className="py-20 px-6 bg-[#F8F6F1]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="text-xs font-semibold tracking-widest uppercase text-[#534AB7] mb-3">Simple et rapide</div>
            <h2 className="text-3xl font-bold text-[#1A1714]">Comment ça marche ?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "1", icon: "💬", title: "Contactez-nous sur WhatsApp", desc: "Dites-nous en quelques mots ce que vous faites. On répond sous 2h, 7j/7." },
              { num: "2", icon: "⚡", title: "On configure tout en 72h", desc: "Site vitrine, carte fidélité, SEO local. On gère tout de A à Z." },
              { num: "3", icon: "🚀", title: "Vos clients vous trouvent et reviennent", desc: "Votre commerce apparaît sur Google et vos clients ont leur carte dans la poche." },
            ].map(s => (
              <div key={s.num} className="text-center">
                <div className="w-12 h-12 bg-[#534AB7] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">{s.num}</div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-semibold text-[#1A1714] mb-2">{s.title}</h3>
                <p className="text-[#6B6560] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="py-20 px-6 bg-[#1A1714]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Prêt à booster votre commerce ?</h2>
          <p className="text-[#9B9590] mb-8">Parlez-nous de votre commerce. On s'occupe de tout en 72h.</p>
          <Link
            href="https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Stampify."
            className="inline-flex items-center gap-2 bg-[#534AB7] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#4238A0] transition-all hover:scale-[1.02] shadow-lg shadow-[#534AB7]/30"
          >
            Nous contacter sur WhatsApp
            <span>→</span>
          </Link>
          <p className="text-[#6B6560] text-sm mt-4">📱 Réponse garantie sous 2h · 7j/7</p>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
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
                <div className="flex flex-col gap-2">
                  <Link href="/demo" className="text-[#6B6560] text-sm hover:text-white transition-colors">Nos démos</Link>
                  <Link href="/services" className="text-[#6B6560] text-sm hover:text-white transition-colors">Services</Link>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold text-sm mb-3">Contact</div>
                <div className="flex flex-col gap-2">
                  <Link href="https://wa.me/33XXXXXXXXX" className="text-[#6B6560] text-sm hover:text-white transition-colors">WhatsApp</Link>
                  <Link href="mailto:contact@stampify.ch" className="text-[#6B6560] text-sm hover:text-white transition-colors">contact@stampify.ch</Link>
                </div>
              </div>
              <div>
                <div className="text-white font-semibold text-sm mb-3">Légal</div>
                <div className="flex flex-col gap-2">
                  <Link href="/mentions-legales" className="text-[#6B6560] text-sm hover:text-white transition-colors">Mentions légales</Link>
                  <Link href="/politique-de-confidentialite" className="text-[#6B6560] text-sm hover:text-white transition-colors">Confidentialité</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-[#2A2720] pt-6 text-center text-[#4A4540] text-xs">
            © 2026 Stampify. Tous droits réservés.
          </div>
        </div>
      </footer>

    </div>
  );
}
