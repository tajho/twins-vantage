Write-Host "=== TEST EN VIVO DE LAS 28 COMPUTADORAS Y SERVIDORES ==="

$inventory = Get-Content "C:\Users\tajho\Desktop\TwinsVantage\inventory_data.json" | ConvertFrom-Json

$results = @()
foreach ($d in $inventory) {
    $ip = $d.ip
    $pingSuccess = $false
    $rtt = $null
    
    $p = New-Object System.Net.NetworkInformation.Ping
    try {
        $reply = $p.Send($ip, 500)
        if ($reply.Status -eq [System.Net.NetworkInformation.IPStatus]::Success) {
            $pingSuccess = $true
            $rtt = $reply.RoundtripTime
        }
    } catch {}

    $results += [PSCustomObject]@{
        ID          = $d.id
        Usuario     = $d.activeUser
        IP          = $ip
        RealOnline  = $pingSuccess
        RTT_ms      = $rtt
        Department  = $d.department
    }
}

$results | Sort-Object RealOnline -Descending | Format-Table -AutoSize

$onlineCount = ($results | Where-Object { $_.RealOnline -eq $true }).Count
$offlineCount = ($results | Where-Object { $_.RealOnline -eq $false }).Count
Write-Host "TOTAL REAL: $onlineCount ENCENDIDAS (ONLINE) | $offlineCount APAGADAS (OFFLINE)"
