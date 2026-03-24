/**
 * Detects whether the user is in Switzerland based on browser timezone
 * and navigator.language. Result is cached in localStorage for consistency
 * across pages within the same session.
 */
export function detectCountry(): "FR" | "CH" {
  if (typeof window === "undefined") return "FR";

  const cached = localStorage.getItem("stampify_country");
  if (cached === "FR" || cached === "CH") return cached;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const lang = navigator.language ?? "";
  const isCH =
    ["Europe/Zurich", "Europe/Busingen"].includes(tz) ||
    ["fr-CH", "de-CH", "it-CH", "rm-CH"].includes(lang);

  const country: "FR" | "CH" = isCH ? "CH" : "FR";
  localStorage.setItem("stampify_country", country);
  return country;
}
