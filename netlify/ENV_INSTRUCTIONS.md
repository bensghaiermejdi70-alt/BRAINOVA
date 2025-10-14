Variables d'environnement requises

Ajoutez ces variables d'environnement au site Netlify (Site settings > Build & deploy > Environment)

- STRIPE_SECRET_KEY: clé secrète Stripe (commence par sk_test_... ou sk_live_...)
- STRIPE_WEBHOOK_SECRET: secret du webhook Stripe (utilisé pour vérifier la signature des événements)
- SUPABASE_URL: l'URL de votre instance Supabase (ex: https://xxxx.supabase.co)
- SUPABASE_SERVICE_ROLE_KEY: clé service_role (utilisée côté serveur pour écrire dans la DB)
- SUPABASE_ANON_KEY: optionnel (pour accès public si nécessaire)

Notes de sécurité:
- Ne pas committer ces valeurs dans le dépôt.
- Utiliser la clé service_role uniquement côté serveur (functions). Jamais côté client.
