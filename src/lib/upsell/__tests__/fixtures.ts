import type { MenuItemFull, UpsellContext } from '../types';

// Catalogue minimal réutilisable — sous-ensemble des 121 plats Rialto
export const FIXTURE_ITEMS: Record<string, Partial<MenuItemFull>> = {
  arrabbiata: {
    id: '8bd11648-bc7c-4070-86b4-98d895f17443', name: 'Pizza Arrabbiata', price: 19.50,
    heat_level: 4, richness_level: 3, dish_role: 'main', cuisine_style: 'italian',
    main_ingredient: 'vegetable', is_vegetarian: true, contains_pork: false, contains_alcohol: false,
    upsell_tags: ['spicy', 'very_spicy', 'bold', 'vegetarian'],
    pairs_well_with_ids: ['f1999f54-805f-44b1-8965-f150f89c126c', '2f6e6396-ff55-49b1-8479-3a50a79caad4'],
    avoid_with_ids: [], serves_pax: 1, ideal_time_of_day: ['lunch', 'dinner'], semantic_tags: []
  },
  bethusy: {
    id: 'dc4450ec-2e64-4755-a050-f79728e3298e', name: 'Pizza Bethusy', price: 24.00,
    heat_level: 0, richness_level: 4, dish_role: 'main', cuisine_style: 'italian',
    main_ingredient: 'pork', is_vegetarian: false, contains_pork: true, contains_alcohol: false,
    upsell_tags: ['signature', 'house_pride', 'date_night', 'classic_italian', 'premium'],
    pairs_well_with_ids: ['a970e962-5f81-4b53-84b3-37adc5de08e8', '3e311046-cda7-4851-90ba-1ac5690e0361', '6d2dd901-99d2-4a76-bb03-a6c77c2d99af'],
    avoid_with_ids: [], serves_pax: 1, semantic_tags: ['signature']
  },
  tajine: {
    id: '86470efb-5551-48dd-a068-394116d337a5', name: 'Tajine Anatolienne', price: 28.00,
    heat_level: 2, richness_level: 4, dish_role: 'main', cuisine_style: 'anatolian',
    main_ingredient: 'lamb', is_vegetarian: false, contains_pork: false, contains_alcohol: false,
    upsell_tags: ['signature', 'anatolian', 'exotic'],
    pairs_well_with_ids: ['044ccdf8-a642-4258-8658-9b4efc4c68eb', 'b703d269-e467-4026-baaf-5e709e26a228', '9a40203f-8005-4914-8f1e-47076ebdab50'],
    avoid_with_ids: ['a970e962-5f81-4b53-84b3-37adc5de08e8'], serves_pax: 1, semantic_tags: ['signature', 'anatolian_pride']
  },
  kavurma: {
    id: 'fb4db9da-470b-4bf0-8b4f-6039a0e1c2a6', name: 'Pizza Kavurma', price: 26.00,
    heat_level: 2, richness_level: 5, dish_role: 'main', cuisine_style: 'anatolian',
    main_ingredient: 'beef', is_vegetarian: false, contains_pork: false, contains_alcohol: false,
    upsell_tags: ['anatolian', 'meat_lovers', 'signature_fusion'],
    pairs_well_with_ids: ['44413b62-e906-4d29-8498-34ee61059af6', 'b703d269-e467-4026-baaf-5e709e26a228'],
    avoid_with_ids: ['a970e962-5f81-4b53-84b3-37adc5de08e8'], serves_pax: 1, semantic_tags: ['signature', 'anatolian']
  },
  grillade_mixte: {
    id: '55112e92-bcf9-4e01-b1c7-ec4e2a1b67e0', name: 'Grillade mixte', price: 38.00,
    heat_level: 2, richness_level: 5, dish_role: 'main', cuisine_style: 'anatolian',
    main_ingredient: 'lamb', is_vegetarian: false, contains_pork: false, contains_alcohol: false,
    upsell_tags: ['signature', 'anatolian', 'feast', 'shareable', 'meat_lovers'],
    pairs_well_with_ids: ['044ccdf8-a642-4258-8658-9b4efc4c68eb', '7da2f3e2-eb1a-4a11-8553-a3cb2e09d083', '9a40203f-8005-4914-8f1e-47076ebdab50'],
    serves_pax: 2, is_shareable: true, semantic_tags: ['signature']
  },
  carbonara: {
    id: '5c28861d-dac0-458c-8fe7-3e17343ae8cd', name: 'Pâtes Carbonara', price: 21.00,
    heat_level: 0, richness_level: 5, dish_role: 'main', cuisine_style: 'italian',
    main_ingredient: 'pork', is_vegetarian: false, contains_pork: true, contains_alcohol: false,
    upsell_tags: ['comfort_food', 'creamy', 'heavy', 'classic_italian'],
    pairs_well_with_ids: ['44fbd76b-1ae3-4b99-9b38-651ac6f9bab4', '6d2dd901-99d2-4a76-bb03-a6c77c2d99af'],
    serves_pax: 1, semantic_tags: []
  },
  cheeseburger: {
    id: '8506661c-93ad-46ff-9e0a-5047ccaf8614', name: 'Cheeseburger', price: 22.00,
    heat_level: 0, richness_level: 5, dish_role: 'main', cuisine_style: 'universal',
    main_ingredient: 'beef', is_vegetarian: false, contains_pork: false, contains_alcohol: false,
    upsell_tags: ['comfort_food', 'fast_food', 'fries_included'],
    pairs_well_with_ids: ['63889d31-a920-4a73-b5a4-12bfcb6e1575'],
    avoid_with_ids: ['70b16d92-7e04-40a9-9984-429313029fc3'],
    serves_pax: 1, semantic_tags: []
  },
  salade_meslee: {
    id: '3e311046-cda7-4851-90ba-1ac5690e0361', name: 'Salade mêlée', price: 9.50,
    dish_role: 'starter', cuisine_style: 'universal', heat_level: 0, richness_level: 1,
    is_vegetarian: true, contains_pork: false, contains_alcohol: false,
    upsell_tags: ['starter', 'light', 'vegetarian'], serves_pax: 1
  },
  salade_anato: {
    id: '044ccdf8-a642-4258-8658-9b4efc4c68eb', name: 'Salade anatolienne', price: 11.00,
    dish_role: 'starter', cuisine_style: 'anatolian', heat_level: 0, richness_level: 1,
    is_vegetarian: true, contains_pork: false, contains_alcohol: false,
    upsell_tags: ['starter', 'anatolian', 'light'], serves_pax: 1
  },
  coca: {
    id: '63889d31-a920-4a73-b5a4-12bfcb6e1575', name: 'Coca-Cola 0.5l', price: 4.50,
    dish_role: 'drink_soft', cuisine_style: 'universal', heat_level: 0,
    is_vegetarian: true, contains_pork: false, contains_alcohol: false,
    upsell_tags: ['drink', 'cola'], serves_pax: 1
  },
  limonade: {
    id: 'f1999f54-805f-44b1-8965-f150f89c126c', name: 'Limonade 0.5l', price: 4.80,
    dish_role: 'drink_soft', cuisine_style: 'universal', heat_level: 0,
    sweetness_level: 4, acidity_level: 5, is_vegetarian: true, contains_pork: false,
    contains_alcohol: false, upsell_tags: ['drink', 'lemonade', 'very_refreshing', 'spicy_pairing'],
    serves_pax: 1
  },
  fusetea_peche: {
    id: '2f6e6396-ff55-49b1-8479-3a50a79caad4', name: 'Fusetea pêche 0.5l', price: 4.50,
    dish_role: 'drink_soft', cuisine_style: 'universal', is_vegetarian: true,
    contains_pork: false, contains_alcohol: false,
    upsell_tags: ['drink', 'iced_tea', 'refreshing', 'spicy_pairing'], serves_pax: 1
  },
  red_bull: {
    id: '64cf9a7f-57b1-41d3-94b8-25fdbde2372d', name: 'Red Bull', price: 5.50,
    dish_role: 'drink_soft', cuisine_style: 'universal', is_vegetarian: true,
    contains_pork: false, contains_alcohol: false,
    upsell_tags: ['drink', 'energy_drink', 'late_night'],
    ideal_time_of_day: ['late_night'], serves_pax: 1
  },
  chianti: {
    id: 'a970e962-5f81-4b53-84b3-37adc5de08e8', name: 'Chianti 0.75l', price: 32.00,
    dish_role: 'drink_alcohol', cuisine_style: 'italian', is_vegetarian: true,
    contains_pork: false, contains_alcohol: true,
    upsell_tags: ['wine', 'red_wine', 'italian_wine', 'pizza_pairing', 'date_night', 'italian_classic'],
    serves_pax: 3, is_shareable: true, semantic_tags: ['italian_classic']
  },
  yakut: {
    id: '44413b62-e906-4d29-8498-34ee61059af6', name: 'Yakut rouge 0.75l', price: 34.00,
    dish_role: 'drink_alcohol', cuisine_style: 'anatolian', is_vegetarian: true,
    contains_pork: false, contains_alcohol: true,
    upsell_tags: ['wine', 'red_wine', 'turkish_wine', 'anatolian', 'kebab_pairing'],
    serves_pax: 3, semantic_tags: ['anatolian_pride']
  },
  efes: {
    id: 'b703d269-e467-4026-baaf-5e709e26a228', name: 'Efes 33', price: 4.80,
    dish_role: 'drink_alcohol', cuisine_style: 'anatolian', is_vegetarian: true,
    contains_pork: false, contains_alcohol: true,
    upsell_tags: ['beer', 'turkish_beer', 'anatolian'], serves_pax: 1
  },
  tiramisu: {
    id: '6d2dd901-99d2-4a76-bb03-a6c77c2d99af', name: 'Tiramisu', price: 8.50,
    dish_role: 'dessert', cuisine_style: 'italian', sweetness_level: 4,
    is_vegetarian: true, contains_pork: false, contains_alcohol: true,
    upsell_tags: ['dessert', 'classic_italian', 'signature'], serves_pax: 1,
    semantic_tags: ['signature_dessert']
  },
  baklava: {
    id: '9a40203f-8005-4914-8f1e-47076ebdab50', name: 'Baklava', price: 7.00,
    dish_role: 'dessert', cuisine_style: 'anatolian', sweetness_level: 5,
    is_vegetarian: true, contains_pork: false, contains_alcohol: false,
    upsell_tags: ['dessert', 'anatolian', 'signature'], serves_pax: 1,
    semantic_tags: ['anatolian_dessert']
  },
  glace_cookie: {
    id: '3598fbf8-f1f9-4431-bf79-24dca6f56e0f', name: 'Glacé cookie 500ml', price: 11.00,
    dish_role: 'dessert', cuisine_style: 'universal', sweetness_level: 5,
    is_vegetarian: true, contains_pork: false, contains_alcohol: false,
    upsell_tags: ['dessert', 'cooling', 'summer', 'shareable'],
    serves_pax: 3, is_shareable: true
  },
  frites: {
    id: '70b16d92-7e04-40a9-9984-429313029fc3', name: 'Frites', price: 6.50,
    dish_role: 'side', cuisine_style: 'universal', is_vegetarian: true,
    contains_pork: false, contains_alcohol: false,
    upsell_tags: ['side', 'classic', 'shareable'], serves_pax: 1
  },
  combo_bolo: {
    id: 'cec6e968-a3e2-4649-be3e-ab53133209b2', name: 'Combo Pizza bolognaise', price: 24.00,
    dish_role: 'combo', cuisine_style: 'italian', main_ingredient: 'beef',
    is_vegetarian: false, contains_pork: false, contains_alcohol: false,
    upsell_tags: ['combo'],
    avoid_with_ids: ['63889d31-a920-4a73-b5a4-12bfcb6e1575', '2f6e6396-ff55-49b1-8479-3a50a79caad4', 'f1999f54-805f-44b1-8965-f150f89c126c', 'fe329962-741f-4e93-aadb-677a07db2cbd'],
    serves_pax: 1
  },
  tomate_mozza: {
    id: 'c714276f-c8b0-450c-bf13-d0394e8cbbdc', name: 'Tomate Mozzarella', price: 12.00,
    dish_role: 'starter', cuisine_style: 'italian', is_vegetarian: true,
    contains_pork: false, contains_alcohol: false,
    upsell_tags: ['starter', 'classic_italian', 'fresh'], serves_pax: 1
  },
  pinot: {
    id: '44fbd76b-1ae3-4b99-9b38-651ac6f9bab4', name: 'Pinot noir 0.75l', price: 36.00,
    dish_role: 'drink_alcohol', cuisine_style: 'french', is_vegetarian: true,
    contains_pork: false, contains_alcohol: true,
    upsell_tags: ['wine', 'red_wine', 'local_swiss', 'meat_pairing'],
    serves_pax: 3, is_shareable: true
  },
};

