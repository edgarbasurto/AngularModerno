import { Component } from '@angular/core';
import { Badge } from './shared/ui/badge';
import { Button } from './shared/ui/button';
import { Card } from './shared/ui/card';

@Component({
  selector: 'app-root',
  imports: [Button, Card, Badge],
  template: `
    <main class="mx-auto max-w-3xl space-y-4 p-6">
      <h1 class="page-title">MiniInventario</h1>
      <app-card title="Teclado mecánico">
        <p>Stock disponible <app-badge tone="ok">25 uds</app-badge></p>
        <ng-container card-actions>
          <app-button icon="heroPencilSquare" variant="secondary">Editar</app-button>
          <app-button icon="heroTrash" variant="danger">Eliminar</app-button>
        </ng-container>
      </app-card>
    </main>
  `,
})
export class App {}
