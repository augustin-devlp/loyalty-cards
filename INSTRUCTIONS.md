# STAMPIFY.CH — FULL BUILD PROMPT FOR CLAUDE CODE

You have full access to the stampify.ch codebase. Execute everything below in one session. Confirm each completed task with ✅ before moving to the next.

---

## PART 1 — BUG FIXES (do first, nothing else works until these are fixed)

### 1.1 Black screen bug
All sections below the hero are invisible. CSS animations use `opacity: 0` as initial state but never fire properly.

Fix: In globals.css or wherever animations are defined, add:
```css
* { animation-fill-mode: both; }
```
Or remove `opacity: 0` initial state from all non-hero animated elements. Keep animations only on `.hero-badge`, `.hero-h1`, `.hero-subtitle`, `.hero-cta`, `.hero-guarantees`.

### 1.2 Pricing section too tall (~1500px)
Find the pricing/tarif section in `app/page.tsx`. Set section padding to `100px 0` desktop, `60px 0` mobile. Remove any `min-height` on the price card. Fix list item spacing to `padding: 8px 0` max.

### 1.3 Stats bar
Find the dark stats bar (`bg #1A1410`). Set padding to `56px 32px` desktop, `40px 20px` mobile.

---

## PART 2 — HERO ANIMATION (replace static visual)

Replace the current static hero visual (plaque + card) in `app/page.tsx` with a 4-step CSS-only looping animation. No JS libraries, no Framer Motion, no GSAP. Pure CSS animations + React useState for step tracking.

### Animation sequence (12s loop)

**Step 0 — NFC Plaque (0-3s)**
- Wood plaque CSS component (already exists, keep it)
- Add a phone SVG that slides in from the right: `translateX(80px) → translateX(10px)`, opacity 0→1
- On "tap": ripple circle that scales 0→2.5 and fades out (600ms)
- Small badge fades in: "Approchez votre téléphone →"

**Step 1 — Loyalty card filling (3-6s)**
- Plaque fades out, white card fades in
- 10 stamp circles in a 5×2 grid
- First 6 fill instantly (already collected), 7th fills with bounce: `scale(0) → scale(1.3) → scale(1)`, bg `#EEF0FC → #3D31B0`
- Each stamp: 120ms delay between them
- Badge: "Tampon ajouté ✓"

**Step 2 — Spin wheel (6-9s)**
- Card slides down, spin wheel appears
- SVG circle divided into 6 segments alternating `#3D31B0` / `#EEF0FC`
- Labels: "Café offert" / "-10%" / "Croissant 🥐" / "-20%" / "Tampon x2" / "Surprise ✨"
- Spins 4 full rotations with `cubic-bezier(0.1, 0.8, 0.2, 1)` deceleration, stops on "Café offert"
- Small triangle pointer at top
- Badge: "🎰 Café offert !"

**Step 3 — SMS notification (9-12s)**
- Wheel fades out, SMS bubble slides up
- Dark rounded card (`#1A1410`, border-radius 16px, max-width 280px)
- Stampify logo top-left (small)
- Typewriter text effect: `"🥐 Il vous reste 3 tampons pour votre café offert ! Revenez ce weekend."`
- Typewriter: use CSS `width: 0 → 100%` with `overflow: hidden`, `white-space: nowrap`, `steps(40)`
- Badge: "SMS envoyé à vos clients 📱"

### Step transitions
```tsx
useEffect(() => {
  const t = setInterval(() => setStep(s => (s + 1) % 4), 3000);
  return () => clearInterval(t);
}, []);
```
Each step: opacity 0→1 in 400ms at start, opacity 1→0 in 400ms at end.

---

## PART 3 — COPYWRITING UPDATES (all in app/page.tsx)

### Hero subtitle — replace with:
```
Site vitrine + carte fidélité digitale + plaquette NFC gravée. 990 CHF, livraison 48h.
```

### 4 micro-guarantees — replace with:
```
✓ 48h chrono   ✓ 990 CHF tout inclus   ✓ Zéro abonnement   ✓ Plaquette NFC gravée
```

