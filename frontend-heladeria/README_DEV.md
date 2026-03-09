# Frontend Heladeria — Desarrollo (dev)

Pautas rápidas para desarrollar el frontend usando los mocks del backend local.

1) Asegúrate de levantar el backend en modo `dev` (ver `backend-heladeria/README_DEV.md`).

2) Configuración de la aplicación
- `app.config.ts` exporta `API_BASE` y `WS_FULL_URL`. Por defecto apuntan a `http://localhost:8080` y `ws://localhost:8080/ws-ventas`.
- Si quieres sobreescribir en runtime, añade variables globales antes de cargar la app:

```html
<script>
  window.__API_BASE__ = 'http://localhost:8080';
  window.__WS_SOCKJS_ENDPOINT__ = '/ws-ventas';
</script>
```

3) Comandos habituales (desde `frontend-heladeria`):

```bash
# instalar (si aún no lo hiciste)
npm install

# levantar con Angular dev server
npm start
```

4) Pruebas manuales rápidas
- Abrir: `http://localhost:4200` (frontend)
- Comprobar endpoints del backend:
  - GET http://localhost:8080/api/mock/productos
  - GET http://localhost:8080/api/mock/inventario
  - GET http://localhost:8080/api/mock/ventas/recent
