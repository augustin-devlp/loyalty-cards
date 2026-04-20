import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ADMIN_PIN = "0808";

const ALLOWED_PLANS = ["essential", "pro", "business", null];
const ALLOWED_STATUSES = ["active", "inactive", "canceled", null];

function validateEnabledFeatures(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

/**
 * POST /api/admin/update-business
 * Body: { pin, business_id, plan?, subscription_status? }
 *
 * Permet à l'admin de changer le plan et/ou le statut d'abonnement d'un
 * business manuellement (pour activer l'accès aux SMS, etc.).
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    pin?: string;
    business_id?: string;
    plan?: string | null;
    subscription_status?: string | null;
    enabled_features?: string[];
  } | null;

  if (!body || body.pin !== ADMIN_PIN) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  if (!body.business_id) {
    return NextResponse.json(
      { error: "business_id requis" },
      { status: 400 },
    );
  }

  const update: Record<string, unknown> = {};
  if (body.plan !== undefined) {
    if (!ALLOWED_PLANS.includes(body.plan as string | null)) {
      return NextResponse.json({ error: "plan invalide" }, { status: 400 });
    }
    update.plan = body.plan;
  }
  if (body.subscription_status !== undefined) {
    if (!ALLOWED_STATUSES.includes(body.subscription_status as string | null)) {
      return NextResponse.json(
        { error: "subscription_status invalide" },
        { status: 400 },
      );
    }
    update.subscription_status = body.subscription_status;
  }
  if (body.enabled_features !== undefined) {
    if (!validateEnabledFeatures(body.enabled_features)) {
      return NextResponse.json(
        { error: "enabled_features doit être un tableau de strings" },
        { status: 400 },
      );
    }
    update.enabled_features = body.enabled_features;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "Rien à mettre à jour" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("businesses")
    .update(update)
    .eq("id", body.business_id)
    .select("id, business_name, plan, subscription_status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ business: data });
}
