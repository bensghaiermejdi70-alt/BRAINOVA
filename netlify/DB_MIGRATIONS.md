DB migrations for webhook hardening

This file contains example SQL and instructions to harden the database used by the webhook.

1) Ensure the purchases table has a unique constraint on session_id

-- Add UNIQUE constraint to purchases.session_id (run in Supabase SQL editor)
ALTER TABLE public.purchases
  ADD CONSTRAINT purchases_session_id_key UNIQUE (session_id);

2) Create a table to store failed webhook events for replay

-- Create webhook_failures table
CREATE TABLE IF NOT EXISTS public.webhook_failures (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_id text,
  event_type text,
  payload jsonb,
  error text,
  attempts integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  last_attempt_at timestamptz
);

3) How to run
- In Supabase dashboard go to SQL Editor -> New query, paste the SQL and run.
- Alternatively use psql or supabase CLI to run the script.

4) Note on rolling back
- To remove the unique constraint: ALTER TABLE public.purchases DROP CONSTRAINT IF EXISTS purchases_session_id_key;
- To drop webhook_failures: DROP TABLE IF EXISTS public.webhook_failures;


Reconciliation tip
- Create a simple script to fetch recent `checkout.session` objects from Stripe and check they exist in `purchases`.
- Use the webhook_failures table to inspect and replay failed events.
