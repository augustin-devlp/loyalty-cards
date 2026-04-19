import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Normalise un numéro en E.164 (ex: "+41791234567", "+33612345678").
 * Retourne null si invalide.
 *
 * Détection : CH en priorité (clientèle principale), fallback FR puis
 * interprétation internationale.
 */
export function normalizePhone(raw: string): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/[\s\-().]/g, "");
  if (!cleaned) return null;

  let parsed = parsePhoneNumberFromString(cleaned, "CH");
  if (parsed?.isValid()) return parsed.number;

  parsed = parsePhoneNumberFromString(cleaned, "FR");
  if (parsed?.isValid()) return parsed.number;

  parsed = parsePhoneNumberFromString(cleaned);
  if (parsed?.isValid()) return parsed.number;

  return null;
}

/**
 * Format Brevo pour SMS : E.164 sans le "+" (ex: "41791234567").
 * Retourne le raw tel quel en fallback si la validation échoue (on tente
 * quand même).
 */
export function toBrevoPhone(raw: string): string {
  const e164 = normalizePhone(raw);
  if (e164 && e164.startsWith("+")) return e164.slice(1);
  // Fallback : nettoie juste les espaces et supprime un éventuel "+"
  return raw.trim().replace(/[\s\-().]/g, "").replace(/^\+/, "");
}
