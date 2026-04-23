import { createAdminClient } from "./supabase/admin";
import type { OrderStatus } from "./constants";
import {
  buildContext,
  renderTemplate,
  TEMPLATE_META,
  type TemplateKey,
} from "./smsTemplates";
import { logSms } from "./smsLogging";

type OrderForSms = {
  id: string;
  restaurant_id?: string;
  order_number: string;
  customer_name?: string | null;
  customer_phone: string;
  total_amount: number | string;
  requested_pickup_time: string | null;
  cancellation_reason?: string | null;
};

export type SmsResult =
  | { success: true; reference: string | null }
  | { success: false; error: string; status?: number }
  | { success: false; skipped: true; reason: string };

/**
 * Normalise au format Brevo (E.164 sans "+"). Gère CH + FR + international
 * via libphonenumber-js.
 */
import { toBrevoPhone } from "./phone";

export function normalizePhone(raw: string): string {
  return toBrevoPhone(raw);
}

const STATUS_TO_KEY: Partial<Record<OrderStatus, TemplateKey>> = {
  accepted: "order_accepted",
  preparing: "order_preparing",
  ready: "order_ready",
  cancelled: "order_cancelled",
};

const BREVO_URL = "https://api.brevo.com/v3/transactionalSMS/sms";
const PRIMARY_SENDER = "Rialto";
const FALLBACK_SENDER = "Stampify"; // sender pré-validé Brevo, fonctionne FR+CH

/**
 * Brevo bloque les envois vers la France avec un sender alphanumérique
 * non pré-enregistré (règle depuis 2023). On détecte ces cas côté HTTP
 * et on retente avec un sender fallback "Stampify" qui est déjà validé.
 */
function shouldRetryWithFallback(status: number, data: Record<string, unknown>): boolean {
  if (status !== 400 && status !== 403) return false;
  const msg = JSON.stringify(data).toLowerCase();
  return (
    msg.includes("sender") ||
    msg.includes("expediteur") ||
    msg.includes("unauthorized") ||
    msg.includes("not allowed")
  );
}

/**
 * Envoie un SMS de transition de statut en utilisant le template personnalisé
 * stocké dans `sms_templates`. Retry 3× avec backoff. Si le template est
 * absent ou désactivé → skip (success:false, skipped:true).
 */
export async function sendOrderStatusSms(
  order: OrderForSms,
  newStatus: OrderStatus,
): Promise<SmsResult> {
  const key = STATUS_TO_KEY[newStatus];
  if (!key) return { success: false, error: `no template for ${newStatus}` };
  return sendTemplated(order, key);
}

export async function sendOrderConfirmationSms(
  order: OrderForSms,
): Promise<SmsResult> {
  return sendTemplated(order, "order_confirmation");
}

