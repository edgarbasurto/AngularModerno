import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { Button } from '../shared/ui/button';
import { ProductCard } from './product-card';
import { PRODUCTS } from './products.data';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard, FormsModule, Button],
  template: `
    <h1 class="page-title mb-4">Productos</h1>
    <input
      class="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2"
      placeholder="Buscar producto..."
      [(ngModel)]="search"
    />
    <div class="grid gap-4 sm:grid-cols-2">
      @for (p of filtered(); track p.id) {
        <div>
          <app-product-card [product]="p" />
          <!-- Navegación programática -->
          <app-button class="mt-2 inline-block" variant="secondary" (click)="goToDetail(p)">
            Ver detalle
          </app-button>
        </div>
      } @empty {
        <p class="text-slate-500">Sin resultados.</p>
      }
    </div>
  `,
})
export class ProductList {
  private router = inject(Router);
  search = '';
  products = PRODUCTS;

  filtered() {
    const q = this.search.trim().toLowerCase();
    return this.products.filter((p) => p.name.toLowerCase().includes(q));
  }

  goToDetail(p: Product) {
    this.router.navigate(['/products', p.id]);
  }
}
