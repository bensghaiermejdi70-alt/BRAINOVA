// Simulate a checkout.session.completed payload and call the webhook handler directly
(async ()=>{
  try{
    const handler = require('../netlify/functions/webhook.js');
    // Minimal simulated event object: event.body must be the raw JSON string
    const fakeSession = {
      id: 'cs_test_' + Date.now(),
      amount_total: 499,
      payment_status: 'paid',
      customer_details: { email: 'test@example.com' },
      metadata: { game_id: '1', user_email: 'test@example.com' }
    };
    const fakeEvent = {
      body: JSON.stringify({ type: 'checkout.session.completed', data: { object: fakeSession } }),
      headers: { 'stripe-signature': 'fake' }
    };
    // call handler
    const res = await handler.handler(fakeEvent, {});
    console.log('webhook simulate response:', res);
  }catch(e){ console.error(e); process.exit(1); }
})();
