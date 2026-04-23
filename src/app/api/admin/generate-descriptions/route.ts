import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanLLMText, generateGeminiText } from "@/lib/gemini";

/**
 * POST /api/admin/generate-descriptions
 * Body: {
 *   business_id?: string,
 *   restaurant_id?: string,
 *   pin: string,
 *   only_missing?: boolean,   // défaut true : skip les plats qui ont déjà >= 300 chars
 *   dry_run?: boolean,         // défaut false
 *   limit?: number,            // max items à traiter (défaut 200)
 * }
 *
 * Génère des descriptions détaillées (~350-450 caractères) pour chaque
 * menu_item via gemini-2.0-flash, UPDATE menu_items.description_long.
 *
 * Throttling : 1 seconde entre chaque appel (rate limit free tier
 * gemini ~15 req/min → 1 req/4s confortable, on prend 1s pour accélérer
 * sachant qu'on envoie 121 items).
 *
 * Retry : 1 fois si échec (http_error ou empty_response).
 *
 * Auth : PIN admin (env ADMIN_PIN, défaut 0808).
 *
 * Timeout Vercel : 60s (hobby), 300s (pro). 121 items × 1.5s ≈ 3min,
 * trop long pour hobby. Dans ce cas on conseille de découper via
 * limit=20 et relancer jusqu'à completion. L'endpoint est idempotent
 * via only_missing=true.
 */
export const maxDuration = 300; // 5 min si plan pro

function buildPrompt(params: {
  name: string;
  categoryName: string | null;
  price: number | string;
  description: string | null;
}): string {
  return `Tu es chef cuisinier au restaurant Rialto à Lausanne, pizzeria et cuisine anatolienne.
Rédige une description riche et appétissante pour le plat suivant :

Nom : ${params.name}
Catégorie : ${params.categoryName ?? "(non précisée)"}
Prix : ${params.price} CHF
Description courte existante : ${params.description ?? "(aucune)"}

Contraintes :
- Français, ton chaleureux et professionnel
- MINIMUM 5 lignes pleines (environ 350-450 caractères)
- Décrire précisément les ingrédients principaux
- Évoquer la technique de cuisson ou de préparation si pertinent
- Parler de l'origine culturelle (italienne, anatolienne) si applicable
- Mentionner l'accompagnement traditionnel suggéré si pertinent
- Éviter : hyperboles vides (délicieux, savoureux, exceptionnel), clichés marketing
- Privilégier : détails sensoriels précis (texture, chaleur, odeurs, couleurs), origines géographiques, techniques
- NE PAS inventer d'ingrédients qui ne sont pas dans la description courte
- Format : 1 seul paragraphe fluide, pas de bullet points, pas de titres markdown

Descriptions à éviter absolument :
- "Un plat délicieux qui ravira vos papilles"
- "Un voyage culinaire exceptionnel"
- "Préparé avec amour par nos chefs"

Description de qualité (exemple Pizza Bethusy) :
"Notre Pizza Bethusy marie la richesse du jambon cru italien à la douceur poivrée de la roquette fraîche. La pâte est pétrie chaque matin selon une fermentation lente de 48 heures, cuite à 380°C dans notre four traditionnel pour révéler son croustillant caractéristique. Une touche d'origan de Sicile parfume la mozzarella fondante. Servie traditionnellement avec un filet d'huile d'olive extra-vierge au moment du service. Un clin d'œil à notre quartier de Béthusy où la tradition italo-lausannoise s'écrit depuis trois décennies."

Génère maintenant la description pour ce plat, uniquement le texte descriptif, sans introduction, sans markdown, sans guillemets englobants.`;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

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
  const limit = Math.min(body.limit ?? 200, 200);

  const admin = createAdminClient();

  // Résout restaurant_id depuis business_id si besoin
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
    return NextResponse.json(
      { error: "restaurant introuvable" },
      { status: 404 },
    );
  }

  // Charge items + catégories en 2 queries (pas de join typed forcé)
  const [{ data: items }, { data: categories }] = await Promise.all([
    admin
      .from("menu_items")
      .select(
        "id, name, description, description_long, price, category_id",
      )
      .eq("restaurant_id", restaurantId)
      .order("name"),
    admin
      .from("menu_categories")
      .select("id, name")
      .eq("restaurant_id", restaurantId),
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
      price: number | string;
      category_id: string | null;
    }> | null) ?? [];

  // Filtrage only_missing
  const toProcess = onlyMissing
    ? allItems.filter(
        (it) => !it.description_long || it.description_long.length < 300,
      )
    : allItems;

  const targets = toProcess.slice(0, limit);

  console.log("[generate-descriptions] START", {
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
    length?: number;
    reason?: string;
    sample?: string;
  }> = [];
  let ok = 0;
  let failed = 0;

  for (const item of targets) {
    const categoryName = item.category_id
      ? catNameById.get(item.category_id) ?? null
      : null;
    const prompt = buildPrompt({
      name: item.name,
      categoryName,
      price: item.price,
      description: item.description,
    });

    console.log("[description-gen] START", {
      item_name: item.name,
      category: categoryName,
    });

    // 1er essai
    let result = await generateGeminiText({
      prompt,
      temperature: 0.7,
      maxOutputTokens: 600,
    });

    // Retry 1 fois si http_error ou empty_response
    if (
      !result.ok &&
      (result.reason === "http_error" || result.reason === "empty_response")
    ) {
      console.warn("[description-gen] retry after", result.reason);
      await sleep(2000);
      result = await generateGeminiText({
        prompt,
        temperature: 0.7,
        maxOutputTokens: 600,
      });
    }

    if (!result.ok) {
      console.error("[description-gen] FAILED", {
        item_name: item.name,
        reason: result.reason,
        detail: result.detail?.slice(0, 200),
      });
      results.push({
        id: item.id,
        name: item.name,
        ok: false,
        reason: result.reason,
      });
      failed += 1;
      await sleep(1000);
      continue;
    }

    const cleaned = cleanLLMText(result.text);
    console.log("[description-gen] SUCCESS", {
      item_name: item.name,
      length: cleaned.length,
    });

    if (!dryRun) {
      await admin
        .from("menu_items")
        .update({ description_long: cleaned })
        .eq("id", item.id);
    }

    results.push({
      id: item.id,
      name: item.name,
      ok: true,
      length: cleaned.length,
      sample: cleaned.slice(0, 120),
    });
    ok += 1;

    // Throttling : 1s entre chaque appel (respect rate limit)
    await sleep(1000);
  }

  console.log("[generate-descriptions] DONE", {
    ok,
    failed,
    total: targets.length,
  });

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
