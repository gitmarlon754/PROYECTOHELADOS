$ErrorActionPreference = 'SilentlyContinue'

$backendUrl = 'http://localhost:8080/api/mock/productos'
$frontendUrl = 'http://localhost:4200'
$h2Url = 'http://localhost:8080/h2-console'

function Test-Port {
    param([int]$Port)

    $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
        Select-Object -First 1

    if ($null -eq $conn) {
        return $null
    }

    $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
    [PSCustomObject]@{
        Port = $Port
        Pid = $conn.OwningProcess
        Process = if ($proc) { $proc.ProcessName } else { 'unknown' }
    }
}

function Test-Http {
    param([string]$Url)

    try {
        $resp = Invoke-WebRequest -Uri $Url -Method Get -UseBasicParsing -TimeoutSec 4
        return [PSCustomObject]@{
            Url = $Url
            Ok = $true
            Status = [int]$resp.StatusCode
        }
    } catch {
        $status = $null
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
            $status = [int]$_.Exception.Response.StatusCode
        }

        return [PSCustomObject]@{
            Url = $Url
            Ok = $false
            Status = $status
        }
    }
}

Write-Host '=== Estado entorno dev Heladeria ===' -ForegroundColor Cyan

$backendPort = Test-Port -Port 8080
$frontendPort = Test-Port -Port 4200

if ($backendPort) {
    Write-Host "Backend puerto 8080: UP (PID $($backendPort.Pid), $($backendPort.Process))" -ForegroundColor Green
} else {
    Write-Host 'Backend puerto 8080: DOWN' -ForegroundColor Red
}

if ($frontendPort) {
    Write-Host "Frontend puerto 4200: UP (PID $($frontendPort.Pid), $($frontendPort.Process))" -ForegroundColor Green
} else {
    Write-Host 'Frontend puerto 4200: DOWN' -ForegroundColor Red
}

$backendCheck = Test-Http -Url $backendUrl
$frontendCheck = Test-Http -Url $frontendUrl
$h2Check = Test-Http -Url $h2Url

if ($backendCheck.Ok) {
    Write-Host "API mock backend: OK ($($backendCheck.Status))" -ForegroundColor Green
} else {
    Write-Host "API mock backend: FAIL" -ForegroundColor Yellow
}

if ($frontendCheck.Ok) {
    Write-Host "Frontend HTTP: OK ($($frontendCheck.Status))" -ForegroundColor Green
} else {
    Write-Host 'Frontend HTTP: FAIL' -ForegroundColor Yellow
}

if ($h2Check.Ok) {
    Write-Host "H2 console: OK ($($h2Check.Status))" -ForegroundColor Green
} else {
    Write-Host 'H2 console: FAIL' -ForegroundColor Yellow
}

Write-Host '------------------------------------' -ForegroundColor DarkGray
Write-Host 'Comandos útiles:' -ForegroundColor DarkGray
Write-Host '  .\start-dev.ps1' -ForegroundColor DarkGray
Write-Host '  .\start-dev.ps1 -SkipBackendBuild -SkipFrontendInstall' -ForegroundColor DarkGray
Write-Host '  .\stop-dev.ps1' -ForegroundColor DarkGray
Write-Host '  .\stop-dev.ps1 -ForceAll' -ForegroundColor DarkGray
