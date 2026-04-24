import { describe, it, expect, vi } from 'vitest';
import { SCENARIOS, DEFAULT_CTX, FIXTURE_ITEMS } from './fixtures';
import type { MenuItemFull } from '../types';

// Mock le fetcher du menu (étage 4) : retourne tous les FIXTURE_ITEMS complétés
vi.mock('../supabaseMenu', () => ({
  fetchFullMenu: async (): Promise<MenuItemFull[]> => {
    return Object.values(FIXTURE_ITEMS).map((p) => ({
      id: '', name: '', price: 0, is_available: true, is_out_of_stock: false, category_id: '',
      heat_level: 0, richness_level: 2, saltiness_level: 2, sweetness_level: 1, acidity_level: 2,
      caloric_density: 3, fat_level: 3, dish_role: 'main' as const, cuisine_style: 'italian' as const,
      main_ingredient: 'vegetable', is_vegetarian: true, contains_pork: false, contains_alcohol: false,
      serves_pax: 1, is_shareable: false, ideal_time_of_day: ['lunch', 'dinner'],
      upsell_tags: [], pairs_well_with_ids: [], avoid_with_ids: [], semantic_tags: [],
      ...p
    } as MenuItemFull));
  }
}));

// Mock Gemini : retourne déterministe les 2 premiers candidats avec message basique.
vi.mock('../geminiCall', () => ({
  callGeminiForMessages: async (candidates: { item: MenuItemFull }[]) => {
    return candidates.slice(0, 2).map((c) => ({
      menu_item_id: c.item.id,
      message: `Essaye ${c.item.name} avec ça !`
    }));
  }
}));

import { generateUpsell } from '../index';

describe('UPSELL — 30 scénarios TDD', () => {
  SCENARIOS.forEach((scenario) => {
    it(scenario.name, async () => {
      const ctx = { ...DEFAULT_CTX, ...scenario.context };
      const result = await generateUpsell(scenario.cart, ctx);
      const e = scenario.expectations;

      if (e.minSuggestions !== undefined) {
        expect(result.suggestions.length, `min ${e.minSuggestions}`).toBeGreaterThanOrEqual(e.minSuggestions);
      }
      if (e.maxSuggestions !== undefined) {
        expect(result.suggestions.length, `max ${e.maxSuggestions}`).toBeLessThanOrEqual(e.maxSuggestions);
      }

      const ids = result.suggestions.map((s) => s.menu_item_id);
      if (e.mustInclude) {
        for (const id of e.mustInclude) {
          expect(ids, `must include ${id}`).toContain(id);
        }
      }
      if (e.mustExclude) {
        for (const id of e.mustExclude) {
          expect(ids, `must exclude ${id}`).not.toContain(id);
        }
      }

      // Tags (union upsell_tags + semantic_tags + dish_role + flags) de toutes les suggestions
      const suggestionTags = new Set<string>();
      for (const s of result.suggestions) {
        const it = Object.values(FIXTURE_ITEMS).find((i) => i.id === s.menu_item_id);
        if (it?.upsell_tags) it.upsell_tags.forEach((t: string) => suggestionTags.add(t));
        if (it?.semantic_tags) it.semantic_tags.forEach((t: string) => suggestionTags.add(t));
        if (it?.dish_role) suggestionTags.add(it.dish_role);
        if (it?.contains_pork) suggestionTags.add('contains_pork');
        if (it?.is_shareable) suggestionTags.add('shareable');
        // Ajoute aussi les mots-clés dérivés comme 'alcoholic' pour simplifier les tests
        if (it?.contains_alcohol) suggestionTags.add('alcoholic');
      }

      if (e.mustMatchTags && e.mustMatchTags.length > 0 && result.suggestions.length > 0) {
        const hasMatch = e.mustMatchTags.some((t) => suggestionTags.has(t));
        expect(hasMatch, `must match one of [${e.mustMatchTags.join(', ')}] — got: [${Array.from(suggestionTags).join(', ')}]`).toBe(true);
      }

      if (e.mustNotMatchTags) {
        for (const t of e.mustNotMatchTags) {
          expect(suggestionTags.has(t), `must NOT match ${t} — got: [${Array.from(suggestionTags).join(', ')}]`).toBe(false);
        }
      }
    });
  });
});
