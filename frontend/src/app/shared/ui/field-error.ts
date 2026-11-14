import { Component, input } from '@angular/core';
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
  template: `
    @if (control().pending) {
      <p class="mt-1 text-xs text-slate-500">Verificando…</p>
    } @else if (control().invalid && (control().touched || control().dirty)) {
      @for (msg of messages(); track msg) {
        <p class="mt-1 text-xs text-red-600">{{ msg }}</p>
      }
    }
  `,
})
export class FieldError {
  control = input.required<AbstractControl>();

  messages() {
    const errors = this.control().errors ?? {};
    return Object.keys(errors).map((k) => MESSAGES[k]?.(errors[k]) ?? 'Valor no válido.');
  }
}
