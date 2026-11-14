# 11. Validaciones y UX

**Duración:** 4 h · **Bloque 4** · **Tag del proyecto:** `tema-11` (con una corrección en `tema-16`, ver más abajo)

## Objetivos
- Usar los validadores nativos de Angular.
- Escribir validadores personalizados (síncronos, con parámetros y asíncronos).
- Mostrar errores de forma clara y reutilizable.
- Leer y aprovechar los estados del formulario.
- Aplicar buenas prácticas de UX.

## Validaciones nativas
`Validators` trae los más comunes:

| Validador | Valida | Clave del error |
|---|---|---|
| `Validators.required` | No vacío | `required` |
| `Validators.minLength(n)` / `maxLength(n)` | Longitud del texto | `minlength` / `maxlength` |
| `Validators.min(n)` / `max(n)` | Valor numérico | `min` / `max` |
| `Validators.email` | Formato de correo | `email` |
| `Validators.pattern(regex)` | Expresión regular | `pattern` |

Se pasan como arreglo cuando hay más de uno:

```ts
stock: [0, [Validators.required, Validators.min(0)]],
```

Cada control tiene `errors`: `null` si es válido, o un objeto con las claves que fallan (`{ required: true }`).

## Validaciones personalizadas
Un validador es una función que recibe el control y devuelve **`null` si es válido** o un **objeto de error** si no ([`shared/validators.ts`](../../frontend/src/app/shared/validators.ts)).

### Síncrono simple
```ts
export const noWhitespace: ValidatorFn = (control) => {
  const value = control.value as string;
  return value && value.trim().length === 0 ? { whitespace: true } : null;
};
```
`required` acepta `"   "` (no está vacío); este validador cierra ese hueco.

### Con parámetros: una *fábrica*
```ts
export function priceRange(min: number, max: number): ValidatorFn {
  return (control) => {
    const v = Number(control.value);
    if (control.value === '' || control.value === null) return null; // required se encarga de eso
    return v < min || v > max ? { priceRange: { min, max, actual: v } } : null;
  };
}

// uso:
price: [0, [Validators.required, priceRange(1, 10000)]],
```
El objeto de error puede llevar datos (`min`, `max`) que luego se usan en el mensaje.

### Asíncrono
Para validar contra algo que tarda (por ejemplo, consultar si un nombre ya existe). Devuelve un `Observable`:

```ts
export function uniqueName(taken: string[]): AsyncValidatorFn {
  return (control) =>
    of(control.value).pipe(
      delay(600), // simula la consulta al servidor
      map((v: string) => taken.some((t) => t.toLowerCase() === (v ?? '').trim().toLowerCase())
        ? { nameTaken: true } : null),
    );
}
```
Se pasa como `asyncValidators`. **Solo se ejecuta si los validadores síncronos pasan**, y mientras tanto el control está en estado `PENDING`.

> En este proyecto la lista de nombres ocupados está escrita a mano (simulación). En una app real, la validación llamaría a un endpoint.

## Manejo de errores visuales
Repetir `@if (control.errors?.['required'])…` en cada campo es tedioso. El componente [`shared/ui/field-error.ts`](../../frontend/src/app/shared/ui/field-error.ts) lo centraliza:

```html
<input formControlName="price" ... />
<app-field-error [control]="form.controls.price" />
```

Un mapa convierte cada clave de error en un mensaje:

```ts
const MESSAGES: Record<string, (e: any) => string> = {
  required:   () => 'Este campo es obligatorio.',
  minlength:  (e) => `Mínimo ${e.requiredLength} caracteres.`,
  priceRange: (e) => `El precio debe estar entre ${e.min} y ${e.max}.`,
  nameTaken:  () => 'Ya existe un producto con ese nombre.',
};
```

El error **solo aparece cuando el usuario ya interactuó** (`touched || dirty`); si no, un formulario recién abierto se vería lleno de errores en rojo.

## Estados de formulario
Todo control y todo grupo exponen estos estados:

| Estado | Significa | Cambia cuando… |
|---|---|---|
| `valid` / `invalid` | Pasa o no los validadores | cambia el valor |
| `pending` | Hay un validador asíncrono en curso | empieza/termina la validación |
| `touched` / `untouched` | El usuario entró y salió del campo (blur) | pierde el foco |
| `dirty` / `pristine` | El usuario modificó el valor | escribe |

