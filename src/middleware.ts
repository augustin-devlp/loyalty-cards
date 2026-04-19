import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Inject x-pathname into the REQUEST headers so that server components
  // can read it via headers(). Setting it only on the response headers
  // would NOT make it visible to headers() in server layouts.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Recreate the response preserving our custom request headers
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            supabaseResponse.cookies.set(name, value, options as any)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /dashboard route
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Rediriger les utilisateurs authentifiés depuis /login et /signup UNIQUEMENT
  // s'ils ont une souscription active (= prêt pour le dashboard). Sinon on
  // laisse le formulaire visible pour qu'ils puissent se connecter avec un
  // autre compte, faire un reset password, etc.
  //
  // (Sans cette condition, un user loggé mais sans subscription active
  // tombe dans le chaînage /login → /dashboard → /subscribe et ne peut
  // jamais voir le formulaire de connexion.)
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup")
  ) {
    const { data: business } = await supabase
      .from("businesses")
      .select("subscription_status")
      .eq("id", user.id)
      .maybeSingle();

    if (business?.subscription_status === "active") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    // Pas de souscription active → on laisse voir le formulaire
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
