import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TEMPLATE_KEYS, TEMPLATE_META } from "@/lib/smsTemplates";

/**
 * PATCH /api/restaurants/[id]/sms-templates/[key]
 * Body: { content?: string, enabled?: boolean }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; key: string } },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!(TEMPLATE_KEYS as readonly string[]).includes(params.key)) {
    return NextResponse.json({ error: "Template key invalide" }, { status: 400 });
  }

  const body = (await req.json().catch(() => null)) as {
    content?: string;
    enabled?: boolean;
  } | null;
  if (!body) return NextResponse.json({ error: "Body invalide" }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (typeof body.content === "string") update.content = body.content;
  if (typeof body.enabled === "boolean") update.enabled = body.enabled;
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Rien à mettre à jour" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("sms_templates")
    .upsert(
      {
        restaurant_id: params.id,
        template_key: params.key,
        content:
          (update.content as string | undefined) ??
          TEMPLATE_META[params.key as keyof typeof TEMPLATE_META].defaultContent,
        enabled:
          typeof update.enabled === "boolean" ? (update.enabled as boolean) : true,
      },
      { onConflict: "restaurant_id,template_key" },
    )
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ template: data });
}

/**
 * DELETE /api/restaurants/[id]/sms-templates/[key]
 * Réinitialise au contenu par défaut (ne supprime pas la row).
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; key: string } },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!(TEMPLATE_KEYS as readonly string[]).includes(params.key)) {
    return NextResponse.json({ error: "Template key invalide" }, { status: 400 });
  }

  const admin = createAdminClient();
  const def = TEMPLATE_META[params.key as keyof typeof TEMPLATE_META].defaultContent;
  const { data, error } = await admin
    .from("sms_templates")
    .upsert(
      {
        restaurant_id: params.id,
        template_key: params.key,
        content: def,
        enabled: true,
      },
      { onConflict: "restaurant_id,template_key" },
    )
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ template: data });
}
