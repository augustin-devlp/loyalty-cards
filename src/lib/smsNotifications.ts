import { sendSms } from "./brevo";
import { formatZurichHHMM } from "./orderFormat";
import type { OrderStatus } from "./constants";

type OrderForSms = {
  order_number: string;
  customer_phone: string;
  total_amount: number | string;
  requested_pickup_time: string | null;
};

/**
 * Envoie un SMS transactionnel au client lors d'un changement de statut.
 * Erreur Brevo → loggée mais non bloquante.
 */
export async function sendOrderStatusSms(
  order: OrderForSms,
  newStatus: OrderStatus,
): Promise<boolean> {
  const pickup = formatZurichHHMM(order.requested_pickup_time);
  const totalStr = `${Number(order.total_amount).toFixed(2)} CHF`;

  let message: string | null = null;
  switch (newStatus) {
    case "accepted":
      message = `Rialto a accepté votre commande #${order.order_number}. Préparation en cours. Prête vers ${pickup}. Avenue de Béthusy 29, Lausanne.`;
      break;
    case "preparing":
      message = `Votre commande Rialto #${order.order_number} est en préparation. On vous prévient dès qu'elle est prête.`;
      break;
    case "ready":
      message = `Votre commande Rialto #${order.order_number} est prête ! Vous pouvez venir la récupérer. Montant : ${totalStr} à régler sur place (espèces ou TWINT). Avenue de Béthusy 29, Lausanne. 021 312 64 60`;
      break;
    case "cancelled":
      message = `Votre commande Rialto #${order.order_number} a été annulée. Pour toute question, contactez-nous au 021 312 64 60.`;
      break;
    default:
      return false;
  }

  try {
    // Sender "Rialto" (6 chars, dans la limite Brevo de 11 alphanum).
    // Quand on aura d'autres restaurants, passer à un champ
    // restaurants.sms_sender configurable.
    await sendSms(order.customer_phone, message, "Rialto");
    return true;
  } catch (err) {
    console.error(
      "[smsNotifications] failed to send SMS for order",
      order.order_number,
      "status",
      newStatus,
      err,
    );
    return false;
  }
}
