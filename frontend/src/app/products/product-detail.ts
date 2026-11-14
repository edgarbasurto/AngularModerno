import { CurrencyPipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../models/product';
import { LifecycleDemo } from './lifecycle-demo';
import { ProductsApi } from './products.api';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CurrencyPipe, LifecycleDemo],
  template: `
    @if (loading()) {
      <p class="text-slate-500">Cargando…</p>
    } @else if (product(); as p) {
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
  private api = inject(ProductsApi);

  id = input.required<string>(); // viene del parámetro :id de la ruta
  product = signal<Product | null>(null);
  loading = signal(true);

  constructor() {
    // Se vuelve a ejecutar cada vez que cambia el id.
    effect(() => {
      this.loading.set(true);
      this.api.getById(Number(this.id())).subscribe({
        next: (p) => { this.product.set(p); this.loading.set(false); },
        error: () => { this.product.set(null); this.loading.set(false); },
      });
    });
  }
}
