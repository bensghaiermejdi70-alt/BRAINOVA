param(
  [string]$BaseUrl = 'https://bensghaiermejdi70-alt.github.io/BRAINOVA/',
  [int]$TimeoutSec = 10
)

# Simple smoke-check: fetch root and a few representative game pages
$urls = @(
  $BaseUrl,
  (Join-Path $BaseUrl 'index.html'),
  (Join-Path $BaseUrl 'brainova.html'),
  (Join-Path $BaseUrl 'jeux2%20nouveau.html'),
  (Join-Path $BaseUrl 'jeux2%20nouveau.html'),
  (Join-Path $BaseUrl 'jeux3.html'),
  (Join-Path $BaseUrl 'jeux20%20nouveau.html')
)

Write-Output "Running smoke checks against: $BaseUrl"

foreach($u in $urls){
  try{
    Write-Output "\nTesting: $u"
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec $TimeoutSec -ErrorAction Stop
    Write-Output "  Status: $($r.StatusCode) $($r.StatusDescription)"
    $snippet = $r.Content.Substring(0, [Math]::Min(400, $r.Content.Length)) -replace "\r|\n"," "
    Write-Output "  Snippet: $snippet"
  }catch{
    Write-Output "  Request failed: $($_.Exception.Message)"
  }
}

Write-Output "\nSmoke check finished."