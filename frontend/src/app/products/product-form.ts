import { JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FieldError } from '../shared/ui/field-error';
import { Button } from '../shared/ui/button';
import { noWhitespace, priceRange, uniqueName } from '../shared/validators';
import { NotificationService } from '../core/services/notification.service';
import { ProductsApi } from './products.api';
import { Category } from '../models/product';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, Button, FieldError, JsonPipe],
  template: `
    <h1 class="page-title mb-4">Nuevo producto</h1>
    <form [formGroup]="form" (ngSubmit)="save()" class="max-w-md space-y-4" novalidate>
      <div>
        <input formControlName="name" placeholder="Nombre" [class]="inputClass('name')" />
        <app-field-error [control]="form.controls.name" />
      </div>
      <div>
        <input formControlName="price" type="number" placeholder="Precio" [class]="inputClass('price')" />
        <app-field-error [control]="form.controls.price" />
      </div>
      <div>
        <input formControlName="stock" type="number" placeholder="Stock" [class]="inputClass('stock')" />
        <app-field-error [control]="form.controls.stock" />
      </div>
      <select formControlName="categoryId" [class]="inputClass('categoryId')">
        @for (c of categories(); track c.id) {
          <option [value]="c.id">{{ c.name }}</option>
        }
      </select>

      <app-button type="submit" [disabled]="form.pending">Guardar</app-button>
    </form>

    <!-- Estados del formulario, para clase -->
    <pre class="mt-6 max-w-md rounded-lg bg-slate-900 p-3 text-xs text-green-300">
valid: {{ form.valid }}  invalid: {{ form.invalid }}  pending: {{ form.pending }}
dirty: {{ form.dirty }}  touched: {{ form.touched }}
errors(name): {{ form.controls.name.errors | json }}</pre>
  `,
})
export class ProductForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(ProductsApi);
  private notify = inject(NotificationService);
  categories = signal<Category[]>([]);

  private cdr = inject(ChangeDetectorRef);

  constructor() {
    // Zoneless: el estado "pending" del validador asíncrono no es un signal; avisamos manualmente.
    this.form.statusChanges.pipe(takeUntilDestroyed()).subscribe(() => this.cdr.markForCheck());
    this.api.categories().subscribe((c) => this.categories.set(c));
  }

  form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(3), noWhitespace],
      asyncValidators: [uniqueName(['Teclado mecánico', 'Lámpara LED', 'Clean Code'])],
    }),
    price: [0, [Validators.required, priceRange(1, 10000)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoryId: [1, Validators.required],
  });

  // UX: borde rojo solo cuando el usuario ya interactuó
  inputClass(name: keyof typeof this.form.controls) {
    const c = this.form.controls[name];
    const bad = c.invalid && (c.touched || c.dirty);
    return `w-full rounded-lg border px-3 py-2 ${bad ? 'border-red-500 bg-red-50' : 'border-slate-300'}`;
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // muestra todos los errores pendientes
      return;
    }
    this.api.create(this.form.getRawValue()).subscribe((p) => {
      this.notify.success(`Producto "${p.name}" creado`);
      this.router.navigate(['/products']);
    });
  }
}