// Fills defaults
export function item(key: keyof typeof FIXTURE_ITEMS, q = 1): MenuItemFull {
  const base = FIXTURE_ITEMS[key];
  return {
    id: '', name: '', price: 0, is_available: true, is_out_of_stock: false, category_id: '',
    heat_level: 0, richness_level: 2, saltiness_level: 2, sweetness_level: 1, acidity_level: 2,
    caloric_density: 3, fat_level: 3, dish_role: 'main', cuisine_style: 'italian',
    main_ingredient: 'vegetable', is_vegetarian: true, contains_pork: false, contains_alcohol: false,
    serves_pax: 1, is_shareable: false, ideal_time_of_day: ['lunch', 'dinner'],
    upsell_tags: [], pairs_well_with_ids: [], avoid_with_ids: [], semantic_tags: [],
    ...base,
    quantity: q
  } as MenuItemFull;
}

// Contexte par défaut: jeudi 20h automne
export const DEFAULT_CTX: UpsellContext = {
  timeOfDay: 'dinner', season: 'autumn', dayOfWeek: 4, isWeekend: false, hour: 20,
  customerLastOrderedIds: [], customerTopCategoryIds: [], blacklistedCategories: []
};

export interface Scenario {
  name: string;
  cart: MenuItemFull[];
  context: Partial<UpsellContext>;
  expectations: {
    maxSuggestions?: number;
    minSuggestions?: number;
    mustInclude?: string[];
    mustExclude?: string[];
    mustMatchTags?: string[];
    mustNotMatchTags?: string[];
  };
}

