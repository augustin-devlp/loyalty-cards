import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rialtoCorsHeaders, RIALTO_RESTAURANT_ID } from "@/lib/rialtoConstants";
import { generateGeminiText, cleanLLMText } from "@/lib/gemini";

/**
 * POST /api/rialto/checkout/upsell
 * Body: { cart: [{ menu_item_id, name, quantity }], subtotal: number }
 *
 * Phase 11 C12 — Suggestion d'upsell IA au checkout Rialto.
 * - Analyse le panier
 * - Propose 2-3 items complémentaires avec des prompts Gemini
 *   (boissons, desserts, sides cohérents avec le plat principal)
 * - Retourne les items suggérés avec id + nom + prix + argument vente IA
 */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(req.headers.get("origin")),
  });
}

export async function POST(req: NextRequest) {
  const headers = rialtoCorsHeaders(req.headers.get("origin"));

  const body = (await req.json().catch(() => null)) as {
    cart?: Array<{ menu_item_id: string; name: string; quantity: number }>;
    subtotal?: number;
  } | null;

  if (!body?.cart || body.cart.length === 0) {
    return NextResponse.json(
      { ok: true, suggestions: [] },
      { headers },
    );
  }

  const admin = createAdminClient();

  // Fetch tout le menu Rialto (on filtrera côté IA)
  const { data: menuItems } = await admin
    .from("menu_items")
    .select(
      "id, name, description, price, category_id, is_available, is_out_of_stock, menu_categories!inner(name)",
    )
    .eq("restaurant_id", RIALTO_RESTAURANT_ID)
    .eq("is_available", true);

  const available = (menuItems ?? []).filter(
    (m) => (m as { is_out_of_stock?: boolean }).is_out_of_stock !== true,
  );

  // Exclure les items déjà dans le panier
  const inCart = new Set(body.cart.map((c) => c.menu_item_id));
  const candidates = available.filter((m) => !inCart.has(m.id as string));

  // Quick heuristic fallback si Gemini pas dispo : on suggère
  // la boisson + dessert les moins chers
  if (!process.env.GEMINI_API_KEY) {
    const drinks = candidates
      .filter((m) => {
        const cat = (m.menu_categories as unknown as { name?: string })?.name ?? "";
        return /boisson|drink/i.test(cat);
      })
      .sort((a, b) => Number(a.price) - Number(b.price))
      .slice(0, 1);
    const desserts = candidates
      .filter((m) => {
        const cat = (m.menu_categories as unknown as { name?: string })?.name ?? "";
        return /dessert/i.test(cat);
      })
      .sort((a, b) => Number(a.price) - Number(b.price))
      .slice(0, 1);
    return NextResponse.json(
      {
        ok: true,
        suggestions: [...drinks, ...desserts].map((m) => ({
          menu_item_id: m.id,
          name: m.name,
          price: Number(m.price),
          category: (m.menu_categories as unknown as { name?: string }).name ?? "",
          argument: "Parfait pour compléter ton repas",
        })),
        source: "heuristic",
      },
      { headers },
    );
  }

  // Gemini prompt
  const cartDescription = body.cart
    .map((c) => `- ${c.quantity}x ${c.name}`)
    .join("\n");
  const menuList = candidates
    .slice(0, 60)
    .map(
      (m) =>
        `${m.id} | ${m.name} | ${Number(m.price).toFixed(2)} CHF | cat:${(m.menu_categories as unknown as { name?: string })?.name ?? ""}`,
    )
    .join("\n");

  const prompt = `Tu es conseiller chez Rialto, pizzeria italo-anatolienne à Lausanne. Un client a mis dans son panier :

${cartDescription}

Voici les items disponibles à suggérer (format: id | nom | prix | catégorie) :

${menuList}

Propose EXACTEMENT 2 items complémentaires (1 boisson + 1 dessert ou entrée). Pour chaque suggestion, réponds en JSON stricte :
[
  { "id": "uuid-du-menu-item", "argument": "phrase courte 8 mots max, tu/tutoyer, en français" },
  { "id": "uuid-du-menu-item", "argument": "phrase courte 8 mots max, tu/tutoyer, en français" }
]

Règles :
- id DOIT être l'UUID exact de la liste ci-dessus.
- Pas de texte autour du JSON.
- Pas de markdown, pas de \`\`\`.
- Argument concis, jamais plus de 60 caractères.`;

  try {
    const result = await generateGeminiText({
      prompt,
      temperature: 0.4,
      maxOutputTokens: 200,
    });

    if (!result.ok) {
      throw new Error(`gemini_${result.reason}`);
    }

    const cleaned = cleanLLMText(result.text);
    const parsed = JSON.parse(cleaned) as Array<{ id: string; argument: string }>;
    const suggestions = parsed
      .map((s) => {
        const item = candidates.find((m) => m.id === s.id);
        if (!item) return null;
        return {
          menu_item_id: item.id,
          name: item.name,
          price: Number(item.price),
          category:
            (item.menu_categories as unknown as { name?: string }).name ?? "",
          argument: s.argument,
        };
      })
      .filter((s): s is NonNullable<typeof s> => !!s)
      .slice(0, 3);

    return NextResponse.json(
      { ok: true, suggestions, source: "gemini" },
      { headers },
    );
  } catch (err) {
    console.warn("[upsell] Gemini failed, fallback heuristic", err);
    const heuristic = candidates
      .sort((a, b) => Number(a.price) - Number(b.price))
      .slice(0, 2)
      .map((m) => ({
        menu_item_id: m.id,
        name: m.name,
        price: Number(m.price),
        category: (m.menu_categories as unknown as { name?: string }).name ?? "",
        argument: "Ça va super bien avec ta commande",
      }));
    return NextResponse.json(
      { ok: true, suggestions: heuristic, source: "fallback" },
      { headers },
    );
  }
}
