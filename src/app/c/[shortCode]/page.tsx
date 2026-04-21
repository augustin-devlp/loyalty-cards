import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import LoyaltyCardDisplay from "./LoyaltyCardDisplay";

export const dynamic = "force-dynamic";

async function loadCard(shortCode: string) {
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
      card_id,
      customer:customer_id (id, first_name, last_name, phone),
      card:card_id (id, card_name, reward_description, stamps_required, business_id)
      `,
    )
    .eq("short_code", shortCode.toUpperCase())
    .maybeSingle();

  if (!data) return null;

  // Supabase nested select renvoie card/customer en tant qu'object ou array
  // selon la version — on normalise.
  const customer = Array.isArray(data.customer)
    ? data.customer[0]
    : data.customer;
  const card = Array.isArray(data.card) ? data.card[0] : data.card;

  return {
    id: data.id as string,
    current_stamps: Number(data.current_stamps ?? 0),
    rewards_claimed: Number(data.rewards_claimed ?? 0),
    qr_code_value: data.qr_code_value as string,
    short_code: data.short_code as string,
    first_name: (customer?.first_name as string) ?? "",
    last_name: (customer?.last_name as string) ?? "",
    phone: (customer?.phone as string) ?? "",
    card_name: (card?.card_name as string) ?? "Carte fidélité",
    reward_description:
      (card?.reward_description as string) ?? "Une récompense offerte",
    stamps_required: Number(card?.stamps_required ?? 10),
  };
}

export default async function PublicLoyaltyCardPage({
  params,
}: {
  params: { shortCode: string };
}) {
  const card = await loadCard(decodeURIComponent(params.shortCode));
  if (!card) return notFound();
  return <LoyaltyCardDisplay card={card} />;
}

export async function generateMetadata({
  params,
}: {
  params: { shortCode: string };
}) {
  return {
    title: `Carte fidélité Rialto · ${params.shortCode}`,
    description: "Votre carte de fidélité Rialto avec QR code à montrer au restaurant.",
  };
}
