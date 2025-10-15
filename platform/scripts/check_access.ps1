$urls = @("http://localhost:8000/global_platform.html","http://localhost:8080/global_platform.html")
foreach($u in $urls){
    Write-Output "Testing $u"
    try{
        $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 4 -ErrorAction Stop
        Write-Output "OK : $u (status $($r.StatusCode))"
    } catch {
        Write-Output "FAIL: $u ($($_.Exception.Message))"
    }
}
