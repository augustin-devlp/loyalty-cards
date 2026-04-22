"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateShortCode } from "@/lib/shortCode";

interface JoinFormProps {
  cardId: string;
  primaryColor: string;
  textColor: string;
  country?: string;
}

function cleanPhone(p: string) { return p.replace(/\s/g, ""); }
function isE164(p: string)     { return /^\+[1-9]\d{6,14}$/.test(cleanPhone(p)); }

export default function JoinForm({ cardId, primaryColor, textColor, country }: JoinFormProps) {
  const router = useRouter();

  const defaultPrefix = country === "CH" ? "+41" : "+33";
  const [firstName,    setFirstName]    = useState("");
  const [lastName,     setLastName]     = useState("");
  const [phone,        setPhone]        = useState(defaultPrefix);
  const [referralCode, setReferralCode] = useState("");

  const [codeStep,      setCodeStep]      = useState(false);
  const [verifCode,     setVerifCode]     = useState("");
  const [sendingCode,   setSendingCode]   = useState(false);
  const [verifying,     setVerifying]     = useState(false);
  const [resendTimer,   setResendTimer]   = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState<string | null>(null);

  useEffect(() => {
    if (!codeStep) setPhone(country === "CH" ? "+41" : "+33");
  }, [country, codeStep]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // ── Step 1: send verification code ──
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const p = cleanPhone(phone);
    if (!isE164(p)) {
      setError("Format invalide. Exemple : +33 6 12 34 56 78 ou +41 76 123 45 67");
      return;
    }
    setSendingCode(true);
    const res = await fetch("/api/verify/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: p }),
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
      body: JSON.stringify({ phone: cleanPhone(phone) }),
    });
    const data = await res.json();
    setSendingCode(false);
    if (!res.ok) { setError(data.error ?? "Erreur."); return; }
    setResendTimer(30);
  };

  // ── Step 2: verify code then create account ──
  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (verifCode.length !== 4) { setError("Entrez les 4 chiffres du code."); return; }
    setVerifying(true);

    const vRes = await fetch("/api/verify/check-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: cleanPhone(phone), code: verifCode }),
    });
    const vData = await vRes.json();
    if (!vData.verified) {
      setError(vData.error ?? "Code invalide.");
      setVerifying(false);
      return;
    }
    setVerifying(false);
    setLoading(true);

    const normalizedPhone = cleanPhone(phone);
    const supabase = createClient();

    // Find or create customer by phone
    let customerId: string;
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", normalizedPhone)
      .maybeSingle();

    if (existing) {
      customerId = existing.id;
    } else {
      const { data: newCustomer, error: insertErr } = await supabase
        .from("customers")
        .insert({ first_name: firstName.trim(), last_name: lastName.trim(), phone: normalizedPhone })
        .select("id")
        .single();
      if (insertErr || !newCustomer) {
        setError("Erreur lors de la création du compte : " + insertErr?.message);
        setLoading(false);
        return;
      }
      customerId = newCustomer.id;
    }

    // Find or create customer_card
    const { data: existingCard } = await supabase
      .from("customer_cards")
      .select("id")
      .eq("customer_id", customerId)
      .eq("card_id", cardId)
      .maybeSingle();

    if (existingCard) { router.push(`/card/${existingCard.id}`); return; }

    const { data: newCard, error: cardErr } = await supabase
      .from("customer_cards")
      .insert({
        customer_id: customerId,
        card_id: cardId,
        qr_code_value: crypto.randomUUID(),
        short_code: generateShortCode(),
      })
      .select("id")
      .single();

    if (cardErr || !newCard) {
      setError("Erreur lors de la création de la carte : " + cardErr?.message);
      setLoading(false);
      return;
    }

    // Referral code
    const { data: refCode } = await supabase.rpc("generate_referral_code");
    if (refCode) {
      await supabase.from("customer_cards").update({ referral_code: refCode as string }).eq("id", newCard.id);
    }

    // Apply referral bonus
    if (referralCode.trim()) {
      const code = referralCode.trim().toUpperCase();
      const { data: referrerCard } = await supabase
        .from("customer_cards")
        .select("id, current_stamps, card_id")
        .eq("referral_code", code)
        .eq("card_id", cardId)
        .maybeSingle();
      if (referrerCard) {
        await supabase.from("customer_cards")
          .update({ current_stamps: (referrerCard.current_stamps ?? 0) + 2 })
          .eq("id", referrerCard.id);
        await supabase.from("transactions").insert({ customer_card_id: referrerCard.id, type: "stamp_added", value: 2 });
        await supabase.from("referrals").insert({ referrer_card_id: referrerCard.id, referred_card_id: newCard.id, bonus_given: true });
      }
    }

    fetch("/api/sms/welcome",   { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer_card_id: newCard.id }) }).catch(() => {});
    fetch("/api/email/welcome", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer_card_id: newCard.id }) }).catch(() => {});

    router.push(`/card/${newCard.id}`);
  };

  const placeholder = country === "CH" ? "+41 76 123 45 67" : "+33 6 12 34 56 78";

  // ── Render: code step ──
  if (codeStep) {
    return (
      <form onSubmit={handleVerifyAndSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-4 text-center">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1">Code envoyé par SMS au</p>
          <p className="text-base font-bold text-indigo-900">{cleanPhone(phone)}</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
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
          disabled={verifying || loading || verifCode.length !== 4}
          className="w-full font-bold py-3.5 rounded-xl transition-all disabled:opacity-60 text-sm active:scale-[0.98] shadow-lg"
          style={{ backgroundColor: primaryColor, color: textColor }}
        >
          {verifying || loading ? "Vérification…" : "Confirmer et obtenir ma carte →"}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={sendingCode || resendTimer > 0}
          className="w-full text-sm text-gray-400 hover:text-gray-600 disabled:opacity-50 py-1"
        >
          {resendTimer > 0 ? `Renvoyer le code dans ${resendTimer}s` : sendingCode ? "Envoi…" : "Renvoyer le code"}
        </button>

        <button type="button" onClick={() => { setCodeStep(false); setVerifCode(""); setError(null); }}
          className="w-full text-xs text-gray-400 hover:text-gray-500">
          ← Modifier mon numéro
        </button>
      </form>
    );
  }

  // ── Render: phone input step ──
  return (
    <form onSubmit={handleSendCode} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Prénom</label>
          <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Marie"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-gray-50 text-black"
            style={{ "--tw-ring-color": primaryColor } as React.CSSProperties} />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nom</label>
          <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Dupont"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-gray-50 text-black" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Téléphone</label>
        <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-gray-50 text-black" />
        <p className="text-xs text-gray-400 mt-1">Format international — ex : {placeholder}</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Code parrain <span className="font-normal normal-case text-gray-400">(optionnel)</span>
        </label>
        <input type="text" value={referralCode} onChange={e => setReferralCode(e.target.value.toUpperCase())}
          placeholder="Ex : A3F7B2" maxLength={6}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm uppercase tracking-widest font-mono focus:outline-none focus:ring-2 bg-gray-50 text-black" />
        <p className="text-xs text-gray-400 mt-1">Votre parrain gagne 2 tampons bonus</p>
      </div>

      <button type="submit" disabled={sendingCode}
        className="w-full font-bold py-3.5 rounded-xl transition-all disabled:opacity-60 text-sm active:scale-[0.98] shadow-lg mt-2"
        style={{ backgroundColor: primaryColor, color: textColor }}>
        {sendingCode ? "Envoi du code…" : "Recevoir le code par SMS →"}
      </button>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Si vous avez déjà une carte, vous serez redirigé automatiquement.
      </p>
    </form>
  );
}
