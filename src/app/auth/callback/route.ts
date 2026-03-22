import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles Supabase email confirmation callbacks (PKCE flow).
 *
 * Supabase redirects here after email confirmation with ?code=XXX.
 * We exchange the code for a session, then redirect to `next` (default /dashboard).
 *
 * Usage in emailRedirectTo:
 *   /auth/callback?next=/dashboard/scan
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  console.log(`[auth/callback] code=${code ? "present" : "absent"} next=${next}`);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] exchangeCodeForSession error:", error.message);
      return NextResponse.redirect(`${origin}/login?error=confirmation_failed`);
    }

    console.log(`[auth/callback] Session établie, redirection vers ${next}`);
    return NextResponse.redirect(`${origin}${next}`);
  }

  console.error("[auth/callback] Pas de code dans l'URL");
  return NextResponse.redirect(`${origin}/login?error=missing_code`);
}
