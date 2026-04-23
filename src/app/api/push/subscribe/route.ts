import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/anon";
import { createAdminClient } from "@/lib/supabase/admin";
import { rialtoCorsHeaders } from "@/lib/rialtoConstants";
import { normalizePhone } from "@/lib/analytics";

/**
 * OPTIONS handler CORS Rialto (Phase 11 C6 PWA subscribe by phone).
 */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(
      req.headers.get("origin"),
      "POST, DELETE, OPTIONS",
    ),
  });
}

/**
 * POST /api/push/subscribe
 * Body (1) legacy: { customer_card_id: string, subscription: PushSubscriptionJSON }
 * Body (2) C6 phone: { phone: string, subscription: PushSubscriptionJSON }
 *
 * Saves a Web Push subscription for a customer card OR directement par
 * phone (Phase 11 C6 — app Rialto PWA). Le 2e mode permet la cascade
 * push->SMS dans sendOrderStatusSms.
 */
export async function POST(req: NextRequest) {
  const headers = rialtoCorsHeaders(
    req.headers.get("origin"),
    "POST, DELETE, OPTIONS",
  );
  const body = (await req.json()) as {
    customer_card_id?: string;
    customer_id?: string | null;
    phone?: string;
    subscription: {
      endpoint: string;
      keys: { auth: string; p256dh: string };
    };
  };

  const { customer_card_id, subscription } = body;
  const phone = body.phone ?? undefined;
  const providedCustomerId = body.customer_id ?? undefined;
  if (!subscription?.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
    return NextResponse.json(
      { error: "subscription (endpoint + keys) requis" },
      { status: 400, headers },
    );
  }

  // Mode 2 Phase 11 C6 : subscribe par phone OU customer_id (app Rialto)
  if ((phone || providedCustomerId) && !customer_card_id) {
    const admin = createAdminClient();
    const phoneNorm = phone ? normalizePhone(phone) : null;
    const ua = req.headers.get("user-agent") ?? null;

    let customerId = providedCustomerId ?? null;
    let effectivePhone = phoneNorm;
    if (!customerId && phoneNorm) {
      const { data: allCustomers } = await admin
        .from("customers")
        .select("id, phone");
      const match = (allCustomers ?? []).find(
        (c) => normalizePhone(c.phone ?? "") === phoneNorm,
      );
      customerId = match?.id ?? null;
    }
    if (!effectivePhone && customerId) {
      const { data: cust } = await admin
        .from("customers")
        .select("phone")
        .eq("id", customerId)
        .single();
      effectivePhone = cust?.phone ? normalizePhone(cust.phone) : null;
    }

    const { error } = await admin
      .from("push_subscriptions")
      .upsert(
        {
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          subscription,
          customer_id: customerId,
          phone: effectivePhone,
          user_agent: ua,
          is_active: true,
          failure_count: 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "endpoint" },
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers });
    }
    return NextResponse.json(
      { success: true, mode: "phone", customer_id: customerId },
      { headers },
    );
  }

  // Mode 1 legacy : customer_card_id
  if (!customer_card_id) {
    return NextResponse.json(
      { error: "customer_card_id or phone required" },
      { status: 400, headers },
    );
  }

  const supabase = createAnonClient();

  // Verify customer card exists
  const { data: cc } = await supabase
    .from("customer_cards")
    .select("id")
    .eq("id", customer_card_id)
    .single();

  if (!cc) {
    return NextResponse.json(
      { error: "Customer card not found" },
      { status: 404, headers },
    );
  }

  // Upsert subscription by endpoint to avoid duplicates
  const { error } = await supabase
    .from("push_subscriptions")
    .upsert(
      {
        customer_card_id,
        subscription,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        is_active: true,
      },
      { onConflict: "endpoint" },
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers });
  }

  return NextResponse.json({ success: true, mode: "card" }, { headers });
}

/**
 * DELETE /api/push/subscribe
 * Body: { endpoint: string } OR query ?endpoint=
 *
 * Removes a Web Push subscription (unsubscribe).
 */
export async function DELETE(req: NextRequest) {
  const headers = rialtoCorsHeaders(
    req.headers.get("origin"),
    "POST, DELETE, OPTIONS",
  );

  let endpoint: string | null = null;
  const url = new URL(req.url);
  endpoint = url.searchParams.get("endpoint");
  if (!endpoint) {
    try {
      const b = (await req.json()) as { endpoint?: string };
      endpoint = b.endpoint ?? null;
    } catch {
      /* no body */
    }
  }
  if (!endpoint) {
    return NextResponse.json(
      { error: "endpoint required" },
      { status: 400, headers },
    );
  }

  const supabase = createAnonClient();
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers });
  }

  return NextResponse.json({ success: true }, { headers });
}
