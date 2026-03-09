import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sale } from '../models/tpv.types';

@Component({
  selector: 'app-ticket-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-modal.component.html',
  styleUrl: './ticket-modal.component.scss'
})
export class TicketModalComponent {
  @Input({ required: true }) sale!: Sale;
  @Output() close = new EventEmitter<void>();

  get subtotal(): number {
    return this.sale.total / 1.1;
  }

  get tax(): number {
    return this.sale.total - this.subtotal;
  }

  print(): void {
    window.print();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackByItem(_: number, item: Sale['items'][number]): string {
    return item.product.id;
  }
}
