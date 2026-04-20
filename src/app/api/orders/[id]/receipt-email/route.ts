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
  const secret = req.headers.get("x-webhook-secret");
  const expected = process.env.ORDER_WEBHOOK_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

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
  } catch (err) {
    console.error("[receipt-email] PDF render failed", err);
    return NextResponse.json(
      { error: "PDF render failed" },
      { status: 500 },
    );
  }

  const subject = `Nouvelle commande ${order.order_number} · ${restaurant.name}`;
  const typeLabel =
    order.fulfillment_type === "delivery"
      ? "🚴 Livraison à domicile"
      : "🏪 Retrait en magasin";
  const html = `
    <h2 style="font-family:system-ui">Nouvelle commande ${escapeHtml(order.order_number)}</h2>
    <p>Type : <strong>${typeLabel}</strong></p>
    <p>Client : <strong>${escapeHtml(order.customer_name)}</strong> · ${escapeHtml(order.customer_phone)}</p>
    ${
      order.fulfillment_type === "delivery"
        ? `<p>Adresse : ${escapeHtml(order.delivery_address ?? "")} · ${escapeHtml(order.delivery_postal_code ?? "")} ${escapeHtml(order.delivery_city ?? "")}</p>`
        : ""
    }
    <p>Total : <strong>${Number(order.total_amount).toFixed(2)} CHF</strong></p>
    <p>Le ticket PDF est joint à ce mail.</p>
    <hr/>
    <p style="color:#6b7280;font-size:12px">Stampify — envoyé automatiquement</p>
  `;

  const base64 = pdfBuffer.toString("base64");
  const filename = `commande-${order.order_number}.pdf`;

  let sent = false;
  let lastError: string | null = null;

  // Essai 1 : Resend (si clé configurée)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
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
      } else {
        lastError = `Resend ${res.status}: ${await res.text()}`;
        console.error("[receipt-email] Resend failed", lastError);
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.error("[receipt-email] Resend error", err);
    }
  }

  // Essai 2 : Brevo email (fallback)
  if (!sent) {
    const brevoKey = process.env.BREVO_API_KEY;
    if (!brevoKey) {
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
    return NextResponse.json(
      { ok: false, error: lastError ?? "Envoi échoué" },
      { status: 500 },
    );
  }
  console.log("[receipt-email] sent", { orderId: order.id, to });
  return NextResponse.json({ ok: true, to });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
