import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/admin/brevo-sms-credits?pin=0808
 *
 * Récupère le solde de crédits SMS Brevo via l'API account.
 *
 * Brevo retourne une structure du type :
 * {
 *   email, firstName, lastName, companyName,
 *   plan: [
 *     { type: "smsCampaign", credits: N, creditsType: "sendLimit" },
 *     { type: "sms", credits: N, creditsType: "sendLimit" },
 *     { type: "marketing", ... },
 *     ...
 *   ]
 * }
 *
 * On retourne les crédits SMS pertinents + le raw pour inspection.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pin = url.searchParams.get("pin") ?? "";
  const expectedPin = process.env.ADMIN_PIN ?? "0808";

  if (pin !== expectedPin) {
    return NextResponse.json({ error: "PIN invalide" }, { status: 401 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "BREVO_API_KEY non configuré" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/account", {
      method: "GET",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
      },
      cache: "no-store",
    });

    const rawText = await res.text();
    let raw: unknown;
    try {
      raw = JSON.parse(rawText);
    } catch {
      raw = rawText;
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Brevo API error",
          status: res.status,
          raw,
        },
        { status: 502 },
      );
    }

    const data = raw as {
      email?: string;
      plan?: Array<{
        type: string;
        credits?: number;
        creditsType?: string;
        startDate?: string;
        endDate?: string;
        userLimit?: number;
      }>;
    };

    const smsPlan =
      data.plan?.find((p) => p.type === "sms") ??
      data.plan?.find((p) => p.type === "smsCampaign");
    const creditsRemaining = Number(smsPlan?.credits ?? 0);

    return NextResponse.json({
      ok: true,
      account_email: data.email ?? null,
      credits_remaining: creditsRemaining,
      plan_type: smsPlan?.type ?? "unknown",
      credits_type: smsPlan?.creditsType ?? null,
      // Estimation : 1 SMS CH = 1 crédit (tarif Brevo standard)
      estimated_sms_ch_left: creditsRemaining,
      critical: creditsRemaining < 100,
      last_check: new Date().toISOString(),
      raw,
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
