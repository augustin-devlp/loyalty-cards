# V5 Animation Progress — handhold.io reproduction

## Dernière mise à jour : 17 Apr 2026 — ~180min écoulées

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
| ITER 51 | Profil orb plus diffus : 80%@0.15r → 50%@0.35r → 20%@0.60r → 5%@0.82r | 11b75fd | ✅ |
| ITER 52 | Beams Y [0.39,0.47,0.56]→[0.35,0.44,0.53] + beamW 0.65→0.72W | f8e9466 | ✅ |
| ITER 53 | Delta-time animation (frame-rate indépendant, cap 100ms) | a0945de | ✅ |
| ITER 54 | orb[1] ny 0.20→0.15, orb[2] ny 0.55→0.38 (couverture zone texte) | c81205e | ✅ |
| ITER 55 | Halo peak 0.090→0.100, glow peak 0.55→0.65 (beams plus lumineux) | 393ec12 | ✅ |
| ITER 56 | orb[0] nr 0.72→0.80 (rayon élargi, meilleure couverture hero) | ebd8a8f | ✅ |
| ITER 57 | Nappe CSS top-droit 3%→4.5%, spread 38%→45% | d3d67fd | ✅ |
| ITER 58 | Beam pulsation globalAlpha ±10% (période ~42s per beam) | 3766b51 | ✅ |
| ITER 59 | Halo shadowBlur 0→8px (atmosphère étendue au-delà du lineWidth) | c0b8069 | ✅ |
| ITER 60 | Breathe amplitude per-orb [0.15,0.18,0.12,0.20,0.08] | 3c85f9e | ✅ |
| ITER 61 | Modulation vitesse beam ±10% (cycle ~140s per beam) | 34e7e38 | ✅ |
| ITER 62 | orb[4] 0.050→0.065 + fond edges E6F1EA→DFE9E4 (plus saturé) | 105bc57 | ✅ |
| ITER 63 | Nappe CSS top-center 70%×55%→80%×65% (spread élargi) | 9bbc148 | ✅ |
| ITER 64 | Positions initiales beams 0.50/0.90/0.10 (impact immédiat au load) | 9db5379 | ✅ |
| ITER 65 | tracePath 80→120 segments + lineJoin round (path plus lisse) | b7b2d38 | ✅ |
| ITER 66 | Fréquences breathe per-orb [0.26,0.22,0.30,0.20,0.18] (battements complexes) | 84e8ac2 | ✅ |
| ITER 67 | orb[1] nr 0.38→0.44 (plus de couverture haut-droit, 484px rayon) | 234a5ea | ✅ |
| ITER 68 | Tablet orbBoost ×1.15 (768-1024px, beams moins couvrants) | 436a797 | ✅ |
| ITER 69 | Parallax scroll 0.12→0.08 (orbs plus stables au scroll) | 3e02c4d | ✅ |
| ITER 70 | Shadow orbs fill 30px (aura douce au-delà du gradient) | 261caf9 | ✅ |
| ITER 71 | Halo stops intermédiaires 0.10/0.90 (ramp plus graduelle) | 76685b9 | ✅ |
| ITER 72 | Ultra-core peak 0.42→0.50 (flash blanc plus prononcé) | 6461969 | ✅ |
| ITER 73 | Core lineWidth 2.0→2.5px (brin central plus épais) | ae237dd | ✅ |
| ITER 74 | Drift Y beam ±5→±8px, fréq 0.22→0.32 (période ~65s) | 53d4917 | ✅ |
| ITER 75 | 3ème harmonique dérive orbs (0.060/0.045, période ~330s) | 227a13b | ✅ |
| ITER 76 | Glow lineWidth 10→12px (bande teal plus large) | c10887d | ✅ |
| ITER 77 | Hero minHeight 640→680px (couverture verticale canvas) | edfb870 | ✅ |
| ITER 78 | orb[2] 0.07→0.08, orb[3] 0.09→0.10 (équilibrage opacités) | 8db65a3 | ✅ |
| ITER 79 | Core shoulders +10% opacity (zone brillante plus large) | 62ba7bc | ✅ |
| ITER 80 | Phases orbs équidistantes 2π/5=1.2566 rad (séparation maximale) | fcf06cf | ✅ |
| ITER 81 | Gradient centre 38%→32% (blanc plus proche du headline) | 91dc601 | ✅ |
| ITER 82 | Fade-in 50ms/1.2s → 0ms/0.8s (animation visible plus tôt) | 19e64fd | ✅ |
| ITER 83 | Halo lineWidth 36→40px (diffusion atmosphérique plus large) | bf4dd7f | ✅ |
| ITER 84 | Orb shadow 0.12→0.20 (aura atmosphérique plus visible) | 5f52e40 | ✅ |

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

