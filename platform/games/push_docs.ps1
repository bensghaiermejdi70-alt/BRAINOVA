<#
push_docs.ps1
Utilitaire : crée et pousse la branche gh-pages contenant le contenu du dossier docs/
Usage :
  .\scripts\push_docs.ps1 -Remote origin -Branch gh-pages -Message "Deploy docs"

Notes :
- Ce script force la mise à jour de la branche gh-pages (force push). Utilisez avec précaution.
- Assurez-vous d'avoir commité les changements dans le repo principal avant d'exécuter.
#>
param(
    [string]$Remote = 'origin',
    [string]$Branch = 'gh-pages',
    [string]$Message = 'Publish docs to gh-pages'
)

$cwd = Get-Location
$repoRoot = $PSScriptRoot + "\..\"
$docsPath = Join-Path $repoRoot 'docs'

if(-not (Test-Path $docsPath)){
    Write-Error "Le dossier docs/ n'existe pas : $docsPath"
    exit 1
}

# Create a temporary work tree and commit the docs
$tempBranch = "tmp/publish-docs-$(Get-Random)"

Write-Host "Création d'un arbre de travail temporaire pour publier $docsPath -> branche $Branch sur remote $Remote"

git rev-parse --git-dir > $null 2>&1
if($LASTEXITCODE -ne 0){ Write-Error "Ce dossier n'est pas un dépôt git. Exécutez depuis la racine du repo."; exit 1 }

# Ensure working tree is clean
$st = git status --porcelain
if($st){ Write-Warning "Votre working tree n'est pas vide. Il est recommandé de committer vos changements avant de publier." }

# Create orphan branch and commit docs
Push-Location $docsPath
try{
    git init > $null 2>&1
    # ensure we have a branch
    git checkout -b $tempBranch > $null 2>&1
    git add -A
    git commit -m "$Message" > $null 2>&1
    # push to remote branch
    git push $Remote HEAD:refs/heads/$Branch --force
    if($LASTEXITCODE -ne 0){ Write-Error "Erreur lors du push vers $Remote/$Branch"; exit 1 }
    Write-Host "Publication réussie vers $Remote/$Branch"
}finally{
    Pop-Location
}

Write-Host "Terminé. Vérifiez https://<votre-utilisateur>.github.io/<votre-repo>/global_platform.html après quelques instants."