import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const CLIENT_ID     = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI  = "https://stampify.ch/api/auth/google/callback";
const BASE_URL      = "https://stampify.ch";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get("code");
  const state = searchParams.get("state"); // businessId
  const error = searchParams.get("error");

  if (error || !code || !state) {
    console.warn("[google/callback] OAuth denied or missing params:", error);
    return NextResponse.redirect(`${BASE_URL}/dashboard/settings?google=error`);
  }

  // Exchange authorization code for access_token + refresh_token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri:  REDIRECT_URI,
      grant_type:    "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const body = await tokenRes.text();
    console.error("[google/callback] Token exchange failed:", tokenRes.status, body);
    return NextResponse.redirect(`${BASE_URL}/dashboard/settings?google=error`);
  }

  const tokens = await tokenRes.json() as {
    access_token:  string;
    refresh_token?: string;
    expires_in:    number;
  };

  if (!tokens.refresh_token) {
    // Google only returns refresh_token on first consent — user must revoke and reconnect
    console.error("[google/callback] No refresh_token returned (already granted?)");
  }

  // Persist tokens in businesses table (service role bypasses RLS)
  const adminDb = createAdminClient();
  const { error: dbErr } = await adminDb
    .from("businesses")
    .update({
      google_access_token:  tokens.access_token,
      ...(tokens.refresh_token ? { google_refresh_token: tokens.refresh_token } : {}),
    })
    .eq("id", state);

  if (dbErr) {
    console.error("[google/callback] DB update error:", dbErr.message);
    return NextResponse.redirect(`${BASE_URL}/dashboard/settings?google=error`);
  }

  console.log(`[google/callback] ✅ Tokens stored for business ${state}`);
  return NextResponse.redirect(`${BASE_URL}/dashboard/settings?google=connected`);
}