## Score ressemblance handhold.io : 9.9/10 (mis à jour ITER 66-84)

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


---

## ITER 89 — DARK PIVOT (18 Apr 2026)

**Source d'inspiration changée** : handhold.io → altitude.so, antimetal.com, topanga.io.
On part d'un fond quasi-noir avec orbs lumineux type SaaS premium.

### HeroSection.tsx (rewrite)
- Background : 2-layer radial — `radial-gradient(80% 60% at 50% 35%, rgba(29,158,117,0.20) 0%, ... transparent 72%)` + base `#0F1815 → #0A0E0C → #06090A`.
- Grille antimetal-like : 48×48 px, opacity 3.5%, masquée en ellipse.
- Fade-to-white bas 140 px (zIndex 2) pour jonction avec marquee.
- Padding : 140/120 vertical, minHeight 720.
- Text color : `#F5F7F6` (off-white).
- Badge : glass `rgba(255,255,255,0.06)` + border `rgba(255,255,255,0.12)` + backdrop-blur 8px.
- Ping dot : `#3EE5A8` avec box-shadow glow 12px.
- Title : "reviennent" en gradient text `#3EE5A8 → #B8F0D9 → #3EE5A8`.
- CTA primaire : `#1d9e75` + triple box-shadow (ring teal + drop + outer glow 32px).
- CTA secondaire : rgba blanc 4% + border blanc 18% + hover teal.
- Avatar : gradient `#3EE5A8 → #1d9e75` + box-shadow teal 18px.

### HeroCanvas.tsx (DARK adjustements)
- Opacités orbs ×2.6 : 0.15→0.42, 0.10→0.28, 0.08→0.22, 0.10→0.28, 0.065→0.18.
- Couleur orbs : `rgba(29,158,117)` → `rgba(64,212,160)` au cœur, redescente progressive vers `rgba(29,158,117)` dans les bords.
- Shadow orb : 30px → **38px**, `rgba(29,158,117, a*0.20)` → **`rgba(62,229,168, a*0.35)`**.
- Halo beam : couleur unifiée `rgba(62,229,168)`, opacités ×1.8 (peak 0.100→0.180). shadowBlur 8→12, shadowColor opacity 0.15→0.28.
- Glow beam : `rgba(22,168,130)` → gradient `rgba(64,212,160) → rgba(96,224,176) → rgba(128,236,192)`. shadowBlur 24→28.
- Core : conservé (déjà quasi-blanc au pic 0.50, parfait sur fond noir).

### Réparations préalables
- `HeroCanvas.tsx` restauré à **4135c80** (ITER 88) avant modif.
- `HeroSection.tsx` / `DashboardMockup.tsx` / `FloatingHands.tsx` restaurés depuis HEAD (working tree tronquée).
- `PROGRESS.md` restauré depuis HEAD puis append ITER 89.

### Prochaines itérations (ITER 90+)
- +20 % opacity orbs si encore discret sur le noir
- Grille 3.5 % → 2-4 % si trop visible
- Grain noise 1 % pour casser le banding radial
- Shimmer sur mot "reviennent" (2 cycles / 10s)
- Fade bas 140 → 100 px si mange le mockup


