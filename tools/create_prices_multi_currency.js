#!/usr/bin/env node
/*
Creates a product and price objects for multiple currencies using Stripe API.
Usage:
  STRIPE_SECRET_KEY=sk_test_... node create_prices_multi_currency.js --product-name "Brainova Premium" --amount-eur 2000

Outputs created prices to tools/created_prices.json
*/

const Stripe = require('stripe');
const fs = require('fs');

const argv = process.argv.slice(2);
function getArg(name, def) {
  const idx = argv.indexOf(`--${name}`);
  if (idx >= 0 && argv.length > idx + 1) return argv[idx + 1];
  return def;
}

const stripeKey = process.env.STRIPE_SECRET_KEY || getArg('key');
if (!stripeKey) {
  console.error('Set STRIPE_SECRET_KEY environment variable or pass --key');
  process.exit(1);
}
const stripe = new Stripe(stripeKey, { apiVersion: '2022-11-15' });

const productName = getArg('product-name', 'Brainova Premium');
const amountEur = parseInt(getArg('amount-eur', '2000'), 10); // cents

// Currencies and conversion multipliers (approx) - you may adjust per your pricing strategy
const currencyMap = {
  eur: { amount: amountEur },
  usd: { amount: Math.round(amountEur * 1.08) },
  gbp: { amount: Math.round(amountEur * 0.86) }
};

(async function() {
  try {
    const product = await stripe.products.create({ name: productName, description: 'Brainova multi-currency price' });
    console.log('Product created', product.id);

    const results = { product: { id: product.id, name: product.name }, prices: {} };

    for (const [currency, info] of Object.entries(currencyMap)) {
      const price = await stripe.prices.create({
        unit_amount: info.amount,
        currency: currency,
        product: product.id
      });
      console.log(`Price created: ${currency} -> ${price.id} (${info.amount})`);
      results.prices[currency] = { id: price.id, amount: info.amount };
    }

    fs.writeFileSync('tools/created_prices.json', JSON.stringify(results, null, 2));
    console.log('Wrote tools/created_prices.json');
  } catch (err) {
    console.error('Failed', err && err.message);
    process.exit(2);
  }
})();
