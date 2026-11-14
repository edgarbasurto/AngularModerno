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
  templateUrl: './product-card.html',
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
