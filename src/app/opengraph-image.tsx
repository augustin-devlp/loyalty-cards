import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Stampify — Site vitrine + carte fidélité en 48h";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#1d9e75",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern — subtle stamp grid */}
        {Array.from({ length: 8 }, (_, row) =>
          Array.from({ length: 10 }, (_, col) => (
            <div
              key={`${row}-${col}`}
              style={{
                position: "absolute",
                left: col * 130 + (row % 2 === 0 ? 0 : 65),
                top: row * 90 - 40,
                width: 32,
                height: 32,
                border: "1.5px solid rgba(255,255,255,0.12)",
                borderRadius: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              {[0, 1, 2].map((r) => (
                <div key={r} style={{ display: "flex", gap: 3 }}>
                  {[0, 1, 2].map((c) => {
                    const idx = r * 3 + c;
                    return (
                      <div
                        key={c}
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          background: idx < 7 ? "rgba(255,255,255,0.18)" : "transparent",
                          border: idx >= 7 ? "1px solid rgba(255,255,255,0.12)" : "none",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          ))
        )}

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Stamp icon */}
          <div
            style={{
              width: 88,
              height: 88,
              border: "3px solid white",
              borderRadius: 18,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
            }}
          >
            {[[true,true,true],[true,true,true],[true,false,false]].map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: 9 }}>
                {row.map((filled, ci) => (
                  <div
                    key={ci}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: filled ? "white" : "transparent",
                      border: filled ? "none" : "2px solid rgba(255,255,255,0.6)",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Wordmark */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            Stampify
          </div>
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            fontSize: 24,
            color: "rgba(255,255,255,0.75)",
            letterSpacing: "0.02em",
          }}
        >
          Site vitrine + carte fidélité en 48h
        </div>
      </div>
    ),
    { ...size }
  );
}
