export interface StampShape {
  value: string;
  label: string;
  emoji: string;
  /** SVG path(s) for clean rendering at small size */
  svg: string;
}

export const STAMP_SHAPES: StampShape[] = [
  {
    value: "circle",
    label: "Cercle",
    emoji: "⭕",
    svg: `<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>`,
  },
  {
    value: "star",
    label: "Sushi",
    emoji: "🍣",
    // Two nigiri pieces: oval rice base + arched fish topping each
    svg: `<ellipse cx="6.5" cy="17" rx="4.5" ry="2.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
<path d="M2 14.5c1.5-2.5 9-2.5 9 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
<ellipse cx="17.5" cy="17" rx="4.5" ry="2.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
<path d="M13 14.5c1.5-2.5 9-2.5 9 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>`,
  },
  {
    value: "heart",
    label: "Cœur",
    emoji: "❤️",
    svg: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>`,
  },
  {
    value: "croissant",
    label: "Baguette",
    emoji: "🥖",
    // Long rectangle tilted -15° + 3 vertical score lines (become diagonal after rotation)
    svg: `<g transform="rotate(-15 12 12)">
<rect x="2.5" y="10.5" width="19" height="3" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
<line x1="7.5" y1="10.5" x2="7.5" y2="13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<line x1="12" y1="10.5" x2="12" y2="13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<line x1="16.5" y1="10.5" x2="16.5" y2="13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</g>`,
  },
  {
    value: "coffee",
    label: "Café",
    emoji: "☕",
    // Coffee cup with handle + two wavy S-curve steam wisps
    svg: `<path d="M17 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
<path d="M6.5 1C6.5 2.5 8 3.5 6.5 5S5 6.5 6.5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
<path d="M10.5 1C10.5 2.5 12 3.5 10.5 5S9 6.5 10.5 7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>`,
  },
  {
    value: "scissors",
    label: "Ciseaux",
    emoji: "✂️",
    // Two ring handles on the left, two blades crossing toward the right
    svg: `<circle cx="6" cy="6" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
<circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
<line x1="20" y1="4" x2="8.12" y2="15.88" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<line x1="14.47" y1="14.48" x2="20" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
  },
  {
    value: "flower",
    label: "Fleur",
    emoji: "🌸",
    // 6 petals rotated 60° apart around centre + filled centre circle
    svg: `<ellipse cx="12" cy="5" rx="2.5" ry="4" fill="currentColor" transform="rotate(0 12 12)"/>
<ellipse cx="12" cy="5" rx="2.5" ry="4" fill="currentColor" transform="rotate(60 12 12)"/>
<ellipse cx="12" cy="5" rx="2.5" ry="4" fill="currentColor" transform="rotate(120 12 12)"/>
<ellipse cx="12" cy="5" rx="2.5" ry="4" fill="currentColor" transform="rotate(180 12 12)"/>
<ellipse cx="12" cy="5" rx="2.5" ry="4" fill="currentColor" transform="rotate(240 12 12)"/>
<ellipse cx="12" cy="5" rx="2.5" ry="4" fill="currentColor" transform="rotate(300 12 12)"/>
<circle cx="12" cy="12" r="3.5" fill="white" stroke="currentColor" stroke-width="1"/>`,
  },
  {
    value: "crown",
    label: "Restaurant",
    emoji: "🍽️",
    // Plate (circle) centre + fork (left) + knife (right)
    svg: `<circle cx="12" cy="13" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/>
<line x1="5" y1="2" x2="5" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M3 2v5h4V2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<line x1="19" y1="2" x2="19" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M19 2c1 0 3 1.5 3 4.5S19 11 19 11" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  },
  {
    value: "diamond",
    label: "Diamant",
    emoji: "💎",
    svg: `<polygon points="12,2 22,9 12,22 2,9" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/><line x1="2" y1="9" x2="22" y2="9" stroke="currentColor" stroke-width="1.5"/>`,
  },
  {
    value: "lightning",
    label: "Éclair",
    emoji: "⚡",
    svg: `<polygon points="13,2 3,14 12,14 11,22 21,10 12,10" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>`,
  },
  {
    value: "leaf",
    label: "Panier",
    emoji: "🧺",
    // Shopping basket: handle arch + rectangular body + 2 horizontal weave lines
    svg: `<path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
<path d="M4 10h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
<line x1="6.5" y1="14" x2="17.5" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<line x1="6.5" y1="17" x2="17.5" y2="17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
  },
  {
    value: "pizza",
    label: "Pizza",
    emoji: "🍕",
    // Triangle slice with curved crust at base and visible toppings
    svg: `<path d="M12 2L2 22h20L12 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
<path d="M5 20C7 22 17 22 19 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
<circle cx="9" cy="15" r="1.5" fill="currentColor"/>
<circle cx="14" cy="13" r="1.5" fill="currentColor"/>
<circle cx="11" cy="10" r="1" fill="currentColor"/>`,
  },
  {
    value: "key",
    label: "Clé",
    emoji: "🔑",
    svg: `<circle cx="8" cy="10" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="21" y1="21" x2="11.71" y2="11.71" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="17" y1="17" x2="19" y2="19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="13" y1="13" x2="15" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
  },
  {
    value: "house",
    label: "Pressing",
    emoji: "👕",
    // Classic t-shirt outline: collar, body, sleeves
    svg: `<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>`,
  },
  {
    value: "sun",
    label: "Soleil",
    emoji: "☀️",
    svg: `<circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
  },
  {
    value: "moon",
    label: "Lune",
    emoji: "🌙",
    svg: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>`,
  },
  {
    value: "paw",
    label: "Patte",
    emoji: "🐾",
    // Large central pad + 4 toe pads above, like a real animal paw print
    svg: `<ellipse cx="12" cy="16.5" rx="4.5" ry="3.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
<circle cx="7.5" cy="12" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
<circle cx="11" cy="10.5" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
<circle cx="15" cy="10.5" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
<circle cx="18.5" cy="12" r="2" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  },
  {
    value: "rainbow",
    label: "Arc-en-ciel",
    emoji: "🌈",
    // 4 concentric arcs of decreasing radius — classic rainbow shape
    svg: `<path d="M3 18a9 9 0 0 1 18 0" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none"/>
<path d="M5.5 18a6.5 6.5 0 0 1 13 0" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
<path d="M8 18a4 4 0 0 1 8 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
<path d="M10 18a2 2 0 0 1 4 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>`,
  },
  {
    value: "butterfly",
    label: "Enso",
    emoji: "☯️",
    // Zen enso: almost-complete circle drawn in one brushstroke, gap at top-right
    svg: `<path d="M16.5 4.2A9 9 0 1 1 19.8 7.5" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  },
  {
    value: "nail",
    label: "Diamant",
    emoji: "💎",
    // Simple diamond: square losange + horizontal midline
    svg: `<polygon points="12,2 22,12 12,22 2,12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
<line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
  },
  {
    value: "laurel",
    label: "Lauriers",
    emoji: "🏅",
    // Central stem with 3 pairs of leaf-shaped paths fanning outward, tied at the base
    svg: `<path d="M12 22v-8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M12 19c-1-2.5-4-3.5-6-2.5 1 3 4 4.5 6 2.5z" fill="currentColor"/>
<path d="M12 19c1-2.5 4-3.5 6-2.5-1 3-4 4.5-6 2.5z" fill="currentColor"/>
<path d="M12 15c-1-2.5-4-3.5-6-2.5 1 3 4 4.5 6 2.5z" fill="currentColor"/>
<path d="M12 15c1-2.5 4-3.5 6-2.5-1 3-4 4.5-6 2.5z" fill="currentColor"/>
<path d="M12 11c-1-2-3.5-3-5.5-2 1 2.5 3.5 4 5.5 2z" fill="currentColor"/>
<path d="M12 11c1-2 3.5-3 5.5-2-1 2.5-3.5 4-5.5 2z" fill="currentColor"/>
<path d="M8 22h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  },
];

export type StampShapeValue = string;

export function getShape(value: string): StampShape {
  return STAMP_SHAPES.find((s) => s.value === value) ?? STAMP_SHAPES[0];
}
