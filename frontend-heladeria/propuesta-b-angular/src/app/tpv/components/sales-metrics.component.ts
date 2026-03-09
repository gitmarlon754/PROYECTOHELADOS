import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sale } from '../models/tpv.types';

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
  styleUrl: './sales-metrics.component.scss'
})
export class SalesMetricsComponent {
  @Input() sales: Sale[] = [];
  @Output() close = new EventEmitter<void>();

  get totalRevenue(): number {
    return this.sales.reduce((sum, sale) => sum + sale.total, 0);
  }

  get cardSales(): Sale[] {
    return this.sales.filter((sale) => sale.paymentMethod === 'card');
  }

  get cashSales(): Sale[] {
    return this.sales.filter((sale) => sale.paymentMethod === 'cash');
  }

  get cardRevenue(): number {
    return this.cardSales.reduce((sum, sale) => sum + sale.total, 0);
  }

  get cashRevenue(): number {
    return this.cashSales.reduce((sum, sale) => sum + sale.total, 0);
  }

  get totalItems(): number {
    return this.sales.reduce(
      (sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    );
  }

  get avgTicket(): number {
    return this.sales.length > 0 ? this.totalRevenue / this.sales.length : 0;
  }

  get metrics(): MetricItem[] {
    return [
      {
        label: 'Ventas Totales',
        value: `${this.totalRevenue.toFixed(2)}EUR`,
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
        value: `${this.avgTicket.toFixed(2)}EUR`,
        iconClass: 'bi bi-bag-check',
        colorClass: 'metric-secondary'
      },
      {
        label: 'Articulos Vendidos',
        value: `${this.totalItems}`,
        iconClass: 'bi bi-cart-check',
        colorClass: 'metric-caramel'
      }
    ];
  }

  get recentSales(): Sale[] {
    return this.sales.slice(-5).reverse();
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackByMetric(_: number, metric: MetricItem): string {
    return metric.label;
  }

  trackBySale(_: number, sale: Sale): string {
    return sale.id;
  }
}
