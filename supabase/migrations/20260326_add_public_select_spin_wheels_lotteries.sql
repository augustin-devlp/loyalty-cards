-- Fix: allow anon/public to SELECT on spin_wheels and lotteries
-- Without these policies, the public pages /spin/[business_id] and /lottery/[lottery_id]
-- could not read the data and showed "not available" even when active.

CREATE POLICY "public_select_spin_wheels"
  ON spin_wheels
  FOR SELECT
  USING (true);

CREATE POLICY "public_select_lotteries"
  ON lotteries
  FOR SELECT
  USING (true);
