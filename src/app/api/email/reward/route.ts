import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/brevo";

export async function POST(req: NextRequest) {
  const { customer_card_id } = await req.json() as { customer_card_id: string };
  if (!customer_card_id) return NextResponse.json({ ok: false });

  const supabase = await createClient();
  const { data } = await supabase
    .from("customer_cards")
    .select(`
      id,
      customers ( first_name, email ),
      loyalty_cards (
        card_name,
        reward_description,
        businesses ( business_name, plan, subscription_status )
      )
    `)
    .eq("id", customer_card_id)
    .single();

  if (!data) return NextResponse.json({ ok: false });

  const customer = data.customers as unknown as { first_name: string; email: string };
  const lc = data.loyalty_cards as unknown as {
    card_name: string;
    reward_description: string;
    businesses: { business_name: string; plan: string; subscription_status: string } | null;
  };

  const biz = lc.businesses;
  if (!biz || biz.plan !== "pro" || biz.subscription_status !== "active") {
    return NextResponse.json({ ok: false, reason: "not pro" });
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:#534AB7;padding:24px 32px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="background:rgba(255,255,255,0.2);border-radius:10px;width:40px;height:40px;text-align:center;vertical-align:middle;">
              <span style="color:#fff;font-size:22px;font-weight:900;">S</span>
            </td>
            <td style="padding-left:12px;color:#fff;font-size:20px;font-weight:700;">Stampify</td>
          </tr></table>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;text-align:center;">
          <div style="font-size:56px;margin-bottom:16px;">🎉</div>
          <h1 style="margin:0 0 8px;font-size:22px;color:#111827;">Votre récompense est disponible !</h1>
          <p style="margin:0 0 20px;color:#6b7280;font-size:14px;line-height:1.6;">
            Félicitations <strong style="color:#111827;">${customer.first_name}</strong> !<br>
            Vous avez cumulé suffisamment de tampons chez <strong style="color:#111827;">${biz.business_name}</strong>.
          </p>
          <div style="background:#fefce8;border:2px solid #fde047;border-radius:12px;padding:20px 24px;margin-bottom:24px;display:inline-block;width:100%;box-sizing:border-box;">
            <p style="margin:0 0 4px;font-size:12px;color:#92400e;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Votre récompense</p>
            <p style="margin:0;font-size:18px;font-weight:800;color:#78350f;">🎁 ${lc.reward_description}</p>
          </div>
          <p style="margin:0 0 24px;color:#6b7280;font-size:13px;line-height:1.6;">
            Présentez votre QR code lors de votre prochaine visite pour réclamer votre récompense.
          </p>
          <a href="https://www.stampify.ch" style="display:inline-block;background:#534AB7;color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;">
            Voir mon QR code
          </a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;">
          <p style="margin:0;color:#9ca3af;font-size:11px;">
            Vous recevez cet email car vous êtes inscrit(e) à la carte de fidélité ${lc.card_name}.<br>
            © ${new Date().getFullYear()} Stampify — stampify.ch
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await sendEmail(customer.email, `🎁 Votre récompense est prête chez ${biz.business_name} !`, html);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, reason: "send_failed" });
  }
}