### Problem section cards:
1. "Vos cartes papier finissent à la poubelle" — "Perdues, oubliées, jetées. Toute votre fidélisation part avec."
2. "Sans rappel digital, ils vont ailleurs" — "Le café d'en face a une carte fidélité sur téléphone. Le vôtre est en carton."
3. "Invisible sur Google, invisible pour vos clients" — "97% des gens cherchent un commerce local sur Google avant de se déplacer."

### Features section:
1. "Site vitrine professionnel" — "5 pages à vos couleurs. Domaine .ch + hébergement inclus. Sur Google dès la première semaine."
2. "Carte fidélité sans app" — "QR code ou NFC. La carte s'ouvre instantanément. Zéro téléchargement pour vos clients."
3. "Plaquette en bois gravée à votre nom" — "Sur votre comptoir, elle attire l'œil et fidélise chaque client qui passe."
4. "SEO local optimisé" — "'Boulangerie Genève', 'café Lausanne'... vos clients vous trouvent avant vos concurrents."
5. "Domaine .ch + hébergement offerts" — "Tout inclus la première année. Pas de surprise, pas de facture cachée."
6. "Campagnes SMS (add-on)" — "'Ce weekend -20%' envoyé à tous vos clients fidèles. Depuis votre tableau de bord."

### Pricing section — replace italic argument:
```
Une agence suisse facture 1 500 à 5 000 CHF pour un site seul.
Nous livrons site + carte fidélité + plaquette NFC + SEO + hébergement.
Pour 990 CHF. En 48h.
```

### Under CTA button — replace:
```
2.71 CHF par jour. Moins que votre café du matin.
```

### How it works steps:
1. "Parlez-nous de votre commerce" — "Un échange rapide sur WhatsApp. Réponse sous 2h, 7j/7."
2. "On crée tout en 48h" — "Site, carte fidélité, plaquette NFC gravée, SEO local. Zéro action de votre part."
3. "Vos clients reviennent" — "Votre commerce apparaît sur Google. Vos clients ont leur carte dans la poche."

---

## PART 4 — DEMO BANNER COMPONENT

Create `components/DemoBanner.tsx`:

```tsx
// Sticky top bar on all demo pages
// White bg, border-bottom 1px solid #E2D9CC, sticky top-0, z-50
// Desktop: flex row space-between, padding 14px 32px
//   Left: "Exemple de site livré en 48h" (13px #6B6259) + 
//         "990 CHF · Site + carte fidélité + plaquette NFC · Paiement unique" (15px #1A1410 font-medium)
//   Right: button "Obtenir mon site →" bg #3D31B0 text-white px-5 py-2.5 rounded-lg
// Mobile: flex col gap-3, button full width, text centered
```

Add `<DemoBanner />` as first element in:
- `app/demos/cafe/page.tsx`
- `app/demos/boulangerie/page.tsx`
- `app/demos/barbershop/page.tsx`
- `app/demos/restaurant/page.tsx`
- `app/demos/manucure/page.tsx`
- `app/demos/spa/page.tsx`
- Any other page under `app/demos/`

---

## PART 5 — WHATSAPP FLOATING BUTTON

Add to main layout or `app/page.tsx`, mobile only (`md:hidden`):

```tsx
// Fixed bottom-5 right-5 z-50
// Circle 56px, bg #25D366, rounded-full
// WhatsApp SVG icon white 28px center
// box-shadow: 0 4px 16px rgba(37,211,102,0.4)
// href: wa.me/ + existing WhatsApp number already on the site
```

---

## PART 6 — SEO METADATA UPDATE

Update `app/layout.tsx` or wherever metadata is defined:

