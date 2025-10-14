# Deployment & Test Guide (FR)

Ce guide rassemble toutes les étapes pour tester localement, simuler webhooks, créer des sessions Stripe Checkout (test), et préparer le passage en production (live) pour le projet Brainova.

IMPORTANT : ne publiez jamais vos clés secrètes dans le dépôt. Utilisez des variables d'environnement.

---

## Rappels - fichiers utilitaires inclus
- `netlify/functions/webhook.js` - fonction Netlify qui vérifie la signature et appelle `webhook-core.js`.
- `netlify/functions/webhook-core.js` - logique de traitement (upsert Supabase).
- `tools/create_test_checkout.js` - script Node pour créer une session Stripe Checkout test.
- `tools/simulate_webhook_local.js` - script Node pour simuler localement un événement `checkout.session.completed` sans Stripe.
- `tools/StripeWebhookController.cs` - exemple de controller ASP.NET Core prêt à coller dans un projet.

---

## 1) Tester localement sans Stripe (simulation rapide)
1. Installer dépendances (si nécessaire):
```powershell
npm install @supabase/supabase-js
```
2. (Optionnel) Configurer Supabase en local via variables d'environnement :
```powershell
$env:SUPABASE_URL = "https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "eyJhbGci..."
```
3. Lancer la simulation :
```powershell
node .\tools\simulate_webhook_local.js
```
- Résultat attendu : affichage de l'événement simulé et du résultat. Si Supabase est configuré, la ligne doit apparaître dans la table `purchases`.

---

## 2) Tester avec Stripe (checkout test + webhook)
### Préparation
- Assurez-vous d'avoir :
  - Stripe CLI installé (ou de déployer en prod si vous ne pouvez pas installer). 
  - `STRIPE_SECRET_KEY` (sk_test_...) disponible localement.

### A. Lancer Stripe listen (obtenir whsec_...)
```powershell
stripe login
stripe listen --forward-to "http://localhost:8888/.netlify/functions/webhook"
```
- Copiez le `whsec_...` affiché par stripe listen.

### B. Lancer Netlify Dev
```powershell
netlify dev
```
- Vérifiez que votre function est accessible: `http://localhost:8888/.netlify/functions/webhook`

### C. Définir vars d'environnement (même shell ou .env)
```powershell
$env:STRIPE_WEBHOOK_SECRET = "whsec_..."
$env:STRIPE_SECRET_KEY = "sk_test_..."
$env:SUPABASE_URL = "https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "eyJhbGci..."
```
Redémarrez `netlify dev` si nécessaire.

### D. Créer une session Checkout test
```powershell
npm install stripe
node .\tools\create_test_checkout.js --amount 2000 --currency eur --name "Brainova Premium" --metadata "{\"game_id\":\"1\",\"user_email\":\"test@example.com\"}" --success_url "http://localhost:3000/success" --cancel_url "http://localhost:3000/cancel"
```
- Ouvrez l'URL retournée et payez avec la carte de test `4242 4242 4242 4242`.

### E. Vérifier
- Stripe CLI : doit afficher la livraison de l'événement.
- Netlify Dev : doit logguer `checkout.session.completed` et le résultat de l'upsert.
- Supabase : la table `purchases` doit contenir la nouvelle ligne.

---

## 3) Passer en production (live)
1. Préparer les clés Live (Dashboard Stripe) : `sk_live_...`, `pk_live_...`.
2. Déployer la function sur Netlify et configurer l'endpoint dans Stripe Dashboard: `https://<votre-site>/.netlify/functions/webhook`.
3. Récupérer le webhook signing secret (whsec_live_...) depuis Stripe et le configurer dans les vars Netlify: `STRIPE_WEBHOOK_SECRET`.
4. Définir `STRIPE_SECRET_KEY=sk_live_...`, `SUPABASE_URL` (prod) et `SUPABASE_SERVICE_ROLE_KEY` (prod) dans les variables d'environnement du projet.
5. Tester un paiement réel contrôlé (petite somme) et vérifier les logs + la table `purchases`.

---

## 4) Checklist rapide avant lancement international
- [ ] Prix multi-devises créés (EUR, USD, GBP...).
- [ ] Taxes / TVA configurées (Stripe Tax ou gestion propre).
- [ ] Méthodes locales activées (iDEAL, SEPA, Alipay selon marché).
- [ ] Politique de confidentialité & conditions légales localisées.
- [ ] Monitoring & alertes configurés (Sentry/Datadog + logs fonction).
- [ ] Sauvegardes et stratégie d'incident.
- [ ] Clés secrètes vérifiées et non commit.

---

## 5) Support
Si vous avez des erreurs lors d'un des tests : copiez-collez ici les logs (stripe listen delivery + netlify dev function logs) et je vous aiderai à diagnostiquer.

Bonne continuation — si vous voulez, je peux aussi automatiser la création des prix multi-devises via un script Node/C#.
