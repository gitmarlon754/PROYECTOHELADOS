import { Component, OnInit } from '@angular/core';
import { ProductoService } from './services/producto.service';
import { CommonModule } from '@angular/common';
import { ProductosComponent } from './components/productos/productos.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, ProductosComponent],
    templateUrl: './app.component.html'
    })
    export class AppComponent implements OnInit {

    productos: any[] = [];

    constructor(private productoService: ProductoService) {}

    ngOnInit(): void {
        this.productoService.getProductos().subscribe((data: any[]) => {
        this.productos = data;
        console.log(data);
        });
    }
}
