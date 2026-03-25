"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { detectCountry } from "@/lib/detectCountry";

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
function IconStar() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
function IconChevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Phone illustration ───────────────────────────────────────────────────────
function PhoneIllustration() {
  return (
    <div className="relative flex justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 bg-indigo-400 rounded-full opacity-20 blur-3xl" />
      </div>
      <div className="relative w-56 bg-gray-900 rounded-[2.5rem] shadow-2xl border-4 border-gray-800 overflow-hidden">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-20 h-5 bg-gray-800 rounded-full" />
        </div>
        <div className="bg-gray-50 mx-2 rounded-2xl mb-2 overflow-hidden">
          <div className="bg-indigo-600 px-4 py-3 text-white">
            <p className="text-xs font-bold">Le Café du Coin</p>
            <p className="text-[10px] opacity-75">Carte Fidélité</p>
          </div>
          <div className="p-3 space-y-2">
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <p className="text-[10px] text-gray-500 mb-2 font-medium">Bonjour, Marie !</p>
              <p className="text-[9px] text-gray-400 mb-2">☕ 1 café offert tous les 10</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`w-5 h-5 rounded-full border flex items-center justify-center text-[8px] font-bold ${i < 7 ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-300 text-gray-300"}`}>
                    {i < 7 ? "✓" : ""}
                  </div>
                ))}
              </div>
              <div className="h-1 bg-gray-100 rounded-full">
                <div className="h-1 bg-indigo-600 rounded-full w-[70%]" />
              </div>
              <p className="text-[8px] text-gray-400 mt-1">3 cafés pour votre récompense !</p>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm text-center">
              <p className="text-[9px] text-gray-500 mb-1 font-medium">Mon QR code</p>
              <div className="inline-flex p-1 border border-gray-200 rounded-lg">
                <svg viewBox="0 0 40 40" className="w-12 h-12" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="1" fill="#1f2937" />
                  <rect x="5" y="5" width="6" height="6" fill="white" />
                  <rect x="7" y="7" width="2" height="2" fill="#1f2937" />
                  <rect x="26" y="2" width="12" height="12" rx="1" fill="#1f2937" />
                  <rect x="29" y="5" width="6" height="6" fill="white" />
                  <rect x="31" y="7" width="2" height="2" fill="#1f2937" />
                  <rect x="2" y="26" width="12" height="12" rx="1" fill="#1f2937" />
                  <rect x="5" y="29" width="6" height="6" fill="white" />
                  <rect x="7" y="31" width="2" height="2" fill="#1f2937" />
                  <rect x="16" y="2" width="2" height="2" fill="#1f2937" />
                  <rect x="20" y="2" width="2" height="2" fill="#1f2937" />
                  <rect x="16" y="6" width="4" height="2" fill="#1f2937" />
                  <rect x="22" y="6" width="2" height="4" fill="#1f2937" />
                  <rect x="16" y="10" width="2" height="4" fill="#1f2937" />
                  <rect x="20" y="10" width="4" height="2" fill="#1f2937" />
                  <rect x="16" y="16" width="4" height="2" fill="#1f2937" />
                  <rect x="22" y="16" width="4" height="2" fill="#1f2937" />
                  <rect x="26" y="14" width="2" height="4" fill="#1f2937" />
                  <rect x="30" y="14" width="2" height="2" fill="#1f2937" />
                  <rect x="34" y="14" width="4" height="2" fill="#1f2937" />
                  <rect x="16" y="20" width="2" height="4" fill="#1f2937" />
                  <rect x="20" y="20" width="4" height="2" fill="#1f2937" />
                  <rect x="26" y="20" width="2" height="4" fill="#1f2937" />
                  <rect x="30" y="22" width="8" height="2" fill="#1f2937" />
                  <rect x="16" y="26" width="4" height="4" fill="#1f2937" />
                  <rect x="22" y="26" width="2" height="2" fill="#1f2937" />
                  <rect x="26" y="26" width="4" height="2" fill="#1f2937" />
                  <rect x="32" y="26" width="2" height="4" fill="#1f2937" />
                  <rect x="36" y="28" width="2" height="2" fill="#1f2937" />
                  <rect x="16" y="32" width="2" height="2" fill="#1f2937" />
                  <rect x="20" y="30" width="2" height="4" fill="#1f2937" />
                  <rect x="24" y="32" width="4" height="2" fill="#1f2937" />
                  <rect x="30" y="32" width="2" height="2" fill="#1f2937" />
                  <rect x="34" y="32" width="4" height="2" fill="#1f2937" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center pb-3">
          <div className="w-24 h-1 bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const COMMERCE_TYPES = [
  { icon: "🥖", label: "Boulangeries" },
  { icon: "☕", label: "Cafés" },
  { icon: "🍽️", label: "Restaurants" },
  { icon: "✂️", label: "Salons de coiffure" },
  { icon: "👗", label: "Boutiques" },
  { icon: "💆", label: "Instituts de beauté" },
  { icon: "🍕", label: "Pizzerias" },
  { icon: "🌿", label: "Épiceries fines" },
];

