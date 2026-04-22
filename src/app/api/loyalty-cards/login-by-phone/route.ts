import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  RIALTO_CARD_ID,
  rialtoCorsHeaders,
} from "@/lib/rialtoConstants";
import { toBrevoPhone } from "@/lib/phone";

/**
 * POST /api/loyalty-cards/login-by-phone
 *
 * Retrouve une carte fidélité à partir d'un numéro de téléphone.
 * Permet à un customer qui a vidé son cache / changé d'appareil de
 * se reconnecter à son compte Rialto Club existant.
 *
 * Body : { phone: string, business_id?: string, card_id?: string }
 *
 * Sécurité :
 *   - Retourne le short_code (secret court 8 chars) si trouvé → le
 *     client peut ensuite afficher /c/[shortCode] sans autre auth.
 *     C'est volontaire : le short_code EST le token (pas besoin de
 *     complexifier tant que le business n'est pas sensible).
 *   - Rate limit best-effort : max 5 tentatives / 60s par IP+phone
 *     (en mémoire, reset au cold start Vercel).
 *   - Log [login-by-phone] avec un masque sur le numéro pour audit.
 *
 * Réponse :
 *   200 { ok: true, short_code, customer_id, first_name, card_id }
 *   200 { ok: false, reason: "not_found" }
 *   429 { ok: false, reason: "rate_limited" }
 *   400 { ok: false, reason: "invalid_phone" }
 */

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(req.headers.get("origin"), "POST, OPTIONS"),
  });
}

/* ─── Rate limit en mémoire (best-effort) ─────────────────────────── */
const attempts = new Map<string, { count: number; firstAt: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now });
    return true;
  }
  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) return false;
  return true;
}

function maskPhone(phone: string): string {
  if (phone.length < 6) return "***";
  return `${phone.slice(0, 4)}***${phone.slice(-2)}`;
}

export async function POST(req: NextRequest) {
  const headers = rialtoCorsHeaders(
    req.headers.get("origin"),
    "POST, OPTIONS",
  );

  const body = (await req.json().catch(() => null)) as {
    phone?: string;
    business_id?: string;
    card_id?: string;
  } | null;

  if (!body?.phone?.trim()) {
    return NextResponse.json(
      { ok: false, reason: "invalid_phone" },
      { status: 400, headers },
    );
  }

  // Normalise en E.164 sans + (format que la DB stocke via toBrevoPhone)
  const phone = toBrevoPhone(body.phone);
  if (!phone || phone.length < 8) {
    return NextResponse.json(
      { ok: false, reason: "invalid_phone" },
      { status: 400, headers },
    );
  }

  // Rate limit : IP + 6 derniers chiffres du téléphone pour tolérer le
  // cas "plusieurs clients sur même IP entreprise".
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const rateKey = `${ip}:${phone.slice(-6)}`;
  if (!checkRateLimit(rateKey)) {
    console.warn("[login-by-phone] rate_limited", {
      ip,
      phone: maskPhone(phone),
    });
    return NextResponse.json(
      { ok: false, reason: "rate_limited" },
      { status: 429, headers },
    );
  }

  const admin = createAdminClient();

  // Le client Rialto passe généralement card_id=RIALTO_CARD_ID.
  // On tolère aussi business_id pour future généralisation multi-
  // restaurants. Si aucun des deux : on cherche par card_id Rialto
  // par défaut (comportement actuel du site).
  const targetCardId = body.card_id ?? RIALTO_CARD_ID;

  // Les clients stockent le téléphone en formats variés. On cherche
  // avec plusieurs formats possibles pour max de tolérance.
  // toBrevoPhone renvoie sans "+" (ex "41791234567"). La DB stocke
  // souvent avec "+" (ex "+41791234567") ou sans — on essaie les 2.
  const variants = [phone, `+${phone}`];

  const { data: cards } = await admin
    .from("customer_cards")
    .select(
      `
      id,
      short_code,
      current_stamps,
      customer:customer_id (
        id,
        first_name,
        phone
      )
      `,
    )
    .eq("card_id", targetCardId)
    .limit(50);

  // Filtre côté Node pour tolérer les variantes de format téléphone
  // (la DB a du historique avec/sans "+" selon les migrations)
  const match = (cards ?? []).find((row) => {
    const customer = Array.isArray(row.customer) ? row.customer[0] : row.customer;
    const cPhone = (customer?.phone as string | undefined) ?? "";
    const normCPhone = cPhone.replace(/[^\d]/g, "");
    return variants.some((v) => {
      const vDigits = v.replace(/[^\d]/g, "");
      return normCPhone === vDigits;
    });
  });

  if (!match) {
    console.log("[login-by-phone] not_found", { phone: maskPhone(phone) });
    return NextResponse.json(
      { ok: false, reason: "not_found" },
      { status: 200, headers },
    );
  }

  const customer = Array.isArray(match.customer)
    ? match.customer[0]
    : match.customer;
  const shortCode = match.short_code as string | null;

  // Si la carte existe mais n'a pas de short_code (bug Phase 5 ancien),
  // on en génère un maintenant pour qu'elle soit connectable.
  let effectiveShortCode = shortCode;
  if (!effectiveShortCode) {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    for (let i = 0; i < 3 && !effectiveShortCode; i++) {
      const candidate = Array.from({ length: 8 }, () =>
        alphabet[Math.floor(Math.random() * alphabet.length)],
      ).join("");
      const { data: existing } = await admin
        .from("customer_cards")
        .select("id")
        .eq("short_code", candidate)
        .maybeSingle();
      if (!existing) {
        await admin
          .from("customer_cards")
          .update({ short_code: candidate })
          .eq("id", match.id);
        effectiveShortCode = candidate;
      }
    }
    if (!effectiveShortCode) {
      console.error("[login-by-phone] failed to backfill short_code", {
        card_id: match.id,
      });
      return NextResponse.json(
        { ok: false, reason: "short_code_missing" },
        { status: 500, headers },
      );
    }
  }

  console.log("[login-by-phone] found", {
    phone: maskPhone(phone),
    card_id: match.id,
    short_code: effectiveShortCode,
  });

  return NextResponse.json(
    {
      ok: true,
      short_code: effectiveShortCode,
      customer_id: customer?.id ?? null,
      first_name: (customer?.first_name as string | undefined) ?? "",
      card_id: match.id,
    },
    { headers },
  );
}
