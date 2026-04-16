export default function HeroOrbs() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {/* Orb A - top center */}
      <div style={{
        position: "absolute", top: -100, left: "50%",
        transform: "translateX(-50%)",
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(29,158,117,0.10) 0%, rgba(29,158,117,0.04) 40%, transparent 70%)",
        filter: "blur(60px)",
      }} />
      {/* Orb B - top right */}
      <div style={{
        position: "absolute", top: 100, right: -150,
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(29,158,117,0.07) 0%, transparent 65%)",
        filter: "blur(80px)",
      }} />
      {/* Orb C - bottom left */}
      <div style={{
        position: "absolute", bottom: 0, left: -100,
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(29,158,117,0.05) 0%, transparent 60%)",
        filter: "blur(60px)",
      }} />
    </div>
  );
}
