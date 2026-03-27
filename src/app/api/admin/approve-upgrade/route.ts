import { NextResponse } from "next/server";
import { sendSms, normalizePhone } from "@/lib/brevo";

const ADMIN_PIN = "0808";

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
  const { requestId, pin } = await req.json() as { requestId?: string; pin?: string };

  // Auth: PIN-only (no Supabase session required)
  if (pin !== ADMIN_PIN) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  if (!requestId) return NextResponse.json({ error: "requestId manquant" }, { status: 400 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Config manquante" }, { status: 500 });

  const hdrs: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };

  // 1. Fetch the upgrade request
  const reqRes = await fetch(
    `${url}/rest/v1/upgrade_requests?id=eq.${requestId}&select=*`,
    { headers: hdrs },
  );
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

  // 2. Mark request as approved
  await fetch(`${url}/rest/v1/upgrade_requests?id=eq.${requestId}`, {
    method: "PATCH",
    headers: { ...hdrs, Prefer: "return=minimal" },
    body: JSON.stringify({ status: "approved", approved_at: new Date().toISOString() }),
  });

  // 3. If plan upgrade → update businesses.plan
  if (upgradeReq.request_type === "plan") {
    const patchRes = await fetch(`${url}/rest/v1/businesses?id=eq.${upgradeReq.business_id}`, {
      method: "PATCH",
      headers: { ...hdrs, Prefer: "return=minimal" },
      body: JSON.stringify({ plan: upgradeReq.requested_item }),
    });
    if (!patchRes.ok) {
      const text = await patchRes.text();
      console.error("[approve-upgrade] Failed to update businesses.plan:", patchRes.status, text);
    } else {
      console.log(`[approve-upgrade] ✅ businesses.plan updated to "${upgradeReq.requested_item}" for business ${upgradeReq.business_id}`);
    }
  }

  // 4. Send SMS confirmation to merchant (non-blocking)
  const planLabel = upgradeReq.request_type === "plan"
    ? `Plan ${PLAN_LABELS[upgradeReq.requested_item] ?? upgradeReq.requested_item}`
    : (ADDON_LABELS[upgradeReq.requested_item] ?? upgradeReq.requested_item);

  if (upgradeReq.business_phone) {
    try {
      await sendSms(
        normalizePhone(upgradeReq.business_phone),
        `Stampify : Votre compte ${upgradeReq.business_name} a été mis à niveau ! ${planLabel} est maintenant actif. Connectez-vous sur stampify.ch`,
      );
      console.log(`[approve-upgrade] ✅ SMS sent to ${upgradeReq.business_phone}`);
    } catch (smsErr) {
      console.error("[approve-upgrade] SMS error (non-blocking):", smsErr);
    }
  }

  return NextResponse.json({ success: true, planLabel });
}
