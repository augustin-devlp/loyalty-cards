/**
 * Constantes partagées côté dashboard commandes.
 *
 * RIALTO_ID : Mehmet (gérant Rialto) n'a pas encore de compte Stampify,
 * donc le restaurant_id est hardcodé pour l'instant. Quand il créera son
 * compte via /admin, on remplira restaurants.business_id = <son user id>
 * et on supprimera cette constante au profit d'une requête business-scoped.
 */
export const RIALTO_ID = "046d930d-a4cd-4a43-a11a-7f76bfe74b06";

/** Timezone de référence pour l'affichage des heures Rialto. */
export const TIMEZONE = "Europe/Zurich";

export const ORDER_STATUSES = [
  "new",
  "accepted",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
