import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { CartPanelComponent } from './components/cart-panel.component';
import { HeaderComponent } from './components/header.component';
import { ProductCatalogComponent } from './components/product-catalog.component';
import { SalesMetricsComponent } from './components/sales-metrics.component';
import { TicketModalComponent } from './components/ticket-modal.component';
import { ToastComponent } from './components/toast.component';
import { CartItem, PaymentMethod, Product, Sale, ToastState, ToastType } from './models/tpv.types';

@Component({
  selector: 'app-tpv-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ProductCatalogComponent,
    CartPanelComponent,
    SalesMetricsComponent,
    TicketModalComponent,
    ToastComponent
  ],
  templateUrl: './tpv-page.component.html',
  styleUrl: './tpv-page.component.scss'
})
export class TpvPageComponent implements OnDestroy {
  cart: CartItem[] = [];
  showTicket = false;
  lastSale: Sale | null = null;
  sales: Sale[] = [];
  toast: ToastState | null = null;
  showMetrics = false;

  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnDestroy(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  toggleMetrics(): void {
    this.showMetrics = !this.showMetrics;
  }

  showToast(message: string, type: ToastType = 'info'): void {
    this.toast = { message, type };

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastTimer = setTimeout(() => {
      this.toast = null;
      this.toastTimer = null;
    }, 3000);
  }

  addToCart(product: Product): void {
    const existing = this.cart.find((item) => item.product.id === product.id);

    if (existing) {
      this.cart = this.cart.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      this.cart = [...this.cart, { product, quantity: 1 }];
    }

    this.showToast(`${product.name} agregado`, 'success');
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.cart = this.cart.filter((item) => item.product.id !== productId);
      this.showToast('Producto eliminado', 'info');
      return;
    }

    this.cart = this.cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
  }

  clearCart(): void {
    this.cart = [];
    this.showToast('Carrito vaciado', 'info');
  }

  processPayment(paymentMethod: PaymentMethod): void {
    const total = this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const sale: Sale = {
      id: Date.now().toString(),
      items: [...this.cart],
      total,
      paymentMethod,
      timestamp: new Date()
    };

    this.sales = [...this.sales, sale];
    this.lastSale = sale;
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
