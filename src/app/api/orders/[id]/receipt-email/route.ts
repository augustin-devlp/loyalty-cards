import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { OrderReceipt } from "@/lib/pdf/OrderReceipt";

/**
 * POST /api/orders/[id]/receipt-email
 *
 * Génère le PDF du ticket de commande et l'envoie par email au restaurant
 * via Brevo (compte centralisé email + SMS). Déclenché :
 *  - automatiquement par PATCH /api/orders/[id] quand status='accepted'
 *    (via header x-webhook-secret = ORDER_WEBHOOK_SECRET)
 *  - manuellement par le bouton "📧 Ticket" sur chaque OrderCard
 *    (via session utilisateur authentifiée)
 *
 * Format strict :
 *  - Subject : "Ticket de commande R-2026-XXX"
 *  - Body HTML minimaliste
 *  - Attachment unique : ticket-commande-R-2026-XXX.pdf
 *  - Destinataire : restaurants.receipt_email
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  console.log("[email-brevo] START orderId=%s", params.id);

  // === 1) Auth : shared secret OU session user ===
  const secret = req.headers.get("x-webhook-secret");
  const expected = process.env.ORDER_WEBHOOK_SECRET;
  const hasValidSecret = !!expected && secret === expected;

  if (!hasValidSecret) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.log("[email-brevo] UNAUTHORIZED orderId=%s (no secret, no session)", params.id);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("[email-brevo] auth=session userId=%s", user.id);
  } else {
    console.log("[email-brevo] auth=webhook-secret");
  }

  // === 2) Warnings env vars ===
  if (!process.env.BREVO_API_KEY) {
    console.error(
      "[email-brevo] ⚠️ BREVO_API_KEY missing — emails won't send",
    );
  }
  if (!process.env.BREVO_SENDER_EMAIL) {
    console.warn(
      "[email-brevo] ⚠️ BREVO_SENDER_EMAIL missing — using default noreply@stampify.ch (must be DKIM-validated in Brevo)",
    );
  }

  const admin = createAdminClient();

  // === 3) Fetch order + items + restaurant ===
  const { data: order, error: orderErr } = await admin
    .from("orders")
    .select(
      "id, restaurant_id, order_number, customer_name, customer_phone, customer_email, payer_phone, fulfillment_type, delivery_address, delivery_postal_code, delivery_city, delivery_floor_door, delivery_instructions, delivery_fee, total_amount, notes, requested_pickup_time, created_at, housing_type, entry_code_1, entry_code_2, floor, apartment_number, doorbell_name, payment_method, payment_card_timing, payment_cash_bills",
    )
    .eq("id", params.id)
    .single();

  if (orderErr || !order) {
    console.error("[email-brevo] FAILED fetch order err=%s", orderErr?.message);
    return NextResponse.json(
      { error: "Commande introuvable" },
      { status: 404 },
    );
  }
  console.log(
    "[email-brevo] order fetched orderNumber=%s status=%s",
    order.order_number,
    (order as { status?: string }).status,
  );

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
    console.error("[email-brevo] FAILED restaurant not found");
    return NextResponse.json(
      { error: "Restaurant introuvable" },
      { status: 404 },
    );
  }

  const to = restaurant.receipt_email ?? "augustin-domenget@stampify.ch";
  console.log("[email-brevo] target=%s itemsCount=%d", to, (items ?? []).length);

  // === 4) Render PDF ===
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await renderToBuffer(
      OrderReceipt({
        order: order as never,
        items: (items ?? []) as never,
        restaurant: restaurant as never,
      }),
    );
    console.log("[email-brevo] PDF rendered bytes=%d", pdfBuffer.length);
  } catch (err) {
    console.error("[email-brevo] FAILED PDF render err=%s", err);
    return NextResponse.json(
      { error: "PDF render failed" },
      { status: 500 },
    );
  }

  // === 5) Envoi via Brevo transactional email ===
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? "noreply@stampify.ch";
  const senderName = process.env.BREVO_SENDER_NAME ?? "Rialto";
  console.log("[email-brevo] sender=%s name=%s", senderEmail, senderName);

  const subject = `Ticket de commande ${order.order_number}`;
  const htmlContent = `<p>Bonjour,</p><p>Nouvelle commande acceptée. Retrouvez le ticket en pièce jointe.</p><p>Rialto</p>`;
  const filename = `ticket-commande-${order.order_number}.pdf`;
  const base64 = pdfBuffer.toString("base64");

  if (!process.env.BREVO_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "BREVO_API_KEY non configurée" },
      { status: 500 },
    );
  }

  console.log("[email-brevo] Calling Brevo API...");
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email: to, name: "Rialto" }],
        subject,
        htmlContent,
        attachment: [{ name: filename, content: base64 }],
      }),
    });

    const raw = await res.text();
    let data: Record<string, unknown> = {};
    try {
      data = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    } catch {
      data = { rawBody: raw };
    }

    console.log(
      "[email-brevo] Brevo status=%d messageId=%s",
      res.status,
      (data.messageId as string | undefined) ?? "(none)",
    );

    if (!res.ok) {
      console.error(
        "[email-brevo] FAILED status=%d data=%j",
        res.status,
        data,
      );
      return NextResponse.json(
        {
          ok: false,
          error: (data.message as string) ?? `Brevo ${res.status}`,
          status: res.status,
          details: data,
        },
        { status: 500 },
      );
    }

    console.log(
      "[email-brevo] SUCCESS orderId=%s messageId=%s to=%s",
      order.id,
      data.messageId,
      to,
    );
    return NextResponse.json({
      ok: true,
      to,
      provider: "brevo",
      messageId: data.messageId ?? null,
    });
  } catch (err) {
    console.error("[email-brevo] FAILED fetch err=%s", err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
