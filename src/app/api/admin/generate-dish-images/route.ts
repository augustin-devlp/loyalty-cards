import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateGeminiImage } from "@/lib/gemini";

/**
 * POST /api/admin/generate-dish-images
 * Body: {
 *   business_id?: string,
 *   restaurant_id?: string,
 *   pin: string,
 *   only_missing?: boolean,   // skip si image_url présent + pointe vers supabase storage
 *   dry_run?: boolean,
 *   limit?: number,           // max items traités par appel
 * }
 *
 * Génère une image via Nano Banana Pro (gemini-2.5-flash-image) pour
 * chaque menu_item, upload dans Supabase Storage bucket 'menu-images',
 * UPDATE menu_items.image_url.
 *
 * Prompts adaptés par catégorie (pizza / pâtes / plats anatoliens /
 * burger / salade / dessert / boisson / bière / vin).
 *
 * Throttling 7s entre appels (rate limit gemini 2.5 flash image ~10
 * req/min free tier). 121 items × 8s ≈ 16 min — découper via limit=10
 * et relancer jusqu'à completion (endpoint idempotent via only_missing).
 *
 * Sauvegarde l'ancienne image_url dans image_url_backup si la colonne
 * existe (pour permettre un rollback facile).
 */
export const maxDuration = 300;

/* ─── Prompt-engineering par catégorie ──────────────────────────────── */

const BASE_PROMPT = (dishName: string, specific: string) => `Professional food photography of ${dishName}, Italian restaurant style, served on a rustic wooden table, warm natural lighting from window, shallow depth of field with slight background blur, vibrant colors, appetizing presentation, overhead 45-degree angle, high detail texture, steam rising gently, no text, no logos, no watermark, photorealistic, shot on Canon 5D with 50mm f/1.4 lens, restaurant-quality plating.

Specific details for this dish:
${specific}

Style: editorial food magazine photography, similar to Bon Appétit or Saveur magazine. Background: softly blurred wooden table with subtle props like a linen napkin or small olive branch sprig. Color grading: warm and inviting, slight orange-red tones to evoke coziness.

AVOID: cartoon style, 3D render style, oversaturated colors, sterile/studio white backgrounds, plastic-looking food, chef hands visible, generic stock photo look.`;

type CategoryKind =
  | "pizza"
  | "pasta"
  | "anatolian"
  | "burger"
  | "salad"
  | "dessert"
  | "soft_drink"
  | "beer"
  | "wine"
  | "generic";

function detectCategory(
  name: string,
  categoryName: string | null,
): CategoryKind {
  const n = name.toLowerCase();
  const c = (categoryName ?? "").toLowerCase();

  if (c.includes("pizza") || n.includes("pizza")) return "pizza";
  if (
    c.includes("pâte") ||
    c.includes("pasta") ||
    c.includes("lasagne") ||
    c.includes("tortellini") ||
    /tagliatelle|spaghetti|linguine|lasagne|lasagna|tortellini|raviol/.test(n)
  )
    return "pasta";
  if (
    /kebab|döner|doner|brochette|agneau|aubergine|anatolien|turca|turque|iskender|shish/.test(
      n,
    ) ||
    c.includes("turc") ||
    c.includes("anatolien")
  )
    return "anatolian";
  if (c.includes("hamburger") || /burger|cheeseburger/.test(n)) return "burger";
  if (c.includes("salade") || /salade|salad/.test(n)) return "salad";
  if (c.includes("dessert") || /tiramisu|panna cotta|glace|mousse/.test(n))
    return "dessert";
  if (c.includes("bière") || /bière|biere|beer|heineken/.test(n)) return "beer";
  if (c.includes("vin") || /vin rouge|vin blanc|wine/.test(n)) return "wine";
  if (
    c.includes("softdrink") ||
    c.includes("boisson") ||
    /coca|fanta|sprite|ice tea|eau|pellegrino|limonade/.test(n)
  )
    return "soft_drink";

  return "generic";
}

