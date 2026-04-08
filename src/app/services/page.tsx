"use client";

import Link from "next/link";
import { useState } from "react";

const WA = "https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Stampify.";
const WA_STD = "https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20Pack%20Standard%20Stampify.";
const WA_PRE = "https://wa.me/33XXXXXXXXX?text=Bonjour%2C%20Pack%20Premium%20Stampify.";

function Logo() {
  return (
    <div className="w-8 h-8 bg-[#534AB7] rounded-lg flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" stroke="white" strokeWidth="1.8"/>
        <circle cx="12" cy="9" r="3" stroke="white" strokeWidth="1.8"/>
        <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M12 18l0 3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M10 20.5l2-2.5 2 2.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function CheckGreen() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
      <circle cx="8" cy="8" r="8" fill="#D1FAE5"/>
      <path d="M4.5 8l2.5 2.5L11.5 5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckWhite() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
      <circle cx="8" cy="8" r="8" fill="rgba(255,255,255,0.2)"/>
      <path d="M4.5 8l2.5 2.5L11.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F8F6F1]/95 backdrop-blur-sm border-b border-[#E8E4DC]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-[#1A1714] font-semibold text-lg tracking-tight">Stampify</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/demo" className="text-[#6B6560] text-sm hover:text-[#1A1714] transition-colors">Démos</Link>
          <Link href="/services" className="text-[#6B6560] text-sm hover:text-[#1A1714] transition-colors">Services</Link>
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#534AB7] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#4238A0] transition-colors font-medium"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-[#111009] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Logo />
              <span className="text-white font-semibold">Stampify</span>
            </div>
            <p className="text-[#6B6560] text-sm max-w-xs mt-2">La fidélisation digitale pour les commerces de proximité.</p>
          </div>
          <div className="flex gap-12">
            <div>
              <div className="text-white font-semibold text-sm mb-3">Navigation</div>
              <Link href="/demo" className="text-[#6B6560] text-sm hover:text-white block mb-2">Nos démos</Link>
              <Link href="/services" className="text-[#6B6560] text-sm hover:text-white block">Services</Link>
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-3">Contact</div>
              <a href="https://wa.me/33XXXXXXXXX" className="text-[#6B6560] text-sm hover:text-white block mb-2">WhatsApp</a>
              <a href="mailto:contact@stampify.ch" className="text-[#6B6560] text-sm hover:text-white block">contact@stampify.ch</a>
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-3">Légal</div>
              <Link href="/mentions-legales" className="text-[#6B6560] text-sm hover:text-white block mb-2">Mentions légales</Link>
              <Link href="/politique-de-confidentialite" className="text-[#6B6560] text-sm hover:text-white block mb-2">Confidentialité</Link>
              <Link href="/conditions-utilisation" className="text-[#6B6560] text-sm hover:text-white block">Conditions</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 text-center text-[#4A4540] text-xs">© 2026 Stampify. Tous droits réservés.</div>
      </div>
    </footer>
  );
}

const faqs = [
  { q: "Combien de temps ?", a: "72h après réception de vos informations." },
  { q: "Je reste propriétaire ?", a: "Oui 100%. Code, domaine, hébergement — tout vous appartient." },
  { q: "Standard vs Premium ?", a: "Standard = site + carte. Premium ajoute SMS, roue fortune, parrainage." },
  { q: "Exemples ?", a: "Oui, stampify.ch/demo. Le spa L'Essence Lausanne est représentatif." },
  { q: "France et Suisse ?", a: "CHF 1200/1800 en Suisse, €900/1400 en France." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20 px-6 bg-[#F8F6F1]">
      <div className="max-w-3xl mx-auto">
        <div className="text-xs font-semibold tracking-widest uppercase text-[#534AB7] mb-3 text-center">FAQ</div>
        <h2 className="text-3xl font-bold text-[#1A1714] text-center mb-12">Questions fréquentes</h2>
        <div>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-[#E8E4DC]">
              <button
                className="w-full flex items-center justify-between py-5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-[#1A1714] text-sm">{faq.q}</span>
                <span className="text-[#534AB7] text-xl shrink-0">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <p className="text-[#6B6560] text-sm pb-5 leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      <Navbar />

      {/* HERO */}
      <section className="pt-28 pb-20 px-6 bg-[#F8F6F1]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#EEEDFE] text-[#534AB7] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 bg-[#534AB7] rounded-full"></span>
            Livraison en 72h · Réponse sous 2h
          </div>
          <h1 className="text-[#1A1714] text-5xl font-bold leading-[1.1] tracking-tight mb-6">
            Un site vitrine + carte fidélité<br /><span className="text-[#534AB7]">livrés en 72h</span>
          </h1>
          <p className="text-[#6B6560] text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Paiement unique, zéro abonnement. Vous êtes propriétaire de tout. On s&apos;occupe de tout de A à Z.
          </p>
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#534AB7] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#4238A0] transition-all hover:scale-[1.02] shadow-lg shadow-[#534AB7]/20 mb-10"
          >
            Nous contacter sur WhatsApp
          </a>
          <div className="flex flex-wrap gap-5 justify-center">
            {["Livraison 72h", "Zéro abonnement", "Propriétaire de tout"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-[#6B6560]">
                <CheckGreen />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-semibold tracking-widest uppercase text-[#534AB7] mb-3 text-center">Nos formules</div>
          <h2 className="text-3xl font-bold text-[#1A1714] text-center mb-4">Deux formules. Un seul paiement. Pour toujours.</h2>
          <p className="text-[#6B6560] text-center mb-14 max-w-xl mx-auto">
            Pas d&apos;abonnement caché, pas de frais récurrents. Vous payez une fois, c&apos;est à vous.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Standard */}
            <div className="bg-[#F8F6F1] rounded-2xl p-8 border border-[#E8E4DC]">
              <div className="text-sm font-semibold text-[#6B6560] mb-2">Pack Standard</div>
              <div className="text-4xl font-bold text-[#1A1714] mb-1">CHF 1 200</div>
              <div className="text-sm text-[#6B6560] mb-6">ou €900 en France · paiement unique</div>
              <ul className="space-y-3 mb-8">
                {[
                  "Site vitrine professionnel sur mesure",
                  "Carte de fidélité digitale QR",
                  "SEO local complet (Google Maps, annuaires)",
                  "Livraison en 72h garantie",
                  "Vous êtes propriétaire de tout",
                  "Support inclus 30 jours",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#1A1714]">
                    <CheckGreen />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={WA_STD}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-white text-[#1A1714] px-6 py-3 rounded-xl font-semibold hover:bg-[#F0EDE6] transition-colors border border-[#E8E4DC]"
              >
                Nous contacter
              </a>
            </div>

            {/* Premium */}
            <div className="bg-[#534AB7] rounded-2xl p-8 border border-[#4238A0] relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">⭐ Recommandé</div>
              <div className="text-sm font-semibold text-white/70 mb-2">Pack Premium</div>
              <div className="text-4xl font-bold text-white mb-1">CHF 1 800</div>
              <div className="text-sm text-white/60 mb-6">ou €1 400 en France · paiement unique</div>
              <ul className="space-y-3 mb-8">
                {[
                  "Tout le Pack Standard",
                  "SMS retargeting (3 mois inclus)",
                  "Roue de la fortune gamifiée",
                  "Système de parrainage automatique",
                  "Support prioritaire 6 mois",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                    <CheckWhite />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={WA_PRE}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-white text-[#534AB7] px-6 py-3 rounded-xl font-bold hover:bg-[#F0EDE6] transition-colors"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CE QUI EST INCLUS */}
      <section className="py-20 px-6 bg-[#F8F6F1]">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-semibold tracking-widest uppercase text-[#534AB7] mb-3 text-center">Fonctionnalités</div>
          <h2 className="text-3xl font-bold text-[#1A1714] text-center mb-14">Ce qui est inclus</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "📱", title: "Site vitrine sur mesure", desc: "Design pro à vos couleurs, livré en 72h. Hébergé, sécurisé, prêt à l'emploi.", badge: null },
              { icon: "🎟️", title: "Carte fidélité digitale", desc: "Vos clients cumulent des tampons depuis leur téléphone. Zéro app, juste un QR code.", badge: null },
              { icon: "🔍", title: "SEO local", desc: "Google Maps optimisé, 15 annuaires soumis. Vos clients vous trouvent avant la concurrence.", badge: null },
              { icon: "📩", title: "SMS retargeting", desc: "3 mois inclus dans le Premium. Relancez vos clients avec des offres ciblées.", badge: "Premium" },
              { icon: "🎡", title: "Roue de la fortune", desc: "Gamifiez l'expérience client. Une raison de revenir et d'en parler.", badge: "Premium" },
              { icon: "👥", title: "Parrainage auto", desc: "Vos clients deviennent vos commerciaux. Système automatique.", badge: "Premium" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-[#E8E4DC]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold text-[#1A1714] text-sm">{item.title}</span>
                  {item.badge && (
                    <span className="bg-[#EEEDFE] text-[#534AB7] text-xs font-semibold px-2 py-0.5 rounded-full ml-1">{item.badge}</span>
                  )}
                </div>
                <p className="text-[#6B6560] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-semibold tracking-widest uppercase text-[#534AB7] mb-3 text-center">Processus</div>
          <h2 className="text-3xl font-bold text-[#1A1714] text-center mb-14">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-3 gap-10 text-center max-w-4xl mx-auto">
            {[
              { num: "1", title: "Contactez-nous sur WhatsApp", desc: "On répond sous 2h, 7j/7." },
              { num: "2", title: "On configure tout en 72h", desc: "Vous remplissez un formulaire, on fait le reste." },
              { num: "3", title: "Vos clients vous trouvent et reviennent", desc: "Visible sur Google, carte fidélité dans la poche." },
            ].map((step) => (
              <div key={step.num}>
                <div className="w-12 h-12 rounded-full bg-[#534AB7] text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-[#1A1714] mb-2">{step.title}</h3>
                <p className="text-[#6B6560] text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* CTA FINAL */}
      <section className="py-20 px-6 bg-[#1A1714]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Prêt à booster votre commerce ?</h2>
          <p className="text-[#9B9590] mb-8">Parlez-nous de votre commerce. On s&apos;occupe de tout en 72h.</p>
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#534AB7] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#4238A0] transition-all hover:scale-[1.02] shadow-lg shadow-[#534AB7]/30"
          >
            Nous contacter sur WhatsApp →
          </a>
          <p className="text-[#6B6560] text-sm mt-4">📱 Réponse garantie sous 2h · 7j/7</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
