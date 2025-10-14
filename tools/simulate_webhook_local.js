#!/usr/bin/env node
// Simulate a Stripe `checkout.session.completed` event locally without Stripe.
// Useful when you can't/ don't want to run stripe listen. This will call the processing logic
// in netlify/functions/webhook-core.js and emulate the shape of the event object.

const { processStripeEvent } = require('../netlify/functions/webhook-core');

async function run() {
  const fakeSession = {
    id: 'cs_test_simulated_' + Math.random().toString(36).slice(2,8),
    amount_total: 2000,
    payment_status: 'paid',
    customer_details: { email: 'simulated@example.com' },
    metadata: { game_id: '1', user_email: 'simulated@example.com' }
  };

  const fakeEvent = {
    id: 'evt_sim_' + Math.random().toString(36).slice(2,8),
    object: 'event',
    type: 'checkout.session.completed',
    data: { object: fakeSession }
  };

  console.log('Simulating event:', JSON.stringify(fakeEvent, null, 2));
  const res = await processStripeEvent(fakeEvent);
  console.log('Result:', res);
}

run().catch(err => {
  console.error('Simulation failed', err);
  process.exit(1);
});
