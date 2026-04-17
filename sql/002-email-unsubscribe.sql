-- Add unsubscribe support for recovery email sequence
-- Run in Supabase SQL Editor

ALTER TABLE signup_leads
ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ DEFAULT NULL;
