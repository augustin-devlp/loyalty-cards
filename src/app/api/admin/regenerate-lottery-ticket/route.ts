import { NextRequest, NextResponse } from "next/server";
import { generateTicketForOrder } from "@/lib/lotteryTickets";

/**
 * POST /api/admin/regenerate-lottery-ticket
 * Body: { order_id: string, pin: string }
 *
 * Re-joue generateTicketForOrder sur une commande précise. Utile pour
 * diagnostiquer un échec ou créer le ticket manuellement si le PATCH
 * n'a pas déclenché la génération (ex: commande acceptée avant le
 * déploiement de la logique).
 *
 * Idempotent : si le ticket existe déjà (order_id déjà lié), retourne
 * already_exists sans effet.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    order_id?: string;
    pin?: string;
  } | null;

  const expectedPin = process.env.ADMIN_PIN ?? "0808";
  if (body?.pin !== expectedPin) {
    return NextResponse.json({ error: "PIN invalide" }, { status: 401 });
  }

  if (!body?.order_id) {
    return NextResponse.json(
      { error: "order_id requis" },
      { status: 400 },
    );
  }

  const result = await generateTicketForOrder(body.order_id);
  return NextResponse.json({ order_id: body.order_id, ...result });
}
