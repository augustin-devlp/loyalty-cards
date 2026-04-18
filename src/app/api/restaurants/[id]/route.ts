import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * GET /api/restaurants/[id]
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("restaurants")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Restaurant introuvable" }, { status: 404 });
  }
  return NextResponse.json({ restaurant: data });
}

/**
 * PATCH /api/restaurants/[id]
 * Body : subset de { accepting_orders, order_min_amount, order_open_time,
 *   order_close_time, prep_time_minutes, notification_sound, name,
 *   address, phone }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await requireAuth();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return NextResponse.json({ error: "Body invalide" }, { status: 400 });
  }

  const allowed = [
    "accepting_orders",
    "order_min_amount",
    "order_open_time",
    "order_close_time",
    "prep_time_minutes",
    "notification_sound",
    "name",
    "address",
    "phone",
    "logo_url",
  ];
  const update: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) update[k] = body[k];

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Rien à mettre à jour" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("restaurants")
    .update(update)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ restaurant: data });
}
