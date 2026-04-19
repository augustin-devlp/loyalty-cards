import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/upgrade-request
 * Body: { requested_plan?: "pro" | "business", requested_item?: string, message?: string }
 *
 * Crée une demande d'upgrade (par défaut vers le plan Pro, pour débloquer
 * les SMS). Visible dans /admin.
 *
 * Auth : session business active. Les champs business_name/email sont
 * récupérés depuis la session (pas du body, pour éviter tout spoof).
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    requested_plan?: string;
    requested_item?: string;
    message?: string;
  } | null;

  const { data: business } = await supabase
    .from("businesses")
    .select("business_name, email, phone, plan")
    .eq("id", user.id)
    .single();

  if (!business) {
    return NextResponse.json(
      { error: "Business introuvable" },
      { status: 404 },
    );
  }

  const requestedPlan = body?.requested_plan === "business" ? "business" : "pro";
  const requestedItem = body?.requested_item?.trim() || `plan-${requestedPlan}`;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("upgrade_requests")
    .insert({
      business_id: user.id,
      business_name: business.business_name ?? user.email ?? "",
      business_email: business.email ?? user.email ?? "",
      business_phone: business.phone ?? null,
      current_plan: business.plan ?? "none",
      requested_item: body?.message
        ? `${requestedItem} — ${body.message.slice(0, 200)}`
        : requestedItem,
      request_type: "plan",
      status: "pending",
    })
    .select("id, created_at, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ request: data });
}
