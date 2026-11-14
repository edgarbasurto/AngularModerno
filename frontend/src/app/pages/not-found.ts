import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `<h1 class="page-title">404 – Página no encontrada</h1>
    <a routerLink="/" class="text-brand-600 underline">Volver al inicio</a>`,
})
export class NotFound {}
