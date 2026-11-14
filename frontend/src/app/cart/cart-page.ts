import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Button } from '../shared/ui/button';
import { CartStore } from './cart.store';

@Component({
  selector: 'app-cart-page',
  imports: [AsyncPipe, CurrencyPipe, Button],
  templateUrl: './cart-page.html',
})
export class CartPage {
  store = inject(CartStore);
}
