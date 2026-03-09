import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrearVentaRequest } from '../models/venta-request.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VentaService {

    private apiUrl = 'http://localhost:8080/api/ventas';

    constructor(private http: HttpClient) {}

    registrarVenta(request: CrearVentaRequest): Observable<void> {
        return this.http.post<void>(this.apiUrl, request);
    }
}