/** Coeur de l'envoi templaté. */
async function sendTemplated(
  order: OrderForSms,
  key: TemplateKey,
): Promise<SmsResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("[SMS] BREVO_API_KEY missing");
    return { success: false, error: "BREVO_API_KEY not set" };
  }

  const admin = createAdminClient();

  // 1. Récupère le restaurant + template
  const restaurantId = order.restaurant_id;
  if (!restaurantId) {
    // Fallback : on va chercher via orders
    const { data: o } = await admin
      .from("orders")
      .select("restaurant_id")
      .eq("id", order.id)
      .single();
    if (!o) return { success: false, error: "restaurant inconnu" };
    order.restaurant_id = o.restaurant_id as string;
  }

  const [{ data: restaurant }, { data: template }] = await Promise.all([
    admin
      .from("restaurants")
      .select("name, phone, address")
      .eq("id", order.restaurant_id!)
      .single(),
    admin
      .from("sms_templates")
      .select("content, enabled")
      .eq("restaurant_id", order.restaurant_id!)
      .eq("template_key", key)
      .maybeSingle(),
  ]);

  if (!restaurant) return { success: false, error: "restaurant introuvable" };

  const tmpl = template ?? {
    content: TEMPLATE_META[key].defaultContent,
    enabled: true,
  };

  if (!tmpl.enabled) {
    console.log("[SMS] template disabled, skipping", {
      orderId: order.id,
      key,
    });
    return { success: false, skipped: true, reason: "template disabled" };
  }

  const ctx = buildContext({
    order: {
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name ?? null,
      customer_phone: order.customer_phone,
      total_amount: order.total_amount,
      requested_pickup_time: order.requested_pickup_time,
      cancellation_reason: order.cancellation_reason ?? null,
    },
    restaurant: {
      name: restaurant.name,
      phone: restaurant.phone,
      address: restaurant.address,
    },
    siteUrl:
      process.env.NEXT_PUBLIC_RIALTO_BASE_URL ??
      process.env.NEXT_PUBLIC_RIALTO_URL ??
      "https://rialto-lausanne.vercel.app",
  });

  const content = renderTemplate(tmpl.content, ctx);
  const phone = normalizePhone(order.customer_phone);

  const isFrench = phone.startsWith("33");
  if (isFrench) {
    console.log(
      "[SMS] FR number detected — sender Rialto may be rejected by Brevo. Will fallback to Stampify if needed.",
      { orderId: order.id, phoneNorm: phone },
    );
  }

  const sendersToTry = [PRIMARY_SENDER, FALLBACK_SENDER];
  let currentSender = sendersToTry[0];

  const makeBody = (sender: string) =>
    JSON.stringify({
      sender,
      recipient: phone,
      content,
      type: "transactional",
    });

  console.log("[SMS] sending", {
    orderId: order.id,
    orderNumber: order.order_number,
    templateKey: key,
    phoneNorm: phone,
    length: content.length,
    sender: currentSender,
  });

  let lastError = "unknown";
  let lastStatus: number | undefined;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(BREVO_URL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": apiKey,
        },
        body: makeBody(currentSender),
      });
      const raw = await res.text();
      let data: Record<string, unknown> = {};
      try {
        data = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      } catch {
        data = { rawBody: raw };
      }

      if (res.ok) {
        const reference = (data.reference as string | undefined) ?? null;
        console.log("[SMS] SUCCESS", {
          orderId: order.id,
          orderNumber: order.order_number,
          templateKey: key,
          reference,
          attempt,
          httpStatus: res.status,
          sender: currentSender,
        });
        // Phase 11 C3 : log SMS réussi
        await logSms({
          restaurant_id: order.restaurant_id ?? null,
          phone,
          template_key: key,
          sender_used: currentSender,
          content,
          status: "sent",
          brevo_message_id: reference,
          order_id: order.id,
          context_meta: { order_number: order.order_number, attempt },
        });
        return { success: true, reference };
      }

      lastError = (data.message as string) ?? (data.code as string) ?? raw;
      lastStatus = res.status;

      console.error("[SMS] Brevo error", {
        orderId: order.id,
        templateKey: key,
        attempt,
        httpStatus: res.status,
        sender: currentSender,
        data,
      });

      // Fallback sender si Brevo refuse "Rialto" (typique FR)
      if (
        currentSender === PRIMARY_SENDER &&
        shouldRetryWithFallback(res.status, data)
      ) {
        console.warn(
          "[SMS] Brevo a refusé le sender 'Rialto' — retry avec 'Stampify'",
          { orderId: order.id, phone },
        );
        currentSender = FALLBACK_SENDER;
        continue; // on retente immédiatement avec le nouveau sender
      }

      if (res.status >= 400 && res.status < 500) {
        await logSms({
          restaurant_id: order.restaurant_id ?? null,
          phone,
          template_key: key,
          sender_used: currentSender,
          content,
          status: "failed",
          error_message: `${res.status} ${lastError}`,
          order_id: order.id,
          context_meta: { order_number: order.order_number, attempt },
        });
        return { success: false, error: lastError, status: res.status };
      }
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.error("[SMS] Fetch exception", {
        orderId: order.id,
        templateKey: key,
        attempt,
        err: lastError,
      });
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }

  // 3 attempts épuisés → log l'échec
  await logSms({
    restaurant_id: order.restaurant_id ?? null,
    phone,
    template_key: key,
    sender_used: currentSender,
    content,
    status: "failed",
    error_message: `${lastStatus ?? "?"} ${lastError} (3 retries)`,
    order_id: order.id,
    context_meta: { order_number: order.order_number },
  });
  return { success: false, error: lastError, status: lastStatus };
}
