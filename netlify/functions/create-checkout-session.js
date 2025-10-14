const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const body = JSON.parse(event.body || '{}');
    const items = Array.isArray(body.items) ? body.items : [{ name: 'Pass Premium', amount: 499, quantity: 1 }];
    const metadata = body.metadata || {};
  // Default to a minimal checkout success page to keep redirect payload small
  const siteOrigin = process.env.SITE_ORIGIN || '';
  const success_url = body.success_url || process.env.SUCCESS_URL || (siteOrigin + '/checkout-success.html?session_id={CHECKOUT_SESSION_ID}');
  const cancel_url = body.cancel_url || process.env.CANCEL_URL || (siteOrigin + '/checkout-success.html?checkout=cancel');

    const line_items = items.map(i => ({
      price_data: {
        currency: 'eur',
        product_data: { name: i.name },
        unit_amount: i.amount
      },
      quantity: i.quantity || 1
    }));

    // Build session params and include customer_email if present in metadata
    const sessionParams = {
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url,
      cancel_url,
      metadata
    };
    if (metadata && metadata.user_email) sessionParams.customer_email = metadata.user_email;

    // Support optional idempotency key to prevent duplicate sessions
    const idempotencyKey = body.idempotency_key || null;
    const createOpts = idempotencyKey ? { idempotencyKey } : {};

    const session = await stripe.checkout.sessions.create(sessionParams, createOpts);

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id, url: session.url })
    };
  } catch (err) {
    console.error('create-checkout error', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
