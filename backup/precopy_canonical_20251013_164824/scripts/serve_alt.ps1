Param(
    [string]$Root = "C:\Users\MEJDI\OneDrive\Desktop\jeux brise glace",
    [string]$Prefix = "http://localhost:8080/"
)

Write-Output "Starting simple PowerShell static server (alt)"
Write-Output "Root: $Root"
Write-Output "Prefix: $Prefix"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($Prefix)
try{
    $listener.Start()
}catch{
    Write-Output "ERROR: Unable to start listener on $Prefix : $($_.Exception.Message)"
    return
}
Write-Output "Listening on $Prefix"

function Get-ContentType($path){
    switch ([System.IO.Path]::GetExtension($path).ToLower()){
        '.html' { 'text/html' }
        '.htm'  { 'text/html' }
        '.css'  { 'text/css' }
        '.js'   { 'application/javascript' }
        '.json' { 'application/json' }
        '.png'  { 'image/png' }
        '.jpg'  { 'image/jpeg' }
        '.jpeg' { 'image/jpeg' }
        '.gif'  { 'image/gif' }
        default { 'application/octet-stream' }
    }
}

try{
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        Start-Job -ScriptBlock {
            param($ctx,$root)
            try{
                $req = $ctx.Request
                $path = $req.Url.AbsolutePath.TrimStart('/')
                if([string]::IsNullOrEmpty($path)) { $path = 'platform/index.html' }
                $path = $path -replace '\.\.+',''
                $file = Join-Path $root $path
                if(-not (Test-Path $file)){
                    $ctx.Response.StatusCode = 404
                    $buf = [System.Text.Encoding]::UTF8.GetBytes("Not found")
                    $ctx.Response.ContentType = 'text/plain'
                    $ctx.Response.OutputStream.Write($buf,0,$buf.Length)
                    $ctx.Response.OutputStream.Close()
                    return
                }
                $bytes = [System.IO.File]::ReadAllBytes($file)
                $ctx.Response.StatusCode = 200
                $ctx.Response.ContentType = Get-ContentType $file
                $ctx.Response.ContentLength64 = $bytes.Length
                $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
                $ctx.Response.OutputStream.Close()
            } catch {
                try{ $ctx.Response.StatusCode = 500; $ctx.Response.OutputStream.Close() } catch {}
            }
        } -ArgumentList $context,$Root | Out-Null
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
