<#
Run this script from the project root in PowerShell to apply the Supabase schema
and optionally start Netlify Dev + Stripe CLI in new windows.

Usage: open PowerShell in project folder and run:
    .\scripts\run_local_test.ps1

The script will prompt you for sensitive keys without printing them.
#>

function Read-SecureInput([string]$prompt){
    $secure = Read-Host -AsSecureString -Prompt $prompt
    # convert SecureString to plain string for local env use only
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try{ [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) } finally{ [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}

Write-Host "== Setup local test environment for jeux-brise-glace ==" -ForegroundColor Cyan

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot
Write-Host "Project root: $projectRoot"

# Prompt for values
$supabaseUrl = Read-Host -Prompt "SUPABASE_URL (ex: https://xyz.supabase.co)"
$supabaseKey = Read-SecureInput "SUPABASE_SERVICE_ROLE_KEY (input hidden)"
$stripeKey = Read-SecureInput "STRIPE_SECRET_KEY (sk_test..., input hidden) [optional - press Enter to skip]"
$webhookSecret = Read-SecureInput "STRIPE_WEBHOOK_SECRET (whsec..., input hidden) [optional - press Enter to skip]"

# Set environment variables for this session
if($supabaseUrl -ne ''){ $env:SUPABASE_URL = $supabaseUrl }
if($supabaseKey -ne ''){ $env:SUPABASE_SERVICE_ROLE_KEY = $supabaseKey }
if($stripeKey -ne ''){ $env:STRIPE_SECRET_KEY = $stripeKey }
if($webhookSecret -ne ''){ $env:STRIPE_WEBHOOK_SECRET = $webhookSecret }

Write-Host "Environment variables set for this PowerShell session." -ForegroundColor Green

# Ensure dependencies are installed
if(-not (Test-Path node_modules)){
    Write-Host "Installing npm dependencies (this may take a moment)..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "node_modules exists — skipping npm install." -ForegroundColor DarkGreen
}

# Apply schema
Write-Host "Applying Supabase schema (npm run apply-schema)..." -ForegroundColor Yellow
$apply = npm run apply-schema 2>&1
Write-Host $apply

# Offer to start Netlify Dev
$startNetlify = Read-Host -Prompt "Démarrer Netlify Dev maintenant ? (y/n)"
if($startNetlify -match '^[Yy]'){
    Write-Host "Opening Netlify Dev in a new PowerShell window..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit","-Command","npx netlify dev --port=8888" -WindowStyle Normal
} else {
    Write-Host "Skipped starting Netlify Dev." -ForegroundColor Gray
}

# Offer to start Stripe listen
$startStripe = Read-Host -Prompt "Démarrer Stripe CLI listen maintenant ? (y/n)"
if($startStripe -match '^[Yy]'){
    Write-Host "Opening Stripe CLI listen in a new PowerShell window..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit","-Command","stripe listen --forward-to http://localhost:8888/.netlify/functions/webhook" -WindowStyle Normal
} else {
    Write-Host "Skipped starting Stripe CLI." -ForegroundColor Gray
}

Write-Host "All done — Netlify Dev / Stripe windows (if requested) should be open. Use your browser to open http://localhost:8888/platform/index.html" -ForegroundColor Green

# End of script
