/**
 * Helper : génération auto d'un ticket de loterie quand une commande
 * est ACCEPTÉE par le restaurant (Phase 7 FIX 7).
 *
 * Décision business (Augustin) : obtenir un ticket de loterie se fait
 * en passant une commande (pas en laissant un avis Google). Déclenché
 * depuis PATCH /api/orders/[id] côté loyalty-cards quand status passe
 * à 'accepted'.
 *
 * Règle : 1 ticket par commande acceptée, par customer, par loterie
 * active. Idempotent : si une entry existe déjà (customer + lottery),
 * on ne recrée rien.
 */
import { createAdminClient } from "./supabase/admin";
import { renderTemplate, TEMPLATE_META } from "./smsTemplates";
import { sendSms } from "./brevo";

type Order = {
  id: string;
  restaurant_id: string;
  customer_id: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
};

type LotteryActive = {
  id: string;
  name: string | null;
  title?: string | null;
  prize_description: string | null;
  draw_date: string | null;
  is_active: boolean;
  is_drawn?: boolean | null;
};

/**
 * Pour un business_id donné, cherche la loterie active en cours (non
 * tirée, date de tirage dans le futur ou NULL).
 */
async function findActiveLottery(
  admin: ReturnType<typeof createAdminClient>,
  businessId: string,
): Promise<LotteryActive | null> {
  const nowIso = new Date().toISOString();
  const { data } = await admin
    .from("lotteries")
    .select(
      "id, name, title, prize_description, draw_date, is_active, is_drawn",
    )
    .eq("business_id", businessId)
    .eq("is_active", true)
    .or(`is_drawn.is.null,is_drawn.eq.false`)
    .or(`draw_date.is.null,draw_date.gte.${nowIso}`)
    .order("created_at", { ascending: false })
    .limit(1);

  return (data?.[0] as LotteryActive | undefined) ?? null;
}

/**
 * Détermine le restaurant_id du business Rialto (1:1 pour l'instant).
 * Pour généraliser plus tard : fetch depuis la DB.
 */
function restaurantToBusinessId(restaurantId: string): string | null {
  // Hardcoded Rialto — 046d930d-... (restaurant) ↔ 59b10af2-... (business)
  if (restaurantId === "046d930d-a4cd-4a43-a11a-7f76bfe74b06") {
    return "59b10af2-5dbc-4ddd-a659-c49f44804bff";
  }
  return null;
}

/**
 * Envoie un SMS de confirmation de ticket au client (fire-and-forget).
 */
async function notifyTicketReceived(params: {
  admin: ReturnType<typeof createAdminClient>;
  restaurantId: string;
  phone: string;
  firstName: string;
  ticketNumber: number;
  lotteryName: string;
}): Promise<void> {
  const { admin, restaurantId, phone, firstName, ticketNumber, lotteryName } =
    params;
  try {
    const { data: tmpl } = await admin
      .from("sms_templates")
      .select("content, enabled")
      .eq("restaurant_id", restaurantId)
      .eq("template_key", "lottery_ticket_received")
      .maybeSingle();

    const effective =
      tmpl && tmpl.enabled !== false
        ? tmpl
        : {
            content:
              TEMPLATE_META.lottery_ticket_received?.defaultContent ??
              "🎟️ Ton ticket de loterie Rialto : n°{{ticket_number}}. Tirage bientôt, bonne chance {{customer_name}} !",
            enabled: true,
          };

    if (!effective.enabled) return;

    const content = renderTemplate(effective.content, {
      customer_name: firstName,
      ticket_number: String(ticketNumber),
      lottery_name: lotteryName,
    });

    try {
      await sendSms(phone, content, "Rialto");
      console.log("[lottery-ticket-sms] success sender=Rialto", {
        phone,
        ticketNumber,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("sender") || msg.includes("400")) {
        await sendSms(phone, content, "Stampify");
      }
    }
  } catch (err) {
    console.error("[lottery-ticket-sms] failed (non-blocking)", err);
  }
}

/**
 * Génère un ticket de loterie pour la commande acceptée.
 * Idempotent : ne crée rien si le customer a déjà un ticket pour la
 * loterie active en cours.
 *
 * @returns le ticket créé, null si aucune loterie active OU déjà inscrit
 */
export async function generateTicketForOrder(
  order: Order,
): Promise<{
  created: boolean;
  lottery_id?: string;
  ticket_number?: number;
  already_has?: boolean;
}> {
  if (!order.customer_id || !order.customer_phone) {
    return { created: false };
  }

  const businessId = restaurantToBusinessId(order.restaurant_id);
  if (!businessId) {
    console.log("[lottery-ticket] no business mapping for", order.restaurant_id);
    return { created: false };
  }

  const admin = createAdminClient();
  const lottery = await findActiveLottery(admin, businessId);
  if (!lottery) {
    console.log("[lottery-ticket] no active lottery for", businessId);
    return { created: false };
  }

  // Check si le customer a déjà un ticket pour cette loterie (idempotence)
  const { data: existing } = await admin
    .from("lottery_entries")
    .select("id, ticket_number")
    .eq("lottery_id", lottery.id)
    .eq("customer_id", order.customer_id)
    .limit(1)
    .maybeSingle();

  if (existing) {
    console.log("[lottery-ticket] customer already has ticket", {
      customer_id: order.customer_id,
      lottery_id: lottery.id,
      ticket_number: existing.ticket_number,
    });
    return {
      created: false,
      already_has: true,
      lottery_id: lottery.id,
      ticket_number: (existing.ticket_number as number) ?? undefined,
    };
  }

  // Insert — ticket_number est auto-incrémenté via trigger DB (Phase 6)
  const { data: inserted, error } = await admin
    .from("lottery_entries")
    .insert({
      lottery_id: lottery.id,
      customer_id: order.customer_id,
      phone: order.customer_phone,
      first_name: order.customer_name?.split(" ")[0] ?? "Client",
    })
    .select("id, ticket_number")
    .single();

  if (error || !inserted) {
    console.error("[lottery-ticket] insert failed", error);
    return { created: false };
  }

  const ticketNumber = Number(inserted.ticket_number ?? 0);
  console.log("[lottery-ticket] ✅ ticket issued", {
    customer_id: order.customer_id,
    lottery_id: lottery.id,
    ticket_number: ticketNumber,
  });

  // SMS fire-and-forget
  void notifyTicketReceived({
    admin,
    restaurantId: order.restaurant_id,
    phone: order.customer_phone,
    firstName: order.customer_name?.split(" ")[0] ?? "Client",
    ticketNumber,
    lotteryName:
      (lottery.name as string) ??
      (lottery.title as string) ??
      "Loterie Rialto",
  });

  return {
    created: true,
    lottery_id: lottery.id,
    ticket_number: ticketNumber,
  };
}
