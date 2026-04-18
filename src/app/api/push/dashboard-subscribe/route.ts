import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/push/dashboard-subscribe
 * Body: { restaurant_id: string, subscription: PushSubscriptionJSON }
 *
 * Enregistre une souscription Web Push pour un dashboard restaurant.
 * (Mehmet n'ayant pas encore de compte, on n'exige pas d'auth pour
 * l'instant — n'importe quel gérant qui active les notifs sur
 * /dashboard/commandes se retrouve ici. À restreindre quand le compte
 * business sera créé.)
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    restaurant_id?: string;
    subscription?: {
      endpoint: string;
      keys: { auth: string; p256dh: string };
    };
  } | null;

  if (!body?.restaurant_id || !body.subscription?.endpoint) {
    return NextResponse.json(
      { error: "restaurant_id and subscription required" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.from("push_subscriptions").upsert(
    {
      restaurant_id: body.restaurant_id,
      customer_card_id: null,
      subscription: body.subscription,
      endpoint: body.subscription.endpoint,
    },
    { onConflict: "endpoint" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

/**
 * DELETE /api/push/dashboard-subscribe
 * Body: { endpoint: string }
 */
export async function DELETE(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    endpoint?: string;
  } | null;
  if (!body?.endpoint) {
    return NextResponse.json({ error: "endpoint required" }, { status: 400 });
  }
  const admin = createAdminClient();
  const { error } = await admin
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", body.endpoint);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
