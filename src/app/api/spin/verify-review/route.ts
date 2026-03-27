import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const CLIENT_ID     = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

// Exchange a refresh_token for a fresh access_token
async function getFreshAccessToken(refreshToken: string): Promise<string | null> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type:    "refresh_token",
      refresh_token: refreshToken,
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  if (!res.ok) {
    console.error("[spin/verify-review] Token refresh failed:", res.status, await res.text());
    return null;
  }
  const data = await res.json() as { access_token?: string };
  return data.access_token ?? null;
}

export async function POST(req: NextRequest) {
  const { businessId } = await req.json() as { businessId?: string };
  if (!businessId) {
    return NextResponse.json({ error: "businessId requis" }, { status: 400 });
  }

  const adminDb = createAdminClient();

  // Fetch credentials
  const { data: biz } = await adminDb
    .from("businesses")
    .select("google_refresh_token, google_place_id")
    .eq("id", businessId)
    .single();

  if (!biz?.google_refresh_token || !biz?.google_place_id) {
    return NextResponse.json({
      verified: false,
      message: "Google Business non connecté pour ce commerce.",
    });
  }

  // Get fresh access token
  const accessToken = await getFreshAccessToken(biz.google_refresh_token);
  if (!accessToken) {
    return NextResponse.json({
      verified: false,
      message: "Impossible de contacter Google. Réessayez dans quelques instants.",
    });
  }

  // Fetch the 5 most recent reviews
  const reviewsRes = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/-/locations/${encodeURIComponent(biz.google_place_id)}/reviews?orderBy=updateTime+desc&pageSize=5`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!reviewsRes.ok) {
    const body = await reviewsRes.text();
    console.error("[spin/verify-review] Google API error:", reviewsRes.status, body);
    return NextResponse.json({
      verified: false,
      message: "Nous n'avons pas trouvé votre avis. Attendez 2 minutes et réessayez.",
    });
  }

  const reviewsData = await reviewsRes.json() as { reviews?: Array<{ updateTime: string }> };
  const reviews = reviewsData.reviews ?? [];

  // Check if any review was posted in the last 10 minutes
  const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
  const recentReview = reviews.find((r) => new Date(r.updateTime) > tenMinAgo);

  if (recentReview) {
    console.log("[spin/verify-review] ✅ Recent review found for business", businessId);
    return NextResponse.json({ verified: true });
  }

  return NextResponse.json({
    verified: false,
    message: "Nous n'avons pas trouvé votre avis. Attendez 2 minutes et réessayez.",
  });
}
