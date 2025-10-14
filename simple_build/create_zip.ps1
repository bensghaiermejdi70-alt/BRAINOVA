param(
  [string]$sourceDir = '.',
  [string]$zipPath = 'Brainova.zip'
)

if(Test-Path $zipPath){ Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory((Resolve-Path $sourceDir).ProviderPath, (Resolve-Path $zipPath).ProviderPath)
Write-Output "Created $zipPath from $sourceDir"