# Reintegrate jeux13 and jeux20 from their _nouveau source files
# Usage: Open PowerShell in the repo root and run:
#   .\scripts\reintegrate_games.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$legacyDir = Join-Path $root 'legacy'
if (-not (Test-Path $legacyDir)) { New-Item -ItemType Directory -Path $legacyDir | Out-Null }

# Timestamp for backups
$ts = Get-Date -Format "yyyyMMdd_HHmmss"

function Backup-And-Copy($src, $dst) {
    if (-not (Test-Path $src)) {
        Write-Host "Source not found: $src" -ForegroundColor Yellow
        return
    }
    if (Test-Path $dst) {
        $backupPath = Join-Path $legacyDir ([IO.Path]::GetFileName($dst) + ".bak.$ts")
        Copy-Item -Path $dst -Destination $backupPath -Force
        Write-Host "Backed up $dst -> $backupPath"
    }
    Copy-Item -Path $src -Destination $dst -Force
    Write-Host "Copied $src -> $dst"
}

# Files to reintegrate
$pairs = @(
    @{ src = Join-Path $root 'jeux13_nouveau.html'; dst = Join-Path $root 'jeux13.html' },
    @{ src = Join-Path $root 'jeux20_nouveau.html'; dst = Join-Path $root 'jeux20.html' }
)

foreach ($p in $pairs) {
    Backup-And-Copy $p.src $p.dst
}

Write-Host "Done. You can now start a local static server (python -m http.server 8000) and open http://localhost:8000/global_platform.html to verify." -ForegroundColor Green

# Optional quick HEAD checks if Invoke-WebRequest available
try {
    $urls = @('/global_platform.html','/jeux2brainova.html','/jeux13.html','/jeux20.html')
    foreach ($u in $urls) {
        $full = "http://127.0.0.1:8000$u"
        Write-Host "HEAD $full ... (run after starting server)"
    }
} catch { }
