/**
 * Helper : génération auto d'un ticket de loterie (Phase 10 refonte).
 *
 * Changements vs Phase 7 :
 *   - generateTicketForOrder prend désormais UN orderId (string) et
 *     fetche l'order lui-même → plus simple à appeler et plus safe.
 *   - Retourne un résultat structuré avec `reason` si échec pour
 *     diagnostic (order_not_found / no_business / no_active_lottery /
 *     insert_failed / exception).
 *   - Idempotence par `order_id` (colonne + unique index partiel
 *     ajoutés dans la migration lottery_entries_order_id_idempotence).
 *   - Si `customer_id` absent sur l'order, fallback lookup par phone
 *     avec phoneLookupVariants (tolérant aux formats mixtes en DB).
 *   - Logs structurés `[lottery-ticket]` à chaque étape pour tracer
 *     les échecs silencieux constatés en Phase 9 (5 commandes acceptées
 *     mais 0 ticket créé).
 *   - SMS `lottery_ticket_received` fire-and-forget isolé dans
 *     sendLotteryTicketSms.
 */
import { createAdminClient } from "./supabase/admin";
import { phoneLookupVariants } from "./phoneVariants";
import { renderTemplate, TEMPLATE_META } from "./smsTemplates";
import { sendSms } from "./brevo";

export type TicketResult =
  | { ok: true; entry_id: string; ticket_number: number; reason?: string }
  | { ok: false; reason: string };

function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "(null)";
  if (phone.length < 6) return phone;
  return phone.slice(0, 4) + "***" + phone.slice(-2);
}

/**
 * Envoie le SMS lottery_ticket_received au client. Cascade sender
 * Rialto → Stampify fallback. Fire-and-forget côté appelant.
 */
async function sendLotteryTicketSms(params: {
  restaurantId: string;
  customerPhone: string;
  customerName: string;
  ticketNumber: number;
  lotteryTitle: string;
}): Promise<void> {
  const {
    restaurantId,
    customerPhone,
    customerName,
    ticketNumber,
    lotteryTitle,
  } = params;

  const admin = createAdminClient();

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
              "🎟️ {{customer_name}}, ton ticket de loterie Rialto : n°{{ticket_number}}. Bonne chance !",
            enabled: true,
          };

    if (!effective.enabled) {
      console.log("[sms-lottery-ticket] template disabled, skipping");
      return;
    }

    const content = renderTemplate(effective.content, {
      customer_name: customerName,
      ticket_number: String(ticketNumber),
      lottery_name: lotteryTitle,
    });

    console.log("[sms-lottery-ticket] sending", {
      masked_phone: maskPhone(customerPhone),
      ticket_number: ticketNumber,
      content_length: content.length,
    });

    try {
      await sendSms(customerPhone, content, "Rialto");
      console.log("[sms-lottery-ticket] success sender=Rialto", {
        masked_phone: maskPhone(customerPhone),
        ticket_number: ticketNumber,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("sender") || msg.includes("400")) {
        console.warn("[sms-lottery-ticket] Rialto rejected, retry Stampify", {
          err_msg: msg.slice(0, 200),
        });
        await sendSms(customerPhone, content, "Stampify");
        console.log("[sms-lottery-ticket] success sender=Stampify");
      } else {
        throw err;
      }
    }
  } catch (err) {
    const err_any = err as {
      message?: string;
      response?: { status?: number; data?: { code?: string; message?: string } };
    };
    console.error("[sms-lottery-ticket] failed", {
      provider: "brevo",
      error_message: err_any?.message,
      brevo_code: err_any?.response?.data?.code,
      brevo_message: err_any?.response?.data?.message,
      brevo_status: err_any?.response?.status,
      recipient_masked: maskPhone(customerPhone),
      template_key: "lottery_ticket_received",
      timestamp: new Date().toISOString(),
    });
    if (
      err_any?.response?.status === 402 ||
      err_any?.response?.data?.code?.includes("credit") ||
      err_any?.response?.data?.message?.toLowerCase().includes("credits")
    ) {
      console.error(
        "[sms-lottery-ticket] ⚠️ BREVO SMS CREDITS EXHAUSTED — recharge needed at app.brevo.com",
      );
    }
  }
}

/**
 * Génère un ticket de loterie pour une commande (déclenché sur
 * status=accepted dans PATCH /api/orders/[id]).
 *
 * Safe à appeler plusieurs fois sur la même commande :
 *   - Idempotent via (lottery_id, order_id) unique
 *   - Retourne already_exists si déjà présent
 *
 * Non-bloquant côté appelant : toujours retourne un résultat, jamais
 * ne throw. Les erreurs sont loggées dans la console Vercel.
 */
