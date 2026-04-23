import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/admin/gemini-models?pin=0808
 *
 * Liste tous les modèles Gemini accessibles avec GEMINI_API_KEY.
 * Utile pour diagnostiquer les 404 de cascade (quel modèle image/
 * texte est vraiment disponible pour cette clé).
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pin = url.searchParams.get("pin") ?? "";
  const expectedPin = process.env.ADMIN_PIN ?? "0808";

  if (pin !== expectedPin) {
    return NextResponse.json({ error: "PIN invalide" }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY non configuré" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models",
      {
        headers: { "x-goog-api-key": apiKey },
        cache: "no-store",
      },
    );

    const rawText = await res.text();
    let raw: unknown;
    try {
      raw = JSON.parse(rawText);
    } catch {
      raw = rawText;
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "ListModels failed", status: res.status, raw },
        { status: 502 },
      );
    }

    const data = raw as {
      models?: Array<{
        name: string;
        displayName?: string;
        supportedGenerationMethods?: string[];
      }>;
    };

    const models = (data.models ?? []).map((m) => ({
      name: m.name.replace(/^models\//, ""),
      display: m.displayName,
      methods: m.supportedGenerationMethods ?? [],
    }));

    // Classement par utilité
    const textModels = models.filter(
      (m) =>
        m.methods.includes("generateContent") &&
        !/image|vision/i.test(m.name),
    );
    const imageModels = models.filter(
      (m) =>
        (m.methods.includes("generateContent") ||
          m.methods.includes("generateImage")) &&
        /image|imagen/i.test(m.name),
    );

    return NextResponse.json({
      total: models.length,
      text_candidates: textModels.map((m) => m.name),
      image_candidates: imageModels.map((m) => m.name),
      all_models: models,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "fetch_failed",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
