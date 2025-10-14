Bonne pratique — garder le payload de redirection minimal
-------------------------------------------------------

Pour minimiser la bande passante utilisée lors du retour depuis Stripe (et ainsi conserver le quota Netlify gratuit), utilisez une page de redirection minimaliste qui ne charge aucun gros bundle. Ce dépôt inclut `checkout-success.html` qui est intentionnellement très léger.

Exemple d'URL à mettre dans Stripe (success_url):

  https://<votre-site>/checkout-success.html?session_id={CHECKOUT_SESSION_ID}

En local (Netlify Dev) utilisez :

  http://localhost:8888/checkout-success.html?session_id={CHECKOUT_SESSION_ID}

Le `checkout-success.html` appelle ensuite `/.netlify/functions/check-access` et redirige proprement vers la plateforme sans charger tous les jeux, ce qui garde la taille du téléchargement très faible (~0.5 KB gzippé pour la page de succès).

Notes:
- Assurez-vous que la function `create-checkout-session` construit success_url avec `?session_id={CHECKOUT_SESSION_ID}`.
- Configurez votre dashboard Stripe pour inclure cette URL pour les Payment Links si vous en utilisez.
