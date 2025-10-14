# Commit and push helper for the Brainova repo
# Usage: open PowerShell at repo root and run: .\scripts\commit_and_push.ps1
param(
    [switch]$Push
)
function Abort($msg){ Write-Host "ERROR: $msg" -ForegroundColor Red; exit 1 }
# Ensure script runs from repo root
$repoRoot = Resolve-Path .
Write-Host "Repo root: $repoRoot"
# Check git exists
if(-not (Get-Command git -ErrorAction SilentlyContinue)){
    Write-Host "git is not installed or not in PATH. Please install Git and re-run this script." -ForegroundColor Yellow
    Write-Host "Commands you can run manually:" -ForegroundColor Cyan
    Write-Host "  git add -A"
    Write-Host "  git commit -m \"Normalize game paths; add missing jeuxN.html to root for GH Pages; make GamesIndex.launch resilient\""
    Write-Host "  git push" -ForegroundColor Cyan
    exit 2
}
# Show status
Write-Host "Running: git status --porcelain"
$st = git status --porcelain
if(-not $st){
    Write-Host "No changes to commit." -ForegroundColor Green
    exit 0
}
Write-Host "Changes to stage/commit:" -ForegroundColor Yellow
git status --short
# Stage all
Write-Host "Staging all changes..."
git add -A
# Show diff staged
Write-Host "Staged diff preview (first 200 lines):"
$diff = git diff --staged | Select-Object -First 200
if($diff){ Write-Output $diff } else { Write-Host "(no diff to show)" }
# Commit
$commitMessage = 'Normalize game paths; add missing jeuxN.html to root for GH Pages; make GamesIndex.launch resilient'
Write-Host "Creating commit with message:`n$commitMessage`n"
git commit -m "$commitMessage"
if($LASTEXITCODE -ne 0){ Abort 'git commit failed.' }
# Optionally push
if($Push){
    Write-Host "Pushing to remote..."
    git push
    if($LASTEXITCODE -ne 0){ Abort 'git push failed.' }
    Write-Host "Pushed." -ForegroundColor Green
} else {
    Write-Host "Commit created locally. To push, run: git push" -ForegroundColor Green
}
