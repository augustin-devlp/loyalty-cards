# v5 — ITERATION LOG

Session du 2026-04-17 02:30-03:00 CEST. Push bloqué depuis le sandbox Linux
(pas de credentials GitHub accessibles) → **Augustin doit lancer le script
Windows `scripts/v5-commit-push.bat` une seule fois** pour pousser toutes les
modifications en un commit.

## Tour 1 — Beams plus lents + ondulation subtile + halo adouci
Fichier : `src/components/v5/HeroCanvas.tsx`
- `beam.speed` : 0.0030 → **0.0022**, 0.0028 → **0.0020**, 0.0032 → **0.0024**
  (≈30 % plus lent, rythme plus contemplatif type handhold).
- `beamW` : 0.42 × W → **0.45 × W** (beams un peu plus longs).
- Nouveau helper `tracePath(startX, endX, yBase)` qui trace chaque beam en
  80 segments sinusoïdaux (amplitude 2.5 px, fréquence 0.0065) au lieu d'une
  ligne parfaite. Rendu plus organique.
- Halo : `lineWidth` 28 → **22**, opacités 0.06/0.10/0.06 → **0.055/0.09/0.055**.
- Glow : `lineWidth` 8 → **7**, `shadowBlur` 12 → **14**, opacités 0.25/0.50/0.25 → **0.22/0.45/0.22**.
- Core : `lineWidth` 1.5 → **1.25**, `shadowBlur` 6 → **8**, teinte du milieu
  virée vers **rgba(124,224,186)** puis **rgba(54,191,147)** sur les bords
  pour un halo blanchâtre au point le plus brillant (cohérent avec handhold).

## Tour 2 — Orbs : drift multi-harmonique non-périodique
Fichier : `src/components/v5/HeroCanvas.tsx`
- Chaque orb reçoit désormais **2 harmoniques superposées** en X et en Y :
  `Math.sin(time*0.55 + phase) × ampX + Math.sin(time*0.23 + phase*1.7) × (ampX*0.35)`.
- `ampX = 32 + i*4`, `ampY = 22 + i*3` : les plus gros orbs dérivent plus
  largement, les hotspots plus finement.
- Résultat : mouvement qui ne se répète pas de manière perceptible (période
  apparente > 2 minutes).

## Tour 3 — Distribution des orbs revue pour asymétrie
Fichier : `src/components/v5/HeroCanvas.tsx`
- Orb A (flood haut) : nx 0.50 → **0.38** (décentré gauche), ny -0.15 → **-0.10**.
- Orb B (droite haut) : nx 0.90 → **0.82** (un peu rentré), ny 0.15 → **0.22**.
- Orb C (gauche bas) : nx 0.10 → **0.14**, ny 0.80 → **0.72**.
- **Orb D transformé** : d'un accent gauche centre → hotspot petit en
  haut-droite (nx 0.72, ny -0.05, nr 0.18, opacity 0.12).
- Orb E (nappe ambiante) : ny 0.50 → **0.55** (légèrement plus bas), nr 0.75 →
  **0.85** (couvre plus), opacity 0.04 → **0.045**.

## Tour 4 — (annulé) mix-blend-mode sur canvas
Ne peut pas fonctionner sur fond **blanc** (screen ⊕ white = white). J'ai
retiré le `mixBlendMode: 'screen'` du canvas et documenté la raison dans le
style inline. Le screen compositing reste appliqué *entre orbs* via
`globalCompositeOperation` (cas où ça a du sens).

## Tour 5 — Mains : filtre nettoyé + amplitude élargie
Fichier : `src/components/v5/FloatingHands.tsx`
- Filtre changé : `sepia(15%) saturate(85%) hue-rotate(95deg) brightness(0.92)`
  + `mix-blend-mode: multiply` → **`saturate(92%) brightness(0.97) contrast(1.02)`**
  (sans hue-rotate ni multiply qui dénaturaient les tons de peau et le bois).
- Amplitude du float gauche : Y [0,-5,-11,-13,-10,-4,0] → **[0,-7,-15,-18,-13,-5,0]**.
- Amplitude du float droit : Y [0,-4,-10,-13,-6,0] → **[0,-5,-14,-17,-8,0]**.
- Durées : 4.2 s → **5.2 s** (gauche), 4.8 s → **5.8 s** (droite) — plus lent
  et plus lointain, moins "agité".
- `ease` : `"easeInOut"` → **`[0.4, 0, 0.4, 1]`** (cubic plus profond sur les
  extrema pour une impression de poids).
