# Guía rápida de arranque (Equipo)

Esta guía resume cómo iniciar el sistema en entorno de desarrollo en **Windows + PowerShell**.

## 1) Ubicación del proyecto

Abrir PowerShell en:

`C:\Users\WinterOS\Desktop\noc\Yelados\PROYECTOHELADOS`

## 2) Permiso temporal para scripts (si aplica)

Si PowerShell bloquea `.ps1`, ejecutar una sola vez en la sesión actual:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## 3) Comando recomendado (inicio más rápido)

```powershell
.\dev.ps1 -Action start-fast-open
```

Este comando:
- inicia backend y frontend,
- omite build/install para acelerar,
- abre automáticamente `http://localhost:4200`.

## 4) Comandos disponibles

### Menú interactivo

```powershell
.\dev.ps1
```

### Acciones directas

```powershell
.\dev.ps1 -Action start
.\dev.ps1 -Action start-fast
.\dev.ps1 -Action start-open
.\dev.ps1 -Action start-fast-open
.\dev.ps1 -Action status
.\dev.ps1 -Action stop
.\dev.ps1 -Action stop-force
```

## 5) Scripts individuales

```powershell
.\start-dev.ps1
.\start-dev.ps1 -SkipBackendBuild -SkipFrontendInstall
.\status-dev.ps1
.\stop-dev.ps1
.\stop-dev.ps1 -ForceAll
```

## 6) Endpoints de referencia

### Frontend
- `http://localhost:4200`

### Backend (mocks)
- `http://localhost:8080/api/mock/productos`
- `http://localhost:8080/api/mock/inventario`
- `http://localhost:8080/api/mock/ventas/recent`

### H2 Console (perfil dev)
- `http://localhost:8080/h2-console`

## 7) Notas importantes

- El perfil `dev` del backend está configurado para **H2 en memoria** (`application-dev.properties`).
- `stop` es modo seguro (intenta cerrar procesos del proyecto).
- `stop-force` es más agresivo y solo debe usarse si hay procesos colgados.
- Si algo falla, ejecutar:

```powershell
.\dev.ps1 -Action stop
.\dev.ps1 -Action start-fast-open
.\dev.ps1 -Action status
```
