import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRODUCTS } from '../data/products.data';
import { Product } from '../models/tpv.types';

interface CategoryItem {
  id: 'todos' | Product['category'];
  label: string;
  iconClass: string;
}

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.scss'
})
export class ProductCatalogComponent {
  @Output() addToCart = new EventEmitter<Product>();

  activeCategory: CategoryItem['id'] = 'todos';
  searchQuery = '';

  readonly categories: CategoryItem[] = [
    { id: 'todos', label: 'Todos', iconClass: 'bi bi-stars' },
    { id: 'cono', label: 'Conos', iconClass: 'bi bi-cone-striped' },
    { id: 'tarrina', label: 'Tarrinas', iconClass: 'bi bi-cup-straw' },
    { id: 'copa', label: 'Copas', iconClass: 'bi bi-cup-hot' },
    { id: 'especial', label: 'Especiales', iconClass: 'bi bi-magic' },
    { id: 'bebida', label: 'Bebidas', iconClass: 'bi bi-cup' }
  ];

  get filteredProducts(): Product[] {
    const query = this.searchQuery.trim().toLowerCase();

    return PRODUCTS.filter((product) => {
      const matchesCategory = this.activeCategory === 'todos' || product.category === this.activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }

  trackByProductId(_: number, product: Product): string {
    return product.id;
  }
}
