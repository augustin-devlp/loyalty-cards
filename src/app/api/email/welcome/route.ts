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
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 8px;font-size:22px;color:#111827;">Bienvenue, ${customer.first_name} ! 🎉</h1>
          <p style="margin:0 0 20px;color:#6b7280;font-size:14px;line-height:1.6;">
            Vous venez de rejoindre la carte de fidélité <strong style="color:#111827;">${lc.card_name}</strong>
            de <strong style="color:#111827;">${biz.business_name}</strong>.
          </p>
          <p style="margin:0 0 12px;color:#374151;font-size:14px;">À chaque visite, collectez des tampons et débloquez votre récompense :</p>
          <div style="background:#f5f3ff;border-left:4px solid #534AB7;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0;font-size:15px;font-weight:700;color:#4c1d95;">🎁 ${lc.reward_description}</p>
          </div>
          <p style="margin:0 0 24px;color:#6b7280;font-size:13px;line-height:1.6;">
            Retrouvez votre carte et votre QR code à tout moment sur Stampify. Présentez-le à chaque passage en caisse.
          </p>
          <a href="https://www.stampify.ch" style="display:inline-block;background:#534AB7;color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;">
            Voir ma carte
          </a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;">
          <p style="margin:0;color:#9ca3af;font-size:11px;">
            Vous recevez cet email car vous vous êtes inscrit(e) à une carte de fidélité Stampify.<br>
            © ${new Date().getFullYear()} Stampify — stampify.ch
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await sendEmail(customer.email, `Bienvenue chez ${biz.business_name} !`, html);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, reason: "send_failed" });
  }
}
