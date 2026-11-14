# 1. Introducción a Angular moderno

**Duración:** 2 h · **Bloque 1** · **Tag del proyecto:** ninguno (tema conceptual)

## Objetivos
- Entender qué es Angular hoy y en qué se diferencia del Angular de hace unos años.
- Conocer las piezas de la arquitectura y cómo se conectan.
- Seguir el flujo completo de una SPA, desde que se abre la página hasta que se muestran datos de una API.
- Reconocer casos de uso reales.

## Qué es Angular hoy
Angular es un framework de TypeScript, mantenido por Google, para construir aplicaciones web de una sola página (SPA). A diferencia de librerías que solo resuelven la vista, trae todo incluido:

| Necesidad | Lo que da Angular |
|---|---|
| Interfaz | Componentes y templates |
| Navegación | `@angular/router` |
| Formularios | Template-driven y Reactive forms |
| Datos | `HttpClient` e interceptores |
| Estructura | Inyección de dependencias, CLI, convenciones |
| Calidad | Pruebas, tipado estricto, builder de producción |

Esa idea de "todo en uno" es la razón por la que se usa mucho en aplicaciones empresariales: el equipo no decide cada pieza por separado, y los proyectos grandes se parecen entre sí.

## Evolución del framework
| Etapa | Qué cambió |
|---|---|
| **AngularJS** (2010) | Primera generación, en JavaScript. Es otro framework: no es Angular moderno. |
| **Angular 2+** (2016) | Reescritura en TypeScript, basada en componentes. |
| **Ivy** (v9) | Nuevo motor de compilación y renderizado, más pequeño y rápido. |
| **Standalone components** (v14–v15) | Los componentes dejan de depender de `NgModule`. |
| **Signals** (v16 en adelante) | Reactividad granular, alternativa a RxJS para el estado de la vista. |
| **Control flow** (v17) | `@if`, `@for`, `@switch` reemplazan a `*ngIf`, `*ngFor`. Builder basado en esbuild. |
| **Angular 21** | Los proyectos nuevos nacen **sin zone.js** (zoneless), con Vitest como runner de pruebas. Signal Forms en modo experimental. |

En este curso, el proyecto generado con Angular 21 confirma lo último: `package.json` no incluye `zone.js` y [`app.config.ts`](../../frontend/src/app/app.config.ts) no registra ningún proveedor de zona. Si quieres el detalle de las novedades, mira el [plus de Angular 21](../plus/01-novedades-angular-21.md).

## Standalone components
Un componente standalone declara **él mismo** qué necesita, sin pasar por un módulo:

```ts
@Component({
  selector: 'app-badge',
  imports: [/* aquí lo que usa su template */],
  template: `<span><ng-content /></span>`,
})
export class Badge {}
```

- Desde Angular 19, `standalone: true` es el valor por defecto: ya no se escribe.
- Menos archivos, menos indirección y lazy loading más simple (`loadComponent`).
- Código real: [`shared/ui/badge.ts`](../../frontend/src/app/shared/ui/badge.ts).

El tema 5 profundiza en esto.

## Arquitectura general de Angular
```
main.ts ──► bootstrapApplication(App, appConfig)
                     │
        ┌────────────┴─────────────┐
        │  app.config.ts           │  proveedores globales:
        │  provideRouter(...)      │  router, HttpClient,
        │  provideHttpClient(...)  │  interceptores, iconos
        └────────────┬─────────────┘
                     ▼
   App (componente raíz) ──► <router-outlet />
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
               Componente A   Componente B   Componente C
                    │ inject()
                    ▼
        Servicios (datos, estado, UI) ──► HttpClient ──► API
```

Las piezas:
- **Componente:** clase TypeScript + template HTML + estilos. Es la unidad de interfaz.
- **Template:** HTML con sintaxis de Angular (`{{ }}`, `[prop]`, `(evento)`, `@if`).
- **Servicio:** clase con lógica compartida (acceso a datos, estado, notificaciones).
- **Inyección de dependencias (DI):** Angular crea los servicios y se los entrega a quien los pide con `inject()`.
- **Router:** decide qué componente mostrar según la URL.
- **`app.config.ts`:** el lugar donde se registran los proveedores globales.

Código real: [`main.ts`](../../frontend/src/main.ts), [`app.config.ts`](../../frontend/src/app/app.config.ts) y [`app.ts`](../../frontend/src/app/app.ts).

## Flujo de una SPA
1. El navegador pide la página y el servidor devuelve **un solo** `index.html` con los bundles de JavaScript.
2. Angular arranca (`bootstrapApplication`) y pinta el componente raíz.
3. El usuario hace clic en un enlace. El **router intercepta** la navegación: no hay recarga, solo cambia la URL y se muestra otro componente.
4. El componente pide datos a un servicio, el servicio llama a la API con `HttpClient` y recibe **JSON** (no HTML).
5. Angular actualiza solo las partes de la pantalla que cambiaron.

Ventajas: navegación fluida y la API se puede reutilizar (móvil, otros clientes). Contras: el primer arranque descarga más JavaScript y el SEO exige cuidado (por eso existe SSR).

En el proyecto, podrás ver este flujo con las herramientas de desarrollo del navegador (pestaña **Network**): al entrar a `/products` aparece una sola petición a `/api/products`, sin recarga de página.

## Casos de uso reales
- Paneles de administración y backoffice.
- Sistemas internos (inventario, facturación, ERP/CRM).
- Dashboards con muchos formularios y tablas.
- Portales con autenticación y roles.

**MiniInventario**, el proyecto del curso, es una versión pequeña de este último tipo: listado y alta de productos, carrito, login con roles y una API en .NET.

## Ejercicios
1. Abre `frontend/src/main.ts` y sigue el camino: `bootstrapApplication` → `appConfig` → `App`. ¿Dónde se registra el router?
2. Con el proyecto corriendo, abre **Network** en el navegador y navega entre páginas. ¿Se recarga el `index.html`?
3. Escribe con tus palabras la diferencia entre un servicio y un componente.

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [What's new in Angular v21](https://www.youtube.com/watch?v=DDAHORVzQ5g) | Angular (oficial) | EN | Versión que usa este curso |
| [Let's recap Angular v21 🎉](https://www.youtube.com/watch?v=_ZcHwv91Rmo) | Angular (oficial) | EN | Resumen corto |
| [Curso de desarrollo de aplicaciones web SPA con Angular (Sesión 1)](https://www.youtube.com/watch?v=rRawzEBHuzE) | Micael Gallego | ES | Concepto de SPA; la versión de Angular es antigua |
| [Aprende Angular Desde Cero con Tec Gurus](https://www.youtube.com/watch?v=JgmaKCqzhIg) | Tec Gurus | ES | Introducción general |
| [Angular Full Course for Beginners — Architecture TypeScript & RxJS (2026)](https://www.youtube.com/watch?v=8uG2eG-Ewn0) | TheTechSlayer | EN | Curso largo, útil como referencia |
| [ANGULAR 15 + VISUAL STUDIO CODE #5 Arquitectura escalable en Angular](https://www.youtube.com/watch?v=HhjLqpYXMAM) | ACADEMIA FULLSTACK | ES | Arquitectura sin módulos (Angular 15) |

## Documentación oficial
- [angular.dev – Essentials](https://angular.dev/essentials)
- [angular.dev – Components](https://angular.dev/guide/components)
