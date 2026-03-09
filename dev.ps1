param(
    [ValidateSet('menu', 'start', 'start-fast', 'start-open', 'start-fast-open', 'stop', 'stop-force', 'status')]
    [string]$Action = 'menu'
)

$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$startScript = Join-Path $projectRoot 'start-dev.ps1'
$stopScript = Join-Path $projectRoot 'stop-dev.ps1'
$statusScript = Join-Path $projectRoot 'status-dev.ps1'

foreach ($scriptPath in @($startScript, $stopScript, $statusScript)) {
    if (-not (Test-Path $scriptPath)) {
        throw "No se encontro el script requerido: $scriptPath"
    }
}

function Show-Header {
    Write-Host ''
    Write-Host '=== Dev Helper Heladeria ===' -ForegroundColor Cyan
    Write-Host '1) Start (normal)' -ForegroundColor Gray
    Write-Host '2) Start (fast)' -ForegroundColor Gray
    Write-Host '3) Status' -ForegroundColor Gray
    Write-Host '4) Stop (safe)' -ForegroundColor Gray
    Write-Host '5) Stop (force)' -ForegroundColor Gray
    Write-Host '6) Start + Open Browser' -ForegroundColor Gray
    Write-Host '7) Start Fast + Open Browser' -ForegroundColor Gray
    Write-Host '0) Exit' -ForegroundColor Gray
    Write-Host ''
}

function Execute-Action {
    param([string]$SelectedAction)

    switch ($SelectedAction) {
        'start' {
            & $startScript
        }
        'start-fast' {
            & $startScript -SkipBackendBuild -SkipFrontendInstall
        }
        'start-open' {
            & $startScript
            Start-Sleep -Seconds 2
            Start-Process 'http://localhost:4200'
        }
        'start-fast-open' {
            & $startScript -SkipBackendBuild -SkipFrontendInstall
            Start-Sleep -Seconds 2
            Start-Process 'http://localhost:4200'
        }
        'status' {
            & $statusScript
        }
        'stop' {
            & $stopScript
        }
        'stop-force' {
            & $stopScript -ForceAll
        }
        default {
            throw "Accion no soportada: $SelectedAction"
        }
    }
}

if ($Action -ne 'menu') {
    Execute-Action -SelectedAction $Action
    exit 0
}

while ($true) {
    Show-Header
    $choice = Read-Host 'Selecciona una opcion'

    switch ($choice) {
        '1' { Execute-Action -SelectedAction 'start' }
        '2' { Execute-Action -SelectedAction 'start-fast' }
        '3' { Execute-Action -SelectedAction 'status' }
        '4' { Execute-Action -SelectedAction 'stop' }
        '5' { Execute-Action -SelectedAction 'stop-force' }
        '6' { Execute-Action -SelectedAction 'start-open' }
        '7' { Execute-Action -SelectedAction 'start-fast-open' }
        '0' {
            Write-Host 'Saliendo...' -ForegroundColor DarkGray
            break
        }
        default {
            Write-Host 'Opcion invalida. Intenta de nuevo.' -ForegroundColor Yellow
        }
    }

    Write-Host ''
    Read-Host 'Presiona Enter para volver al menu' | Out-Null
}
