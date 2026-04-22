/**
 * Helper pour envoyer un SMS batch à tous les membres Rialto Club
 * (= tous les customers avec une customer_card pour le business).
 *
 * Gère :
 * - Rate limit : max 10 SMS/seconde (respect API Brevo)
 * - Cascade sender : essaie "Rialto" d'abord, bascule "Stampify"
 *   si Brevo refuse (typique France)
 * - Dedup par phone normalisé (E.164)
 * - Logs structurés [notify-all] pour audit Vercel
 * - Rendu du template via renderTemplate (variables partagées)
 */
import { createAdminClient } from "./supabase/admin";
import { renderTemplate, TEMPLATE_META, type TemplateKey, type TemplateContext } from "./smsTemplates";
import { sendSms } from "./brevo";

export type BatchResult = {
  total_targeted: number;
  sent: number;
  failed: number;
  skipped: number;
  errors: Array<{ phone: string; error: string }>;
};

export async function notifyAllClubMembers(params: {
  business_id: string;
  restaurant_id: string;
  card_id: string;
  template_key: TemplateKey;
  context_builder: (customer: {
    id: string;
    first_name: string | null;
    phone: string;
  }) => TemplateContext;
  /** Filtre optionnel : customer_ids à exclure (ex: le gagnant d'une loterie
   * reçoit lottery_result_winner pas lottery_result_loser) */
  exclude_customer_ids?: string[];
}): Promise<BatchResult> {
  const admin = createAdminClient();
  const excludeSet = new Set(params.exclude_customer_ids ?? []);

  // 1) Récupère le template
  const { data: tmpl } = await admin
    .from("sms_templates")
    .select("content, enabled")
    .eq("restaurant_id", params.restaurant_id)
    .eq("template_key", params.template_key)
    .maybeSingle();

  const effective =
    tmpl && tmpl.enabled !== false
      ? tmpl
      : TEMPLATE_META[params.template_key]
        ? {
            content: TEMPLATE_META[params.template_key].defaultContent,
            enabled: true,
          }
        : null;

  if (!effective || !effective.enabled) {
    console.warn(
      `[notify-all] template ${params.template_key} introuvable ou désactivé`,
    );
    return {
      total_targeted: 0,
      sent: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    };
  }

  // 2) Liste tous les customers avec une carte pour ce business
  const { data: cards, error: cardsErr } = await admin
    .from("customer_cards")
    .select(
      "customer_id, customers!inner (id, first_name, phone)",
    )
    .eq("card_id", params.card_id);

  if (cardsErr || !cards) {
    console.error("[notify-all] fetch cards failed", cardsErr);
    return {
      total_targeted: 0,
      sent: 0,
      failed: 0,
      skipped: 0,
      errors: [{ phone: "all", error: cardsErr?.message ?? "unknown" }],
    };
  }

  // Dedup par phone normalisé
  const seen = new Set<string>();
  const targets: Array<{ id: string; first_name: string | null; phone: string }> =
    [];

  for (const row of cards) {
    const customer = Array.isArray(row.customers)
      ? row.customers[0]
      : row.customers;
    if (!customer) continue;
    const id = customer.id as string;
    if (excludeSet.has(id)) continue;
    const phone = customer.phone as string | null;
    if (!phone || seen.has(phone)) continue;
    seen.add(phone);
    targets.push({
      id,
      first_name: (customer.first_name as string | null) ?? "",
      phone,
    });
  }

  console.log(
    `[notify-all] template=${params.template_key} targets=${targets.length}`,
  );

  const result: BatchResult = {
    total_targeted: targets.length,
    sent: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  // 3) Envoi throttled (10 SMS/s max = 100ms entre)
  for (const target of targets) {
    const ctx = params.context_builder(target);
    const content = renderTemplate(effective.content, ctx);

    try {
      try {
        await sendSms(target.phone, content, "Rialto");
        result.sent += 1;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.toLowerCase().includes("sender") || msg.includes("400")) {
          await sendSms(target.phone, content, "Stampify");
          result.sent += 1;
        } else {
          throw err;
        }
      }
    } catch (err) {
      result.failed += 1;
      result.errors.push({
        phone: target.phone,
        error: err instanceof Error ? err.message : String(err),
      });
      console.error(`[notify-all] failed phone=${target.phone}`, err);
    }

    // Throttle 100ms = 10 SMS/s
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(
    `[notify-all] DONE template=${params.template_key} sent=${result.sent} failed=${result.failed}`,
  );
  return result;
}
