import { ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

const MESSAGES: Record<string, (e: any) => string> = {
  required: () => 'Este campo es obligatorio.',
  minlength: (e) => `Mínimo ${e.requiredLength} caracteres.`,
  min: (e) => `El valor mínimo es ${e.min}.`,
  email: () => 'Correo no válido.',
  whitespace: () => 'No puede contener solo espacios.',
  priceRange: (e) => `El precio debe estar entre ${e.min} y ${e.max}.`,
  nameTaken: () => 'Ya existe un producto con ese nombre.',
};

@Component({
  selector: 'app-field-error',
  templateUrl: './field-error.html',
})
export class FieldError {
  control = input.required<AbstractControl>();

  private cdr = inject(ChangeDetectorRef);

  constructor() {
    // Sin zone.js, un validador asíncrono que termina NO refresca la vista solo.
    // markForCheck() le avisa a Angular que vuelva a revisar este componente.
    effect((onCleanup) => {
      const sub = this.control().statusChanges.subscribe(() => this.cdr.markForCheck());
      onCleanup(() => sub.unsubscribe());
    });
  }

  messages() {
    const errors = this.control().errors ?? {};
    return Object.keys(errors).map((k) => MESSAGES[k]?.(errors[k]) ?? 'Valor no válido.');
  }
}
