import React from "react";

export type QuickActionSlug =
  | "dashboard"
  | "commandes"
  | "cards"
  | "stats"
  | "reservations"
  | "spin-wheel"
  | "lottery"
  | "sms"
  | "commandes-menu"
  | "promotions"
  | "gift-cards"
  | "marketplace"
  | "click-collect"
  | "team"
  | "billing"
  | "appearance"
  | "establishments"
  | "settings";

export type QuickActionDef = {
  slug: QuickActionSlug;
  label: string;
  href: string;
  /** SVG inline icon builder (taille 22px). */
  icon: (props: { className?: string }) => JSX.Element;
};

const svg = (paths: React.ReactNode, className?: string) =>
  React.createElement(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: className ?? "w-5 h-5",
      "aria-hidden": true,
    },
    paths,
  );

export const QUICK_ACTIONS: Record<QuickActionSlug, QuickActionDef> = {
  dashboard: {
    slug: "dashboard",
    label: "Accueil",
    href: "/dashboard",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("path", {
            key: "1",
            d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
          }),
          React.createElement("polyline", {
            key: "2",
            points: "9 22 9 12 15 12 15 22",
          }),
        ],
        className,
      ),
  },
  commandes: {
    slug: "commandes",
    label: "Commandes",
    href: "/dashboard/commandes",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("path", {
            key: "1",
            d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",
          }),
          React.createElement("line", { key: "2", x1: 3, y1: 6, x2: 21, y2: 6 }),
          React.createElement("path", { key: "3", d: "M16 10a4 4 0 0 1-8 0" }),
        ],
        className,
      ),
  },
  cards: {
    slug: "cards",
    label: "Cartes",
    href: "/dashboard/cards",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("rect", {
            key: "1",
            x: 2,
            y: 5,
            width: 20,
            height: 14,
            rx: 2,
          }),
          React.createElement("line", { key: "2", x1: 2, y1: 10, x2: 22, y2: 10 }),
        ],
        className,
      ),
  },
  stats: {
    slug: "stats",
    label: "Stats",
    href: "/dashboard/stats",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("line", { key: "1", x1: 18, y1: 20, x2: 18, y2: 10 }),
          React.createElement("line", { key: "2", x1: 12, y1: 20, x2: 12, y2: 4 }),
          React.createElement("line", { key: "3", x1: 6, y1: 20, x2: 6, y2: 14 }),
        ],
        className,
      ),
  },
  reservations: {
    slug: "reservations",
    label: "Réservations",
    href: "/dashboard/reservations",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("rect", {
            key: "1",
            x: 3,
            y: 4,
            width: 18,
            height: 18,
            rx: 2,
          }),
          React.createElement("line", { key: "2", x1: 16, y1: 2, x2: 16, y2: 6 }),
          React.createElement("line", { key: "3", x1: 8, y1: 2, x2: 8, y2: 6 }),
          React.createElement("line", { key: "4", x1: 3, y1: 10, x2: 21, y2: 10 }),
        ],
        className,
      ),
  },
  "spin-wheel": {
    slug: "spin-wheel",
    label: "Roue",
    href: "/dashboard/spin-wheel",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("circle", { key: "1", cx: 12, cy: 12, r: 10 }),
          React.createElement("line", { key: "2", x1: 12, y1: 2, x2: 12, y2: 22 }),
          React.createElement("line", { key: "3", x1: 2, y1: 12, x2: 22, y2: 12 }),
        ],
        className,
      ),
  },
  lottery: {
    slug: "lottery",
    label: "Loterie",
    href: "/dashboard/lottery",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("polyline", {
            key: "1",
            points: "20 12 20 22 4 22 4 12",
          }),
          React.createElement("rect", {
            key: "2",
            x: 2,
            y: 7,
            width: 20,
            height: 5,
          }),
          React.createElement("line", { key: "3", x1: 12, y1: 22, x2: 12, y2: 7 }),
        ],
        className,
      ),
  },
  sms: {
    slug: "sms",
    label: "SMS",
    href: "/dashboard/sms",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("path", {
            key: "1",
            d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
          }),
        ],
        className,
      ),
  },
  "commandes-menu": {
    slug: "commandes-menu",
    label: "Menu resto",
    href: "/dashboard/commandes/menu",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("line", { key: "1", x1: 3, y1: 6, x2: 21, y2: 6 }),
          React.createElement("line", { key: "2", x1: 3, y1: 12, x2: 21, y2: 12 }),
          React.createElement("line", { key: "3", x1: 3, y1: 18, x2: 21, y2: 18 }),
        ],
        className,
      ),
  },
  promotions: {
    slug: "promotions",
    label: "Promos",
    href: "/dashboard/promotions",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("path", {
            key: "1",
            d: "M20 12V4H12L4 12l8 8 8-8z",
          }),
          React.createElement("circle", { key: "2", cx: 9, cy: 9, r: 1 }),
        ],
        className,
      ),
  },
  "gift-cards": {
    slug: "gift-cards",
    label: "Cadeaux",
    href: "/dashboard/gift-cards",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("rect", {
            key: "1",
            x: 3,
            y: 8,
            width: 18,
            height: 13,
            rx: 2,
          }),
          React.createElement("path", { key: "2", d: "M3 14h18" }),
          React.createElement("path", { key: "3", d: "M12 8v13" }),
        ],
        className,
      ),
  },
  marketplace: {
    slug: "marketplace",
    label: "Marketplace",
    href: "/dashboard/marketplace",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("path", { key: "1", d: "M3 6h18l-2 12H5L3 6z" }),
          React.createElement("path", { key: "2", d: "M3 6 4 2h16l1 4" }),
        ],
        className,
      ),
  },
  "click-collect": {
    slug: "click-collect",
    label: "Réservation",
    href: "/dashboard/click-collect",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("path", {
            key: "1",
            d: "M21 10V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10",
          }),
          React.createElement("path", { key: "2", d: "M1 6h22v4H1z" }),
          React.createElement("line", { key: "3", x1: 12, y1: 6, x2: 12, y2: 22 }),
        ],
        className,
      ),
  },
  team: {
    slug: "team",
    label: "Équipe",
    href: "/dashboard/team",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("path", {
            key: "1",
            d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
          }),
          React.createElement("circle", { key: "2", cx: 9, cy: 7, r: 4 }),
          React.createElement("path", {
            key: "3",
            d: "M23 21v-2a4 4 0 0 0-3-3.87",
          }),
        ],
        className,
      ),
  },
  billing: {
    slug: "billing",
    label: "Facturation",
    href: "/dashboard/billing",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("rect", {
            key: "1",
            x: 3,
            y: 6,
            width: 18,
            height: 13,
            rx: 2,
          }),
          React.createElement("path", { key: "2", d: "M3 10h18" }),
        ],
        className,
      ),
  },
  appearance: {
    slug: "appearance",
    label: "Apparence",
    href: "/dashboard/appearance",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("circle", { key: "1", cx: 12, cy: 12, r: 10 }),
          React.createElement("path", { key: "2", d: "M12 2a10 10 0 0 0 0 20" }),
        ],
        className,
      ),
  },
  establishments: {
    slug: "establishments",
    label: "Établiss.",
    href: "/dashboard/establishments",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("path", {
            key: "1",
            d: "M3 21V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14",
          }),
          React.createElement("path", {
            key: "2",
            d: "M11 21V11a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10",
          }),
        ],
        className,
      ),
  },
  settings: {
    slug: "settings",
    label: "Réglages",
    href: "/dashboard/settings",
    icon: ({ className }) =>
      svg(
        [
          React.createElement("circle", { key: "1", cx: 12, cy: 12, r: 3 }),
          React.createElement("path", {
            key: "2",
            d: "M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
          }),
        ],
        className,
      ),
  },
};

export const DEFAULT_QUICK_ACTIONS: QuickActionSlug[] = [
  "dashboard",
  "cards",
  "stats",
];

/** Parse et valide un tableau JSONB venant de la DB. */
export function parseQuickActions(raw: unknown): QuickActionSlug[] {
  if (!Array.isArray(raw) || raw.length !== 3)
    return [...DEFAULT_QUICK_ACTIONS];
  const valid = raw.filter(
    (v): v is QuickActionSlug =>
      typeof v === "string" && Object.prototype.hasOwnProperty.call(QUICK_ACTIONS, v),
  );
  if (valid.length !== 3) return [...DEFAULT_QUICK_ACTIONS];
  return valid;
}
