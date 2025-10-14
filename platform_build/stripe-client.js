// Minimal client helper to create a server-side Checkout Session and redirect the user
export async function startCheckout(items, metadata, opts = {}){
  try{
    // Build a success_url that Stripe will replace {CHECKOUT_SESSION_ID} in.
  const defaultSuccess = './brainova.html?bundle_purchased=1&session_id={CHECKOUT_SESSION_ID}';
  const defaultCancel = './brainova.html?checkout=cancel';
    const success_url = opts.success_url || defaultSuccess;
    const cancel_url = opts.cancel_url || defaultCancel;

    // Netlify Functions are exposed under /.netlify/functions/<name> in dev and production
    const body = { items, success_url, cancel_url };
    if(metadata) body.metadata = metadata;
    const resp = await fetch('/.netlify/functions/create-checkout-session', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    if(!resp.ok) throw new Error('Network error');
    const data = await resp.json();

    // Persist session id so we can verify purchase on redirect
    if(data && data.id) localStorage.setItem('last_stripe_session', data.id);

    // Prefer opening the hosted session URL in a new tab when provided
    if(data && data.url){ window.open(data.url, '_blank'); return; }

    // Fallback: if only id is present, redirect to the success URL with session id
    if(data && data.id){
      const redirectTo = success_url.replace('{CHECKOUT_SESSION_ID}', encodeURIComponent(data.id));
      window.location.href = redirectTo;
      return;
    }
  }catch(e){ console.error('startCheckout error', e); try{ window.parent && window.parent.postMessage && window.parent.postMessage({ action: 'dialog', dialogType: 'alert', text: 'Erreur lors de la création du paiement' }, '*'); }catch(_){ } }
}
