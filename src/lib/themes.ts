export const THEME_TEMPLATES = {
  clair:  { label: "Clair",   accent: "#534AB7", dark: false, bg: "#f9fafb", surface: "#ffffff" },
  sombre: { label: "Sombre",  accent: "#a78bfa", dark: true,  bg: "#111827", surface: "#1f2937" },
  neutre: { label: "Neutre",  accent: "#8B6914", dark: false, bg: "#faf8f4", surface: "#ffffff" },
  vif:    { label: "Vif",     accent: "#378ADD", dark: false, bg: "#f9fafb", surface: "#ffffff" },
} as const;

export type ThemeTemplate = keyof typeof THEME_TEMPLATES;

/** Compute all CSS var values from accent + dark mode */
export function buildThemeVars(accent: string, dark: boolean) {
  // Subtle background for active states (accent at 12% opacity)
  const hex = accent.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const accentSub = `rgba(${r},${g},${b},0.12)`;

  return {
    "--dash-accent":     accent,
    "--dash-accent-sub": accentSub,
    "--dash-bg":         dark ? "#111827" : "#f9fafb",
    "--dash-surface":    dark ? "#1f2937" : "#ffffff",
    "--dash-text":       dark ? "#f9fafb" : "#111827",
    "--dash-muted":      dark ? "#9ca3af" : "#6b7280",
    "--dash-border":     dark ? "#374151" : "#e5e7eb",
    "--dash-nav-bg":     dark ? "#1f2937" : "#ffffff",
  };
}
