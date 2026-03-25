"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface StepStatus {
  cardCreated: boolean;
  qrDownloaded: boolean;
  firstScan: boolean;
}

interface Props {
  businessId: string;
}

export default function OnboardingTourClient({ businessId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<StepStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    if (!businessId) return;
    const load = async () => {
      const supabase = createClient();
      const [cardsRes, bizRes, scansRes] = await Promise.all([
        supabase.from("loyalty_cards").select("id", { count: "exact", head: true }).eq("business_id", businessId),
        supabase.from("businesses").select("qr_downloaded").eq("id", businessId).single(),
        supabase.from("customer_cards").select("id", { count: "exact", head: true }).eq("business_id", businessId),
      ]);
      setStatus({
        cardCreated: (cardsRes.count ?? 0) > 0,
        qrDownloaded: bizRes.data?.qr_downloaded ?? false,
        firstScan: (scansRes.count ?? 0) > 0,
      });
    };
    load();
  }, [businessId]);

  const handleDismiss = async () => {
    setDismissing(true);
    const supabase = createClient();
    await supabase.from("businesses").update({ onboarding_completed: true }).eq("id", businessId);
    setDismissed(true);
    router.refresh();
  };

  if (dismissed || !status) return null;

  // All steps done → auto-dismiss
  if (status.cardCreated && status.qrDownloaded && status.firstScan) {
    handleDismiss();
    return null;
  }

  const steps = [
    {
      num: 1,
      icon: "🃏",
      title: "Créer votre première carte",
      desc: "Personnalisez votre carte de fidélité avec vos couleurs et votre logo.",
      done: status.cardCreated,
      locked: false,
      action: <Link href="/dashboard/cards/new" className="mt-3 inline-block px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700">Créer une carte →</Link>,
    },
    {
      num: 2,
      icon: "📥",
      title: "Télécharger votre QR code",
      desc: "Imprimez le QR code de votre carte et affichez-le dans votre commerce.",
      done: status.qrDownloaded,
      locked: !status.cardCreated,
      action: (
        <Link
          href={status.cardCreated ? "/dashboard/cards" : "#"}
          className={`mt-3 inline-block px-4 py-2 text-sm font-semibold rounded-lg ${status.cardCreated ? "bg-violet-600 text-white hover:bg-violet-700" : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"}`}
        >
          Aller aux cartes →
        </Link>
      ),
    },
    {
      num: 3,
      icon: "📷",
      title: "Scanner votre premier client",
      desc: "Utilisez le scanner intégré pour enregistrer le premier tampon d'un client.",
      done: status.firstScan,
      locked: !status.qrDownloaded,
      action: (
        <Link
          href={status.qrDownloaded ? "/dashboard/scan" : "#"}
          className={`mt-3 inline-block px-4 py-2 text-sm font-semibold rounded-lg ${status.qrDownloaded ? "bg-violet-600 text-white hover:bg-violet-700" : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"}`}
        >
          Ouvrir le scanner →
        </Link>
      ),
    },
    {
      num: 4,
      icon: "📊",
      title: "Voir vos statistiques",
      desc: "Consultez le nombre de clients, tampons et récompenses distribués.",
      done: status.firstScan,
      locked: !status.firstScan,
      action: (
        <Link
          href={status.firstScan ? "/dashboard" : "#"}
          className={`mt-3 inline-block px-4 py-2 text-sm font-semibold rounded-lg ${status.firstScan ? "bg-violet-600 text-white hover:bg-violet-700" : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"}`}
        >
          Voir les stats →
        </Link>
      ),
    },
  ];

  const completedCount = [status.cardCreated, status.qrDownloaded, status.firstScan, status.firstScan].filter(Boolean).length;

  return (
    <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-violet-900">🚀 Démarrage guidé</h2>
          <p className="text-sm text-violet-700 mt-0.5">
            {completedCount}/4 étapes complétées
          </p>
        </div>
        <button
          onClick={handleDismiss}
          disabled={dismissing}
          className="text-xs text-violet-400 hover:text-violet-600 font-medium"
        >
          Passer
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-violet-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-violet-600 rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / 4) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {steps.map((step) => (
          <div
            key={step.num}
            className={`rounded-xl border p-4 transition-all ${
              step.done
                ? "bg-white border-green-200 opacity-70"
                : step.locked
                ? "bg-white border-gray-200 opacity-50"
                : "bg-white border-violet-300 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xl">{step.locked ? "🔒" : step.done ? "✅" : step.icon}</span>
              <span className="text-sm font-semibold text-gray-900">{step.title}</span>
            </div>
            <p className="text-xs text-gray-500 ml-9">{step.desc}</p>
            {!step.done && !step.locked && <div className="ml-9">{step.action}</div>}
            {step.locked && (
              <p className="text-xs text-gray-400 ml-9 mt-2 italic">
                Complétez l&apos;étape précédente pour débloquer
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
