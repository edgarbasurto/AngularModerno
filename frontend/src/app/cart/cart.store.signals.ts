import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../models/product';
import { CartItem } from './cart.store';

/**
 * Misma lógica que CartStore pero con Signals (para comparar en clase).
 * No se usa en la app: es material de comparación.
 */
@Injectable({ providedIn: 'root' })
export class CartSignalStore {
  private readonly _items = signal<CartItem[]>([]);
  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().reduce((n, i) => n + i.qty, 0));
  readonly total = computed(() => this._items().reduce((s, i) => s + i.qty * i.product.price, 0));

  add(product: Product) {
    this._items.update((items) => {
      const found = items.find((i) => i.product.id === product.id);
      return found
        ? items.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i))
        : [...items, { product, qty: 1 }];
    });
  }
}
