Param(
    [string]$Base = 'http://localhost:8000'
)

function Test-Url($url){
    try{
        $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        if($r.StatusCode -ge 200 -and $r.StatusCode -lt 400){ Write-Output "OK  : $url"; return $true }
        else { Write-Output "FAIL: $url (status $($r.StatusCode))"; return $false }
    } catch {
        Write-Output "FAIL: $url ($($_.Exception.Message))"; return $false
    }
}

$all = @()

# main index
$all += "$Base/platform/index.html"

for($i=1;$i -le 36;$i++){
    $all += "$Base/jeux$i.html"
}

$ok = 0; $fail = 0
foreach($u in $all){ if(Test-Url $u){ $ok++ } else { $fail++ } }

Write-Output "\nSummary: $ok OK / $fail FAIL"
