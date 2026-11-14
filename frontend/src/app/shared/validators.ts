import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { delay, map, of } from 'rxjs';

/** Rechaza valores que son solo espacios. */
export const noWhitespace: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string;
  return value && value.trim().length === 0 ? { whitespace: true } : null;
};

/** Validador con parámetros: fábrica que devuelve un ValidatorFn. */
export function priceRange(min: number, max: number): ValidatorFn {
  return (control) => {
    const v = Number(control.value);
    if (control.value === '' || control.value === null) return null; // required se encarga
    return v < min || v > max ? { priceRange: { min, max, actual: v } } : null;
  };
}

/** Validador asíncrono simulado: consulta (falsa) si el nombre ya existe. */
export function uniqueName(taken: string[]): AsyncValidatorFn {
  return (control) =>
    of(control.value).pipe(
      delay(600),
      map((v: string) =>
        taken.some((t) => t.toLowerCase() === (v ?? '').trim().toLowerCase())
          ? { nameTaken: true }
          : null,
      ),
    );
}
