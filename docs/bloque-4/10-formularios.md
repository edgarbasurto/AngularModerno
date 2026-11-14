# 10. Formularios en Angular

**Duración:** 4 h · **Bloque 4** · **Tag del proyecto:** `tema-10`

## Objetivos
- Distinguir los dos enfoques de formularios: *template-driven* y *reactive*.
- Construir un formulario reactivo con `FormGroup`, `FormControl` y `FormBuilder`.
- Estilizar formularios con Tailwind.
- Aplicarlo a casos del proyecto.

## Dos enfoques

| | Template-driven | Reactive |
|---|---|---|
| Dónde se define | En el HTML (`ngModel`) | En TypeScript |
| Módulo a importar | `FormsModule` | `ReactiveFormsModule` |
| Validaciones | Atributos HTML (`required`, `email`) | Funciones (`Validators.required`) |
| Control sobre el estado | Limitado | Total (leer, cambiar, escuchar) |
| Pruebas | Más difícil | Más fácil (no requiere DOM) |
| Cuándo usarlo | Formularios pequeños y simples | Formularios reales: varios campos, validación, lógica |

**Regla del curso:** formularios simples → template-driven; todo lo demás → reactive.

> Angular 21 incluye también *Signal Forms*, un tercer enfoque en estado **experimental**. Este curso no lo usa; se menciona en el [plus de novedades](../plus/01-novedades-angular-21.md).

## Template-driven forms
El formulario nace del HTML. Cada campo lleva `name` y `ngModel`; `#f="ngForm"` da acceso al estado del formulario.

```html
<form #f="ngForm" (ngSubmit)="send(f.value)" class="max-w-md space-y-3">
  <input name="name" [(ngModel)]="model.name" required
         class="w-full rounded-lg border border-slate-300 px-3 py-2" />
  <input name="email" type="email" [(ngModel)]="model.email" required email />
  <textarea name="message" [(ngModel)]="model.message" required></textarea>
  <app-button type="submit" [disabled]="f.invalid ?? true">Enviar</app-button>
</form>
```

Puntos clave:
- **`name` es obligatorio** en cada `ngModel` dentro de un `<form>`; sin él, Angular lanza un error.
- `f.invalid` vale `true` si algún campo es inválido. Su tipo es `boolean | null`, por eso `?? true` (con TypeScript estricto, el compilador lo exige).
- `(ngSubmit)` se dispara al enviar (botón `type="submit"` o Enter).

Código real: [`pages/contact.ts`](../../frontend/src/app/pages/contact.ts). Ruta: `/contact`.

## Reactive forms
Aquí el formulario es un **objeto en el código** y el template solo se conecta a él.

### `FormControl`, `FormGroup`, `FormBuilder`
| Clase | Qué representa |
|---|---|
| `FormControl` | Un campo (valor + estado + validadores) |
| `FormGroup` | Un conjunto de controles (el formulario completo, o una sección) |
| `FormBuilder` | Atajo para crear grupos y controles con menos código |

Con `FormBuilder`:

```ts
export class ProductForm {
  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    name:       ['', Validators.required],
    price:      [0,  Validators.required],
    stock:      [0,  Validators.required],
    categoryId: [1,  Validators.required],
  });

  // FormControl suelto, útil para un campo aislado (ej. un buscador)
  searchControl = new FormControl('', { nonNullable: true });
}
```

- **`nonNullable`** hace que `reset()` vuelva al valor inicial (y no a `null`) y que los tipos sean `string`, no `string | null`. Casi siempre es lo que quieres.
- Los tipos se **infieren**: `form.getRawValue()` devuelve `{ name: string; price: number; … }`.
- La forma equivalente sin `FormBuilder` sería `new FormGroup({ name: new FormControl('', ...) })`.

Y en el template:

```html
<form [formGroup]="form" (ngSubmit)="save()" class="max-w-md space-y-3">
  <input formControlName="name" placeholder="Nombre" />
  <input formControlName="price" type="number" />
  <select formControlName="categoryId">
    @for (c of categories; track c.id) {
      <option [value]="c.id">{{ c.name }}</option>
    }
  </select>
  <app-button type="submit" [disabled]="form.invalid">Guardar</app-button>
</form>
```

- `[formGroup]` conecta el `<form>` con el objeto.
- `formControlName="name"` conecta cada campo con su control por nombre.
- `form.invalid` es un `boolean` simple (a diferencia del template-driven).

> **Detalle:** el valor de un `<select>` llega como **string** (`"1"`). Si tu modelo espera un número, conviértelo antes de enviar (`Number(value)`) o usa `[ngValue]` en las `<option>`.

Código real: [`products/product-form.ts`](../../frontend/src/app/products/product-form.ts) (hoy incluye los validadores del tema 11). Ruta: `/products/new`.

## Estilizado con Tailwind
Los campos de formulario no traen estilo de Tailwind por defecto (su *reset* los deja sin borde). Una base común:

```html
<input class="w-full rounded-lg border border-slate-300 px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-brand-500" />
```

Para no repetir esa cadena en cada campo:
- crea un **componente** de input, o
- usa `@layer components { .field { @apply ... } }` en `styles.css`, o
- calcula la clase con un método (lo que hace el tema 11 con `inputClass()`).

El plugin oficial `@tailwindcss/forms` también da una base consistente (no está instalado en este proyecto).

## Casos reales del proyecto
| Formulario | Enfoque | Por qué |
|---|---|---|
| Contacto | Template-driven | 3 campos, validación mínima |
| Nuevo producto | Reactive | Validaciones, selects, lógica de guardado |
| Login (tema 15) | Reactive | Estado de envío, manejo de error |

## En el proyecto
```bash
git checkout tema-10
cd frontend && npm install && npm start
```
Prueba `/contact` (el botón se habilita al completar los campos) y `/products/new` (guarda en consola y vuelve al listado).

## Ejercicios
1. Añade un campo `phone` al formulario de contacto, con `pattern="[0-9]{7,10}"`.
2. Añade `description` al formulario de producto y muéstrala en consola al guardar.
3. Haz un `FormGroup` anidado `dimensions: { width, height }` y conéctalo con `formGroupName`.

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [FORMULARIOS REACTIVOS EN ANGULAR - 28 Días aprendiendo Angular #14](https://www.youtube.com/watch?v=epSVNMtG80I) | Domini Code | ES | Serie de una versión anterior; el concepto vale |
| [Angular reactive forms](https://www.youtube.com/watch?v=VLYc3ACWL-E) | kudvenkat | EN | Curso extenso; es de una versión antigua (usa módulos) |
| [Mastering Angular: Template-driven vs Reactive Forms, Simplified!](https://www.youtube.com/watch?v=5TNXdwC949A) | CrioDo | EN | Comparación |
| [The Great Angular Forms Debate: Template-Driven vs Reactive](https://www.youtube.com/watch?v=_z04KmCmCt0) | Smoothstack | EN | Comparación |
| [17 - Formularios reactivos (Validators) \| Curso aprende Angular desde cero](https://www.youtube.com/watch?v=PqJ_PKcIoWQ) | Coders Free | ES | Formularios reactivos con validadores |

> Los videos de `kudvenkat` y varios de la tabla usan `NgModule` (`imports: [ReactiveFormsModule]` en un módulo). En este curso se importa en el componente standalone.

## Documentación oficial
- [angular.dev – Forms](https://angular.dev/guide/forms)
- [angular.dev – Reactive forms](https://angular.dev/guide/forms/reactive-forms)
- [angular.dev – Template-driven forms](https://angular.dev/guide/forms/template-driven-forms)
