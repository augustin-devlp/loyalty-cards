import { formatZurichHHMM } from "./orderFormat";

export const TEMPLATE_KEYS = [
  "order_confirmation",
  "order_accepted",
  "order_preparing",
  "order_ready",
  "order_cancelled",
  "wheel_prize_code",
  "lottery_winner",
  "lottery_loser",
  "lottery_new",
  "lottery_result_winner",
  "lottery_result_loser",
  "lottery_ticket_received",
  "wheel_available_again",
  "birthday_offer",
  "loyalty_card_created",
] as const;
export type TemplateKey = (typeof TEMPLATE_KEYS)[number];

export const TEMPLATE_META: Record<
  TemplateKey,
  { title: string; description: string; defaultContent: string }
> = {
  order_confirmation: {
    title: "Confirmation de commande",
    description:
      "Envoyé automatiquement juste après la création de la commande.",
    defaultContent:
      "Rialto confirme votre commande {{order_number}}. Heure de retrait prévue : {{pickup_time}}. Suivi : {{order_url}}",
  },
  order_accepted: {
    title: "Commande acceptée",
    description:
      "Envoyé quand vous cliquez « Accepter » sur la colonne Nouvelles.",
    defaultContent:
      "Rialto a accepté votre commande {{order_number}}. Préparation en cours. Prête vers {{pickup_time}}. Av. de Béthusy 29, Lausanne.",
  },
  order_preparing: {
    title: "En préparation",
    description: "Envoyé quand vous passez la commande à « En préparation ».",
    defaultContent:
      "Votre commande Rialto {{order_number}} est en préparation. On vous prévient dès qu'elle est prête.",
  },
  order_ready: {
    title: "Commande prête",
    description: "Envoyé quand vous passez la commande à « Prête ».",
    defaultContent:
      "Votre commande Rialto {{order_number}} est prête ! Montant : {{total}} CHF à régler sur place (espèces ou TWINT). Av. de Béthusy 29, Lausanne. 021 312 64 60",
  },
  order_cancelled: {
    title: "Commande annulée",
    description:
      "Envoyé quand vous refusez ou annulez la commande. {{reason}} = motif saisi.",
    defaultContent:
      "Votre commande Rialto {{order_number}} a été annulée. {{reason}} Pour toute question : 021 312 64 60.",
  },
  wheel_prize_code: {
    title: "Code promo gagné (roue)",
    description:
      "Envoyé quand un client gagne un lot à la roue de la chance. {{code}} = code promo, {{reward_label}} = libellé du lot.",
    defaultContent:
      "Bravo {{customer_name}} ! Tu as gagne {{reward_label}} sur ta prochaine commande. Code : {{code}}. Valable 30 jours. Rialto.",
  },
  lottery_winner: {
    title: "Gagnant tombola",
    description:
      "Envoyé au tirage de la tombola. {{code}} = code promo, {{reward_label}} = lot gagné.",
    defaultContent:
      "Felicitations {{customer_name}} ! Tu as gagne {{reward_label}} a la tombola Rialto. Code : {{code}}. A utiliser sur ta prochaine commande (30 jours).",
  },
  birthday_offer: {
    title: "Offre anniversaire",
    description:
      "Envoyé pour l'anniversaire d'un client fidèle. {{code}} = code promo.",
    defaultContent:
      "Joyeux anniversaire {{customer_name}} ! Rialto t'offre {{reward_label}}. Code : {{code}}. Valable 30 jours.",
  },
  lottery_ticket_received: {
    title: "Ticket loterie reçu",
    description:
      "Envoyé au client quand sa commande est acceptée + une loterie est active. {{ticket_number}} = n° du ticket, {{lottery_name}} = nom de la loterie.",
    defaultContent:
      "🎟️ {{customer_name}}, ton ticket de loterie Rialto : n°{{ticket_number}}. Tirage bientôt, bonne chance !",
  },
  loyalty_card_created: {
    title: "Carte fidélité créée",
    description:
      "Envoyé automatiquement après création d'une carte fidélité. {{card_url}} = lien vers la carte avec QR code.",
    defaultContent:
      "Bienvenue chez Rialto {{customer_name}} ! Ta carte fidelite est prete. Montre-la a chaque commande : {{card_url}} - 1 pizza offerte apres 10 tampons !",
  },
  lottery_new: {
    title: "Nouvelle loterie lancée",
    description:
      "Batch envoyé à tous les membres du Rialto Club quand une nouvelle loterie est créée. Variables : {{prize_description}}, {{draw_date}}, {{lottery_url}}.",
    defaultContent:
      "🎟️ Nouvelle loterie Rialto ! {{prize_description}} a gagner. Tirage le {{draw_date}}. Passe commande pour recevoir ton ticket : {{lottery_url}}",
  },
  lottery_result_winner: {
    title: "Résultat loterie - gagnant",
    description:
      "Envoyé au gagnant d'une loterie tirée. Variables : {{prize_description}}, {{ticket_number}}, {{lottery_url}}.",
    defaultContent:
      "🎉 TU AS GAGNE la loterie Rialto ! {{prize_description}}. Presente ton ticket n°{{ticket_number}} chez Rialto pour reclamer : {{lottery_url}}",
  },
  lottery_result_loser: {
    title: "Résultat loterie - perdants",
    description:
      "Batch envoyé aux non-gagnants après tirage. Variables : {{winner_ticket}}.",
    defaultContent:
      "Loterie Rialto : pas cette fois 😔 Le gagnant est le n°{{winner_ticket}}. Prochaine loterie bientot, tu seras prevenu !",
  },
  lottery_loser: {
    title: "Loterie loser (legacy)",
    description: "Alias ancien de lottery_result_loser.",
    defaultContent:
      "Loterie Rialto : pas cette fois. Prochaine bientot !",
  },
  wheel_available_again: {
    title: "Roue disponible à nouveau",
    description:
      "Envoyé quand la fréquence est écoulée et que le client remplit les conditions pour respin. Variables : {{wheel_url}}.",
    defaultContent:
      "🎰 Tu peux retenter ta chance a la roue Rialto ! {{wheel_url}}",
  },
};

