<#
  backup_platform_variants.ps1

  Usage (PowerShell):
    .\scripts\backup_platform_variants.ps1

  This script copies a curated list of platform variant files into
  legacy/platform_backups/ with a timestamp suffix so you have exact
  file backups before any propagation/overwrite.
#>

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = Resolve-Path (Join-Path $root "..")
$backupDir = Join-Path $repoRoot 'legacy\platform_backups'

if(-not (Test-Path $backupDir)){
  New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

$filesToBackup = @(
  'served_global.html',
  'global_platform_fixed.html',
  'tmp_global_platform.html',
  'docs\global_platform.html',
  'platform\index.html'
)

$timestamp = (Get-Date).ToString('yyyyMMdd_HHmmss')

foreach($rel in $filesToBackup){
  $src = Join-Path $repoRoot $rel
  if(Test-Path $src){
    $safeName = $rel -replace '[\\:/ ]','_' -replace '\.\.', ''
    $dest = Join-Path $backupDir ($safeName + '.' + $timestamp + '.bak')
    try{
      Copy-Item -Path $src -Destination $dest -Force
      Write-Host "Backed up: $rel -> $(Split-Path $dest -Leaf)"
    }catch{
      Write-Warning "Failed to backup $rel : $_"
    }
  }else{
    Write-Warning "Source not found, skipping: $rel"
  }
}

Write-Host "Backup complete. Files were copied to: $backupDir"
