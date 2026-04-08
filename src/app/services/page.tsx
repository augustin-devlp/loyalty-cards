"use client";

import { useState } from "react";
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
          <Link
            href="/demo"
            className="text-[#6B6560] hover:text-[#1A1714] text-sm font-medium transition-colors"
          >
            Démos
          </Link>
          <Link
            href="/services"
            className="text-[#1A1714] text-sm font-medium"
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

const faqs = [
  {
    q: "Combien de temps pour livrer ?",
    a: "72h après réception de vos informations.",
  },
  {
    q: "Je reste propriétaire du site ?",
    a: "Oui 100%. Code, domaine, hébergement — tout vous appartient.",
  },
  {
    q: "Différence Standard vs Premium ?",
    a: "Standard = site + carte fidélité. Premium ajoute SMS, roue fortune, parrainage.",
  },
  {
    q: "Je peux voir des exemples ?",
    a: "Oui, stampify.ch/demo. Le spa L'Essence Lausanne est représentatif.",
  },
  {
    q: "France et Suisse ?",
    a: "Oui. CHF 1200/1800 en Suisse, €900/1400 en France.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#1A1714] text-center mb-12">
          Questions fréquentes
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-[#E8E4DC] rounded-xl overflow-hidden"
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#F8F6F1] transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-[#1A1714] text-sm">
                  {faq.q}
                </span>
                <span className="text-[#534AB7] text-xl flex-shrink-0">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-[#6B6560] text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
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
      <section className="bg-[#F8F6F1] py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E8E4DC] rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-[#6B6560] font-medium">
              Livraison en 72h · Réponse sous 2h
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1714] mb-6 leading-tight">
            Un site vitrine + carte fidélité livrés en 72h
          </h1>
          <p className="text-lg text-[#6B6560] mb-10 leading-relaxed">
            Paiement unique, zéro abonnement. Vous êtes propriétaire de tout.
            On s&apos;occupe de tout de A à Z.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#534AB7] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#4339a8] transition-colors mb-10"
          >
            Nous contacter sur WhatsApp
          </a>
          <div className="flex flex-wrap justify-center gap-6">
            {["Livraison 72h", "Zéro abonnement", "Propriétaire de tout"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="10" r="10" fill="#D1FAE5" />
                    <path
                      d="M6 10l3 3 5-5"
                      stroke="#059669"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-sm font-medium text-[#1A1714]">
                    {item}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* LES 2 PACKS */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#1A1714] text-center mb-4">
            Deux formules. Un seul paiement. Pour toujours.
          </h2>
          <p className="text-center text-[#6B6560] mb-12">
            Choisissez le pack adapté à vos besoins.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Standard */}
            <div className="bg-[#F8F6F1] border border-[#E8E4DC] rounded-2xl p-8">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#1A1714] mb-1">
                  Pack Standard
                </h3>
                <div className="text-4xl font-bold text-[#1A1714] mb-1">
                  CHF 1 200
                </div>
                <p className="text-sm text-[#6B6560]">
                  ou €900 en France · paiement unique
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Site vitrine professionnel sur mesure",
                  "Carte de fidélité digitale QR",
                  "SEO local complet (Google Maps, annuaires)",
                  "Livraison en 72h garantie",
                  "Vous êtes propriétaire de tout",
                  "Support inclus 30 jours",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 mt-0.5"
                    >
                      <circle cx="10" cy="10" r="10" fill="#D1FAE5" />
                      <path
                        d="M6 10l3 3 5-5"
                        stroke="#059669"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-[#1A1714]">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center border-2 border-[#534AB7] text-[#534AB7] font-semibold py-3 rounded-xl hover:bg-[#534AB7] hover:text-white transition-colors"
              >
                Choisir Standard
              </a>
            </div>

            {/* Premium */}
            <div className="bg-[#534AB7] rounded-2xl p-8 relative">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                ⭐ Recommandé
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">
                  Pack Premium
                </h3>
                <div className="text-4xl font-bold text-white mb-1">
                  CHF 1 800
                </div>
                <p className="text-sm text-white/60">
                  ou €1 400 en France · paiement unique
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Tout le Pack Standard",
                  "SMS retargeting (3 mois inclus)",
                  "Roue de la fortune gamifiée",
                  "Système de parrainage automatique",
                  "Support prioritaire 6 mois",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 mt-0.5"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="rgba(255,255,255,0.2)"
                      />
                      <path
                        d="M6 10l3 3 5-5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-white text-[#534AB7] font-semibold py-3 rounded-xl hover:bg-white/90 transition-colors"
              >
                Choisir Premium
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CE QUI EST INCLUS */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#1A1714] text-center mb-4">
            Ce qui est inclus
          </h2>
          <p className="text-center text-[#6B6560] mb-12">
            Tout ce dont votre commerce a besoin, sans exception.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📱",
                title: "Site vitrine sur mesure",
                desc: "Design professionnel à vos couleurs, livré en 72h.",
                badge: null,
              },
              {
                icon: "🎟️",
                title: "Carte fidélité digitale",
                desc: "Zéro app, juste un QR code.",
                badge: null,
              },
              {
                icon: "🔍",
                title: "SEO local",
                desc: "Google Maps optimisé, 15 annuaires soumis.",
                badge: null,
              },
              {
                icon: "📩",
                title: "SMS retargeting",
                desc: "3 mois inclus dans le Premium.",
                badge: "Premium",
              },
              {
                icon: "🎡",
                title: "Roue de la fortune",
                desc: "Gamifiez l'expérience client.",
                badge: "Premium",
              },
              {
                icon: "👥",
                title: "Parrainage automatique",
                desc: "Vos clients deviennent vos commerciaux.",
                badge: "Premium",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#F8F6F1] rounded-2xl p-6 border border-[#E8E4DC]"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  {item.badge && (
                    <span className="bg-[#534AB7] text-white text-xs font-bold px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-[#1A1714] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6B6560]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-24 bg-[#F8F6F1]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#1A1714] text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "1",
                title: "Contactez-nous sur WhatsApp",
                desc: "On répond sous 2h, 7j/7.",
              },
              {
                num: "2",
                title: "On configure tout en 72h",
                desc: "Vous remplissez un formulaire, on fait le reste.",
              },
              {
                num: "3",
                title: "Vos clients vous trouvent et reviennent",
                desc: "Carte fidélité dans la poche, visible sur Google.",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 bg-[#534AB7] rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-white font-bold text-xl">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-semibold text-[#1A1714] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6B6560]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* CTA FINAL */}
      <section className="py-24 bg-[#1A1714]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à booster votre commerce ?
          </h2>
          <p className="text-white/60 mb-10">
            Parlez-nous de votre commerce. On s&apos;occupe de tout en 72h.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#534AB7] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#4339a8] transition-colors mb-6"
          >
            Nous contacter sur WhatsApp
          </a>
          <p className="text-white/40 text-sm">
            📱 Réponse garantie sous 2h · 7j/7
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
