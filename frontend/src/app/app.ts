import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from './models/product';
import { LifecycleDemo } from './products/lifecycle-demo';
import { ProductCard } from './products/product-card';

@Component({
  selector: 'app-root',
  imports: [ProductCard, FormsModule, LifecycleDemo],
  template: `
    <main class="mx-auto max-w-3xl space-y-4 p-6">
      <h1 class="page-title">MiniInventario</h1>

      <!-- Two-way binding: [(ngModel)] = [ngModel] + (ngModelChange) -->
      <input
        class="w-full rounded-lg border border-slate-300 px-3 py-2"
        placeholder="Buscar producto..."
        [(ngModel)]="search"
      />

      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" [(ngModel)]="showDemo" /> Mostrar demo de ciclo de vida
      </label>
      @if (showDemo) {
        <app-lifecycle-demo [label]="search" />
      }

      <div class="grid gap-4 sm:grid-cols-2">
        @for (p of filtered(); track p.id) {
          <app-product-card [product]="p" />
        } @empty {
          <p class="text-slate-500">Sin resultados para "{{ search }}".</p>
        }
      </div>
    </main>
  `,
})
export class App {
  search = '';
  showDemo = false;
  products: Product[] = [
    { id: 1, name: 'Teclado mecánico', price: 59.9, stock: 25, categoryId: 1 },
    { id: 2, name: 'Lámpara LED', price: 19.5, stock: 4, categoryId: 2 },
    { id: 3, name: 'Clean Code', price: 34, stock: 0, categoryId: 3 },
  ];

  // Buena práctica: lógica en el método, no en el template. Se llama desde el template,
  // por eso es barato; para cálculos pesados usar computed() o un pipe puro.
  filtered() {
    const q = this.search.trim().toLowerCase();
    return this.products.filter((p) => p.name.toLowerCase().includes(q));
  }
}
