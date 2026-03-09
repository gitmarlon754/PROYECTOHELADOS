import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../app.config';
import { CrearVentaRequest } from '../models/venta-request.model';

@Injectable({
    providedIn: 'root'
    })
    export class VentaService {

    private apiUrl = `${API_BASE}/ventas`;

    constructor(private http: HttpClient) {}

    registrarVenta(request: CrearVentaRequest): Observable<any> {
        return this.http.post<any>(this.apiUrl, request);
    }

    getVentas(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

}