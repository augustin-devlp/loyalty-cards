/**
 * Génère un short_code alphanumérique unique pour customer_cards.
 *
 * Alphabet sans caractères ambigus (0/O, 1/I/L) pour éviter les erreurs
 * de saisie manuelle. 8 chars × 31 symboles = ~850 trillions de combos,
 * collision extrêmement improbable.
 *
 * Double filet : un trigger DB (customer_cards_generate_short_code)
 * génère aussi automatiquement le code si NULL, donc ce helper est une
 * sécurité côté app mais pas strictement requis.
 */

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // 31 chars, pas de 0/O/1/I/L

export function generateShortCode(): string {
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return result;
}
