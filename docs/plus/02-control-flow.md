# Plus 2. Control flow: `@if`, `@for`, `@switch`, `@defer`

El control flow integrado (desde Angular 17) reemplaza a las directivas `*ngIf`, `*ngFor` y `*ngSwitch`. No requiere importar nada.

## `@if`
```html
@if (loading()) {
  <p>Cargando…</p>
} @else if (error()) {
  <p>{{ error() }}</p>
} @else {
  <p>Listo</p>
}
```
Con alias: `@if (product(); as p) { {{ p.name }} }` (se usa en [`product-detail.ts`](../../frontend/src/app/products/product-detail.ts)).

## `@for`
```html
@for (p of filtered(); track p.id) {
  <app-product-card [product]="p" />
} @empty {
  <p>Sin resultados.</p>
}
```
- `track` es **obligatorio**: usa un identificador estable.
- Variables disponibles: `$index`, `$first`, `$last`, `$even`, `$odd`, `$count`.
- Ejemplo real: [`product-list.ts`](../../frontend/src/app/products/product-list.ts).

## `@switch`
```html
@switch (status()) {
  @case ('ok')   { <app-badge tone="ok">Disponible</app-badge> }
  @case ('warn') { <app-badge tone="warn">Pocas unidades</app-badge> }
  @default       { <app-badge>Sin datos</app-badge> }
}
```

## `@let`
Declara una variable local en el template:
```html
@let total = qty() * price();
<p>Total: {{ total | currency }}</p>
```
Si declaras una variable y no la lees, el compilador avisa (`NG8112`): sucedió durante este curso al probar una idea y se descartó.

## `@defer`
Carga una parte del template **de forma diferida**, sin crear una ruta:
```html
@defer (on viewport) {
  <app-big-chart />
} @placeholder {
  <p>El gráfico aparecerá aquí…</p>
} @loading {
  <p>Cargando…</p>
}
```
`@defer` **no se usa en MiniInventario**; se incluye como referencia. Revisa la documentación oficial para los *triggers* disponibles (`on idle`, `on viewport`, `on interaction`, `on timer`, `when condición`).

## Migrar código antiguo
El CLI incluye una migración automática (aparece en uno de los videos de abajo):
```bash
ng generate @angular/core:control-flow
```

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [Angular 17 - Nuevo Control de Flujo Integrado. (@if, @for, @switch, @else, @empty)](https://www.youtube.com/watch?v=zHGUC6tguPA) | akotech | ES | Angular 17 |
| [Aprende el nuevo Control de Flujo de Angular 17 #dominicode](https://www.youtube.com/watch?v=dXzWsRygmU4) | Domini Code | ES | Angular 17 |
| [18. Angular 20+ desde cero: Control de flujo con @if, @else if y @for](https://www.youtube.com/watch?v=nc5wCCsGlvk) | Jimmy Javier Dev | ES | Angular 20+ |
| [13. Angular 20+ desde cero: Migración de directivas ngIf, ngFor y ngSwitch con comando "control-flow"](https://www.youtube.com/watch?v=VAWlMGeYQ6s) | Jimmy Javier Dev | ES | Migración automática |
| [Angular 21 Control Flow Statements Tutorial: @if, @for Explained](https://www.youtube.com/watch?v=LBVzPjwWy5E) | Tech Stack | EN | Angular 21 |

> No se encontró un video específico de `@defer` que se pudiera validar. Usa la documentación oficial.

## Documentación oficial
- [angular.dev – Control flow](https://angular.dev/guide/templates/control-flow)
- [angular.dev – Deferrable views](https://angular.dev/guide/templates/defer)
- [angular.dev – Variables locales (`@let`)](https://angular.dev/guide/templates/variables)
