import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../app.config';
import { Producto } from '../models/producto.model';

@Injectable({
    providedIn: 'root'
    })
    export class ProductoService {

    private apiUrl = `${API_BASE}/productos`;

    constructor(private http: HttpClient) {}

    getProductos(): Observable<Producto[]> {
        return this.http.get<Producto[]>(this.apiUrl);
    }

}