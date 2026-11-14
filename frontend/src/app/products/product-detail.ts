import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  template: `
    <h1 class="page-title">Detalle del producto</h1>
    <p class="mt-2">Aquí irá el detalle (tema 9 añade el parámetro de ruta).</p>
    <a routerLink="/products" class="text-brand-600 underline">← Volver</a>
  `,
})
export class ProductDetail {}
