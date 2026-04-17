# V5 Animation Progress — handhold.io reproduction

## Dernière mise à jour : 17 Apr 2026 — Session 1

## Itérations complétées

| # | Description | Statut |
|---|---|---|
| ITER 1 | Vitesse beams ×3.4 → traversée ~3.5s | ✅ |
| ITER 2 | Épaisseur beams: halo 28px / glow 8px / core 1.5px | ✅ |
| ITER 3 | Opacités orbs réduites (0.15→0.12, subtilité) | ✅ |
| ITER 4 | Chemin sinusoïdal subtil (amp 2.5px) — déjà présent | ✅ |
| ITER 5 | Amplitude dérive orbs : 32→18px (mouvement organique doux) | ✅ |
| ITER 9 | FloatingHands: mixBlendMode multiply + filtre vert CTA | ✅ |
| ITER 12 | Canvas fade-in 1.5s au chargement | ✅ |
| ITER 13 | Parallax scroll orbs (facteur 0.20) | ✅ |
| ITER 14 | Gradient longitudinal non-linéaire (peak centré) | ✅ |

## Paramètres actuels

```
BEAMS:
  speed: [0.0076, 0.0069, 0.0082]  → traversée ~3.5s à 60fps
  halo lineWidth: 28px
  glow lineWidth: 8px
  core lineWidth: 1.5px
  amplitude sinusoïdale: 2.5px

ORBS:
  opacités: [0.12, 0.09, 0.075, 0.10, 0.038]
  amplitude dérive: 18-26px (horizontal), 12-18px (vertical)
  fréquence: 0.42 rad/s (lent, ~25s période)
  breathe amplitude: ±12%

CANVAS:
  fade-in: 1.5s ease après 120ms
  parallax: scrollY × 0.20
  mobile: beams désactivés sur <768px
```

## Prochaines itérations

- **ITER 6** : Vérifier couleur exacte vs handhold.io (DevTools Color Picker)
- **ITER 7** : Tester mixBlendMode 'screen' sur le canvas lui-même
- **ITER 8** : Ajuster positions exactes des orbs (handhold a orb dominant en haut-centre)
- **ITER 10** : Vérifier canvas couvre bien tout le hero (inset: 0)
- **ITER 11** : Profiler FPS Chrome DevTools
- **ITER 15** : Ajuster opacité des beams si encore trop visibles

## Score ressemblance handhold.io : 6/10 → cible 9/10

### Ce qui reste différent (visuellement)
1. Orb dominant : handhold a un gros orb centré en haut, v5 est décalé gauche
2. Couleur background hero : handhold semble légèrement plus sombre/profond
3. Nombre de beams : handhold a potentiellement plus de beams (3-4 actifs simultanément ?)
4. Beams : vérifier si l'inclinaison (légère rotation -2 à -3°) est présente

## Commits effectués
- `584dd99` — ITER 1-14 batch — HeroCanvas + FloatingHands
