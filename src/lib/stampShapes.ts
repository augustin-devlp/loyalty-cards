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
    label: "Étoile",
    emoji: "⭐",
    svg: `<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>`,
  },
  {
    value: "heart",
    label: "Cœur",
    emoji: "❤️",
    svg: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>`,
  },
  {
    value: "croissant",
    label: "Croissant",
    emoji: "🥐",
    // Crescent shape: outer 9-radius arc + inner 6-radius arc → clean moon/croissant
    svg: `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" fill="currentColor"/>`,
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
    svg: `<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" fill="none"/><ellipse cx="12" cy="5" rx="2.5" ry="3.5" stroke="currentColor" stroke-width="1.5" fill="none"/><ellipse cx="12" cy="19" rx="2.5" ry="3.5" stroke="currentColor" stroke-width="1.5" fill="none"/><ellipse cx="5" cy="12" rx="3.5" ry="2.5" stroke="currentColor" stroke-width="1.5" fill="none"/><ellipse cx="19" cy="12" rx="3.5" ry="2.5" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  },
  {
    value: "crown",
    label: "Couronne",
    emoji: "👑",
    // 3-spike royal crown: side spikes at y=9, center spike at y=6, gems at each tip
    svg: `<path d="M2 18L5 9l5 4 2-7 2 7 5-4 3 9" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<line x1="2" y1="18" x2="22" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
<circle cx="5" cy="9" r="1.5" fill="currentColor"/>
<circle cx="12" cy="6" r="1.5" fill="currentColor"/>
<circle cx="19" cy="9" r="1.5" fill="currentColor"/>`,
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
    label: "Feuille",
    emoji: "🍃",
    svg: `<path d="M17 8C8 10 5.9 16.17 3.82 19c3.25-1.45 8.1-3.61 12.18-5C18.5 10.5 20 4 20 4S17.5 6.5 17 8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/><line x1="3.82" y1="19" x2="8" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
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
    label: "Maison",
    emoji: "🏠",
    svg: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/><polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`,
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
    label: "Papillon",
    emoji: "🦋",
    // 4 filled wings (upper pair larger, lower pair smaller) + body line
    svg: `<path d="M12 8C12 4.5 9 2 6 3 5 7 8 10.5 12 10Z" fill="currentColor"/>
<path d="M12 8C12 4.5 15 2 18 3 19 7 16 10.5 12 10Z" fill="currentColor"/>
<path d="M12 14C12 11 9 9 5.5 10.5 6.5 14 9.5 16.5 12 15Z" fill="currentColor"/>
<path d="M12 14C12 11 15 9 18.5 10.5 17.5 14 14.5 16.5 12 15Z" fill="currentColor"/>
<line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
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
