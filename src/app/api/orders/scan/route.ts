import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderStatusSms } from "@/lib/smsNotifications";
import { RIALTO_CARD_ID } from "@/lib/rialtoConstants";

/**
 * GET /api/orders/scan?number=R-2026-XXX
 *
 * Endpoint public scanné par QR code au comptoir Rialto. Si la commande est
 * en status "ready", on la passe en "completed" + +1 tampon fidélité +
 * (éventuel) SMS. Retourne une page HTML simple pour confirmation visuelle.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const orderNumber = url.searchParams.get("number")?.trim();

  if (!orderNumber) {
    return htmlResponse(
      400,
      "Paramètre manquant",
      "Le paramètre <code>number</code> est obligatoire.",
    );
  }

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select(
      "id, restaurant_id, order_number, customer_name, customer_phone, customer_id, status, total_amount, requested_pickup_time",
    )
    .eq("order_number", orderNumber)
    .single();

  if (!order) {
    return htmlResponse(
      404,
      "Commande introuvable",
      `Aucune commande trouvée avec le numéro <strong>${escapeHtml(
        orderNumber,
      )}</strong>.`,
    );
  }

  if (order.status === "completed") {
    return htmlResponse(
      200,
      "Déjà validée",
      `La commande <strong>${escapeHtml(
        order.order_number,
      )}</strong> a déjà été récupérée.`,
      { color: "#6b7280" },
    );
  }

  if (order.status !== "ready") {
    return htmlResponse(
      409,
      "Pas encore prête",
      `La commande <strong>${escapeHtml(
        order.order_number,
      )}</strong> est au statut <em>${escapeHtml(
        order.status,
      )}</em>. Elle doit être en « Prête » pour pouvoir être validée.`,
      { color: "#b45309" },
    );
  }

  // Passe en completed
  const { error: updErr } = await admin
    .from("orders")
    .update({ status: "completed" })
    .eq("id", order.id);
  if (updErr) {
    return htmlResponse(
      500,
      "Erreur serveur",
      `Impossible de valider la commande : ${escapeHtml(updErr.message)}`,
    );
  }

  // +1 tampon fidélité Stampify natif
  if (order.customer_id) {
    await admin.rpc("increment_stampify_stamps", {
      p_customer_id: order.customer_id,
      p_card_id: RIALTO_CARD_ID,
    });
  }

  // SMS de remerciement (si template enabled)
  void sendOrderStatusSms(
    {
      id: order.id,
      restaurant_id: order.restaurant_id,
      order_number: order.order_number,
      customer_phone: order.customer_phone,
      customer_name: order.customer_name ?? null,
      total_amount: order.total_amount,
      requested_pickup_time: order.requested_pickup_time,
    },
    "completed" as never,
  ).catch(() => null); // completed n'a pas de template par défaut → skip silencieux

  return htmlResponse(
    200,
    "Commande validée ✓",
    `<strong>${escapeHtml(
      order.order_number,
    )}</strong> · ${escapeHtml(order.customer_name ?? "")}<br/>Total : ${Number(
      order.total_amount,
    ).toFixed(2)} CHF`,
    { color: "#059669" },
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlResponse(
  status: number,
  title: string,
  body: string,
  opts?: { color?: string },
): Response {
  const color = opts?.color ?? "#dc2626";
  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(title)} · Rialto</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,Inter,system-ui,sans-serif;background:#f9fafb;min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:24px}
  .card{max-width:360px;width:100%;background:#fff;border-radius:24px;padding:32px;box-shadow:0 10px 40px rgba(0,0,0,.08);text-align:center}
  h1{margin:0 0 12px;color:${color};font-size:24px;font-weight:900}
  p{margin:0;color:#374151;font-size:15px;line-height:1.5}
  code{background:#f3f4f6;padding:2px 6px;border-radius:6px;font-size:13px}
  .logo{width:48px;height:48px;border-radius:12px;background:#E30613;color:#fff;font-weight:900;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px}
</style>
</head>
<body>
  <main class="card">
    <div class="logo">R</div>
    <h1>${escapeHtml(title)}</h1>
    <p>${body}</p>
  </main>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
