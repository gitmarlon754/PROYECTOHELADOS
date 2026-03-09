param(
    [switch]$SkipBackendBuild,
    [switch]$SkipFrontendInstall
)

$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$backendPath = Join-Path $projectRoot 'backend-heladeria'
$frontendPath = Join-Path $projectRoot 'frontend-heladeria'

$skipBackendBuildValue = if ($SkipBackendBuild.IsPresent) { 'true' } else { 'false' }
$skipFrontendInstallValue = if ($SkipFrontendInstall.IsPresent) { 'true' } else { 'false' }

if (-not (Test-Path $backendPath)) {
    throw "No se encontró la carpeta backend: $backendPath"
}

if (-not (Test-Path $frontendPath)) {
    throw "No se encontró la carpeta frontend: $frontendPath"
}

$backendCmd = @"
Set-Location '$backendPath'
Write-Host '== Backend: build + run (perfil dev) ==' -ForegroundColor Cyan
`$skipBuild = [System.Convert]::ToBoolean('$skipBackendBuildValue')
Write-Host ('SkipBackendBuild: ' + `$skipBuild) -ForegroundColor DarkGray
if (-not `$skipBuild) {
    .\mvnw.cmd -DskipTests clean compile
    if (`$LASTEXITCODE -ne 0) { Write-Host 'Falló la compilación del backend' -ForegroundColor Red; exit `$LASTEXITCODE }
} else {
    Write-Host 'Build backend omitido (-SkipBackendBuild). Se arrancará con spring-boot:run.' -ForegroundColor DarkYellow
}

Write-Host 'SPRING_PROFILES_ACTIVE: dev (forzado via Maven args)' -ForegroundColor DarkGray
.\mvnw.cmd --% -DskipTests spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=dev
"@

$frontendCmd = @"
Set-Location '$frontendPath'
Write-Host '== Frontend: npm install + npm start ==' -ForegroundColor Green
`$skipInstall = [System.Convert]::ToBoolean('$skipFrontendInstallValue')
Write-Host ('SkipFrontendInstall: ' + `$skipInstall) -ForegroundColor DarkGray
if ((-not `$skipInstall) -and (-not (Test-Path (Join-Path '$frontendPath' 'node_modules')))) {
    npm install
    if (`$LASTEXITCODE -ne 0) { Write-Host 'Falló npm install' -ForegroundColor Red; exit `$LASTEXITCODE }
} elseif (`$skipInstall) {
    Write-Host 'npm install omitido (-SkipFrontendInstall).' -ForegroundColor DarkYellow
}
npm start
"@

$backendCmdEncoded = [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes($backendCmd))
$frontendCmdEncoded = [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes($frontendCmd))

Start-Process powershell -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', $backendCmdEncoded)
Start-Process powershell -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', $frontendCmdEncoded)

Write-Host 'Se abrieron 2 ventanas: backend (8080) y frontend (4200).' -ForegroundColor Yellow
Write-Host 'Si el navegador no abre solo: http://localhost:4200' -ForegroundColor Yellow
Write-Host 'Modo rápido: .\start-dev.ps1 -SkipBackendBuild -SkipFrontendInstall' -ForegroundColor DarkGray
