# Backend Heladeria — Desarrollo (dev)

Instrucciones rápidas para levantar el backend en modo desarrollo (H2 + mocks).

Requisitos:
- Java 17 instalado (se usó Microsoft OpenJDK 17 en desarrollo).
- `mvnw.cmd` presente en la raíz del proyecto.

Construir (desde `backend-heladeria`):

```powershell
C:\Windows\Temp\build_backend.bat
# o desde el repo:
.\mvnw.cmd -DskipTests clean package
```

Ejecutar en modo `dev` (usa el perfil `dev` que activa H2 en memoria):

```powershell
# script creado en dev: C:\Windows\Temp\run_backend_dev.bat
C:\Windows\Temp\run_backend_dev.bat
# o directamente
java -jar target/backend-heladeria-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

Endpoints útiles (mocks para frontend):

- GET http://localhost:8080/api/mock/productos
- GET http://localhost:8080/api/mock/inventario
- GET http://localhost:8080/api/mock/ventas/recent

WebSocket (STOMP + SockJS):
- Endpoint SockJS: ws://localhost:8080/ws-ventas (prefijo STOMP: `/app` y broker `/topic`)

Importar colección Postman:
- Archivo: `postman/backend-mocks.postman_collection.json`

OpenAPI:
- Archivo: `src/main/resources/openapi.yaml`
