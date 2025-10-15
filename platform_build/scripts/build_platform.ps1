<#
Build script for Brainova platform package.
Run this from the repository root (PowerShell) to assemble a self-contained
`platform_build/` directory and produce `Brainova_platform.zip`.

Usage:
  powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\build_platform.ps1

This script copies:
 - `brainova.html` -> platform_build/index.html (platform entry)
 - all top-level `*.html` files into the build root
 - `platform/core` and `platform/games` directories
 - `styles` and `scripts` directories if present
 - root `*.js` files (to preserve helpers like stripe-client.js)

Then it compresses the final folder into `Brainova_platform.zip` for upload.
#>
set-strictmode -Version Latest -ErrorAction Stop
$repoRoot = (Get-Location).ProviderPath
Write-Output "Repository root: $repoRoot"
$buildDir = Join-Path $repoRoot 'platform_build'
$zipPath = Join-Path $repoRoot 'Brainova_platform.zip'

# Clean existing build
if(Test-Path $buildDir){ Write-Output "Removing existing $buildDir"; Remove-Item -LiteralPath $buildDir -Recurse -Force }
New-Item -ItemType Directory -Path $buildDir | Out-Null

# Copy platform/core and platform/games if present
$toCopy = @('platform\core','platform\games','styles','scripts')
foreach($p in $toCopy){
  $src = Join-Path $repoRoot $p
  if(Test-Path $src){
    $dest = Join-Path $buildDir $p
    Write-Output "Copying $src -> $dest"
    New-Item -ItemType Directory -Path (Split-Path $dest) -Force | Out-Null
    Copy-Item -LiteralPath $src -Destination $dest -Recurse -Force
  }
}

# Copy root HTML files (most games live at repo root)
Get-ChildItem -Path $repoRoot -Filter '*.html' -File | ForEach-Object {
  $dest = Join-Path $buildDir $_.Name
  Write-Output "Copying HTML: $($_.Name)"
  Copy-Item -LiteralPath $_.FullName -Destination $dest -Force
}

# Copy root JS helpers (e.g., stripe-client.js)
Get-ChildItem -Path $repoRoot -Filter '*.js' -File | ForEach-Object {
  $name = $_.Name
  # skip large helper scripts generated elsewhere (optional)
  if($name -in @('simple_static_server.js')){ return }
  $dest = Join-Path $buildDir $name
  Write-Output "Copying JS: $name"
  Copy-Item -LiteralPath $_.FullName -Destination $dest -Force
}

# Create index.html pointing to brainova if not already present
$indexHtml = Join-Path $buildDir 'index.html'
if( (-not (Test-Path $indexHtml)) -and (Test-Path (Join-Path $buildDir 'brainova.html')) ){
  Write-Output "Creating index.html that opens brainova.html"
  $html = @"
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Brainova — Platform</title>
  <meta http-equiv="refresh" content="0;url=./brainova.html">
</head>
<body>
  <p>Redirecting to <a href="./brainova.html">brainova.html</a></p>
</body>
</html>
"@
  $html | Out-File -FilePath $indexHtml -Encoding UTF8
}

# Compress
if(Test-Path $zipPath){ Write-Output "Removing existing $zipPath"; Remove-Item -LiteralPath $zipPath -Force }
Write-Output "Creating ZIP: $zipPath"
Compress-Archive -Path (Join-Path $buildDir '*') -DestinationPath $zipPath -Force

Write-Output "Build complete. Platform build at: $buildDir"
Write-Output "ZIP created: $zipPath"
