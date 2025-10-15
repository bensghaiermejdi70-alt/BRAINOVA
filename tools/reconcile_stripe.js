/*
Simple reconciliation script:
- Lists recent checkout sessions from Stripe (test or live key)
- For each, checks Supabase purchases for session_id
- Prints missing sessions so you can reprocess or replay

Usage:
  node tools/reconcile_stripe.js
Env:
  STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
*/

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Set STRIPE_SECRET_KEY'); process.exit(1);
}
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'); process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main(){
  console.log('Listing recent checkout sessions from Stripe...');
  const sessions = await stripe.checkout.sessions.list({limit: 100});
  const missing = [];
  for (const s of sessions.data){
    const sid = s.id;
    const { data, error } = await supabase.from('purchases').select('session_id').eq('session_id', sid).limit(1);
    if (error){
      console.error('Supabase error checking session', sid, error);
      continue;
    }
    if (!data || data.length === 0){
      missing.push({ id: sid, url: s.url, customer_email: s.customer_details && s.customer_details.email });
    }
  }
  console.log('Missing sessions count:', missing.length);
  if (missing.length>0) console.table(missing);
}

main().catch(e=>{ console.error(e); process.exit(2); });
