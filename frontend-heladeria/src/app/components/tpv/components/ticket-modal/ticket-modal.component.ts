import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Venta } from '../models/tpv.types';

@Component({
  selector: 'app-ticket-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-modal.component.html',
  styleUrl: './ticket-modal.component.scss'
})
export class TicketModalComponent {
  @Input({ required: true }) venta!: Venta;
  @Output() close = new EventEmitter<void>();

  get subtotal(): number {
    return this.venta.total / 1.1;
  }

  get tax(): number {
    return this.venta.total - this.subtotal;
  }
  get ventaTimestamp(): Date {
    return this.venta.timestamp ?? new Date();
  }

  print(): void {
    window.print();
  }

  formatDate(date?: Date): string {
    return date
      ? new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : '';
  }

  formatTime(date?: Date): string {
    return date
      ? new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      : '';
  }

  trackByItem(_: number, item: Venta['items'][number]): string {
    return item.variante.producto.id.toString();
  }
}