El formulario de producto muestra estos valores en vivo en un recuadro oscuro, para que se vean al escribir. Código: [`products/product-form.ts`](../../frontend/src/app/products/product-form.ts).

Acciones útiles:
```ts
save() {
  if (this.form.invalid) {
    this.form.markAllAsTouched(); // muestra todos los errores pendientes
    return;
  }
  /* ... */
}
```
Otras: `reset()`, `patchValue()`, `disable()` / `enable()`.

## Buenas prácticas de UX
- **No muestres errores antes de tiempo:** espera a `touched` o `dirty`.
- **Mensajes accionables:** "El precio debe estar entre 1 y 10000" mejor que "Valor inválido".
- **Marca el campo** (borde rojo, [`inputClass()`](../../frontend/src/app/products/product-form.ts)) además del mensaje; no dependas solo del color.
- **Al enviar con errores**, usa `markAllAsTouched()` para que el usuario vea qué corregir.
- **Deshabilita el envío** mientras haya una validación asíncrona en curso (`form.pending`), para evitar enviar datos sin validar.
- **Feedback de espera:** el texto "Verificando…" mientras `pending`.
- **Valida también en el servidor.** Las validaciones del frontend son comodidad, no seguridad.

## ⚠️ Zoneless: por qué `FieldError` y `ProductForm` usan `markForCheck()`
Este proyecto no usa `zone.js`. Cuando un validador asíncrono termina (al cabo de 600 ms) **nadie le avisa a la vista**: el estado `pending` cambia, pero no es un signal, así que Angular no vuelve a pintar hasta el siguiente evento del usuario.

La solución, en ambos componentes, es avisar con `ChangeDetectorRef.markForCheck()` al emitirse `statusChanges`:

```ts
this.form.statusChanges.pipe(takeUntilDestroyed()).subscribe(() => this.cdr.markForCheck());
```

> **Sobre los tags:** esta corrección se hizo al final del proyecto, después de revisar la compatibilidad con zoneless. **El tag `tema-11` no la incluye**: allí, el "Verificando…" puede no desaparecer hasta que muevas el ratón o pulses una tecla. El tag `tema-16` sí la tiene. Es un buen ejercicio de clase: reproducir el fallo y corregirlo.

## En el proyecto
```bash
git checkout tema-16   # incluye la corrección zoneless
cd frontend && npm install && npm start
```
Ve a `/products/new` y prueba:
1. Escribe `  ` (solo espacios) en el nombre → error "No puede contener solo espacios".
2. Escribe `Lámpara LED` → "Verificando…" y luego "Ya existe un producto con ese nombre".
3. Precio `0` → error de rango. Pulsa "Guardar" con el formulario vacío → todos los errores aparecen.

## Ejercicios
1. Escribe un validador `skuFormat` que acepte solo `ABC-123` (3 letras, guion, 3 números).
2. Añade un validador a nivel de **grupo** que exija `stock > 0` cuando el precio sea mayor a 1000.
3. Muestra el mensaje de error de `pattern` en `FieldError`.

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [Validators en los Formularios Reactivos de Angular V19: ¡Incluye Custom Validators!](https://www.youtube.com/watch?v=83Cg94Zfh_c) | CodeScript | ES | Angular 19, el más actual |
| [Validación Avanzada de Formularios Reactivos - Angular 18](https://www.youtube.com/watch?v=FWuAS5iR_to) | DevCuellar | ES | Angular 18 |
| [Validaciones Personalizadas para Formularios Reactivos en Angular](https://www.youtube.com/watch?v=mztFPQeO6CA) | Juan Cabello \| iTana | ES | Validadores propios |
| [Angular - Validators en Formularios Reactivos - Cómo hacer validaciones y reset](https://www.youtube.com/watch?v=U1zcI4JqNpw) | AMazaing Code | ES | Validadores y `reset` |
| [17 - Formularios reactivos (Validators) \| Curso aprende Angular desde cero](https://www.youtube.com/watch?v=PqJ_PKcIoWQ) | Coders Free | ES | Base |

## Documentación oficial
- [angular.dev – Validación en formularios reactivos](https://angular.dev/guide/forms/form-validation)
- [angular.dev – Validadores asíncronos](https://angular.dev/guide/forms/form-validation#creating-asynchronous-validators)
