import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rialtoCorsHeaders } from "@/lib/rialtoConstants";

/**
 * GET /api/loyalty-cards/lookup?short_code=XXXXXXXX
 *
 * Endpoint public pour que le site Rialto (et d'autres domaines CORS
 * autorisés) puisse récupérer les infos d'une carte fidélité à partir
 * de son short_code, sans avoir à appeler Supabase directement.
 *
 * Retourne les infos publiques uniquement (pas d'email, pas d'adresse) :
 *   { card: { id, current_stamps, stamps_required, reward_description,
 *             qr_code_value, first_name, short_code } }
 * ou 404 si le short_code n'existe pas.
 */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: rialtoCorsHeaders(req.headers.get("origin")),
  });
}

export async function GET(req: NextRequest) {
  const headers = rialtoCorsHeaders(req.headers.get("origin"));
  const url = new URL(req.url);
  const shortCode = url.searchParams.get("short_code")?.trim().toUpperCase();

  if (!shortCode || shortCode.length !== 8) {
    return NextResponse.json(
      { error: "short_code (8 chars) requis" },
      { status: 400, headers },
    );
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("customer_cards")
    .select(
      `
      id,
      current_stamps,
      rewards_claimed,
      qr_code_value,
      short_code,
      is_fully_activated,
      customer:customer_id (first_name, phone, date_of_birth, gender),
      card:card_id (card_name, reward_description, stamps_required, business_id)
      `,
    )
    .eq("short_code", shortCode)
    .maybeSingle();

  if (!data) {
    return NextResponse.json(
      { error: "Carte introuvable" },
      { status: 404, headers },
    );
  }

  const customer = Array.isArray(data.customer) ? data.customer[0] : data.customer;
  const card = Array.isArray(data.card) ? data.card[0] : data.card;

  return NextResponse.json(
    {
      card: {
        id: data.id,
        short_code: data.short_code,
        current_stamps: Number(data.current_stamps ?? 0),
        stamps_required: Number(card?.stamps_required ?? 10),
        reward_description: (card?.reward_description as string) ?? "Une récompense",
        card_name: (card?.card_name as string) ?? "Carte fidélité",
        qr_code_value: data.qr_code_value,
        first_name: (customer?.first_name as string) ?? "",
        // phone masked pour affichage sans exposer le numéro complet
        phone_masked: maskPhone((customer?.phone as string) ?? ""),
        // Phase 11 C1 : flag activation 2e étape (date anniversaire)
        is_fully_activated: Boolean(
          (data as unknown as { is_fully_activated?: boolean }).is_fully_activated,
        ),
        has_birthday: Boolean(
          (customer as unknown as { date_of_birth?: string | null })?.date_of_birth,
        ),
      },
    },
    { headers },
  );
}

function maskPhone(phone: string): string {
  if (phone.length < 6) return "";
  // +41791234567 -> +41 79 XX XX 67
  const clean = phone.replace(/[^\d+]/g, "");
  if (clean.length < 8) return "";
  return `${clean.slice(0, -8)} XX XX ${clean.slice(-2)}`;
}
