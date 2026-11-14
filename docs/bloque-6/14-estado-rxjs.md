# 14. Manejo de estado sin Signals

**Duración:** 2 h · **Bloque 6** · **Tag del proyecto:** `tema-14`

## Objetivos
- Distinguir estado local de estado compartido.
- Construir un *store* con un servicio y `BehaviorSubject`.
- Consumir el estado con el `async` pipe.
- Reconocer patrones simples de estado y compararlo con la versión de Signals.

> **Contexto:** en el resto del curso se usan signals "donde convenga" (inputs, estado de pantalla). Este tema muestra la alternativa clásica con **RxJS**, que sigue siendo muy común en proyectos existentes y que necesitas conocer.

## Estado local
Es el estado que solo le importa a **un componente**: si un panel está abierto, el texto de un buscador, si una lista está cargando.

- Vive **dentro del componente** (propiedad o signal).
- No necesita un servicio.
- Ejemplos del proyecto: `sidebarOpen` en `MainLayout`, `search` y `loading` en `ProductList`.

**Regla:** empieza siempre con estado local. Súbelo a un servicio solo cuando **dos o más** partes distantes de la app necesiten el mismo dato.

## Servicios como store
Un servicio `providedIn: 'root'` es un singleton: todos los componentes que lo inyectan ven **el mismo objeto**. Eso lo convierte en un almacén de estado compartido.

En el proyecto: el **carrito**. Lo modifica `ProductList` (al agregar), lo muestra `CartPage` y lo cuenta el navbar de `MainLayout`: tres sitios distintos que necesitan el mismo dato.

## RxJS y `BehaviorSubject`
**RxJS** modela datos que cambian en el tiempo como *flujos* (`Observable`). Un **`BehaviorSubject`** es un flujo especial que:

1. **Guarda el valor actual** (`.value`), y siempre tiene uno (hay que darle un valor inicial).
2. **Emite ese valor a quien se suscriba**, incluso si se suscribe tarde.
3. Permite **empujar** valores nuevos con `.next(valor)`.

Eso es exactamente lo que necesita un store.

### El store del carrito
[`cart/cart.store.ts`](../../frontend/src/app/cart/cart.store.ts):

```ts
@Injectable({ providedIn: 'root' })
export class CartStore {
  // Estado privado: solo este servicio lo modifica
  private readonly state$ = new BehaviorSubject<CartItem[]>([]);

  // Estado público de solo lectura, derivado con operadores
  readonly items$ = this.state$.asObservable();
  readonly count$ = this.items$.pipe(map((items) => items.reduce((n, i) => n + i.qty, 0)));
  readonly total$ = this.items$.pipe(
    map((items) => items.reduce((sum, i) => sum + i.qty * i.product.price, 0)),
  );

  add(product: Product) {
    const items = this.state$.value;                       // valor actual, síncrono
    const found = items.find((i) => i.product.id === product.id);
    this.state$.next(                                      // se emite un array NUEVO
      found
        ? items.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i))
        : [...items, { product, qty: 1 }],
    );
  }

  remove(productId: number) { this.state$.next(this.state$.value.filter((i) => i.product.id !== productId)); }
  clear() { this.state$.next([]); }
}
```

Tres decisiones importantes:
- **El subject es privado; se expone `asObservable()`.** Nadie fuera del store puede llamar `next()`: los cambios pasan por `add`, `remove`, `clear`.
- **Inmutabilidad:** cada cambio emite un array **nuevo** (`[...items, x]`, `map`, `filter`), nunca se modifica el anterior (`items.push`). Así los suscriptores y Angular detectan el cambio con claridad.
- **Estado derivado con `map`:** `count$` y `total$` se calculan desde `items$`; no se guardan aparte (y no se desincronizan).

### Consumir el estado con el `async` pipe
[`cart/cart-page.ts`](../../frontend/src/app/cart/cart-page.ts):

```html
@if (store.items$ | async; as items) {
  @for (i of items; track i.product.id) {
    <li>{{ i.product.name }} × {{ i.qty }} ... {{ i.qty * i.product.price | currency }}</li>
  }
  <p>Total: {{ store.total$ | async | currency }}</p>
}
```

El `async` pipe:
- **se suscribe** al observable al crear la vista,
- **actualiza** la pantalla cada vez que llega un valor (también en zoneless),
- **se desuscribe solo** al destruirse: no hay fugas de memoria.

