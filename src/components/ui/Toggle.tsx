"use client";

type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
  tooltip?: string;
  size?: "sm" | "md";
  /** Affiche "Activé / Désactivé" à droite du switch. */
  showStateText?: boolean;
  activeColor?: string;
  inactiveColor?: string;
};

/**
 * Switch iOS-style avec états visuels très clairs.
 * - Fond vert #1d9e75 quand ON, gris #e5e7eb quand OFF
 * - Rond blanc qui glisse
 * - Texte optionnel "Activé / Désactivé" à côté
 */
export default function Toggle({
  checked,
  onChange,
  label,
  hint,
  disabled,
  tooltip,
  size = "md",
  showStateText,
  activeColor = "#1d9e75",
  inactiveColor = "#e5e7eb",
}: Props) {
  const h = size === "sm" ? 20 : 26;
  const w = size === "sm" ? 36 : 46;
  const dot = size === "sm" ? 16 : 22;
  const pad = 2;

  const switchEl = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      title={tooltip}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex shrink-0 items-center rounded-full transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{
        height: h,
        width: w,
        background: checked ? activeColor : inactiveColor,
      }}
    >
      <span
        className="inline-block rounded-full bg-white shadow transition-transform"
        style={{
          height: dot,
          width: dot,
          transform: `translateX(${checked ? w - dot - pad : pad}px)`,
        }}
      />
    </button>
  );

  if (!label && !showStateText) return switchEl;

  return (
    <div className="flex items-center justify-between gap-4">
      {label && (
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-800">{label}</div>
          {hint && <div className="mt-0.5 text-xs text-gray-500">{hint}</div>}
        </div>
      )}
      <div className="flex items-center gap-2">
        {showStateText && (
          <span
            className={`text-xs font-semibold ${
              checked ? "text-emerald-700" : "text-gray-400"
            }`}
          >
            {checked ? "Activé" : "Désactivé"}
          </span>
        )}
        {switchEl}
      </div>
    </div>
  );
}
