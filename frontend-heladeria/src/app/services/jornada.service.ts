import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../app.config';

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
    export class JornadaService {

    private apiUrl = `${API_BASE}/jornadas`;

    constructor(private http: HttpClient) {}

    getEstado(): Observable<JornadaEstado> {
        return this.http.get<JornadaEstado>(`${this.apiUrl}/estado`);
    }

    abrirJornada(usarSobrantes: boolean, stocks: StockInputRequest[]): Observable<any> {
        return this.http.post(`${this.apiUrl}/abrir`, { usarSobrantes, stocks });
    }

    cerrarJornada(limpiarInventario: boolean): Observable<any> {
        return this.http.post(`${this.apiUrl}/cerrar`, { limpiarInventario });
    }

}