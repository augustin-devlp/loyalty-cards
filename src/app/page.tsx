"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── WhatsApp number ──────────────────────────────────────────────────────────
const WA_NUMBER = "33XXXXXXXXX"; // ← Remplacer par le vrai numéro
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=Bonjour%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20Stampify%20pour%20mon%20commerce.`;

// ─── Scroll animation hook ────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconWhatsApp({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Demo cards data ──────────────────────────────────────────────────────────
const DEMO_CARDS = [
  { emoji: "☕", label: "Café / Coffee shop", href: "/demo/cafe", color: "from-amber-900 to-yellow-800", accent: "#C9A84C" },
  { emoji: "🥐", label: "Boulangerie", href: "/demo/boulangerie", color: "from-yellow-800 to-amber-700", accent: "#C8960C" },
  { emoji: "✂️", label: "Barbershop", href: "/demo/barbershop", color: "from-gray-900 to-gray-700", accent: "#C41E3A" },
  { emoji: "🍽️", label: "Restaurant", href: "/demo/restaurant", color: "from-red-900 to-rose-800", accent: "#B8960C" },
  { emoji: "💅", label: "Manucure", href: "/demo/manucure", color: "from-pink-400 to-rose-300", accent: "#D4AF37" },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demosOpen, setDemosOpen] = useState(false);

  const demoLinks = [
    { href: "/demo/cafe", label: "☕ Café Lumière", sub: "Lyon 2" },
    { href: "/demo/boulangerie", label: "🥐 Boulangerie Martin", sub: "Lyon 6" },
    { href: "/demo/barbershop", label: "✂️ Black Scissors", sub: "Lyon 1" },
    { href: "/demo/restaurant", label: "🍽️ Le Bistrot du Coin", sub: "Lyon 3" },
    { href: "/demo/manucure", label: "💅 Nail Studio", sub: "Lyon 2" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="font-black text-xl text-gray-900">Stampify</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/services" className="hover:text-indigo-600 transition-colors font-semibold text-indigo-600">Services Web & SEO</Link>
            {/* ── Démos dropdown ── */}
            <div className="relative">
              <button
                onClick={() => setDemosOpen(!demosOpen)}
                onBlur={() => setTimeout(() => setDemosOpen(false), 150)}
                className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
              >
                Démos
                <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 transition-transform duration-200 ${demosOpen ? "rotate-180" : ""}`}>
                  <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              {demosOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <Link href="/demo" className="flex items-center gap-2 px-4 py-2.5 text-xs font-black text-indigo-600 hover:bg-indigo-50 transition-colors border-b border-gray-50 mb-1">
                    🎯 Toutes les démos
                  </Link>
                  {demoLinks.map((d) => (
                    <Link key={d.href} href={d.href}
                      className="flex items-start justify-between px-4 py-2 hover:bg-gray-50 transition-colors rounded-lg mx-1">
                      <span className="text-sm font-medium text-gray-800">{d.label}</span>
                      <span className="text-xs text-gray-400 ml-2 mt-0.5">{d.sub}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              <IconWhatsApp className="w-4 h-4" />
              Nous contacter
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm md:hidden"
            >
              <IconWhatsApp className="w-4 h-4" />
              Contact
            </a>
            <button className="md:hidden p-1.5 rounded-lg hover:bg-gray-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                {mobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-indigo-600 py-2">Services Web & SEO</Link>
            <div className="border-t border-gray-50 pt-2">
              <Link href="/demo" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-black text-indigo-600 py-2">🎯 Toutes les démos</Link>
              {demoLinks.map((d) => (
                <Link key={d.href} href={d.href} onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-gray-600 py-1.5 pl-3">{d.label}</Link>
              ))}
            </div>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors mt-2"
            >
              <IconWhatsApp className="w-5 h-5" />
              Nous contacter sur WhatsApp
            </a>
          </div>
        )}
      </header>

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100 rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full opacity-30 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            Livraison en 72h · Réponse WhatsApp sous 2h
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
            La fidélité digitale pour les{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              commerces locaux
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            Carte de fidélité · Roue de la fortune · Site vitrine · SEO local
            <br className="hidden sm:block" />
            <strong className="text-gray-800">— tout en une solution</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 text-base"
            >
              🎯 Voir les démos
            </Link>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-0.5 text-base"
            >
              <IconWhatsApp className="w-5 h-5" />
              Nous contacter
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-500">
            <span>✅ Livraison en 72h</span>
            <span>✅ Aucune app à installer</span>
            <span>✅ Support en français</span>
            <span>✅ Réponse sous 2h</span>
          </div>
        </div>
      </section>

      {/* ── 2. PROBLÈME ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Le problème</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-12">
              Ce que vivent vos clients aujourd&apos;hui
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Vos cartes papier se perdent",
                desc: "Vos clients les oublient dans un tiroir, les laissent à la maison, ou les jettent par erreur. Tous vos efforts de fidélisation partent à la poubelle.",
              },
              {
                title: "Vos clients vous oublient entre deux visites",
                desc: "Sans rappel, sans engagement, vos clients vont chez le concurrent. Ils ne pensent pas à revenir — même s'ils ont adoré leur expérience.",
              },
              {
                title: "Vos concurrents apparaissent avant vous sur Google",
                desc: "Quand quelqu'un cherche un café ou un barbershop près de chez lui, c'est votre concurrent qui apparaît en premier. Et c'est lui qui gagne le client.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 h-full">
                  <div className="text-3xl mb-4">❌</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. SOLUTION ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <p className="text-center text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">La solution Stampify</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-12">
              Tout ce qu&apos;il faut pour fidéliser et attirer
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Carte fidélité digitale sur smartphone",
                desc: "Vos clients ont leur carte dans leur poche, sur leur téléphone. Toujours disponible, impossible à perdre. Le commerçant valide en un scan.",
              },
              {
                title: "Roue de la fortune pour faire revenir vos clients",
                desc: "Gamifiez l'expérience client avec une roue des récompenses. Une raison supplémentaire de pousser votre porte — et de parler de vous autour d'eux.",
              },
              {
                title: "Site vitrine + SEO local livré en 72h",
                desc: "Un mini-site professionnel qui vous fait apparaître sur Google, avec votre adresse, horaires et vos services. Vos clients vous trouvent avant la concurrence.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-white border border-green-100 rounded-2xl p-6 h-full shadow-sm">
                  <div className="text-3xl mb-4">✅</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. DÉMOS INTERACTIVES ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Démos interactives</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-4">
              Voyez le résultat pour votre commerce
            </h2>
            <p className="text-center text-gray-500 text-base mb-12 max-w-xl mx-auto">
              Cliquez sur votre secteur pour voir une démo complète et interactive — carte de fidélité, roue de la fortune, site vitrine.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {DEMO_CARDS.map((card, i) => (
              <FadeIn key={card.href} delay={i * 80}>
                <Link
                  href={card.href}
                  className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`bg-gradient-to-br ${card.color} aspect-square flex items-center justify-center`}>
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{card.emoji}</span>
                  </div>
                  <div className="bg-white px-3 py-3 text-center">
                    <p className="text-sm font-bold text-gray-800 leading-tight">{card.label}</p>
                    <p className="text-xs text-indigo-500 font-semibold mt-1 group-hover:underline">Voir la démo →</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center mt-10">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors border-b-2 border-indigo-200 hover:border-indigo-600 pb-0.5"
            >
              🎯 Voir toutes les démos →
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── 5. DEUX FORMULES ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <p className="text-center text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">Nos formules</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-4">
              Deux façons de travailler avec nous
            </h2>
            <p className="text-center text-gray-500 text-base mb-12 max-w-xl mx-auto">
              Choisissez la formule qui correspond à votre situation. Dans tous les cas, on vous accompagne de A à Z.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formule One-Shot */}
            <FadeIn delay={0}>
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col h-full">
                <div className="mb-6">
                  <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-black px-3 py-1.5 rounded-full mb-4">Formule One-Shot</span>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Payez une fois, c&apos;est à vous pour toujours</h3>
                  <p className="text-gray-500 text-sm">Un investissement unique. Zéro abonnement. Vous êtes propriétaire de tout.</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    "Site vitrine premium",
                    "Programme fidélité configuré",
                    "SEO local complet",
                    "Vous êtes propriétaire de tout",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 mt-0.5 text-indigo-600">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-colors shadow-md"
                >
                  <IconWhatsApp className="w-5 h-5" />
                  Nous contacter
                </a>
              </div>
            </FadeIn>

            {/* Formule Mensuelle */}
            <FadeIn delay={100}>
              <div className="bg-indigo-600 rounded-3xl p-8 shadow-xl ring-4 ring-indigo-400 ring-offset-2 flex flex-col h-full relative">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  ⚡ Populaire
                </span>
                <div className="mb-6">
                  <span className="inline-block bg-white/20 text-white text-xs font-black px-3 py-1.5 rounded-full mb-4">Formule Mensuelle</span>
                  <h3 className="text-2xl font-black text-white mb-2">Moins cher au démarrage, on gère tout</h3>
                  <p className="text-indigo-200 text-sm">On s&apos;occupe de tout chaque mois. Vous vous concentrez sur votre commerce.</p>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    "Site vitrine inclus",
                    "Programme fidélité",
                    "SEO et mises à jour mensuelles",
                    "Support prioritaire",
                  ].map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 mt-0.5 text-indigo-200">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span className="text-indigo-100 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-white hover:bg-indigo-50 text-indigo-600 font-bold py-3.5 rounded-2xl transition-colors shadow-md"
                >
                  <IconWhatsApp className="w-5 h-5" />
                  Nous contacter
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 6. COMMENT ÇA MARCHE ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Simple et rapide</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-12">
              Comment ça marche ?
            </h2>
          </FadeIn>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-200" />

            {[
              {
                step: "1",
                title: "Contactez-nous sur WhatsApp",
                desc: "Dites-nous en quelques mots ce que vous faites. On répond sous 2h, 7j/7.",
                icon: "💬",
              },
              {
                step: "2",
                title: "On configure tout en 72h",
                desc: "Site vitrine, carte fidélité, roue de la fortune, SEO local. On gère tout de A à Z.",
                icon: "⚡",
              },
              {
                step: "3",
                title: "Vos clients vous trouvent et reviennent",
                desc: "Votre commerce apparaît sur Google et vos clients ont leur carte dans la poche.",
                icon: "🚀",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 150} className="text-center">
                <div className="relative inline-flex w-20 h-20 bg-indigo-600 rounded-2xl items-center justify-center mb-5 shadow-lg shadow-indigo-200 mx-auto">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-indigo-600 rounded-full text-xs font-black text-indigo-600 flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700">
        <FadeIn className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Prêt à booster votre commerce ?
          </h2>
          <p className="text-indigo-200 text-lg mb-10 max-w-xl mx-auto">
            Parlez-nous de votre commerce. On s&apos;occupe de tout en 72h.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-2xl hover:-translate-y-1 text-xl"
          >
            <IconWhatsApp className="w-7 h-7" />
            Nous contacter sur WhatsApp
          </a>
          <p className="text-indigo-300 text-sm mt-6">
            📱 Réponse garantie sous 2h · 7j/7
          </p>
        </FadeIn>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
            {/* Logo + tagline */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">S</span>
                </div>
                <span className="font-black text-xl text-white">Stampify</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs">La fidélisation digitale pour les commerces de proximité.</p>
            </div>

            {/* Links columns */}
            <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm">
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Navigation</span>
                <Link href="/demo" className="hover:text-white transition-colors">Nos démos</Link>
                <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Contact</span>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <IconWhatsApp className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
                <a href="mailto:contact@stampify.ch" className="hover:text-white transition-colors">contact@stampify.ch</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Légal</span>
                <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
                <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link>
                <Link href="/conditions-utilisation" className="hover:text-white transition-colors">Conditions d&apos;utilisation</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
            © 2026 Stampify. Tous droits réservés.
          </div>
        </div>
      </footer>

    </div>
  );
}
