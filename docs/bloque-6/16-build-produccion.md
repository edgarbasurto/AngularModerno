# 16. Optimización y cierre del proyecto

**Duración:** 2 h · **Bloque 6** · **Tag del proyecto:** `tema-16`

## Objetivos
- Generar el build de producción y entender qué hace.
- Separar la configuración de desarrollo y producción con `environments`.
- Ejecutar las pruebas y revisar el proyecto con una lista de verificación.

## Build de producción
```bash
cd frontend
npm run build        # equivale a: ng build
```

En Angular moderno, **`ng build` ya usa la configuración de producción por defecto** (el antiguo `--prod` ya no existe). El resultado queda en `frontend/dist/frontend/browser/`.

Qué hace el build de producción:
- **AOT:** compila las plantillas a JavaScript antes de entregar la app.
- **Minificación** y **tree-shaking:** elimina espacios y código que nadie usa.
- **Code splitting:** cada ruta con `loadComponent` queda en su propio archivo (tema 8).
- **Nombres con hash** (`chunk-FP3S67RR.js`): permite cachear sin que el navegador use versiones viejas.
- **Tailwind:** el CSS final solo contiene las clases que usas.

Resultado medido en este proyecto, con el tag `tema-16`:

| | Tamaño |
|---|---|
| Inicial sin comprimir | 301.50 kB |
| Inicial transferido (comprimido) | 85.37 kB |

### Presupuestos (*budgets*)
En `angular.json` hay límites que hacen **fallar o avisar** el build si el bundle crece demasiado:

```json
"budgets": [
  { "type": "initial",           "maximumWarning": "500kB", "maximumError": "1MB" },
  { "type": "anyComponentStyle", "maximumWarning": "4kB",   "maximumError": "8kB" }
]
```

Son los valores reales de [`frontend/angular.json`](../../frontend/angular.json) (sección `build → configurations → production`): el primero limita el JavaScript inicial; el segundo, el CSS de un solo componente.

### Analizar el bundle
Para ver qué pesa más, se genera un reporte de estadísticas:

```bash
ng build --stats-json
```

