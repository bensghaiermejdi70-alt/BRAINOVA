Automatisation: synchronisation et déploiement

1) Synchroniser la page servie (127.0.0.1:8080) avec le repo local

PowerShell script:

  scripts/sync_served.ps1

Usage (PowerShell):

  pwsh .\scripts\sync_served.ps1 -servedUrl 'http://127.0.0.1:8080/brainova.html' -targetPath 'global_platform.html'

Le script télécharge la page servie, sauvegarde une copie locale, remplace `global_platform.html`, fait un commit et pousse sur la branche courante.

2) Déclencher un déploiement Netlify après push

- Ajoutez un secret Netlify `NETLIFY_BUILD_HOOK` dans votre repo GitHub (Settings -> Secrets) contenant l'URL du build hook.
- Le workflow `.github/workflows/trigger-netlify-build.yml` déclenchera le hook à chaque push sur `main`.

3) Variables sensibles

- Stripe keys, Supabase keys et le webhook secret ne doivent jamais être committés. Configurez-les dans Netlify (Site -> Settings -> Environment) et dans GitHub Secrets selon vos besoins.

4) Test local

- Pour tester localement les fonctions, utilisez `netlify dev` (Netlify CLI) et Stripe CLI (`stripe listen --forward-to http://localhost:8888/.netlify/functions/webhook`). Voir `netlify/README.md` pour les détails.
