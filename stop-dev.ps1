param(
    [switch]$ForceAll
)

$ErrorActionPreference = 'SilentlyContinue'

$projectRoot = $PSScriptRoot
$backendPath = Join-Path $projectRoot 'backend-heladeria'
$frontendPath = Join-Path $projectRoot 'frontend-heladeria'

function Get-ProcessCommandLine {
    param([int]$ProcessId)

    $proc = Get-CimInstance Win32_Process -Filter "ProcessId = $ProcessId" -ErrorAction SilentlyContinue
    if ($null -eq $proc) {
        return ''
    }

    return [string]$proc.CommandLine
}

function Is-ProjectProcess {
    param(
        [int]$ProcessId,
        [string]$ProcessName
    )

    if ($ForceAll) {
        return $true
    }

    $cmdLine = Get-ProcessCommandLine -ProcessId $ProcessId
    if ([string]::IsNullOrWhiteSpace($cmdLine)) {
        return $false
    }

    $matchers = @(
        [regex]::Escape($projectRoot),
        [regex]::Escape($backendPath),
        [regex]::Escape($frontendPath),
        'backend-heladeria-0\.0\.1-SNAPSHOT\.jar',
        'spring\.profiles\.active=dev',
        'ng serve',
        'npm start'
    )

    foreach ($pattern in $matchers) {
        if ($cmdLine -match $pattern) {
            return $true
        }
    }

    return $false
}

Write-Host 'Deteniendo procesos de desarrollo (backend/frontend)...' -ForegroundColor Yellow
if (-not $ForceAll) {
    Write-Host 'Modo seguro activo: solo se detienen procesos asociados a esta carpeta del proyecto.' -ForegroundColor DarkYellow
} else {
    Write-Host 'Modo forzado: se detienen todos los procesos detectados en puertos y limpieza extra.' -ForegroundColor DarkYellow
}

$ports = @(8080, 4200)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($connections) {
        $processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($processId in $processIds) {
            try {
                $proc = Get-Process -Id $processId -ErrorAction Stop
                if (Is-ProjectProcess -ProcessId $processId -ProcessName $proc.ProcessName) {
                    Stop-Process -Id $processId -Force -ErrorAction Stop
                    Write-Host "OK puerto $port -> detenido PID $processId ($($proc.ProcessName))" -ForegroundColor Green
                } else {
                    Write-Host "SKIP puerto $port -> PID $processId ($($proc.ProcessName)) no parece de este proyecto" -ForegroundColor DarkGray
                }
            } catch {
                Write-Host "No se pudo detener PID $processId en puerto $port" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "Sin proceso escuchando en puerto $port" -ForegroundColor DarkGray
    }
}

$extraNames = @('node', 'java')
foreach ($name in $extraNames) {
    $procs = Get-Process -Name $name -ErrorAction SilentlyContinue
    foreach ($p in $procs) {
        if (Is-ProjectProcess -ProcessId $p.Id -ProcessName $p.ProcessName) {
            try {
                Stop-Process -Id $p.Id -Force -ErrorAction Stop
                Write-Host "OK proceso detenido: $($p.ProcessName) PID $($p.Id)" -ForegroundColor Cyan
            } catch {}
        }
    }
}

Write-Host 'Listo. Si había ventanas abiertas, puedes cerrarlas manualmente.' -ForegroundColor Yellow
Write-Host 'Tip: usa -ForceAll solo si necesitas limpiar procesos atascados fuera del proyecto.' -ForegroundColor DarkGray
