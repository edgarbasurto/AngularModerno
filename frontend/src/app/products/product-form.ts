import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from '../shared/ui/button';
import { CATEGORIES } from './products.data';

/** Reactive forms: el formulario se define en TypeScript. */
@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, Button],
  template: `
    <h1 class="page-title mb-4">Nuevo producto (reactive)</h1>
    <form [formGroup]="form" (ngSubmit)="save()" class="max-w-md space-y-3">
      <input formControlName="name" placeholder="Nombre"
        class="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input formControlName="price" type="number" placeholder="Precio"
        class="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <input formControlName="stock" type="number" placeholder="Stock"
        class="w-full rounded-lg border border-slate-300 px-3 py-2" />
      <select formControlName="categoryId"
        class="w-full rounded-lg border border-slate-300 px-3 py-2">
        @for (c of categories; track c.id) {
          <option [value]="c.id">{{ c.name }}</option>
        }
      </select>
      <app-button type="submit" [disabled]="form.invalid">Guardar</app-button>
    </form>
  `,
})
export class ProductForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  categories = CATEGORIES;

  // FormBuilder: atajo para crear FormGroup y FormControl
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    price: [0, Validators.required],
    stock: [0, Validators.required],
    categoryId: [1, Validators.required],
  });

  // FormControl suelto, útil para un campo aislado (ej. un buscador)
  searchControl = new FormControl('', { nonNullable: true });

  save() {
    console.log('Producto', this.form.getRawValue());
    this.router.navigate(['/products']);
  }
}
