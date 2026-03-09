export type ProductCategory = 'copa' | 'cono' | 'tarrina' | 'especial' | 'bebida';
export type PaymentMethod = 'cash' | 'card';
export type ToastType = 'success' | 'error' | 'info';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  flavor?: string;
  colorClass: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  timestamp: Date;
}

export interface ToastState {
  message: string;
  type: ToastType;
}
