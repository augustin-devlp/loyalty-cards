"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface JoinFormProps {
  cardId: string;
  primaryColor: string;
  textColor: string;
  isPro: boolean;
}

export default function JoinForm({ cardId, primaryColor, textColor, isPro }: JoinFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const normalizedPhone = phone.trim().replace(/\s/g, "");
    if (!normalizedPhone) {
      setError("Le numéro de téléphone est requis.");
      setLoading(false);
      return;
    }

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
        .insert({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: normalizedPhone,
        })
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

    if (existingCard) {
      router.push(`/card/${existingCard.id}`);
      return;
    }

    const { data: newCard, error: cardErr } = await supabase
      .from("customer_cards")
      .insert({
        customer_id: customerId,
        card_id: cardId,
        qr_code_value: crypto.randomUUID(),
      })
      .select("id")
      .single();

    if (cardErr || !newCard) {
      setError("Erreur lors de la création de la carte : " + cardErr?.message);
      setLoading(false);
      return;
    }

    // Generate and assign a unique referral code
    const { data: refCode } = await supabase.rpc("generate_referral_code");
    if (refCode) {
      await supabase
        .from("customer_cards")
        .update({ referral_code: refCode as string })
        .eq("id", newCard.id);
    }

    // Apply referral bonus if a code was entered (Pro only)
    if (isPro && referralCode.trim()) {
      const code = referralCode.trim().toUpperCase();
      const { data: referrerCard } = await supabase
        .from("customer_cards")
        .select("id, current_stamps, card_id")
        .eq("referral_code", code)
        .eq("card_id", cardId)
        .maybeSingle();

      if (referrerCard) {
        await supabase
          .from("customer_cards")
          .update({ current_stamps: (referrerCard.current_stamps ?? 0) + 2 })
          .eq("id", referrerCard.id);

        await supabase.from("transactions").insert({
          customer_card_id: referrerCard.id,
          type: "stamp_added",
          value: 2,
        });

        await supabase.from("referrals").insert({
          referrer_card_id: referrerCard.id,
          referred_card_id: newCard.id,
          bonus_given: true,
        });
      }
    }

    // Fire-and-forget notifications
    fetch("/api/sms/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_card_id: newCard.id }),
    }).catch(() => {/* silently ignore */});

    fetch("/api/email/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_card_id: newCard.id }),
    }).catch(() => {/* silently ignore */});

    router.push(`/card/${newCard.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Prénom
          </label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Marie"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-gray-50"
            style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Nom
          </label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Dupont"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 bg-gray-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Téléphone
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">📱</span>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+33 6 12 34 56 78"
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 bg-gray-50"
          />
        </div>
      </div>

      {isPro && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Code parrain <span className="font-normal normal-case text-gray-400">(optionnel)</span>
          </label>
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            placeholder="Ex : A3F7B2"
            maxLength={6}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm uppercase tracking-widest font-mono focus:outline-none focus:ring-2 bg-gray-50"
          />
          <p className="text-xs text-gray-400 mt-1">Votre parrain gagne 2 tampons bonus</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full font-bold py-3.5 rounded-xl transition-all disabled:opacity-60 text-sm active:scale-[0.98] shadow-lg mt-2"
        style={{ backgroundColor: primaryColor, color: textColor }}
      >
        {loading ? "Inscription…" : "Obtenir ma carte de fidélité →"}
      </button>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Si vous avez déjà une carte, vous serez redirigé automatiquement.
      </p>
    </form>
  );
}