const FEATURES = [
  { icon: "🎨", title: "Carte personnalisée", desc: "Logo, couleurs, nom de votre commerce. Votre identité, votre carte." },
  { icon: "📱", title: "QR code prêt à imprimer", desc: "Générez et téléchargez votre QR code en un clic. Prêt en 30 secondes." },
  { icon: "🔍", title: "Scanner intégré", desc: "Scannez les QR codes de vos clients directement depuis votre tableau de bord." },
  { icon: "📊", title: "Statistiques en temps réel", desc: "Suivez la progression de vos clients et l'impact de votre programme." },
  { icon: "👥", title: "Clients illimités", desc: "Aucune limite sur le nombre de clients dans votre programme de fidélité." },
  { icon: "📲", title: "Compatible mobile", desc: "Vos clients accèdent à leur carte depuis n'importe quel smartphone, sans app." },
];

const TESTIMONIALS = [
  {
    name: "Sophie L.",
    role: "Boulangerie Artisan Pain",
    avatar: "🥖",
    text: "Avant, mes clients perdaient constamment leurs cartes papier. Avec Stampify, tout est dans leur téléphone. J'ai vu une augmentation de 30% de mes clients réguliers en 2 mois.",
  },
  {
    name: "Marc T.",
    role: "Café Le Grain de Sel",
    avatar: "☕",
    text: "La mise en place a pris exactement 5 minutes comme promis. Mes clients adorent scanner le QR code à la caisse. C'est devenu un rituel agréable.",
  },
  {
    name: "Amina K.",
    role: "Salon Éclat & Beauté",
    avatar: "✂️",
    text: "Le tableau de bord me permet de voir en un coup d'œil qui sont mes clients les plus fidèles. Je peux même personnaliser les offres. Excellent investissement.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Est-ce que mes clients doivent télécharger une application ?",
    a: "Non, aucune application à télécharger ! Vos clients accèdent à leur carte directement depuis leur navigateur en scannant votre QR code. La carte peut aussi être ajoutée au Wallet Apple ou Google pour un accès encore plus rapide.",
  },
  {
    q: "Combien de temps pour mettre en place mon programme de fidélité ?",
    a: "Moins de 5 minutes. Créez votre compte, personnalisez votre carte (logo, couleurs, récompense), téléchargez votre QR code et affichez-le en caisse. C'est tout.",
  },
  {
    q: "Est-ce que je peux modifier ma carte après sa création ?",
    a: "Oui, entièrement. Vous pouvez modifier les couleurs, le logo, la description de la récompense et les conditions à tout moment depuis votre tableau de bord. Les modifications sont instantanées.",
  },
  {
    q: "Comment mes clients récupèrent-ils leur carte de fidélité ?",
    a: "Vos clients scannent le QR code affiché dans votre commerce. Ils renseignent leur prénom, nom et email en quelques secondes, et leur carte est créée instantanément. Lors des visites suivantes, ils retrouvent leur carte via leur QR code personnel.",
  },
  {
    q: "Y a-t-il un engagement ou une durée minimale ?",
    a: "Non, aucun engagement. Vous pouvez annuler votre abonnement à tout moment. Nous sommes confiants dans la valeur que Stampify apporte à votre commerce.",
  },
];

const ESSENTIALS_FR = [
  "1 carte de fidélité",
  "Design personnalisé (logo + couleurs)",
  "QR code boutique (impression)",
  "Scanner QR intégré",
  "Statistiques de base",
  "Clients illimités",
  "1 compte employé",
];

const PRO_FR = [
  "Tout ce qu'inclut Essentiel",
  "Cartes de fidélité illimitées",
  "5 comptes employés",
  "Intégration Google Wallet",
  "Emails automatiques aux clients",
  "Promotions temporaires",
  "Programme de parrainage",
  "Statistiques avancées + export PDF",
  "Avis Google automatique",
  "Support prioritaire",
];

