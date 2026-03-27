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
  require_google_review: boolean;
}

interface BusinessInfo {
  business_name: string;
  primary_color: string;
  google_place_id: string | null;
}

export default function LotteryPublicPage() {
  const { lottery_id } = useParams<{ lottery_id: string }>();

  const [lottery, setLottery] = useState<LotteryData | null>(null);
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"form" | "review" | "done">("form");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("+33 ");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [codeStep,    setCodeStep]    = useState(false);
  const [verifCode,   setVerifCode]   = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Google review mode
  const [reviewOpened,    setReviewOpened]    = useState(false);
  const [reviewVerifying, setReviewVerifying] = useState(false);
  const [reviewError,     setReviewError]     = useState<string | null>(null);

  useEffect(() => {
    const sb = createAnonClient();
    sb.from("lotteries")
      .select("id, title, reward_description, is_active, draw_date, business_id, require_google_review")
      .eq("id", lottery_id)
      .maybeSingle()
      .then(async ({ data: lot }) => {
        if (!lot) { setLoading(false); return; }
        setLottery(lot as LotteryData);

        const [bRes, cRes] = await Promise.all([
          sb.from("businesses").select("business_name, google_place_id").eq("id", lot.business_id).maybeSingle(),
          sb.from("loyalty_cards").select("primary_color").eq("business_id", lot.business_id).eq("is_active", true).limit(1).maybeSingle(),
        ]);
        setBusiness({
          business_name: bRes.data?.business_name ?? "Ce commerce",
          primary_color: cRes.data?.primary_color ?? "#534AB7",
          google_place_id: bRes.data?.google_place_id ?? null,
        });
        setLoading(false);
      });
  }, [lottery_id]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  function cleanP(p: string) { return p.replace(/\s/g, ""); }
  function isE164(p: string) { return /^\+[1-9]\d{6,14}$/.test(cleanP(p)); }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lottery) return;
    setError(null);
    if (!isE164(phone)) {
      setError("Format invalide. Exemple : +33 6 12 34 56 78 ou +41 76 123 45 67");
      return;
    }
    setSendingCode(true);
    const res = await fetch("/api/verify/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: cleanP(phone) }),
    });
    const data = await res.json();
    setSendingCode(false);
    if (!res.ok) { setError(data.error ?? "Erreur lors de l'envoi du SMS."); return; }
    setCodeStep(true);
    setResendTimer(30);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError(null);
    setSendingCode(true);
    const res = await fetch("/api/verify/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: cleanP(phone) }),
    });
    const data = await res.json();
    setSendingCode(false);
    if (!res.ok) { setError(data.error ?? "Erreur."); return; }
    setResendTimer(30);
  };

  // Insert participant in DB
  const insertParticipant = async (): Promise<boolean> => {
    if (!lottery) return false;
    const sb = createAnonClient();
    const { error: insertErr } = await sb.from("lottery_participants").insert({
      lottery_id: lottery.id,
      first_name: firstName.trim(),
      phone: cleanP(phone),
    });
    if (insertErr) {
      if (insertErr.code === "23505") {
        setError("Vous êtes déjà inscrit à cette loterie avec ce numéro.");
      } else {
        setError("Une erreur est survenue. Réessayez.");
      }
      return false;
    }
    return true;
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lottery) return;
    setError(null);
    if (verifCode.length !== 4) { setError("Entrez les 4 chiffres du code."); return; }
    setSubmitting(true);

    // 1. Verify the SMS code
    const vRes = await fetch("/api/verify/check-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: cleanP(phone), code: verifCode }),
    });
    const vData = await vRes.json();
    if (!vData.verified) {
      setError(vData.error ?? "Code invalide ou expiré.");
      setSubmitting(false);
      return;
    }

    // 2. Mode: require Google review before registering?
    const needsReview = lottery.require_google_review && !!business?.google_place_id;
    if (needsReview) {
      setSubmitting(false);
      setStep("review");
      return;
    }

    // Mode 1: insert directly
    const ok = await insertParticipant();
    setSubmitting(false);
    if (ok) setStep("done");
  };

  // Called when user confirms they left a review (Mode 2) — real Google API verification
  const handleReviewConfirmed = async () => {
    if (!lottery) return;
    setReviewVerifying(true);
    setReviewError(null);
    try {
      const res = await fetch("/api/lottery/verify-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lotteryId: lottery.id }),
      });
      const data = await res.json() as { verified: boolean; message?: string };
      if (!data.verified) {
        setReviewError(data.message ?? "Avis non trouvé. Réessayez.");
        setReviewVerifying(false);
        return;
      }
    } catch {
      setReviewError("Erreur réseau. Réessayez.");
      setReviewVerifying(false);
      return;
    }
    setReviewVerifying(false);
    // Review verified — now register participant
    setSubmitting(true);
    const ok = await insertParticipant();
    setSubmitting(false);
    if (ok) setStep("done");
  };

  const primaryColor = business?.primary_color ?? "#534AB7";
  const googleReviewUrl = business?.google_place_id
    ? `https://search.google.com/local/writereview?placeid=${business.google_place_id}`
    : null;

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

        {/* ── Step: form ── */}
        {step === "form" && (
          <>
            {codeStep ? (
              // ── Code verification ──
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Vérification du numéro</h2>
                <p className="text-sm text-gray-500 mb-6">Entrez le code reçu par SMS pour confirmer votre participation.</p>

                <form onSubmit={handleVerifyAndSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-4 text-center">
                    <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1">Code envoyé par SMS au</p>
                    <p className="text-base font-bold text-indigo-900">{cleanP(phone)}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Code de vérification *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      required
                      autoFocus
                      value={verifCode}
                      onChange={e => setVerifCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="• • • •"
                      className="w-full text-center text-3xl font-bold tracking-[0.6em] border-2 border-gray-200 rounded-2xl px-4 py-4 bg-gray-50 focus:outline-none focus:border-indigo-400 text-black"
                    />
                    <p className="text-xs text-gray-400 mt-2 text-center">Le code expire dans 10 minutes</p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || verifCode.length !== 4}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-lg disabled:opacity-60 transition-all active:scale-95 mt-2"
                    style={{ background: primaryColor }}
                  >
                    {submitting ? "Vérification…" : "Vérifier et continuer →"}
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={sendingCode || resendTimer > 0}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 disabled:opacity-50 py-1"
                  >
                    {resendTimer > 0 ? `Renvoyer dans ${resendTimer}s` : sendingCode ? "Envoi…" : "Renvoyer le code"}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCodeStep(false); setVerifCode(""); setError(null); }}
                    className="w-full text-xs text-gray-400 hover:text-gray-500"
                  >
                    ← Modifier mon numéro
                  </button>
                </form>
              </>
            ) : (
              // ── Phone input ──
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Participez gratuitement</h2>
                <p className="text-sm text-gray-500 mb-6">Entrez vos informations pour tenter de gagner.</p>

                <form onSubmit={handleSendCode} className="space-y-4">
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
                    disabled={sendingCode}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-lg disabled:opacity-60 transition-all active:scale-95 mt-2"
                    style={{ background: primaryColor }}
                  >
                    {sendingCode ? "Envoi du code…" : "📱 Recevoir le code par SMS"}
                  </button>

                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    En participant, vous acceptez que vos données soient utilisées uniquement dans le cadre de cette loterie.
                  </p>
                </form>
              </>
            )}
          </>
        )}

        {/* ── Step: review (Mode 2 — Google review verified before registration) ── */}
        {step === "review" && (
          <div className="flex flex-col items-center text-center gap-6 py-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md"
              style={{ background: "linear-gradient(135deg, #fef9c3, #fde68a)" }}>
              ⭐
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Dernière étape !</h2>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                Laissez un avis Google sur{" "}
                <strong className="text-gray-800">{business?.business_name}</strong>{" "}
                pour confirmer votre participation à la loterie.
              </p>
            </div>

            <div className="w-full space-y-3">
              {/* 1 — Open review URL */}
              {googleReviewUrl && (
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { setReviewOpened(true); setReviewError(null); }}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-black text-white text-base shadow-lg transition-all active:scale-95"
                  style={{ background: primaryColor }}
                >
                  ⭐ Laisser mon avis Google
                </a>
              )}

              {/* 2 — Confirm + verify */}
              <button
                onClick={handleReviewConfirmed}
                disabled={reviewVerifying || submitting}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 ${
                  reviewOpened
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {reviewVerifying
                  ? "Vérification en cours…"
                  : submitting
                  ? "Enregistrement…"
                  : reviewOpened
                  ? "✓ J'ai laissé mon avis → Vérifier"
                  : "J'ai déjà laissé un avis"}
              </button>

              {/* Error message */}
              {reviewError && (
                <div className="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
                  {reviewError}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Merci pour votre soutien ! Votre avis aide {business?.business_name} à se faire connaître.
            </p>
          </div>
        )}

        {/* ── Step: done ── */}
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

            {/* Google review — shown in Mode 1 (optional after registration) */}
            {!lottery.require_google_review && googleReviewUrl && (
              <a
                href={googleReviewUrl}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-700 hover:border-gray-200 hover:bg-gray-50 transition-all shadow-sm mt-4"
              >
                ⭐ Laisser un avis Google
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
