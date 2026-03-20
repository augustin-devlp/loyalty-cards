"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const QrScanner = dynamic(() => import("./QrScanner"), { ssr: false });

type Phase = "scanning" | "loading" | "scanned" | "processing" | "success" | "error";

interface CustomerCard {
  id: string;
  current_stamps: number;
  current_points: number;
  rewards_claimed: number;
  customers: { first_name: string; last_name: string };
  loyalty_cards: {
    id: string;
    card_name: string;
    card_type: "stamp" | "points";
    stamps_required: number | null;
    reward_threshold: number | null;
    reward_description: string;
    primary_color: string;
    text_color: string;
  };
}

interface ActivePromo {
  id: string;
  title: string;
  multiplier: number;
}

export default function ScanPage() {
  const [phase, setPhase] = useState<Phase>("scanning");
  const [customerCard, setCustomerCard] = useState<CustomerCard | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState(1);
  const [rewardReached, setRewardReached] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePromo, setActivePromo] = useState<ActivePromo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stampsAdded, setStampsAdded] = useState(1);

  const handleScan = useCallback(async (qrValue: string) => {
    setPhase("loading");
    setError(null);

    const supabase = createClient();
    const { data } = await supabase
      .from("customer_cards")
      .select(
        `id, current_stamps, current_points, rewards_claimed,
         customers (first_name, last_name),
         loyalty_cards (id, card_name, card_type, stamps_required, reward_threshold, reward_description, primary_color, text_color)`
      )
      .eq("qr_code_value", qrValue)
      .single();

    if (!data) {
      setError("QR code non reconnu. Veuillez réessayer.");
      setPhase("scanning");
      return;
    }

    const cc = data as unknown as CustomerCard;
    setCustomerCard(cc);

    // Check for active promotion on this card
    const cardId = (cc.loyalty_cards as unknown as { id?: string }).id;
    if (cardId) {
      const { data: promoData } = await supabase
        .from("promotions")
        .select("id, title, multiplier")
        .eq("card_id", cardId)
        .eq("is_active", true)
        .lte("start_date", new Date().toISOString())
        .gte("end_date", new Date().toISOString())
        .maybeSingle();
      setActivePromo(promoData as ActivePromo | null);
    } else {
      setActivePromo(null);
    }

    setPhase("scanned");
  }, []);

  const handleAddStamp = async () => {
    if (!customerCard) return;
    setPhase("processing");

    const supabase = createClient();

    // Anti-fraud: max 3 stamps per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("transactions")
      .select("id", { count: "exact", head: true })
      .eq("customer_card_id", customerCard.id)
      .eq("type", "stamp_added")
      .gte("created_at", today.toISOString());

    if ((count ?? 0) >= 3) {
      setErrorMessage("Limite atteinte : maximum 3 tampons par jour pour ce client.");
      setPhase("error");
      return;
    }

    const multiplier = activePromo?.multiplier ?? 1;
    const stampsRequired = customerCard.loyalty_cards.stamps_required ?? 10;
    const added = multiplier;
    const newStamps = customerCard.current_stamps + added;
    const reached = newStamps >= stampsRequired;

    await supabase
      .from("customer_cards")
      .update({
        current_stamps: reached ? 0 : newStamps,
        rewards_claimed: reached
          ? customerCard.rewards_claimed + 1
          : customerCard.rewards_claimed,
      })
      .eq("id", customerCard.id);

    const txRows: { customer_card_id: string; type: string; value: number }[] = [
      { customer_card_id: customerCard.id, type: "stamp_added", value: added },
    ];
    if (reached) {
      // Anti-fraud: max 1 reward per week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: rewardCount } = await supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .eq("customer_card_id", customerCard.id)
        .eq("type", "reward_claimed")
        .gte("created_at", weekAgo.toISOString());

      if ((rewardCount ?? 0) >= 1) {
        setErrorMessage("Ce client a déjà réclamé une récompense cette semaine.");
        setPhase("error");
        return;
      }

      txRows.push({ customer_card_id: customerCard.id, type: "reward_claimed", value: 1 });
    }
    await supabase.from("transactions").insert(txRows);

    if (reached) {
      fetch("/api/sms/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_card_id: customerCard.id }),
      }).catch(() => {/* silently ignore SMS errors */});
      fetch("/api/email/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_card_id: customerCard.id }),
      }).catch(() => {/* silently ignore email errors */});
    }

    setStampsAdded(added);
    setRewardReached(reached);
    setPhase("success");
  };

  const handleAddPoints = async () => {
    if (!customerCard) return;
    setPhase("processing");

    const supabase = createClient();

    // Anti-fraud: max 3 point additions per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from("transactions")
      .select("id", { count: "exact", head: true })
      .eq("customer_card_id", customerCard.id)
      .eq("type", "points_added")
      .gte("created_at", today.toISOString());

    if ((count ?? 0) >= 3) {
      setErrorMessage("Limite atteinte : maximum 3 ajouts de points par jour pour ce client.");
      setPhase("error");
      return;
    }

    const rewardThreshold = customerCard.loyalty_cards.reward_threshold ?? 100;
    const newPoints = customerCard.current_points + pointsToAdd;
    const reached = newPoints >= rewardThreshold;

    await supabase
      .from("customer_cards")
      .update({
        current_points: newPoints,
        rewards_claimed: reached
          ? customerCard.rewards_claimed + 1
          : customerCard.rewards_claimed,
      })
      .eq("id", customerCard.id);

    const txRows: { customer_card_id: string; type: string; value: number }[] = [
      { customer_card_id: customerCard.id, type: "points_added", value: pointsToAdd },
    ];
    if (reached) {
      // Anti-fraud: max 1 reward per week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: rewardCount } = await supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .eq("customer_card_id", customerCard.id)
        .eq("type", "reward_claimed")
        .gte("created_at", weekAgo.toISOString());

      if ((rewardCount ?? 0) >= 1) {
        setErrorMessage("Ce client a déjà réclamé une récompense cette semaine.");
        setPhase("error");
        return;
      }

      txRows.push({ customer_card_id: customerCard.id, type: "reward_claimed", value: 1 });
    }
    await supabase.from("transactions").insert(txRows);

    if (reached) {
      fetch("/api/sms/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_card_id: customerCard.id }),
      }).catch(() => {/* silently ignore SMS errors */});
      fetch("/api/email/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_card_id: customerCard.id }),
      }).catch(() => {/* silently ignore email errors */});
    }

    setRewardReached(reached);
    setPhase("success");
  };

  const reset = () => {
    setCustomerCard(null);
    setRewardReached(false);
    setError(null);
    setErrorMessage(null);
    setActivePromo(null);
    setStampsAdded(1);
    setPointsToAdd(1);
    setPhase("scanning");
  };

  const card = customerCard?.loyalty_cards;
  const customer = customerCard?.customers;
  const bg = card?.primary_color ?? "#4F46E5";
  const fg = card?.text_color ?? "#FFFFFF";

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-5">

      {/* ── SCANNING ── */}
      {phase === "scanning" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-semibold text-gray-900">Scanner le QR code client</p>
            <p className="text-sm text-gray-400 mt-0.5">
              Pointez la caméra vers le QR code affiché sur le téléphone du client.
            </p>
          </div>
          {error && (
            <div className="mx-5 mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}
          <QrScanner onScan={handleScan} />
        </div>
      )}

      {/* ── LOADING ── */}
      {phase === "loading" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Récupération du client…</p>
        </div>
      )}

      {/* ── SCANNED / PROCESSING ── */}
      {(phase === "scanned" || phase === "processing") && customerCard && card && customer && (
        <div className="space-y-4">
          {/* Customer info card */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <div className="px-6 py-5" style={{ backgroundColor: bg, color: fg }}>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ opacity: 0.7 }}>
                {card.card_name}
              </p>
              <p className="text-2xl font-bold mt-1">
                {customer.first_name} {customer.last_name}
              </p>
            </div>

            <div className="bg-white px-6 py-5">
              {card.card_type === "stamp" ? (
                <>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Tampons actuels</span>
                    <span className="font-semibold">
                      {customerCard.current_stamps} / {card.stamps_required ?? 10}
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          (customerCard.current_stamps / (card.stamps_required ?? 10)) * 100,
                          100
                        )}%`,
                        backgroundColor: bg,
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Points actuels</span>
                    <span className="font-semibold">
                      {customerCard.current_points} / {card.reward_threshold ?? 100} pts
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          (customerCard.current_points / (card.reward_threshold ?? 100)) * 100,
                          100
                        )}%`,
                        backgroundColor: bg,
                      }}
                    />
                  </div>
                </>
              )}
              <p className="text-xs text-gray-400 mt-2">
                🎁 Récompense : {card.reward_description}
              </p>
            </div>
          </div>

          {/* Action */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-5 space-y-4">
            <p className="font-semibold text-gray-900">Valider un achat</p>

            {activePromo && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-700">
                🎁 Promo active : <strong>{activePromo.title}</strong> — x{activePromo.multiplier} tampons
              </div>
            )}

            {card.card_type === "stamp" ? (
              <button
                onClick={handleAddStamp}
                disabled={phase === "processing"}
                className="w-full font-semibold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-50"
                style={{ backgroundColor: bg, color: fg }}
              >
                {phase === "processing"
                  ? "Enregistrement…"
                  : activePromo
                  ? `Ajouter ${activePromo.multiplier} tampons (x${activePromo.multiplier})`
                  : "Ajouter 1 tampon"}
              </button>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de points à ajouter
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={pointsToAdd}
                    onChange={(e) => setPointsToAdd(Math.max(1, Number(e.target.value)))}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={handleAddPoints}
                  disabled={phase === "processing"}
                  className="w-full font-semibold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-50"
                  style={{ backgroundColor: bg, color: fg }}
                >
                  {phase === "processing"
                    ? "Enregistrement…"
                    : `Ajouter ${pointsToAdd} point${pointsToAdd > 1 ? "s" : ""}`}
                </button>
              </div>
            )}

            <button
              onClick={reset}
              className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* ── SUCCESS ── */}
      {phase === "success" && customerCard && card && customer && (
        <div className="space-y-4">
          {/* Reward alert */}
          {rewardReached && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl px-6 py-5 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-lg font-bold text-amber-800">Récompense gagnée !</p>
              <p className="text-sm text-amber-700 mt-1">
                {customer.first_name} a obtenu : <strong>{card.reward_description}</strong>
              </p>
            </div>
          )}

          {/* Success card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-8 text-center space-y-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto"
              style={{ backgroundColor: bg, color: fg }}
            >
              ✓
            </div>
            <p className="text-xl font-bold text-gray-900">Validé !</p>
            <p className="text-sm text-gray-500">
              {card.card_type === "stamp"
                ? `${stampsAdded} tampon${stampsAdded > 1 ? "s" : ""} ajouté${stampsAdded > 1 ? "s" : ""} pour ${customer.first_name} ${customer.last_name}`
                : `${pointsToAdd} point${pointsToAdd > 1 ? "s" : ""} ajouté${pointsToAdd > 1 ? "s" : ""} pour ${customer.first_name} ${customer.last_name}`}
            </p>
            {activePromo && card.card_type === "stamp" && stampsAdded > 1 && (
              <p className="text-xs text-amber-600">
                x{activePromo.multiplier} grâce à la promo {activePromo.title}
              </p>
            )}

            <button
              onClick={reset}
              className="mt-4 w-full font-semibold py-3 rounded-xl text-sm text-white transition-colors"
              style={{ backgroundColor: bg }}
            >
              Scanner un autre client
            </button>
          </div>
        </div>
      )}

      {/* ── ERROR ── */}
      {phase === "error" && (
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm px-6 py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl mx-auto">
            ✗
          </div>
          <p className="text-xl font-bold text-red-700">Action refusée</p>
          <p className="text-sm text-red-600">
            {errorMessage ?? "Une erreur s'est produite."}
          </p>
          <button
            onClick={reset}
            className="mt-2 w-full font-semibold py-3 rounded-xl text-sm text-white bg-red-500 transition-colors hover:bg-red-600"
          >
            Retour au scanner
          </button>
        </div>
      )}
    </div>
  );
}
