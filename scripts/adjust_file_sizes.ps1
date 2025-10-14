<#
Adjust exact file sizes by inserting/removing bytes inside a safe padding block.
Usage: run from repo root in PowerShell:
  .\scripts\adjust_file_sizes.ps1

This script will adjust `jeux13.html` to exactly 68 KB (69632 bytes) and
`jeux20.html` to exactly 106 KB (108544 bytes) by modifying only the bytes
inside a comment block <!--PADDING_START--> ... <!--PADDING_END-->
If the markers do not exist in the file, the script will append them.
#>

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
Set-Location $root

$files = @{
    'jeux13.html' = 68 * 1024;    # 69632 bytes
    'jeux20.html' = 106 * 1024;   # 108544 bytes
}

$utf8 = [System.Text.Encoding]::UTF8

function Combine-ByteArrays([byte[][]]$parts) {
    $total = 0
    foreach ($p in $parts) { if ($p) { $total += $p.Length } }
    $res = New-Object byte[] $total
    $offset = 0
    foreach ($p in $parts) {
        if ($p -and $p.Length -gt 0) {
            [Buffer]::BlockCopy($p, 0, $res, $offset, $p.Length)
            $offset += $p.Length
        }
    }
    return $res
}

function IndexOfSubArray([byte[]]$array, [byte[]]$sub, [int]$start=0) {
    for ($i=$start; $i -le $array.Length - $sub.Length; $i++) {
        $match = $true
        for ($j=0; $j -lt $sub.Length; $j++) { if ($array[$i+$j] -ne $sub[$j]) { $match = $false; break } }
        if ($match) { return $i }
    }
    return -1
}

foreach ($fname in $files.Keys) {
    $path = Join-Path $root $fname
    if (-not (Test-Path $path)) { Write-Host "File not found: $path" -ForegroundColor Yellow; continue }

    $target = $files[$fname]
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $cur = $bytes.Length

    $startMarker = '<!--PADDING_START-->'
    $endMarker   = '<!--PADDING_END-->'
    $startB = $utf8.GetBytes($startMarker)
    $endB = $utf8.GetBytes($endMarker)

    $startIdx = IndexOfSubArray $bytes $startB 0
    $endIdx = IndexOfSubArray $bytes $endB 0

    if ($startIdx -eq -1 -or $endIdx -eq -1 -or $endIdx -lt $startIdx) {
        # Append markers at file end
    $append = "`n$startMarker`n`n$endMarker`n"
    $appendB = $utf8.GetBytes($append)
    $newAll = Combine-ByteArrays @($bytes, $appendB)
    [System.IO.File]::WriteAllBytes($path, $newAll)
        $bytes = [System.IO.File]::ReadAllBytes($path)
        $cur = $bytes.Length
        $startIdx = IndexOfSubArray $bytes $startB 0
        $endIdx = IndexOfSubArray $bytes $endB 0
        if ($startIdx -eq -1 -or $endIdx -eq -1) { Write-Host "Failed to append markers to $fname" -ForegroundColor Red; continue }
    }

    $padContentStart = $startIdx + $startB.Length
    $padContentEnd = $endIdx - 1
    if ($padContentEnd -lt $padContentStart) { $padLen = 0 } else { $padLen = $padContentEnd - $padContentStart + 1 }

    $needed = $target - $cur
    Write-Host ($("Processing {0}: current={1} target={2} delta={3} (padLen={4})" -f $fname,$cur,$target,$needed,$padLen))

    if ($needed -eq 0) { Write-Host "Already at target size for $fname" -ForegroundColor Green; continue }

    if ($needed -gt 0) {
        # Need to increase size: insert spaces into padding content
        $padBytes = New-Object byte[] $padLen
        if ($padLen -gt 0) { [Array]::Copy($bytes, $padContentStart, $padBytes, 0, $padLen) }
        $extra = New-Object byte[] $needed
        for ($i=0; $i -lt $needed; $i++) { $extra[$i] = 32 } # ASCII space
        # rebuild bytes: before pad content + pad content + extra + after
        $before = $bytes[0..($padContentStart-1)]
        $afterStart = $padContentStart + $padLen
        $after = if ($afterStart -le $bytes.Length -1) { $bytes[$afterStart..($bytes.Length-1)] } else { @() }
    $newBytes = Combine-ByteArrays @($before, $padBytes, $extra, $after)
    [System.IO.File]::WriteAllBytes($path, $newBytes)
        Write-Host "Increased $fname by $needed bytes" -ForegroundColor Green
    } else {
        # Need to shrink: remove bytes from padding content
        $toRemove = -$needed
        if ($toRemove -le $padLen) {
            $newPadLen = $padLen - $toRemove
            $before = $bytes[0..($padContentStart-1)]
            $newPad = if ($newPadLen -gt 0) { $bytes[$padContentStart..($padContentStart+$newPadLen-1)] } else { @() }
            $afterStart = $padContentStart + $padLen
            $after = if ($afterStart -le $bytes.Length -1) { $bytes[$afterStart..($bytes.Length-1)] } else { @() }
            $newBytes = Combine-ByteArrays @($before, $newPad, $after)
            [System.IO.File]::WriteAllBytes($path, $newBytes)
            Write-Host "Reduced $fname by $toRemove bytes" -ForegroundColor Green
        } else {
            Write-Host "Cannot safely reduce $fname by $toRemove bytes because padding area ($padLen bytes) is too small. Aborting for this file." -ForegroundColor Red
        }
    }
}

Write-Host "Done. Re-run Get-Item <file> to verify sizes or use your editor." -ForegroundColor Cyan