export async function generateTicketForOrder(
  orderId: string,
): Promise<TicketResult> {
  console.log("[lottery-ticket] START", { orderId });

  try {
    const admin = createAdminClient();

    // 1. Fetch order
    const { data: order, error: orderErr } = await admin
      .from("orders")
      .select(
        "id, order_number, restaurant_id, customer_id, customer_phone, customer_name, status",
      )
      .eq("id", orderId)
      .single();

    if (orderErr || !order) {
      console.error("[lottery-ticket] order not found", {
        orderId,
        error: orderErr?.message,
      });
      return { ok: false, reason: "order_not_found" };
    }

    console.log("[lottery-ticket] order fetched", {
      orderNumber: order.order_number,
      customerId: order.customer_id,
      masked_phone: maskPhone(order.customer_phone),
      status: order.status,
    });

    // 2. Fetch business_id via restaurant
    const { data: restaurant } = await admin
      .from("restaurants")
      .select("business_id")
      .eq("id", order.restaurant_id)
      .single();

    if (!restaurant?.business_id) {
      console.error("[lottery-ticket] no business for restaurant", {
        restaurantId: order.restaurant_id,
      });
      return { ok: false, reason: "no_business" };
    }

    const businessId = restaurant.business_id as string;
    console.log("[lottery-ticket] business resolved", { businessId });

    // 3. Fetch active lottery (is_active=true, pas encore tirée si la
    // colonne is_drawn existe)
    const { data: lottery } = await admin
      .from("lotteries")
      .select("id, title, prize_description, is_active, is_drawn")
      .eq("business_id", businessId)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Si is_drawn est true, la loterie est déjà clôturée
    if (
      !lottery ||
      (lottery as { is_drawn?: boolean }).is_drawn === true
    ) {
      console.log(
        "[lottery-ticket] no active lottery for business, skipping",
        { businessId },
      );
      return { ok: false, reason: "no_active_lottery" };
    }

    console.log("[lottery-ticket] active lottery", {
      lotteryId: lottery.id,
      title: lottery.title,
    });

    // 4. Check idempotence par order_id
    const { data: existing } = await admin
      .from("lottery_entries")
      .select("id, ticket_number")
      .eq("lottery_id", lottery.id)
      .eq("order_id", orderId)
      .maybeSingle();

    if (existing) {
      console.log("[lottery-ticket] entry already exists, skipping", {
        entryId: existing.id,
        ticketNumber: existing.ticket_number,
      });
      return {
        ok: true,
        entry_id: existing.id as string,
        ticket_number: Number(existing.ticket_number),
        reason: "already_exists",
      };
    }

    // 5. Résoudre customer si null (fallback lookup par phone)
    let customerId: string | null = order.customer_id as string | null;
    let firstName = (order.customer_name as string | null) ?? "";

    if (!customerId && order.customer_phone) {
      console.log("[lottery-ticket] lookup customer by phone (fallback)", {
        masked_phone: maskPhone(order.customer_phone),
      });

      const variants = phoneLookupVariants(order.customer_phone as string);
      const { data: foundCustomer } = await admin
        .from("customers")
        .select("id, first_name, phone")
        .in("phone", variants.variants)
        .limit(1)
        .maybeSingle();

      if (foundCustomer) {
        customerId = foundCustomer.id as string;
        firstName = (foundCustomer.first_name as string) || firstName;
        console.log("[lottery-ticket] customer found via phone variants", {
          customerId,
        });
      } else if (variants.digitsOnly.length >= 8) {
        // Dernier recours : full scan + filter digits-suffix
        const suffix = variants.digitsOnly.slice(-8);
        const { data: allCustomers } = await admin
          .from("customers")
          .select("id, first_name, phone");
        const match = ((allCustomers as Array<{
          id: string;
          first_name: string;
          phone: string | null;
        }> | null) ?? []).find((c) => {
          const d = (c.phone ?? "").replace(/[^\d]/g, "");
          return d.length >= 8 && d.endsWith(suffix);
        });
        if (match) {
          customerId = match.id;
          firstName = match.first_name || firstName;
          console.log(
            "[lottery-ticket] customer found via digits-suffix fallback",
            { customerId },
          );
        } else {
          console.log(
            "[lottery-ticket] no customer found, ticket will have customer_id=null",
          );
        }
      }
    }

    // 6. Next ticket_number (séquentiel par loterie)
    const { data: maxResult } = await admin
      .from("lottery_entries")
      .select("ticket_number")
      .eq("lottery_id", lottery.id)
      .order("ticket_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    const currentMax = Number(maxResult?.ticket_number ?? 0);
    const nextTicketNumber = (isFinite(currentMax) ? currentMax : 0) + 1;
    console.log("[lottery-ticket] next ticket_number", {
      nextTicketNumber,
      currentMax,
    });

    // 7. INSERT entry
    const { data: newEntry, error: insertErr } = await admin
      .from("lottery_entries")
      .insert({
        lottery_id: lottery.id,
        customer_id: customerId,
        phone: order.customer_phone,
        first_name: firstName || "Client",
        ticket_number: nextTicketNumber,
        order_id: orderId,
        google_review_verified: false,
        is_winner: false,
      })
      .select("id")
      .single();

    if (insertErr || !newEntry) {
      console.error("[lottery-ticket] INSERT failed", {
        error_message: insertErr?.message,
        error_code: insertErr?.code,
        error_details: insertErr?.details,
      });
      return { ok: false, reason: "insert_failed" };
    }

    console.log("[lottery-ticket] ✅ SUCCESS", {
      entryId: newEntry.id,
      ticketNumber: nextTicketNumber,
      orderNumber: order.order_number,
    });

    // 8. SMS fire-and-forget (ne bloque pas le résultat)
    if (order.customer_phone) {
      void sendLotteryTicketSms({
        restaurantId: order.restaurant_id as string,
        customerPhone: order.customer_phone as string,
        customerName: firstName || "Client",
        ticketNumber: nextTicketNumber,
        lotteryTitle:
          (lottery.title as string) ??
          (lottery.prize_description as string) ??
          "Loterie Rialto",
      });
    }

    return {
      ok: true,
      entry_id: newEntry.id as string,
      ticket_number: nextTicketNumber,
    };
  } catch (err) {
    const err_any = err as { message?: string; stack?: string };
    console.error("[lottery-ticket] TOP-LEVEL ERROR", {
      orderId,
      message: err_any?.message,
      stack: err_any?.stack?.slice(0, 500),
    });
    return { ok: false, reason: "exception" };
  }
}
