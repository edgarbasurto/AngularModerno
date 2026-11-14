# 13. HttpClient y consumo de API

**Duración:** 5 h · **Bloque 5** · **Tag del proyecto:** `tema-13`

## Objetivos
- Configurar `HttpClient` con interceptores funcionales.
- Usar los métodos HTTP y tipar las respuestas con DTOs.
- Manejar errores de forma centralizada.
- Integrar el frontend con una **API .NET** y manejar estados de carga y error.

## La API .NET del proyecto
En [`api/`](../../api) hay una *Minimal API* de .NET 10 con datos en memoria ([`Program.cs`](../../api/Program.cs)):

| Método | Ruta | Acceso |
|---|---|---|
| `POST` | `/api/auth/login` | Público |
| `GET` | `/api/categories` | Público |
| `GET` | `/api/products?search=` | Público |
| `GET` | `/api/products/{id}` | Público |
| `POST` | `/api/products` | Requiere token |
| `PUT` | `/api/products/{id}` | Requiere token |
| `DELETE` | `/api/products/{id}` | Requiere rol **Admin** |

La API simula 400 ms de latencia en el listado para que se vea el estado de carga.

```bash
cd api
dotnet run            # escucha en http://localhost:5000
```

Prueba rápida:
```bash
curl http://localhost:5000/api/products
```

## Proxy de desarrollo
El frontend corre en `:4200` y la API en `:5000`. Para no lidiar con CORS en desarrollo, `ng serve` redirige todo lo que empiece con `/api` hacia la API ([`proxy.conf.json`](../../frontend/proxy.conf.json), enlazado en `angular.json` → `serve.options.proxyConfig`):

```json
{ "/api": { "target": "http://localhost:5000", "secure": false } }
```

Así el código usa rutas relativas (`/api/products`) y el navegador cree que habla con su propio origen. (La API también habilita CORS para `http://localhost:4200`, por si se prueba sin proxy.)

## `HttpClient` y su configuración
En [`app.config.ts`](../../frontend/src/app/app.config.ts):

```ts
provideHttpClient(withInterceptors([loadingInterceptor, errorInterceptor])),
```

Sin `HttpClientModule`. Los interceptores son **funciones** y se registran en orden.

## Métodos HTTP
Todo el acceso a la API vive en [`products/products.api.ts`](../../frontend/src/app/products/products.api.ts):

```ts
@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private http = inject(HttpClient);
  private url = '/api/products';

  getAll(search?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<Product[]>(this.url, { params });
  }

  getById(id: number)               { return this.http.get<Product>(`${this.url}/${id}`); }
  create(dto: ProductDto)           { return this.http.post<Product>(this.url, dto); }
  update(id: number, dto: ProductDto) { return this.http.put<Product>(`${this.url}/${id}`, dto); }
  delete(id: number)                { return this.http.delete<void>(`${this.url}/${id}`); }
}
```

| Método | Verbo | Uso |
|---|---|---|
| `get<T>` | GET | Leer |
| `post<T>` | POST | Crear |
| `put<T>` / `patch<T>` | PUT / PATCH | Reemplazar / modificar parcialmente |
| `delete<T>` | DELETE | Borrar |

Detalles importantes:
- **Es "frío":** `http.get()` **no hace nada** hasta que alguien se suscribe (`.subscribe()` o `async` pipe).
- **`HttpParams` es inmutable:** `params.set(...)` devuelve uno nuevo; por eso se reasigna.
- El tipo genérico (`get<Product[]>`) es **solo una promesa al compilador**: no valida lo que llega. Si la API cambia, el error aparecerá más tarde.

## DTOs
Un **DTO** (*Data Transfer Object*) describe la forma de los datos que viajan por la red. Están en [`models/product.ts`](../../frontend/src/app/models/product.ts):

```ts
export interface Product { id: number; name: string; price: number; stock: number; categoryId: number; }

/** DTO de entrada para crear/editar: el servidor asigna el id. */
export type ProductDto = Omit<Product, 'id'>;
```

- Lo que **recibes** (`Product`) y lo que **envías** (`ProductDto`) suelen diferir: el `id` lo asigna el servidor.
- Los nombres deben coincidir con el JSON. .NET serializa en **camelCase** por defecto (`categoryId`).
- Mantén los modelos del frontend alineados con los *records* de la API (`Product`, `ProductDto` en `Program.cs`).

## Manejo de errores
Los errores se atrapan en **un solo sitio**, el interceptor [`core/interceptors/error.interceptor.ts`](../../frontend/src/app/core/interceptors/error.interceptor.ts):

```ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      notify.error(MESSAGES[err.status] ?? `Error inesperado (${err.status}).`);
      return throwError(() => err);   // el componente también puede reaccionar
    }),
  );
};
```

| Código | Significado | Mensaje |
|---|---|---|
| `0` | No hubo respuesta (API apagada, sin red, CORS) | "No se pudo conectar con el servidor…" |
| `400` | Datos inválidos | "Los datos enviados no son válidos." |
| `401` | Sin sesión | "Necesitas iniciar sesión…" |
| `403` | Sin permiso | "No tienes permisos…" |
| `404` | No existe | "El recurso solicitado no existe." |
| `500` | Fallo del servidor | "Error interno del servidor." |

