import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import webpush from "web-push";

/**
 * POST /api/push/send
 * Body: { card_id: string, title: string, body: string, url?: string }
 *
 * Sends a Web Push notification to all subscribers of a loyalty card.
 * Requires business authentication (dashboard action).
 * Automatically removes stale subscriptions on 410 Gone responses.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as {
    card_id: string;
    title: string;
    body: string;
    url?: string;
  };
  const { card_id, title, body: msgBody, url } = body;

  if (!card_id || !title || !msgBody) {
    return NextResponse.json({ error: "card_id, title and body required" }, { status: 400 });
  }

  // Verify the card belongs to this business
  const { data: card } = await supabase
    .from("loyalty_cards")
    .select("id")
    .eq("id", card_id)
    .eq("business_id", user.id)
    .single();

  if (!card) {
    return NextResponse.json({ error: "Card not found or forbidden" }, { status: 403 });
  }

  // Set VAPID details
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  // Use service role to read subscriptions for this card's customer_cards
  const serviceSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // First fetch all customer_card IDs for this loyalty card
  const { data: ccRows } = await serviceSupabase
    .from("customer_cards")
    .select("id")
    .eq("card_id", card_id);

  const ccIds = (ccRows ?? []).map((r) => r.id as string);
  if (ccIds.length === 0) {
    return NextResponse.json({ sent: 0, message: "No subscribers" });
  }

  const { data: subscriptions } = await serviceSupabase
    .from("push_subscriptions")
    .select("id, endpoint, subscription, customer_card_id")
    .in("customer_card_id", ccIds);

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0, message: "No subscribers" });
  }

  const payload = JSON.stringify({
    title,
    body: msgBody,
    url: url ?? `/`,
    icon: "/icon-192.svg",
  });

  let sent = 0;
  const staleIds: string[] = [];

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          sub.subscription as { endpoint: string; keys: { auth: string; p256dh: string } },
          payload
        );
        sent++;
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 410 || statusCode === 404) {
          // Subscription expired — clean up
          staleIds.push(sub.id as string);
        }
      }
    })
  );

  // Remove stale subscriptions
  if (staleIds.length > 0) {
    await serviceSupabase.from("push_subscriptions").delete().in("id", staleIds);
  }

  return NextResponse.json({ sent, total: subscriptions.length, stale_removed: staleIds.length });
}
