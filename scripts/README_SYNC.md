Utilitaire de synchronisation - usage

Ce petit utilitaire surveille la version servie de `global_platform.html` (par défaut `http://127.0.0.1:8080/global_platform.html`) et remplace automatiquement le fichier local `global_platform.html` si le contenu distant change.

Pré-requis : Node.js installé.

Commandes :

- Depuis la racine du projet (PowerShell) :

```powershell
# démarre la surveillance toutes les 5 secondes
npm run sync-global-platform
```

- Pour changer l'URL ou la fréquence (ex. poll toutes les 10s) :

```powershell
node .\scripts\sync_global_platform.js http://127.0.0.1:8080/global_platform.html ..\global_platform.html 10
```

Notes de sécurité :
- Ce script écrase le fichier local `global_platform.html` si le contenu distant diffère. Utilisez-le uniquement en développement.
- Si vous avez des changements locaux non committés, pensez à faire un commit avant d'exécuter la synchronisation.
