import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';

@Component({
    selector: 'app-productos',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './productos.component.html'
    })
    export class ProductosComponent implements OnInit {

    productos: any[] = [];
        inventario: any[] = [];
        ventasRecientes: any[] = [];

    constructor(
        private productoService: ProductoService,
        private zone: NgZone
    ) {}

    ngOnInit(): void {
        this.productoService.getProductos().subscribe(data => {
            this.productos = data;
        });
        this.productoService.getInventario().subscribe(data => {
            this.inventario = data;
        });
        this.productoService.getVentasRecent().subscribe(data => {
            this.ventasRecientes = data;
        });
    }
}