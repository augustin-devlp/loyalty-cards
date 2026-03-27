-- Google OAuth tokens for Business Profile API
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS google_access_token  text;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS google_refresh_token text;
