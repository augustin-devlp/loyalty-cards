import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateGeminiImage } from "@/lib/gemini";

/**
 * POST /api/admin/generate-single-dish-image
 * Body: { pin: string, dish_id: string, prompt: string }
 *
 * Génère 1 image pour 1 plat avec un prompt CUSTOM fourni par le client.
 * Pas de logique catégorie auto. Le script appelant fournit chaque prompt
 * unique (cf. PROMPT_IMAGES_121_PLATS.md). Idempotent — si l'appel réussit,
 * upload menu-images + UPDATE menu_items.image_url.
 */
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    pin?: string;
    dish_id?: string;
    prompt?: string;
  } | null;

  const expectedPin = process.env.ADMIN_PIN ?? "0808";
  if (body?.pin !== expectedPin) {
    return NextResponse.json({ error: "PIN invalide" }, { status: 401 });
  }
  if (!body?.dish_id || !body?.prompt) {
    return NextResponse.json(
      { error: "dish_id et prompt requis" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  // Vérifier que le dish existe
  const { data: dish, error: dishErr } = await admin
    .from("menu_items")
    .select("id, name")
    .eq("id", body.dish_id)
    .single();
  if (dishErr || !dish) {
    return NextResponse.json(
      { error: `dish_id introuvable: ${dishErr?.message ?? "unknown"}` },
      { status: 404 },
    );
  }

  // Génération Gemini
  const result = await generateGeminiImage({ prompt: body.prompt });
  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        dish_id: body.dish_id,
        reason: result.reason,
        status: result.status,
        detail: result.detail?.slice(0, 250),
      },
      { status: 502 },
    );
  }

  // Upload Storage
  try {
    const buffer = Buffer.from(result.data_base64, "base64");
    const ext = result.mime_type.includes("png")
      ? "png"
      : result.mime_type.includes("webp")
        ? "webp"
        : "jpg";
    const path = `rialto/${body.dish_id}_${Date.now()}.${ext}`;

    const { error: upErr } = await admin.storage
      .from("menu-images")
      .upload(path, buffer, {
        contentType: result.mime_type,
        upsert: true,
      });
    if (upErr) {
      return NextResponse.json(
        { ok: false, dish_id: body.dish_id, reason: "upload_failed", detail: upErr.message },
        { status: 500 },
      );
    }
    const { data: urlData } = admin.storage.from("menu-images").getPublicUrl(path);

    // UPDATE DB
    const { error: dbErr } = await admin
      .from("menu_items")
      .update({ image_url: urlData.publicUrl })
      .eq("id", body.dish_id);
    if (dbErr) {
      return NextResponse.json(
        { ok: false, dish_id: body.dish_id, reason: "db_update_failed", detail: dbErr.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      dish_id: body.dish_id,
      name: dish.name,
      image_url: urlData.publicUrl,
      mime_type: result.mime_type,
      bytes: buffer.length,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        dish_id: body.dish_id,
        reason: "exception",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
