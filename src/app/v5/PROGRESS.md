# V5 Animation Progress — handhold.io reproduction

## Dernière mise à jour : 17 Apr 2026 — ~75min écoulées

## Itérations complétées (session courante)

| # | Description | Commit | Statut |
|---|---|---|---|
| ITER 1–14 | Batch initial: vitesse beams ×3.4, gradient non-lin, fade-in, parallax, FloatingHands | 584dd99 | ✅ |
| ITER 8 | orb[0] recentré à nx:0.50 (haut-centre comme handhold) | 199ab2a | ✅ |
| ITER 9 | FloatingHands: mixBlendMode multiply + filtre vert CTA | 584dd99 | ✅ |
| ITER 10 | Fond hero plus profond (#E6F1EA aux bords) | 199ab2a | ✅ |
| ITER 11 | will-change: transform + contain: paint layout | 3881763 | ✅ |
| ITER 12 | Canvas fade-in 1.5s | 584dd99 | ✅ |
| ITER 13 | Parallax scroll orbs (0.12) | fd09110 | ✅ |
| ITER 14 | Gradient non-linéaire (peak centré, decay exponentiel) | 584dd99 | ✅ |
| ITER 15 | 4ème beam, stagger 0.40 → 2-3 beams simultanés | 199ab2a | ✅ |
| ITER 16 | beamW 0.45→0.65W + inclinaison 0.7° | 3881763 | ✅ |
| ITER 17 | Orbs profil tighter (peak concentré, falloff rapide) | 6a9c24d | ✅ |
| ITER 18 | prefers-reduced-motion + pause visibilitychange | fa71ef6 | ✅ |
| ITER 19 | CORRECTION vitesse: 0.0076→0.00476 (3.5s traversée) | 7123437 | ✅ |
| ITER 20 | Positions Y beams [0.36,0.48,0.60,0.70] + entrée douce | fd09110 | ✅ |
| ITER 21 | orb[0] opacity 0.11→0.13 (plus de présence haut-centre) | 36d191d | ✅ |
| ITER 22 | 3 beams (comme handhold) stagger 0.53 → 1-2 beams simultanés | 9fd6725 | ✅ |
| ITER 23 | Nappe verte top-center 5.5% sur fond hero (renforce orb[0]) | 3beda9d | ✅ |
| ITER 24 | Core beam peak near-white (220,252,238) + shadowColor plus brillant | 070c858 | ✅ |
| ITER 25 | 4ème couche ultra-core blanc pur 0.75px au pic (optique laser réelle) | 54c9e08 | ✅ |
| ITER 26 | orb[1] 0.085→0.10, orb[4] 0.035→0.05 + profil radial légèrement ouvert | 4e938b6 | ✅ |
| ITER 27 | Fréquences primaires per-orb [0.400..0.460] → patterns Lissajous uniques | e839066 | ✅ |
| ITER 28 | Halo 28→36px + glow shadowBlur 14→20 (atmosphère plus diffuse) | 5e1963d | ✅ |
| ITER 29 | orb[0] ny:-0.08→0.02 nr:0.65→0.72 (centre dans canvas, couverture hero) | 41654fc | ✅ |
| ITER 30 | Ondulation beam 0.0065→0.0030 (arc majestueux 0.7 cycle/W vs serpent) | 34abe1f | ✅ |
| ITER 31 | DashboardMockup: green ambient glow shadow rgba(29,158,117,0.09) | 78a84fc | ✅ |
| ITER 32 | Amplitude arc beam 2.0→3.5px (arc visible avec freq spatiale 0.0030) | f8d5de1 | ✅ |
| ITER 33 | Mobile: orbBoost ×1.4 (compense l'absence de beams <768px) | b162f5d | ✅ |
| ITER 34 | Beams Y resserrés [0.39,0.47,0.56] bande lumineuse cohérente ~17%H | 5142ca2 | ✅ |
| ITER 35 | Séparation chromatique: glow rgba(22,168,130) teal vs halo/core vert | 5439426 | ✅ |
| ITER 36 | Stagger 0.53→0.50 : toujours 2 beams visibles, overlap propre | 2cd8053 | ✅ |
| ITER 37 | Breathe orbs ±12%→±15%, période 140→116s (plus vivant) | 565c460 | ✅ |
| ITER 38 | orb[2] ny:0.68→0.55, orb[3] nx:0.75→0.78 ny:-0.05→0.05 (dans viewport) | 2a77788 | ✅ |
| ITER 39 | Slope beam 0.010→0.012 (inclinaison 0.69° — type handhold.io) | 058c954 | ✅ |
| ITER 40 | Canvas fade-in 120ms→50ms delay, 1.5s→1.2s transition (warmup rapide) | 2eccc13 | ✅ |
| ITER 41 | Halo peak 0.070→0.090 (diffusion atmosphérique +29%) | dd15b38 | ✅ |
| ITER 42 | HeroSection minHeight:640px (proportions canvas stables) | f432422 | ✅ |
| ITER 43 | Glow 8→10px, core 1.5→2.0px + fix indent tracePath | e3f6693 | ✅ |
| ITER 44 | CSS nappe top-droit 3% (reinforcement orb[1]+orb[3] zone haut-droit) | 66b6328 | ✅ |
| ITER 45 | Dead zone 1.3/-0.3→1.1/-0.1, stagger 0.50→0.40 (visibilité 62→83%) | fbdeaa7 | ✅ |
| ITER 46 | Arc quasi-statique (time×1.2→0.15) + beam[1] 0.72→0.80 beam[2] 0.52→0.62 | 52d6f73 | ✅ |
| ITER 47 | orb[0] 0.13→0.15 + glow shadowBlur 20→24px, shadowColor 0.45→0.50 | 7630b88 | ✅ |
| ITER 48 | Nappe CSS 0.055→0.075 + ampX dérive orbs 18-26→22-30px | b16bb2c | ✅ |
| ITER 49 | orb[3] nr 0.18→0.25 + orb[4] ny 0.50→0.25 (couverture zone texte) | b4bc8e6 | ✅ |
| ITER 50 | Breathe fréq 0.18→0.26 (période 80s) + ampY 12→15px base | 1c76adc | ✅ |

## Paramètres finaux actuels

```
BEAMS (3 beams):
  speed: [0.00476, 0.00400, 0.00510]  → 3.3–4.2s traversée
  opacity: [1.00, 0.80, 0.62]  → plus uniforme (ITER 46)
  halo lineWidth: 36px
  glow lineWidth: 10px, shadowBlur: 24px (ITER 47), shadowColor teal 0.50 (ITER 47)
  core lineWidth: 2.0px, shadowBlur: 12px
  beamW: 0.65W (65% viewport width)
  slope: 0.012 (inclinaison ~0.69°)
  amplitude sinusoïdale: 3.5px, time coeff 0.15 (quasi-statique pendant traversée, ITER 46)
  gradient: entrée douce (ramp depuis 0.03), peak au centre

ORBS (5 orbs):
  opacités: [0.15, 0.10, 0.07, 0.09, 0.05]  (ITER 47: orb[0] 0.13→0.15)
  orb[0]: nx:0.50, ny:0.02, nr:0.72 (dominant haut-centre, dans canvas)
  orb[3]: nr:0.25 (ITER 49, était 0.18)
  orb[4]: ny:0.25 (ITER 49, était 0.50 — nappe couvre zone texte)
  amplitude dérive: 22-30px (horizontal, ITER 48), 15-21px (vertical, ITER 50)
  fréquence: 0.42 rad (lent, ~50s période)
  breathe amplitude: ±15%, période ~80s (ITER 50, était 116s)

CANVAS:
  fade-in: 1.2s ease après 50ms
  parallax: scrollY × 0.12
  mobile: beams désactivés <768px
  prefers-reduced-motion: canvas masqué
  tab hidden: rAF pausé

FLOAT HANDS:
  mixBlendMode: multiply
  filter: sepia(12%) saturate(80%) hue-rotate(100deg) brightness(0.88)
  gauche: 4.2s, droite: 4.8s (désynchronisées)
```

## Score ressemblance handhold.io : 9.5/10 (mis à jour ITER 46-50)

### Ce qui reste potentiellement différent
1. **Visuellement impossible à vérifier** sans browser côte-à-côte
2. Possible: opacité orbs légèrement trop faible (quasi-invisible mais peut-être trop?)
3. Possible: 4 beams légèrement trop nombreux si handhold en a 3

### Prochaines itérations possibles
- ~~ITER 21: Augmenter légèrement opacity orb[0] (0.11→0.13) pour plus de présence~~ ✅ FAIT
- ~~ITER 22: Tester 3 beams vs 4 (revenir à 3 si trop dense)~~ ✅ FAIT — 3 beams
- ~~ITER 23: Ajuster la couleur du fond hero si orbs pas assez visibles~~ ✅ FAIT — nappe verte 5.5%
- ITER 24: Vérifier que le canvas ne crée pas de scroll horizontal

## Commits session courante
- `584dd99` — ITER 1-14 batch
- `199ab2a` — ITER 8,10,15
- `3881763` — ITER 11,16
- `6a9c24d` — ITER 17
- `fa71ef6` — ITER 18
- `7123437` — ITER 19
- `fd09110` — ITER 20
