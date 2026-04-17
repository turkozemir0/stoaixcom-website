-- Hybrid Signup Flow: add user_id to signup_leads + recovery email log
-- Run in Supabase SQL Editor

ALTER TABLE signup_leads ADD COLUMN IF NOT EXISTS user_id UUID;
CREATE INDEX IF NOT EXISTS idx_signup_leads_user_id ON signup_leads(user_id);

CREATE TABLE IF NOT EXISTS recovery_emails_log (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email    TEXT NOT NULL,
  template TEXT NOT NULL,  -- '15min', '1hr', '24hr', '3day', '7day', '10day', '15day'
  sent_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_recovery_log_email ON recovery_emails_log(email);