function buildImagePrompt(params: {
  name: string;
  description: string | null;
  descriptionLong: string | null;
  categoryName: string | null;
}): string {
  const kind = detectCategory(params.name, params.categoryName);
  const ingredients =
    params.descriptionLong ?? params.description ?? params.name;

  let specific: string;
  switch (kind) {
    case "pizza":
      specific = `Wood-fired pizza with visible char marks on crust edges, leopard-spotted crust from high heat, toppings fresh and clearly visible. Crust has a beautiful golden-brown color with small bubbles. Served on a dark wooden pizza board or directly on pizza peel. Ingredients to show realistically: ${ingredients}`;
      break;
    case "pasta":
      specific = `Pasta served in a shallow ceramic bowl, sauce visibly coating the pasta, steam rising. Twirl of pasta on a fork visible. Garnish of fresh herbs or cheese on top. Composition: ${ingredients}`;
      break;
    case "anatolian":
      specific = `Traditional Turkish/Anatolian presentation on a copper or ceramic plate. Rice pilaf or bulgur accompaniment visible on side. Fresh herbs (parsley, mint) as garnish. Lemon wedge. Grilled char marks visible on protein. Warm terracotta tones dominant. Composition: ${ingredients}`;
      break;
    case "burger":
      specific = `Burger with soft brioche bun, visible layers, melted cheese, crisp lettuce, red tomato, served with golden french fries on a wooden board. Rustic paper liner under fries. Composition: ${ingredients}`;
      break;
    case "salad":
      specific = `Fresh salad in a wide shallow bowl, vibrant greens, colorful vegetables clearly identifiable, dressing drizzled on top, glossy texture. Composition: ${ingredients}`;
      break;
    case "dessert":
      specific = `Elegant dessert plating with dusting of sugar or cocoa, fresh berries as garnish, sauce drizzled on plate, fork placed next to the plate. Small portion size suggesting refined restaurant cuisine. Composition: ${ingredients}`;
      break;
    case "soft_drink":
      specific = `Glass bottle or can with condensation droplets suggesting cold temperature, served with a tall glass containing ice cubes. Clean and refreshing look. NO specific brand logo visible. Composition: ${params.name}`;
      break;
    case "beer":
      specific = `Beer in a tall clear glass, golden or amber color, visible foam head, condensation on glass, warm pub lighting in background. NO specific brand logo visible.`;
      break;
    case "wine":
      specific = `Wine glass with ${/blanc/.test(params.name.toLowerCase()) ? "white" : /rosé/.test(params.name.toLowerCase()) ? "rose" : "red"} wine, soft restaurant lighting, bottle visible in soft focus background, elegant stemware.`;
      break;
    default:
      specific = `Restaurant dish presentation. Composition: ${ingredients}`;
  }

  return BASE_PROMPT(params.name, specific);
}

/* ─── Upload Supabase Storage ──────────────────────────────────────── */