const BUSINESS_FR = [
  "Tout ce qu'inclut Pro",
  "Comptes employés illimités",
  "Multi-établissements",
  "Configuration clé en main",
  "Campagnes SMS & push",
  "Carte cadeau digitale",
  "Programme VIP multi-niveaux",
  "Onboarding personnalisé inclus",
  "Appel mensuel + suivi personnalisé",
  "Support prioritaire réponse 24h",
];

const PACKS = [
  { icon: "🚀", label: "Pack Starter", desc: "Parfait pour débuter", features: ["Full onboarding", "Audit Google Business"], price: "79€", oldPrice: "98€", saving: "-20%" },
  { icon: "✨", label: "Pack Visibilité", desc: "Augmentez votre visibilité", features: ["Site web 1er mois", "Audit Google Business", "Campagne SMS"], price: "129€", oldPrice: "177€", saving: "-27%" },
  { icon: "💎", label: "Pack All-In", desc: "Tout ce qu'il faut", features: ["Site web 1er mois", "Full onboarding", "Audit Google Business", "Campagne SMS", "1 mois push offert"], price: "199€", oldPrice: "276€", saving: "-28%" },
];

const ONE_SHOT_ADDONS = [
  { icon: "🎯", label: "Full onboarding", desc: "Configuration complète par un expert Stampify", price: "49€" },
  { icon: "🌐", label: "Site web", desc: "Mini-site web pour votre commerce (1 page) — sans engagement", price: "79€/mois" },
  { icon: "📱", label: "Campagne SMS ponctuelle", desc: "Envoi d'une campagne SMS à tous vos clients", price: "29€" },
  { icon: "⭐", label: "Audit Google Business", desc: "Optimisation de votre fiche Google My Business", price: "49€" },
  { icon: "📸", label: "Shooting photo", desc: "Séance photo professionnelle pour votre commerce", price: "149€" },
];

const MONTHLY_ADDONS = [
  { icon: "👑", label: "Programme VIP", desc: "Niveaux de fidélité multi-paliers" },
  { icon: "🎁", label: "Carte cadeau digitale", desc: "Vente et gestion de cartes cadeaux" },
  { icon: "🌍", label: "Multi-langues", desc: "Carte client en 2 langues au choix" },
  { icon: "🔔", label: "Notifications push", desc: "Alertes promos directement sur les téléphones" },
  { icon: "📅", label: "Module réservation", desc: "Prise de rendez-vous intégrée à la carte" },
];

// ─── Pricing card ─────────────────────────────────────────────────────────────
function PricingCard({
  name, priceEur, priceCHF, isCH, features, popular, premium, commitment, cta,
}: {
  name: string; priceEur: number; priceCHF: number; isCH: boolean;
  features: string[]; popular?: boolean; premium?: boolean; commitment?: string; cta: string;
}) {
  const price = isCH ? priceCHF : priceEur;
  const currency = isCH ? " CHF" : "€";
  const highlighted = popular || premium;

  return (
    <div className={`relative flex flex-col rounded-3xl p-8 shadow-xl ${highlighted ? "bg-indigo-600 text-white ring-4 ring-indigo-400 ring-offset-2" : "bg-white text-gray-900 border border-gray-200"}`}>
      {popular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
          ⚡ Populaire
        </span>
      )}
      {premium && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
          💎 Premium
        </span>
      )}
      <div className="mb-6">
        <h3 className={`text-xl font-bold mb-1 ${highlighted ? "text-white" : "text-gray-900"}`}>{name}</h3>
        <div className="flex items-end gap-1">
          <span className={`text-5xl font-black ${highlighted ? "text-white" : "text-gray-900"}`}>{price}</span>
          <span className={`text-lg font-semibold mb-1 ${highlighted ? "text-indigo-200" : "text-gray-500"}`}>{currency}/mois</span>
        </div>
        <p className={`text-sm mt-1 ${highlighted ? "text-indigo-200" : "text-gray-500"}`}>
          {commitment ?? "Sans engagement · Résiliable à tout moment"}
        </p>
      </div>
      <ul className="space-y-3 flex-1 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <svg viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 shrink-0 mt-0.5 ${highlighted ? "text-indigo-200" : "text-indigo-600"}`}>
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            <span className={`text-sm ${highlighted ? "text-indigo-100" : "text-gray-700"} ${i === 0 && name !== "Essentiel" ? "font-medium" : ""}`}>{f}</span>
          </li>
        ))}
      </ul>
      <Link href="/signup" className={`block w-full text-center py-3.5 rounded-2xl font-bold text-sm transition-all ${highlighted ? "bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"}`}>
        {cta}
      </Link>
    </div>
  );
}


