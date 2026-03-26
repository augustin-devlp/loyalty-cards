-- Add require_google_review column to spin_wheels and lotteries
-- MODE 1 (false): simple phone verification, Google review button shown AFTER participation (optional)
-- MODE 2 (true):  SMS verification + must tap "I left a review" before participating

ALTER TABLE spin_wheels
  ADD COLUMN IF NOT EXISTS require_google_review boolean NOT NULL DEFAULT false;

ALTER TABLE lotteries
  ADD COLUMN IF NOT EXISTS require_google_review boolean NOT NULL DEFAULT false;
