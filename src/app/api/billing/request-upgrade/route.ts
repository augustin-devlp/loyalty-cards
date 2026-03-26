import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/brevo";

const ADMIN_EMAIL = "augustindom999@gmail.com";

const PLAN_LABELS: Record<string, string> = {
  essential: "Essentiel",
  pro:       "Pro",
  business:  "Business",
};

const ADDON_LABELS: Record<string, string> = {
  "onboarding":          "Onboarding guidé (19€/mois)",
  "sms-campaign":        "Campagne SMS ponctuelle (19€/mois)",
  "google-review-auto":  "Demande avis Google auto (29€/mois)",
  "photo-shoot":         "Shooting photo produits (99€ one-shot)",
  "website":             "Site vitrine one-page (149€ one-shot)",
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { requestedItem, requestType } = await req.json() as {
    requestedItem?: string;
    requestType?: "plan" | "addon";
  };

  if (!requestedItem || !requestType) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  // Fetch business info
  const { data: biz } = await supabase
    .from("businesses")
    .select("business_name, email, plan, phone")
    .eq("id", user.id)
    .single();

  if (!biz) return NextResponse.json({ error: "Commerce introuvable" }, { status: 404 });

  const currentPlan = biz.plan ?? "none";

  // Prevent duplicate pending requests for same item
  const { data: existing } = await supabase
    .from("upgrade_requests")
    .select("id")
    .eq("business_id", user.id)
    .eq("requested_item", requestedItem)
    .eq("status", "pending")
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Une demande est déjà en cours pour cet élément." }, { status: 409 });
  }

  // Insert request
  const { error: insertError } = await supabase.from("upgrade_requests").insert({
    business_id:    user.id,
    business_name:  biz.business_name,
    business_email: biz.email,
    business_phone: biz.phone ?? null,
    current_plan:   currentPlan,
    requested_item: requestedItem,
    request_type:   requestType,
  });

  if (insertError) {
    console.error("[request-upgrade] insert error:", insertError);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement." }, { status: 500 });
  }

  // Send notification email to admin
  const itemLabel = requestType === "plan"
    ? `Plan ${PLAN_LABELS[requestedItem] ?? requestedItem}`
    : (ADDON_LABELS[requestedItem] ?? requestedItem);

  const currentPlanLabel = PLAN_LABELS[currentPlan] ?? currentPlan;

  try {
    await sendEmail(
      ADMIN_EMAIL,
      `[Stampify] Demande ${requestType === "plan" ? "d'upgrade" : "d'add-on"} — ${biz.business_name}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #534AB7; padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fff; margin: 0; font-size: 20px;">
              ${requestType === "plan" ? "🚀 Demande d'upgrade de plan" : "➕ Demande d'add-on"}
            </h1>
          </div>
          <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Commerce</td>
                <td style="padding: 8px 0; font-weight: 700; color: #111827; font-size: 14px;">${biz.business_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827;">${biz.email}</td>
              </tr>
              ${biz.phone ? `<tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Téléphone</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827;">${biz.phone}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Plan actuel</td>
                <td style="padding: 8px 0; font-size: 14px; color: #111827;">${currentPlanLabel}</td>
              </tr>
              <tr style="background: #ede9fe; border-radius: 8px;">
                <td style="padding: 10px 8px; color: #4c1d95; font-weight: 700; font-size: 14px;">Demande</td>
                <td style="padding: 10px 8px; font-weight: 800; color: #4c1d95; font-size: 15px;">${itemLabel}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding: 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px;">
              <p style="margin: 0; font-size: 13px; color: #6b7280;">
                Approuvez cette demande depuis le tableau de bord admin Stampify → section "Demandes d'upgrade".
              </p>
              <a href="https://stampify.ch/admin" style="display: inline-block; margin-top: 12px; background: #534AB7; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">
                Aller sur /admin →
              </a>
            </div>
          </div>
        </div>
      `
    );
  } catch (emailErr) {
    console.error("[request-upgrade] email error (non-blocking):", emailErr);
  }

  return NextResponse.json({ success: true });
}