// ─── Main component ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isCH, setIsCH] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsCH(detectCountry() === "CH");
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="font-black text-xl text-gray-900">Stampify</span>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <button onClick={() => scrollTo("features")} className="hover:text-indigo-600 transition-colors">Fonctionnalités</button>
            <button onClick={() => scrollTo("pricing")} className="hover:text-indigo-600 transition-colors">Tarifs</button>
            <button onClick={() => scrollTo("faq")} className="hover:text-indigo-600 transition-colors">FAQ</button>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
              Se connecter
            </Link>
            <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">
              Commencer
            </Link>
            <button className="md:hidden p-1.5 rounded-lg hover:bg-gray-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                {mobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <button onClick={() => scrollTo("features")} className="block w-full text-left text-sm font-medium text-gray-700 py-2">Fonctionnalités</button>
            <button onClick={() => scrollTo("pricing")} className="block w-full text-left text-sm font-medium text-gray-700 py-2">Tarifs</button>
            <button onClick={() => scrollTo("faq")} className="block w-full text-left text-sm font-medium text-gray-700 py-2">FAQ</button>
            <Link href="/login" className="block text-sm font-medium text-gray-700 py-2">Se connecter</Link>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100 rounded-full opacity-30 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full opacity-30 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              Nouveau : intégration Google Wallet disponible
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-5">
              Transformez vos cartes de fidélité{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">papier</span>{" "}
              en cartes digitales
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
              Vos clients perdent leurs cartes papier. Avec Stampify, la carte est dans leur téléphone.{" "}
              <strong className="text-gray-800">En 5 minutes</strong> votre programme de fidélité est en place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5"
              >
                Commencer maintenant
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
              <button
                onClick={() => scrollTo("pricing")}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold px-6 py-3.5 rounded-2xl border border-gray-200 transition-all shadow-sm"
              >
                Voir les tarifs
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8 text-sm text-gray-500">
              <span>✅ Sans engagement</span>
              <span>✅ Aucune app à installer</span>
              <span>✅ Support en français</span>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PhoneIllustration />
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF / COMMERCE TYPES ──────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
              Conçu pour tous les commerces de proximité
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {COMMERCE_TYPES.map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl bg-gray-50 hover:bg-indigo-50 hover:border-indigo-100 border border-gray-100 transition-colors min-w-[90px]">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs font-medium text-gray-600 text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── STATS BAND ─────────────────────────────────────────────────────── */}
      <section className="bg-indigo-600 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
            {[
              { stat: "84%", desc: "des consommateurs préfèrent les commerces avec un programme de fidélité" },
              { stat: "+67%", desc: "Les clients fidèles dépensent 67% de plus que les nouveaux clients" },
              { stat: "+25%", desc: "de profits avec seulement 5% de rétention en plus" },
            ].map(({ stat, desc }) => (
              <FadeIn key={stat} className="flex flex-col items-center gap-2">
                <span className="text-4xl font-black text-white">{stat}</span>
                <p className="text-sm text-indigo-200 max-w-xs">{desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Trois étapes simples pour transformer la fidélisation de votre commerce.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-200" />

            {[
              { icon: "🎨", title: "Créez votre carte", desc: "Personnalisez votre carte de fidélité avec votre logo et vos couleurs. Choisissez entre tampons ou points selon votre activité." },
              { icon: "📲", title: "Affichez le QR code", desc: "Imprimez le QR code et affichez-le près de votre caisse. Vos clients le scannent en 3 secondes avec leur smartphone." },
              { icon: "🏆", title: "Fidélisez vos clients", desc: "Scannez les QR codes clients pour ajouter des tampons. Suivez tout depuis votre tableau de bord en temps réel." },
            ].map(({ icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 150} className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-indigo-100">
                    {icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-indigo-600 text-white text-xs font-black rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Des outils pensés pour les commerçants, simples à utiliser, puissants par nature.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 80}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all h-full">
                  <div className="text-3xl mb-4">{icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Ils font confiance à Stampify</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">Des commerçants qui ont transformé leur relation client.</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, avatar, text }, i) => (
              <FadeIn key={name} delay={i * 120}>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => <IconStar key={j} />)}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-6 italic">&ldquo;{text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-xl">{avatar}</div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{name}</p>
                      <p className="text-xs text-gray-500">{role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 sm:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Des tarifs simples et transparents
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Sans engagement, sans surprise. Choisissez la formule qui correspond à votre commerce.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn delay={0}>
              <PricingCard name="Essentiel" priceEur={19} priceCHF={29} isCH={isCH} features={ESSENTIALS_FR} cta="Commencer maintenant →" />
            </FadeIn>
            <FadeIn delay={100}>
              <PricingCard name="Pro" priceEur={49} priceCHF={79} isCH={isCH} features={PRO_FR} popular cta="Commencer maintenant →" />
            </FadeIn>
            <FadeIn delay={200}>
              <PricingCard name="Business" priceEur={99} priceCHF={149} isCH={isCH} features={BUSINESS_FR} premium commitment="Engagement 3 mois minimum" cta="Nous contacter →" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── PACKS ──────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">Packs combinés</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Économisez en combinant plusieurs services dans nos packs à prix réduit.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {PACKS.map(({ icon, label, desc, features, price, oldPrice, saving }, i) => (
              <FadeIn key={label} delay={i * 100}>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{icon}</div>
                    {saving && (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">{saving}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{label}</h3>
                  <p className="text-sm text-gray-500 mb-4">{desc}</p>
                  <div className="mb-6 flex-1">
                    <ul className="space-y-2">
                      {features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-black text-indigo-600">{price}</span>
                      {oldPrice && <span className="text-sm text-gray-400 line-through mb-0.5">au lieu de {oldPrice}</span>}
                    </div>
                  </div>
                  <a href="/signup" className="block w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                    Choisir ce pack
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADD-ONS ─────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">Add-ons à la carte</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Complétez votre forfait avec des services ponctuels ou mensuels selon vos besoins.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-10">
            {/* One-shot */}
            <FadeIn>
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Services ponctuels</p>
                <div className="space-y-4">
                  {ONE_SHOT_ADDONS.map(({ icon, label, desc, price }) => (
                    <div key={label} className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                      <span className="text-2xl shrink-0">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                      <span className="shrink-0 text-sm font-black text-indigo-600 whitespace-nowrap">{price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Monthly */}
            <FadeIn delay={100}>
              <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-5">Options mensuelles · +9€/mois chacune</p>
                <div className="space-y-4">
                  {MONTHLY_ADDONS.map(({ icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-sm border border-indigo-50">
                      <span className="text-2xl shrink-0">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                      <span className="shrink-0 text-sm font-black text-indigo-600 whitespace-nowrap">+9€/mois</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn className="text-center mt-10">
            <p className="text-sm text-gray-500">
              Vous avez plusieurs établissements ou des besoins spécifiques ?{" "}
              <a href="mailto:contact@stampify.ch" className="text-indigo-600 font-semibold hover:underline">Contactez-nous</a>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 sm:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Questions fréquentes</h2>
            <p className="text-lg text-gray-500">Tout ce que vous voulez savoir avant de commencer.</p>
          </FadeIn>

          <div className="space-y-3">
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div className={`border rounded-2xl overflow-hidden transition-all ${openFaq === i ? "border-indigo-200 shadow-sm" : "border-gray-200"}`}>
                  <button
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">{q}</span>
                    <IconChevron open={openFaq === i} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{a}</p>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700">
        <FadeIn className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Prêt à fidéliser vos clients ?</h2>
          <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
            Rejoignez les commerçants qui ont choisi Stampify. Mise en place en 5 minutes, résultats dès la première semaine.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-indigo-700 font-black px-8 py-4 rounded-2xl transition-all shadow-xl hover:-translate-y-0.5 text-lg"
          >
            Commencer maintenant
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
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
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Produit</span>
                <Link href="/login" className="hover:text-white transition-colors">Connexion</Link>
                <Link href="/signup" className="hover:text-white transition-colors">Inscription</Link>
                <button onClick={() => scrollTo("pricing")} className="text-left hover:text-white transition-colors">Tarifs</button>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Support</span>
                <a href="mailto:contact@stampify.ch" className="hover:text-white transition-colors">Contact</a>
                <button onClick={() => scrollTo("faq")} className="text-left hover:text-white transition-colors">FAQ</button>
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
