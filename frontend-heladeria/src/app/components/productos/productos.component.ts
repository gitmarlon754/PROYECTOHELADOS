import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ProductoService, VentaRecienteItem } from '../../services/producto.service';
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
}

@Component({
    selector: 'app-productos',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './productos.component.html'
    })
    export class ProductosComponent implements OnInit {

        productos: ProductoCatalogoVM[] = [];
        carrito: CarritoItem[] = [];
        ventasRecientes: VentaRecienteVM[] = [];
        terminoBusqueda = '';
        categoriaSeleccionada = 'Todas';
        loading = true;
        errorMsg = '';
        ventaMsg = '';
        ultimoTicket: TicketVenta | null = null;

    constructor(
        private productoService: ProductoService
    ) {}

    ngOnInit(): void {
        this.cargarCatalogo();
    }

    cargarCatalogo(): void {
        this.loading = true;
        this.errorMsg = '';

        forkJoin({
            productos: this.productoService.getProductos(),
            inventario: this.productoService.getInventario(),
            ventasRecientes: this.productoService.getVentasRecent()
        }).pipe(
            catchError(() => {
                this.errorMsg = 'No se pudo cargar el catálogo. Verifica backend dev en puerto 8080.';
                return of({ productos: [], inventario: [], ventasRecientes: [] });
            }),
            finalize(() => {
                this.loading = false;
            })
        ).subscribe(({ productos, inventario, ventasRecientes }) => {
            const stockPorProducto = new Map<number, number>();

            inventario.forEach(item => {
                const stockActual = stockPorProducto.get(item.productoId) ?? 0;
                stockPorProducto.set(item.productoId, stockActual + item.stock);
            });

            this.productos = productos
                .map((producto: Producto) => ({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    categoria: producto.categoria ?? 'Sin categoría',
                    stock: stockPorProducto.get(producto.id) ?? 0
                }))
                .sort((a, b) => a.nombre.localeCompare(b.nombre));

            this.ventasRecientes = ventasRecientes
                .map((venta: VentaRecienteItem) => ({
                    id: venta.id,
                    total: venta.total,
                    fecha: venta.fecha
                }))
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        });
    }

    agregarAlCarrito(producto: ProductoCatalogoVM): void {
        this.ventaMsg = '';
        this.ultimoTicket = null;
        const item = this.carrito.find(c => c.productoId === producto.id);

        if (item) {
            if (item.cantidad < item.stockDisponible) {
                item.cantidad += 1;
            }
            return;
        }

        if (producto.stock <= 0) {
            return;
        }

        this.carrito.push({
            productoId: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
            stockDisponible: producto.stock
        });
    }

    incrementarCantidad(item: CarritoItem): void {
        this.ventaMsg = '';
        this.ultimoTicket = null;
        if (item.cantidad < item.stockDisponible) {
            item.cantidad += 1;
        }
    }

    decrementarCantidad(item: CarritoItem): void {
        this.ventaMsg = '';
        this.ultimoTicket = null;
        if (item.cantidad > 1) {
            item.cantidad -= 1;
            return;
        }

        this.eliminarDelCarrito(item.productoId);
    }

    eliminarDelCarrito(productoId: number): void {
        this.ventaMsg = '';
        this.ultimoTicket = null;
        this.carrito = this.carrito.filter(item => item.productoId !== productoId);
    }

    vaciarCarrito(): void {
        this.ventaMsg = '';
        this.ultimoTicket = null;
        this.carrito = [];
    }

    confirmarVentaDemo(): void {
        if (this.carrito.length === 0) {
            return;
        }

        const itemsTicket = this.carrito.map(item => ({
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
            subtotal: item.cantidad * item.precio
        }));

        this.ultimoTicket = {
            id: Date.now(),
            fecha: new Date().toISOString(),
            items: itemsTicket,
            total: this.totalVenta
        };

        const cantidadPorProducto = new Map<number, number>();
        this.carrito.forEach(item => {
            cantidadPorProducto.set(item.productoId, item.cantidad);
        });

        this.productos = this.productos.map(producto => {
            const vendido = cantidadPorProducto.get(producto.id) ?? 0;
            return {
                ...producto,
                stock: Math.max(0, producto.stock - vendido)
            };
        });

        this.ventaMsg = `Venta demo confirmada por ${this.totalCantidad} ítems. Total: ${this.totalVenta.toFixed(2)}`;
        this.carrito = [];
    }

    cerrarTicket(): void {
        this.ultimoTicket = null;
    }

    get totalCantidad(): number {
        return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
    }

    get totalVenta(): number {
        return this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
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