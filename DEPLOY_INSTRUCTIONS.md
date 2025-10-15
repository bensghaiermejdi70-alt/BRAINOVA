Goal

Deploy the current project to GitHub Pages to replace (or publish alongside) the existing site at https://bensghaiermejdi70-alt.github.io/jeux-brise-glace/.

Two deployment options are provided:

1) Quick: use the GitHub Actions workflow to publish the repository root to the gh-pages branch automatically on push to `main` or `master`.

2) Manual: build and push the `gh-pages` branch content manually (helpful if you want to test locally before replacing the live site).

Setup (recommended)

1. Ensure your repository default branch is `main` (or update the workflow trigger to your branch name).
2. Enable a deploy key (recommended) or rely on `GITHUB_TOKEN`:
   - Deploy key: create an SSH deploy key (no write by default) and add it to the repository secrets as `DEPLOY_KEY` in OpenSSH private key format. The workflow above supports pushing via deploy key.
   - Simpler: ensure Actions has write permissions and GITHUB_TOKEN is available (no secret required). Note: GITHUB_TOKEN can push to gh-pages depending on repo settings.

Using the workflow

- Commit and push to `main` (or `master`). The workflow will run and publish the repository root to the `gh-pages` branch.
- After the action completes, visit `https://<your-org-or-username>.github.io/<repo-name>/global_platform.html`
  - For this repo the expected URL will be `https://bensghaiermejdi70-alt.github.io/jeux-brise-glace/global_platform.html`

Auto-redirect note
------------------
The repository includes a small auto-redirect added to `index.html` that redirects visitors to `global_platform_correct.html` when the site is served over HTTP (GitHub Pages). This improves the first-load UX so visitors land on the platform immediately.

Bypass the redirect
--------------------
If you need to view `index.html` itself (for debugging) or open the site without redirection, append `?no-redirect` to the URL, for example:

  https://bensghaiermejdi70-alt.github.io/jeux-brise-glace/index.html?no-redirect

Or open the file locally using `file://` (no redirect will be triggered).

Quick alternative: pousser `docs/` manuellement vers `gh-pages`
----------------------------------------------------------
Si vous préférez déployer immédiatement sans attendre la configuration des clés Actions, utilisez le script PowerShell fourni :

1. Assurez-vous d'avoir commité vos changements dans la branche principale.
2. Ouvrez PowerShell dans la racine du dépôt et exécutez :

```powershell
.\scripts\push_docs.ps1 -Remote origin -Branch gh-pages -Message "Deploy docs"
```

Le script force la mise à jour de la branche `gh-pages` avec le contenu de `docs/`.
Après réussite, attendez ~30s–2min puis ouvrez :

https://bensghaiermejdi70-alt.github.io/jeux-brise-glace/

Notes de sécurité : le script fait un push forcé sur `gh-pages`. Ne l'utilisez pas si d'autres workflows ou contenus sensibles y sont stockés.

Manual publish (if you prefer):

1. Create a `gh-pages` branch locally and copy the files you want published into it (root HTML files).
2. Commit and push `gh-pages`.
3. In GitHub repository Settings > Pages choose branch `gh-pages` and path `/ (root)`.

Notes

- This workflow will replace the live site when it runs and pushes to `gh-pages`. If you want to keep the old site live and test first, use a separate branch and test URL or a temporary repo.
- The repository root is published, so `global_platform.html` will be accessible at `https://<user>.github.io/<repo>/global_platform.html`.

If you want I can also:
- Create a small build step to copy only `platform/` and the HTML files you want to publish into a `dist/` directory and publish that instead.
- Create a PR that updates the homepage content and triggers the workflow once you approve.