export const TEMPLATE_VARIABLES = [
  { key: "order_number", label: "Numéro de commande", example: "R-2026-042" },
  { key: "pickup_time", label: "Heure de retrait", example: "21:30" },
  { key: "customer_name", label: "Prénom client", example: "Augustin" },
  { key: "total", label: "Total", example: "47.50" },
  { key: "order_url", label: "URL suivi", example: "https://…/order/abc" },
  { key: "reason", label: "Motif (si annulation)", example: "" },
  { key: "restaurant_name", label: "Nom restaurant", example: "Rialto" },
  {
    key: "restaurant_phone",
    label: "Téléphone restaurant",
    example: "021 312 64 60",
  },
  {
    key: "restaurant_address",
    label: "Adresse restaurant",
    example: "Av. de Béthusy 29, Lausanne",
  },
  { key: "code", label: "Code promo", example: "RIA-7H2KM" },
  {
    key: "reward_label",
    label: "Libellé du lot gagné",
    example: "un Tiramisu",
  },
  {
    key: "card_url",
    label: "URL carte fidélité",
    example: "https://www.stampify.ch/c/K7H9M2P4",
  },
  { key: "prize_description", label: "Lot à gagner", example: "Pizza Bethusy + 2 bières" },
  { key: "draw_date", label: "Date de tirage", example: "30 mai" },
  { key: "ticket_number", label: "Numéro de ticket loterie", example: "0247" },
  { key: "lottery_name", label: "Nom de la loterie", example: "Loterie de Mai" },
  { key: "winner_ticket", label: "Numéro du ticket gagnant", example: "0132" },
  { key: "lottery_url", label: "URL loterie", example: "https://rialto-lausanne.vercel.app/rialto-club/loterie" },
  { key: "ticket_number", label: "Numéro de ticket gagnant", example: "0247" },
  { key: "winner_ticket", label: "Numéro ticket du gagnant", example: "0123" },
  { key: "wheel_url", label: "URL roue", example: "https://rialto-lausanne.vercel.app/rialto-club/roue" },
] as const;

export type TemplateVariableKey = (typeof TEMPLATE_VARIABLES)[number]["key"];

export type TemplateContext = Partial<Record<TemplateVariableKey, string>>;

/**
 * Remplace les {{variables}} dans un template par les valeurs du contexte.
 * Les variables inconnues ou non fournies sont remplacées par une chaîne vide.
 */
export function renderTemplate(
  content: string,
  ctx: TemplateContext,
): string {
  return content
    .replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (_m, key: string) => {
      const k = key.toLowerCase() as TemplateVariableKey;
      return (ctx[k] ?? "").trim();
    })
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Construit un contexte à partir d'une row orders + infos restaurant. */
export function buildContext(params: {
  order: {
    order_number: string;
    customer_name?: string | null;
    customer_phone?: string | null;
    total_amount: number | string;
    requested_pickup_time: string | null;
    cancellation_reason?: string | null;
    id: string;
  };
  restaurant: {
    name: string;
    phone: string | null;
    address: string | null;
  };
  siteUrl?: string;
}): TemplateContext {
  const { order, restaurant, siteUrl } = params;
  const firstName = (order.customer_name ?? "").split(" ")[0] ?? "";
  return {
    order_number: order.order_number,
    pickup_time: formatZurichHHMM(order.requested_pickup_time),
    customer_name: firstName,
    total: Number(order.total_amount).toFixed(2),
    order_url: siteUrl ? `${siteUrl.replace(/\/$/, "")}/order/${order.id}` : "",
    reason: order.cancellation_reason ?? "",
    restaurant_name: restaurant.name,
    restaurant_phone: restaurant.phone ?? "",
    restaurant_address: restaurant.address ?? "",
  };
}
