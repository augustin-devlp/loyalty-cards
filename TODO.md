# TODO — Stampify / Rialto

Backlog post-démo Mehmet. Tâches triées par impact business.

## 🔔 Actions non-code pour Augustin au réveil (Phase 10)

1. ✅ **Crédits SMS Brevo** : 447 restants. Pas critique mais garder
   un œil après la démo Mehmet si envoi massif loterie.
2. **Remettre horaires Rialto prod** dans le dashboard Stampify :
   Lun-Dim 11h30-23h30 (actuellement 00-05 pour tests nocturnes).
3. **Imprimer les 3 PDFs** pour Mehmet samedi :
   - Devis_Stampify_Rialto_JetPizza.pdf
   - Fiche_Justification_Pitch_Mehmet.pdf
   - Offre_SMS_Rialto_Stampify.pdf

## 📦 Reporté après signature Mehmet (pas cette nuit)

- **Pricing SMS dégressif** — tranches 0.20 / 0.17 / 0.14 / 0.12 / 0.10
  + abo campagnes 49/79/99 (4-6h, après signature)
- **Refonte images menu Nano Banana Pro** (attend `GEMINI_API_KEY`
  d'Augustin)
- **Apple Wallet / Google Wallet** sur `/c/[shortCode]`
- **Push notifications Service Worker**
- **Analyses Recharts** sidebar dashboard
- **Campagnes SMS marketing** UI admin
- **Rupture produit toggle** menu
- **Cleanup legacy composants** Rialto SPA (RialtoHome, MenuView,
  Hero, CheckoutForm, Cart, etc.)
- **Clé Google Places API** (jeudi avec la mère d'Augustin) — bascule
  auto `/api/rialto/loyalty/verify-review` en mode normal

## Migrations DB appliquées en Phase 5 (21/04 → 22/04)

- `menu_items_allergens_and_diet_flags` : `is_vegan`, `is_lactose_free`,
  `is_halal`, `is_kids_friendly`, `ingredients TEXT[]`, `allergens TEXT[]`,
  `description_long TEXT`. Seed Rialto : 56 items avec gluten, 48 milk,
  6 eggs, 3 molluscs, 7 sulphites (vins), 1 halal (kebab), 5 kids_friendly
  (margherita/funghi/prosciutto). `is_vegan` laissé à false manuellement
  (trop risqué à inférer automatiquement).

## Décisions manuelles à prendre dans Supabase Studio

- [ ] **Review vegan** : valider avec Mehmet quelles pizzas sont vegan
  (a priori margherita peut l'être si mozzarella vegan, mais c'est
  rarement le cas). Default=false actuellement pour éviter faux positif.
- [ ] **Enrichir `ingredients[]`** : scraper la carte Rialto officielle
  pour remplir les ingrédients visibles par plat (actuellement tous vides).
- [ ] **`description_long`** : description enrichie pour la page produit
  (actuellement on fallback sur `description` courte).

## Infrastructure (attente clés API)

- [ ] **Google Places API Key** — intégration automatique review gate
  - Configurer `GOOGLE_PLACES_API_KEY` dans Vercel loyalty-cards
  - Basculer `/api/rialto/loyalty/verify-review` en mode réel (code déjà
    en place, hack 60s ne sert que de fallback)
  - ETA : après jeudi 23 avril (carte bancaire mère d'Augustin)

- [ ] **Unsplash Access Key** — photos automatiques menu items
  - Créer app sur <https://unsplash.com/developers> (gratuit, 2 min)
  - Configurer `UNSPLASH_ACCESS_KEY` dans Vercel
  - Lancer `/api/admin/refresh-menu-images?business_id=<rialto>` (PIN 0808)

- [ ] **Gemini API Key** — génération images Nano Banana Pro
  - Voir `docs/nano-banana-integration.md`
  - Budget ~4 CHF pour générer le menu complet Rialto (106 items × 0.04 USD)
  - Décision : à faire uniquement si Unsplash ne suffit pas

## Fonctionnalités à coder

- [ ] **Analyses Recharts** — onglet sidebar /dashboard/commandes/analyses
  - KPIs (CA jour/semaine/mois, AOV, nb commandes)
  - Top 10 produits
  - Heatmap zones livraison
  - Heures de rush
  - Top clients fidèles

- [ ] **Campagnes SMS marketing** — /dashboard/commandes/campagnes
  - Segmenter clients (tous, inactifs 30j, VIP, dernière commande > X CHF…)
  - Prévisualisation SMS + cost estimation Brevo
  - Throttle (pour éviter blocklist Brevo)

- [ ] **Rupture produit toggle menu** — badge "Épuisé" + `is_available=false`
  - Toggle dans /dashboard/menu
  - Affichage grisé sur /menu Rialto

- [ ] **Ticket PDF download** depuis /confirmation/[orderNumber]
  - Endpoint existant : `/api/orders/[id]/receipt-email` (actuellement email)
  - Exposer un GET qui renvoie directement le PDF (stream blob)

- [ ] **Apple Wallet / Google Wallet** — ajout depuis /c/[shortCode]
  - Google Wallet : `GOOGLE_WALLET_CREDENTIALS` déjà configuré
  - Apple Wallet : générer .pkpass (nécessite cert Apple Developer)

- [ ] **Support MMS SMS pour QR code** — optionnel
  - Brevo ne supporte pas MMS, passer par Twilio pour US/CH ?
  - Décision : probablement pas rentable, lien web fonctionne très bien

## Dette technique

- [ ] **Cleanup legacy Rialto SPA** — supprimer les fichiers non utilisés
  - `src/components/RialtoHome.tsx`, `Hero.tsx`, `MenuView.tsx`,
    `CheckoutForm.tsx`, `PickupTimePicker.tsx`, `QRPickup.tsx`,
    `CategoryNav.tsx`, `Filters.tsx`, `MenuItemCard.tsx`, `Cart.tsx`,
    `FideliteSection.tsx`, `ContactSection.tsx`, `AvisSection.tsx`,
    `LegalSection.tsx`, `StatusTracker.tsx`, `SpinWheel.tsx`,
    `LotteryEntry.tsx`, `LoyaltyCardSignup.tsx`
  - Vérifier que `/order/[id]` reste fonctionnel (tracking SMS)

- [ ] **Unifier les hardcoded IDs Rialto** — un seul fichier source
  - `RIALTO_ID`, `RIALTO_BUSINESS_ID`, `RIALTO_CARD_ID`,
    `RIALTO_SPIN_WHEEL_ID`, `RIALTO_LOTTERY_ID` sont répétés dans
    plusieurs fichiers entre loyalty-cards et rialto-lausanne

- [ ] **Tests E2E avec Playwright** — au moins le happy path commande
  - `/` → saisie adresse → `/menu` → ajout items → `/checkout` → confirmation

## Décisions stratégiques en attente

- [ ] **Pricing Stampify** — page /pricing finalisée ?
- [ ] **Onboarding restaurateur** — wizard création compte + menu import CSV
- [ ] **Multi-langues** — EN/DE/IT pour les commandes touristiques Lausanne