```tsx
export const metadata = {
  title: 'Stampify — Site web + carte fidélité pour commerçants | Suisse romande',
  description: 'Site vitrine professionnel + carte de fidélité digitale + plaquette NFC en bois. Livraison 48h, 990 CHF tout inclus, domaine .ch + hébergement offerts. Pour boulangers, cafés, restaurants et salons en Suisse romande.',
  keywords: [
    'carte fidélité digitale Suisse',
    'site web boulangerie Genève',
    'site vitrine commerçant Lausanne',
    'carte fidélité sans application',
    'fidélisation clients commerce local Suisse romande',
    'site web restaurant Fribourg',
    'carte fidélité café Suisse',
    'création site web 48h Suisse',
    'carte fidélité digitale commerçant',
    'site vitrine boulangerie Suisse',
  ],
  openGraph: {
    title: 'Stampify — Fidélisez vos clients en 48h | 990 CHF',
    description: 'Site web + carte fidélité + plaquette NFC. 990 CHF, livraison 48h, zéro abonnement.',
    url: 'https://www.stampify.ch',
    siteName: 'Stampify',
    locale: 'fr_CH',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.stampify.ch',
  }
}
```

Add image alt tags on all visual elements:
- Plaque: `"Plaquette NFC en bois gravée Stampify — carte fidélité digitale commerçants Suisse"`
- Card: `"Carte de fidélité digitale Stampify — sans application téléphone"`
- Demo images: `"Site vitrine [secteur] Suisse romande créé par Stampify en 48h"`

---

## PART 7 — BLOG PAGES FOR SEO (beat stampify.co on Google)

Create a blog section to rank above competitors on local Swiss searches.

### 7.1 Blog index page — create `app/blog/page.tsx`

```tsx
// Title: "Blog — Conseils fidélisation clients pour commerçants"
// Grid of blog post cards (4 cols desktop, 2 tablet, 1 mobile)
// Each card: cover image placeholder, category tag, title, 2-line excerpt, read time, "Lire →" link
// Same styling as rest of site (Fraunces titles, DM Sans body, #F5F0E8 bg)
```

### 7.2 Blog post template — create `app/blog/[slug]/page.tsx`

```tsx
// Dynamic route for all blog posts
// Layout: centered content max-width 720px
// Fraunces H1, DM Sans body 18px line-height 1.8
// Table of contents (sticky left sidebar on desktop)
// Related posts section at bottom
// CTA banner at end: "Prêt à fidéliser vos clients ? 990 CHF tout inclus →"
// generateMetadata function for dynamic SEO per post
```

### 7.3 Blog posts — create these 10 files as MDX or static TSX

Create `app/blog/[slug]/content/` folder with these posts. Each post: min 800 words, H2/H3 structure, internal links to stampify.ch pages.

---

**POST 1** — `carte-fidelite-digitale-boulangerie-suisse`
- Title: `Carte de fidélité digitale pour boulangerie en Suisse : le guide complet 2026`
- Meta: `Comment mettre en place une carte fidélité digitale dans votre boulangerie en Suisse romande. Sans app, sans abonnement. Livraison en 48h.`
- H2s: Pourquoi les cartes papier ne marchent plus / Comment fonctionne une carte fidélité digitale / Les avantages pour une boulangerie suisse / Combien ça coûte / Comment Stampify livre votre carte en 48h
- Keywords: carte fidélité boulangerie Suisse, fidélisation clients boulangerie, carte fidélité digitale boulangerie

---

**POST 2** — `site-web-cafe-lausanne-geneve`
- Title: `Créer un site web pour son café à Lausanne ou Genève : prix, options et pièges à éviter`
- Meta: `Guide complet pour créer un site web professionnel pour votre café en Suisse romande. Tarifs, délais, ce qu'il faut inclure pour être trouvé sur Google.`
- H2s: Pourquoi votre café a besoin d'un site / Ce que doit contenir un site de café / SEO local pour café suisse / Prix d'un site web café en Suisse / Pourquoi Stampify en 48h
- Keywords: site web café Lausanne, site internet café Genève, création site café Suisse

---

