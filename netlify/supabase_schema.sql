-- Supabase schema for purchases table
-- Run this in Supabase SQL editor (Projects > Database > SQL Editor)

CREATE TABLE IF NOT EXISTS purchases (
  session_id text PRIMARY KEY,
  customer_email text,
  game_id text,
  amount_total integer,
  payment_status text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Index on customer_email + game_id for fast checks
CREATE INDEX IF NOT EXISTS purchases_customer_game_idx ON purchases (customer_email, game_id);
