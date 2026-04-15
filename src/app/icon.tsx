import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#1d9e75",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* 3x3 grid of circles representing the stamp card */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[[true, true, true], [true, true, true], [true, false, false]].map(
            (row, ri) => (
              <div key={ri} style={{ display: "flex", gap: 3 }}>
                {row.map((filled, ci) => (
                  <div
                    key={ci}
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: filled ? "white" : "transparent",
                      border: filled ? "none" : "1.5px solid rgba(255,255,255,0.7)",
                    }}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
