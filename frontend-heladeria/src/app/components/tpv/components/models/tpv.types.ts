// src/app/components/tpv/components/models/tpv.types.ts

export type ProductCategory = 'copa' | 'cono' | 'tarrina' | 'especial' | 'bebida';
export type PaymentMethod = 'cash' | 'card';
export type ToastType = 'success' | 'error' | 'info';

/* MODELOS DEL BACKEND */
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria?: ProductCategory; // opcional, para compatibilidad con filtros
  imagen?: string;
}

export interface TipoHelado {
  id: number;
  nombre: string;
}

export interface VarianteProducto {
  id: number;
  producto: Producto;
  sabor?: string;
  tipoHelado?: TipoHelado;
}

/* MODELOS DEL TPV */
export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  flavor?: string;
  colorClass?: string;
  icon?: string;
}

export interface CartItem {
  variante: VarianteProducto;
  quantity: number;
}

export interface Venta {
  id?: number;
  items: CartItem[];
  total: number;
  metodoPago: PaymentMethod;
  timestamp?: Date; // <--- agregar esto

}