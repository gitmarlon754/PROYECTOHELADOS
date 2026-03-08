import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastType } from '../models/tpv.types';

@Component({
  selector: 'app-tpv-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  @Input({ required: true }) message!: string;
  @Input() type: ToastType = 'info';
  @Output() close = new EventEmitter<void>();

  get iconClass(): string {
    if (this.type === 'success') {
      return 'bi bi-check-lg';
    }
    if (this.type === 'error') {
      return 'bi bi-x-lg';
    }
    return 'bi bi-info-lg';
  }
}
