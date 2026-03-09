import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../../services/producto.service';
import { Producto } from '../../../../models/producto.model';
import { VarianteProducto } from '../models/tpv.types';

interface CategoryItem {
  id: 'todos' | Producto['categoria'];
  label: string;
  iconClass: string;
}

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss']
})
export class ProductCatalogComponent implements OnInit {
  productos: Producto[] = [];
  searchQuery = '';
  activeCategory: CategoryItem['id'] = 'todos';

  readonly categories: CategoryItem[] = [
    { id: 'todos', label: 'Todos', iconClass: 'bi bi-stars' },
    { id: 'cono', label: 'Conos', iconClass: 'bi bi-cone-striped' },
    { id: 'tarrina', label: 'Tarrinas', iconClass: 'bi bi-cup-straw' },
    { id: 'copa', label: 'Copas', iconClass: 'bi bi-cup-hot' },
    { id: 'especial', label: 'Especiales', iconClass: 'bi bi-magic' },
    { id: 'bebida', label: 'Bebidas', iconClass: 'bi bi-cup' }
  ];

  @Output() addToCart = new EventEmitter<VarianteProducto>();

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

  // Filtrar productos según categoría y búsqueda
  get filteredProducts(): Producto[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.productos.filter(product =>
      (this.activeCategory === 'todos' || product.categoria === this.activeCategory) &&
      product.nombre.toLowerCase().includes(query)
    );
  }

  // TrackBy para optimizar ngFor
  trackByProductId(_: number, product: Producto): number {
    return product.id;
  }

  // Emitir producto al carrito como VarianteProducto
  onAddToCart(producto: Producto): void {
    const variante: VarianteProducto = {
      id: producto.id,
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria as 'cono' | 'tarrina' | 'copa' | 'especial' | 'bebida' // forzamos tipo compatible
      }
    };
    this.addToCart.emit(variante);
  }
}