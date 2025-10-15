<#
Copies jeux*.html and related game files into docs/ so GitHub Pages can serve them.
Usage: Run from repository root in PowerShell:
  .\scripts\copy_games_to_docs.ps1
#>

# Compute repository root (parent of the scripts folder)
$scriptDir = Split-Path -Parent $PSCommandPath
$root = Split-Path -Parent $scriptDir
Set-Location $root

$docs = Join-Path $root 'docs'
if(-not (Test-Path $docs)){
    New-Item -ItemType Directory -Path $docs | Out-Null
}

# Patterns to copy (customize as needed)
$patterns = @('jeux*.html','carte-qi.html','jeux 1 nouveau.html','jeux1super.html')

Write-Host "Copying game pages into: $docs"

foreach($p in $patterns){
    Get-ChildItem -Path $root -Filter $p -File -ErrorAction SilentlyContinue | ForEach-Object {
        $dest = Join-Path $docs $_.Name
        Copy-Item -Path $_.FullName -Destination $dest -Force
        Write-Host "Copied: $($_.Name) -> docs/"
    }
}

Write-Host "Done. Verify docs/ contains the game pages."
