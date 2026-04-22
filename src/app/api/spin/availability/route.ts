import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  RIALTO_BUSINESS_ID,
  RIALTO_RESTAURANT_ID,
  RIALTO_SPIN_WHEEL_ID,
  rialtoCorsHeaders,
} from "@/lib/rialtoConstants";

/**
 * GET /api/spin/availability?customer_id=X&wheel_id=Y
 *
 * Calcule l'état d'accès à la roue pour un customer et renvoie un
 * état parmi A/B/C/D (voir brief Phase 6 FIX 3) :
 *
 *   A — Peut spinner : review gate OK + fréquence OK + commande
 *       depuis dernière spin (si requires_order_since=true)
 *   B — Pas encore laissé d'avis Google pour cette période
 *       → la page cliente ouvre le ReviewGateModal (timer 60s hack
 *         ou mode normal si GOOGLE_PLACES_API_KEY dispo)
 *   C — A déjà spinné récemment, fréquence pas encore écoulée
 *       → affiche le dernier prix + countdown jours
 *   D — A spinné récemment mais requires_order_since=true et pas
 *       de commande depuis → CTA "Commande pour respin"
 *
 * Inclut aussi last_prize (code promo + description + used) quand
 * l'état est C/D pour rappel au client de son code en cours.
 */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(req.headers.get("origin")),
  });
}

export async function GET(req: NextRequest) {
  const headers = rialtoCorsHeaders(req.headers.get("origin"));
  const url = new URL(req.url);
  const customerId = url.searchParams.get("customer_id");
  const wheelId = url.searchParams.get("wheel_id") ?? RIALTO_SPIN_WHEEL_ID;

  if (!customerId) {
    return NextResponse.json(
      { error: "customer_id requis" },
      { status: 400, headers },
    );
  }

  const admin = createAdminClient();

  // 1) Config de la roue
  const { data: wheel } = await admin
    .from("spin_wheels")
    .select(
      "id, is_active, frequency, frequency_days, requires_order_since, min_orders_count, require_google_review, segments",
    )
    .eq("id", wheelId)
    .maybeSingle();

  if (!wheel || !wheel.is_active) {
    return NextResponse.json(
      {
        state: "INACTIVE",
        can_spin: false,
        reason: "wheel_inactive",
        frequency_days: 0,
      },
      { headers },
    );
  }

  const frequencyDays = Number(wheel.frequency_days ?? 30);

  // 2) Customer + phone
  const { data: customer } = await admin
    .from("customers")
    .select("phone")
    .eq("id", customerId)
    .maybeSingle();
  const phone = (customer?.phone as string | undefined) ?? null;

  // 3) Dernière spin de ce customer
  const { data: lastSpinRow } = phone
    ? await admin
        .from("spin_entries")
        .select("id, last_spin_at, reward_won, promo_code_id")
        .eq("wheel_id", wheelId)
        .eq("phone", phone)
        .order("last_spin_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };

  const lastSpinAt = lastSpinRow?.last_spin_at
    ? new Date(lastSpinRow.last_spin_at as string)
    : null;

  // Récupère le dernier prix (code promo) s'il existe
  let lastPrize: {
    code: string;
    description: string;
    used: boolean;
    discount_type: string | null;
    discount_value: number | null;
    free_item_label: string | null;
  } | null = null;

  if (lastSpinRow?.promo_code_id) {
    const { data: promo } = await admin
      .from("promo_codes")
      .select(
        "code, discount_type, discount_value, free_item_label, uses_count, max_uses",
      )
      .eq("id", lastSpinRow.promo_code_id)
      .maybeSingle();
    if (promo) {
      const used = Number(promo.uses_count ?? 0) >= Number(promo.max_uses ?? 1);
      lastPrize = {
        code: promo.code as string,
        description:
          promo.discount_type === "percent"
            ? `-${promo.discount_value}% sur ta commande`
            : promo.discount_type === "fixed"
              ? `-${promo.discount_value} CHF`
              : (promo.free_item_label as string) ?? "Article offert",
        used,
        discount_type: (promo.discount_type as string) ?? null,
        discount_value: promo.discount_value
          ? Number(promo.discount_value)
          : null,
        free_item_label: (promo.free_item_label as string) ?? null,
      };
    }
  } else if (lastSpinRow?.reward_won) {
    // Fallback : ancien schéma sans promo_code_id, juste un libellé
    lastPrize = {
      code: "",
      description: lastSpinRow.reward_won as string,
      used: false,
      discount_type: null,
      discount_value: null,
      free_item_label: null,
    };
  }

  const now = Date.now();

  // ─── Check fréquence ───
  if (lastSpinAt) {
    const elapsedMs = now - lastSpinAt.getTime();
    const requiredMs = frequencyDays * 24 * 60 * 60 * 1000;
    if (elapsedMs < requiredMs) {
      const remainingMs = requiredMs - elapsedMs;
      const waitDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
      const nextSpinAt = new Date(now + remainingMs).toISOString();

      // État D : si requires_order_since + pas de commande depuis
      if (wheel.requires_order_since) {
        const minOrders = Number(wheel.min_orders_count ?? 1);
        const { count } = await admin
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("restaurant_id", RIALTO_RESTAURANT_ID)
          .eq("customer_phone", phone ?? "")
          .in("status", ["accepted", "preparing", "ready", "completed"])
          .gte("created_at", lastSpinAt.toISOString());

        const ordersSince = count ?? 0;
        if (ordersSince < minOrders) {
          return NextResponse.json(
            {
              state: "D",
              can_spin: false,
              reason: "order_required",
              frequency_days: frequencyDays,
              wait_days_remaining: waitDays,
              min_orders: minOrders,
              orders_since_last_spin: ordersSince,
              last_prize: lastPrize,
            },
            { headers },
          );
        }
      }

      // État C : a spinné récemment, simple attente
      return NextResponse.json(
        {
          state: "C",
          can_spin: false,
          reason: "next_spin_in_N_days",
          frequency_days: frequencyDays,
          wait_days_remaining: waitDays,
          next_spin_at: nextSpinAt,
          last_prize: lastPrize,
        },
        { headers },
      );
    }
  }

  // ─── Review gate ───
  if (wheel.require_google_review) {
    const nowIso = new Date().toISOString();
    const { data: claim } = await admin
      .from("google_review_claims")
      .select("id, expires_at")
      .eq("customer_id", customerId)
      .eq("business_id", RIALTO_BUSINESS_ID)
      .gt("expires_at", nowIso)
      .order("claimed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!claim) {
      return NextResponse.json(
        {
          state: "B",
          can_spin: false,
          reason: "not_verified",
          requires_review: true,
          frequency_days: frequencyDays,
        },
        { headers },
      );
    }
  }

  // ─── Check requires_order_since (même sans fréquence écoulée) ───
  // Si c'est la première spin : on autorise directement. Si déjà spinné
  // auparavant et que le paramètre est actif, on a déjà checké plus haut.

  // État A : peut spinner
  return NextResponse.json(
    {
      state: "A",
      can_spin: true,
      reason: "ok",
      frequency_days: frequencyDays,
      last_prize: lastPrize,
      segments: wheel.segments ?? [],
    },
    { headers },
  );
}
