import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

// Use anon client — updates go through SECURITY DEFINER functions
// that bypass RLS (see Supabase migration stripe_webhook_functions)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** Map a Stripe lookup_key to a human-readable plan name */
function planLabel(lookupKey: string): string {
  if (lookupKey.startsWith("stampify_essential")) return "essential";
  if (lookupKey.startsWith("stampify_pro"))       return "pro";
  return lookupKey;
}

/** Map a Stripe subscription status to our internal status */
function mapStatus(stripeStatus: string): string {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    default:
      return "inactive";
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
  }
  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: import("stripe").Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const supabase = getSupabase();

  try {
    switch (event.type) {
      // ── Checkout completed ─────────────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as import("stripe").Stripe.Checkout.Session;
        const businessId     = session.client_reference_id;
        const customerId     = session.customer as string;
        const subscriptionId = session.subscription as string;
        const planKey        = (session.metadata?.plan ?? "");
        const plan           = planLabel(planKey);

        if (!businessId || !customerId || !subscriptionId) break;

        await supabase.rpc("stripe_activate_subscription", {
          p_business_id:    businessId,
          p_customer_id:    customerId,
          p_subscription_id: subscriptionId,
          p_plan:           plan,
        });
        break;
      }

      // ── Subscription updated (plan change, renewal, etc.) ──────────────────
      case "customer.subscription.updated": {
        const sub = event.data.object as import("stripe").Stripe.Subscription;
        const customerId     = sub.customer as string;
        const subscriptionId = sub.id;
        const status         = mapStatus(sub.status);
        const priceItem      = sub.items.data[0];
        const lookupKey      = priceItem?.price?.lookup_key ?? "";
        const plan           = planLabel(lookupKey);

        await supabase.rpc("stripe_update_subscription", {
          p_customer_id:    customerId,
          p_subscription_id: subscriptionId,
          p_plan:           plan,
          p_status:         status,
        });
        break;
      }

      // ── Subscription cancelled ─────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as import("stripe").Stripe.Subscription;
        const customerId     = sub.customer as string;
        const subscriptionId = sub.id;

        await supabase.rpc("stripe_update_subscription", {
          p_customer_id:    customerId,
          p_subscription_id: subscriptionId,
          p_plan:           null,
          p_status:         "canceled",
        });
        break;
      }

      default:
        // Ignore other events
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
