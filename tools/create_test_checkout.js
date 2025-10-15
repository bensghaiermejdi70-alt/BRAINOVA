#!/usr/bin/env node
const Stripe = require('stripe');

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error('Error: set STRIPE_SECRET_KEY environment variable (use your test key for testing).');
  process.exit(1);
}

const stripe = new Stripe(stripeKey, { apiVersion: '2022-11-15' });

const argv = process.argv.slice(2);
function getArg(name, def) {
  const idx = argv.indexOf(`--${name}`);
  if (idx >= 0 && argv.length > idx + 1) return argv[idx + 1];
  return def;
}

const amount = parseInt(getArg('amount', '2000'), 10); // cents
const currency = getArg('currency', 'eur');
const productName = getArg('name', 'Brainova Premium');
const priceId = getArg('price', null); // optional price id
const metadataArg = getArg('metadata', '{}');
let metadata = {};
try { metadata = JSON.parse(metadataArg); } catch (e) { console.warn('Invalid metadata JSON, using empty object'); }
const successUrl = getArg('success_url', 'http://localhost:8888/checkout-success.html');
const cancelUrl = getArg('cancel_url', 'http://localhost:8888/checkout-success.html?checkout=cancel');

(async function createSession() {
  try {
    const sessionPayload = {
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl,
      metadata: metadata
    };

    if (priceId) {
      sessionPayload.line_items[0].price = priceId;
    } else {
      sessionPayload.line_items[0].price_data = {
        currency: currency,
        product_data: { name: productName },
        unit_amount: amount
      };
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);

    console.log('Checkout Session created successfully.');
    console.log('Session ID:', session.id);
    console.log('Open this URL in a browser to pay (test):');
    console.log(session.url || session.session_url || 'NO_URL_RETURNED');
  } catch (err) {
    console.error('Failed to create session:', err && (err.message || err));
    process.exit(2);
  }
})();
