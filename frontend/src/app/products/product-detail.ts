import { CurrencyPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LifecycleDemo } from './lifecycle-demo';
import { PRODUCTS } from './products.data';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CurrencyPipe, LifecycleDemo],
  template: `
    @if (product(); as p) {
      <h1 class="page-title">{{ p.name }}</h1>
      <p class="mt-2">Precio: {{ p.price | currency }} · Stock: {{ p.stock }}</p>
      <app-lifecycle-demo [label]="p.name" />
    } @else {
      <h1 class="page-title">Producto no encontrado</h1>
    }
    <a routerLink="/products" class="mt-4 inline-block text-brand-600 underline">← Volver</a>
  `,
})
export class ProductDetail {
  // Gracias a withComponentInputBinding(), el parámetro :id llega como input.
  id = input.required<string>();
  product = computed(() => PRODUCTS.find((p) => p.id === Number(this.id())));
}
