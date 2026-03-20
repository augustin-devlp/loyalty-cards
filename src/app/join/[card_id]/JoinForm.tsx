"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface JoinFormProps {
  cardId: string;
  primaryColor: string;
  textColor: string;
}

export default function JoinForm({ cardId, primaryColor, textColor }: JoinFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    // Find or create customer
    let customerId: string;
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      customerId = existing.id;
    } else {
      const { data: newCustomer, error: insertErr } = await supabase
        .from("customers")
        .insert({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim() || null,
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

    // Send welcome SMS (fire-and-forget — does not block navigation)
    fetch("/api/sms/welcome", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_card_id: newCard.id }),
    }).catch(() => {/* silently ignore SMS errors */});

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Marie"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Dupont"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="marie@exemple.fr"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Téléphone <span className="text-gray-400 font-normal">(optionnel — pour les notifications SMS)</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+33 6 12 34 56 78"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 text-sm"
        style={{ backgroundColor: primaryColor, color: textColor }}
      >
        {loading ? "Inscription…" : "Obtenir ma carte de fidélité"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Si vous avez déjà une carte, vous serez redirigé automatiquement.
      </p>
    </form>
  );
}
