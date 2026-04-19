import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  RIALTO_BUSINESS_ID,
  RIALTO_SPIN_WHEEL_ID,
  rialtoCorsHeaders,
} from "@/lib/rialtoConstants";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(req.headers.get("origin")),
  });
}

type GoogleReview = {
  relativePublishTimeDescription?: string;
  rating?: number;
  publishTime?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

/**
 * Convertit la frequency d'une roue en millisecondes de validité.
 */
function frequencyToMs(frequency: string | null | undefined): number {
  switch (frequency) {
    case "daily":
      return 24 * 60 * 60 * 1000;
    case "weekly":
      return 7 * 24 * 60 * 60 * 1000;
    case "monthly":
      return 30 * 24 * 60 * 60 * 1000;
    case "once":
      return Number.MAX_SAFE_INTEGER; // un seul claim à vie
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}

/**
 * POST /api/rialto/loyalty/verify-review
 * Body: { customer_id }
 *
 * Vérifie qu'un avis Google récent (< 2 min) existe pour ce business et
 * le "claim" pour ce customer. Un seul avis = roue + loterie débloquées
 * jusqu'à expires_at.
 *
 * Réponses :
 *   200 { ok: true, claim: {...}, reason: 'existing-claim' | 'new-claim' }
 *   200 { ok: false, reason: 'no-recent-review' | 'already-claimed' | 'api-missing' }
 *   400 { error: ... }
 */
export async function POST(req: NextRequest) {
  const headers = rialtoCorsHeaders(req.headers.get("origin"));
  const body = (await req.json().catch(() => null)) as {
    customer_id?: string;
  } | null;
  if (!body?.customer_id) {
    return NextResponse.json(
      { error: "customer_id requis" },
      { status: 400, headers },
    );
  }

  const admin = createAdminClient();

  // 1) Check claim actif (expires_at > now) pour ce customer
  const nowIso = new Date().toISOString();
  const { data: existing } = await admin
    .from("google_review_claims")
    .select("id, review_author_name, claimed_at, expires_at")
    .eq("customer_id", body.customer_id)
    .eq("business_id", RIALTO_BUSINESS_ID)
    .gt("expires_at", nowIso)
    .order("claimed_at", { ascending: false })
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json(
      { ok: true, claim: existing[0], reason: "existing-claim" },
      { headers },
    );
  }

  // 2) Besoin d'un nouvel avis → Google Places
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = await getPlaceId(admin);

  if (!apiKey) {
    console.warn(
      "[verify-review] GOOGLE_PLACES_API_KEY missing — bypass en mode dev",
    );
    return NextResponse.json(
      {
        ok: false,
        reason: "api-missing",
        dev_message:
          "GOOGLE_PLACES_API_KEY manquante sur Vercel. Contactez Augustin.",
      },
      { status: 200, headers },
    );
  }

  if (!placeId) {
    return NextResponse.json(
      { ok: false, reason: "place-id-missing" },
      { status: 200, headers },
    );
  }

  let reviews: GoogleReview[] = [];
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        method: "GET",
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "reviews",
        },
        // Google Places a un cache CDN — on force frais.
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const text = await res.text();
      console.error("[verify-review] Google Places error", res.status, text);
      return NextResponse.json(
        { ok: false, reason: "google-api-error", status: res.status },
        { status: 200, headers },
      );
    }
    const body2 = (await res.json()) as { reviews?: GoogleReview[] };
    reviews = body2.reviews ?? [];
  } catch (err) {
    console.error("[verify-review] Google Places fetch failed", err);
    return NextResponse.json(
      { ok: false, reason: "google-api-error" },
      { status: 200, headers },
    );
  }

  // 3) Filtre les avis < 2 min (fenêtre de validation)
  const WINDOW_MS = 2 * 60 * 1000;
  const nowMs = Date.now();
  const recentReviews = reviews
    .map((r) => ({
      author: r.authorAttribution?.displayName ?? "",
      time: r.publishTime ? new Date(r.publishTime).getTime() : 0,
      rating: r.rating ?? 0,
      publishTime: r.publishTime ?? "",
    }))
    .filter((r) => r.author && r.time > 0 && nowMs - r.time <= WINDOW_MS);

  if (recentReviews.length === 0) {
    return NextResponse.json(
      { ok: false, reason: "no-recent-review" },
      { status: 200, headers },
    );
  }

  // 4) Essaie de claim chaque avis récent
  // La contrainte UNIQUE (business_id, review_author_name, review_time)
  // garantit qu'un avis ne peut être pris que par un seul customer.
  const { data: wheel } = await admin
    .from("spin_wheels")
    .select("frequency")
    .eq("id", RIALTO_SPIN_WHEEL_ID)
    .maybeSingle();
  const freqMs = frequencyToMs(wheel?.frequency as string | undefined);
  const expiresAt = new Date(
    Math.min(nowMs + freqMs, nowMs + 365 * 24 * 60 * 60 * 1000),
  ).toISOString();

  for (const r of recentReviews) {
    const { data: inserted, error: insertErr } = await admin
      .from("google_review_claims")
      .insert({
        customer_id: body.customer_id,
        business_id: RIALTO_BUSINESS_ID,
        review_author_name: r.author,
        review_time: r.publishTime,
        expires_at: expiresAt,
      })
      .select("id, review_author_name, claimed_at, expires_at")
      .single();

    if (insertErr) {
      // 23505 = unique_violation → cet avis est déjà claim par quelqu'un
      if (insertErr.code === "23505") continue;
      console.error("[verify-review] insert failed", insertErr);
      continue;
    }
    if (inserted) {
      return NextResponse.json(
        { ok: true, claim: inserted, reason: "new-claim" },
        { headers },
      );
    }
  }

  return NextResponse.json(
    { ok: false, reason: "already-claimed" },
    { status: 200, headers },
  );
}

async function getPlaceId(admin: ReturnType<typeof createAdminClient>): Promise<string | null> {
  // Priorité : env var, sinon DB
  if (process.env.NEXT_PUBLIC_RIALTO_PLACE_ID) {
    return process.env.NEXT_PUBLIC_RIALTO_PLACE_ID;
  }
  const { data } = await admin
    .from("businesses")
    .select("google_place_id")
    .eq("id", RIALTO_BUSINESS_ID)
    .maybeSingle();
  return (data?.google_place_id as string | null) ?? null;
}
