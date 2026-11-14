# 8. Routing con standalone

**Duración:** 4 h · **Bloque 3** · **Tag del proyecto:** `tema-08`

## Objetivos
- Configurar el router en una app standalone.
- Definir rutas, incluyendo carga diferida (*lazy loading*) con `loadComponent`.
- Mostrar componentes con `RouterOutlet` y navegar con `routerLink` y por código.
- Proteger rutas con un guard funcional (introducción).

## Configuración del router
El router se registra en [`app.config.ts`](../../frontend/src/app/app.config.ts) con `provideRouter`:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    /* ... */
  ],
};
```

Sin `NgModule` ni `RouterModule.forRoot`. Las opciones extra se pasan como funciones `with…` (aquí `withComponentInputBinding`, que se explica en el tema 9).

## Definición de rutas
Las rutas son un arreglo de objetos en [`app.routes.ts`](../../frontend/src/app/app.routes.ts). En el tag `tema-08`:

```ts
export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home').then((m) => m.Home) },
  { path: 'products',     loadComponent: () => import('./products/product-list').then((m) => m.ProductList) },
  { path: 'products/:id', loadComponent: () => import('./products/product-detail').then((m) => m.ProductDetail) },
  { path: 'admin-demo',   canActivate: [demoGuard], loadComponent: () => import('./pages/admin-demo').then((m) => m.AdminDemo) },
  { path: '**',           loadComponent: () => import('./pages/not-found').then((m) => m.NotFound) },
];
```

| Elemento | Significado |
|---|---|
| `path: 'products'` | Se activa con `/products` |
| `path: 'products/:id'` | `:id` es un **parámetro** (`/products/3`) |
| `pathMatch: 'full'` | Para la ruta vacía: solo coincide si la URL es exactamente `/` |
| `loadComponent` | **Carga diferida:** el componente se descarga cuando se visita la ruta |
| `path: '**'` | Comodín: cualquier URL sin coincidencia (página 404). **Siempre al final** |

**El orden importa:** el router usa la primera ruta que coincide. Por eso `'**'` va última y, en el tema 10, `products/new` se declara **antes** de `products/:id` (si no, `new` se leería como un `id`).

### Lazy loading
Con `loadComponent`, cada página queda en su propio archivo JavaScript. Al compilar, se ve así:

```
Initial chunk files      → lo que se descarga al abrir la app
Lazy chunk files
chunk-OFMARYHG.js | product-list  | 26.08 kB
chunk-LJGYPL3R.js | home          | 610 bytes
chunk-T4UNMYOR.js | product-detail| 604 bytes
```

El usuario descarga `product-list` solo si entra a `/products`. Cuanto más grande la app, más se nota la diferencia en el tiempo de carga.

## `RouterOutlet`
Es el "hueco" donde el router coloca el componente de la ruta activa. En el tag `tema-08`, [`app.ts`](../../frontend/src/app/app.ts) tiene una barra de navegación fija y el outlet:

```html
<nav class="flex gap-4 bg-brand-700 px-6 py-3 text-white">
  <a routerLink="/">Inicio</a>
  <a routerLink="/products">Productos</a>
</nav>
<main class="mx-auto max-w-3xl p-6">
  <router-outlet />
</main>
```

Se importan `RouterOutlet` y `RouterLink` en el componente que los usa.

## Navegación
**Declarativa** (en el template):
```html
<a routerLink="/products">Productos</a>
<a [routerLink]="['/products', p.id]">Ver</a>
```

**Programática** (en el código), con `Router`:
```ts
private router = inject(Router);

goToDetail(p: Product) {
  this.router.navigate(['/products', p.id]);
}
```

- `navigate(['/products', 3])` construye `/products/3`.
- `navigateByUrl('/products/3')` recibe la URL completa.
- Úsala tras una acción (guardar un formulario, iniciar sesión) cuando no hay un enlace que pulsar.

Código real: [`products/product-list.ts`](../../frontend/src/app/products/product-list.ts) (`goToDetail`).

## Rutas protegidas (intro)
Un **guard** decide si una ruta puede activarse. Son funciones (`CanActivateFn`) que pueden usar `inject()`:

```ts
export const demoGuard: CanActivateFn = () => {
  const router = inject(Router);
  return localStorage.getItem('demo-access') === '1' ? true : router.createUrlTree(['/']);
};
```

Lo que puede devolver:
- `true` → deja pasar.
- `false` → cancela la navegación.
- un `UrlTree` → **redirige** a otra ruta (lo recomendado).

Se asigna en la ruta:
```ts
{ path: 'admin-demo', canActivate: [demoGuard], loadComponent: /* ... */ }
```

Para probarlo con el tag `tema-08`: entra a `/admin-demo` y te manda a `/`. Después ejecuta en la consola del navegador `localStorage.setItem('demo-access','1')` y vuelve a entrar.

> Este guard solo existe entre los tags `tema-08` y `tema-14`. En el tema 15 se reemplaza por un guard real basado en JWT (`authGuard` y `roleGuard`, en [`core/guards/auth.guard.ts`](../../frontend/src/app/core/guards/auth.guard.ts)).
>
> **Importante:** un guard del frontend mejora la experiencia, **no es seguridad**. Cualquiera puede alterar el navegador. La seguridad real se aplica en la API (tema 15).

## En el proyecto
```bash
git checkout tema-08
cd frontend && npm install && npm start
```
Navega entre Inicio y Productos, abre un detalle con "Ver detalle" (navegación programática), escribe una URL inexistente (`/xyz`) para ver el 404, y prueba el guard.

## Ejercicios
1. Añade la ruta `/about` con su componente cargado de forma diferida y compruébalo en la pestaña **Network** (un nuevo `chunk-*.js`).
2. Haz que `/old-products` redirija a `/products` con `{ path: 'old-products', redirectTo: 'products' }`.
3. Mueve la ruta `**` al principio del arreglo y explica por qué todo se vuelve 404.

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [¿Cómo hacer Lazy loading en Angular 17, con Standalone component?](https://www.youtube.com/watch?v=Pgx8pUKZyPA) | Domini Code | ES | Angular 17, el más cercano a este tema |
| [Cómo usar LoadComponent + Standalone Components en Angular](https://www.youtube.com/watch?v=JycU4ovepe4) | nicobytes | ES | `loadComponent` |
| [Cómo trabajar con rutas en angular, parametros, redirecciones, Guard, y lazy loading](https://www.youtube.com/watch?v=WyydiGTOTxQ) | Luis Arias Dev | ES | Visión general; revisa la versión de Angular que usa |
| [Lazy loading rutas Angular - 28 Días aprendiendo Angular #19](https://www.youtube.com/watch?v=dGqMnCUmr30) | Domini Code | ES | Serie; es de una versión anterior |
| [Supercharge Your Angular 19 App with Lazy Loading Techniques & Routing](https://www.youtube.com/watch?v=pu44fnIompg) | Learn Smart Coding | EN | Angular 19 |

## Documentación oficial
- [angular.dev – Routing](https://angular.dev/guide/routing)
- [angular.dev – Define routes](https://angular.dev/guide/routing/define-routes)
- [angular.dev – Route guards](https://angular.dev/guide/routing/route-guards)
