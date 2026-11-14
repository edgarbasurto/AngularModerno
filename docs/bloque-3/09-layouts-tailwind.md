# 9. Layouts y navegación con Tailwind

**Duración:** 4 h · **Bloque 3** · **Tag del proyecto:** `tema-09`

## Objetivos
- Construir layouts base reutilizables con rutas hijas.
- Crear un navbar y un sidebar con Tailwind.
- Leer parámetros de ruta como `input()`.
- Aplicar UX y diseño responsive.

## Layouts base
Un **layout** es un componente que tiene la estructura repetida (navbar, sidebar) y un `<router-outlet />` donde cambian las páginas. En MiniInventario hay dos:

| Layout | Para qué | Archivo |
|---|---|---|
| `MainLayout` | Navbar + sidebar + contenido | [`layouts/main-layout.html`](../../frontend/src/app/layouts/main-layout.html) + [`.ts`](../../frontend/src/app/layouts/main-layout.ts) |
| `AuthLayout` | Una tarjeta centrada (login) | [`layouts/auth-layout.ts`](../../frontend/src/app/layouts/auth-layout.ts) |

Con esto, cada página solo escribe **su contenido**; el marco no se repite.

El componente raíz queda mínimo ([`app.ts`](../../frontend/src/app/app.ts)): solo `<router-outlet />` y, desde el tema 12, el contenedor de notificaciones.

## Rutas hijas
Un layout se conecta con `children`. Todas las páginas hijas se muestran dentro del `router-outlet` del layout ([`app.routes.ts`](../../frontend/src/app/app.routes.ts)):

```ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout').then((m) => m.MainLayout),
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home').then((m) => m.Home) },
      {
        path: 'products',
        children: [
          { path: '',    loadComponent: () => import('./products/product-list').then((m) => m.ProductList) },
          { path: ':id', loadComponent: () => import('./products/product-detail').then((m) => m.ProductDetail) },
        ],
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout').then((m) => m.AuthLayout),
    children: [{ path: 'login', loadComponent: () => import('./auth/login').then((m) => m.Login) }],
  },
  { path: '**', loadComponent: () => import('./pages/not-found').then((m) => m.NotFound) },
];
```

> En el tag `tema-09`, la ruta `login` apunta a una página provisional (`pages/login-placeholder`); el formulario real llega en el tema 15. El resto es igual al snippet.

Observa:
- Una ruta **sin `component` propio** (`products`) solo agrupa rutas hijas bajo un prefijo.
- `/auth/login` usa `AuthLayout`; el resto usa `MainLayout`. Una misma app, dos "marcos".
- `NotFound` queda fuera de los layouts: ocupa toda la pantalla.

## Navbar
Una barra superior fija, con el botón de menú visible solo en móvil:

```html
<header class="sticky top-0 z-10 flex items-center gap-3 bg-brand-700 px-4 py-3 text-white">
  <button class="md:hidden" aria-label="Abrir menú" (click)="sidebarOpen.set(!sidebarOpen())">
    <ng-icon name="heroBars3" size="1.5rem" />
  </button>
  <ng-icon name="heroCube" size="1.5rem" />
  <span class="font-semibold">MiniInventario</span>
  <span class="flex-1"></span>  <!-- empuja lo siguiente a la derecha -->
  <a routerLink="/auth/login">Ingresar</a>
</header>
```

- `sticky top-0` mantiene la barra visible al hacer scroll.
- `flex-1` en un elemento vacío ocupa el espacio sobrante (técnica para alinear a la derecha).
- `md:hidden`: el botón desaparece desde el ancho `md` (768px).

## Sidebar
Un `<aside>` con enlaces. Se ve u oculta según el ancho y el estado `sidebarOpen`:

```html
<aside
  class="w-full border-r border-slate-200 bg-white p-4 md:block md:min-h-[calc(100vh-52px)] md:w-56"
  [class.hidden]="!sidebarOpen()"
>
  <nav class="flex flex-col gap-1">
    @for (item of menu; track item.link) {
      <a
        [routerLink]="item.link"
        routerLinkActive="bg-brand-100 text-brand-700"
        [routerLinkActiveOptions]="{ exact: item.link === '/' }"
        class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100"
        (click)="sidebarOpen.set(false)"
      >
        <ng-icon [name]="item.icon" /> {{ item.label }}
      </a>
    }
  </nav>
</aside>
```

