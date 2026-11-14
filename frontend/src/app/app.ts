import { Component } from '@angular/core';
import { Product } from './models/product';
import { ProductCard } from './products/product-card';

@Component({
  selector: 'app-root',
  imports: [ProductCard],
  template: `
    <main class="mx-auto max-w-3xl space-y-4 p-6">
      <h1 class="page-title">MiniInventario</h1>
      <p>Productos agregados al carrito: {{ cartCount }}</p>
      <div class="grid gap-4 sm:grid-cols-2">
        @for (p of products; track p.id) {
          <app-product-card [product]="p" (add)="onAdd($event)" />
        }
      </div>
    </main>
  `,
})
export class App {
  cartCount = 0;
  products: Product[] = [
    { id: 1, name: 'Teclado mecánico', price: 59.9, stock: 25, categoryId: 1 },
    { id: 2, name: 'Lámpara LED', price: 19.5, stock: 4, categoryId: 2 },
    { id: 3, name: 'Clean Code', price: 34, stock: 0, categoryId: 3 },
  ];

  onAdd(product: Product) {
    this.cartCount++;
    console.log('Agregado:', product.name);
  }
}
