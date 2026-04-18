import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderStatusSms } from "@/lib/smsNotifications";
import type { OrderStatus } from "@/lib/constants";

/**
 * POST /api/orders/[id]/resend-sms
 *
 * Renvoie le SMS transactionnel correspondant au statut actuel de la commande.
 * Utile si le premier envoi a échoué (Brevo 5xx, réseau, etc).
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: order, error } = await admin
    .from("orders")
    .select(
      "id, order_number, customer_phone, status, total_amount, requested_pickup_time",
    )
    .eq("id", params.id)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const sms = await sendOrderStatusSms(order, order.status as OrderStatus);
  return NextResponse.json({ sms });
}
