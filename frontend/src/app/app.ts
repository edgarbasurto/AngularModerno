import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="flex gap-4 bg-brand-700 px-6 py-3 text-white">
      <a routerLink="/">Inicio</a>
      <a routerLink="/products">Productos</a>
      <a routerLink="/admin-demo">Admin (guard)</a>
    </nav>
    <main class="mx-auto max-w-3xl p-6">
      <router-outlet />
    </main>
  `,
})
export class App {}
