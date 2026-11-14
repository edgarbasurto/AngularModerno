import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Button } from '../shared/ui/button';
import { CartStore } from './cart.store';

@Component({
  selector: 'app-cart-page',
  imports: [AsyncPipe, CurrencyPipe, Button],
  template: `
    <h1 class="page-title mb-4">Carrito</h1>

    <!-- async pipe: se suscribe y se desuscribe solo -->
    @if (store.items$ | async; as items) {
      @if (items.length === 0) {
        <p class="text-slate-500">El carrito está vacío.</p>
      } @else {
        <ul class="space-y-2">
          @for (i of items; track i.product.id) {
            <li class="flex items-center justify-between rounded-lg border bg-white p-3">
              <span>{{ i.product.name }} × {{ i.qty }}</span>
              <span class="flex items-center gap-3">
                {{ i.qty * i.product.price | currency }}
                <app-button variant="danger" icon="heroTrash" (click)="store.remove(i.product.id)" />
              </span>
            </li>
          }
        </ul>
        <p class="mt-4 text-lg font-semibold">Total: {{ store.total$ | async | currency }}</p>
        <app-button class="mt-2 inline-block" variant="secondary" (click)="store.clear()">Vaciar</app-button>
      }
    }
  `,
})
export class CartPage {
  store = inject(CartStore);
}
