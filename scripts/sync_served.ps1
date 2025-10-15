Param(
  [string]$servedUrl = 'http://127.0.0.1:8080/global_platform.html',
  [string]$targetPath = "global_platform.html",
  [string]$commitMessage = "Sync served global_platform.html -> repo"
)

Write-Host "Fetching $servedUrl"
try{
  $resp = Invoke-WebRequest -Uri $servedUrl -UseBasicParsing -ErrorAction Stop
  $content = $resp.Content
} catch {
  Write-Error "Failed to fetch $servedUrl : $_"
  exit 1
}

$backup = Join-Path -Path $env:TEMP -ChildPath ("global_platform.backup.{0:yyyyMMdd-HHmmss}.html" -f (Get-Date))
Write-Host "Backing up current file to $backup"
Copy-Item -Path $targetPath -Destination $backup -ErrorAction SilentlyContinue

Write-Host "Writing served content to $targetPath"
Set-Content -Path $targetPath -Value $content -Encoding utf8

Write-Host "Committing changes to git"
git add $targetPath
git commit -m $commitMessage 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "No changes to commit or git commit failed." } else {
  git push origin HEAD
}

Write-Host "Done. If you want a Netlify rebuild, set NETLIFY_BUILD_HOOK secret and push to main or run the workflow."