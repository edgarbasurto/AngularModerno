import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  qty: number;
}

/**
 * "Servicio como store" con RxJS, sin Signals.
 * BehaviorSubject guarda el estado actual y emite a quien se suscriba.
 */
@Injectable({ providedIn: 'root' })
export class CartStore {
  // Estado privado y mutable solo desde aquí
  private readonly state$ = new BehaviorSubject<CartItem[]>([]);

  // Estado público de solo lectura, derivado con operadores
  readonly items$ = this.state$.asObservable();
  readonly count$ = this.items$.pipe(map((items) => items.reduce((n, i) => n + i.qty, 0)));
  readonly total$ = this.items$.pipe(
    map((items) => items.reduce((sum, i) => sum + i.qty * i.product.price, 0)),
  );

  add(product: Product) {
    const items = this.state$.value; // valor actual, síncrono
    const found = items.find((i) => i.product.id === product.id);
    // Inmutabilidad: se emite un array NUEVO, nunca se muta el anterior.
    this.state$.next(
      found
        ? items.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i))
        : [...items, { product, qty: 1 }],
    );
  }

  remove(productId: number) {
    this.state$.next(this.state$.value.filter((i) => i.product.id !== productId));
  }

  clear() {
    this.state$.next([]);
  }
}