Por eso es la forma preferida: evita el `subscribe()` manual y el `ngOnDestroy`.

Y el contador del navbar ([`layouts/main-layout.ts`](../../frontend/src/app/layouts/main-layout.ts)):
```html
<ng-icon name="heroShoppingCart" /> {{ cart.count$ | async }}
```

## Patrones simples de estado
| Patrón | Idea | Cuándo |
|---|---|---|
| **Estado local** | Propiedad/signal en el componente | Estado de una sola pantalla |
| **Servicio + `BehaviorSubject`** | Store singleton, `$` para observables | Estado compartido moderado (carrito, usuario, filtros) |
| **Observable derivado** | `map`, `combineLatest` desde el store | Totales, listas filtradas |
| **Store con librería** (NgRx, etc.) | Acciones, reducers, efectos | Estado grande y complejo, equipos grandes |

**Convención:** el sufijo `$` marca los observables (`items$`).

**Trampas frecuentes:**
- Suscribirse con `.subscribe()` a mano y olvidar cancelar.
- Mutar el array/objeto en vez de crear uno nuevo.
- Exponer el `BehaviorSubject` directamente (cualquiera puede `next()`).
- Poner en un store estado que solo necesita un componente.

## Comparación con Signals
Misma lógica, con signals, en [`cart/cart.store.signals.ts`](../../frontend/src/app/cart/cart.store.signals.ts) (archivo de comparación; la app **no** lo usa):

```ts
@Injectable({ providedIn: 'root' })
export class CartSignalStore {
  private readonly _items = signal<CartItem[]>([]);
  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().reduce((n, i) => n + i.qty, 0));
  readonly total = computed(() => this._items().reduce((s, i) => s + i.qty * i.product.price, 0));

  add(product: Product) {
    this._items.update((items) => { /* igual que arriba, devolviendo el array nuevo */ });
  }
}
```

| | `BehaviorSubject` | `signal` |
|---|---|---|
| Valor actual | `.value` | `items()` |
| Cambiar | `.next(x)` | `.set(x)` / `.update(fn)` |
| Derivar | `pipe(map(...))` | `computed(...)` |
| Leer en template | `\| async` | `items()` (sin pipe) |
| Suscripción manual | Sí, hay que gestionarla | No existe |
| Mejor para | Flujos de eventos en el tiempo (`debounceTime`, `switchMap`, HTTP) | Estado de la vista |

**Criterio:** signals para el **estado**; RxJS para los **flujos asíncronos** (HTTP, eventos, temporizadores). Se pueden combinar (`toSignal`, `toObservable`).

## En el proyecto
```bash
git checkout tema-14
cd frontend && npm install && npm start     # con la API corriendo para ver productos
```
En `/products` pulsa "Agregar" en varias tarjetas: el número del carrito, en el navbar, sube. Entra a **Carrito** (`/cart`): ves las líneas y el total. Recarga la página: el carrito se **vacía** (vive solo en memoria).

## Ejercicios
1. Persiste el carrito en `localStorage`: al iniciar, lee el valor; en cada `next`, guárdalo.
2. Añade un método `decrease(productId)` que reduzca la cantidad y elimine la línea al llegar a 0.
3. Crea `isEmpty$` derivado de `items$` y úsalo en el navbar para ocultar el contador cuando sea 0.

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [💥 RxJs Store Service Design with BehaviorSubject](https://www.youtube.com/watch?v=WxZrRt3qd1s) | Angular University | EN | Es exactamente el patrón del tema; algo antiguo |
| [#74 Mastering BehaviorSubject for State Management in Angular 19](https://www.youtube.com/watch?v=VBCzJrLM17A) | Technical Rajni | EN | Angular 19 |
| [Angular 16 Subject vs Behavior Subject - State Management](https://www.youtube.com/watch?v=D-zmaR7rOAQ) | Programming with Umair | EN | Diferencias entre `Subject` y `BehaviorSubject` |
| [My go to way to manage state in Angular applications](https://www.youtube.com/watch?v=JnwjU06yoEE) | Joshua Morony | EN | Opinión sobre un enfoque simple de estado |

> No se encontraron videos en español sobre este tema que se pudieran validar y fueran de una versión reciente de Angular.

## Documentación oficial
- [RxJS – BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject)
- [angular.dev – `AsyncPipe`](https://angular.dev/api/common/AsyncPipe)
- [angular.dev – Interoperabilidad RxJS y signals](https://angular.dev/ecosystem/rxjs-interop)
