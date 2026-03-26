import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendSms, normalizePhone } from "@/lib/brevo";

const ADMIN_EMAILS = ["augustin-domenget@stampify.ch", "augustindomenget@gmail.com", "augustindom999@gmail.com"];

const PLAN_LABELS: Record<string, string> = {
  essential: "Essentiel",
  pro:       "Pro",
  business:  "Business",
};

const ADDON_LABELS: Record<string, string> = {
  "onboarding":         "Onboarding guidé",
  "sms-campaign":       "Campagne SMS ponctuelle",
  "google-review-auto": "Demande avis Google automatique",
  "photo-shoot":        "Shooting photo produits",
  "website":            "Site vitrine one-page",
};

export async function POST(req: Request) {
  // 1. Admin auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { requestId } = await req.json() as { requestId?: string };
  if (!requestId) return NextResponse.json({ error: "requestId manquant" }, { status: 400 });

  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Config manquante" }, { status: 500 });

  // 2. Fetch the request
  const reqRes = await fetch(`${url}/rest/v1/upgrade_requests?id=eq.${requestId}&select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const [upgradeReq] = await reqRes.json() as Array<{
    id: string;
    business_id: string;
    business_name: string;
    business_email: string;
    business_phone: string | null;
    requested_item: string;
    request_type: string;
    status: string;
  }>;

  if (!upgradeReq) return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
  if (upgradeReq.status !== "pending") return NextResponse.json({ error: "Déjà traitée" }, { status: 409 });

  // 3. Mark request as approved
  await fetch(`${url}/rest/v1/upgrade_requests?id=eq.${requestId}`, {
    method: "PATCH",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ status: "approved", approved_at: new Date().toISOString() }),
  });

  // 4. If plan upgrade → update businesses.plan
  if (upgradeReq.request_type === "plan") {
    await fetch(`${url}/rest/v1/businesses?id=eq.${upgradeReq.business_id}`, {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ plan: upgradeReq.requested_item }),
    });
  }

  // 5. Send SMS to merchant if phone available
  const planLabel = upgradeReq.request_type === "plan"
    ? `Plan ${PLAN_LABELS[upgradeReq.requested_item] ?? upgradeReq.requested_item}`
    : (ADDON_LABELS[upgradeReq.requested_item] ?? upgradeReq.requested_item);

  if (upgradeReq.business_phone) {
    try {
      await sendSms(
        normalizePhone(upgradeReq.business_phone),
        `Stampify : Votre compte ${upgradeReq.business_name} a été mis à niveau ! ${planLabel} est maintenant actif. Connectez-vous sur stampify.ch`
      );
    } catch (smsErr) {
      console.error("[approve-upgrade] SMS error (non-blocking):", smsErr);
    }
  }

  return NextResponse.json({ success: true, planLabel });
}
