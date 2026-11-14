import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CartStore } from '../cart/cart.store';
import { NotificationService } from '../core/services/notification.service';
import { Product } from '../models/product';
import { Button } from '../shared/ui/button';
import { ProductCard } from './product-card';
import { ProductsApi } from './products.api';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard, FormsModule, Button],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  private api = inject(ProductsApi);
  private notify = inject(NotificationService);
  auth = inject(AuthService);
  private cart = inject(CartStore);
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
    // Solo Admin puede borrar: el botón se oculta y la API además lo exige (403 si no).
    this.api.delete(p.id).subscribe(() => {
      this.products.update((list) => list.filter((x) => x.id !== p.id));
      this.notify.success(`${p.name} eliminado`);
    });
  }

  onAdd(p: Product) {
    this.cart.add(p);
    this.notify.success(`${p.name} agregado`);
  }

  goToDetail(p: Product) {
    this.router.navigate(['/products', p.id]);
  }
}
