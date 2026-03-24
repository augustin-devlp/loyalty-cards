import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";

/**
 * POST /api/push/subscribe
 * Body: { customer_card_id: string, subscription: PushSubscriptionJSON }
 *
 * Saves a Web Push subscription for a customer card.
 * Uses anon client — customer is not authenticated, card ownership is verified by customer_card_id.
 */
export async function POST(req: NextRequest) {
  const body = await req.json() as {
    customer_card_id: string;
    subscription: {
      endpoint: string;
      keys: { auth: string; p256dh: string };
    };
  };

  const { customer_card_id, subscription } = body;
  if (!customer_card_id || !subscription?.endpoint) {
    return NextResponse.json({ error: "customer_card_id and subscription required" }, { status: 400 });
  }

  const supabase = createAnonClient();

  // Verify customer card exists
  const { data: cc } = await supabase
    .from("customer_cards")
    .select("id")
    .eq("id", customer_card_id)
    .single();

  if (!cc) {
    return NextResponse.json({ error: "Customer card not found" }, { status: 404 });
  }

  // Upsert subscription by endpoint to avoid duplicates
  const { error } = await supabase
    .from("push_subscriptions")
    .upsert(
      { customer_card_id, subscription, endpoint: subscription.endpoint },
      { onConflict: "endpoint" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

/**
 * DELETE /api/push/subscribe
 * Body: { endpoint: string }
 *
 * Removes a Web Push subscription (unsubscribe).
 */
export async function DELETE(req: NextRequest) {
  const { endpoint } = await req.json() as { endpoint: string };
  if (!endpoint) {
    return NextResponse.json({ error: "endpoint required" }, { status: 400 });
  }

  const supabase = createAnonClient();
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
