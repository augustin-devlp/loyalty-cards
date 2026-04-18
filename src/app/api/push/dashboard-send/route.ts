import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/push/dashboard-send
 *
 * Envoie une notification Web Push à tous les dashboards abonnés pour un
 * restaurant. Deux modes d'authentification :
 *
 *   1. Header `x-webhook-secret: <ORDER_WEBHOOK_SECRET>` — utilisé par
 *      rialto-lausanne.vercel.app pour alerter à chaque nouvelle commande.
 *   2. Session Supabase active (dashboard) — pour un test manuel.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    restaurant_id?: string;
    title?: string;
    body?: string;
    url?: string;
    tag?: string;
  } | null;

  if (!body?.restaurant_id || !body.title || !body.body) {
    return NextResponse.json(
      { error: "restaurant_id, title et body requis" },
      { status: 400 },
    );
  }

  // Auth : shared secret OU session utilisateur
  const secret = req.headers.get("x-webhook-secret");
  const expected = process.env.ORDER_WEBHOOK_SECRET;
  const hasValidSecret = !!expected && secret === expected;

  if (!hasValidSecret) {
    // Pas de secret → on vérifie la session
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT;
  if (!vapidPublic || !vapidPrivate || !vapidSubject) {
    return NextResponse.json(
      { error: "VAPID keys manquantes côté serveur" },
      { status: 500 },
    );
  }
  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);

  const admin = createAdminClient();
  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, subscription")
    .eq("restaurant_id", body.restaurant_id);

  if (!subs || subs.length === 0) {
    return NextResponse.json({ sent: 0, message: "Pas d'abonnés" });
  }

  const payload = JSON.stringify({
    title: body.title,
    body: body.body,
    url: body.url ?? "/dashboard/commandes",
    tag: body.tag ?? "rialto-order",
  });

  const staleIds: string[] = [];
  let sent = 0;

  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          s.subscription as unknown as webpush.PushSubscription,
          payload,
        );
        sent += 1;
      } catch (err: unknown) {
        const code = (err as { statusCode?: number })?.statusCode;
        if (code === 404 || code === 410) {
          staleIds.push(s.id as string);
        } else {
          console.error("[push/dashboard-send]", err);
        }
      }
    }),
  );

  if (staleIds.length) {
    await admin.from("push_subscriptions").delete().in("id", staleIds);
  }

  return NextResponse.json({ sent, removedStale: staleIds.length });
}
