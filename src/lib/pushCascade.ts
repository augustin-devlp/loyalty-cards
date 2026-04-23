import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePhone } from "@/lib/analytics";

/**
 * pushCascade — Phase 11 C6.
 *
 * Tente d'envoyer un Web Push au client identifié par phone (ou
 * customer_id). Retourne `{ pushed: true }` si au moins 1 endpoint a
 * réussi. Sinon `{ pushed: false }` — l'appelant peut fallback SMS.
 *
 * Les subscriptions en 410/404 sont désactivées automatiquement.
 */
export type CascadePushResult = {
  pushed: boolean;
  attempted: number;
  succeeded: number;
  stale: number;
};

export async function tryPushByPhone(params: {
  phone: string;
  payload: {
    title: string;
    body: string;
    url?: string;
    icon?: string;
    tag?: string;
  };
  customerId?: string | null;
}): Promise<CascadePushResult> {
  const { phone, payload, customerId } = params;

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT ?? "mailto:noreply@rialto-lausanne.ch";

  if (!vapidPublic || !vapidPrivate) {
    // VAPID pas configuré → on skip push (cascade SMS uniquement)
    return { pushed: false, attempted: 0, succeeded: 0, stale: 0 };
  }

  try {
    webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);
  } catch (err) {
    console.warn("[push-cascade] VAPID setup failed", err);
    return { pushed: false, attempted: 0, succeeded: 0, stale: 0 };
  }

  const admin = createAdminClient();
  const phoneNorm = normalizePhone(phone);

  // Récupère subscriptions actives pour ce téléphone ou customer_id
  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth, subscription, phone, customer_id, is_active")
    .or(
      customerId
        ? `phone.eq.${phoneNorm},customer_id.eq.${customerId}`
        : `phone.eq.${phoneNorm}`,
    );

  const active = (subs ?? []).filter((s) => s.is_active !== false);
  if (active.length === 0) {
    return { pushed: false, attempted: 0, succeeded: 0, stale: 0 };
  }

  const body = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? "/",
    icon: payload.icon ?? "/icon-192.svg",
    tag: payload.tag ?? `rialto-${Date.now()}`,
  });

  let succeeded = 0;
  const staleIds: string[] = [];

  await Promise.allSettled(
    active.map(async (s) => {
      const sub =
        s.subscription ??
        ({
          endpoint: s.endpoint,
          keys: { p256dh: s.p256dh, auth: s.auth },
        } as unknown);
      try {
        await webpush.sendNotification(
          sub as { endpoint: string; keys: { auth: string; p256dh: string } },
          body,
        );
        succeeded++;
        await admin
          .from("push_subscriptions")
          .update({
            last_success_at: new Date().toISOString(),
            failure_count: 0,
          })
          .eq("id", s.id);
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 410 || statusCode === 404) {
          staleIds.push(s.id as string);
        } else {
          await admin
            .from("push_subscriptions")
            .update({
              last_error_at: new Date().toISOString(),
              failure_count: 1,
            })
            .eq("id", s.id);
        }
      }
    }),
  );

  if (staleIds.length > 0) {
    await admin
      .from("push_subscriptions")
      .update({ is_active: false })
      .in("id", staleIds);
  }

  return {
    pushed: succeeded > 0,
    attempted: active.length,
    succeeded,
    stale: staleIds.length,
  };
}
