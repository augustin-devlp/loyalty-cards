import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createAdminClient } from "@/lib/supabase/admin";
import { OrderReceipt } from "@/lib/pdf/OrderReceipt";

/**
 * POST /api/orders/[id]/receipt-email
 *
 * Génère le PDF de la commande et l'envoie par email au restaurant
 * (restaurants.receipt_email). Appelé en fire-and-forget depuis le POST
 * /api/orders de rialto-lausanne.
 *
 * Auth par shared secret (header x-webhook-secret) pour éviter de spammer.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  console.log("[receipt-email] START", { orderId: params.id });

  // Auth : shared secret OU session utilisateur (pour le bouton Resend)
  const secret = req.headers.get("x-webhook-secret");
  const expected = process.env.ORDER_WEBHOOK_SECRET;
  const secretOK = !!expected && secret === expected;

  if (!secretOK) {
    // Essaye session
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.warn("[receipt-email] UNAUTHORIZED — no secret and no session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!expected) {
    console.warn(
      "[receipt-email] ⚠️ ORDER_WEBHOOK_SECRET missing (env var). Email will still try via session auth.",
    );
  }

  const admin = createAdminClient();
  console.log("[receipt-email] auth OK, fetching order");

  const { data: order } = await admin
    .from("orders")
    .select(
      "id, restaurant_id, order_number, customer_name, customer_phone, payer_phone, fulfillment_type, delivery_address, delivery_postal_code, delivery_city, delivery_floor_door, delivery_instructions, delivery_fee, total_amount, notes, requested_pickup_time, created_at",
    )
    .eq("id", params.id)
    .single();
  if (!order) {
    return NextResponse.json(
      { error: "Commande introuvable" },
      { status: 404 },
    );
  }

  const [{ data: items }, { data: restaurant }] = await Promise.all([
    admin
      .from("order_items")
      .select(
        "quantity, item_name_snapshot, item_price_snapshot, selected_options, subtotal, notes",
      )
      .eq("order_id", order.id),
    admin
      .from("restaurants")
      .select("name, address, phone, receipt_email")
      .eq("id", order.restaurant_id)
      .single(),
  ]);

  if (!restaurant) {
    return NextResponse.json(
      { error: "Restaurant introuvable" },
      { status: 404 },
    );
  }

  const to = restaurant.receipt_email ?? "augustin-domenget@stampify.ch";
  console.log("[receipt-email] target email:", to);

  // Génère le PDF
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await renderToBuffer(
      OrderReceipt({
        order: order as never,
        items: (items ?? []) as never,
        restaurant: restaurant as never,
      }),
    );
    console.log("[receipt-email] PDF rendered", { bytes: pdfBuffer.length });
  } catch (err) {
    console.error("[receipt-email] PDF render failed", err);
    return NextResponse.json(
      { error: "PDF render failed" },
      { status: 500 },
    );
  }

  // Format imposé : objet minimaliste "Ticket de commande XXX", corps court,
  // PDF nommé "ticket-commande-XXX.pdf"
  const subject = `Ticket de commande ${order.order_number}`;
  const html = `<p>Bonjour,</p>
<p>Nouvelle commande acceptée. Retrouvez le ticket en pièce jointe.</p>
<p>Rialto</p>`;

  const base64 = pdfBuffer.toString("base64");
  const filename = `ticket-commande-${order.order_number}.pdf`;

  let sent = false;
  let lastError: string | null = null;
  let provider: "resend" | "brevo" | null = null;

  // Essai 1 : Resend (si clé configurée)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    console.log("[receipt-email] trying Resend…");
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Stampify <noreply@stampify.ch>",
          to: [to],
          subject,
          html,
          attachments: [{ filename, content: base64 }],
        }),
      });
      if (res.ok) {
        sent = true;
        provider = "resend";
        console.log("[receipt-email] ✓ Resend SUCCESS");
      } else {
        lastError = `Resend ${res.status}: ${await res.text()}`;
        console.error("[receipt-email] Resend failed", lastError);
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.error("[receipt-email] Resend error", err);
    }
  } else {
    console.log("[receipt-email] RESEND_API_KEY missing — skipping Resend");
  }

  // Essai 2 : Brevo email (fallback)
  if (!sent) {
    console.log("[receipt-email] trying Brevo email fallback…");
    const brevoKey = process.env.BREVO_API_KEY;
    if (!brevoKey) {
      console.error(
        "[receipt-email] ⚠️ Neither RESEND_API_KEY nor BREVO_API_KEY set!",
      );
      return NextResponse.json(
        {
          ok: false,
          error: "Aucun provider email configuré (RESEND_API_KEY ou BREVO_API_KEY)",
          lastResendError: lastError,
        },
        { status: 500 },
      );
    }
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoKey,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Stampify", email: "noreply@stampify.ch" },
          to: [{ email: to }],
          subject,
          htmlContent: html,
          attachment: [{ name: filename, content: base64 }],
        }),
      });
      if (res.ok) {
        sent = true;
        provider = "brevo";
        console.log("[receipt-email] ✓ Brevo SUCCESS");
      } else {
        lastError = `Brevo ${res.status}: ${await res.text()}`;
        console.error("[receipt-email] Brevo fallback failed", lastError);
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.error("[receipt-email] Brevo fallback error", err);
    }
  }

  if (!sent) {
    console.error("[receipt-email] ✗ FAILED", { orderId: order.id, lastError });
    return NextResponse.json(
      { ok: false, error: lastError ?? "Envoi échoué" },
      { status: 500 },
    );
  }
  console.log("[receipt-email] ✓ DONE", {
    orderId: order.id,
    orderNumber: order.order_number,
    to,
    provider,
  });
  return NextResponse.json({ ok: true, to, provider });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
