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
 * Génère un texte via gemini-2.0-flash.
 * Retourne un résultat structuré pour faciliter le diag.
 */
export async function generateGeminiText(params: {
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
  apiKey?: string;
}): Promise<GeminiTextResult> {
  const apiKey = params.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: "missing_api_key" };
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

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
      return {
        ok: false,
        reason: "http_error",
        status: res.status,
        detail: raw.slice(0, 500),
      };
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
        detail: candidate?.finishReason,
      };
    }

    return {
      ok: true,
      text: text.trim(),
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
