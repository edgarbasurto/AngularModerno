# 5. Componentes standalone

**Duración:** 3 h · **Bloque 2** · **Tag del proyecto:** `tema-05`

## Objetivos
- Crear componentes standalone y entender qué declaran.
- Escribir templates y aplicar estilos con Tailwind.
- Seguir las convenciones de nombres de Angular 20+.
- Construir componentes de UI reutilizables con `input()`, `computed()` y proyección de contenido.

## Creación de componentes standalone
```bash
ng generate component shared/ui/button
```

El CLI crea el componente ya como standalone. Su forma mínima:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-badge',
  template: `<span><ng-content /></span>`,
})
export class Badge {}
```

Las propiedades del decorador `@Component`:

| Propiedad | Qué hace |
|---|---|
| `selector` | Nombre de la etiqueta HTML (`<app-badge>`) |
| `template` / `templateUrl` | HTML del componente (en línea o en archivo aparte) |
| `imports` | Otros componentes, directivas y pipes que **usa su template** |
| `styles` / `styleUrl` | Estilos encapsulados |
| `providers` | Servicios con alcance de componente (tema 12) |

Para usar un componente dentro de otro, el padre lo **importa**:

```ts
@Component({
  selector: 'app-root',
  imports: [Button, Card, Badge],   // ← sin esto, Angular no reconoce <app-card>
  template: `<app-card title="Teclado"> ... </app-card>`,
})
export class App {}
```

> Si olvidas añadirlo a `imports`, el compilador falla con un error `NG8001`/`NG8002` indicando que el elemento desconocido.

## Templates
Puedes escribir el HTML:
- **En línea** (`template: \`...\``): cómodo para componentes pequeños. Es lo que usa este proyecto.
- **En archivo** (`templateUrl: './button.html'`): mejor cuando el HTML pasa de unas 30 líneas.

Elige uno por equipo y sé consistente.

## Estilos con Tailwind
Las clases de Tailwind van directamente en el template. Para variantes de un componente (primario, secundario, peligro), se calcula la cadena de clases con `computed()`:

```ts
protected classes = computed(() => {
  const base = 'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition';
  const styles = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  return `${base} ${styles[this.variant()]}`;
});
```

> **Importante:** Tailwind solo genera las clases que encuentra **escritas completas** en el código. `'bg-' + color + '-600'` **no funciona**; escribe la clase entera (`'bg-red-600'`) como arriba.

Código real: [`shared/ui/button.ts`](../../frontend/src/app/shared/ui/button.ts).

## Convenciones de nombres
| | Angular 19 y anteriores | Angular 20+ (este curso) |
|---|---|---|
| Archivo | `button.component.ts` | `button.ts` |
| Clase | `ButtonComponent` | `Button` |
| Servicio | `products.service.ts` → `ProductsService` | `products.api.ts` → `ProductsApi` (el nombre dice qué hace) |
| Selector | `app-button` | `app-button` (con prefijo `app-`) |

Reglas útiles:
- **Selector con prefijo** (`app-`) para no chocar con etiquetas HTML ni librerías.
- **Un componente por archivo**; el nombre del archivo en minúsculas con guiones (`product-card.ts`).
- **Nombre de clase que describe la función**: `ProductCard`, no `Card2`.
- Si trabajas en un proyecto existente con `.component.ts`, **respeta ese estilo**: no mezcles convenciones.

## Componentes de UI reutilizables
Un buen componente de UI recibe datos por `input()`, expone eventos con `output()` (tema 6) y deja el contenido flexible con `<ng-content>`.

### `Button`: inputs con valor por defecto
```ts
export class Button {
  variant  = input<Variant>('primary');
  type     = input<'button' | 'submit'>('button');
  icon     = input<string>();          // opcional
  disabled = input(false);
}
```
```html
<app-button variant="danger" icon="heroTrash">Eliminar</app-button>
```

### `Card`: proyección de contenido
`<ng-content>` coloca el contenido que el padre escribe dentro de la etiqueta. Con `select` se definen **ranuras** con nombre:

```html
<!-- card.ts -->
<section class="rounded-xl border bg-white p-4 shadow-sm">
  <h3>{{ title() }}</h3>
  <ng-content />                              <!-- contenido principal -->
  <div class="mt-3 flex gap-2">
    <ng-content select="[card-actions]" />    <!-- ranura de acciones -->
  </div>
</section>
```
```html
<!-- uso -->
<app-card title="Teclado mecánico">
  <p>Stock disponible</p>
  <ng-container card-actions>
    <app-button>Editar</app-button>
  </ng-container>
</app-card>
```

### `Badge`: variantes con `computed()`
```html
<app-badge tone="ok">25 uds</app-badge>
```

Código real: [`card.ts`](../../frontend/src/app/shared/ui/card.ts) y [`badge.ts`](../../frontend/src/app/shared/ui/badge.ts).

**Criterio para extraer un componente:** si un fragmento se repite 3 o más veces, o si tiene su propia lógica, o si su nombre explica mejor la intención (`<app-badge>` dice más que un `<span class="...">`).

## En el proyecto
```bash
git checkout tema-05
cd frontend && npm install && npm start
```
Verás una tarjeta con un badge y dos botones. Tres componentes de [`shared/ui/`](../../frontend/src/app/shared/ui) se combinan en [`app.ts`](../../frontend/src/app/app.ts).

## Ejercicios
1. Añade la variante `ghost` a `Button` (sin fondo, solo texto).
2. Crea `Alert` con tonos `info`, `warn` y `error`, usando `computed()` para las clases.
3. Añade a `Card` una segunda ranura `[card-footer]`.

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [Angular v18 desde cero - 02 Crea Componentes Standalone en Angular 18](https://www.youtube.com/watch?v=dc8uiXLylUU) | jftics | ES | Creación paso a paso (Angular 18) |
| [Standalone components en Angular](https://www.youtube.com/watch?v=Verv9Io48ew) | DiscoDurodeRoer | ES | Introducción al concepto |
| [Mejora tu Proyecto con Standalone en Angular 17](https://www.youtube.com/watch?v=QhcHweiN2ww) | Code Craft Zone | ES | Angular 17 |
| [Nuevos Componentes STANDALONE en Angular. Adiós módulos](https://www.youtube.com/watch?v=FUXM-Qxvfqg) | EfisioDev \| Aprende Angular | ES | Explica la motivación |
| [De Módulos a Standalone en Angular – Migración paso a paso](https://www.youtube.com/watch?v=cWB2p_kxbS4) | NgTutos 4U | ES | Útil si trabajas con proyectos con `NgModule` |

## Documentación oficial
- [angular.dev – Anatomy of a component](https://angular.dev/guide/components)
- [angular.dev – Content projection](https://angular.dev/guide/components/content-projection)
- [angular.dev – Style guide](https://angular.dev/style-guide)