**POST 3** — `fideliser-clients-restaurant-suisse-romande`
- Title: `Comment fidéliser ses clients dans un restaurant en Suisse romande en 2026`
- Meta: `Les meilleures stratégies pour fidéliser vos clients de restaurant en Suisse. Carte fidélité digitale, SMS, Google Maps. Guide pratique.`
- H2s: L'état de la fidélisation dans la restauration suisse / Carte fidélité vs points : quoi choisir / Le pouvoir des SMS pour les restaurants / Comment Stampify aide les restaurateurs
- Keywords: fidélisation clients restaurant Suisse, carte fidélité restaurant Genève, programme fidélité restaurant

---

**POST 4** — `remplacer-carte-fidelite-papier-digital`
- Title: `Passer de la carte fidélité papier au digital : guide pour commerçants`
- Meta: `Comment remplacer vos cartes tampons papier par une solution digitale sans app. Avantages, coûts, étapes pratiques pour un commerce local.`
- H2s: Les problèmes des cartes papier / Les solutions digitales existantes / Comment faire la transition sans perdre vos clients / Coût d'une carte fidélité digitale
- Keywords: remplacer carte fidélité papier, carte fidélité digitale sans app, passer numérique fidélité

---

**POST 5** — `site-web-salon-coiffure-suisse`
- Title: `Site web pour salon de coiffure en Suisse : tout ce qu'il faut savoir`
- Meta: `Créez un site web professionnel pour votre salon de coiffure en Suisse romande. Intégrez une carte fidélité et apparaissez en premier sur Google.`
- H2s: Pourquoi un salon de coiffure a besoin d'un site / Les fonctionnalités indispensables / SEO local coiffure suisse / Exemples de sites de salons
- Keywords: site web salon coiffure Suisse, site coiffeur Genève, création site salon coiffure Lausanne

---

**POST 6** — `seo-local-commerce-suisse-romande`
- Title: `SEO local pour commerçants en Suisse romande : guide débutant 2026`
- Meta: `Comment apparaître en premier sur Google quand vos clients cherchent votre type de commerce en Suisse romande. Guide SEO local simple et actionnable.`
- H2s: Qu'est-ce que le SEO local / Google My Business : base incontournable / Les mots-clés que vos clients tapent / Comment Stampify optimise votre SEO local
- Keywords: SEO local Suisse romande, référencement local commerce Suisse, Google My Business commerçant

---

**POST 7** — `plaquette-nfc-commerce-local`
- Title: `Plaquette NFC pour commerce local : qu'est-ce que c'est et pourquoi en avoir une`
- Meta: `La plaquette NFC en bois gravée révolutionne la fidélisation en commerce de proximité. Découvrez comment ça fonctionne et pourquoi vos clients adorent.`
- H2s: Qu'est-ce que le NFC / Comment fonctionne une plaquette NFC en boutique / Avantages vs QR code seul / La plaquette Stampify en bois gravée
- Keywords: plaquette NFC commerce, NFC fidélité client, borne NFC boutique

---

**POST 8** — `campagne-sms-fidelisation-commercants`
- Title: `Campagnes SMS pour fidéliser vos clients : guide pratique pour commerçants locaux`
- Meta: `Comment utiliser les SMS pour faire revenir vos clients réguliers. Exemples de messages, fréquence idéale, résultats attendus pour un commerce local.`
- H2s: Pourquoi le SMS est le canal le plus efficace / Les erreurs à éviter / Exemples de messages qui marchent / Le taux de retour avec les SMS Stampify
- Keywords: SMS fidélisation client, campagne SMS commerce local, message SMS boulangerie client

---

**POST 9** — `combien-coute-site-web-commercant-suisse`
- Title: `Combien coûte un site web pour commerçant en Suisse en 2026 ? Tarifs réels`
- Meta: `Les prix réels d'un site web professionnel pour commerce local en Suisse romande. Agences, freelances, solutions clé en main : comparatif honnête.`
- H2s: Les prix des agences web suisses / Ce qu'on obtient pour 1 500 - 5 000 CHF / Solutions low-cost et leurs limites / Stampify : pourquoi 990 CHF tout inclus
- Keywords: prix site web Suisse, coût création site internet Suisse romande, tarif site web commerçant

---

