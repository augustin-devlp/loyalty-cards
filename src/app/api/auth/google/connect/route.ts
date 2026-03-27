import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CLIENT_ID    = process.env.GOOGLE_CLIENT_ID!;
const REDIRECT_URI = "https://stampify.ch/api/auth/google/callback";
const SCOPE        = "https://www.googleapis.com/auth/business.manage";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect("https://stampify.ch/login");
  }

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id",     CLIENT_ID);
  url.searchParams.set("redirect_uri",  REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope",         SCOPE);
  url.searchParams.set("access_type",   "offline");
  url.searchParams.set("prompt",        "consent"); // force refresh_token issuance
  url.searchParams.set("state",         user.id);   // pass businessId as state

  return NextResponse.redirect(url.toString());
}
