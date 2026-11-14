import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-root',
  imports: [NgIcon],
  template: `
    <main class="mx-auto max-w-3xl p-6">
      <h1 class="page-title flex items-center gap-2">
        <ng-icon name="heroCube" size="1.75rem" /> MiniInventario
      </h1>
      <p class="mt-2 text-slate-600">Tailwind CSS 3 e iconos con ng-icons.</p>
      <button class="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">
        <ng-icon name="heroPlus" /> Nuevo producto
      </button>
    </main>
  `,
})
export class App {}
