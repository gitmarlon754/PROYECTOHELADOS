import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ProductoService, VentaRecienteItem, VentaDetalleItem, StockInputRequest } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

interface ProductoCatalogoVM {
    id: number;
    nombre: string;
    precio: number;
    categoria: string;
    stock: number;
}

interface CarritoItem {
    productoId: number;
    nombre: string;
    precio: number;
    cantidad: number;
    stockDisponible: number;
}

interface TicketVenta {
    id: number;
    fecha: string;
    metodoPago: MetodoPago;
    items: Array<{
        nombre: string;
        cantidad: number;
        precio: number;
        subtotal: number;
    }>;
    total: number;
}

interface VentaRecienteVM {
    id: number;
    total: number;
    fecha: string;
    metodoPago: MetodoPago | 'unknown';
    cantidadItems: number;
    items: Array<{ productoId: number; cantidad: number }>;
}

interface StockFormItem {
    productoId: number;
    nombre: string;
    categoria: string;
    precio: number;
    cantidad: number;
}

interface NuevoProductoForm {
    nombre: string;
    categoria: string;
    precio: number;
    stockInicial: number;
}

interface RegistroJornada {
    fechaCierre: string;
    totalVentas: number;
    cantidadVentas: number;
    totalEfectivo: number;
    totalNequi: number;
    itemsVendidos: number;
}

type EstadoMensaje = 'success' | 'warning' | 'error' | 'info';
type MetodoPago = 'cash' | 'card';
type JornadaEventoTipo = 'apertura' | 'cierre';

