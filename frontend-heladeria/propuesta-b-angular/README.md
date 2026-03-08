# Propuesta B -> Angular + Bootstrap

Esta carpeta contiene una conversion funcional de la plantilla `propuesta-b` (Next.js/React) a Angular (TypeScript + HTML + SCSS + Bootstrap), manteniendo:

- Flujo de carrito (agregar, aumentar, disminuir, eliminar, vaciar)
- Pago en efectivo/tarjeta
- Ticket modal con impresion
- Metricas del dia y ultimas ventas
- Toasts temporales
- Busqueda y filtros por categoria
- Animaciones de entrada/salida visual

## Integracion rapida en tu proyecto Angular

1. Copia `src/app/tpv` a tu proyecto Angular real (por ejemplo `src/app/features/tpv`).
2. Copia `src/styles/tpv-theme.scss` y agregalo en `angular.json` dentro de `styles`.
3. Asegura Bootstrap y Bootstrap Icons:

```bash
npm install bootstrap bootstrap-icons
```

4. En `angular.json` incluye tambien:

```json
"styles": [
  "src/styles.scss",
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css",
  "src/styles/tpv-theme.scss"
]
```

5. Usa el componente raiz del TPV en tu routing o en una pagina:

```ts
import { TpvPageComponent } from './tpv/tpv-page.component';
```

```html
<app-tpv-page></app-tpv-page>
```

## Notas

- El estado se maneja en `tpv-page.component.ts` como en el `page.tsx` original.
- `timestamp` se conserva como `Date` para formateo de hora/fecha igual al original.
- Las clases y paleta se replican con variables CSS + utilidades propias.