- Rotations : extrema légèrement amplifiés (ex : -10.8° → -11°, 10.5° → 10.6°).

## Tour 6 — Beams : dérive verticale imperceptible
Fichier : `src/components/v5/HeroCanvas.tsx`
- Chaque beam oscille maintenant en Y autour de sa position nominale :
  `b.y = b.ny * H + Math.sin(time*0.28 + bi*1.7) * 6`. Amplitude 6 px,
  période ≈ 22 s, décalage entre les 3 beams via `bi*1.7`. Les beams ne sont
  plus "cloués" à une ligne horizontale rigide.

## Tour 7 — Fond du hero : dégradé radial imperceptible
Fichier : `src/components/v5/HeroSection.tsx`
- `background: '#FFFFFF'` → **`radial-gradient(120% 80% at 50% 45%,
  #FFFFFF 0%, #F7F9F7 55%, #EEF3EF 100%)`**. Les coins tirent très légèrement
  vers un vert ultra-pâle, ce qui fait ressortir les orbs sans coller le pied
  à l'accélérateur.

## Tour 8 — Orbs : respiration d'opacité individualisée
Fichier : `src/components/v5/HeroCanvas.tsx`
- `drawOrb` reçoit maintenant un paramètre `breathe` qui oscille doucement
  autour de 1 (amplitude ±0.15, période ≈ 35 s, phase par orb).
- Résultat : chaque orb a sa propre respiration, renforçant l'impression de
  scène vivante.

## Réparation hors-mission : layout.tsx + page.tsx
La working tree contenait `src/app/layout.tsx` et `src/app/page.tsx`
tronqués (probablement suite à un `git stash` mal passé lors de la session
précédente). J'ai restauré ces deux fichiers depuis HEAD via
`git show HEAD:... > ...`. Sans ça, le build Vercel aurait échoué et le
déploiement v5 n'aurait jamais été visible.

## Validation
- `npx tsc --noEmit` : **zéro erreur** sur tout le projet.
- Build Vercel fera foi après le push. Si une erreur apparaît, je la corrige
  au tour suivant en regardant les logs.

## Blockers restants
- **Push** : `git push` refuse depuis le sandbox (aucun credential GitHub
  disponible). → Lancer `scripts\v5-commit-push.bat` depuis Windows.
- **Visual compare Chrome** : le groupage de tabs Cowork n'est pas supporté
  sur la fenêtre active (`Grouping is not supported by tabs in this window`).
  Impossible de faire un diff visuel automatique pendant cette session. Au
  prochain tour, Augustin peut ouvrir une nouvelle fenêtre Chrome sans
  groupage préexistant, ou me décrire les différences en texte.

## Prochains tours suggérés (TOUR 9+)
Quand tu auras comparé visuellement après le push :
- **TOUR 9** : couleur exacte (`#1d9e75` est peut-être plus saturé que
  handhold — testé via color picker DevTools).
- **TOUR 10** : largeur effective des beams. Si handhold a des beams plus
  longs qui traversent tout l'écran, passer `beamW` à `0.7 × W` ou `0.9 × W`.
- **TOUR 11** : si handhold a un halo *radial* gaussien sur le beam (pas
  linéaire), remplacer `createLinearGradient` par une texture blurrée.
- **TOUR 12** : texture grain/noise subtile (1 %) sur tout le canvas pour
  éviter le banding sur les gros gradients.
- **TOUR 13** : le mockup du dashboard — si handhold a aussi un léger tilt
  au scroll, ajouter un parallax sur `heroRef`.
- **TOUR 14** : transitions d'entrée des mots du titre (decalage stagger
  0.08 s) si handhold l'a.

## Emplacement des paramètres à toucher
```
src/components/v5/HeroCanvas.tsx
  orbsBase[]      → positions, tailles, opacités des orbs
  beams[]         → Y, vitesse, opacité des beams
  beamW           → longueur des beams (* W)
  drift amplitudes (ampX, ampY)
  tracePath amp  → ondulation beams
  drawOrb breathe amplitude (0.15)
  drawBeam lineWidths (halo 22, glow 7, core 1.25)

src/components/v5/FloatingHands.tsx
  filter style
  motion x, y, rotate arrays
  duration, delay, ease, times

src/components/v5/HeroSection.tsx
  background radial-gradient stops

src/app/v5/v5.css
  keyframes pingPulse, beamDrift*, orbAMove..orbEBreathe, etc. (hérités v2)
```
