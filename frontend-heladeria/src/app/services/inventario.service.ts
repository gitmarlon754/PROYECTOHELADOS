import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../app.config';

export interface InventarioItem {
    productoId: number;
    sede: string;
    stock: number;
    nombre?: string;
    categoria?: string;
    precio?: number;
}

@Injectable({
    providedIn: 'root'
    })
    export class InventarioService {

    private apiUrl = `${API_BASE}/inventario`;

    constructor(private http: HttpClient) {}

    getInventario(): Observable<InventarioItem[]> {
        return this.http.get<InventarioItem[]>(this.apiUrl);
    }

}