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
 * Réponse :
 *   { can_spin: true }
 *   { can_spin: false, reason: "next_spin_in_N_days",
 *       wait_days_remaining: 12, next_spin_at: ISO }
 *   { can_spin: false, reason: "order_required",
 *       min_orders: 1, orders_since_last_spin: 0 }
 *   { can_spin: false, reason: "wheel_inactive" }
 *   { can_spin: false, reason: "not_verified",  // review gate non passé
 *       requires_review: true }
 *
 * Règles d'accès (depuis spin_wheels) :
 *   - frequency_days : intervalle min entre 2 spins
 *   - requires_order_since : true ⇒ il faut ≥ min_orders_count commandes
 *     status IN ('accepted','preparing','ready','completed') depuis last_spin_at
 *
 * Appelé par la page /confirmation côté Rialto avant d'afficher la modale roue.
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

  // 1) Charge la config de la roue
  const { data: wheel } = await admin
    .from("spin_wheels")
    .select(
      "id, is_active, frequency, frequency_days, requires_order_since, min_orders_count, require_google_review",
    )
    .eq("id", wheelId)
    .maybeSingle();

  if (!wheel || !wheel.is_active) {
    return NextResponse.json(
      { can_spin: false, reason: "wheel_inactive" },
      { headers },
    );
  }

  // 2) Dernière spin_entry pour ce customer (via téléphone — la roue
  //    travaille par phone, pas par customer_id directement)
  const { data: customer } = await admin
    .from("customers")
    .select("phone")
    .eq("id", customerId)
    .maybeSingle();

  const phone = customer?.phone as string | undefined;
  if (!phone) {
    // Pas de téléphone ⇒ première spin possible
    // (mais review gate s'applique toujours en aval)
    return NextResponse.json(
      { can_spin: true, reason: "no_previous_spin" },
      { headers },
    );
  }

  const { data: lastSpinRow } = await admin
    .from("spin_entries")
    .select("last_spin_at")
    .eq("wheel_id", wheelId)
    .eq("phone", phone)
    .order("last_spin_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const lastSpinAt = lastSpinRow?.last_spin_at
    ? new Date(lastSpinRow.last_spin_at as string)
    : null;

  // 3) Vérif fréquence
  const frequencyDays = Number(wheel.frequency_days ?? 30);
  const now = Date.now();
  if (lastSpinAt) {
    const elapsedMs = now - lastSpinAt.getTime();
    const requiredMs = frequencyDays * 24 * 60 * 60 * 1000;
    if (elapsedMs < requiredMs) {
      const remainingMs = requiredMs - elapsedMs;
      const waitDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
      const nextSpinAt = new Date(now + remainingMs).toISOString();
      return NextResponse.json(
        {
          can_spin: false,
          reason: "next_spin_in_N_days",
          wait_days_remaining: waitDays,
          next_spin_at: nextSpinAt,
        },
        { headers },
      );
    }
  }

  // 4) Vérif commandes depuis la dernière spin (si activé)
  if (wheel.requires_order_since && lastSpinAt) {
    const minOrders = Number(wheel.min_orders_count ?? 1);
    const { count } = await admin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("restaurant_id", RIALTO_RESTAURANT_ID)
      .eq("customer_phone", phone)
      .in("status", ["accepted", "preparing", "ready", "completed"])
      .gte("created_at", lastSpinAt.toISOString());

    const ordersSince = count ?? 0;
    if (ordersSince < minOrders) {
      return NextResponse.json(
        {
          can_spin: false,
          reason: "order_required",
          min_orders: minOrders,
          orders_since_last_spin: ordersSince,
        },
        { headers },
      );
    }
  }

  // 5) Review gate (si require_google_review) — on n'interdit pas, on
  //    signale que le client doit passer le gate avant de pouvoir spinner.
  //    La vérification effective a lieu côté /api/rialto/loyalty/spin.
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
          can_spin: false,
          reason: "not_verified",
          requires_review: true,
        },
        { headers },
      );
    }
  }

  return NextResponse.json({ can_spin: true }, { headers });
}