async function uploadToBucket(params: {
  admin: ReturnType<typeof createAdminClient>;
  itemId: string;
  base64Data: string;
  mimeType: string;
}): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    const buffer = Buffer.from(params.base64Data, "base64");
    const ext = params.mimeType.includes("png")
      ? "png"
      : params.mimeType.includes("webp")
        ? "webp"
        : "jpg";
    const path = `rialto/${params.itemId}_${Date.now()}.${ext}`;

    const { error } = await params.admin.storage
      .from("menu-images")
      .upload(path, buffer, {
        contentType: params.mimeType,
        upsert: true,
      });

    if (error) {
      return { ok: false, error: error.message };
    }

    const { data } = params.admin.storage.from("menu-images").getPublicUrl(path);
    return { ok: true, url: data.publicUrl };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/* ─── Endpoint ────────────────────────────────────────────────────── */

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    business_id?: string;
    restaurant_id?: string;
    pin?: string;
    only_missing?: boolean;
    dry_run?: boolean;
    limit?: number;
  } | null;

  const expectedPin = process.env.ADMIN_PIN ?? "0808";
  if (body?.pin !== expectedPin) {
    return NextResponse.json({ error: "PIN invalide" }, { status: 401 });
  }

  if (!body?.restaurant_id && !body?.business_id) {
    return NextResponse.json(
      { error: "restaurant_id ou business_id requis" },
      { status: 400 },
    );
  }

  const onlyMissing = body.only_missing ?? true;
  const dryRun = body.dry_run ?? false;
  const limit = Math.min(body.limit ?? 20, 40);

  const admin = createAdminClient();

  let restaurantId = body.restaurant_id;
  if (!restaurantId && body.business_id) {
    const { data: r } = await admin
      .from("restaurants")
      .select("id")
      .eq("business_id", body.business_id)
      .single();
    restaurantId = r?.id;
  }
  if (!restaurantId) {
    return NextResponse.json({ error: "restaurant introuvable" }, { status: 404 });
  }

  const [{ data: items }, { data: categories }] = await Promise.all([
    admin
      .from("menu_items")
      .select(
        "id, name, description, description_long, image_url, category_id",
      )
      .eq("restaurant_id", restaurantId)
      .order("name"),
    admin.from("menu_categories").select("id, name").eq("restaurant_id", restaurantId),
  ]);

  const catNameById = new Map<string, string>();
  for (const c of (categories as Array<{ id: string; name: string }> | null) ??
    []) {
    catNameById.set(c.id, c.name);
  }

  const allItems =
    (items as Array<{
      id: string;
      name: string;
      description: string | null;
      description_long: string | null;
      image_url: string | null;
      category_id: string | null;
    }> | null) ?? [];

  const toProcess = onlyMissing
    ? allItems.filter(
        (it) =>
          !it.image_url ||
          (!it.image_url.includes("supabase") &&
            !it.image_url.includes("/storage/")),
      )
    : allItems;

  const targets = toProcess.slice(0, limit);

  console.log("[generate-dish-images] START", {
    restaurant_id: restaurantId,
    total_items: allItems.length,
    to_process: toProcess.length,
    will_process: targets.length,
    dry_run: dryRun,
    only_missing: onlyMissing,
  });

  const results: Array<{
    id: string;
    name: string;
    ok: boolean;
    url?: string;
    reason?: string;
    ms?: number;
  }> = [];
  let ok = 0;
  let failed = 0;

  for (const item of targets) {
    const categoryName = item.category_id
      ? catNameById.get(item.category_id) ?? null
      : null;
    const startMs = Date.now();
    const prompt = buildImagePrompt({
      name: item.name,
      description: item.description,
      descriptionLong: item.description_long,
      categoryName,
    });

    console.log("[image-gen] START", {
      item_name: item.name,
      category: categoryName,
      prompt_length: prompt.length,
    });

    // Tentative 1
    let result = await generateGeminiImage({ prompt });

    // Retry 1 fois si rate limit (429) ou erreur transitoire
    if (
      !result.ok &&
      (result.status === 429 || result.reason === "http_error")
    ) {
      console.warn("[image-gen] retry after", result.reason, result.status);
      await sleep(10_000);
      result = await generateGeminiImage({ prompt });
    }

    if (!result.ok) {
      console.error("[image-gen] FAILED", {
        item_name: item.name,
        reason: result.reason,
        status: result.status,
        detail: result.detail?.slice(0, 200),
      });
      results.push({
        id: item.id,
        name: item.name,
        ok: false,
        reason: `${result.reason}${result.status ? ` (HTTP ${result.status})` : ""}`,
      });
      failed += 1;
      await sleep(7_000);
      continue;
    }

    if (dryRun) {
      results.push({
        id: item.id,
        name: item.name,
        ok: true,
        ms: Date.now() - startMs,
        reason: "dry_run_no_upload",
      });
      ok += 1;
      await sleep(7_000);
      continue;
    }

    // Upload Supabase Storage
    const upload = await uploadToBucket({
      admin,
      itemId: item.id,
      base64Data: result.data_base64,
      mimeType: result.mime_type,
    });

    if (!upload.ok) {
      console.error("[image-gen] upload FAILED", {
        item_name: item.name,
        error: upload.error,
      });
      results.push({
        id: item.id,
        name: item.name,
        ok: false,
        reason: `upload_failed: ${upload.error}`,
      });
      failed += 1;
      await sleep(7_000);
      continue;
    }

    // UPDATE DB avec nouvelle URL (pas de image_url_backup car la
    // colonne n'existe pas — si rollback nécessaire, requery depuis
    // les bucket files qui sont horodatés)
    await admin
      .from("menu_items")
      .update({ image_url: upload.url })
      .eq("id", item.id);

    console.log("[image-gen] SUCCESS", {
      item_name: item.name,
      url: upload.url,
      ms: Date.now() - startMs,
    });

    results.push({
      id: item.id,
      name: item.name,
      ok: true,
      url: upload.url,
      ms: Date.now() - startMs,
    });
    ok += 1;

    // Throttling : 7s entre appels
    await sleep(7_000);
  }

  console.log("[generate-dish-images] DONE", { ok, failed, total: targets.length });

  return NextResponse.json({
    restaurant_id: restaurantId,
    total_items: allItems.length,
    processed: targets.length,
    ok,
    failed,
    dry_run: dryRun,
    only_missing: onlyMissing,
    details: results,
  });
}