@Component({
    selector: 'app-productos',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './productos.component.html',
    styleUrl: './productos.component.css'
    })
    export class ProductosComponent implements OnInit, OnDestroy {

        productos: ProductoCatalogoVM[] = [];
        carrito: CarritoItem[] = [];
        ventasRecientes: VentaRecienteVM[] = [];
        terminoBusqueda = '';
        categoriaSeleccionada = 'Todas';
        loading = true;
        errorMsg = '';
        ventaMsg = '';
        ventaMsgTipo: EstadoMensaje = 'info';
        procesandoPago = false;
        modoVentasMock = false;
        ultimaSincronizacion = '';
        ultimoTicket: TicketVenta | null = null;
        mostrarMetricas = false;
        toastMsg = '';
        toastTipo: EstadoMensaje = 'info';
        private toastTimer: ReturnType<typeof setTimeout> | null = null;
        mostrarModalEventoJornada = false;
        jornadaEventoTitulo = '';
        jornadaEventoMensaje = '';
        jornadaEventoTipo: JornadaEventoTipo = 'apertura';
        jornadaEventoResumen: RegistroJornada | null = null;
        private jornadaEventoTimer: ReturnType<typeof setTimeout> | null = null;
        jornadaAbierta = true;
        sobrantesDisponibles = false;
        mostrarModalApertura = false;
        mostrarModalReposicion = false;
        mostrarModalSobrantes = false;
        mostrarModalSinStock = false;
        mostrarRegistros = false;
        usarSobrantes = true;
        jornadaInicioActual: Date | null = null;
        stockAperturaForm: StockFormItem[] = [];
        stockReposicionForm: StockFormItem[] = [];
        registrosJornadas: RegistroJornada[] = [];
        mostrarModalNuevoProducto = false;
        nuevoProductoForm: NuevoProductoForm = {
            nombre: '',
            categoria: 'Helado - Cono',
            precio: 0,
            stockInicial: 0
        };
        categoriasProducto = [
            'Helado - Cono',
            'Helado - Tarrina',
            'Helado - Copa',
            'Extra',
            'Topping'
        ];
        private readonly registrosKey = 'tpv_registros_jornadas';

    constructor(
        private productoService: ProductoService
    ) {}

    ngOnInit(): void {
        this.cargarRegistrosJornadas();
        this.cargarCatalogo();
    }

    ngOnDestroy(): void {
        if (this.toastTimer) {
            clearTimeout(this.toastTimer);
            this.toastTimer = null;
        }

        if (this.jornadaEventoTimer) {
            clearTimeout(this.jornadaEventoTimer);
            this.jornadaEventoTimer = null;
        }
    }

    cargarCatalogo(): void {
        this.loading = true;
        this.errorMsg = '';
        this.modoVentasMock = false;

        forkJoin({
            productos: this.productoService.getProductos(),
            inventario: this.productoService.getStockDiario().pipe(
                catchError(() => this.productoService.getInventario())
            ),
            estadoJornada: this.productoService.getJornadaEstado().pipe(
                catchError(() => of({
                    jornadaAbierta: true,
                    sobrantesDisponibles: false,
                    fecha: new Date().toISOString(),
                    productosAgotados: 0,
                    inicioJornada: null
                }))
            ),
            ventasRecientes: this.productoService.getVentas().pipe(
                catchError(() => {
                    this.modoVentasMock = true;
                    return this.productoService.getVentasRecent();
                })
            )
        }).pipe(
            catchError(() => {
                this.errorMsg = 'No se pudo sincronizar el panel. Verifica que backend esté activo en puerto 8080 y vuelve a intentar.';
                return of({
                    productos: [],
                    inventario: [],
                    estadoJornada: {
                        jornadaAbierta: true,
                        sobrantesDisponibles: false,
                        fecha: new Date().toISOString(),
                        productosAgotados: 0,
                        inicioJornada: null
                    },
                    ventasRecientes: []
                });
            }),
            finalize(() => {
                this.loading = false;
            })
        ).subscribe(({ productos, inventario, estadoJornada, ventasRecientes }) => {
            const stockPorProducto = new Map<number, number>();

            inventario.forEach(item => {
                const stockActual = stockPorProducto.get(item.productoId) ?? 0;
                stockPorProducto.set(item.productoId, stockActual + item.stock);
            });

            const productosBase = productos
                .map((producto: Producto) => ({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    categoria: producto.categoria ?? 'Sin categoría',
                    stock: stockPorProducto.get(producto.id) ?? 0
                }))
                .filter(producto => !this.esCategoriaBebida(producto.categoria))
                .sort((a, b) => a.nombre.localeCompare(b.nombre));

            this.jornadaAbierta = estadoJornada.jornadaAbierta;
            this.sobrantesDisponibles = estadoJornada.sobrantesDisponibles;
            this.usarSobrantes = estadoJornada.sobrantesDisponibles;
            this.jornadaInicioActual = estadoJornada.inicioJornada ? new Date(estadoJornada.inicioJornada) : null;

            const ventasNormalizadas = this.normalizarVentas(ventasRecientes);
            this.ventasRecientes = this.filtrarVentasPorJornadaActual(ventasNormalizadas);
            this.productos = this.aplicarVentasDelDiaAlStock(productosBase, this.ventasRecientes);
            this.verificarModalSinStockTotal();
            this.actualizarSincronizacion();
        });
    }

    refrescarPanel(): void {
        if (this.loading || this.procesandoPago) {
            this.setVentaMsg('No se puede actualizar mientras hay una operación en curso.', 'info');
            return;
        }

        this.limpiarMensaje();
        this.cargarCatalogo();
    }

    private prepararFormularioStock(): void {
        this.stockAperturaForm = this.productos.map(producto => ({
            productoId: producto.id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: producto.precio,
            cantidad: 0
        }));
    }

    abrirModalAperturaJornada(): void {
        if (this.jornadaAbierta) {
            this.setVentaMsg('La jornada actual sigue abierta.', 'info');
            return;
        }

        this.prepararFormularioStock();
        this.usarSobrantes = this.sobrantesDisponibles;
        this.mostrarModalApertura = true;
    }

    abrirModalSobrantes(): void {
        this.mostrarModalSobrantes = true;
    }

    cerrarModalSobrantes(): void {
        this.mostrarModalSobrantes = false;
    }

    cerrarModalSinStock(): void {
        this.mostrarModalSinStock = false;
    }

    abrirModalReposicion(): void {
        this.stockReposicionForm = this.productos.map(producto => ({
            productoId: producto.id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: producto.precio,
            cantidad: 0
        }));
        this.mostrarModalReposicion = true;
    }

    cerrarModalReposicion(): void {
        this.mostrarModalReposicion = false;
    }

    confirmarAperturaJornada(): void {
        const stocks = this.stockAperturaForm
            .filter(item => item.cantidad > 0)
            .map(item => this.mapStockFormToRequest(item));

        this.productoService.abrirJornada(this.usarSobrantes, stocks).subscribe({
            next: () => {
                this.mostrarModalApertura = false;
                this.jornadaAbierta = true;
                this.jornadaInicioActual = new Date();
                this.setVentaMsg('Nueva jornada iniciada correctamente.', 'success');
                this.mostrarEventoJornada(
                    'Jornada Iniciada',
                    'La nueva jornada se abrió correctamente. Ya puedes registrar ventas.',
                    'apertura',
                    null
                );
                this.cargarCatalogo();
            },
            error: () => {
                this.setVentaMsg('No se pudo abrir la jornada. Intenta nuevamente.', 'error');
            }
        });
    }

    cerrarJornadaDelDia(): void {
        if (!this.jornadaAbierta) {
            this.setVentaMsg('No hay jornada abierta para cerrar.', 'info');
            return;
        }

        const resumenCierre = this.guardarRegistroCierreJornada();

        this.productoService.cerrarJornada(false).subscribe({
            next: () => {
                this.jornadaAbierta = false;
                this.jornadaInicioActual = null;
                this.ventasRecientes = [];
                this.setVentaMsg('Ventas del día finalizadas. Cuando quieras, abre una nueva jornada.', 'success');
                this.mostrarEventoJornada(
                    'Jornada Cerrada',
                    'Se finalizaron las ventas del día. Usa "Nueva jornada" cuando quieras continuar.',
                    'cierre',
                    resumenCierre
                );
                this.cargarCatalogo();
            },
            error: () => {
                this.setVentaMsg('No se pudo cerrar la jornada.', 'error');
            }
        });
    }

    cerrarModalEventoJornada(): void {
        if (this.jornadaEventoTimer) {
            clearTimeout(this.jornadaEventoTimer);
            this.jornadaEventoTimer = null;
        }
        this.jornadaEventoResumen = null;
        this.mostrarModalEventoJornada = false;
    }

    private mostrarEventoJornada(titulo: string, mensaje: string, tipo: JornadaEventoTipo, resumen: RegistroJornada | null): void {
        this.jornadaEventoTitulo = titulo;
        this.jornadaEventoMensaje = mensaje;
        this.jornadaEventoTipo = tipo;
        this.jornadaEventoResumen = resumen;
        this.mostrarModalEventoJornada = true;

        if (this.jornadaEventoTimer) {
            clearTimeout(this.jornadaEventoTimer);
        }

        this.jornadaEventoTimer = setTimeout(() => {
            this.mostrarModalEventoJornada = false;
            this.jornadaEventoResumen = null;
            this.jornadaEventoTimer = null;
        }, 3500);
    }

    aplicarReposicionStock(): void {
        const stocks = this.stockReposicionForm
            .filter(item => item.cantidad > 0)
            .map(item => this.mapStockFormToRequest(item));

        if (stocks.length === 0) {
            this.setVentaMsg('Ingresa al menos una reposición de stock.', 'warning');
            return;
        }

        this.productoService.reponerStock(stocks).subscribe({
            next: () => {
                this.mostrarModalReposicion = false;
                this.setVentaMsg('Stock repuesto correctamente.', 'success');
                this.cargarCatalogo();
            },
            error: () => {
                this.setVentaMsg('No se pudo reponer stock.', 'error');
            }
        });
    }

    alternarRegistros(): void {
        this.mostrarRegistros = !this.mostrarRegistros;
    }

    abrirModalNuevoProducto(): void {
        this.nuevoProductoForm = {
            nombre: '',
            categoria: 'Helado - Cono',
            precio: 0,
            stockInicial: 0
        };
        this.mostrarModalNuevoProducto = true;
    }

    cerrarModalNuevoProducto(): void {
        this.mostrarModalNuevoProducto = false;
    }

    crearNuevoProducto(): void {
        if (!this.nuevoProductoForm.nombre.trim()) {
            this.setVentaMsg('El nombre del producto es obligatorio.', 'warning');
            return;
        }

        if (this.nuevoProductoForm.precio <= 0) {
            this.setVentaMsg('El precio debe ser mayor a 0.', 'warning');
            return;
        }

        if (this.nuevoProductoForm.stockInicial < 0 || this.nuevoProductoForm.stockInicial > 100) {
            this.setVentaMsg('El stock inicial debe estar entre 0 y 100.', 'warning');
            return;
        }

        // Por ahora simular la creación ya que el backend no tiene endpoint para crear productos
        const nuevoId = Math.max(...this.productos.map(p => p.id), 0) + 1;
        
        const nuevoProducto: ProductoCatalogoVM = {
            id: nuevoId,
            nombre: this.nuevoProductoForm.nombre.trim(),
            categoria: this.nuevoProductoForm.categoria,
            precio: this.nuevoProductoForm.precio,
            stock: this.nuevoProductoForm.stockInicial
        };

        this.productos.push(nuevoProducto);
        this.productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        this.verificarModalSinStockTotal();
        
        this.mostrarToast(`Producto "${nuevoProducto.nombre}" creado correctamente.`, 'success');
        this.cerrarModalNuevoProducto();
    }

    private mapStockFormToRequest(item: StockFormItem): StockInputRequest {
        return {
            productoId: item.productoId,
            nombre: item.nombre,
            categoria: item.categoria,
            precio: item.precio,
            cantidad: Math.max(0, Math.min(100, Number(item.cantidad ?? 0)))
        };
    }

    agregarAlCarrito(producto: ProductoCatalogoVM): void {
        this.limpiarMensaje();
        this.ultimoTicket = null;
        const item = this.carrito.find(c => c.productoId === producto.id);

        if (item) {
            if (item.cantidad < item.stockDisponible) {
                item.cantidad += 1;
                this.mostrarToast(`${producto.nombre} agregado al carrito.`, 'success');
            } else {
                this.setVentaMsg('Ya alcanzaste el stock disponible de este producto.', 'warning');
            }
            return;
        }

        if (producto.stock <= 0) {
            this.setVentaMsg('Este producto no tiene stock disponible.', 'warning');
            return;
        }

        this.carrito.push({
            productoId: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
            stockDisponible: producto.stock
        });
        this.mostrarToast(`${producto.nombre} agregado al carrito.`, 'success');
    }

    incrementarCantidad(item: CarritoItem): void {
        this.limpiarMensaje();
        this.ultimoTicket = null;
        if (item.cantidad < item.stockDisponible) {
            item.cantidad += 1;
            return;
        }

        this.setVentaMsg('No puedes superar el stock disponible.', 'warning');
    }

    decrementarCantidad(item: CarritoItem): void {
        this.limpiarMensaje();
        this.ultimoTicket = null;
        if (item.cantidad > 1) {
            item.cantidad -= 1;
            return;
        }

        this.eliminarDelCarrito(item.productoId);
    }

    eliminarDelCarrito(productoId: number): void {
        this.limpiarMensaje();
        this.ultimoTicket = null;
        this.carrito = this.carrito.filter(item => item.productoId !== productoId);
    }

    vaciarCarrito(): void {
        if (this.carrito.length === 0) {
            this.setVentaMsg('El carrito ya está vacío.', 'info');
            return;
        }

        this.limpiarMensaje();
        this.ultimoTicket = null;
        this.carrito = [];
    }

    confirmarVentaDemo(metodoPago: MetodoPago): void {
        if (this.carrito.length === 0) {
            this.setVentaMsg('Agrega al menos un producto antes de pagar.', 'warning');
            return;
        }

        if (this.procesandoPago) {
            this.setVentaMsg('Ya se está procesando una venta. Espera unos segundos.', 'info');
            return;
        }

        if (this.totalVenta <= 0) {
            this.setVentaMsg('No se puede registrar una venta con total 0.', 'error');
            return;
        }

        this.procesandoPago = true;
        this.limpiarMensaje();
        this.ultimoTicket = null;

        const carritoActual = this.carrito.map(item => ({ ...item }));
        const totalCantidadActual = this.totalCantidad;
        const totalVentaActual = this.totalVenta;

        const itemsRequest: VentaDetalleItem[] = carritoActual.map(item => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.precio
        }));

        this.productoService.registrarVenta({
            total: totalVentaActual,
            metodoPago,
            items: itemsRequest
        }).pipe(
            finalize(() => {
                this.procesandoPago = false;
            })
        ).subscribe({
            next: venta => {
                const itemsTicket = carritoActual.map(item => ({
                    nombre: item.nombre,
                    cantidad: item.cantidad,
                    precio: item.precio,
                    subtotal: item.cantidad * item.precio
                }));

                this.ultimoTicket = {
                    id: venta.id ?? Date.now(),
                    fecha: venta.fecha ?? new Date().toISOString(),
                    metodoPago,
                    items: itemsTicket,
                    total: totalVentaActual
                };

                const cantidadPorProducto = new Map<number, number>();
                carritoActual.forEach(item => {
                    cantidadPorProducto.set(item.productoId, item.cantidad);
                });

                this.productos = this.productos.map(producto => {
                    const vendido = cantidadPorProducto.get(producto.id) ?? 0;
                    return {
                        ...producto,
                        stock: Math.max(0, producto.stock - vendido)
                    };
                });
                this.verificarModalSinStockTotal();

                this.agregarVentaReciente({
                    id: venta.id ?? Date.now(),
                    total: venta.total ?? totalVentaActual,
                    fecha: venta.fecha ?? new Date().toISOString(),
                    metodoPago,
                    cantidadItems: totalCantidadActual,
                    items: itemsRequest.map(item => ({
                        productoId: item.productoId,
                        cantidad: item.cantidad
                    }))
                });
                this.modoVentasMock = false;
                this.actualizarSincronizacion();

                const metodoLabel = metodoPago === 'card' ? 'nequi' : 'efectivo';
                this.setVentaMsg(`Venta registrada por ${totalCantidadActual} ítems (${metodoLabel}). Total: ${totalVentaActual.toFixed(2)}`, 'success');
                this.carrito = [];
            },
            error: () => {
                this.setVentaMsg('No se pudo registrar la venta. Revisa la conexión con backend (puerto 8080) e intenta nuevamente.', 'error');
            }
        });
    }

    cerrarTicket(): void {
        this.ultimoTicket = null;
    }

    private normalizarVentas(ventas: Array<VentaRecienteItem | VentaRecienteVM>): VentaRecienteVM[] {
        return ventas
            .map((venta: VentaRecienteItem | VentaRecienteVM) => {
                const metodoPago = (venta as Partial<VentaRecienteVM>).metodoPago;
                const metodoNormalizado: MetodoPago | 'unknown' = metodoPago === 'card' || metodoPago === 'cash'
                    ? metodoPago
                    : 'unknown';

                const detallesRaw = (venta as VentaRecienteItem).detalles;
                const itemsDirectos = (venta as Partial<VentaRecienteVM>).items;
                const itemsNormalizados = Array.isArray(itemsDirectos)
                    ? itemsDirectos
                    : Array.isArray(detallesRaw)
                        ? detallesRaw
                            .filter(detalle => ((detalle?.productoId ?? detalle?.producto?.id ?? 0) > 0) && (detalle?.cantidad ?? 0) > 0)
                            .map(detalle => ({
                                productoId: Number(detalle.productoId ?? detalle.producto?.id),
                                cantidad: Number(detalle.cantidad)
                            }))
                        : [];

                const cantidadItemsNormalizada = (venta as Partial<VentaRecienteVM>).cantidadItems
                    ?? itemsNormalizados.reduce((acc, item) => acc + item.cantidad, 0);

                return {
                id: venta.id,
                total: Number(venta.total ?? 0),
                fecha: venta.fecha ?? new Date().toISOString(),
                metodoPago: metodoNormalizado,
                cantidadItems: cantidadItemsNormalizada,
                items: itemsNormalizados
            };
            })
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
            .slice(0, 10);
    }

    private aplicarVentasDelDiaAlStock(productos: ProductoCatalogoVM[], ventas: VentaRecienteVM[]): ProductoCatalogoVM[] {
        const hoy = new Date();
        const vendidosPorProducto = new Map<number, number>();

        ventas
            .filter(venta => this.esMismaFecha(venta.fecha, hoy))
            .forEach(venta => {
                venta.items.forEach(item => {
                    const vendidoActual = vendidosPorProducto.get(item.productoId) ?? 0;
                    vendidosPorProducto.set(item.productoId, vendidoActual + item.cantidad);
                });
            });

        return productos.map(producto => {
            const vendido = vendidosPorProducto.get(producto.id) ?? 0;
            return {
                ...producto,
                stock: Math.max(0, producto.stock - vendido)
            };
        });
    }

    private filtrarVentasPorJornadaActual(ventas: VentaRecienteVM[]): VentaRecienteVM[] {
        if (!this.jornadaAbierta || !this.jornadaInicioActual) {
            return [];
        }

        const inicio = this.jornadaInicioActual.getTime();
        return ventas.filter(venta => new Date(venta.fecha).getTime() >= inicio);
    }

    private verificarModalSinStockTotal(): void {
        this.mostrarModalSinStock = !this.loading
            && !this.errorMsg
            && this.productos.length > 0
            && this.totalStock <= 0;
    }

    private guardarRegistroCierreJornada(): RegistroJornada {
        const registro: RegistroJornada = {
            fechaCierre: new Date().toISOString(),
            totalVentas: this.totalVentasRecientes,
            cantidadVentas: this.cantidadVentasRecientes,
            totalEfectivo: this.totalVentasEfectivo,
            totalNequi: this.totalVentasTarjeta,
            itemsVendidos: this.articulosVendidosHoy
        };

        this.registrosJornadas = [registro, ...this.registrosJornadas].slice(0, 30);
        this.guardarRegistrosJornadas();
        return registro;
    }

    private cargarRegistrosJornadas(): void {
        try {
            const raw = localStorage.getItem(this.registrosKey);
            if (!raw) {
                this.registrosJornadas = [];
                return;
            }

            const parsed = JSON.parse(raw) as RegistroJornada[];
            this.registrosJornadas = Array.isArray(parsed) ? parsed : [];
        } catch {
            this.registrosJornadas = [];
        }
    }

    private guardarRegistrosJornadas(): void {
        localStorage.setItem(this.registrosKey, JSON.stringify(this.registrosJornadas));
    }

    private esMismaFecha(fechaIso: string, fechaBase: Date): boolean {
        const fechaVenta = new Date(fechaIso);
        return fechaVenta.getFullYear() === fechaBase.getFullYear()
            && fechaVenta.getMonth() === fechaBase.getMonth()
            && fechaVenta.getDate() === fechaBase.getDate();
    }

    private agregarVentaReciente(venta: VentaRecienteVM): void {
        this.ventasRecientes = this.normalizarVentas([venta, ...this.ventasRecientes]);
    }

    private actualizarSincronizacion(): void {
        this.ultimaSincronizacion = new Date().toLocaleTimeString();
    }

    private setVentaMsg(mensaje: string, tipo: EstadoMensaje): void {
        this.ventaMsg = mensaje;
        this.ventaMsgTipo = tipo;
    }

    private mostrarToast(mensaje: string, tipo: EstadoMensaje): void {
        this.toastMsg = mensaje;
        this.toastTipo = tipo;

        if (this.toastTimer) {
            clearTimeout(this.toastTimer);
        }

        this.toastTimer = setTimeout(() => {
            this.toastMsg = '';
            this.toastTipo = 'info';
            this.toastTimer = null;
        }, 2500);
    }

    cerrarToast(): void {
        if (this.toastTimer) {
            clearTimeout(this.toastTimer);
            this.toastTimer = null;
        }

        this.toastMsg = '';
        this.toastTipo = 'info';
    }

    alternarMetricas(): void {
        this.mostrarMetricas = !this.mostrarMetricas;
    }

    private esCategoriaBebida(categoria: string): boolean {
        return categoria.toLowerCase().includes('bebida');
    }

    private limpiarMensaje(): void {
        this.ventaMsg = '';
        this.ventaMsgTipo = 'info';
    }

    get totalCantidad(): number {
        return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
    }

    get totalVenta(): number {
        return this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    }

    get subtotalVenta(): number {
        return this.totalVenta;
    }

    get ivaVenta(): number {
        return 0;
    }

    get totalConIva(): number {
        return this.subtotalVenta;
    }

    estaAgotado(productoId: number): boolean {
        const producto = this.productos.find(p => p.id === productoId);
        if (!producto) {
            return true;
        }

        const item = this.carrito.find(c => c.productoId === productoId);
        return (item?.cantidad ?? 0) >= producto.stock;
    }

    get totalProductos(): number {
        return this.productos.length;
    }

    get totalStock(): number {
        return this.productos.reduce((acc, producto) => acc + producto.stock, 0);
    }

    get categoriasDisponibles(): string[] {
        const categorias = this.productos.map(producto => producto.categoria);
        return ['Todas', ...Array.from(new Set(categorias)).sort((a, b) => a.localeCompare(b))];
    }

    get productosFiltrados(): ProductoCatalogoVM[] {
        const texto = this.terminoBusqueda.trim().toLowerCase();

        return this.productos.filter(producto => {
            const coincideCategoria = this.categoriaSeleccionada === 'Todas' || producto.categoria === this.categoriaSeleccionada;
            const coincideTexto = texto.length === 0 || producto.nombre.toLowerCase().includes(texto);

            return coincideCategoria && coincideTexto;
        });
    }

    get totalFiltrados(): number {
        return this.productosFiltrados.length;
    }

    actualizarBusqueda(valor: string): void {
        this.terminoBusqueda = valor;
    }

    actualizarCategoria(valor: string): void {
        this.categoriaSeleccionada = valor;
    }

    limpiarFiltros(): void {
        this.terminoBusqueda = '';
        this.categoriaSeleccionada = 'Todas';
    }

    get totalVentasRecientes(): number {
        return this.ventasRecientes.reduce((acc, venta) => acc + venta.total, 0);
    }

    get cantidadVentasRecientes(): number {
        return this.ventasRecientes.length;
    }

    get ventasEfectivoCount(): number {
        return this.ventasRecientes.filter(venta => venta.metodoPago === 'cash').length;
    }

    get ventasTarjetaCount(): number {
        return this.ventasRecientes.filter(venta => venta.metodoPago === 'card').length;
    }

    get totalVentasEfectivo(): number {
        return this.ventasRecientes
            .filter(venta => venta.metodoPago === 'cash')
            .reduce((acc, venta) => acc + venta.total, 0);
    }

    get totalVentasTarjeta(): number {
        return this.ventasRecientes
            .filter(venta => venta.metodoPago === 'card')
            .reduce((acc, venta) => acc + venta.total, 0);
    }

    get ticketPromedio(): number {
        if (this.cantidadVentasRecientes === 0) {
            return 0;
        }

        return this.totalVentasRecientes / this.cantidadVentasRecientes;
    }

    get articulosVendidosHoy(): number {
        return this.ventasRecientes.reduce((acc, venta) => acc + (venta.cantidadItems ?? 0), 0);
    }

    get chartNequiPct(): number {
        if (this.totalVentasRecientes <= 0) {
            return 0;
        }

        return (this.totalVentasTarjeta / this.totalVentasRecientes) * 100;
    }

    get chartEfectivoPct(): number {
        if (this.totalVentasRecientes <= 0) {
            return 0;
        }

        return (this.totalVentasEfectivo / this.totalVentasRecientes) * 100;
    }

    get chartDayProgressPct(): number {
        const metaDia = 120;
        return Math.min(100, (this.totalVentasRecientes / metaDia) * 100);
    }

    get hayAgotados(): boolean {
        return this.productos.some(producto => producto.stock <= 0);
    }

    get totalAgotados(): number {
        return this.productos.filter(producto => producto.stock <= 0).length;
    }

    get productosSobrantes(): ProductoCatalogoVM[] {
        return this.productos
            .filter(producto => producto.stock > 0)
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    get horaActual(): string {
        return new Date().toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    categoriaClase(categoria: string): string {
        const key = this.categoriaKey(categoria);

        if (key.includes('cono')) {
            return 'product-cono';
        }
        if (key.includes('tarrina')) {
            return 'product-tarrina';
        }
        if (key.includes('copa')) {
            return 'product-copa';
        }
        if (key.includes('extra')) {
            return 'product-especial';
        }
        if (key.includes('topping')) {
            return 'product-especial';
        }

        return 'product-default';
    }

    categoriaIcono(categoria: string): string {
        const key = this.categoriaKey(categoria);

        if (key.includes('cono')) {
            return 'bi bi-cone-striped';
        }
        if (key.includes('tarrina')) {
            return 'bi bi-cup-straw';
        }
        if (key.includes('copa')) {
            return 'bi bi-cup-hot';
        }
        if (key.includes('extra')) {
            return 'bi bi-stars';
        }
        if (key.includes('topping')) {
            return 'bi bi-magic';
        }

        return 'bi bi-grid';
    }

    formatearHora(fecha: string): string {
        return new Date(fecha).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    private categoriaKey(categoria: string): string {
        return categoria.trim().toLowerCase();
    }

    trackByProductoId(_index: number, producto: ProductoCatalogoVM): number {
        return producto.id;
    }

    trackByCarritoId(_index: number, item: CarritoItem): number {
        return item.productoId;
    }

    trackByVentaId(_index: number, venta: VentaRecienteVM): number {
        return venta.id;
    }
}