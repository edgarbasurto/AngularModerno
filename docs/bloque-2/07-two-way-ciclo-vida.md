# 7. Two-way binding, ciclo de vida y buenas prácticas en templates

**Duración:** 3 h · **Bloque 2** · **Tag del proyecto:** `tema-07`

## Objetivos
- Usar `[(ngModel)]` y entender qué hace por dentro.
- Conocer los hooks del ciclo de vida más usados y cuándo ejecuta cada uno.
- Escribir templates limpios, eficientes y fáciles de mantener.

## Two-way binding (`ngModel`)
`[(ngModel)]` mantiene sincronizados un campo de formulario y una propiedad del componente en **ambos sentidos**. Se lee "banana in a box": `[( )]`.

```html
<input [(ngModel)]="search" placeholder="Buscar producto..." />
```

Es la abreviatura de:

```html
<input [ngModel]="search" (ngModelChange)="search = $event" />
```

Requiere importar `FormsModule`:

```ts
@Component({
  imports: [FormsModule],
  /* ... */
})
```

Funciona también con **signals escribibles**, sin cambiar la sintaxis:

```ts
search = signal('');
// <input [(ngModel)]="search" />   → escribe en el signal
// this.search()                     → lo lee
```

Esto es lo que usa [`product-list.ts`](../../frontend/src/app/products/product-list.ts) desde el tema 12.

> **Cuándo usarlo:** formularios simples y buscadores. Para formularios con validaciones y varios campos, usa **Reactive Forms** (tema 10).

## Ciclo de vida básico
Angular crea, actualiza y destruye cada componente. Los **hooks** permiten ejecutar código en esos momentos:

| Orden | Hook | Cuándo ocurre | Uso típico |
|---|---|---|---|
| 1 | `constructor` | Se crea la instancia | Solo `inject()` y asignaciones simples |
| 2 | `ngOnChanges` | Cambia un `@Input`/`input()` | Reaccionar a nuevos valores del padre |
| 3 | `ngOnInit` | Una vez, tras el primer binding | Cargar datos iniciales |
| 4 | `ngOnDestroy` | Justo antes de destruirse | Limpiar suscripciones y temporizadores |

El proyecto incluye un componente que **escribe en consola** cada hook: [`lifecycle-demo.ts`](../../frontend/src/app/products/lifecycle-demo.ts).

```ts
export class LifecycleDemo implements OnChanges, OnInit, OnDestroy {
  label = input('');

  constructor()                       { console.log('[ciclo] constructor'); }
  ngOnChanges(c: SimpleChanges)       { console.log('[ciclo] ngOnChanges', Object.keys(c)); }
  ngOnInit()                          { console.log('[ciclo] ngOnInit'); }
  ngOnDestroy()                       { console.log('[ciclo] ngOnDestroy'); }
}
```

**Experimento (con el tag `tema-07`):** marca y desmarca "Mostrar demo de ciclo de vida", y escribe en el buscador. Observa en la consola que:
- Al mostrarse: `constructor`, `ngOnChanges`, `ngOnInit`.
- Al escribir: solo `ngOnChanges`.
- Al ocultarse: `ngOnDestroy`.

### Constructor vs `ngOnInit`
Los inputs **no están disponibles en el constructor**. La carga de datos va en `ngOnInit` (o en un `effect`, tema 13). El constructor se reserva para `inject()` y poco más.

### Limpieza
Si un componente se suscribe a algo que no termina por sí solo (un `interval`, un `Subject`), debe cancelar la suscripción en `ngOnDestroy` o con `takeUntilDestroyed()`. Un `async` pipe (tema 14) lo hace solo.

> Existen más hooks (`ngAfterViewInit`, `ngDoCheck`…) y funciones modernas como `afterNextRender`. Para empezar, estos cuatro bastan.

## Buenas prácticas en templates

**1. Sin lógica pesada.** El template se evalúa muchas veces. Un método costoso llamado ahí se ejecuta en cada revisión. Calcula con `computed()`:

```ts
// ✗ evita: se llama en cada detección de cambios
filtered() { return this.products.filter(/* ... */); }

// ✓ mejor: se recalcula solo si cambian search o products
filtered = computed(() => {
  const q = this.search().trim().toLowerCase();
  return this.products().filter((p) => p.name.toLowerCase().includes(q));
});
```

**2. `track` estable en `@for`.** Usa el `id`, no el índice, cuando la lista cambia.

**3. Componentes pequeños.** Si un template pasa de 50–80 líneas o repite bloques, extrae un componente (tema 5).

**4. Nombres claros.** `onAdd`, `goToDetail`, `isLoading` dicen más que `click1` o `flag`.

**5. Maneja el vacío y la carga.** Un `@for` sin `@empty` o una lista que carga sin mensaje se siente roto.

**6. Accesibilidad básica.** Botones con icono llevan `aria-label`; los `input` necesitan `placeholder` o `<label>`.

**7. Evita `any`** y variables sueltas en el template. Usa el tipo del modelo ([`models/product.ts`](../../frontend/src/app/models/product.ts)).

> **Nota de versión:** en el tag `tema-07`, `filtered()` aún es un método y `search` una propiedad normal; se convierten en `computed()` y `signal` en el tema 12. Es intencional: así se ve el antes y el después.

## En el proyecto
```bash
git checkout tema-07
cd frontend && npm install && npm start
```
Buscador con `ngModel`, lista filtrada, y el interruptor para ver la demo del ciclo de vida. El componente se reutiliza en el detalle del producto desde el tema 9.

## Ejercicios
1. Añade un segundo input al buscador (por ejemplo, precio máximo) con `ngModel` y filtra por ambos.
2. En `LifecycleDemo`, crea un `setInterval` en `ngOnInit` y límpialo en `ngOnDestroy`. Comprueba qué pasa si no lo limpias.
3. Cambia `filtered()` por un `computed()` y explica por qué ahora hace falta que `search` sea un signal.

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [Angular - ngModel en Angular 17 y 18 - Two way data binding](https://www.youtube.com/watch?v=2NWc1x-VLcM) | AMazaing Code | ES | Angular 17/18, el más actual para este tema |
| [Curso de Angular - Lifecycle Hooks](https://www.youtube.com/watch?v=wACt0pEB3MU) | Moldeo Interactive | ES | Hooks en español |
| [Ciclo de vida de un componente de Angular, ojo con OnChanges() y OnDestroy()](https://www.youtube.com/watch?v=Yvan3OsdcBU) | Luis Arias Dev | ES | Hooks y errores comunes |
| [9 - Eventos de ciclo de vida onChange y onDestroy](https://www.youtube.com/watch?v=yzLosTpVgJk) | Dev Angular | ES | `ngOnChanges` y `ngOnDestroy` |
| [Angular 21 Lifecycle Hooks Explained: ngOnInit, ngAfterViewInit & More](https://www.youtube.com/watch?v=_RoOOS5--uE) | Tech Stack | EN | Angular 21 |

## Documentación oficial
- [angular.dev – Two-way binding](https://angular.dev/guide/templates/two-way-binding)
- [angular.dev – Component lifecycle](https://angular.dev/guide/components/lifecycle)
- [angular.dev – Style guide](https://angular.dev/style-guide)
