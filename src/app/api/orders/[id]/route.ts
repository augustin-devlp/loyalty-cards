import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderStatusSms } from "@/lib/smsNotifications";
import type { OrderStatus } from "@/lib/constants";
import { ORDER_STATUSES } from "@/lib/constants";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * GET /api/orders/[id]
 * Détail commande + items + historique.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: order, error } = await admin
    .from("orders")
    .select(
      "id, restaurant_id, order_number, customer_name, customer_phone, requested_pickup_time, status, total_amount, notes, created_at, updated_at",
    )
    .eq("id", params.id)
    .single();
  if (error || !order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const { data: items } = await admin
    .from("order_items")
    .select(
      "id, order_id, menu_item_id, item_name_snapshot, item_price_snapshot, quantity, selected_options, subtotal, notes",
    )
    .eq("order_id", order.id);

  const { data: history } = await admin
    .from("order_status_history")
    .select("id, order_id, old_status, new_status, changed_at, changed_by")
    .eq("order_id", order.id)
    .order("changed_at", { ascending: true });

  return NextResponse.json({ order, items: items ?? [], history: history ?? [] });
}

/**
 * PATCH /api/orders/[id]
 * Body: { status: OrderStatus }
 *
 * Met à jour le statut (le trigger Postgres `log_order_status_change`
 * s'occupe d'insérer automatiquement dans order_status_history).
 * Envoie un SMS transactionnel au client via Brevo.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    status?: OrderStatus;
  } | null;

  if (!body?.status || !ORDER_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "status invalide" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: updated, error } = await admin
    .from("orders")
    .update({ status: body.status })
    .eq("id", params.id)
    .select(
      "id, restaurant_id, order_number, customer_name, customer_phone, customer_id, status, total_amount, requested_pickup_time, cancellation_reason",
    )
    .single();

  if (error || !updated) {
    return NextResponse.json(
      { error: error?.message ?? "Mise à jour échouée" },
      { status: 500 },
    );
  }

  // +1 tampon quand la commande devient "completed"
  if (body.status === "completed" && updated.customer_id) {
    await admin.rpc("increment_rialto_stamps", { p_customer_id: updated.customer_id });
  }

  // SMS BLOQUANT — on attend le résultat pour le renvoyer à l'UI dashboard
  const sms = await sendOrderStatusSms(updated, body.status);

  return NextResponse.json({ order: updated, sms });
}

/**
 * DELETE /api/orders/[id]
 * Annule une commande (status → 'cancelled') + SMS au client.
 * On ne supprime jamais une commande en base.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Raison optionnelle dans le body (utile quand on "refuse" avec motif)
  const raw = await _req.text();
  let reason: string | null = null;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { reason?: string };
      if (typeof parsed.reason === "string" && parsed.reason.trim()) {
        reason = parsed.reason.trim();
      }
    } catch {
      /* ignore */
    }
  }

  const admin = createAdminClient();
  const { data: updated, error } = await admin
    .from("orders")
    .update({
      status: "cancelled",
      ...(reason ? { cancellation_reason: reason } : {}),
    })
    .eq("id", params.id)
    .select(
      "id, restaurant_id, order_number, customer_name, customer_phone, status, total_amount, requested_pickup_time, cancellation_reason",
    )
    .single();

  if (error || !updated) {
    return NextResponse.json(
      { error: error?.message ?? "Annulation échouée" },
      { status: 500 },
    );
  }

  const sms = await sendOrderStatusSms(updated, "cancelled");
  return NextResponse.json({ order: updated, sms });
}
