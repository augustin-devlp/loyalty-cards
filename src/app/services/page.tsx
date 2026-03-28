"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Scroll animation hook ────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── WhatsApp helpers ─────────────────────────────────────────────────────────
const WA_NUMBER = "33XXXXXXXXX";
function waLink(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

const WA_DEFAULT = waLink(
  "Bonjour, je souhaite créer mon site vitrine avec Stampify"
);
const WA_STARTER = waLink(
  "Bonjour, je suis intéressé par l'offre Starter à 149€ de Stampify"
);
const WA_PRO = waLink(
  "Bonjour, je suis intéressé par l'offre Pro à 349€ de Stampify"
);
const WA_COMPLET = waLink(
  "Bonjour, je suis intéressé par le Pack Complet à 599€ de Stampify"
);

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconCheck() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5 text-indigo-600 flex-shrink-0"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─── Offer card ───────────────────────────────────────────────────────────────
interface OfferCardProps {
  title: string;
  price: string;
  badge?: string;
  badgeGradient?: string;
  features: string[];
  waHref: string;
  highlighted?: boolean;
  delay?: number;
}

function OfferCard({
  title,
  price,
  badge,
  badgeGradient = "from-orange-400 to-pink-500",
  features,
  waHref,
  highlighted = false,
  delay = 0,
}: OfferCardProps) {
  return (
    <FadeIn delay={delay} className="flex">
      <div
        className={`relative flex flex-col rounded-3xl p-8 shadow-xl w-full ${
          highlighted
            ? "bg-indigo-600 text-white ring-4 ring-indigo-400 ring-offset-2"
            : "bg-white text-gray-900 border border-gray-200"
        }`}
      >
        {badge && (
          <span
            className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r ${badgeGradient} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap`}
          >
            {badge}
          </span>
        )}
        <div className="mb-6">
          <h3
            className={`text-xl font-bold mb-3 ${
              highlighted ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
          <div className="flex items-end gap-1">
            <span
              className={`text-5xl font-black ${
                highlighted ? "text-white" : "text-gray-900"
              }`}
            >
              {price}
            </span>
          </div>
          <p
            className={`text-sm mt-1 ${
              highlighted ? "text-indigo-200" : "text-gray-500"
            }`}
          >
            Paiement unique · Livraison 72h
          </p>
        </div>

        <ul className="space-y-3 flex-1 mb-8">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  highlighted ? "text-indigo-200" : "text-indigo-600"
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span
                className={`text-sm ${
                  highlighted ? "text-indigo-100" : "text-gray-600"
                }`}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-bold text-sm transition-all shadow-sm ${
            highlighted
              ? "bg-white text-indigo-600 hover:bg-indigo-50"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          <IconWhatsApp />
          Choisir cette offre
        </a>
      </div>
    </FadeIn>
  );
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm sm:text-base">
          {q}
        </span>
        <IconChevron open={open} />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const STARTER_FEATURES = [
  "Carte fidélité digitale configurée",
  "QR code prêt à imprimer",
  "Dashboard commerçant",
  "Livraison 72h",
  "Révisions illimitées 30 jours",
];

const PRO_FEATURES = [
  "Tout le Starter",
  "Roue de la fortune configurée",
  "Système de loterie",
  "Notifications SMS clients",
  "Support prioritaire",
];

const COMPLET_FEATURES = [
  "Tout le Pro",
  "Site vitrine one-page premium",
  "SEO local complet",
  "Google My Business optimisé",
  "Soumission 15 annuaires",
  "Livraison 72h",
];

const SEO_INCLUS = [
  "Google My Business optimisé",
  "Soumission sur 15 annuaires (PagesJaunes, Yelp, TripAdvisor…)",
  "Schema markup installé",
  "Google Search Console configuré",
  "Google Analytics installé",
  "Site indexé sous 48h",
];

const FAQ_ITEMS = [
  {
    q: "Combien de temps pour livrer ?",
    a: "72h après réception de vos informations complètes. Nous travaillons vite pour que votre commerce soit visible sur Google le plus rapidement possible.",
  },
  {
    q: "Et si je veux modifier quelque chose ?",
    a: "Révisions illimitées pendant 30 jours incluses dans toutes nos offres. Votre satisfaction est notre priorité.",
  },
  {
    q: "Vous gérez le domaine ?",
    a: "Non, on vous guide pour l'acheter (~15€/an sur OVH), vous en êtes propriétaire. Vous gardez le contrôle total de votre nom de domaine.",
  },
  {
    q: "C'est quoi Stampify ?",
    a: "La plateforme de fidélité digitale numéro 1 pour les commerçants locaux en France et Suisse. Cartes de fidélité, roue de la fortune, loterie, et maintenant site vitrine + SEO local — tout en une seule solution.",
  },
];

const STEPS = [
  {
    number: "01",
    icon: "💬",
    title: "Vous nous contactez",
    desc: "On discute de votre projet via WhatsApp. Aucun engagement, juste une conversation.",
  },
  {
    number: "02",
    icon: "📝",
    title: "Vous remplissez notre formulaire",
    desc: "On crée votre site et configure tout selon vos besoins. Vous n'avez rien à faire de technique.",
  },
  {
    number: "03",
    icon: "🚀",
    title: "Livraison en 72h",
    desc: "Votre commerce est visible sur Google immédiatement. SEO local activé, annuaires soumis.",
  },
];

// ─── Page component ───────────────────────────────────────────────────────────
export default function ServicesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="font-black text-xl text-gray-900">Stampify</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/#features" className="hover:text-indigo-600 transition-colors">
              Fonctionnalités
            </Link>
            <Link href="/#pricing" className="hover:text-indigo-600 transition-colors">
              Tarifs
            </Link>
            <Link href="/services" className="text-indigo-600 font-semibold">
              Services Web & SEO
            </Link>
            <Link href="/#faq" className="hover:text-indigo-600 transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Se connecter
            </Link>
            <a
              href={WA_DEFAULT}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              Devis gratuit
            </a>
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <Link
              href="/#features"
              className="block text-sm font-medium text-gray-700 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fonctionnalités
            </Link>
            <Link
              href="/#pricing"
              className="block text-sm font-medium text-gray-700 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tarifs
            </Link>
            <Link
              href="/services"
              className="block text-sm font-semibold text-indigo-600 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services Web & SEO
            </Link>
            <Link
              href="/#faq"
              className="block text-sm font-medium text-gray-700 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href="/login"
              className="block text-sm font-medium text-gray-700 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Se connecter
            </Link>
          </div>
        )}
      </header>

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 py-20 sm:py-28">
        {/* background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-400 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-white/20">
            ⚡ Livraison garantie en 72h
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Votre commerce,{" "}
            <span className="text-yellow-300">visible sur Google</span> en 72h
          </h1>

          <p className="text-lg sm:text-xl text-indigo-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Site vitrine premium + programme de fidélité + SEO local —{" "}
            <strong className="text-white">tout en une seule solution</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={WA_DEFAULT}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5"
            >
              <IconWhatsApp />
              Demander un devis
            </a>
            <a
              href="#offres"
              className="text-indigo-200 hover:text-white font-semibold text-sm transition-colors underline underline-offset-4"
            >
              Voir les offres →
            </a>
          </div>

          {/* trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-indigo-200 text-xs font-medium">
            <span className="flex items-center gap-1.5">✅ Sans abonnement caché</span>
            <span className="flex items-center gap-1.5">✅ Révisions illimitées 30j</span>
            <span className="flex items-center gap-1.5">✅ Vous restez propriétaire</span>
          </div>
        </div>
      </section>

      {/* ── 2. OFFRES ───────────────────────────────────────────────────────── */}
      <section id="offres" className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Choisissez votre offre
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Paiement unique, sans abonnement. Tout est inclus, livré en 72h.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mt-8">
            <OfferCard
              title="Starter"
              price="149€"
              features={STARTER_FEATURES}
              waHref={WA_STARTER}
              delay={0}
            />
            <OfferCard
              title="Pro"
              price="349€"
              badge="⚡ Populaire"
              badgeGradient="from-orange-400 to-pink-500"
              features={PRO_FEATURES}
              waHref={WA_PRO}
              highlighted={true}
              delay={100}
            />
            <OfferCard
              title="Pack Complet"
              price="599€"
              badge="💎 Meilleure valeur"
              badgeGradient="from-yellow-400 to-orange-500"
              features={COMPLET_FEATURES}
              waHref={WA_COMPLET}
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* ── 3. COMMENT ÇA MARCHE ────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Trois étapes simples, et votre commerce est en ligne.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* connector line (desktop) */}
            <div className="hidden md:block absolute top-14 left-1/3 right-1/3 h-0.5 bg-indigo-100 z-0" />

            {STEPS.map((step, i) => (
              <FadeIn key={i} delay={i * 150} className="relative z-10">
                <div className="bg-gray-50 rounded-3xl p-8 text-center h-full border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl mx-auto mb-4 shadow-md">
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 block">
                    Étape {step.number}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CE QUI EST INCLUS DANS LE SEO ───────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* left: text */}
            <FadeIn>
              <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                SEO Local
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 leading-tight">
                Ce qui est inclus dans le SEO
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Un SEO local complet, pas du bricolage. On s'occupe de tout pour
                que votre commerce remonte sur Google Maps et la recherche locale.
              </p>
              <a
                href={WA_COMPLET}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
              >
                <IconWhatsApp />
                Pack Complet — 599€
              </a>
            </FadeIn>

            {/* right: checklist */}
            <FadeIn delay={150}>
              <ul className="space-y-4">
                {SEO_INCLUS.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100"
                  >
                    <IconCheck />
                    <span className="text-gray-800 font-medium text-sm sm:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── 5. FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-gray-600">
              Pas de jargon, des réponses claires.
            </p>
          </FadeIn>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <FadeIn key={i} delay={i * 80}>
                <FaqItem q={item.q} a={item.a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Prêt à booster votre commerce ?
            </h2>
            <p className="text-indigo-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Contactez-nous dès maintenant. Réponse garantie sous 1h en semaine.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={WA_DEFAULT}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5"
              >
                <IconWhatsApp />
                Écrire sur WhatsApp
              </a>
              <a
                href="mailto:augustindom999@gmail.com"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all border border-white/20 backdrop-blur-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-5 h-5"
                >
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Envoyer un email
              </a>
            </div>

            <p className="mt-8 text-indigo-300 text-sm">
              augustindom999@gmail.com · Livraison en 72h garantie
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">S</span>
            </div>
            <span className="font-black text-white text-lg">Stampify</span>
          </div>
          <p className="text-sm text-center">
            © {new Date().getFullYear()} Stampify · Fidélité digitale pour
            commerçants locaux
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="/politique-de-confidentialite" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
