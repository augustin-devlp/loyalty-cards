import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateTicketForOrder } from "@/lib/lotteryTickets";

/**
 * POST /api/admin/backfill-lottery-tickets
 * Body: { business_id: string, pin: string }
 *
 * Rejoue la génération de tickets pour TOUTES les commandes acceptées/
 * preparing/ready/completed du business qui n'ont pas encore d'entry
 * dans lottery_entries (via order_id).
 *
 * Sert à rattraper les tickets manquants si la génération a été ajoutée
 * après l'acceptation de certaines commandes (cas Phase 9 : 5 commandes
 * acceptées mais 0 ticket créé).
 *
 * Retourne un résumé structuré :
 *   { processed, success, skipped, errors, details: [...] }
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    business_id?: string;
    pin?: string;
    limit?: number;
  } | null;

  const expectedPin = process.env.ADMIN_PIN ?? "0808";
  if (body?.pin !== expectedPin) {
    return NextResponse.json({ error: "PIN invalide" }, { status: 401 });
  }

  if (!body?.business_id) {
    return NextResponse.json(
      { error: "business_id requis" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  // 1. Trouver le restaurant_id du business
  const { data: restaurant } = await admin
    .from("restaurants")
    .select("id")
    .eq("business_id", body.business_id)
    .single();

  if (!restaurant) {
    return NextResponse.json(
      { error: "restaurant introuvable pour ce business_id" },
      { status: 404 },
    );
  }

  const restaurantId = restaurant.id as string;

  // 2. Lister les commandes éligibles (status non annulé, not new)
  const limit = Math.min(body.limit ?? 200, 500);
  const { data: orders } = await admin
    .from("orders")
    .select("id, order_number, status")
    .eq("restaurant_id", restaurantId)
    .in("status", [
      "accepted",
      "preparing",
      "ready",
      "out_for_delivery",
      "completed",
    ])
    .order("created_at", { ascending: true })
    .limit(limit);

  const orderList =
    (orders as Array<{ id: string; order_number: string; status: string }> | null) ??
    [];

  console.log("[backfill-lottery] START", {
    businessId: body.business_id,
    ordersToProcess: orderList.length,
  });

  const details: Array<{
    order_id: string;
    order_number: string;
    status: string;
    result: unknown;
  }> = [];
  let success = 0;
  let skipped = 0;
  let errors = 0;

  for (const order of orderList) {
    const result = await generateTicketForOrder(order.id);
    details.push({
      order_id: order.id,
      order_number: order.order_number,
      status: order.status,
      result,
    });
    if (result.ok) {
      if (result.reason === "already_exists") skipped += 1;
      else success += 1;
    } else {
      if (result.reason === "no_active_lottery") skipped += 1;
      else errors += 1;
    }
  }

  console.log("[backfill-lottery] DONE", {
    processed: orderList.length,
    success,
    skipped,
    errors,
  });

  return NextResponse.json({
    processed: orderList.length,
    success,
    skipped,
    errors,
    details,
  });
}
