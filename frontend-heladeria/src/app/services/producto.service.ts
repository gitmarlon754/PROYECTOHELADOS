import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../app.config';
import { Producto } from '../models/producto.model';

export interface InventarioItem {
    productoId: number;
    sede: string;
    stock: number;
    nombre?: string;
    categoria?: string;
    precio?: number;
}

export type MetodoPagoVenta = 'cash' | 'card';

export interface VentaDetalleItem {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
}

export interface VentaRecienteItem {
    id: number;
    total: number;
    fecha: string;
    metodoPago?: MetodoPagoVenta;
    detalles?: Array<{
        cantidad: number;
        precioUnitario: number;
        productoId?: number;
        producto?: { id?: number };
    }>;
}

export interface VentaCreateRequest {
    total: number;
    metodoPago: MetodoPagoVenta;
    items: VentaDetalleItem[];
}

export interface JornadaEstado {
    jornadaAbierta: boolean;
    sobrantesDisponibles: boolean;
    fecha: string;
    productosAgotados: number;
    inicioJornada?: string | null;
}

export interface StockInputRequest {
    productoId: number;
    nombre: string;
    categoria: string;
    precio: number;
    cantidad: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProductoService {

    private apiUrl = `${API_BASE}/api/mock/productos`;

    constructor(private http: HttpClient) {}

    getProductos(): Observable<Producto[]> {
        return this.http.get<Producto[]>(this.apiUrl);
    }

    getInventario(): Observable<InventarioItem[]> {
        return this.http.get<InventarioItem[]>(`${API_BASE}/api/mock/inventario`);
    }

    getStockDiario(): Observable<InventarioItem[]> {
        return this.http.get<InventarioItem[]>(`${API_BASE}/jornadas/stock`);
    }

    getVentasRecent(): Observable<VentaRecienteItem[]> {
        return this.http.get<VentaRecienteItem[]>(`${API_BASE}/api/mock/ventas/recent`);
    }

    getVentas(): Observable<VentaRecienteItem[]> {
        return this.http.get<VentaRecienteItem[]>(`${API_BASE}/ventas`);
    }

    registrarVenta(request: VentaCreateRequest): Observable<VentaRecienteItem> {
        return this.http.post<VentaRecienteItem>(`${API_BASE}/ventas`, request);
    }

    getJornadaEstado(): Observable<JornadaEstado> {
        return this.http.get<JornadaEstado>(`${API_BASE}/jornadas/estado`);
    }

    abrirJornada(usarSobrantes: boolean, stocks: StockInputRequest[]): Observable<unknown> {
        return this.http.post(`${API_BASE}/jornadas/abrir`, { usarSobrantes, stocks });
    }

    cerrarJornada(limpiarInventario: boolean): Observable<unknown> {
        return this.http.post(`${API_BASE}/jornadas/cerrar`, { limpiarInventario });
    }

    reponerStock(stocks: StockInputRequest[]): Observable<InventarioItem[]> {
        return this.http.post<InventarioItem[]>(`${API_BASE}/jornadas/stock/reponer`, { stocks });
    }
}
