import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Category, Product } from '../models/product';
import { CATEGORIES, PRODUCTS } from './products.data';

export type ProductDto = Omit<Product, 'id'>;

/**
 * Servicio de DATOS (en memoria). Misma firma que usará el servicio HTTP del tema 13,
 * así los componentes no cambian cuando se conecte la API real.
 */
@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private items: Product[] = [...PRODUCTS];
  private nextId = 100;

  getAll(): Observable<Product[]> {
    return of([...this.items]).pipe(delay(400));
  }

  getById(id: number): Observable<Product> {
    const p = this.items.find((x) => x.id === id);
    return p ? of(p).pipe(delay(200)) : throwError(() => new Error('Producto no encontrado'));
  }

  create(dto: ProductDto): Observable<Product> {
    const p = { id: this.nextId++, ...dto };
    this.items.push(p);
    return of(p).pipe(delay(300));
  }

  categories(): Observable<Category[]> {
    return of(CATEGORIES);
  }
}
