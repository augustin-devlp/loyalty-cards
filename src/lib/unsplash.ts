/**
 * Client Unsplash API simplifié.
 *
 * Nécessite UNSPLASH_ACCESS_KEY en env. Si absent, les fonctions renvoient
 * null (silencieux) pour laisser les callers utiliser un fallback.
 *
 * Docs : https://unsplash.com/developers
 * Rate limit gratuit : 50 req/h — largement suffisant pour un refresh menu.
 */

const UNSPLASH_API = "https://api.unsplash.com";

export type UnsplashPhoto = {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
};

/**
 * Cherche la première photo pertinente pour une query.
 * Retourne null si clé absente, query vide, ou aucun résultat.
 */
export async function searchUnsplashPhoto(
  query: string,
): Promise<UnsplashPhoto | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    console.warn("[unsplash] UNSPLASH_ACCESS_KEY missing — returning null");
    return null;
  }
  const q = query.trim();
  if (!q) return null;

  const url = new URL(`${UNSPLASH_API}/search/photos`);
  url.searchParams.set("query", q);
  url.searchParams.set("per_page", "3");
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");

  try {
    const res = await fetch(url.toString(), {
      headers: {
        "Accept-Version": "v1",
        Authorization: `Client-ID ${key}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(
        "[unsplash] API error",
        res.status,
        await res.text().catch(() => ""),
      );
      return null;
    }
    const body = (await res.json()) as { results?: UnsplashPhoto[] };
    const first = body.results?.[0];
    return first ?? null;
  } catch (err) {
    console.error("[unsplash] fetch failed", err);
    return null;
  }
}

/**
 * Construit une query anglaise optimisée à partir du nom d'un plat et de
 * sa catégorie. L'objectif : avoir des photos réalistes, pas des stock
 * photos aseptisées.
 *
 * Règles :
 * - Pizzas → "wood fired pizza {variant} rustic"
 * - Pâtes → "{name} pasta italian restaurant"
 * - Kebab/turc → "{name} turkish plate traditional"
 * - Poissons → "{name} seafood plate restaurant"
 * - Viandes → "{name} grilled plate"
 * - Desserts → "{name} dessert plate"
 * - Boissons soft → "{name} glass bottle"
 * - Vins → "{name} wine glass restaurant"
 * - Bières → "beer glass {variant}"
 *
 * Les noms français sont mappés vers des mots-clés anglais connus.
 */
const FR_TO_EN: Record<string, string> = {
  marguerite: "margherita",
  "à la turca": "turkish kebab",
  "à la turque": "turkish kebab",
  bethusy: "parma ham arugula",
  arrabbiata: "arrabbiata spicy",
  capricciosa: "capricciosa",
  quattro: "four cheese",
  alsacienne: "flammkuchen cream bacon",
  funghi: "mushroom",
  "quattro formaggi": "four cheese",
  diavola: "diavola spicy salami",
  "4 fromages": "four cheese",
  napolitaine: "napoli",
  "aux moules": "mussels",
  "aux crevettes": "shrimp",
  "rouget": "red mullet fish",
  "saumon": "salmon fillet",
  "entrecôte": "entrecote beef",
  "filet mignon": "beef tenderloin",
  hamburger: "burger",
  tiramisu: "tiramisu",
  "panna cotta": "panna cotta dessert",
  "vongole": "clams linguine",
  "salade": "salad plate",
  carpaccio: "carpaccio",
  bruschetta: "bruschetta tomato",
  "tagliatelles": "tagliatelle pasta",
  "spaghetti": "spaghetti pasta",
  "lasagne": "lasagna",
  "tortellini": "tortellini",
  "kebab": "turkish kebab",
  brochette: "kebab skewer",
  agneau: "lamb skewer",
  "aubergine": "eggplant",
  "moules": "mussels marinara",
  "crevettes": "shrimp",
  "coca": "coca cola glass ice",
  "fanta": "fanta orange",
  "sprite": "sprite soda",
  "ice tea": "ice tea glass",
  "san pellegrino": "sparkling water glass",
  "vin rouge": "red wine glass",
  "vin blanc": "white wine glass",
  "vin rosé": "rose wine glass",
  "heineken": "heineken beer bottle",
  "bière": "beer glass",
  "eau minérale": "still water bottle",
  "limonade": "lemonade glass",
};

export function buildPhotoQuery(
  name: string,
  categoryName?: string | null,
): string {
  const n = name.toLowerCase();
  const c = (categoryName ?? "").toLowerCase();

  // Map directly-known FR terms to EN
  let mappedName = n;
  for (const [fr, en] of Object.entries(FR_TO_EN)) {
    if (n.includes(fr)) {
      mappedName = mappedName.replace(fr, en);
    }
  }

  // Contextualise selon catégorie
  if (c.includes("pizza") || n.includes("pizza")) {
    return `wood fired pizza ${mappedName} rustic`.replace(/pizza\s+pizza/, "pizza");
  }
  if (c.includes("pâte") || c.includes("pasta") || n.includes("tagliatelle") || n.includes("spaghetti")) {
    return `${mappedName} pasta italian restaurant`.replace(/\s+/, " ").trim();
  }
  if (c.includes("lasagne")) return `lasagna bolognese plate restaurant`;
  if (c.includes("tortellini")) return `tortellini pasta plate`;
  if (c.includes("poisson") || n.includes("rouget") || n.includes("saumon")) {
    return `${mappedName} seafood plate restaurant`;
  }
  if (c.includes("viande") || n.includes("steak") || n.includes("entrecote")) {
    return `${mappedName} grilled plate restaurant`;
  }
  if (c.includes("hamburger") || n.includes("burger")) {
    return `${mappedName} gourmet restaurant`;
  }
  if (c.includes("entrée") || n.includes("salade") || n.includes("bruschetta")) {
    return `${mappedName} appetizer plate restaurant`;
  }
  if (c.includes("dessert") || n.includes("tiramisu") || n.includes("panna")) {
    return `${mappedName} dessert plate`;
  }
  if (c.includes("softdrink") || c.includes("boisson")) {
    return `${mappedName} glass`;
  }
  if (c.includes("vin")) {
    return `${mappedName} wine glass`;
  }
  if (c.includes("bière")) {
    return `${mappedName} beer glass bottle`;
  }
  if (c.includes("combo")) {
    return `italian restaurant combo meal plate`;
  }
  // Fallback
  return `${mappedName} restaurant food`;
}
