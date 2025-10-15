param(
  [int]$count = 36,
  [string]$outDir = '.'
)

if(-not (Test-Path $outDir)){
  New-Item -ItemType Directory -Path $outDir | Out-Null
}

for($i=0; $i -lt $count; $i++){
  $filename = Join-Path $outDir ("jeux{0}.html" -f $i)
  $content = @"
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Jeu $i</title>
  <style>
    body { font-family: sans-serif; text-align: center; padding: 50px; }
  </style>
</head>
<body>
  <h1>Bienvenue dans le Jeu $i</h1>
  <p>Ceci est un exemple de jeu minimal.</p>

  <script>
    // Notify parent to close overlay if embedded
    try{ window.parent.postMessage({ action: 'close' }, '*'); }catch(e){}
  </script>
</body>
</html>
"@
  Set-Content -Path $filename -Value $content -Encoding UTF8
  Write-Output "Created $filename"
}

Write-Output "Generated $count game files in $outDir"