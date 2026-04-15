import React from "react";

type LogoSize = "sm" | "md" | "lg";
type LogoColor = "dark" | "white" | "green";

interface StampifyLogoProps {
  size?: LogoSize;
  color?: LogoColor;
  iconOnly?: boolean;
}

const SIZES: Record<LogoSize, { icon: number; text: number }> = {
  sm: { icon: 20, text: 16 },
  md: { icon: 28, text: 20 },
  lg: { icon: 36, text: 26 },
};

const COLORS: Record<LogoColor, { icon: string; text: string }> = {
  dark: { icon: "#1d9e75", text: "#1A1A1A" },
  white: { icon: "#FFFFFF", text: "#FFFFFF" },
  green: { icon: "#FFFFFF", text: "#FFFFFF" },
};

/* ─── Stamp icon SVG ─── */
function StampIcon({ size, color }: { size: number; color: string }) {
  // SVG defined at 32×32 native, scaled to target size
  const scale = size / 32;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      {/* Rounded square border */}
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="6"
        stroke={color}
        strokeWidth="2"
        fill="transparent"
      />

      {/* Row 1 — all filled */}
      <circle cx="6"  cy="6"  r="2" fill={color} />
      <circle cx="16" cy="6"  r="2" fill={color} />
      <circle cx="26" cy="6"  r="2" fill={color} />

      {/* Row 2 — all filled */}
      <circle cx="6"  cy="16" r="2" fill={color} />
      <circle cx="16" cy="16" r="2" fill={color} />
      <circle cx="26" cy="16" r="2" fill={color} />

      {/* Row 3 — 1st filled, 2nd and 3rd empty */}
      <circle cx="6"  cy="26" r="2" fill={color} />
      <circle cx="16" cy="26" r="2" fill="transparent" stroke={color} strokeWidth="1.5" />
      <circle cx="26" cy="26" r="2" fill="transparent" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

/* ─── StampifyLogo component ─── */
export default function StampifyLogo({
  size = "md",
  color = "dark",
  iconOnly = false,
}: StampifyLogoProps) {
  const { icon: iconSize, text: textSize } = SIZES[size];
  const { icon: iconColor, text: textColor } = COLORS[color];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <StampIcon size={iconSize} color={iconColor} />
      {!iconOnly && (
        <span
          style={{
            fontSize: `${textSize}px`,
            fontWeight: 800,
            color: textColor,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
          }}
        >
          Stampify
        </span>
      )}
    </div>
  );
}
