import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Helper de journalisation SMS (Phase 11 C3).
 *
 * Écrit une ligne dans public.sms_logs après chaque envoi (succès ou
 * échec). Le coût `cost_credits` est estimé : 1 SMS normal = 1 crédit
 * si <= 160 chars, 2 crédits sinon (concaténation 153 chars chacun).
 */
export type SmsLogStatus = "sent" | "failed" | "queued";

export type SmsLogPayload = {
  restaurant_id?: string | null;
  customer_id?: string | null;
  phone: string;
  template_key?: string | null;
  sender_used?: string | null;
  content: string;
  status: SmsLogStatus;
  brevo_message_id?: string | null;
  error_message?: string | null;
  order_id?: string | null;
  context_meta?: Record<string, unknown> | null;
};

function estimateCostCredits(content: string): number {
  const len = content.length;
  if (len === 0) return 0;
  if (len <= 160) return 1;
  return Math.ceil(len / 153);
}

export async function logSms(payload: SmsLogPayload): Promise<void> {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("sms_logs").insert({
      restaurant_id: payload.restaurant_id ?? null,
      customer_id: payload.customer_id ?? null,
      phone: payload.phone,
      template_key: payload.template_key ?? null,
      sender_used: payload.sender_used ?? null,
      content: payload.content,
      status: payload.status,
      brevo_message_id: payload.brevo_message_id ?? null,
      error_message: payload.error_message ?? null,
      cost_credits: estimateCostCredits(payload.content),
      order_id: payload.order_id ?? null,
      context_meta: payload.context_meta ?? null,
    });
    if (error) console.error("[sms-log] insert failed", error.message);
  } catch (err) {
    console.error("[sms-log] unexpected", err);
  }
}