**POST 10** — `fidelisation-clients-cafe-coffee-shop`
- Title: `Fidéliser les clients d'un café ou coffee shop : les stratégies qui marchent vraiment`
- Meta: `Les techniques éprouvées pour fidéliser vos clients dans votre café. Carte fidélité, SMS, ambiance, programme VIP. Guide pratique pour coffee shops en Suisse.`
- H2s: Pourquoi la fidélisation est vitale pour un café / La psychologie du client café / Carte fidélité : tampons vs points / SMS et notifications / Le programme Stampify pour cafés
- Keywords: fidéliser clients café, programme fidélité coffee shop, carte fidélité café Suisse

---

### 7.4 Blog sitemap — add to `app/sitemap.ts`

```tsx
// Add all blog post URLs to sitemap with:
// changeFrequency: 'monthly'
// priority: 0.7
// lastModified: new Date()
```

### 7.5 Internal linking strategy

In each blog post, link naturally to:
- `stampify.ch/` (homepage) — at least once
- `stampify.ch/demos/[relevant-sector]` — at least once
- 2-3 other blog posts (cross-linking)

In `app/page.tsx`, add a "Derniers articles" section just before the footer:
```tsx
// 3 featured blog posts in a horizontal card row
// Title: "Conseils pour les commerçants"
// Each card: category, title, "Lire →" link
// bg white, border #E2D9CC, border-radius 12px
```

---

## PART 8 — DEMO PAGES SEO OPTIMIZATION

For each demo page (`app/demos/*/page.tsx`), add/update metadata:

```tsx
// Boulangerie:
title: 'Démo site web boulangerie | Stampify — Suisse romande'
description: 'Exemple de site vitrine pour boulangerie créé par Stampify. Livraison 48h, 990 CHF, carte fidélité digitale incluse.'

// Café:
title: 'Démo site web café & coffee shop | Stampify — Suisse romande'
description: 'Exemple de site vitrine pour café créé par Stampify. Avec carte de fidélité digitale et plaquette NFC. 990 CHF tout inclus.'

// Restaurant:
title: 'Démo site web restaurant | Stampify — Suisse romande'
description: 'Exemple de site vitrine restaurant créé par Stampify en 48h. SEO local, carte fidélité, domaine .ch inclus.'

// Barbershop/Salon:
title: 'Démo site web salon coiffure | Stampify — Suisse romande'
description: 'Exemple de site pour salon de coiffure ou barbershop. Carte fidélité digitale, plaquette NFC, 990 CHF tout inclus.'

// Manucure:
title: 'Démo site web nail art & manucure | Stampify'
description: 'Exemple de site vitrine pour onglerie et nail art. Stampify crée votre site + carte fidélité en 48h pour 990 CHF.'

// Spa:
title: 'Démo site web spa & institut de beauté | Stampify'
description: 'Exemple de site vitrine pour spa et institut de beauté. Site professionnel + carte fidélité + plaquette NFC en 48h.'
```

---

## PART 9 — ROBOTS.TXT AND SITEMAP

Create `app/robots.ts` if not exists:
```tsx
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.stampify.ch/sitemap.xml',
  }
}
```

Create or update `app/sitemap.ts`:
```tsx
// Include all routes with correct priorities:
// / → priority 1.0
// /demos/* → priority 0.8
// /blog → priority 0.9
// /blog/* → priority 0.7
```

---

## EXECUTION ORDER

1. ✅ Part 1 — Bug fixes (black screen, pricing height, stats bar)
2. ✅ Part 3 — Copywriting updates (fast, high SEO impact)
3. ✅ Part 6 — SEO metadata
4. ✅ Part 9 — Robots + sitemap
5. ✅ Part 4 — DemoBanner component
6. ✅ Part 5 — WhatsApp floating button
7. ✅ Part 8 — Demo pages metadata
8. ✅ Part 7 — Blog: index + template + 10 posts
9. ✅ Part 2 — Hero animation (last, most complex)

Don't touch: hero colors (#F5F0E8, #3D31B0, #1A1410), Fraunces/DM Sans typography, existing WhatsApp links, existing demo URLs.
