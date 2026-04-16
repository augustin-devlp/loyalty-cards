"use client";

import { useEffect, useRef, useCallback } from "react";

function useOrbParallax(heroRef: React.RefObject<HTMLElement>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !heroRef.current) return;
    const scrollY = window.scrollY;
    const heroBottom = heroRef.current.offsetHeight;
    if (scrollY > heroBottom) return;
    const offset = scrollY * 0.25;
    containerRef.current.style.transform = `translateY(${offset}px)`;
  }, [heroRef]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return containerRef;
}

export default function HeroBackground({ heroRef }: { heroRef: React.RefObject<HTMLElement> }) {
  const orbContainerRef = useOrbParallax(heroRef);

  const BEAM_CORE = "linear-gradient(90deg,transparent 0%,rgba(29,158,117,0.00) 5%,rgba(29,158,117,0.60) 22%,rgba(29,158,117,1.00) 50%,rgba(29,158,117,0.60) 78%,rgba(29,158,117,0.00) 95%,transparent 100%)";
  const BEAM_G2 = "linear-gradient(90deg,transparent 0%,rgba(29,158,117,0.00) 8%,rgba(29,158,117,0.30) 25%,rgba(29,158,117,0.55) 50%,rgba(29,158,117,0.30) 75%,rgba(29,158,117,0.00) 92%,transparent 100%)";
  const BEAM_G3 = "linear-gradient(90deg,transparent 0%,rgba(29,158,117,0.00) 10%,rgba(29,158,117,0.12) 28%,rgba(29,158,117,0.20) 50%,rgba(29,158,117,0.12) 72%,rgba(29,158,117,0.00) 90%,transparent 100%)";
  const BEAM_G4 = "linear-gradient(90deg,transparent 0%,rgba(29,158,117,0.00) 12%,rgba(29,158,117,0.04) 30%,rgba(29,158,117,0.08) 50%,rgba(29,158,117,0.04) 70%,rgba(29,158,117,0.00) 88%,transparent 100%)";

  const beams = [
    { top: "34%", driftAnim: "beamDrift1 9s ease-in-out infinite", flowDur: "3.6s", flowDelay: "0s", opacity: 1.0 },
    { top: "54%", driftAnim: "beamDrift2 11s ease-in-out infinite -4s", flowDur: "3.9s", flowDelay: "-1.3s", opacity: 0.65 },
    { top: "69%", driftAnim: "beamDrift3 8s ease-in-out infinite -2s", flowDur: "3.3s", flowDelay: "-2.2s", opacity: 0.40 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 0,
        contain: "paint layout",
      }}
      aria-hidden="true"
    >
      <div ref={orbContainerRef} style={{ willChange: "transform" }}>
        {/* ORB E — ambient (z-index 0, mode normal, behind beams) */}
        <div style={{
          position: "absolute",
          top: "-320px",
          left: "-220px",
          width: "calc(100% + 440px)",
          height: "680px",
          borderRadius: "40%",
          background: "radial-gradient(ellipse at 48% 35%,rgba(29,158,117,0.045) 0%,rgba(29,158,117,0.02) 35%,rgba(29,158,117,0.005) 60%,transparent 72%)",
          filter: "blur(90px)",
          mixBlendMode: "normal",
          willChange: "opacity",
          animation: "orbEBreathe 18s ease-in-out infinite",
          zIndex: 0,
        }} />

        {/* BEAMS (z-index 1, between Orb E and orbs A-D) */}
        {beams.map((beam, idx) => (
          <div key={idx} style={{
            position: "absolute",
            top: beam.top,
            left: 0,
            right: 0,
            pointerEvents: "none",
            animation: beam.driftAnim,
            zIndex: 1,
            opacity: beam.opacity,
          }}>
            <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
              <div style={{
                position: "relative",
                height: "1px",
                width: "36vw",
                willChange: "transform",
                animation: `beamFlow ${beam.flowDur} linear infinite`,
                animationDelay: beam.flowDelay,
              }}>
                {/* Halo diffus */}
                <div style={{ position: "absolute", top: "-15.5px", left: 0, height: "32px", width: "144.4%", background: BEAM_G4, filter: "blur(14px)" }} />
                {/* Glow extérieur */}
                <div style={{ position: "absolute", top: "-5.5px", left: 0, height: "12px", width: "127.8%", background: BEAM_G3, filter: "blur(6px)" }} />
                {/* Glow intérieur */}
                <div style={{ position: "absolute", top: "-1.5px", left: 0, height: "4px", width: "113.9%", background: BEAM_G2, filter: "blur(2px)" }} />
                {/* Core */}
                <div style={{ position: "absolute", top: 0, left: 0, height: "1px", width: "100%", background: BEAM_CORE }} />
              </div>
            </div>
          </div>
        ))}

        {/* ORB A (z-index 2) */}
        <div style={{
          position: "absolute", top: "-220px", left: "50%",
          width: "900px", height: "900px", borderRadius: "50%",
          background: "radial-gradient(circle at center,rgba(29,158,117,0.13) 0%,rgba(29,158,117,0.09) 18%,rgba(29,158,117,0.05) 38%,rgba(29,158,117,0.02) 58%,rgba(29,158,117,0.005) 72%,transparent 80%)",
          filter: "blur(50px)", mixBlendMode: "screen", willChange: "transform, opacity",
          animation: "orbAMove 14s cubic-bezier(0.45,0.05,0.55,0.95) infinite",
          zIndex: 2,
        }} />
        {/* ORB B (z-index 2) */}
        <div style={{
          position: "absolute", top: "80px", right: "-120px",
          width: "560px", height: "560px", borderRadius: "50%",
          background: "radial-gradient(circle at center,rgba(29,158,117,0.10) 0%,rgba(29,158,117,0.06) 25%,rgba(29,158,117,0.03) 50%,rgba(29,158,117,0.008) 68%,transparent 78%)",
          filter: "blur(65px)", mixBlendMode: "screen", willChange: "transform, opacity",
          animation: "orbBMove 10s ease-in-out infinite",
          animationDelay: "-3.3s", zIndex: 2,
        }} />
        {/* ORB C (z-index 2) */}
        <div style={{
          position: "absolute", bottom: "20px", left: "-100px",
          width: "440px", height: "440px", borderRadius: "50%",
          background: "radial-gradient(circle at center,rgba(29,158,117,0.08) 0%,rgba(29,158,117,0.04) 30%,rgba(29,158,117,0.015) 55%,rgba(29,158,117,0.003) 70%,transparent 78%)",
          filter: "blur(55px)", mixBlendMode: "screen", willChange: "transform, opacity",
          animation: "orbCMove 11s cubic-bezier(0.45,0.05,0.55,0.95) infinite",
          animationDelay: "-5.5s", zIndex: 2,
        }} />
        {/* ORB D (z-index 2) */}
        <div style={{
          position: "absolute", top: "280px", left: "12%",
          width: "280px", height: "280px", borderRadius: "50%",
          background: "radial-gradient(circle at center,rgba(13,122,90,0.11) 0%,rgba(13,122,90,0.05) 35%,rgba(13,122,90,0.01) 60%,transparent 72%)",
          filter: "blur(38px)", mixBlendMode: "screen", willChange: "transform, opacity",
          animation: "orbDMove 7s ease-in-out infinite",
          animationDelay: "-2.1s", zIndex: 2,
        }} />
      </div>
    </div>
  );
}
