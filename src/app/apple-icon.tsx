import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#1d9e75",
          borderRadius: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Stamp icon scaled up */}
        <div
          style={{
            border: "6px solid rgba(255,255,255,0.9)",
            borderRadius: 20,
            width: 100,
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[[true, true, true], [true, true, true], [true, false, false]].map(
              (row, ri) => (
                <div key={ri} style={{ display: "flex", gap: 10 }}>
                  {row.map((filled, ci) => (
                    <div
                      key={ci}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: filled ? "white" : "transparent",
                        border: filled ? "none" : "2px solid rgba(255,255,255,0.7)",
                      }}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
