"use client";

import { useEffect, useRef } from "react";

/**
 * v5 HeroCanvas — reproduction de l'ambiance animée de handhold.io
 *
 * 5 orbs gaussiens (screen blend) + 3 beams horizontaux traversants
 * avec core / glow / halo gradient, sur un canvas 2D full-bleed.
 *
 * Palette : vert Stampify #1d9e75. Ratio de référence 3024:1592 (handhold).
 */
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Orb = {
      x: number;
      y: number;
      r: number;
      opacity: number;
      // normalised base positions (0-1) so we can re-scale on resize
      nx: number;
      ny: number;
      nr: number;
      phase: number;
    };

    type Beam = {
      progress: number;
      y: number;
      ny: number;
      speed: number;
      opacity: number;
    };

    const orbsBase: Orb[] = [
      { nx: 0.50, ny: -0.15, nr: 0.60, opacity: 0.14, phase: 0.0, x: 0, y: 0, r: 0 },
      { nx: 0.90, ny:  0.15, nr: 0.42, opacity: 0.10, phase: 1.3, x: 0, y: 0, r: 0 },
      { nx: 0.10, ny:  0.80, nr: 0.34, opacity: 0.08, phase: 2.6, x: 0, y: 0, r: 0 },
      { nx: 0.20, ny:  0.45, nr: 0.22, opacity: 0.10, phase: 3.9, x: 0, y: 0, r: 0 },
      { nx: 0.50, ny:  0.50, nr: 0.75, opacity: 0.04, phase: 5.2, x: 0, y: 0, r: 0 },
    ];

    const beams: Beam[] = [
      { progress: 0.00, ny: 0.35, y: 0, speed: 0.0030, opacity: 1.00 },
      { progress: 0.33, ny: 0.54, y: 0, speed: 0.0028, opacity: 0.65 },
      { progress: 0.66, ny: 0.69, y: 0, speed: 0.0032, opacity: 0.42 },
    ];

    const resize = () => {
      const cssW = canvas.offsetWidth || window.innerWidth;
      const cssH = canvas.offsetHeight || window.innerHeight;
      W = cssW;
      H = cssH;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // re-scale orbs
      const refDim = Math.max(W, H);
      for (const o of orbsBase) {
        o.x = o.nx * W;
        o.y = o.ny * H;
        o.r = o.nr * refDim;
      }
      for (const b of beams) {
        b.y = b.ny * H;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    let raf = 0;

    const drawOrb = (orb: Orb) => {
      const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
      grad.addColorStop(0.00, `rgba(29,158,117,${orb.opacity})`);
      grad.addColorStop(0.40, `rgba(29,158,117,${orb.opacity * 0.4})`);
      grad.addColorStop(0.70, `rgba(29,158,117,${orb.opacity * 0.1})`);
      grad.addColorStop(1.00, "rgba(29,158,117,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawBeam = (beam: Beam) => {
      const beamW = W * 0.42;
      const startX = -beamW + (W + beamW) * beam.progress;
      const endX = startX + beamW;

      // 1) halo large diffus
      const halo = ctx.createLinearGradient(startX, 0, endX, 0);
      halo.addColorStop(0.00, "rgba(29,158,117,0)");
      halo.addColorStop(0.25, `rgba(29,158,117,${0.06 * beam.opacity})`);
      halo.addColorStop(0.50, `rgba(29,158,117,${0.10 * beam.opacity})`);
      halo.addColorStop(0.75, `rgba(29,158,117,${0.06 * beam.opacity})`);
      halo.addColorStop(1.00, "rgba(29,158,117,0)");
      ctx.strokeStyle = halo;
      ctx.lineWidth = 28;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(startX, beam.y);
      ctx.lineTo(endX, beam.y);
      ctx.stroke();

      // 2) glow intermédiaire
      const glow = ctx.createLinearGradient(startX, 0, endX, 0);
      glow.addColorStop(0.00, "rgba(29,158,117,0)");
      glow.addColorStop(0.20, `rgba(29,158,117,${0.25 * beam.opacity})`);
      glow.addColorStop(0.50, `rgba(29,158,117,${0.50 * beam.opacity})`);
      glow.addColorStop(0.80, `rgba(29,158,117,${0.25 * beam.opacity})`);
      glow.addColorStop(1.00, "rgba(29,158,117,0)");
      ctx.strokeStyle = glow;
      ctx.lineWidth = 8;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "rgba(29,158,117,0.4)";
      ctx.beginPath();
      ctx.moveTo(startX, beam.y - 1);
      ctx.lineTo(endX, beam.y - 1);
      ctx.stroke();

      // 3) core fin très lumineux
      const core = ctx.createLinearGradient(startX, 0, endX, 0);
      core.addColorStop(0.00, "rgba(29,158,117,0)");
      core.addColorStop(0.15, `rgba(29,158,117,${0.7 * beam.opacity})`);
      core.addColorStop(0.50, `rgba(29,158,117,${1.0 * beam.opacity})`);
      core.addColorStop(0.85, `rgba(29,158,117,${0.7 * beam.opacity})`);
      core.addColorStop(1.00, "rgba(29,158,117,0)");
      ctx.strokeStyle = core;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(29,158,117,0.8)";
      ctx.beginPath();
      ctx.moveTo(startX, beam.y);
      ctx.lineTo(endX, beam.y);
      ctx.stroke();

      ctx.shadowBlur = 0;
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, W, H);
      time += 0.005;

      // orbs drift
      for (let i = 0; i < orbsBase.length; i++) {
        const o = orbsBase[i];
        const baseX = o.nx * W;
        const baseY = o.ny * H;
        o.x = baseX + Math.sin(time * 0.7 + o.phase) * 40;
        o.y = baseY + Math.cos(time * 0.5 + o.phase * 0.9) * 28;
      }

      ctx.globalCompositeOperation = "screen";
      for (const o of orbsBase) drawOrb(o);
      ctx.globalCompositeOperation = "source-over";

      for (const b of beams) {
        b.progress += b.speed;
        if (b.progress > 1.3) b.progress = -0.3;
        drawBeam(b);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
