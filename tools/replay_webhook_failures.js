// Replay webhook failures stored in Supabase
// Usage: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env, then run:
// node tools/replay_webhook_failures.js

const { createClient } = require('@supabase/supabase-js');
const { processStripeEvent } = require('../netlify/functions/webhook-core');

async function main(){
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url || !key){
    console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
    process.exit(1);
  }
  const supabase = createClient(url, key);

  // fetch failures that have attempts < 5
  const { data, error } = await supabase.from('webhook_failures').select('*').lt('attempts', 5).order('created_at', { ascending: true }).limit(50);
  if(error){ console.error('Error fetching failures', error); process.exit(1); }

  for(const f of data){
    console.log('Replaying', f.id, f.event_id, f.event_type);
    try{
      const eventObj = f.payload && typeof f.payload === 'string' ? JSON.parse(f.payload) : f.payload;
      const res = await processStripeEvent(eventObj);
      if(res && res.success){
        console.log('Replay success for', f.id);
        await supabase.from('webhook_failures').update({ attempts: f.attempts + 1, last_attempt_at: new Date().toISOString() }).eq('id', f.id);
        // Optionally delete succeeded entries
        await supabase.from('webhook_failures').delete().eq('id', f.id);
      } else {
        console.warn('Replay failed for', f.id, res && res.error);
        await supabase.from('webhook_failures').update({ attempts: f.attempts + 1, last_attempt_at: new Date().toISOString() }).eq('id', f.id);
      }
    }catch(e){
      console.error('Error replaying', f.id, e);
      await supabase.from('webhook_failures').update({ attempts: f.attempts + 1, last_attempt_at: new Date().toISOString() }).eq('id', f.id);
    }
  }
}

main().catch(e=>{ console.error(e); process.exit(1); });
