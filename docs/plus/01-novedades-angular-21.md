# Plus 1. Novedades de Angular 21

Este curso usa Angular 21. Aquí, lo que **se comprobó en este proyecto** y lo que **solo se cita de los videos oficiales**.

## Comprobado en el proyecto
| Novedad | Evidencia |
|---|---|
| **Sin `zone.js` por defecto (zoneless)** | `ng new` con Angular 21.2 generó un proyecto cuyo `package.json` no incluye `zone.js` y cuyo [`app.config.ts`](../../frontend/src/app/app.config.ts) no registra ningún proveedor de zona. |
| **Vitest como ejecutor de pruebas** | `ng test` ejecutó [`validators.spec.ts`](../../frontend/src/app/shared/validators.spec.ts) con Vitest (2 pruebas pasan). |
| **Nombres sin sufijo** (`app.ts`, clase `App`) | El CLI generó `app.ts`, no `app.component.ts`. |
| **`provideBrowserGlobalErrorListeners()`** | Aparece en el `app.config.ts` generado. |

## Qué implica "zoneless" en el día a día
Antes, `zone.js` interceptaba temporizadores, peticiones y eventos y avisaba a Angular de que revisara la pantalla. Ahora Angular actualiza la vista solo cuando:

1. Cambia un **signal** que el template lee.
2. Ocurre un **evento** declarado en el template (`(click)`, `(ngSubmit)`).
3. Un **`async` pipe** recibe un valor.
4. Se llama a `markForCheck()` explícitamente.

Una propiedad normal que cambia en un `subscribe` o un `setTimeout` **ya no refresca la pantalla**. En este curso apareció en dos sitios (corregidos en el tag `tema-16`):
- [`product-form.ts`](../../frontend/src/app/products/product-form.ts): `categories` pasó de propiedad a `signal`.
- [`field-error.ts`](../../frontend/src/app/shared/ui/field-error.ts): `markForCheck()` al terminar un validador asíncrono.

## Citado de los videos oficiales (no comprobado en el curso)
Las descripciones de los videos oficiales mencionan, además: **Signal Forms** en modo experimental, el paquete **`@angular/aria`** en *developer preview* y un servidor **MCP** actualizado para agentes de IA. Mira los videos antes de usarlos en un proyecto real; no están usados en MiniInventario.

## 📺 Videos recomendados

| Video | Canal | Idioma |
|---|---|---|
| [What's new in Angular v21](https://www.youtube.com/watch?v=DDAHORVzQ5g) | Angular (oficial) | EN |
| [Let's recap Angular v21 🎉](https://www.youtube.com/watch?v=_ZcHwv91Rmo) | Angular (oficial) | EN |
| [Ng-News 25-47: Angular 21](https://www.youtube.com/watch?v=Sv2g1X5bwcQ) | ng-news | EN |
| [What's new in Angular 21 – Mateusz Stefańczyk – Google Developer Expert](https://www.youtube.com/watch?v=buxmxBr9Rc4) | Angular Love | EN |
| [Angular 21 is Here: Everything You Need to Know](https://www.youtube.com/watch?v=va7O-GRsiMM) | Web Vibes Only | EN |

## Documentación oficial
- [angular.dev – Zoneless](https://angular.dev/guide/zoneless)
- [angular.dev – Signals](https://angular.dev/guide/signals)