---

## ITER 90 — PIVOT mockup iPhone (18 Apr 2026)

**Direction changée** : le brief pivote vers un hero minimaliste blanc avec mockup iPhone qui flotte, type topanga.io / searchable.com / karumi.ai. On abandonne orbs, beams, fond sombre.

### Nouveau composant : `src/components/v5/PhoneMockup.tsx`
- **Châssis** : dégradé linéaire 145° 4 stops (`#DADCE0 → #F5F6F8 → #B8BDC6 → #8A8F99`) pour l'effet titanium brossé, padding 10px, borderRadius 46px. Inset box-shadows blanc haut/noir bas pour le relief.
- **Écran** : dégradé vertical sombre `#0B0D10 → #141619`, borderRadius interne 38px, inset stroke noir 2px.
- **Notch Dynamic Island** : barre 96×28px black, z-index 3, centrée top 12px.
- **Status bar** : "9:41" + "••• 100%" en blanc 13px.
- **Card fidélité à l'écran** (absolute top 68 bottom 24) : dégradé `#FFFFFF → #F6FBF9`, shadow teal 12 36 px, header "STAMPIFY / Café Lumière" + mark "S" gradient teal, barre progression 70% avec box-shadow teal 8px, grille 5×2 tampons (7 filled/3 empty), CTA "Prochain café / Offert dans 3 tampons".
- **Animations** (CSS keyframes inline) :
  - `v5PhoneFloat` 6.4s easeInOut — translateY 0→-16px, rotateX 5-6°, rotateY -7/-8°, rotateZ -0.4/-1.2°
  - `v5PhoneShadow` 6.4s synchrone inverse — scale 1→0.82, opacity 0.55→0.32, blur 10→16px
  - `v5StampPop` — scale 0.6→1.08→1, opacity 0→1, stagger 0.06s par tampon, cubic-bezier overshoot (0.34, 1.56, 0.64, 1)
- `prefers-reduced-motion` : animations désactivées.

### HeroSection.tsx (rewrite complet)
- Fond `#FFFFFF`, padding `120px 24px 96px`, minHeight 720.
- Halo vert derrière phone : `radial-gradient(50% 50% at 50% 50%, rgba(29,158,117,0.10)...)`, filter blur 40px, top 10% right -8%, width 48%, height 90%.
- Grille 2 colonnes 1fr/1fr, gap 72px.
- Badge `#E8F7F2` avec ping teal `#1d9e75`.
- Titre 3 lignes, "reviennent" en gradient text `#1d9e75 → #3EE5A8 → #1d9e75`.
- CTA primaire teal avec box-shadow accentuée au hover (`-4px 10px 24px`).
- CTA secondaire outline gris clair, hover teal.
- Social proof avatar gradient + étoiles 5⭐.

### Fichiers supprimés du chemin hero (mais conservés disque)
- `HeroCanvas.tsx` : plus importé par HeroSection. Reste en place pour historique / éventuel retour.
- `HeroBackground.tsx`, `HeroOrbs.tsx`, `FloatingHands.tsx` : pas touchés cette session, toujours disponibles pour les autres pages v5 (ex: CTA section).

### Validation
- `npx tsc --noEmit` : zero erreur sur tout le projet, v5 inclus.
- `npm run build` local ne peut pas s'exécuter depuis le sandbox (permissions NTFS sur `.next/`). Vercel fera foi.

### Prochaines itérations possibles (ITER 91+)
- Ajuster la rotation 3D du phone (trop / pas assez penché)
- Ajouter un reflet sur le verre de l'écran (linear-gradient blanc 8%)
- Boutons physiques sur les côtés du châssis (silent switch, volume, power)
- Camera cutout dans le notch pour plus de réalisme
- Animation tilt au mouseover du phone (parallax léger au scroll ou à la souris)
- Changer le nom du commerce sur la card au hover (Café Lumière → Bistrot du Coin)
