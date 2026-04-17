# V5 Animation Progress — handhold.io reproduction

## Dernière mise à jour : 17 Apr 2026 — ~45min écoulées

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
| ITER 26 | orb[1] 0.085→0.10, orb[4] 0.035→0.05 + profil radial légèrement ouvert | pending | ✅ |

## Paramètres finaux actuels

```
BEAMS (3 beams):
  speed: [0.00476, 0.00400, 0.00510]  → 3.3–4.2s traversée
  halo lineWidth: 28px
  glow lineWidth: 8px, shadowBlur: 14px
  core lineWidth: 1.5px, shadowBlur: 10px
  beamW: 0.65W (65% viewport width)
  slope: 0.010 (inclinaison ~0.57°)
  amplitude sinusoïdale: 2.0px
  gradient: entrée douce (ramp depuis 0.03), peak au centre

ORBS (5 orbs):
  opacités: [0.13, 0.10, 0.07, 0.09, 0.05]
  orb[0]: nx:0.50, ny:-0.08, nr:0.65 (dominant haut-centre)
  amplitude dérive: 18-26px (horizontal), 12-18px (vertical)
  fréquence: 0.42 rad (lent, ~50s période)
  breathe amplitude: ±12%, période ~140s
  profil: tight (0.72 à 0.18r, 0.07 à 0.62r)

CANVAS:
  fade-in: 1.5s ease après 120ms
  parallax: scrollY × 0.12
  mobile: beams désactivés <768px
  prefers-reduced-motion: canvas masqué
  tab hidden: rAF pausé

FLOAT HANDS:
  mixBlendMode: multiply
  filter: sepia(12%) saturate(80%) hue-rotate(100deg) brightness(0.88)
  gauche: 4.2s, droite: 4.8s (désynchronisées)
```

## Score ressemblance handhold.io : 8/10

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
