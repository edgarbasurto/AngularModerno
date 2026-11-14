import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, Product, ProductDto } from '../models/product';

/** Servicio de DATOS: habla con la API .NET a través del proxy (/api → :5000). */
@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private http = inject(HttpClient);
  private base = environment.apiUrl + '/api';
  private url = `${this.base}/products`;

  getAll(search?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<Product[]>(this.url, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  create(dto: ProductDto): Observable<Product> {
    return this.http.post<Product>(this.url, dto);
  }

  update(id: number, dto: ProductDto): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  categories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }
}
