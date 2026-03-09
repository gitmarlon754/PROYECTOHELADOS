import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CartItem,
  VarianteProducto,
  Venta,
  ToastType,
  PaymentMethod,
  Producto
} from './components/models/tpv.types';

import { HeaderComponent } from './components/header/header.component';
import { SalesMetricsComponent } from './components/sales-metrics/sales-metrics.component';
import { ProductCatalogComponent } from './components/product-catalog/product-catalog.component';
import { CartPanelComponent } from './components/cart-panel/cart-panel.component';
import { TicketModalComponent } from './components/ticket-modal/ticket-modal.component';
import { ToastComponent } from './components/toast/toast.component';

export interface ToastState {
  message: string;
  type: ToastType; // 'info' | 'success' | 'error'
}

@Component({
  selector: 'app-tpv-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SalesMetricsComponent,
    ProductCatalogComponent,
    CartPanelComponent,
    TicketModalComponent,
    ToastComponent
  ],
  templateUrl: './tpv-page.component.html',
  styleUrls: ['./tpv-page.component.scss']
})
export class TpvPageComponent implements OnDestroy {
  cart: CartItem[] = [];
  showTicket = false;
  lastSale: Venta | null = null;
  sales: Venta[] = [];
  toast: ToastState | null = null;
  showMetrics = false;

  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnDestroy(): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  toggleMetrics(): void {
    this.showMetrics = !this.showMetrics;
  }

  showToast(message: string, type: ToastType = 'info'): void {
    this.toast = { message, type };
    if (this.toastTimer) clearTimeout(this.toastTimer);

    this.toastTimer = setTimeout(() => {
      this.toast = null;
      this.toastTimer = null;
    }, 3000);
  }

  /** ✅ Añade una variante al carrito */
  addToCart(variante: VarianteProducto): void {
    const existing = this.cart.find(item => item.variante.id === variante.id);

    if (existing) {
      this.cart = this.cart.map(item =>
        item.variante.id === variante.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      this.cart = [...this.cart, { variante, quantity: 1 }];
    }

    this.showToast(`${variante.producto.nombre} agregado`, 'success');
  }

  updateQuantity(varianteId: number, quantity: number): void {
    if (quantity <= 0) {
      this.cart = this.cart.filter(item => item.variante.id !== varianteId);
      this.showToast('Producto eliminado', 'info');
      return;
    }

    this.cart = this.cart.map(item =>
      item.variante.id === varianteId ? { ...item, quantity } : item
    );
  }

  clearCart(): void {
    this.cart = [];
    this.showToast('Carrito vaciado', 'info');
  }

  processPayment(paymentMethod: PaymentMethod): void {
    const total = this.cart.reduce(
      (sum, item) => sum + item.variante.producto.precio * item.quantity,
      0
    );

    const venta: Venta = {
      id: Date.now(), // número único para ID
      items: [...this.cart],
      total,
      metodoPago: paymentMethod,
      timestamp: new Date()
    };

    this.sales = [...this.sales, venta];
    this.lastSale = venta;
    this.cart = [];
    this.showTicket = true;
    this.showToast('Venta completada', 'success');
  }

  closeTicket(): void {
    this.showTicket = false;
  }

  closeToast(): void {
    this.toast = null;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
  }
}