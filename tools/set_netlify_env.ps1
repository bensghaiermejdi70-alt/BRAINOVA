<#
Sets environment variables on Netlify site either using netlify CLI or Netlify API.
Usage (netlify CLI):
  # Ensure you are logged in with netlify CLI and SITE_ID is set
  $env:NETLIFY_SITE_ID = "your-site-id"
  .\set_netlify_env.ps1 -Vars @{STRIPE_SECRET_KEY='sk_live_...'; STRIPE_WEBHOOK_SECRET='whsec_...'}

Usage (API token):
  $env:NETLIFY_TOKEN = 'your_token'
  .\set_netlify_env.ps1 -Vars @{STRIPE_SECRET_KEY='sk_live_...'; STRIPE_WEBHOOK_SECRET='whsec_...'}
#>
param(
  [Parameter(Mandatory=$true)]
  [hashtable]$Vars
)

function Set-Vars-With-NetlifyCli($vars) {
  foreach ($k in $vars.Keys) {
    $v = $vars[$k]
    Write-Host "Setting $k via netlify cli"
    netlify env:set $k "$v"
  }
}

function Set-Vars-With-Api($vars) {
  if (-not $env:NETLIFY_SITE_ID) { throw "NETLIFY_SITE_ID not set" }
  if (-not $env:NETLIFY_TOKEN) { throw "NETLIFY_TOKEN not set" }
  $siteId = $env:NETLIFY_SITE_ID
  $token = $env:NETLIFY_TOKEN

  foreach ($k in $vars.Keys) {
    $v = $vars[$k]
    Write-Host "Setting $k via Netlify API"
    $body = @{ key = $k; value = $v; scope = "build" } | ConvertTo-Json
    Invoke-RestMethod -Uri "https://api.netlify.com/api/v1/sites/$siteId/env" -Method Post -Headers @{ Authorization = "Bearer $token" } -Body $body -ContentType 'application/json'
  }
}

try {
  if (Get-Command netlify -ErrorAction SilentlyContinue) {
    Set-Vars-With-NetlifyCli $Vars
  } else {
    Set-Vars-With-Api $Vars
  }
  Write-Host "Done setting variables";
} catch {
  Write-Error $_.Exception.Message
  exit 1
}
