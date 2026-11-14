import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <main class="mx-auto max-w-3xl p-6">
      <h1 class="page-title">MiniInventario</h1>
      <p class="mt-2 text-slate-600">Tailwind CSS 3 funcionando en Angular 21.</p>
      <button class="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">
        Botón con utilidades
      </button>
    </main>
  `,
  styles: `
    /* Estilo local: solo aplica a este componente */
    p { border-left: 4px solid theme('colors.brand.500'); padding-left: 0.75rem; }
  `,
})
export class App {}
