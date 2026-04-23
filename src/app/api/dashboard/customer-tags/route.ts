import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/dashboard/customer-tags?customer_id=...
 * POST /api/dashboard/customer-tags  Body { customer_id, tag, note? }
 * DELETE /api/dashboard/customer-tags?id=...
 *
 * Phase 11 C16 — Tags personnalisés par merchant sur un client
 * (ex: "VIP", "Allergique arachide", "Paiement cash", "Difficile"…).
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const customerId = url.searchParams.get("customer_id");
  if (!customerId) {
    return NextResponse.json(
      { error: "customer_id requis" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { data: restaurant } = await admin
    .from("restaurants")
    .select("id")
    .eq("business_id", user.id)
    .maybeSingle();
  if (!restaurant) {
    return NextResponse.json({ error: "no_restaurant" }, { status: 403 });
  }

  const { data: tags } = await admin
    .from("customer_tags")
    .select("id, tag, note, created_at")
    .eq("customer_id", customerId)
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ ok: true, tags: tags ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    customer_id?: string;
    tag?: string;
    note?: string;
  } | null;

  if (!body?.customer_id || !body?.tag) {
    return NextResponse.json(
      { error: "customer_id et tag requis" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { data: restaurant } = await admin
    .from("restaurants")
    .select("id")
    .eq("business_id", user.id)
    .maybeSingle();
  if (!restaurant) {
    return NextResponse.json({ error: "no_restaurant" }, { status: 403 });
  }

  const { data: inserted, error } = await admin
    .from("customer_tags")
    .insert({
      customer_id: body.customer_id,
      restaurant_id: restaurant.id,
      tag: body.tag.trim().slice(0, 40),
      note: body.note ?? null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "tag_deja_existe" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "save_failed", detail: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, tag: inserted });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id requis" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: restaurant } = await admin
    .from("restaurants")
    .select("id")
    .eq("business_id", user.id)
    .maybeSingle();
  if (!restaurant) {
    return NextResponse.json({ error: "no_restaurant" }, { status: 403 });
  }

  await admin
    .from("customer_tags")
    .delete()
    .eq("id", id)
    .eq("restaurant_id", restaurant.id);

  return NextResponse.json({ ok: true });
}
