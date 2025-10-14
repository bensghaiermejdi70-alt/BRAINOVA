<#
Orchestrator PowerShell script to run a local end-to-end test:
- Validates environment
- Optionally runs stripe listen (if user wants)
- Runs netlify dev (user should run separately normally)
- Executes create_test_checkout.js and opens the Checkout URL

Usage:
  # Ensure STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are set in the session
  .\run_local_test.ps1 -OpenBrowser
#>
param(
  [switch]$OpenBrowser
)

function Ensure-Env($name) {
  if (-not (Get-ChildItem Env:$name)) {
    Write-Error "Environment variable $name is not set. Please set it before running this script."; exit 1
  }
}

Ensure-Env STRIPE_SECRET_KEY
Ensure-Env STRIPE_WEBHOOK_SECRET

# Create session
Write-Host "Creating checkout session..."
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) { Write-Error "Node.js not found in PATH"; exit 1 }

$cmd = "node .\tools\create_test_checkout.js --amount 2000 --currency eur --name \"Brainova Premium\" --metadata \"{\\\"game_id\\\":\\\"1\\\",\\\"user_email\\\":\\\"test@example.com\\\"}\" --success_url \"http://localhost:8888/checkout-success.html\" --cancel_url \"http://localhost:8888/checkout-success.html?checkout=cancel\""

$process = Start-Process -FilePath node -ArgumentList ".\tools\create_test_checkout.js --amount 2000 --currency eur --name 'Brainova Premium' --metadata '{""game_id"":""1"",""user_email"":""test@example.com""}' --success_url 'http://localhost:8888/checkout-success.html' --cancel_url 'http://localhost:8888/checkout-success.html?checkout=cancel'" -NoNewWindow -RedirectStandardOutput .\tools\create_checkout_output.txt -Wait -PassThru

# Read output file to find URL
Start-Sleep -Seconds 1
$content = Get-Content .\tools\create_checkout_output.txt -Raw
Write-Host $content

# Try to extract first https:// link
if ($content -match '(https://[^\s]+)') {
  $url = $matches[1]
  Write-Host "Checkout URL: $url"
  if ($OpenBrowser) { Start-Process $url }
} else {
  Write-Error "Could not find checkout URL in script output."; exit 2
}

Write-Host "Done. Watch Stripe CLI and Netlify Dev windows for webhook delivery and processing logs." 
