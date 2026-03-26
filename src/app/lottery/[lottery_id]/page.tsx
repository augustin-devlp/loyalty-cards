"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createAnonClient } from "@/lib/supabase/anon";

interface LotteryData {
  id: string;
  title: string;
  reward_description: string;
  is_active: boolean;
  draw_date: string | null;
  business_id: string;
}

interface BusinessInfo {
  business_name: string;
  primary_color: string;
}

export default function LotteryPublicPage() {
  const { lottery_id } = useParams<{ lottery_id: string }>();

  const [lottery, setLottery] = useState<LotteryData | null>(null);
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"form" | "done">("form");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("+33 ");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sb = createAnonClient();
    sb.from("lotteries")
      .select("id, title, reward_description, is_active, draw_date, business_id")
      .eq("id", lottery_id)
      .maybeSingle()
      .then(async ({ data: lot }) => {
        if (!lot) { setLoading(false); return; }
        setLottery(lot as LotteryData);

        // Fetch business info + primary color from loyalty_cards
        const [bRes, cRes] = await Promise.all([
          sb.from("businesses").select("business_name").eq("id", lot.business_id).maybeSingle(),
          sb.from("loyalty_cards").select("primary_color").eq("business_id", lot.business_id).eq("is_active", true).limit(1).maybeSingle(),
        ]);
        setBusiness({
          business_name: bRes.data?.business_name ?? "Ce commerce",
          primary_color: cRes.data?.primary_color ?? "#534AB7",
        });
        setLoading(false);
      });
  }, [lottery_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lottery) return;
    setError(null);
    setSubmitting(true);
    const sb = createAnonClient();

    const { error: insertErr } = await sb.from("lottery_participants").insert({
      lottery_id: lottery.id,
      first_name: firstName.trim(),
      phone: phone.trim(),
    });

    if (insertErr) {
      if (insertErr.code === "23505") {
        setError("Vous êtes déjà inscrit à cette loterie avec ce numéro.");
      } else {
        setError("Une erreur est survenue. Réessayez.");
      }
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setStep("done");
  };

  const primaryColor = business?.primary_color ?? "#534AB7";

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-[#534AB7] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!lottery || !lottery.is_active) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="text-5xl mb-4">🎁</div>
      <h1 className="text-xl font-bold text-gray-800">{business?.business_name ?? "Ce commerce"}</h1>
      <p className="text-gray-500 mt-2">Cette loterie n&apos;est pas disponible pour le moment.</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Header */}
      <div className="text-white px-5 pt-10 pb-8 text-center" style={{ background: primaryColor }}>
        <div className="text-4xl mb-3">🎁</div>
        <p className="text-sm font-semibold opacity-80 mb-1">{business?.business_name}</p>
        <h1 className="text-2xl font-black">{lottery.title}</h1>
        <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3">
          <p className="text-sm opacity-80 mb-0.5">À gagner</p>
          <p className="text-lg font-black">{lottery.reward_description}</p>
        </div>
        {lottery.draw_date && (
          <p className="text-xs opacity-70 mt-3">
            Tirage le {new Date(lottery.draw_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}
      </div>

      {/* White card */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 px-5 pt-8 pb-12 max-w-md w-full mx-auto">

        {step === "form" && (
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Participez gratuitement</h2>
            <p className="text-sm text-gray-500 mb-6">Entrez vos informations pour tenter de gagner.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Marie"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <p className="text-xs text-gray-400 mt-1">1 participation par numéro de téléphone</p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-lg disabled:opacity-60 transition-all active:scale-95 mt-2"
                style={{ background: primaryColor }}
              >
                {submitting ? "Inscription…" : "🎁 Participer à la loterie"}
              </button>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                En participant, vous acceptez que vos données soient utilisées uniquement dans le cadre de cette loterie.
              </p>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="text-center py-8 space-y-4">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-black text-gray-900">Vous êtes inscrit !</h2>
            <p className="text-gray-600 leading-relaxed">
              Votre participation à la loterie <strong>{lottery.title}</strong> a bien été enregistrée.
            </p>
            {lottery.draw_date && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4">
                <p className="text-sm text-indigo-700 font-semibold">
                  📅 Le tirage aura lieu le{" "}
                  {new Date(lottery.draw_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            )}
            <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-4">
              <p className="text-sm text-green-700">
                🏆 Récompense : <strong>{lottery.reward_description}</strong>
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Bonne chance, {firstName} ! Vous serez contacté sur votre numéro en cas de victoire.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
