-- Migration: create webhook_failures table for dead-lettering failed webhook events
CREATE TABLE IF NOT EXISTS webhook_failures (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id text,
  session_id text,
  raw_event jsonb,
  error text,
  attempts integer DEFAULT 0,
  last_attempt timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Index on session_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_webhook_failures_session_id ON webhook_failures(session_id);
