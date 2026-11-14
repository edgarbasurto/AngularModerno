import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../core/services/notification.service';
import { Product } from '../models/product';
import { Button } from '../shared/ui/button';
import { ProductCard } from './product-card';
import { ProductsApi } from './products.api';

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

    @if (loading()) {
      <p class="text-slate-500">Cargando productos…</p>
    } @else if (error()) {
      <div class="rounded-lg border border-red-300 bg-red-50 p-4">
        <p class="text-red-700">{{ error() }}</p>
        <app-button class="mt-2 inline-block" variant="secondary" (click)="load()">Reintentar</app-button>
      </div>
    } @else {
      <div class="grid gap-4 sm:grid-cols-2">
        @for (p of filtered(); track p.id) {
          <div>
            <app-product-card [product]="p" (add)="onAdd($event)" />
            <div class="mt-2 flex gap-2">
              <app-button variant="secondary" (click)="goToDetail(p)">Ver detalle</app-button>
              <app-button variant="danger" icon="heroTrash" (click)="remove(p)">Eliminar</app-button>
            </div>
          </div>
        } @empty {
          <p class="text-slate-500">Sin resultados.</p>
        }
      </div>
    }
  `,
})
export class ProductList implements OnInit {
  private api = inject(ProductsApi);
  private notify = inject(NotificationService);
  private router = inject(Router);

  search = signal('');
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.products().filter((p) => p.name.toLowerCase().includes(q));
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.getAll().subscribe({
      next: (list) => {
        this.products.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos.');
        this.loading.set(false);
      },
    });
  }

  remove(p: Product) {
    // Requiere rol Admin: hasta el tema 15 responderá 401 y lo captura el errorInterceptor.
    this.api.delete(p.id).subscribe(() => {
      this.products.update((list) => list.filter((x) => x.id !== p.id));
      this.notify.success(`${p.name} eliminado`);
    });
  }

  onAdd(p: Product) {
    this.notify.success(`${p.name} agregado`);
  }

  goToDetail(p: Product) {
    this.router.navigate(['/products', p.id]);
  }
}
