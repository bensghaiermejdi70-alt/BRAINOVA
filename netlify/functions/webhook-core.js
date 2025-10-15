const { createClient } = require('@supabase/supabase-js');

// Initialize supabase client if env provided
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function writeFailure(eventObj, err) {
  try {
    if (!supabase) return;
    const payload = typeof eventObj === 'string' ? eventObj : JSON.stringify(eventObj);
    const failure = {
      event_id: (eventObj && eventObj.id) || null,
      event_type: (eventObj && eventObj.type) || null,
      payload: payload,
      error: (err && err.message) ? err.message : String(err),
      attempts: 1,
      created_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('webhook_failures').insert([failure]);
    if (error) {
      console.error('Failed to write webhook failure record', error);
    } else {
      console.log('Webhook failure recorded', data && data[0] && data[0].id);
    }
  } catch (e) {
    console.error('Error writing webhook failure', e);
  }
}

async function processStripeEvent(eventObj) {
  try {
    const eventId = eventObj && eventObj.id;
    if (eventObj.type === 'checkout.session.completed') {
      const session = eventObj.data.object;
      console.log('[webhook] checkout.session.completed', { eventId, sessionId: session.id });

      // Prepare metadata and row object
      const metaRaw = session.metadata || {};
      let meta = metaRaw;
      try { if (typeof metaRaw === 'string') meta = JSON.parse(metaRaw); } catch (e) { meta = metaRaw; }

      const row = {
        session_id: session.id,
        customer_email: (session.customer_details && session.customer_details.email) || meta.user_email || null,
        metadata: meta,
        game_id: meta.game_id || null,
        amount_total: session.amount_total || null,
        payment_status: session.payment_status || null,
        created_at: new Date().toISOString()
      };

      if (supabase) {
        try {
          // Persist purchase row in table `purchases` - ensure session_id has UNIQUE constraint
          // Use upsert on session_id to avoid duplicates
          const { data, error } = await supabase.from('purchases').upsert([row], { onConflict: ['session_id'] });
          if (error) {
            console.error('[webhook] Supabase upsert error', { eventId, sessionId: session.id, error });
            // write failure for later replay
            await writeFailure(eventObj, error);
            return { success: false, error };
          } else {
            console.log('[webhook] Purchase upserted to supabase', { eventId, sessionId: session.id });
            return { success: true, data };
          }
        } catch (err) {
          console.error('[webhook] Unexpected error during upsert', { eventId, sessionId: session.id, err });
          await writeFailure(eventObj, err);
          return { success: false, error: err };
        }
      } else {
        console.log('[webhook] Supabase not configured; skipping persistence');
        return { success: true, message: 'no-supabase' };
      }
    } else {
      console.log('[webhook] Unhandled stripe event', { eventId, type: eventObj.type });
      return { success: false, message: 'unhandled', type: eventObj.type };
    }
  } catch (err) {
    console.error('[webhook] Error handling webhook', err);
    try { await writeFailure(eventObj, err); } catch (e) { /* ignore */ }
    return { success: false, error: err };
  }
}

module.exports = { processStripeEvent };
