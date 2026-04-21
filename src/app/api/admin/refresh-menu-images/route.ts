import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildPhotoQuery, searchUnsplashPhoto } from "@/lib/unsplash";

/**
 * POST /api/admin/refresh-menu-images
 * Body: { business_id?, restaurant_id?, pin, dry_run? = false, only_missing? = true }
 *
 * Met à jour menu_items.image_url en interrogeant Unsplash API pour chaque
 * item. Protégé par un PIN admin (env REFRESH_IMAGES_PIN, défaut "0808").
 *
 * Modes :
 * - only_missing=true (défaut) : ne touche que les items sans image_url
 * - only_missing=false         : rafraîchit tout le menu (coûteux en quota
 *                                Unsplash — max 50 req/h gratuit)
 * - dry_run=true               : liste ce qui serait fait, sans UPDATE
 *
 * Appelé manuellement par Augustin ou planifié via cron. Le script fait
 * 1 appel Unsplash par item + 1 UPDATE SQL. Pour un menu de 120 items,
 * prévoir ~2 min d'exécution (Unsplash impose une latence raisonnable).
 */

type RefreshResult = {
  item_id: string;
  name: string;
  category_name: string | null;
  query: string;
  before: string | null;
  after: string | null;
  source: "unsplash" | "unchanged" | "no_result" | "error";
  error?: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    business_id?: string;
    restaurant_id?: string;
    pin?: string;
    dry_run?: boolean;
    only_missing?: boolean;
  } | null;

  const expectedPin = process.env.REFRESH_IMAGES_PIN ?? "0808";
  if (body?.pin !== expectedPin) {
    return NextResponse.json({ error: "PIN invalide" }, { status: 401 });
  }

  if (!body?.business_id && !body?.restaurant_id) {
    return NextResponse.json(
      { error: "business_id ou restaurant_id requis" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const dryRun = !!body.dry_run;
  const onlyMissing = body.only_missing ?? true;

  // Charge les items
  const restaurantId = body.restaurant_id ?? body.business_id!;
  let query = admin
    .from("menu_items")
    .select(
      "id, name, image_url, category_id, menu_categories:category_id (name)",
    )
    .eq("restaurant_id", restaurantId)
    .order("display_order");

  const { data: items, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: RefreshResult[] = [];
  let updated = 0;
  let skipped = 0;

  console.log(
    `[refresh-menu-images] START restaurant=${restaurantId} total=${items?.length ?? 0} only_missing=${onlyMissing} dry_run=${dryRun}`,
  );

  for (const item of items ?? []) {
    const categoryName =
      (
        (item as { menu_categories?: { name?: string } | { name?: string }[] })
          .menu_categories as { name?: string } | undefined
      )?.name ?? null;
    const name = item.name as string;
    const itemId = item.id as string;
    const before = (item.image_url as string | null) ?? null;

    // Skip si l'item a déjà une image et qu'on est en mode "only_missing"
    if (onlyMissing && before) {
      skipped++;
      continue;
    }

    const q = buildPhotoQuery(name, categoryName);
    try {
      const photo = await searchUnsplashPhoto(q);
      if (!photo) {
        results.push({
          item_id: itemId,
          name,
          category_name: categoryName,
          query: q,
          before,
          after: null,
          source: "no_result",
        });
        continue;
      }

      // URL optimisée pour le menu (800px webp auto)
      const newUrl = `${photo.urls.raw}&w=800&auto=format&fit=crop&q=80`;

      if (!dryRun) {
        await admin
          .from("menu_items")
          .update({ image_url: newUrl })
          .eq("id", itemId);
      }

      results.push({
        item_id: itemId,
        name,
        category_name: categoryName,
        query: q,
        before,
        after: newUrl,
        source: "unsplash",
      });
      updated++;

      console.log(
        `[refresh-menu-images] item=${name} query="${q}" -> ${photo.id} (${photo.user.username})`,
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      results.push({
        item_id: itemId,
        name,
        category_name: categoryName,
        query: q,
        before,
        after: null,
        source: "error",
        error: errMsg,
      });
      console.error(`[refresh-menu-images] item=${name} failed`, err);
    }

    // Petit délai pour rester poli avec l'API Unsplash (rate limit 50/h)
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(
    `[refresh-menu-images] DONE updated=${updated} skipped=${skipped} total=${items?.length ?? 0}`,
  );

  return NextResponse.json({
    ok: true,
    total: items?.length ?? 0,
    updated,
    skipped,
    dry_run: dryRun,
    results,
  });
}

/**
 * GET /api/admin/refresh-menu-images?pin=X&restaurant_id=Y&dry_run=1
 * Version GET pour lancer depuis le navigateur sans outil.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pin = url.searchParams.get("pin") ?? "";
  const restaurantId = url.searchParams.get("restaurant_id") ?? "";
  const businessId = url.searchParams.get("business_id") ?? "";
  const dryRun = url.searchParams.get("dry_run") === "1";
  const onlyMissing = url.searchParams.get("only_missing") !== "0";

  // Délègue à POST
  const fakeReq = new Request(req.url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      pin,
      business_id: businessId || undefined,
      restaurant_id: restaurantId || undefined,
      dry_run: dryRun,
      only_missing: onlyMissing,
    }),
  });
  return POST(fakeReq as NextRequest);
}
