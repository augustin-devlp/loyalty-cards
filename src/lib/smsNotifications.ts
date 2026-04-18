import { formatZurichHHMM } from "./orderFormat";
import type { OrderStatus } from "./constants";

type OrderForSms = {
  id?: string;
  order_number: string;
  customer_phone: string;
  total_amount: number | string;
  requested_pickup_time: string | null;
};

export type SmsResult =
  | { success: true; reference: string | null }
  | { success: false; error: string; status?: number };

/**
 * Normalise un numéro de téléphone suisse (ou international) au format
 * Brevo E.164 sans le "+" (ex. "41791234567").
 *
 * Règles :
 *  - Retire espaces, tirets, parenthèses, points
 *  - "+41..." → "41..."
 *  - "0041..." → "41..."
 *  - "0..." suisse (9 chiffres après le 0) → "41..."
 *  - "41..." sans préfixe → "41..." (tel quel)
 *  - Autres cas déjà internationaux → tel quel sans le "+"
 */
export function normalizePhone(raw: string): string {
  let n = raw.replace(/[\s\-().]/g, "");
  if (n.startsWith("+")) return n.slice(1);
  if (n.startsWith("00")) return n.slice(2);
  // "0" puis 9 chiffres = local suisse (ex: 0791234567)
  if (/^0[1-9]\d{8}$/.test(n)) return "41" + n.slice(1);
  // "0" puis longueur plus courte = erreur probable, on laisse passer
  if (n.startsWith("0")) return "41" + n.slice(1);
  return n;
}

function buildMessage(order: OrderForSms, newStatus: OrderStatus): string | null {
  const pickup = formatZurichHHMM(order.requested_pickup_time);
  const totalStr = `${Number(order.total_amount).toFixed(2)} CHF`;
  switch (newStatus) {
    case "accepted":
      return `Rialto a accepté votre commande #${order.order_number}. Préparation en cours. Prête vers ${pickup}. Avenue de Béthusy 29, Lausanne.`;
    case "preparing":
      return `Votre commande Rialto #${order.order_number} est en préparation. On vous prévient dès qu'elle est prête.`;
    case "ready":
      return `Votre commande Rialto #${order.order_number} est prête ! Vous pouvez venir la récupérer. Montant : ${totalStr} à régler sur place (espèces ou TWINT). Avenue de Béthusy 29, Lausanne. 021 312 64 60`;
    case "cancelled":
      return `Votre commande Rialto #${order.order_number} a été annulée. Pour toute question, contactez-nous au 021 312 64 60.`;
    default:
      return null;
  }
}

const BREVO_URL = "https://api.brevo.com/v3/transactionalSMS/sms";
const SENDER = "Rialto"; // 6 chars, sous la limite 11 alphanum de Brevo

/**
 * Envoie un SMS de transition de statut. Retry 3× avec backoff (1s / 2s / 4s)
 * sur les erreurs 5xx et réseau. Retourne success + reference en cas de
 * succès, ou success=false + error en cas d'échec définitif.
 *
 * À appeler **avec await** depuis l'API route pour que le retour contienne
 * le statut du SMS (permettant à l'UI dashboard d'afficher ✓ / ✗).
 */
export async function sendOrderStatusSms(
  order: OrderForSms,
  newStatus: OrderStatus,
): Promise<SmsResult> {
  const content = buildMessage(order, newStatus);
  if (!content) {
    return { success: false, error: `Pas de SMS pour status=${newStatus}` };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("[SMS] BREVO_API_KEY missing — SMS non envoyé", {
      orderId: order.id,
      status: newStatus,
    });
    return { success: false, error: "BREVO_API_KEY not set" };
  }

  const phone = normalizePhone(order.customer_phone);
  const bodyStr = JSON.stringify({
    sender: SENDER,
    recipient: phone,
    content,
    type: "transactional",
  });

  console.log("[SMS] sending", {
    orderId: order.id,
    orderNumber: order.order_number,
    status: newStatus,
    phoneRaw: order.customer_phone,
    phoneNorm: phone,
    length: content.length,
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
        body: bodyStr,
      });

      // Brevo peut renvoyer du texte au lieu de JSON en cas d'erreur — safe parse
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
          status: newStatus,
          attempt,
          reference,
          httpStatus: res.status,
        });
        return { success: true, reference };
      }

      lastError = (data.message as string) ?? (data.code as string) ?? raw;
      lastStatus = res.status;

      console.error("[SMS] Brevo error", {
        orderId: order.id,
        orderNumber: order.order_number,
        status: newStatus,
        attempt,
        httpStatus: res.status,
        data,
      });

      // 4xx → pas de retry (client error, ex: numéro invalide, blocked, etc.)
      if (res.status >= 400 && res.status < 500) {
        return {
          success: false,
          error: lastError,
          status: res.status,
        };
      }

      // 5xx → attendre et retry
      if (attempt < 3) {
        const waitMs = 1000 * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, waitMs));
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.error("[SMS] Fetch exception", {
        orderId: order.id,
        orderNumber: order.order_number,
        status: newStatus,
        attempt,
        err: lastError,
      });
      if (attempt < 3) {
        const waitMs = 1000 * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  }

  return { success: false, error: lastError, status: lastStatus };
}
