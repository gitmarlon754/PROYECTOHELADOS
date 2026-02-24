import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../app.config';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {

    private apiUrl = `${API_BASE}/api/mock/productos`;

    constructor(private http: HttpClient) {}

    getProductos(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getInventario(): Observable<any[]> {
        return this.http.get<any[]>(`${API_BASE}/api/mock/inventario`);
    }

    getVentasRecent(): Observable<any[]> {
        return this.http.get<any[]>(`${API_BASE}/api/mock/ventas/recent`);
    }
}
