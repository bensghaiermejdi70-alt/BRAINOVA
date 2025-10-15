-- Migration: ensure purchases.session_id is unique to allow safe upserts
ALTER TABLE purchases
  ADD CONSTRAINT purchases_session_id_unique UNIQUE (session_id);

-- If your DB already has duplicates, run a dedupe script first or use a safer migration strategy.
