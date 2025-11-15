-- Add missing columns to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS stripe_price_id text,
ADD COLUMN IF NOT EXISTS stripe_product_id text,
ADD COLUMN IF NOT EXISTS plan_type text,
ADD COLUMN IF NOT EXISTS current_period_start timestamptz,
ADD COLUMN IF NOT EXISTS current_period_end timestamptz,
ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS trial_start timestamptz,
ADD COLUMN IF NOT EXISTS trial_end timestamptz;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id_status ON subscriptions(user_id, status);


