-- Add phone column to signup_leads (organizations.phone already exists)
ALTER TABLE signup_leads ADD COLUMN IF NOT EXISTS phone TEXT;
