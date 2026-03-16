-- À exécuter dans le SQL Editor de Supabase si ce n'est pas encore fait.
-- Ces policies permettent aux clients non-authentifiés d'accéder aux pages publiques
-- (/join/[card_id], /card/[customer_card_id]).

-- 1. Lecture publique des cartes actives (nécessaire pour /join/[card_id])
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'loyalty_cards'
      AND policyname = 'Lecture publique carte active'
  ) THEN
    CREATE POLICY "Lecture publique carte active"
      ON public.loyalty_cards
      FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

-- 2. Lecture publique des commerces (nom, logo, couleurs)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'businesses'
      AND policyname = 'Businesses: lecture publique'
  ) THEN
    CREATE POLICY "Businesses: lecture publique"
      ON public.businesses
      FOR SELECT
      USING (true);
  END IF;
END $$;
