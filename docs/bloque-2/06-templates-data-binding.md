# 6. Templates y data binding

**Duración:** 4 h · **Bloque 2** · **Tag del proyecto:** `tema-06`

## Objetivos
- Conectar el estado del componente con el template con interpolación, property binding y event binding.
- Comunicar componentes con `input()` y `output()`.
- Usar el control flow (`@if`, `@for`) en los templates.

## Resumen de la sintaxis

| Sintaxis | Dirección | Ejemplo |
|---|---|---|
| `{{ expresión }}` | componente → vista | `{{ product().name }}` |
| `[propiedad]="expr"` | componente → vista | `[disabled]="product().stock === 0"` |
| `(evento)="acción"` | vista → componente | `(click)="onAdd()"` |
| `[(ngModel)]="prop"` | ambas (tema 7) | `[(ngModel)]="search"` |

## Interpolación
Muestra el resultado de una expresión como texto:

```html
<p class="text-slate-600">Precio: {{ product().price | currency }}</p>
```

- Puedes usar **pipes** (`| currency`) para formatear.
- Las expresiones deben ser simples: sin asignaciones ni `new`.
- Con signals, se **llaman**: `product()`, no `product`.

## Property binding
Asigna un valor a una **propiedad** del elemento o a un `input` de un componente hijo:

```html
<app-badge [tone]="stockTone()">{{ product().stock }} uds</app-badge>
<app-button [disabled]="product().stock === 0">Agregar</app-button>
```

Diferencia importante:
- `tone="ok"` → texto fijo `"ok"`.
- `[tone]="stockTone()"` → **resultado de una expresión**.

Otros bindings similares: `[class.hidden]="!open()"` (una clase), `[style.width.px]="w"` (un estilo), `[attr.aria-label]="label"` (un atributo HTML).

## Event binding
Reacciona a eventos del DOM o de un componente hijo:

```html
<app-button (click)="onAdd()">Agregar</app-button>
```

`$event` contiene el dato del evento. En un `output()` es el valor emitido:

```html
<app-product-card [product]="p" (add)="onAdd($event)" />
```

## `input()` y `output()`: comunicación entre componentes
Un componente recibe datos con `input()` y avisa al padre con `output()`:

```ts
export class ProductCard {
  product = input.required<Product>();   // obligatorio: el padre debe pasarlo
  add     = output<Product>();           // el padre escucha (add)

  protected stockTone = computed(() => (this.product().stock > 10 ? 'ok' : 'warn'));

  onAdd() { this.add.emit(this.product()); }
}
```

- `input.required<T>()`: el compilador falla si el padre no lo envía.
- `computed()`: valor derivado de otros signals; se recalcula solo cuando cambian.
- Regla: **los datos bajan por `input`, los eventos suben por `output`.**

Código real: [`products/product-card.ts`](../../frontend/src/app/products/product-card.ts) y el padre [`app.ts`](../../frontend/src/app/app.ts).

> **Zoneless:** como este proyecto no usa `zone.js`, Angular actualiza la vista cuando cambia un **signal**, cuando ocurre un **evento** del template o cuando un `async` pipe recibe un valor. Una propiedad normal que cambia dentro de un `setTimeout` o de un `subscribe` **no** refresca la pantalla. Verás esto de nuevo en los temas 11 y 13.

## Control flow: `@if`, `@for`
Reemplaza a `*ngIf` y `*ngFor` y no necesita importar nada:

```html
@if (loading()) {
  <p>Cargando…</p>
} @else if (error()) {
  <p>{{ error() }}</p>
} @else {
  <p>Listo</p>
}

@for (p of products; track p.id) {
  <app-product-card [product]="p" (add)="onAdd($event)" />
} @empty {
  <p>No hay productos.</p>
}
```

- **`track` es obligatorio** en `@for`: identifica cada elemento para que Angular reutilice el DOM al cambiar la lista. Usa un identificador estable (`p.id`), no el índice, si la lista cambia de orden.
- `@empty` se muestra cuando la lista no tiene elementos.
- Más detalle en el [plus de control flow](../plus/02-control-flow.md).

## En el proyecto
```bash
git checkout tema-06
cd frontend && npm install && npm start
```
Verás tres tarjetas de producto. El botón "Agregar" está deshabilitado en el producto sin stock; los demás incrementan el contador. En el "Stock" de cada tarjeta, el color del badge cambia según la cantidad.

## Ejercicios
1. Añade un `@if` que muestre el texto "Agotado" en la tarjeta cuando `stock === 0`.
2. Crea un `output` `details` en `ProductCard` y haz que el padre muestre el nombre del producto en la consola.
3. Cambia el `track p.id` por `track $index` y reordena el array: ¿qué diferencia notas?

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [Angular 17 - Nuevo Control de Flujo Integrado (@if, @for, @switch, @else, @empty)](https://www.youtube.com/watch?v=zHGUC6tguPA) | akotech | ES | Angular 17 |
| [Aprende el nuevo Control de Flujo de Angular 17 #dominicode](https://www.youtube.com/watch?v=dXzWsRygmU4) | Domini Code | ES | Angular 17 |
| [18. Angular 20+ desde cero: Control de flujo con @if, @else if y @for](https://www.youtube.com/watch?v=nc5wCCsGlvk) | Jimmy Javier Dev | ES | Angular 20+ |
| [Angular 21 Control Flow Statements Tutorial: @if, @for Explained](https://www.youtube.com/watch?v=LBVzPjwWy5E) | Tech Stack | EN | Angular 21 |

> No se validó un video específico de interpolación, property y event binding para Angular 17+; los resultados de la búsqueda eran de Angular 11 o anteriores. Para esos tres, apóyate en la documentación oficial.

## Documentación oficial
- [angular.dev – Templates](https://angular.dev/guide/templates)
- [angular.dev – Inputs](https://angular.dev/guide/components/inputs) y [Outputs](https://angular.dev/guide/components/outputs)
- [angular.dev – Control flow](https://angular.dev/guide/templates/control-flow)
