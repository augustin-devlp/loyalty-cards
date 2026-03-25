"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createAnonClient } from "@/lib/supabase/anon";

interface Business {
  id: string;
  business_name: string;
  logo_url: string | null;
  google_place_id: string | null;
}

interface Lottery {
  id: string;
  title: string;
  reward_description: string;
  is_active: boolean;
}

type Step = "form" | "review" | "done";

export default function PublicLotteryPage() {
  const params = useParams();
  const businessId = params.business_id as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [lottery, setLottery] = useState<Lottery | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [noLottery, setNoLottery] = useState(false);

  // Form state
  const [step, setStep] = useState<Step>("form");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [reviewDone, setReviewDone] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const supabase = createAnonClient();

    (async () => {
      const { data: biz } = await supabase
        .from("businesses")
        .select("id, business_name, logo_url, google_place_id")
        .eq("id", businessId)
        .single();

      if (!biz) {
        setLoadingPage(false);
        setNoLottery(true);
        return;
      }

      setBusiness(biz as Business);

      const now = new Date().toISOString();
      const { data: activeLottery } = await supabase
        .from("lotteries")
        .select("id, title, reward_description, is_active, is_permanent, start_date, end_date")
        .eq("business_id", businessId)
        .eq("is_active", true)
        .or(`is_permanent.eq.true,and(start_date.lte.${now},end_date.gte.${now})`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!activeLottery) {
        setNoLottery(true);
      } else {
        setLottery(activeLottery as Lottery);
      }

      setLoadingPage(false);
    })();
  }, [businessId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lottery) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/lottery/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lotteryId: lottery.id,
          firstName: firstName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Erreur lors de l'inscription");
      }

      setEntryId(data.entryId);
      setStep("review");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewDone = async () => {
    if (!entryId || !lottery) return;
    setReviewLoading(true);
    try {
      await fetch("/api/lottery/verify-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId, lotteryId: lottery.id }),
      });
    } finally {
      setReviewLoading(false);
      setReviewDone(true);
      setStep("done");
    }
  };

  const googleWriteReviewUrl = business?.google_place_id
    ? `https://search.google.com/local/writereview?placeid=${business.google_place_id}`
    : null;

  if (loadingPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-transparent border-[#534AB7] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      {/* Header */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 flex flex-col items-center text-center">
          {business?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logo_url}
              alt={business?.business_name ?? "Logo"}
              className="w-16 h-16 rounded-xl object-cover mb-3"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black text-white mb-3"
              style={{ background: "#534AB7" }}
            >
              {business?.business_name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <p className="text-lg font-bold text-gray-900">{business?.business_name}</p>
        </div>

        {/* No active lottery */}
        {noLottery ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <p className="text-4xl mb-3">🎰</p>
            <p className="text-gray-500 text-sm">Aucune loterie en cours pour le moment.</p>
            <p className="text-gray-400 text-xs mt-1">Revenez bientôt !</p>
          </div>
        ) : lottery && step === "form" ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{lottery.title}</p>
              <p className="text-sm text-gray-500 mt-1">
                À gagner : <span className="font-semibold text-[#534AB7]">{lottery.reward_description}</span>
              </p>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Prénom *
                </label>
                <input
                  required
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Votre prénom"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#534AB7]/30 bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Téléphone *
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#534AB7]/30 bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Email <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#534AB7]/30 bg-white text-gray-900"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-60 transition-opacity hover:opacity-90"
                style={{ background: "#534AB7" }}
              >
                {submitting ? "Inscription…" : "Participer à la loterie"}
              </button>
            </form>
          </div>
        ) : step === "review" ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5 text-center">
            <p className="text-3xl">🎉</p>
            <p className="text-lg font-bold text-gray-900">Vous êtes inscrit !</p>
            <p className="text-sm text-gray-500">
              Augmentez vos chances en laissant un avis Google sur{" "}
              <span className="font-semibold">{business?.business_name}</span>.
            </p>

            {googleWriteReviewUrl ? (
              <a
                href={googleWriteReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
                style={{ background: "#534AB7" }}
              >
                Laisser un avis Google
              </a>
            ) : (
              <p className="text-xs text-gray-400">
                Lien Google non configuré par le commerçant.
              </p>
            )}

            <button
              onClick={handleReviewDone}
              disabled={reviewLoading}
              className="w-full py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 text-sm disabled:opacity-60 hover:bg-gray-50 transition-colors"
            >
              {reviewLoading ? "Confirmation…" : "J'ai laissé mon avis"}
            </button>

            <button
              onClick={() => setStep("done")}
              className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Passer cette étape
            </button>
          </div>
        ) : step === "done" ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center space-y-3">
            <p className="text-4xl">{reviewDone ? "⭐" : "✅"}</p>
            <p className="text-lg font-bold text-gray-900">
              {reviewDone ? "Merci pour votre avis !" : "Inscription confirmée"}
            </p>
            <p className="text-sm text-gray-500">
              Bonne chance pour le tirage au sort !
            </p>
            {lottery && (
              <p className="text-xs text-gray-400 mt-1">
                Loterie : <span className="font-medium">{lottery.title}</span>
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
