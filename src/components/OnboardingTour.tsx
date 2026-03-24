"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    step: 1,
    title: "Créez votre première carte",
    desc: "Donnez un nom à votre programme, choisissez vos couleurs et le type (tampons ou points).",
    icon: "🎨",
    cta: "Créer une carte",
    href: "/dashboard/cards/new",
  },
  {
    step: 2,
    title: "Téléchargez votre QR code",
    desc: "Depuis la page de votre carte, téléchargez le QR code et imprimez-le en caisse.",
    icon: "📱",
    cta: "Voir mes cartes",
    href: "/dashboard/cards",
  },
  {
    step: 3,
    title: "Scannez votre premier client",
    desc: "Utilisez le scanner intégré pour tamponner ou créditer la carte de votre client.",
    icon: "🔍",
    cta: "Ouvrir le scanner",
    href: "/dashboard/scan",
  },
  {
    step: 4,
    title: "Consultez vos statistiques",
    desc: "Suivez vos clients actifs, tampons distribués et récompenses accordées.",
    icon: "📊",
    cta: "Voir les stats",
    href: "/dashboard/stats",
  },
];

export default function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  const dismiss = async () => {
    await fetch("/api/onboarding/done", { method: "POST" });
    setDismissed(true);
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  };

  const goAndNext = async () => {
    const current = STEPS[step];
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      await dismiss();
    }
    router.push(current.href);
  };

  if (dismissed) return null;

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
        {/* Skip */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-sm"
        >
          Passer
        </button>

        {/* Progress dots */}
        <div className="flex gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-indigo-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{current.icon}</div>
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">
            Étape {current.step} / {STEPS.length}
          </p>
          <h2 className="text-xl font-black text-gray-900 mb-3">{current.title}</h2>
          <p className="text-gray-500 text-sm leading-relaxed">{current.desc}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={goAndNext}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl transition-colors"
          >
            {current.cta}
          </button>
          <button
            onClick={next}
            className="w-full text-gray-400 hover:text-gray-600 text-sm py-2"
          >
            {step < STEPS.length - 1 ? "Suivant →" : "Terminer"}
          </button>
        </div>
      </div>
    </div>
  );
}
