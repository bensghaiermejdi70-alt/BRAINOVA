# -------------------------------
# Test Stripe + Netlify Dev Script
# -------------------------------

# Définir la variable d'environnement pour le webhook Stripe
$env:STRIPE_WEBHOOK_SECRET = "whsec_a53e519413ad3fc6c1480254abd9d10dcb583291b613ae3aa42307eea68acc0e"

# Simuler un paiement test via Stripe CLI
C:\Users\MEJDI\Downloads\stripe.exe trigger checkout.session.completed

# Message de fin
Write-Host "Script terminé. Vérifiez Terminal 1 pour les logs Netlify Dev."
