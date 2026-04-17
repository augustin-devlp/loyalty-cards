"use client";

import type { CSSProperties } from "react";

const WRAP: CSSProperties = {
  position: "relative",
  width: 280,
  height: 572,
  perspective: 1400,
  animation: "v5PhoneFloat 6.4s cubic-bezier(0.4, 0, 0.4, 1) infinite",
};

const FRAME: CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: 46,
  padding: 10,
  background:
    "linear-gradient(145deg, #DADCE0 0%, #F5F6F8 22%, #B8BDC6 55%, #8A8F99 100%)",
  boxShadow: [
    "inset 0 0 0 1px rgba(255,255,255,0.6)",
    "inset 0 2px 3px rgba(255,255,255,0.75)",
    "inset 0 -2px 4px rgba(0,0,0,0.25)",
  ].join(", "),
  transformStyle: "preserve-3d",
};

const SCREEN: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: 38,
  background: "linear-gradient(180deg, #0B0D10 0%, #141619 100%)",
  overflow: "hidden",
  boxShadow: "inset 0 0 0 2px #000",
};

const NOTCH: CSSProperties = {
  position: "absolute",
  top: 12,
  left: "50%",
  transform: "translateX(-50%)",
  width: 96,
  height: 28,
  borderRadius: 18,
  background: "#000",
  zIndex: 3,
  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
};

const SHADOW: CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: -30,
  transform: "translateX(-50%)",
  width: 240,
  height: 44,
  borderRadius: "50%",
  background:
    "radial-gradient(50% 50% at 50% 50%, rgba(10,14,16,0.38) 0%, rgba(10,14,16,0.18) 40%, transparent 70%)",
  filter: "blur(10px)",
  zIndex: -1,
  animation: "v5PhoneShadow 6.4s cubic-bezier(0.4, 0, 0.4, 1) infinite",
};

const STATUS_BAR: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "18px 24px 6px",
  color: "#fff",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: 0.2,
};

const CARD: CSSProperties = {
  position: "absolute",
  top: 68,
  left: 16,
  right: 16,
  bottom: 24,
  borderRadius: 26,
  background: "linear-gradient(160deg, #FFFFFF 0%, #F6FBF9 100%)",
  padding: "22px 20px",
  boxShadow:
    "0 12px 36px -12px rgba(29,158,117,0.35), 0 1px 0 rgba(255,255,255,0.4) inset",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const CARD_HEAD: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const BRAND_MARK: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 12,
  background: "linear-gradient(135deg, #3EE5A8 0%, #1d9e75 100%)",
  color: "#0A2218",
  fontWeight: 800,
  fontSize: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  letterSpacing: -0.5,
  boxShadow: "0 4px 12px rgba(29,158,117,0.35)",
};

const STAMP_GRID: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: 10,
  marginTop: 4,
};

const STAMP_BASE: CSSProperties = {
  aspectRatio: "1 / 1",
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 18,
  fontWeight: 700,
  transition: "transform 0.2s",
};

const STAMP_FILLED: CSSProperties = {
  ...STAMP_BASE,
  background: "linear-gradient(135deg, #3EE5A8, #1d9e75)",
  color: "#fff",
  boxShadow: "0 2px 8px rgba(29,158,117,0.35), inset 0 -1px 0 rgba(0,0,0,0.12)",
};

const STAMP_EMPTY: CSSProperties = {
  ...STAMP_BASE,
  background: "#F3F6F4",
  color: "#CBD5D0",
  border: "1.5px dashed #DCE3DE",
};

const PROGRESS_TRACK: CSSProperties = {
  height: 6,
  borderRadius: 3,
  background: "#EDF3F0",
  overflow: "hidden",
  position: "relative",
};

const PROGRESS_FILL: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "70%",
  borderRadius: 3,
  background:
    "linear-gradient(90deg, #3EE5A8 0%, #1d9e75 50%, #3EE5A8 100%)",
  boxShadow: "0 0 8px rgba(62,229,168,0.55)",
};

export default function PhoneMockup() {
  const stamps: Array<"filled" | "empty"> = [
    "filled", "filled", "filled", "filled", "filled",
    "filled", "filled", "empty",  "empty",  "empty",
  ];

  return (
    <>
      <style>{`
        @keyframes v5PhoneFloat {
          0%, 100% { transform: translateY(0) rotateZ(-1.2deg) rotateX(6deg) rotateY(-8deg); }
          50%      { transform: translateY(-16px) rotateZ(-0.4deg) rotateX(5deg) rotateY(-7deg); }
        }
        @keyframes v5PhoneShadow {
          0%, 100% { transform: translateX(-50%) scale(1);    opacity: 0.55; filter: blur(10px); }
          50%      { transform: translateX(-50%) scale(0.82); opacity: 0.32; filter: blur(16px); }
        }
        @keyframes v5StampPop {
          0%   { transform: scale(0.6); opacity: 0; }
          60%  { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .v5-phone-wrap, .v5-phone-shadow { animation: none !important; }
        }
      `}</style>

      <div className="v5-phone-wrap" style={WRAP} aria-hidden="true">
        <div className="v5-phone-shadow" style={SHADOW} />

        <div style={FRAME}>
          <div style={SCREEN}>
            <div style={NOTCH} />

            <div style={STATUS_BAR}>
              <span>9:41</span>
              <span style={{ display: "inline-flex", gap: 4, alignItems: "center", opacity: 0.9 }}>
                <span>•••</span>
                <span>100%</span>
              </span>
            </div>

            <div style={CARD}>
              <div style={CARD_HEAD}>
                <div>
                  <div style={{ fontSize: 11, color: "#1d9e75", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
                    Stampify
                  </div>
                  <div style={{ fontSize: 19, fontWeight: 800, color: "#0A2218", marginTop: 2, letterSpacing: -0.3 }}>
                    Café Lumière
                  </div>
                </div>
                <div style={BRAND_MARK}>S</div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: "#5A6B62", fontWeight: 500 }}>Votre fidélité</span>
                  <span style={{ fontSize: 13, color: "#1d9e75", fontWeight: 700 }}>7 / 10</span>
                </div>
                <div style={PROGRESS_TRACK}>
                  <div style={PROGRESS_FILL} />
                </div>
              </div>

              <div style={STAMP_GRID}>
                {stamps.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      ...(s === "filled" ? STAMP_FILLED : STAMP_EMPTY),
                      animation: s === "filled" ? `v5StampPop 0.45s ${0.15 + i * 0.06}s both cubic-bezier(0.34, 1.56, 0.64, 1)` : undefined,
                    }}
                  >
                    {s === "filled" ? "☕" : ""}
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: "auto",
                padding: "12px 14px",
                borderRadius: 14,
                background: "linear-gradient(90deg, rgba(62,229,168,0.14) 0%, rgba(29,158,117,0.10) 100%)",
                border: "1px solid rgba(29,158,117,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}>
                <div>
                  <div style={{ fontSize: 11, color: "#1d9e75", fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>
                    Prochain café
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0A2218", marginTop: 1 }}>
                    Offert dans 3 tampons
                  </div>
                </div>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "#1d9e75", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(29,158,117,0.45)",
                }}>→</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
