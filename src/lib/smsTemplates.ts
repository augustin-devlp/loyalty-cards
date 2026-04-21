import { formatZurichHHMM } from "./orderFormat";

export const TEMPLATE_KEYS = [
  "order_confirmation",
  "order_accepted",
  "order_preparing",
  "order_ready",
  "order_cancelled",
  "wheel_prize_code",
  "lottery_winner",
  "birthday_offer",
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
