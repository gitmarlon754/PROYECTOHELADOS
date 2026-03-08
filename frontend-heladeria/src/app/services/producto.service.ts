import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../app.config';
import { Producto } from '../models/producto.model';

export interface InventarioItem {
    productoId: number;
    sede: string;
    stock: number;
}

export interface VentaRecienteItem {
    id: number;
    total: number;
    fecha: string;
}

export interface VentaCreateRequest {
    total: number;
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

    getVentasRecent(): Observable<VentaRecienteItem[]> {
        return this.http.get<VentaRecienteItem[]>(`${API_BASE}/api/mock/ventas/recent`);
    }

    getVentas(): Observable<VentaRecienteItem[]> {
        return this.http.get<VentaRecienteItem[]>(`${API_BASE}/ventas`);
    }

    registrarVenta(request: VentaCreateRequest): Observable<VentaRecienteItem> {
        return this.http.post<VentaRecienteItem>(`${API_BASE}/ventas`, request);
    }
}
