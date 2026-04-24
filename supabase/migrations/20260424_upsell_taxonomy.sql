-- Phase 12 Upsell Monstre — Étage 1 taxonomy
-- 20 dimensions sémantiques/sensorielles/sociales sur menu_items
-- + indexes + tables tracking

ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS heat_level INT DEFAULT 0 CHECK (heat_level BETWEEN 0 AND 5),
  ADD COLUMN IF NOT EXISTS richness_level INT DEFAULT 2 CHECK (richness_level BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS saltiness_level INT DEFAULT 2 CHECK (saltiness_level BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS sweetness_level INT DEFAULT 1 CHECK (sweetness_level BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS acidity_level INT DEFAULT 2 CHECK (acidity_level BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS caloric_density INT DEFAULT 2 CHECK (caloric_density BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS fat_level INT DEFAULT 2 CHECK (fat_level BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS dish_role TEXT CHECK (dish_role IN ('starter', 'main', 'side', 'dessert', 'drink_soft', 'drink_alcohol', 'combo')),
  ADD COLUMN IF NOT EXISTS cuisine_style TEXT CHECK (cuisine_style IN ('italian', 'anatolian', 'french', 'fusion', 'universal')),
  ADD COLUMN IF NOT EXISTS main_ingredient TEXT,
  ADD COLUMN IF NOT EXISTS contains_pork BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS contains_alcohol BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS serves_pax INT DEFAULT 1 CHECK (serves_pax BETWEEN 1 AND 6),
  ADD COLUMN IF NOT EXISTS is_shareable BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS ideal_time_of_day TEXT[] DEFAULT ARRAY['anytime']::TEXT[],
  ADD COLUMN IF NOT EXISTS upsell_tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pairs_well_with_ids UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS avoid_with_ids UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS semantic_tags TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_menu_items_dish_role ON menu_items(dish_role);
CREATE INDEX IF NOT EXISTS idx_menu_items_cuisine ON menu_items(cuisine_style);
CREATE INDEX IF NOT EXISTS idx_menu_items_upsell_tags ON menu_items USING GIN(upsell_tags);
CREATE INDEX IF NOT EXISTS idx_menu_items_pairs_well ON menu_items USING GIN(pairs_well_with_ids);

-- Tables tracking (étage 3)
CREATE TABLE IF NOT EXISTS upsell_dismissals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, category)
);
CREATE INDEX IF NOT EXISTS idx_upsell_dismissals_customer ON upsell_dismissals(customer_id);

CREATE TABLE IF NOT EXISTS upsell_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  session_id TEXT,
  cart_item_ids UUID[],
  suggested_item_id UUID REFERENCES menu_items(id),
  suggested_category TEXT,
  action TEXT CHECK (action IN ('shown', 'accepted', 'dismissed', 'ignored')),
  score NUMERIC,
  reasons TEXT[],
  context_snapshot JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_upsell_events_customer ON upsell_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_upsell_events_action ON upsell_events(action);

ALTER TABLE upsell_dismissals ENABLE ROW LEVEL SECURITY;
ALTER TABLE upsell_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_upsell_dismissals" ON upsell_dismissals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_upsell_events" ON upsell_events FOR ALL USING (true) WITH CHECK (true);