y se abre `dist/frontend/stats.json` en una herramienta como [esbuild Bundle Size Analyzer](https://esbuild.github.io/analyze/) (se sube el archivo en el navegador).

## Environments
Una app necesita valores distintos por entorno (URL de la API, banderas). Se generan con:

```bash
ng generate environments
```

Crea dos archivos y configura el reemplazo en `angular.json`:

| Archivo | Se usa en | Contenido en este proyecto |
|---|---|---|
| [`environment.ts`](../../frontend/src/environments/environment.ts) | **Producción** (por defecto) | `apiUrl: 'https://api.miinventario.example.com'` |
| [`environment.development.ts`](../../frontend/src/environments/environment.development.ts) | `ng serve` / `--configuration development` | `apiUrl: ''` (rutas relativas, usa el proxy) |

En la configuración `development`, Angular **reemplaza** `environment.ts` por `environment.development.ts` (`fileReplacements`).

El código no sabe en qué entorno está; solo importa `environment`:

```ts
import { environment } from '../../environments/environment';

private base = environment.apiUrl + '/api';
private url = `${this.base}/products`;
```

Aplica en [`products.api.ts`](../../frontend/src/app/products/products.api.ts), [`auth.service.ts`](../../frontend/src/app/auth/auth.service.ts) y [`auth.interceptor.ts`](../../frontend/src/app/core/interceptors/auth.interceptor.ts).

Se comprobó que el build de producción contiene la URL de producción (se buscó el texto `api.miinventario.example.com` en `dist/`), y que el de desarrollo no.

> **Nunca pongas secretos en `environment.ts`.** Todo lo que está ahí termina en el JavaScript que descarga cualquier usuario. Solo configuración pública.
>
> `api.miinventario.example.com` es un dominio de ejemplo (`.example.com` está reservado para documentación). Sustitúyelo por tu URL real antes de desplegar, y recuerda habilitar **CORS** para tu dominio en la API (en `Program.cs`, hoy solo permite `http://localhost:4200`).

## Pruebas
Angular 21 usa **Vitest** como ejecutor de pruebas por defecto. El proyecto incluye una prueba de los validadores ([`shared/validators.spec.ts`](../../frontend/src/app/shared/validators.spec.ts)):

```ts
it('priceRange valida el rango', () => {
  const v = priceRange(1, 100);
  expect(v(new FormControl(0))).not.toBeNull();
  expect(v(new FormControl(50))).toBeNull();
  expect(v(new FormControl(101))).not.toBeNull();
});
```

```bash
ng test --watch=false     # una sola ejecución (útil para CI)
```

Resultado con el tag `tema-16`: **2 pruebas, 2 pasan**. Más en el [plus de testing](../plus/03-testing.md).

## Revisión final del proyecto
Lista de verificación antes de dar por terminada una app:

**Código**
- [ ] `npm run build` termina sin errores ni *warnings* nuevos.
- [ ] `ng test --watch=false` pasa.
- [ ] No quedan `console.log` de depuración (en este proyecto hay algunos **a propósito**, como `LifecycleDemo`; retíralos en una app real).
- [ ] No hay código muerto (por ejemplo, [`cart.store.signals.ts`](../../frontend/src/app/cart/cart.store.signals.ts) es material de comparación y no se usa).

**Funcionalidad** (con la API corriendo)
- [ ] Login con `admin` y con `user`.
- [ ] Listado, detalle y creación de producto.
- [ ] Solo `admin` ve y puede usar Eliminar.
- [ ] Ruta protegida sin sesión → redirige al login.
- [ ] API apagada → mensaje de error y "Reintentar".
- [ ] Carrito: agregar, quitar, vaciar.

**UX**
- [ ] Probado en móvil (sidebar con ☰) y en escritorio.
- [ ] Estados de carga, vacío y error en cada pantalla con datos.
- [ ] Errores de formulario claros.

**Producción**
- [ ] `apiUrl` de producción correcto y **CORS** configurado en la API.
- [ ] Secretos fuera del repositorio y del bundle (la clave JWT de esta API de ejemplo está en el código: **no** es válida para producción).
- [ ] Servidor web con *fallback* a `index.html` para las rutas de la SPA (si no, recargar `/products` da 404).

## Cierre del curso
Repaso de lo construido, en el orden del curso:

| Tema | Lo que aportó a MiniInventario |
|---|---|
| 2 | Proyecto Angular 21 + API .NET |
| 3–4 | Tailwind 3 e iconos |
| 5–7 | Componentes `Button`, `Card`, `Badge`, `ProductCard`; binding; ciclo de vida |
| 8–9 | Router, lazy loading, layouts, rutas hijas |
| 10–11 | Formularios reactivos y validaciones |
| 12–13 | Servicios, `HttpClient`, interceptores |
| 14 | Carrito con `BehaviorSubject` |
| 15 | JWT, guards, roles |
| 16 | Environments, build, pruebas |

**Siguientes pasos sugeridos:** SSR con `ng add @angular/ssr`, Signal Forms (experimental), NgRx para estado complejo, pruebas de componentes y e2e, y una base de datos real en la API (EF Core).

## En el proyecto
```bash
git checkout tema-16
cd frontend
npm run build
npx ng test --watch=false
```

## Ejercicios
1. Añade un tercer entorno `staging` con su propio `apiUrl` y su configuración en `angular.json`.
2. Genera el `stats.json` y encuentra cuál es el chunk más pesado. ¿Es lo que esperabas?
3. Escribe una prueba para `CartStore`: agregar el mismo producto dos veces debe dar `qty = 2` y `count = 2`.

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [Optimize the bundle size of an Angular application](https://www.youtube.com/watch?v=19T3O7XWJkA) | Angular (oficial) | EN | Del canal oficial; reducción del tamaño del bundle |
| [ANGULAR: COMO CREAR, GENERAR O COMPILAR UN PROYECTO PARA PRODUCCIÓN](https://www.youtube.com/watch?v=cPF64tZVKKM) | Yo Androide | ES | Probablemente usa `ng build --prod`, que **ya no existe**: hoy es `ng build` |
| [Optimize Angular Build: Production Bundle Best Practices](https://www.youtube.com/watch?v=5JOUS2tcUN0) | LearnCodeExpress | EN | Buenas prácticas de build |

## Documentación oficial
- [angular.dev – Build](https://angular.dev/tools/cli/build)
- [angular.dev – Entornos](https://angular.dev/tools/cli/environments)
- [angular.dev – Despliegue](https://angular.dev/tools/cli/deployment)
- [angular.dev – Testing](https://angular.dev/guide/testing)
