# Create a ZIP archive containing docs/global_platform.html, docs/carte qi.html (if present) and all docs/jeux*.html
try {
    $repoRoot = Split-Path -Parent $PSScriptRoot
    if([string]::IsNullOrEmpty($repoRoot)) { $repoRoot = Get-Location }
    $docs = Join-Path $repoRoot 'docs'
    $dest = Join-Path $repoRoot 'platform-and-games.zip'

    if(-not (Test-Path $docs)){
        Write-Error "Docs folder not found: $docs"
        exit 1
    }

    $files = Get-ChildItem -Path $docs -Include 'jeux*.html','global_platform.html','carte-qi.html' -File -Recurse -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName
    if(-not $files -or $files.Count -eq 0){
        Write-Error "NO_FILES_FOUND"
        exit 2
    }

    Compress-Archive -Path $files -DestinationPath $dest -Force -ErrorAction Stop
    Write-Host "ZIP_CREATED:$dest"
    exit 0
} catch {
    Write-Error "ZIP_FAILED: $($_.Exception.Message)"
    exit 3
}