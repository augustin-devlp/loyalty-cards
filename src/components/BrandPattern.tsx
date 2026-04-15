import React from "react";

interface BrandPatternProps {
  opacity?: number;
  color?: string;
  size?: number; // grid spacing
}

/**
 * Diagonal repeating stamp-icon grid.
 * Uses SVG <pattern> with offset rows for a brick/diagonal feel.
 * Position: absolute inset-0, pointer-events none, z-index 0.
 */
export default function BrandPattern({
  opacity = 0.04,
  color = "#1d9e75",
  size = 72,
}: BrandPatternProps) {
  // Stamp icon path data (scaled to 16px, centered in the pattern cell)
  // Stamp = rounded rect + 3x3 circle grid (7 filled, 2 empty)
  const half = size / 2;
  const iconSize = 16;
  const offset = (size - iconSize) / 2; // center icon in cell

  const PatternCell = ({ dx = 0, dy = 0 }: { dx?: number; dy?: number }) => (
    <g transform={`translate(${dx + offset}, ${dy + offset})`}>
      {/* Rounded rect border, scaled 16/32 = 0.5 of original */}
      <rect x="1" y="1" width="14" height="14" rx="3" stroke={color} strokeWidth="1" fill="transparent" />
      {/* Row 1 */}
      <circle cx="3"  cy="3"  r="1" fill={color} />
      <circle cx="8"  cy="3"  r="1" fill={color} />
      <circle cx="13" cy="3"  r="1" fill={color} />
      {/* Row 2 */}
      <circle cx="3"  cy="8"  r="1" fill={color} />
      <circle cx="8"  cy="8"  r="1" fill={color} />
      <circle cx="13" cy="8"  r="1" fill={color} />
      {/* Row 3 */}
      <circle cx="3"  cy="13" r="1" fill={color} />
      <circle cx="8"  cy="13" r="1" fill="transparent" stroke={color} strokeWidth="0.75" />
      <circle cx="13" cy="13" r="1" fill="transparent" stroke={color} strokeWidth="0.75" />
    </g>
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <pattern
            id="brand-stamp-pattern"
            x="0"
            y="0"
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            {/* Two icons per tile: one at (0,0) and one offset at (size/2, size/2) */}
            <PatternCell />
            <PatternCell dx={half} dy={half} />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#brand-stamp-pattern)"
          opacity={opacity}
        />
      </svg>
    </div>
  );
}