El `throwError` final es clave: el interceptor muestra el aviso **y** deja que el componente haga lo suyo (ocultar el spinner, mostrar "Reintentar").

## Interceptores
Un interceptor funcional recibe la petición (`req`) y el siguiente paso (`next`). Puede modificar la petición, la respuesta o ambas:

```ts
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  loading.start();
  return next(req).pipe(finalize(() => loading.stop()));  // finalize: éxito o error
};
```

[`LoadingService`](../../frontend/src/app/core/services/loading.service.ts) cuenta las peticiones activas con un signal; el navbar muestra una barra animada mientras haya alguna. En el tema 15 se añade un interceptor de autenticación.

**Orden:** se ejecutan en el orden del arreglo al enviar y en el inverso al recibir.

## Integración con la API .NET
Con la API y `ng serve` corriendo, el listado se pide a `/api/products` a través del proxy. La integración se probó verificando (con `curl`) que:
- `GET /api/products` responde `200` con el JSON esperado, tanto directo (`:5000`) como a través del proxy (`:4200`).
- `POST /api/products` **sin token** responde `401`.

### Consecuencia en este tema
Como el login llega en el tema 15, en el tag `tema-13`:
- **Listar y ver detalle funcionan.**
- **Crear, editar y borrar devuelven `401`.** Es intencional: te permite ver el `errorInterceptor` en acción ("Necesitas iniciar sesión para hacer esto"). En el tema 15 se arreglan.

## Estados de carga y error
[`products/product-list.ts`](../../frontend/src/app/products/product-list.ts) maneja los tres estados con signals:

```ts
loading = signal(false);
error = signal<string | null>(null);

load() {
  this.loading.set(true);
  this.error.set(null);
  this.api.getAll().subscribe({
    next: (list) => { this.products.set(list); this.loading.set(false); },
    error: () => { this.error.set('No se pudieron cargar los productos.'); this.loading.set(false); },
  });
}
```

```html
@if (loading()) {
  <p>Cargando productos…</p>
} @else if (error()) {
  <p>{{ error() }}</p>
  <app-button (click)="load()">Reintentar</app-button>
} @else {
  <!-- lista -->
}
```

> **Zoneless:** actualizar un **signal** dentro de `subscribe` sí refresca la vista. Una propiedad normal (`this.categories = c`) **no**. Por eso `categories` es un signal en `ProductForm`.

El detalle ([`product-detail.ts`](../../frontend/src/app/products/product-detail.ts)) usa un `effect()` para volver a pedir el producto cada vez que cambia el `id` de la ruta.

## En el proyecto
Necesitas **dos terminales**:

```bash
# Terminal 1
cd api && dotnet run

# Terminal 2
git checkout tema-13
cd frontend && npm install && npm start
```

Abre `http://localhost:4200/products`. Después:
1. **Apaga la API** (Ctrl+C) y recarga: verás el mensaje de error y "Reintentar".
2. Vuelve a encenderla y pulsa "Reintentar".
3. Pulsa "Eliminar": recibirás el aviso 401 (sin login todavía).

## Ejercicios
1. Conecta el buscador al servidor: llama a `getAll(search)` en lugar de filtrar en el cliente.
2. Añade una pantalla de edición (`PUT`) y observa el `401`.
3. Crea un interceptor que añada la cabecera `X-App: MiniInventario` a toda petición.

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [Implementa los nuevos Functional HTTP Interceptor \| Angular](https://www.youtube.com/watch?v=fO86sfYpaj8) | Carlos Codea | ES | Interceptores funcionales (Angular 17+) |
| [¡Domina los Interceptores en Angular 19! Simplifica Errores, Headers y Redirecciones](https://www.youtube.com/watch?v=wasqHGAtAh0) | Carlos Codea | ES | Manejo de errores centralizado |
| [Interceptores en Angular 19+: Token, Loader y Mejora de UX con Debounce](https://www.youtube.com/watch?v=Xx77sA8Cxh8) | DotTech-ES | ES | Loader, el mismo patrón del proyecto |
| [Domina los Interceptores en Angular + HttpContext](https://www.youtube.com/watch?v=TIAQYpQU0gY) | Prophet Code | ES | Avanzado |
| [Angular - Functional interceptors](https://www.youtube.com/watch?v=7fkhn3gRSGk) | Alex Khymenko | EN | Conceptos |
| [Angular Functional HTTP Interceptors](https://www.youtube.com/watch?v=Yo8OiajGprQ) | Arvind Rai (concretepage.com) | EN | Conceptos |

> No se encontró un video específico de `HttpClient` básico (GET/POST) para Angular 17+ que se pudiera validar; para eso, usa la documentación oficial.

## Documentación oficial
- [angular.dev – HttpClient](https://angular.dev/guide/http)
- [angular.dev – Interceptores](https://angular.dev/guide/http/interceptors)
- [angular.dev – Proxy en desarrollo](https://angular.dev/tools/cli/serve#proxying-to-a-backend-server)
- [Microsoft – Minimal APIs](https://learn.microsoft.com/aspnet/core/fundamentals/minimal-apis)
