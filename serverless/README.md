Serverless / Stripe integration (Vercel)

Files created:
- serverless/vercel/api/create-checkout-session.js  -> creates a Stripe Checkout Session
- serverless/vercel/api/webhook.js                  -> handles Stripe webhook events

Environment variables required:
- STRIPE_SECRET_KEY  = sk_live_... (or sk_test_... during testing)
- STRIPE_WEBHOOK_SECRET = the webhook signing secret from your Stripe dashboard (for production)

How to test locally with Stripe CLI:
1) Install Stripe CLI: https://stripe.com/docs/stripe-cli
2) Start a local dev server (if using Vercel dev or a Node process)
3) Expose your local server to Stripe CLI webhooks:
   stripe listen --forward-to localhost:3000/api/webhook

Create a Checkout Session (example using curl):
```bash
curl -X POST http://localhost:3000/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"Pass Premium","amount":499,"quantity":1}]}'
```

Deployment notes (Vercel / Netlify):
- For Vercel: push this folder to a git repo, set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in Vercel, then deploy; endpoints will be available under /api/*.
- For Netlify: see `netlify/README.md` in this repo — Netlify Functions are placed under `netlify/functions` and are available under `/.netlify/functions/<name>` when deployed or using `netlify dev`.

Security notes:
- Do not expose your secret key client-side. Use serverless function to create sessions.
- Store purchase records in a database (Supabase, Fauna, DynamoDB, etc.) and return a secure token to the client if you need to gate access.

Optional: persisting purchases with Supabase
- Use Supabase to store sessions. Add code in webhook.js to insert a record when checkout.session.completed fires.

If you'd like, I can also:
- Add a small client example (fetch to /api/create-checkout-session then redirect to session.url)
- Add Supabase persistence example
- Add a small admin page to view purchases
