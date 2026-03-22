-- Migration: ajout activation manuelle (remplacement Stripe)
-- Ajoute les colonnes status, activation_code, phone, plan, subscription_status

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS plan TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('pending', 'active', 'suspended')),
  ADD COLUMN IF NOT EXISTS activation_code TEXT;

-- Les commerçants existants restent actifs (DEFAULT 'active')
-- Les nouveaux commerçants seront insérés avec status='pending' explicitement
