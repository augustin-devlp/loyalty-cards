/**
 * IDs de référence pour le compte Stampify de Rialto.
 * Toutes les APIs et pages liées à Rialto pointent vers ces valeurs.
 */
export const RIALTO_RESTAURANT_ID = "046d930d-a4cd-4a43-a11a-7f76bfe74b06";
export const RIALTO_BUSINESS_ID = "59b10af2-5dbc-4ddd-a659-c49f44804bff";
export const RIALTO_CARD_ID = "f4cb1a3f-fc5c-40eb-87db-8d2c2b0a8b5f";
export const RIALTO_SPIN_WHEEL_ID = "37933bc4-9adf-4aa2-91fc-b422ce026c41";
export const RIALTO_LOTTERY_ID = "aadf3919-e81c-4fef-8ea4-60d871e1121f";

export const ALLOWED_RIALTO_ORIGINS = [
  "https://rialto-lausanne.ch",
  "https://www.rialto-lausanne.ch",
  "https://rialto-lausanne.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

export function rialtoCorsHeaders(
  origin: string | null,
  methods = "GET, POST, OPTIONS",
): Record<string, string> {
  const allowOrigin =
    origin && ALLOWED_RIALTO_ORIGINS.includes(origin)
      ? origin
      : ALLOWED_RIALTO_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}
