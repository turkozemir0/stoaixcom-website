-- Multi-interval billing: add quarterly and semi-annual price columns
-- billing_interval column is already text type with no CHECK constraint,
-- so 'quarterly' and 'semi_annual' values are accepted automatically.

ALTER TABLE plans ADD COLUMN IF NOT EXISTS price_quarterly numeric(10,2);
ALTER TABLE plans ADD COLUMN IF NOT EXISTS price_semi_annual numeric(10,2);
ALTER TABLE plans ADD COLUMN IF NOT EXISTS stripe_price_quarterly text;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS stripe_price_semi_annual text;

-- Sync prices with website (totals, not per-month)
UPDATE plans SET price_monthly = 199, price_annual = 1668, price_quarterly = 537, price_semi_annual = 954 WHERE id = 'essential';
UPDATE plans SET price_monthly = 299, price_annual = 2508, price_quarterly = 807, price_semi_annual = 1434 WHERE id = 'professional';
UPDATE plans SET price_monthly = 599, price_annual = 5028, price_quarterly = 1617, price_semi_annual = 2874 WHERE id = 'business';
