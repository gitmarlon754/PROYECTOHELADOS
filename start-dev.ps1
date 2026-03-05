param(
    [switch]$SkipBackendBuild,
    [switch]$SkipFrontendInstall
)

$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$backendPath = Join-Path $projectRoot 'backend-heladeria'
$frontendPath = Join-Path $projectRoot 'frontend-heladeria'
$backendJar = Join-Path $backendPath 'target/backend-heladeria-0.0.1-SNAPSHOT.jar'

$skipBackendBuildValue = if ($SkipBackendBuild.IsPresent) { '$true' } else { '$false' }
$skipFrontendInstallValue = if ($SkipFrontendInstall.IsPresent) { '$true' } else { '$false' }

if (-not (Test-Path $backendPath)) {
    throw "No se encontró la carpeta backend: $backendPath"
}

if (-not (Test-Path $frontendPath)) {
    throw "No se encontró la carpeta frontend: $frontendPath"
}

$backendCmd = @"
Set-Location '$backendPath'
Write-Host '== Backend: build + run (perfil dev) ==' -ForegroundColor Cyan
`$skipBuild = $skipBackendBuildValue
if (-not `$skipBuild) {
    .\mvnw.cmd -DskipTests clean package
    if (`$LASTEXITCODE -ne 0) { Write-Host 'Falló el build del backend' -ForegroundColor Red; exit `$LASTEXITCODE }
} else {
    Write-Host 'Build backend omitido (-SkipBackendBuild).' -ForegroundColor DarkYellow
}

if (-not (Test-Path '$backendJar')) {
    Write-Host 'No se encontró el jar del backend. Quita -SkipBackendBuild o revisa el build.' -ForegroundColor Red
    exit 1
}

java -jar '$backendJar' --spring.profiles.active=dev
"@

$frontendCmd = @"
Set-Location '$frontendPath'
Write-Host '== Frontend: npm install + npm start ==' -ForegroundColor Green
`$skipInstall = $skipFrontendInstallValue
if ((-not `$skipInstall) -and (-not (Test-Path (Join-Path '$frontendPath' 'node_modules')))) {
    npm install
    if (`$LASTEXITCODE -ne 0) { Write-Host 'Falló npm install' -ForegroundColor Red; exit `$LASTEXITCODE }
} elseif (`$skipInstall) {
    Write-Host 'npm install omitido (-SkipFrontendInstall).' -ForegroundColor DarkYellow
}
npm start
"@

Start-Process powershell -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $backendCmd)
Start-Process powershell -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $frontendCmd)

Write-Host 'Se abrieron 2 ventanas: backend (8080) y frontend (4200).' -ForegroundColor Yellow
Write-Host 'Si el navegador no abre solo: http://localhost:4200' -ForegroundColor Yellow
Write-Host 'Modo rápido: .\start-dev.ps1 -SkipBackendBuild -SkipFrontendInstall' -ForegroundColor DarkGray
