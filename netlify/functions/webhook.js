const Stripe = require('stripe');
const { processStripeEvent } = require('./webhook-core');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

exports.handler = async function(event, context) {
  // Netlify provides raw request body as event.body (string)
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  if (!sig) {
    console.warn('No stripe-signature header');
  }

  let eventObj;
  try {
    const buf = Buffer.from(event.body, 'utf8');
    eventObj = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed', err && err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  const result = await processStripeEvent(eventObj);
  if (result && result.success) {
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  }

  return { statusCode: 500, body: JSON.stringify({ error: 'processing_failed', details: result && result.error }) };
};
