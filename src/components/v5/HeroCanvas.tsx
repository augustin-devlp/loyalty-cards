"use client";

import { useEffect, useRef } from "react";

/**
 * v5 HeroCanvas — reproduction fidèle de l'ambiance animée handhold.io
 *
 * 5 orbs gaussiens (screen blend entre eux) + 3 beams horizontaux traversants
 * avec core fin / glow intermédiaire / halo large — gradients non-linéaires
 * à décroissance exponentielle.
 *
 * ITER 1  — vitesse beams corrigée : ~3.5s traversée (target handhold)
 * ITER 2  — glow ajusté : halo 28px / glow 8px / core 1.5px
 * ITER 3  — opacités orbs plus subtiles
 * ITER 4  — chemin sinusoïdal (déjà présent, amplitude affinée)
 * ITER 5  — mouvement orbs harmoniques doux (amplitude réduite)
 * ITER 12 — fade-in canvas au chargement (évite flash)
 * ITER 13 — parallax léger au scroll
 * ITER 14 — gradient longitudinal non-linéaire (peak au centre, decay exponentiel)
 */
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ITER 18 — prefers-reduced-motion : désactive tout si l'OS le demande
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.style.display = "none";
      return;
    }

    // Fade-in au chargement — ITER 12
    // ITER 40: 120ms→50ms delay, 1.5s→1.2s transition — warmup plus rapide
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 1.2s ease";
    const fadeTimer = setTimeout(() => {
      canvas.style.opacity = "1";
    }, 50);

    // Mobile : désactive les beams pour préserver la perf
    // ITER 33 — mobile: orbs ×1.4 pour compenser l'absence de beams
    const isMobile = window.innerWidth < 768;
    const orbBoost = isMobile ? 1.4 : 1.0;

    let W = 0;
    let H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Orb = {
      x: number;
      y: number;
      r: number;
      opacity: number;
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

    // Positions inspirées du hero handhold.io :
    // ITER 8 — orb[0] recentré à 0.50 (dominant haut-centre comme handhold)
    // orb[4] nappe ambiante très large quasi-invisible
    const orbsBase: Orb[] = [
      { nx: 0.50, ny:  0.02, nr: 0.72, opacity: 0.15,  phase: 0.0, x: 0, y: 0, r: 0 }, // ITER 47: 0.13→0.15 présence haut-centre plus forte
      { nx: 0.85, ny:  0.20, nr: 0.38, opacity: 0.10,  phase: 1.4, x: 0, y: 0, r: 0 }, // ITER 26 0.085→0.10
      { nx: 0.15, ny:  0.55, nr: 0.34, opacity: 0.07,  phase: 2.7, x: 0, y: 0, r: 0 }, // ITER 38: ny 0.68→0.55 dans viewport
      { nx: 0.78, ny:  0.05, nr: 0.18, opacity: 0.09,  phase: 3.9, x: 0, y: 0, r: 0 }, // ITER 38: ny -0.05→0.05 dans canvas
      { nx: 0.50, ny:  0.50, nr: 0.88, opacity: 0.050, phase: 5.1, x: 0, y: 0, r: 0 }, // ITER 26 0.035→0.05
    ];

    // ITER 19 — vitesse corrigée: 3.5s traversée viewport (speed = 1/(3.5×60))
    // ITER 20 — positions Y calées sur la zone texte/mockup du hero
    //           (entre 36% et 64% de hauteur, évite de passer trop haut)
    // ITER 22 — 3 beams (comme handhold.io)
    // ITER 34 — Y positions resserrées [0.39,0.47,0.56] bande lumineuse cohérente (~17%H)
    // ITER 36 — stagger 0.53→0.50 : overlap propre
    // ITER 45 — dead zone réduit (1.3/-0.3 → 1.1/-0.1), stagger 0.40 → 83% visible
    // ITER 46 — beam[1] 0.72→0.80, beam[2] 0.52→0.62 : luminosité plus uniforme (type handhold)
    const beams: Beam[] = [
      { progress:  0.00, ny: 0.39, y: 0, speed: 0.00476, opacity: 1.00 }, // 3.5s
      { progress:  0.40, ny: 0.47, y: 0, speed: 0.00400, opacity: 0.80 }, // 4.2s
      { progress: -0.40, ny: 0.56, y: 0, speed: 0.00510, opacity: 0.62 }, // 3.3s
    ];

    // Parallax scroll — ITER 13
    let scrollOffset = 0;
    const onScroll = () => { scrollOffset = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const resize = () => {
      const cssW = canvas.offsetWidth || window.innerWidth;
      const cssH = canvas.offsetHeight || window.innerHeight;
      W = cssW;
      H = cssH;
      canvas.width  = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

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

    const drawOrb = (orb: Orb, breathe: number, parallaxY: number) => {
      const a = orb.opacity * breathe;
      // Centre Y décalé par le parallax — ITER 20: réduit 0.20→0.12
      const cy = orb.y - parallaxY * 0.12;
      const grad = ctx.createRadialGradient(orb.x, cy, 0, orb.x, cy, orb.r);
      // ITER 17 — profil tighter : peak concentré, falloff rapide → lumière focalisée
      // ITER 26 — profil légèrement ouvert (0.30→0.38, 0.07→0.10) plus de présence ambiante
      grad.addColorStop(0.00, `rgba(29,158,117,${a})`);
      grad.addColorStop(0.18, `rgba(29,158,117,${a * 0.72})`);
      grad.addColorStop(0.38, `rgba(29,158,117,${a * 0.38})`);
      grad.addColorStop(0.62, `rgba(29,158,117,${a * 0.10})`);
      grad.addColorStop(1.00, "rgba(29,158,117,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, cy, orb.r, 0, Math.PI * 2);
      ctx.fill();
    };

    // Chemin sinusoïdal subtil + légère inclinaison descendante (~0.8°)
    // ITER 4 : amplitude 2.5px, basse fréquence
    // ITER 16: slope 0.012 → donne une légère inclinaison type handhold
    const tracePath = (startX: number, endX: number, yBase: number) => {
      const steps = 80;
      const amp = 3.5; // ITER 32: 2.0→3.5px — arc visible avec la basse fréquence (0.0030)
      const slope = 0.012; // ITER 39: 0.010→0.012 (tan ≈ 0.69°) — type handhold.io
      const span = endX - startX;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const px = startX + span * t;
        // ITER 30 — fréq spatiale 0.0065→0.0030 : ondulation plus lente (≈0.7 cycle/W),
        //           arc majestueux plutôt que serpent — plus proche handhold.io
        // ITER 46 — time coeff 1.2→0.15 : arc quasi-statique pendant traversée (handhold n'oscille pas)
        const py = yBase + span * slope * t + Math.sin(px * 0.0030 + time * 0.15) * amp;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
    };

    const drawBeam = (beam: Beam) => {
      // ITER 16: beams plus longs (0.45→0.65W) — traversée plus ample
      const beamW = W * 0.65;
      const startX = -beamW + (W + beamW) * beam.progress;
      const endX   = startX + beamW;

      // ITER 14 — gradient non-linéaire, peak au centre, décroissance exponentielle
      // ITER 2  — halo 28px, glow 8px, core 1.5px

      // ITER 20 — entrée/sortie plus douces : ramp commence à 0.03 (était 0.08)
      // → apparition/disparition plus graduelle, moins abrupte

      // 1) halo large diffus
      const halo = ctx.createLinearGradient(startX, 0, endX, 0);
      halo.addColorStop(0.00, "rgba(29,158,117,0)");
      // ITER 41 — halo peak 0.070→0.090 (diffusion atmosphérique renforcée)
      halo.addColorStop(0.03, `rgba(29,158,117,${0.010 * beam.opacity})`);
      halo.addColorStop(0.18, `rgba(29,158,117,${0.038 * beam.opacity})`);
      halo.addColorStop(0.38, `rgba(29,158,117,${0.068 * beam.opacity})`);
      halo.addColorStop(0.50, `rgba(29,158,117,${0.090 * beam.opacity})`);
      halo.addColorStop(0.62, `rgba(29,158,117,${0.068 * beam.opacity})`);
      halo.addColorStop(0.82, `rgba(29,158,117,${0.038 * beam.opacity})`);
      halo.addColorStop(0.97, `rgba(29,158,117,${0.010 * beam.opacity})`);
      halo.addColorStop(1.00, "rgba(29,158,117,0)");
      ctx.strokeStyle = halo;
      ctx.lineWidth = 36; // ITER 28: 28→36 halo plus diffus, atmosphérique
      ctx.shadowBlur = 0;
      tracePath(startX, endX, beam.y);
      ctx.stroke();

      // 2) glow intermédiaire — ITER 35: légèrement plus cyan (séparation chromatique)
      const glow = ctx.createLinearGradient(startX, 0, endX, 0);
      glow.addColorStop(0.00, "rgba(22,168,130,0)");
      glow.addColorStop(0.03, `rgba(22,168,130,${0.04 * beam.opacity})`);
      glow.addColorStop(0.18, `rgba(22,168,130,${0.18 * beam.opacity})`);
      glow.addColorStop(0.38, `rgba(22,168,130,${0.42 * beam.opacity})`);
      glow.addColorStop(0.50, `rgba(22,168,130,${0.55 * beam.opacity})`);
      glow.addColorStop(0.62, `rgba(22,168,130,${0.42 * beam.opacity})`);
      glow.addColorStop(0.82, `rgba(22,168,130,${0.18 * beam.opacity})`);
      glow.addColorStop(0.97, `rgba(22,168,130,${0.04 * beam.opacity})`);
      glow.addColorStop(1.00, "rgba(22,168,130,0)");
      ctx.strokeStyle = glow;
      ctx.lineWidth = 10; // ITER 43: 8→10px glow plus épais
      ctx.shadowBlur = 24; // ITER 47: 20→24 diffusion atmosphérique renforcée
      ctx.shadowColor = "rgba(22,168,130,0.50)"; // ITER 47: 0.45→0.50 (plus d'éclat autour du beam)
      tracePath(startX, endX, beam.y - 0.5);
      ctx.stroke();

      // 3) core fin très lumineux — ITER 24: pic quasi-blanc au centre (optique réelle)
      const core = ctx.createLinearGradient(startX, 0, endX, 0);
      core.addColorStop(0.00, "rgba(29,158,117,0)");
      core.addColorStop(0.03, `rgba(29,158,117,${0.10 * beam.opacity})`);
      core.addColorStop(0.18, `rgba(54,191,147,${0.60 * beam.opacity})`);
      core.addColorStop(0.38, `rgba(96,210,167,${0.88 * beam.opacity})`);
      core.addColorStop(0.46, `rgba(160,235,200,${0.96 * beam.opacity})`);
      core.addColorStop(0.50, `rgba(220,252,238,${1.00 * beam.opacity})`); // pic near-white
      core.addColorStop(0.54, `rgba(160,235,200,${0.96 * beam.opacity})`);
      core.addColorStop(0.62, `rgba(96,210,167,${0.88 * beam.opacity})`);
      core.addColorStop(0.82, `rgba(54,191,147,${0.60 * beam.opacity})`);
      core.addColorStop(0.97, `rgba(29,158,117,${0.10 * beam.opacity})`);
      core.addColorStop(1.00, "rgba(29,158,117,0)");
      ctx.strokeStyle = core;
      ctx.lineWidth = 2.0; // ITER 43: 1.5→2.0px core plus visible au pic
      ctx.shadowBlur = 12;
      ctx.shadowColor = "rgba(29,200,140,0.95)"; // ITER 24: légèrement plus lumineux
      tracePath(startX, endX, beam.y);
      ctx.stroke();

      // 4) ultra-core — ITER 25: flash blanc pur au pic absolu (0.75px)
      //    Simule le point le plus chaud du faisceau — transition chromatique réelle
      const ultra = ctx.createLinearGradient(startX, 0, endX, 0);
      ultra.addColorStop(0.00, "rgba(255,255,255,0)");
      ultra.addColorStop(0.42, "rgba(255,255,255,0)");
      ultra.addColorStop(0.46, `rgba(255,255,255,${0.18 * beam.opacity})`);
      ultra.addColorStop(0.50, `rgba(255,255,255,${0.42 * beam.opacity})`);
      ultra.addColorStop(0.54, `rgba(255,255,255,${0.18 * beam.opacity})`);
      ultra.addColorStop(0.58, "rgba(255,255,255,0)");
      ultra.addColorStop(1.00, "rgba(255,255,255,0)");
      ctx.strokeStyle = ultra;
      ctx.lineWidth = 0.75;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(255,255,255,0.75)";
      tracePath(startX, endX, beam.y);
      ctx.stroke();

      ctx.shadowBlur = 0;
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, W, H);
      time += 0.005;

      // ITER 5  — mouvement orbs harmoniques, amplitude réduite pour subtilité
      // ITER 27 — fréquences primaires per-orb légèrement différentes
      //           → patterns Lissajous uniques, jamais synchronisés
      for (let i = 0; i < orbsBase.length; i++) {
        const o = orbsBase[i];
        const baseX = o.nx * W;
        const baseY = o.ny * H;
        // ITER 48 — ampX 18-26→22-30px : dérive plus organique, mouvement perceptible
        const ampX = 22 + i * 2;
        const ampY = 12 + i * 1.5;
        const fX = 0.40 + i * 0.015; // 0.400, 0.415, 0.430, 0.445, 0.460
        const fY = 0.33 + i * 0.012; // 0.330, 0.342, 0.354, 0.366, 0.378
        o.x = baseX
          + Math.sin(time * fX   + o.phase)        * ampX
          + Math.sin(time * 0.17 + o.phase * 1.6)  * (ampX * 0.30);
        o.y = baseY
          + Math.cos(time * fY   + o.phase * 0.8)  * ampY
          + Math.cos(time * 0.14 + o.phase * 2.0)  * (ampY * 0.35);
      }

      const parallaxY = scrollOffset;

      ctx.globalCompositeOperation = "screen";
      for (let oi = 0; oi < orbsBase.length; oi++) {
        const o = orbsBase[oi];
        // ITER 37 — breathe ±15% à 0.18 rad/t (période ~116s) plus vivant
        const breathe = (1 + Math.sin(time * 0.18 + oi * 1.2) * 0.15) * orbBoost;
        drawOrb(o, breathe, parallaxY);
      }
      ctx.globalCompositeOperation = "source-over";

      if (!isMobile) {
        for (let bi = 0; bi < beams.length; bi++) {
          const b = beams[bi];
          b.progress += b.speed;
          // ITER 45 — dead zone réduit → beams visibles 83% du temps (vs 62%)
          if (b.progress > 1.1) b.progress = -0.1;
          // Dérive verticale quasi-imperceptible (amplitude 5px, ~18s)
          b.y = b.ny * H + Math.sin(time * 0.22 + bi * 1.7) * 5;
          drawBeam(b);
        }
      }
    };

    animate();

    // ITER 18 — pause rAF quand onglet masqué → 0% CPU en arrière-plan
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        animate();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimeout(fadeTimer);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
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
        willChange: "transform", // GPU layer isolation — ITER 11
        contain: "paint layout",  // perf: empêche repaints hors canvas
      }}
    />
  );
}
