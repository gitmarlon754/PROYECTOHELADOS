import { Component } from '@angular/core';
import { ProductosComponent } from './components/productos/productos.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ProductosComponent],
    templateUrl: './app.component.html'
})
export class AppComponent {}