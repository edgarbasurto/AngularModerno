import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-placeholder',
  imports: [RouterLink],
  template: `<h1 class="page-title mb-2">Ingresar</h1>
    <p class="text-slate-600">El formulario real llega en los temas 10 y 15.</p>
    <a routerLink="/" class="mt-4 inline-block text-brand-600 underline">Volver</a>`,
})
export class LoginPlaceholder {}