- El menú es **un arreglo de datos** (`menu`) + `@for`: añadir un enlace es añadir una línea.
- **`routerLinkActive`** añade clases al enlace de la ruta activa. `exact: true` en `/` evita que "Inicio" se marque siempre activo (todas las URLs empiezan con `/`).
- El estado abierto/cerrado es un `signal`: `sidebarOpen = signal(false)`.

## Parámetros de ruta
Para `products/:id`, la forma más simple en Angular moderno es recibir el parámetro como un **`input()`**. Se activa con `withComponentInputBinding()` en `provideRouter` (ver el tema 8):

```ts
export class ProductDetail {
  id = input.required<string>();   // llega del :id de la URL
  product = computed(() => PRODUCTS.find((p) => p.id === Number(this.id())));
}
```

- El parámetro llega como **string**; conviértelo a número si lo necesitas.
- También funcionan los *query params* (`?returnUrl=/x`) y los datos de `resolve`, con el mismo mecanismo.
- La alternativa clásica es inyectar `ActivatedRoute` y suscribirse a `paramMap`; el `input()` evita ese código.

Código real: [`products/product-detail.ts`](../../frontend/src/app/products/product-detail.ts). En este tag usa datos locales; en el tema 13 pasa a pedir el producto a la API.

## UX y responsive design
Tailwind es **mobile first**: las clases sin prefijo valen para móvil y los prefijos (`md:`, `lg:`) las modifican en pantallas mayores.

```
móvil (<768px)              escritorio (≥768px, md:)
┌──────────────────┐        ┌────────┬───────────────┐
│ ☰  MiniInventario│        │  Mini  Inventario      │
├──────────────────┤        ├────────┼───────────────┤
│ sidebar (si ☰)   │        │ sidebar│   contenido   │
├──────────────────┤        │  w-56  │               │
│ contenido        │        │        │               │
└──────────────────┘        └────────┴───────────────┘
```

Buenas prácticas:
- Diseña primero para móvil y añade `md:` / `lg:` para crecer.
- Cierra el sidebar al navegar en móvil (`(click)="sidebarOpen.set(false)"`).
- Botones y enlaces cómodos de tocar (`px-3 py-2` como mínimo).
- Indica **dónde estás** (`routerLinkActive`) y ofrece una forma de volver (el enlace "← Volver" del detalle).
- Contenedor con ancho máximo (`max-w-3xl`) para que las líneas no sean demasiado largas.
- Comprueba tu diseño en las herramientas de desarrollo del navegador con el modo dispositivo.

## En el proyecto
```bash
git checkout tema-09
cd frontend && npm install && npm start
```
Reduce el ancho de la ventana por debajo de 768px: aparece el botón ☰ y el sidebar se oculta. Abre un producto: la URL `/products/2` carga el detalle y muestra la demo del ciclo de vida del tema 7. Entra a `/auth/login` para ver el segundo layout.

## Ejercicios
1. Añade una entrada "Categorías" al menú (con su icono) y una página vacía.
2. Haz que el sidebar sea `md:w-64` en pantallas grandes.
3. Crea una ruta `categories/:id` y lee el parámetro con `input()`.

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [Build a Responsive Side Navbar using Angular 20 and Tailwind CSS](https://www.youtube.com/watch?v=cqpkZtnEhhQ) | BugArray | EN | Angular 20 + Tailwind; confirma qué versión de Tailwind usa |
| [Cómo trabajar con rutas en angular, parametros, redirecciones, Guard, y lazy loading](https://www.youtube.com/watch?v=WyydiGTOTxQ) | Luis Arias Dev | ES | Parámetros y rutas |
| [¿Cómo hacer Lazy loading en Angular 17, con Standalone component?](https://www.youtube.com/watch?v=Pgx8pUKZyPA) | Domini Code | ES | Para reforzar rutas |

> Hay pocos videos específicos de layouts con Angular y Tailwind 3 en español. Los patrones de HTML y clases de cualquier tutorial de navbar o sidebar con Tailwind (aunque sea de otro framework) se pueden trasladar a un template de Angular.

## Documentación oficial
- [angular.dev – Rutas anidadas](https://angular.dev/guide/routing/define-routes#nested-routes)
- [angular.dev – Leer datos de rutas](https://angular.dev/guide/routing/read-route-state)
- [Tailwind v3 – Responsive design](https://v3.tailwindcss.com/docs/responsive-design)
