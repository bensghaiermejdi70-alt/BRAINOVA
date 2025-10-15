# Test Stripe + Netlify Dev

## Étapes à suivre

### 1. Lancer Netlify Dev (Terminal 1)
```powershell
netlify dev
```

### 2. Simuler un paiement Stripe (Terminal 2)
Exécutez le script de test que nous avons ajouté :

```powershell
.\test_stripe.ps1
```

Ce script :
- Définit la variable d'environnement `STRIPE_WEBHOOK_SECRET` pour la session actuelle PowerShell.
- Déclenche un événement test `checkout.session.completed` via la Stripe CLI.

### 3. Ce qu'il faut observer
- Dans le Terminal 1 (Netlify Dev) : vous devriez voir la fonction `/api/webhook` recevoir l'événement et afficher des logs détaillés (event id, session id, résultat de l'upsert vers Supabase).
- Dans Supabase : vérifiez la table `purchases` pour la présence de la `session_id` ; si l'upsert a échoué, regardez `webhook_failures`.

### 4. Commandes utiles
- Lancer Netlify Dev :
```powershell
netlify dev
```
- Écouter les webhooks via Stripe CLI (alternative si nécessaire) :
```powershell
stripe listen --forward-to "http://localhost:8888/.netlify/functions/webhook"
```
- Envoyer un événement test via Stripe CLI manuellement :
```powershell
stripe trigger checkout.session.completed
```

### 5. Sécurité
- Ne commitez jamais les secrets (remplacez le `STRIPE_WEBHOOK_SECRET` de test si c'est un secret réel).

### 6. Si l'upsert échoue
- Regardez les logs Netlify Dev pour l'erreur.
- Inspectez la table `webhook_failures` et utilisez `tools/replay_webhook_failures.js` pour rejouer les événements en échec.

