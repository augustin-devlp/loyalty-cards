/**
 * Utilitaires pour matcher un numéro de téléphone saisi par un user
 * contre une base historique où les formats peuvent être mixtes
 * (+41..., 41..., 07..., etc.).
 *
 * Voir Phase 9 FIX 1 : les customers existants ont été créés avant que
 * la normalisation E.164 soit en place partout — on tolère donc en
 * lookup mais on force E.164 avec "+" à toute nouvelle création.
 */
import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Génère toutes les variantes plausibles d'un numéro pour une recherche
 * SQL robuste. Chaque variante est un string qui peut matcher
 * `customers.phone` en strict equality.
 *
 * Inclut :
 *   - le numéro brut (nettoyé des espaces/ponctuations)
 *   - E.164 avec "+" (format canonique)
 *   - E.164 sans "+"
 *   - Format NATIONAL avec 0 (ex: "0791234567" pour CH)
 *   - Version "chiffres uniquement" (fallback LIKE)
 *
 * Les doublons sont éliminés. Pas d'I/O, pure fonction.
 */
export function phoneLookupVariants(raw: string): {
  variants: string[];
  digitsOnly: string;
  canonical: string | null;
} {
  const trimmed = (raw ?? "").trim().replace(/[\s\-().]/g, "");
  const digitsOnly = trimmed.replace(/[^\d]/g, "");

  const set = new Set<string>();
  if (trimmed) set.add(trimmed);
  if (digitsOnly) set.add(digitsOnly);

  // Tentatives libphonenumber CH puis FR puis international
  const parsers = ["CH", "FR", undefined] as const;
  let canonical: string | null = null;

  for (const region of parsers) {
    const parsed = parsePhoneNumberFromString(
      trimmed,
      region as "CH" | "FR" | undefined,
    );
    if (parsed?.isValid()) {
      const e164 = parsed.format("E.164"); // "+41791234567"
      const e164NoPlus = e164.replace(/^\+/, ""); // "41791234567"
      const national = parsed
        .format("NATIONAL")
        .replace(/[\s\-().]/g, ""); // "0791234567"
      set.add(e164);
      set.add(e164NoPlus);
      set.add(national);
      if (!canonical) canonical = e164;
      break; // la première région qui valide suffit
    }
  }

  // Variante "force +" sur le digitsOnly si on n'a rien obtenu
  if (digitsOnly && !canonical) {
    if (digitsOnly.startsWith("41") || digitsOnly.startsWith("33")) {
      set.add(`+${digitsOnly}`);
    }
  }

  return {
    variants: Array.from(set),
    digitsOnly,
    canonical,
  };
}

/**
 * Version strictement canonique pour INSERT en DB. Retourne toujours
 * le format E.164 avec "+" si valide, sinon null.
 */
export function canonicalE164(raw: string): string | null {
  const parsers = ["CH", "FR", undefined] as const;
  const cleaned = (raw ?? "").trim().replace(/[\s\-().]/g, "");
  if (!cleaned) return null;
  for (const region of parsers) {
    const parsed = parsePhoneNumberFromString(
      cleaned,
      region as "CH" | "FR" | undefined,
    );
    if (parsed?.isValid()) return parsed.format("E.164");
  }
  return null;
}
