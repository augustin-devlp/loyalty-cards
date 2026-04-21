# Intégration Nano Banana Pro (Gemini Image Generation)

> **TL;DR** — Nano Banana Pro est le modèle Gemini 2.5 Flash Image de
> Google, capable de générer des images photoréalistes de plats à
> ~0.04 USD par image. Pour Rialto (~120 items), coût total ≈ 4–5 USD.
>
> **Statut** : pas prioritaire pour la démo de samedi.
> Unsplash (chantier 7) donne déjà des résultats convaincants.
> À envisager dans un second temps si Mehmet veut des photos 100%
> personnalisées de ses plats spécifiques.

---

## 1. Ce qu'est Nano Banana Pro

- Modèle : **Gemini 2.5 Flash Image** (aussi appelé _Nano Banana Pro_)
- Fournisseur : Google DeepMind
- Accès :
  - **Google AI Studio** (aistudio.google.com) — UI web pour tester
  - **Gemini API** (ai.google.dev) — appel programmatique
  - **Vertex AI** (cloud.google.com) — version enterprise avec SLA
- Prix indicatif : ~0.04 USD par image générée (tier gratuit avec limite
  journalière disponible aussi)
- Points forts :
  - Très bon pour la photographie culinaire réaliste
  - Contrôle fin via prompt (style, éclairage, composition)
  - Pas de watermark visible sur les images générées
  - Résolutions standard : 1024×1024 ou 1024×1536

## 2. Comment obtenir la clé API

1. Aller sur **<https://ai.google.dev>**
2. Bouton **« Get API key »** en haut à droite
3. Se connecter avec le compte Google Augustin (pas besoin de compte
   Google Cloud distinct — le tier gratuit marche avec un simple Gmail)
4. Créer ou sélectionner un projet Google Cloud (peut réutiliser le
   projet Stampify existant si déjà créé pour d'autres services)
5. Copier la clé générée (format : `AIza...`)
6. Ajouter dans Vercel :

   ```bash
   # loyalty-cards
   Vercel > Project Settings > Environment Variables > Add
   GEMINI_API_KEY = AIzaXXXXXXXXXXXXXXXXXXX
   ```

7. Redéployer loyalty-cards

## 3. Intégration prévue (à coder plus tard)

### Endpoint `POST /api/admin/generate-dish-image`

```ts
// Body
{
  menu_item_id: string,
  style_prompt?: string,     // override optionnel
  dry_run?: boolean,
  pin: string
}
```

Le prompt-engineering template pour chaque item :

```
Professional food photography of {dish_name}. {description}.
Italian restaurant style, warm golden lighting, rustic wooden table
background, shallow depth of field, shot from 45-degree angle,
appetizing, realistic, high resolution. No text, no logos, no watermarks.
Natural food styling, slight steam for hot dishes, fresh herbs as garnish.
```

Variantes selon catégorie :

- **Pizzas** → `"Close-up of a wood-fired pizza, crispy charred crust, melting
  cheese, fresh basil. Shot from above at 30-degree angle."`
- **Pâtes** → `"Italian pasta plate, al dente, glossy sauce, parmesan shavings.
  Rustic ceramic plate on dark wood."`
- **Plats turcs** → `"Traditional Turkish {dish} plate, copper or terracotta
  serving dish, aromatic spices visible, fresh parsley garnish."`
- **Desserts** → `"Elegant dessert plating, modern restaurant presentation,
  soft backlighting, minimal props."`
- **Boissons** → `"Tall glass of {drink} with condensation, ice cubes if
  applicable, clean studio background, product photography style."`

### Code d'intégration (squelette)

```ts
// src/lib/geminiImage.ts

export async function generateDishImage(prompt: string): Promise<Blob | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["IMAGE"] },
      }),
    },
  );
  if (!res.ok) return null;
  const body = await res.json();
  // body.candidates[0].content.parts[0].inlineData.data = base64 PNG
  const b64 = body?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!b64) return null;
  const bin = Buffer.from(b64, "base64");
  return new Blob([bin], { type: "image/png" });
}
```

Stockage : utiliser le bucket Supabase Storage déjà en place pour
uploader l'image et récupérer l'URL publique à écrire dans
`menu_items.image_url`.

## 4. Décision pragmatique actuelle

**Samedi démo Mehmet** : ne pas intégrer Nano Banana Pro.

Raisons :

- Unsplash (chantier 7) donne déjà des photos pros pour les plats
  standards (pizzas margherita, pâtes, etc.)
- Le coût ~4 USD pour générer 120 items est trivial mais représente une
  dépendance à une clé API supplémentaire
- Si Mehmet demande spécifiquement des photos _de son restaurant_, la
  meilleure approche reste :
  1. Lui demander de prendre 20-30 photos avec son smartphone
  2. Les uploader dans le bucket Supabase
  3. Les mapper manuellement aux `menu_items.image_url`

Nano Banana Pro devient intéressant si :

- Mehmet veut une identité visuelle 100% cohérente pour tout le menu
- On décide de proposer à d'autres restaurateurs Stampify cette
  génération automatique comme feature premium
- Unsplash se montre insuffisant pour des plats très spécifiques
  (ex: lasagne au four, pizza exotique non référencée)

## 5. Références

- Unsplash API (chantier 7) : <https://unsplash.com/developers>
- Gemini API docs : <https://ai.google.dev/gemini-api/docs>
- Gemini Image generation guide : <https://ai.google.dev/gemini-api/docs/image-generation>
- Pricing Gemini : <https://ai.google.dev/gemini-api/docs/pricing>
- Google AI Studio (test en ligne) : <https://aistudio.google.com>
