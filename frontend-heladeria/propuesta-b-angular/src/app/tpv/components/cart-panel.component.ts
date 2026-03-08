import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem, PaymentMethod } from '../models/tpv.types';

@Component({
  selector: 'app-cart-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-panel.component.html',
  styleUrl: './cart-panel.component.scss'
})
export class CartPanelComponent {
  @Input() items: CartItem[] = [];

  @Output() updateQuantity = new EventEmitter<{ productId: string; quantity: number }>();
  @Output() clearCart = new EventEmitter<void>();
  @Output() processPayment = new EventEmitter<PaymentMethod>();

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  get tax(): number {
    return this.subtotal * 0.1;
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  get itemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  trackByProductId(_: number, item: CartItem): string {
    return item.product.id;
  }
}
