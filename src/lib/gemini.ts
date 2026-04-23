/**
 * Client minimal Gemini API (Google AI Studio).
 *
 * 2 modèles utilisés dans ce projet :
 *   - gemini-2.0-flash           : génération de texte (descriptions menu)
 *   - gemini-2.5-flash-image     : Nano Banana Pro (images plats)
 *
 * Auth : header x-goog-api-key avec GEMINI_API_KEY (env Vercel).
 */

export type GeminiTextResult =
  | { ok: true; text: string; finish_reason?: string }
  | { ok: false; reason: string; status?: number; detail?: string };

export type GeminiImageResult =
  | {
      ok: true;
      mime_type: string;
      data_base64: string;
      finish_reason?: string;
    }
  | { ok: false; reason: string; status?: number; detail?: string };

/**
 * Liste des modèles texte à essayer en cascade. Les noms Google Gemini
 * ont changé plusieurs fois — on tente dans l'ordre jusqu'à avoir 200.
 * La liste est mémoïsée après le premier succès pour éviter les
 * cascades inutiles.
 */
const TEXT_MODEL_FALLBACKS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
];
let memoizedTextModel: string | null = null;

/**
 * Génère un texte via Gemini (cascade fallback sur plusieurs modèles).
 * Retourne un résultat structuré pour faciliter le diag.
 */
export async function generateGeminiText(params: {
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
  apiKey?: string;
  model?: string;
}): Promise<GeminiTextResult> {
  const apiKey = params.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: "missing_api_key" };
  }

  const modelsToTry = params.model
    ? [params.model]
    : memoizedTextModel
      ? [memoizedTextModel, ...TEXT_MODEL_FALLBACKS.filter((m) => m !== memoizedTextModel)]
      : TEXT_MODEL_FALLBACKS;
  let lastError: GeminiTextResult | null = null;

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: params.prompt }] }],
          generationConfig: {
            temperature: params.temperature ?? 0.7,
            maxOutputTokens: params.maxOutputTokens ?? 600,
          },
        }),
      });

      const raw = await res.text();
      if (!res.ok) {
        lastError = {
          ok: false,
          reason: "http_error",
          status: res.status,
          detail: `model=${model} ${raw.slice(0, 400)}`,
        };
        // Si 404 (modèle n'existe pas) ou 400 (model not found), on tente
        // le modèle suivant. Autre erreur (429, 500+) : on abandonne la
        // cascade car l'API est up mais nous rejette.
        if (res.status === 404 || res.status === 400) continue;
        return lastError;
      }

      type GeminiResp = {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
          finishReason?: string;
        }>;
        promptFeedback?: { blockReason?: string };
      };
      const body = JSON.parse(raw) as GeminiResp;

      if (body.promptFeedback?.blockReason) {
        return {
          ok: false,
          reason: "safety_block",
          detail: body.promptFeedback.blockReason,
        };
      }

      const candidate = body.candidates?.[0];
      const text = candidate?.content?.parts
        ?.map((p) => p.text)
        .filter(Boolean)
        .join("\n");

      if (!text || text.trim().length === 0) {
        return {
          ok: false,
          reason: "empty_response",
          detail: `model=${model} finishReason=${candidate?.finishReason}`,
        };
      }

      // Succès : mémoïse le modèle qui a marché
      memoizedTextModel = model;
      return {
        ok: true,
        text: text.trim(),
        finish_reason: candidate?.finishReason,
      };
    } catch (err) {
      lastError = {
        ok: false,
        reason: "exception",
        detail: `model=${model} ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  return lastError ?? { ok: false, reason: "no_model_responded" };
}

/**
 * Génère une image via gemini-2.5-flash-image (Nano Banana Pro).
 * Retourne le base64 + mime_type si succès.
 */
export async function generateGeminiImage(params: {
  prompt: string;
  apiKey?: string;
}): Promise<GeminiImageResult> {
  const apiKey = params.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: "missing_api_key" };
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: params.prompt }] }],
      }),
    });

    const raw = await res.text();
    if (!res.ok) {
      return {
        ok: false,
        reason: "http_error",
        status: res.status,
        detail: raw.slice(0, 500),
      };
    }

    type GeminiImageResp = {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            inlineData?: { mimeType?: string; data?: string };
            inline_data?: { mime_type?: string; data?: string };
            text?: string;
          }>;
        };
        finishReason?: string;
      }>;
      promptFeedback?: { blockReason?: string };
    };
    const body = JSON.parse(raw) as GeminiImageResp;

    if (body.promptFeedback?.blockReason) {
      return {
        ok: false,
        reason: "safety_block",
        detail: body.promptFeedback.blockReason,
      };
    }

    const candidate = body.candidates?.[0];
    const parts = candidate?.content?.parts ?? [];

    // Le SDK retourne tantôt inlineData (camelCase), tantôt inline_data
    const imagePart = parts.find(
      (p) =>
        (p.inlineData?.data && p.inlineData?.mimeType) ||
        (p.inline_data?.data && p.inline_data?.mime_type),
    );

    const data = imagePart?.inlineData?.data ?? imagePart?.inline_data?.data;
    const mimeType =
      imagePart?.inlineData?.mimeType ??
      imagePart?.inline_data?.mime_type ??
      "image/png";

    if (!data) {
      return {
        ok: false,
        reason: "no_image_in_response",
        detail: candidate?.finishReason,
      };
    }

    return {
      ok: true,
      mime_type: mimeType,
      data_base64: data,
      finish_reason: candidate?.finishReason,
    };
  } catch (err) {
    return {
      ok: false,
      reason: "exception",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Nettoie un texte généré par un LLM : retire markdown, guillemets
 * englobants, préfixes/suffixes parasites courants.
 */
export function cleanLLMText(input: string): string {
  if (!input) return "";
  let t = input.trim();

  // Retire les blocs markdown de type ```...```
  t = t.replace(/^```[a-z]*\s*\n?/gim, "").replace(/\n?```\s*$/g, "");

  // Retire les guillemets englobants "..." ou «...»
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("«") && t.endsWith("»"))
  ) {
    t = t.slice(1, -1).trim();
  }

  // Retire les titres markdown #, ##, ###
  t = t.replace(/^#{1,6}\s+[^\n]+\n?/gim, "");

  // Retire les préfixes communs "Description : " / "Voici : "
  t = t.replace(/^(description\s*:|voici\s*:|voici le texte\s*:)\s*/i, "");

  // Collapse les lignes vides multiples
  t = t.replace(/\n{3,}/g, "\n\n").trim();

  return t;
}
