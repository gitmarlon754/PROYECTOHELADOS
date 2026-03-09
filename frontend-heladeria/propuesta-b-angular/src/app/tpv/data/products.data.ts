import { Product } from '../models/tpv.types';

export const PRODUCTS: Product[] = [
  { id: 'cono-1', name: 'Cono Simple', price: 2.5, category: 'cono', colorClass: 'product-cono', icon: '🍦' },
  { id: 'cono-2', name: 'Cono Doble', price: 4.0, category: 'cono', colorClass: 'product-cono', icon: '🍦' },
  { id: 'cono-3', name: 'Cono Triple', price: 5.5, category: 'cono', colorClass: 'product-cono', icon: '🍦' },

  { id: 'tarrina-1', name: 'Tarrina Pequena', price: 3.0, category: 'tarrina', colorClass: 'product-tarrina', icon: '🥛' },
  { id: 'tarrina-2', name: 'Tarrina Mediana', price: 4.5, category: 'tarrina', colorClass: 'product-tarrina', icon: '🥛' },
  { id: 'tarrina-3', name: 'Tarrina Grande', price: 6.0, category: 'tarrina', colorClass: 'product-tarrina', icon: '🥛' },

  { id: 'copa-1', name: 'Copa Clasica', price: 5.5, category: 'copa', colorClass: 'product-copa', icon: '🍨' },
  { id: 'copa-2', name: 'Copa Premium', price: 7.5, category: 'copa', colorClass: 'product-copa', icon: '🍨' },
  { id: 'copa-3', name: 'Copa Infantil', price: 4.0, category: 'copa', colorClass: 'product-copa', icon: '🍨' },

  { id: 'especial-1', name: 'Banana Split', price: 8.5, category: 'especial', colorClass: 'product-especial', icon: '🍌' },
  { id: 'especial-2', name: 'Brownie Sundae', price: 9.0, category: 'especial', colorClass: 'product-especial', icon: '🍫' },
  { id: 'especial-3', name: 'Waffle Helado', price: 8.0, category: 'especial', colorClass: 'product-especial', icon: '🧇' },

  { id: 'bebida-1', name: 'Batido', price: 4.5, category: 'bebida', colorClass: 'product-bebida', icon: '🥤' },
  { id: 'bebida-2', name: 'Cafe Helado', price: 3.5, category: 'bebida', colorClass: 'product-bebida', icon: '☕' },
  { id: 'bebida-3', name: 'Granizado', price: 3.0, category: 'bebida', colorClass: 'product-bebida', icon: '🧊' }
];
