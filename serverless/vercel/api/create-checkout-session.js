import Stripe from 'stripe';

// Minimal Vercel serverless function to create a Stripe Checkout Session.
// Requires env var STRIPE_SECRET_KEY.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
  const { items = [], success_url, cancel_url, metadata = {} } = req.body || {};
  const siteOrigin = process.env.SITE_ORIGIN || '';

    // Build line_items from a simple shape: [{name, amount, quantity}]
    const line_items = (items.length ? items : [{ name: 'Pass Premium', amount: 499, quantity: 1 }]).map(i => ({
      price_data: {
        currency: 'eur',
        product_data: { name: i.name },
        unit_amount: i.amount // cents
      },
      quantity: i.quantity || 1
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
  success_url: success_url || (siteOrigin + '/checkout-success.html?session_id={CHECKOUT_SESSION_ID}'),
  cancel_url: cancel_url || (siteOrigin + '/checkout-success.html?checkout=cancel'),
      metadata
    });

    // session.url is the hosted Checkout page URL
    return res.status(200).json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('create-checkout-session error', err);
    return res.status(500).json({ error: err.message });
  }
}
