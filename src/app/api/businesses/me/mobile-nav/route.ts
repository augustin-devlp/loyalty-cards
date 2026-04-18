import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  parseQuickActions,
  QUICK_ACTIONS,
  type QuickActionSlug,
} from "@/lib/mobileQuickActions";

/**
 * GET /api/businesses/me/mobile-nav
 * Retourne le tableau mobile_quick_actions du business courant.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("businesses")
    .select("mobile_quick_actions")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    mobile_quick_actions: parseQuickActions(data?.mobile_quick_actions),
  });
}

/**
 * PATCH /api/businesses/me/mobile-nav
 * Body: { mobile_quick_actions: string[] } — exactement 3 slugs valides.
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as {
    mobile_quick_actions?: unknown;
  } | null;

  if (!body || !Array.isArray(body.mobile_quick_actions)) {
    return NextResponse.json(
      { error: "mobile_quick_actions doit être un tableau" },
      { status: 400 },
    );
  }
  if (body.mobile_quick_actions.length !== 3) {
    return NextResponse.json(
      { error: "Vous devez choisir exactement 3 raccourcis." },
      { status: 400 },
    );
  }
  const valid = body.mobile_quick_actions.filter(
    (v): v is QuickActionSlug =>
      typeof v === "string" &&
      Object.prototype.hasOwnProperty.call(QUICK_ACTIONS, v),
  );
  if (valid.length !== 3) {
    return NextResponse.json(
      { error: "Un ou plusieurs slugs sont invalides." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("businesses")
    .update({ mobile_quick_actions: valid })
    .eq("id", user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ mobile_quick_actions: valid });
}
