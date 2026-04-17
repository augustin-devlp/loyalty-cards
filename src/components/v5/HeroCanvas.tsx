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
    // ITER 82: 50ms→0ms delay, 1.2s→0.8s — impact visuel immédiat
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 0.8s ease";
    const fadeTimer = setTimeout(() => {
      canvas.style.opacity = "1";
    }, 0);

    // Mobile : désactive les beams pour préserver la perf
    // ITER 33 — mobile: orbs ×1.4 pour compenser l'absence de beams
    // ITER 68 — tablet: orbs ×1.15 (viewport étroit, beams moins couvrants)
    const isMobile = window.innerWidth < 768;
    const isTablet = !isMobile && window.innerWidth < 1024;
    const orbBoost = isMobile ? 1.4 : isTablet ? 1.15 : 1.0;

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
      // ITER 80 — phases équidistantes 2π/5 = 1.2566 rad (max séparation pairwise)
      { nx: 0.50, ny:  0.02, nr: 0.80, opacity: 0.15,  phase: 0.000, x: 0, y: 0, r: 0 },
      { nx: 0.85, ny:  0.15, nr: 0.44, opacity: 0.10,  phase: 1.257, x: 0, y: 0, r: 0 },
      { nx: 0.15, ny:  0.38, nr: 0.34, opacity: 0.08,  phase: 2.513, x: 0, y: 0, r: 0 },
      { nx: 0.78, ny:  0.05, nr: 0.25, opacity: 0.10,  phase: 3.770, x: 0, y: 0, r: 0 },
      { nx: 0.50, ny:  0.25, nr: 0.88, opacity: 0.065, phase: 5.027, x: 0, y: 0, r: 0 },
    ];

    // ITER 19 — vitesse corrigée: 3.5s traversée viewport (speed = 1/(3.5×60))
    // ITER 20 — positions Y calées sur la zone texte/mockup du hero
    //           (entre 36% et 64% de hauteur, évite de passer trop haut)
    // ITER 22 — 3 beams (comme handhold.io)
    // ITER 34 — Y positions resserrées [0.39,0.47,0.56] bande lumineuse cohérente (~17%H)
    // ITER 36 — stagger 0.53→0.50 : overlap propre
    // ITER 45 — dead zone réduit (1.3/-0.3 → 1.1/-0.1), stagger 0.40 → 83% visible
    // ITER 46 — beam[1] 0.72→0.80, beam[2] 0.52→0.62 : luminosité plus uniforme (type handhold)
    // ITER 52 — Y remontés [0.39,0.47,0.56]→[0.35,0.44,0.53] : zone headline du hero
    // ITER 64 — positions initiales : beam[0] au centre (visible dès le fade-in 50ms)
    const beams: Beam[] = [
      { progress:  0.50, ny: 0.35, y: 0, speed: 0.00476, opacity: 1.00 }, // peak centre canvas dès load
      { progress:  0.90, ny: 0.44, y: 0, speed: 0.00400, opacity: 0.80 }, // droite, sort rapidement
      { progress:  0.10, ny: 0.53, y: 0, speed: 0.00510, opacity: 0.62 }, // gauche, entre ~1s
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
      const cy = orb.y - parallaxY * 0.08; // ITER 69: 0.12→0.08 (moins de dérive au scroll)
      const grad = ctx.createRadialGradient(orb.x, cy, 0, orb.x, cy, orb.r);
      // ITER 17 — profil tighter : peak concentré, falloff rapide → lumière focalisée
      // ITER 26 — profil légèrement ouvert (0.30→0.38, 0.07→0.10) plus de présence ambiante
      // ITER 51 — profil plus diffus : falloff plus graduel → glow atmosphérique (type handhold)
      grad.addColorStop(0.00, `rgba(29,158,117,${a})`);
      grad.addColorStop(0.15, `rgba(29,158,117,${a * 0.80})`);
      grad.addColorStop(0.35, `rgba(29,158,117,${a * 0.50})`);
      grad.addColorStop(0.60, `rgba(29,158,117,${a * 0.20})`);
      grad.addColorStop(0.82, `rgba(29,158,117,${a * 0.05})`);
      grad.addColorStop(1.00, "rgba(29,158,117,0)");
      ctx.fillStyle = grad;
      // ITER 70 — shadow sur fill orb : aura douce au-delà du gradient (30px)
      ctx.shadowBlur = 30;
      ctx.shadowColor = `rgba(29,158,117,${a * 0.12})`;
      ctx.beginPath();
      ctx.arc(orb.x, cy, orb.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    // Chemin sinusoïdal subtil + légère inclinaison descendante (~0.8°)
    // ITER 4 : amplitude 2.5px, basse fréquence
    // ITER 16: slope 0.012 → donne une légère inclinaison type handhold
    const tracePath = (startX: number, endX: number, yBase: number) => {
      const steps = 120; // ITER 65: 80→120 segments pour courbe plus lisse
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
      ctx.lineJoin = "round"; // ITER 65: joints arrondis entre segments polyline
      // ITER 16: beams plus longs (0.45→0.65W) — traversée plus ample
      // ITER 52: 0.65→0.72W — couverture latérale élargie
      const beamW = W * 0.72;
      const startX = -beamW + (W + beamW) * beam.progress;
      const endX   = startX + beamW;

      // ITER 14 — gradient non-linéaire, peak au centre, décroissance exponentielle
      // ITER 2  — halo 28px, glow 8px, core 1.5px

      // ITER 20 — entrée/sortie plus douces : ramp commence à 0.03 (était 0.08)
      // → apparition/disparition plus graduelle, moins abrupte

      // 1) halo large diffus
      const halo = ctx.createLinearGradient(startX, 0, endX, 0);
      halo.addColorStop(0.00, "rgba(29,158,117,0)");
      // ITER 41 — halo peak 0.090, ITER 55 — 0.100
      // ITER 71 — stops intermédiaires 0.10 et 0.90 pour ramp plus graduelle
      halo.addColorStop(0.03, `rgba(29,158,117,${0.010 * beam.opacity})`);
      halo.addColorStop(0.10, `rgba(29,158,117,${0.022 * beam.opacity})`);
      halo.addColorStop(0.18, `rgba(29,158,117,${0.038 * beam.opacity})`);
      halo.addColorStop(0.38, `rgba(29,158,117,${0.068 * beam.opacity})`);
      halo.addColorStop(0.50, `rgba(29,158,117,${0.100 * beam.opacity})`);
      halo.addColorStop(0.62, `rgba(29,158,117,${0.068 * beam.opacity})`);
      halo.addColorStop(0.82, `rgba(29,158,117,${0.038 * beam.opacity})`);
      halo.addColorStop(0.90, `rgba(29,158,117,${0.022 * beam.opacity})`);
      halo.addColorStop(0.97, `rgba(29,158,117,${0.010 * beam.opacity})`);
      halo.addColorStop(1.00, "rgba(29,158,117,0)");
      ctx.strokeStyle = halo;
      ctx.lineWidth = 40; // ITER 83: 36→40px halo plus large (volumétrie accrue)
      ctx.shadowBlur = 8; // ITER 59: léger shadow pour étendre l'atmosphère au-delà du lineWidth
      ctx.shadowColor = `rgba(29,158,117,${0.15 * beam.opacity})`;
      tracePath(startX, endX, beam.y);
      ctx.stroke();

      // 2) glow intermédiaire — ITER 35: légèrement plus cyan (séparation chromatique)
      const glow = ctx.createLinearGradient(startX, 0, endX, 0);
      glow.addColorStop(0.00, "rgba(22,168,130,0)");
      glow.addColorStop(0.03, `rgba(22,168,130,${0.04 * beam.opacity})`);
      glow.addColorStop(0.18, `rgba(22,168,130,${0.18 * beam.opacity})`);
      glow.addColorStop(0.38, `rgba(22,168,130,${0.42 * beam.opacity})`);
      glow.addColorStop(0.50, `rgba(22,168,130,${0.65 * beam.opacity})`); // ITER 55: 0.55→0.65
      glow.addColorStop(0.62, `rgba(22,168,130,${0.42 * beam.opacity})`);
      glow.addColorStop(0.82, `rgba(22,168,130,${0.18 * beam.opacity})`);
      glow.addColorStop(0.97, `rgba(22,168,130,${0.04 * beam.opacity})`);
      glow.addColorStop(1.00, "rgba(22,168,130,0)");
      ctx.strokeStyle = glow;
      ctx.lineWidth = 12; // ITER 76: 10→12px glow plus épais (séparation chromatique)
      ctx.shadowBlur = 24; // ITER 47: 20→24 diffusion atmosphérique renforcée
      ctx.shadowColor = "rgba(22,168,130,0.50)"; // ITER 47: 0.45→0.50 (plus d'éclat autour du beam)
      tracePath(startX, endX, beam.y - 0.5);
      ctx.stroke();

      // 3) core fin très lumineux — ITER 24: pic quasi-blanc au centre (optique réelle)
      const core = ctx.createLinearGradient(startX, 0, endX, 0);
      core.addColorStop(0.00, "rgba(29,158,117,0)");
      core.addColorStop(0.03, `rgba(29,158,117,${0.12 * beam.opacity})`); // ITER 79: 0.10→0.12
      core.addColorStop(0.18, `rgba(54,191,147,${0.66 * beam.opacity})`); // ITER 79: 0.60→0.66
      core.addColorStop(0.38, `rgba(96,210,167,${0.92 * beam.opacity})`); // ITER 79: 0.88→0.92
      core.addColorStop(0.46, `rgba(160,235,200,${0.96 * beam.opacity})`);
      core.addColorStop(0.50, `rgba(220,252,238,${1.00 * beam.opacity})`); // pic near-white
      core.addColorStop(0.54, `rgba(160,235,200,${0.96 * beam.opacity})`);
      core.addColorStop(0.62, `rgba(96,210,167,${0.92 * beam.opacity})`); // ITER 79
      core.addColorStop(0.82, `rgba(54,191,147,${0.66 * beam.opacity})`); // ITER 79
      core.addColorStop(0.97, `rgba(29,158,117,${0.12 * beam.opacity})`); // ITER 79
      core.addColorStop(1.00, "rgba(29,158,117,0)");
      ctx.strokeStyle = core;
      ctx.lineWidth = 2.5; // ITER 73: 2.0→2.5px core légèrement plus épais
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
      ultra.addColorStop(0.50, `rgba(255,255,255,${0.50 * beam.opacity})`); // ITER 72: 0.42→0.50
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

    // ITER 53 — delta-time : vitesse constante quel que soit le refresh rate
    // 0.005 par frame à 60fps = 0.005 * 60 = 0.3 rad/s normalisé
    let lastTs = 0;
    const TIME_PER_MS = 0.005 / (1000 / 60); // 0.0003 par milliseconde

    const animate = (ts: number) => {
      raf = requestAnimationFrame(animate);
      const delta = lastTs ? Math.min(ts - lastTs, 100) : 16.67; // cap 100ms (onglet caché)
      lastTs = ts;
      ctx.clearRect(0, 0, W, H);
      time += delta * TIME_PER_MS;

      // ITER 5  — mouvement orbs harmoniques, amplitude réduite pour subtilité
      // ITER 27 — fréquences primaires per-orb légèrement différentes
      //           → patterns Lissajous uniques, jamais synchronisés
      for (let i = 0; i < orbsBase.length; i++) {
        const o = orbsBase[i];
        const baseX = o.nx * W;
        const baseY = o.ny * H;
        // ITER 48 — ampX 18-26→22-30px : dérive plus organique, mouvement perceptible
        const ampX = 22 + i * 2;
        const ampY = 15 + i * 1.5; // ITER 50: 12→15 base (15-21px vertical)
        const fX = 0.40 + i * 0.015; // 0.400, 0.415, 0.430, 0.445, 0.460
        const fY = 0.33 + i * 0.012; // 0.330, 0.342, 0.354, 0.366, 0.378
        // ITER 75 — 3ème harmonique très lente (~330s) pour éviter toute répétition visible
        o.x = baseX
          + Math.sin(time * fX    + o.phase)          * ampX
          + Math.sin(time * 0.17  + o.phase * 1.6)    * (ampX * 0.30)
          + Math.sin(time * 0.060 + o.phase * 0.7)    * (ampX * 0.15);
        o.y = baseY
          + Math.cos(time * fY    + o.phase * 0.8)    * ampY
          + Math.cos(time * 0.14  + o.phase * 2.0)    * (ampY * 0.35)
          + Math.cos(time * 0.045 + o.phase * 1.4)    * (ampY * 0.20);
      }

      const parallaxY = scrollOffset;

      ctx.globalCompositeOperation = "screen";
      for (let oi = 0; oi < orbsBase.length; oi++) {
        const o = orbsBase[oi];
        // ITER 37 — breathe ±15%, ITER 50/60 — amplitude + fréquence per-orb (ITER 66)
        // ITER 66 — fréquence per-orb [0.26,0.22,0.30,0.20,0.18] → battements complexes
        const breatheAmp  = [0.15, 0.18, 0.12, 0.20, 0.08][oi];
        const breatheFreq = [0.26, 0.22, 0.30, 0.20, 0.18][oi];
        const breathe = (1 + Math.sin(time * breatheFreq + oi * 1.2) * breatheAmp) * orbBoost;
        drawOrb(o, breathe, parallaxY);
      }
      ctx.globalCompositeOperation = "source-over";

      if (!isMobile) {
        for (let bi = 0; bi < beams.length; bi++) {
          const b = beams[bi];
          // ITER 61 — modulation vitesse ±10% per beam (~140s cycle, phases décalées)
          const speedMod = 1.0 + Math.sin(time * 0.15 + bi * 1.1) * 0.10;
          b.progress += b.speed * speedMod * (delta * TIME_PER_MS / 0.005);
          // ITER 45 — dead zone réduit → beams visibles 83% du temps (vs 62%)
          if (b.progress > 1.1) b.progress = -0.1;
          // ITER 74 — dérive Y ±8px (vs ±5px), période ~65s (vs 95s)
          b.y = b.ny * H + Math.sin(time * 0.32 + bi * 1.7) * 8;
          // ITER 58 — pulsation ±10% par beam (~42s période, phases décalées)
          ctx.globalAlpha = 1.0 + Math.sin(time * 0.50 + bi * 2.1) * 0.10;
          drawBeam(b);
          ctx.globalAlpha = 1.0;
        }
      }
    };

    animate(0);

    // ITER 18 — pause rAF quand onglet masqué → 0% CPU en arrière-plan
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        lastTs = 0; // reset pour éviter saut au retour
        animate(0);
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
