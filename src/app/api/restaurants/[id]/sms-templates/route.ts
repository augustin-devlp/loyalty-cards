import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TEMPLATE_KEYS, TEMPLATE_META } from "@/lib/smsTemplates";

/**
 * GET /api/restaurants/[id]/sms-templates
 * Liste les 5 templates. Crée les manquants (avec contenu par défaut) pour
 * garantir une liste complète à l'UI.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("sms_templates")
    .select("*")
    .eq("restaurant_id", params.id);

  const existingByKey = new Map(
    (existing ?? []).map((t) => [t.template_key as string, t]),
  );

  // Create missing templates with defaults
  const toCreate = TEMPLATE_KEYS.filter((k) => !existingByKey.has(k)).map(
    (k) => ({
      restaurant_id: params.id,
      template_key: k,
      content: TEMPLATE_META[k].defaultContent,
      enabled: true,
    }),
  );
  if (toCreate.length) {
    const { data: created } = await admin
      .from("sms_templates")
      .insert(toCreate)
      .select("*");
    for (const row of created ?? []) {
      existingByKey.set(row.template_key as string, row);
    }
  }

  const ordered = TEMPLATE_KEYS.map((k) => existingByKey.get(k)).filter(Boolean);
  return NextResponse.json({ templates: ordered });
}
