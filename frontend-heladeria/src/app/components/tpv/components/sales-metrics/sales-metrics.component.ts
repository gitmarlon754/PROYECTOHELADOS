import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Venta, CartItem, PaymentMethod } from '../models/tpv.types';

interface MetricItem {
  label: string;
  value: string;
  iconClass: string;
  colorClass: string;
}

@Component({
  selector: 'app-sales-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-metrics.component.html',
  styleUrls: ['./sales-metrics.component.scss']
})
export class SalesMetricsComponent {
  @Input() sales: Venta[] = [];
  @Output() close = new EventEmitter<void>();

  // Total de ingresos
  get totalRevenue(): number {
    return this.sales.reduce((sum: number, venta: Venta) => sum + venta.total, 0);
  }

  // Ventas por tipo de pago
  get cardSales(): Venta[] {
    return this.sales.filter((venta) => venta.metodoPago === 'card');
  }

  get cashSales(): Venta[] {
    return this.sales.filter((venta) => venta.metodoPago === 'cash');
  }

  get cardRevenue(): number {
    return this.cardSales.reduce((sum: number, venta: Venta) => sum + venta.total, 0);
  }

  get cashRevenue(): number {
    return this.cashSales.reduce((sum: number, venta: Venta) => sum + venta.total, 0);
  }

  // Total de items vendidos
  get totalItems(): number {
    return this.sales.reduce(
      (sum: number, venta: Venta) =>
        sum + venta.items.reduce((itemSum: number, item: CartItem) => itemSum + item.quantity, 0),
      0
    );
  }

  // Ticket promedio
  get avgTicket(): number {
    return this.sales.length > 0 ? this.totalRevenue / this.sales.length : 0;
  }

  // Métricas para mostrar
  get metrics(): MetricItem[] {
    return [
      {
        label: 'Ventas Totales',
        value: `${this.totalRevenue.toFixed(2)} EUR`,
        iconClass: 'bi bi-graph-up-arrow',
        colorClass: 'metric-primary'
      },
      {
        label: 'Tickets',
        value: `${this.sales.length}`,
        iconClass: 'bi bi-receipt',
        colorClass: 'metric-accent'
      },
      {
        label: 'Ticket Medio',
        value: `${this.avgTicket.toFixed(2)} EUR`,
        iconClass: 'bi bi-bag-check',
        colorClass: 'metric-secondary'
      },
      {
        label: 'Artículos Vendidos',
        value: `${this.totalItems}`,
        iconClass: 'bi bi-cart-check',
        colorClass: 'metric-caramel'
      }
    ];
  }

  // Últimas 5 ventas
  get recentSales(): Venta[] {
    return this.sales.slice(-5).reverse();
  }

  // Formato de hora
  formatSaleTime(sale: Venta): string {
  const date = sale.timestamp ? new Date(sale.timestamp) : new Date();
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

  // TrackBy para Angular
  trackByMetric(_: number, metric: MetricItem): string {
    return metric.label;
  }

  trackBySale(_: number, venta: Venta): number | undefined {
    return venta.id;
  }
}