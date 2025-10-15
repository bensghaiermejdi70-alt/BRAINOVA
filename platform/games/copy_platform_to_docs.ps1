# Copy platform folder into docs/platform (preserves structure)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $root '..')
$platformSrc = Join-Path $repoRoot 'platform'
$docsDest = Join-Path $repoRoot 'docs\platform'
Write-Host "Copying from: $platformSrc"
Write-Host "To: $docsDest"
if(!(Test-Path $platformSrc)) { Write-Error "Source platform folder not found: $platformSrc"; exit 1 }
if(Test-Path $docsDest) { Write-Host "Destination exists - removing old folder"; Remove-Item -Recurse -Force $docsDest }
Copy-Item -Path $platformSrc -Destination $docsDest -Recurse -Force -Verbose
Write-Host "DONE"