import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

/**
 * POST /api/stripe/portal
 * Creates a Stripe Customer Portal session for the authenticated user.
 * Returns: { url: string }
 */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!business?.stripe_customer_id) {
    return NextResponse.json(
      { error: "Aucun abonnement Stripe trouvé." },
      { status: 404 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.stampify.ch";

  const session = await getStripe().billingPortal.sessions.create({
    customer: business.stripe_customer_id,
    return_url: `${baseUrl}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}