export const SCENARIOS: Scenario[] = [
  // ===== GROUPE A : Piquant / rafraîchissant =====
  {
    name: 'Arrabbiata seule -> boisson rafraîchissante, JAMAIS vin',
    cart: [item('arrabbiata')],
    context: {},
    expectations: { minSuggestions: 1, maxSuggestions: 2, mustMatchTags: ['very_refreshing', 'refreshing', 'iced_tea', 'lemonade'], mustNotMatchTags: ['wine', 'red_wine', 'white_wine', 'beer'] }
  },
  {
    name: 'Arrabbiata + Limonade -> pas 2e boisson',
    cart: [item('arrabbiata'), item('limonade')],
    context: {},
    expectations: { maxSuggestions: 2, mustExclude: ['63889d31-a920-4a73-b5a4-12bfcb6e1575', 'f1999f54-805f-44b1-8965-f150f89c126c', '2f6e6396-ff55-49b1-8479-3a50a79caad4'], mustNotMatchTags: ['drink', 'cola', 'iced_tea', 'lemonade'] }
  },
  {
    name: 'Arrabbiata + Coca -> dessert ou rien, pas 2e boisson',
    cart: [item('arrabbiata'), item('coca')],
    context: {},
    expectations: { maxSuggestions: 2, mustNotMatchTags: ['drink', 'cola', 'lemonade', 'iced_tea'] }
  },

  // ===== GROUPE B : Signature italienne =====
  {
    name: 'Bethusy seule (date night weekend) -> Chianti OU Tiramisu',
    cart: [item('bethusy')],
    context: { timeOfDay: 'dinner', isWeekend: true },
    expectations: { minSuggestions: 1, maxSuggestions: 2, mustMatchTags: ['italian_wine', 'dessert', 'italian_classic', 'classic_italian', 'signature'] }
  },
  {
    name: 'Carbonara seule -> PAS de vin turc',
    cart: [item('carbonara')],
    context: {},
    expectations: { maxSuggestions: 2, mustNotMatchTags: ['turkish_wine'] }
  },

  // ===== GROUPE C : Anatolien =====
  {
    name: 'Tajine seule -> Efes / Yakut / Baklava, JAMAIS Chianti',
    cart: [item('tajine')],
    context: {},
    expectations: { minSuggestions: 1, maxSuggestions: 2, mustExclude: ['a970e962-5f81-4b53-84b3-37adc5de08e8'], mustNotMatchTags: ['italian_wine'] }
  },
  {
    name: 'Grillade mixte -> feast anatolien (starter/dessert anato)',
    cart: [item('grillade_mixte')],
    context: {},
    expectations: { minSuggestions: 1, maxSuggestions: 2, mustMatchTags: ['anatolian', 'shareable', 'starter', 'dessert'] }
  },

  // ===== GROUPE D : Hamburgers (frites incluses) =====
  {
    name: 'Cheeseburger seul -> JAMAIS frites',
    cart: [item('cheeseburger')],
    context: {},
    expectations: { maxSuggestions: 2, mustExclude: ['70b16d92-7e04-40a9-9984-429313029fc3'] }
  },
  {
    name: 'Cheeseburger + Coca -> dessert ou rien',
    cart: [item('cheeseburger'), item('coca')],
    context: {},
    expectations: { maxSuggestions: 1, mustNotMatchTags: ['drink', 'cola'] }
  },

  // ===== GROUPE E : Combos =====
  {
    name: 'Combo bolo seul -> PAS de softdrink',
    cart: [item('combo_bolo')],
    context: {},
    expectations: { maxSuggestions: 2, mustExclude: ['63889d31-a920-4a73-b5a4-12bfcb6e1575'], mustNotMatchTags: ['cola', 'lemonade', 'iced_tea'] }
  },

  // ===== GROUPE F : Repas complet =====
  {
    name: 'Panier complet (entrée+main+drink+dessert) -> 0 suggestion',
    cart: [item('salade_meslee'), item('bethusy'), item('chianti'), item('tiramisu')],
    context: {},
    expectations: { maxSuggestions: 0 }
  },
  {
    name: 'Entrée + Main + Drink (pas dessert) -> dessert uniquement',
    cart: [item('salade_meslee'), item('bethusy'), item('coca')],
    context: {},
    expectations: { minSuggestions: 1, maxSuggestions: 1, mustMatchTags: ['dessert'] }
  },

  // ===== GROUPE G : Social =====
  {
    name: 'Grillade mixte (serves 2) -> suggestion shareable',
    cart: [item('grillade_mixte')],
    context: {},
    expectations: { mustMatchTags: ['shareable', 'anatolian'] }
  },
  {
    name: '3 pizzas différentes -> groupe, suggestion shareable/dessert',
    cart: [item('bethusy'), item('carbonara'), item('arrabbiata')],
    context: {},
    expectations: { maxSuggestions: 2, mustMatchTags: ['shareable', 'family_size', 'dessert'] }
  },

  // ===== GROUPE H : Contexte temporel =====
  {
    name: '23h (late_night) + cheeseburger -> late_night suggestions OK',
    cart: [item('cheeseburger')],
    context: { timeOfDay: 'late_night', hour: 23 },
    expectations: { maxSuggestions: 2 }
  },
  {
    name: 'Midi semaine + arrabbiata -> pas alcool',
    cart: [item('arrabbiata')],
    context: { timeOfDay: 'lunch', hour: 12, isWeekend: false, dayOfWeek: 3 },
    expectations: { mustNotMatchTags: ['wine', 'red_wine', 'white_wine', 'beer'] }
  },
  {
    name: 'Été + main seul -> glacé/rafraîchissant favorisé',
    cart: [item('bethusy')],
    context: { season: 'summer', timeOfDay: 'dinner' },
    expectations: { maxSuggestions: 2 }
  },

  // ===== GROUPE I : Client connu =====
  {
    name: 'VIP Gold + salade -> plat signature boosté',
    cart: [item('salade_meslee')],
    context: { vipTier: 'gold', customerName: 'Augustin' },
    expectations: { minSuggestions: 1, mustMatchTags: ['signature', 'main', 'house_pride', 'classic_italian'] }
  },
  {
    name: 'Anniversaire semaine -> dessert suggéré',
    cart: [item('bethusy')],
    context: { isBirthdayWeek: true, customerName: 'Augustin' },
    expectations: { minSuggestions: 1, mustMatchTags: ['dessert'] }
  },
  {
    name: 'Client a commandé 3x Chianti -> Chianti boosté',
    cart: [item('bethusy')],
    context: { customerLastOrderedIds: ['a970e962-5f81-4b53-84b3-37adc5de08e8', 'a970e962-5f81-4b53-84b3-37adc5de08e8', 'a970e962-5f81-4b53-84b3-37adc5de08e8'] },
    expectations: { mustMatchTags: ['italian_wine', 'italian_classic'] }
  },

  // ===== GROUPE J : Dismissal learning =====
  {
    name: 'Catégorie drink_alcohol blacklistée -> pas vin',
    cart: [item('bethusy')],
    context: { blacklistedCategories: ['drink_alcohol', 'wine'] },
    expectations: { mustNotMatchTags: ['wine', 'red_wine', 'white_wine', 'beer'] }
  },
  {
    name: 'Desserts blacklistés -> jamais dessert',
    cart: [item('bethusy'), item('coca')],
    context: { blacklistedCategories: ['dessert'] },
    expectations: { mustNotMatchTags: ['dessert'] }
  },

  // ===== GROUPE K : Diététique =====
  {
    name: 'Panier 100% végétarien -> pas viande',
    cart: [item('arrabbiata'), item('salade_meslee')],
    context: {},
    expectations: { maxSuggestions: 2 }
  },
  {
    name: 'Tajine (anatolien/halal-like) -> pas de pork',
    cart: [item('tajine')],
    context: {},
    expectations: { mustNotMatchTags: ['contains_pork'] }
  },

  // ===== GROUPE L : Cohérence culturelle =====
  {
    name: 'Kavurma anatolien -> JAMAIS Chianti',
    cart: [item('kavurma')],
    context: {},
    expectations: { mustExclude: ['a970e962-5f81-4b53-84b3-37adc5de08e8'] }
  },
  {
    name: 'Carbonara italien -> pas Yakut',
    cart: [item('carbonara')],
    context: {},
    expectations: { mustNotMatchTags: ['turkish_wine'] }
  },

  // ===== GROUPE M : Cas limites =====
  {
    name: 'Panier vide -> 0 suggestion',
    cart: [],
    context: {},
    expectations: { maxSuggestions: 0 }
  },
  {
    name: 'Boisson seule -> suggérer main/starter',
    cart: [item('coca')],
    context: {},
    expectations: { minSuggestions: 1, mustMatchTags: ['main', 'starter', 'classic', 'signature'] }
  },
  {
    name: 'Salade seule (too light) -> suggérer main',
    cart: [item('salade_meslee')],
    context: {},
    expectations: { minSuggestions: 1, mustMatchTags: ['main', 'classic', 'signature', 'classic_italian'] }
  },

  // ===== GROUPE N : Plafond 2 =====
  {
    name: 'Panier 1 plat riche -> max 2 suggestions',
    cart: [item('carbonara')],
    context: {},
    expectations: { maxSuggestions: 2 }
  },
  {
    name: 'Énorme panier 5 plats -> max 1 suggestion',
    cart: [item('bethusy', 2), item('carbonara'), item('arrabbiata'), item('tiramisu'), item('chianti')],
    context: {},
    expectations: { maxSuggestions: 1 }
  },

  // ===== GROUPE O : Gemini fallback =====
  {
    name: 'Fallback (no Gemini) -> toujours retourner max 2',
    cart: [item('bethusy')],
    context: {},
    expectations: { maxSuggestions: 2 }
  },

  // ===== GROUPE P V3 : REGRESSION BUGS =====
  {
    name: 'BUG #1 V3 — Grillade mixte seule -> JAMAIS Chianti (regression cohérence anatolienne)',
    cart: [item('grillade_mixte')],
    context: {},
    expectations: { mustExclude: ['a970e962-5f81-4b53-84b3-37adc5de08e8'] }
  },
  {
    name: 'BUG #1 V3 — Kavurma seule -> JAMAIS Chianti',
    cart: [item('kavurma')],
    context: {},
    expectations: { mustExclude: ['a970e962-5f81-4b53-84b3-37adc5de08e8'] }
  },
  {
    name: 'BUG #2 V3 — Panier complet (entrée+main+drink+dessert) -> 0 suggestion strictement',
    cart: [
      item('salade_meslee'), // starter
      item('bethusy'),       // main
      item('chianti'),       // drink
      item('tiramisu'),      // dessert
    ],
    context: {},
    expectations: { maxSuggestions: 0 }
  },
  {
    name: 'BUG #2 V3 — Panier 6 items mixte -> max 1 suggestion',
    cart: [
      item('bethusy'),
      item('chianti'),
      item('coca'),
      item('carbonara'),
      item('fusetea_peche'),
      item('baklava'),
    ],
    context: {},
    expectations: { maxSuggestions: 1 }
  },
  {
    name: 'BUG #3 V3 — 2 boissons soft -> JAMAIS 3e boisson (soft ou alcool)',
    cart: [
      item('coca'),
      item('fusetea_peche'),
      item('bethusy'),
    ],
    context: {},
    // Pas de tag drink_soft / drink_alcohol dans suggestions (les desserts
    // peuvent avoir contains_alcohol=true comme le tiramisu, c'est OK)
    expectations: { mustNotMatchTags: ['drink_soft', 'drink_alcohol'] }
  },
  {
    name: 'BUG #3 V3 — 1 soft + 1 vin -> JAMAIS autre boisson',
    cart: [
      item('coca'),
      item('chianti'),
      item('bethusy'),
    ],
    context: {},
    expectations: { mustNotMatchTags: ['drink_soft', 'drink_alcohol'] }
  },
  {
    name: 'BUG #4 V3 — 2 mains -> JAMAIS 3e main',
    cart: [
      item('bethusy'),
      item('carbonara'),
    ],
    context: {},
    expectations: { mustNotMatchTags: ['main'] }
  },
  {
    name: 'BUG #4 V3 — 2 combos -> JAMAIS 3e main ou combo',
    cart: [
      item('combo_bolo'),
      item('combo_bolo'),
    ],
    context: {},
    expectations: { mustNotMatchTags: ['main', 'combo'] }
  },
  {
    name: 'V3 — 8 items -> 0 suggestion (panier ULTRA gros)',
    cart: [
      item('bethusy'),
      item('carbonara'),
      item('arrabbiata'),
      item('coca'),
      item('chianti'),
      item('salade_meslee'),
      item('tiramisu'),
      item('frites'),
    ],
    context: {},
    expectations: { maxSuggestions: 0 }
  }
];
