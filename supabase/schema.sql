-- Table businesses liée aux utilisateurs Supabase Auth
create table if not exists public.businesses (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  business_name text not null,
  country     text not null check (country in ('FR', 'CH')),
  created_at  timestamptz not null default now()
);

-- RLS : chaque commerce ne voit que ses propres données
alter table public.businesses enable row level security;

create policy "Businesses: lecture par le propriétaire"
  on public.businesses
  for select
  using (auth.uid() = id);

create policy "Businesses: insertion par le propriétaire"
  on public.businesses
  for insert
  with check (auth.uid() = id);

create policy "Businesses: mise à jour par le propriétaire"
  on public.businesses
  for update
  using (auth.uid() = id);

-- Table loyalty_cards
CREATE TABLE public.loyalty_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  card_name TEXT NOT NULL,
  card_type TEXT NOT NULL CHECK (card_type IN ('stamp', 'points')),
  stamps_required INT,
  points_per_purchase INT,
  reward_threshold INT,
  reward_description TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#4F46E5',
  text_color TEXT DEFAULT '#FFFFFF',
  qr_code_value TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE public.loyalty_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture par le propriétaire" ON public.loyalty_cards
  FOR SELECT USING (business_id = auth.uid());

CREATE POLICY "Insertion par le propriétaire" ON public.loyalty_cards
  FOR INSERT WITH CHECK (business_id = auth.uid());

CREATE POLICY "Mise à jour par le propriétaire" ON public.loyalty_cards
  FOR UPDATE USING (business_id = auth.uid());

-- Lecture publique des cartes actives (pour la page /join)
CREATE POLICY "Lecture publique carte active" ON public.loyalty_cards
  FOR SELECT USING (is_active = true);

-- Lecture publique des commerces (nom, logo, couleurs pour /join et /card)
CREATE POLICY "Businesses: lecture publique" ON public.businesses
  FOR SELECT USING (true);

-- Table customers
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(email)
);

-- Table customer_cards
CREATE TABLE public.customer_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  card_id UUID REFERENCES public.loyalty_cards(id) ON DELETE CASCADE,
  current_stamps INT DEFAULT 0,
  current_points INT DEFAULT 0,
  rewards_claimed INT DEFAULT 0,
  qr_code_value TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(customer_id, card_id)
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accès public insertion customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public lecture customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Accès public insertion customer_cards" ON public.customer_cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Accès public lecture customer_cards" ON public.customer_cards FOR SELECT USING (true);
CREATE POLICY "Accès public update customer_cards" ON public.customer_cards FOR UPDATE USING (true);

-- Table transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_card_id UUID REFERENCES public.customer_cards(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('stamp_added', 'points_added', 'reward_claimed')),
  value INT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insertion transactions" ON public.transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Lecture transactions" ON public.transactions FOR SELECT USING (true);
