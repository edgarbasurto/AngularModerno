import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { Product } from '../models/product';
import { ClickCounter } from '../core/services/click-counter';
import { Badge } from '../shared/ui/badge';
import { Button } from '../shared/ui/button';
import { Card } from '../shared/ui/card';

@Component({
  selector: 'app-product-card',
  imports: [Card, Badge, Button, CurrencyPipe],
  providers: [ClickCounter],
  template: `
    <app-card [title]="product().name">
      <!-- Interpolación -->
      <p class="text-slate-600">Precio: {{ product().price | currency }}</p>

      <!-- Property binding: [tone] se calcula desde el estado -->
      <p class="mt-1">
        Stock:
        <app-badge [tone]="stockTone()">{{ product().stock }} uds</app-badge>
      </p>

      <p class="mt-1 text-xs text-slate-500">Clics en esta tarjeta: {{ counter.count }}</p>
      <ng-container card-actions>
        <!-- Event binding: (click) emite un output hacia el padre -->
        <app-button
          icon="heroShoppingCart"
          [disabled]="product().stock === 0"
          (click)="onAdd()"
        >
          Agregar
        </app-button>
      </ng-container>
    </app-card>
  `,
})
export class ProductCard {
  product = input.required<Product>();
  add = output<Product>();

  protected counter = inject(ClickCounter);

  onAdd() {
    this.counter.hit();
    this.add.emit(this.product());
  }

  protected stockTone = computed(() => (this.product().stock > 10 ? 'ok' : 'warn'));
}
