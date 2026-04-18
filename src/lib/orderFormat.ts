import { TIMEZONE } from "./constants";

export function formatCHF(amount: number | string): string {
  return `${Number(amount).toFixed(2)} CHF`;
}

export function formatZurichHHMM(isoOrDate: string | Date | null): string {
  if (!isoOrDate) return "—";
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("fr-CH", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIMEZONE,
  });
}

export function formatZurichDateTime(isoOrDate: string | Date): string {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  return d.toLocaleString("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIMEZONE,
  });
}

export function todayZurichYYYYMMDD(now: Date = new Date()): string {
  // "DD.MM.YYYY" fr-CH → we need YYYY-MM-DD; build via parts
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}

export function isToday(iso: string, now: Date = new Date()): boolean {
  return todayZurichYYYYMMDD(new Date(iso)) === todayZurichYYYYMMDD(now);
}
