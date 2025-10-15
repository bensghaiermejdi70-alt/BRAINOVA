$urls = @("http://localhost:8000/brainova.html","http://localhost:8080/brainova.html")
foreach($u in $urls){
    Write-Output "Testing $u"
    try{
        $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 4 -ErrorAction Stop
        Write-Output "OK : $u (status $($r.StatusCode))"
    } catch {
        Write-Output "FAIL: $u ($($_.Exception.Message))"
    }
}
