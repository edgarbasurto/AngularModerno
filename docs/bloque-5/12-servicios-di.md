# 12. Servicios e inyección de dependencias

**Duración:** 3 h · **Bloque 5** · **Tag del proyecto:** `tema-12`

## Objetivos
- Crear servicios con `@Injectable` y pedirlos con `inject()`.
- Entender los *providers* y el alcance (*scope*) de un servicio.
- Organizar los servicios del proyecto.
- Separar servicios de **UI** de servicios de **datos**.

## Qué es la inyección de dependencias (DI)
Un componente no debería crear los objetos que necesita (`new ProductsApi()`). En su lugar, **los pide** y Angular se los entrega. Beneficios:

- **Una sola instancia compartida** cuando conviene (estado, caché).
- **Código desacoplado:** puedes cambiar una implementación (por ejemplo, datos en memoria por HTTP) sin tocar los componentes.
- **Más fácil de probar:** en una prueba, entregas un servicio falso.

## `@Injectable` y `inject()`
```ts
@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly toasts = signal<Toast[]>([]);

  success(message: string) { /* ... */ }
}
```

Y se usa en cualquier componente o servicio:

```ts
export class ProductList {
  private notify = inject(NotificationService);
  private router = inject(Router);

  onAdd(p: Product) {
    this.notify.success(`${p.name} agregado`);
  }
}
```

- **`inject()`** reemplaza la inyección por constructor (`constructor(private notify: NotificationService)`). Es más corto, funciona en funciones (guards, interceptores) y no obliga a repetir tipos.
- Solo funciona en un **contexto de inyección**: al inicializar campos de la clase, en el constructor, o dentro de una función que Angular ejecuta (guard, interceptor). **No** dentro de un `setTimeout` ni en un método llamado después.

Código real: [`core/services/notification.service.ts`](../../frontend/src/app/core/services/notification.service.ts).

## Providers
Un *provider* le dice a Angular **cómo crear** una dependencia y **dónde** está disponible.

| Dónde se declara | Alcance | Cuándo usarlo |
|---|---|---|
| `@Injectable({ providedIn: 'root' })` | **Toda la app**, una instancia (singleton) | Casi todo: servicios de datos, sesión, notificaciones |
| `providers: [...]` de un componente | **Ese componente y sus hijos**, una instancia **por componente** | Estado propio de una pantalla o de cada tarjeta |
| `providers: [...]` de una ruta | Esa ruta y sus hijas | Servicios de una sección |
| `provideX(...)` en `app.config.ts` | Toda la app | Configuración (router, HTTP, iconos) |

`root` tiene una ventaja adicional: si nadie usa el servicio, el compilador lo elimina del bundle (*tree-shaking*).

## Scope de servicios: una demostración
El proyecto incluye dos servicios para **ver** la diferencia:

**1. Global** (`providedIn: 'root'`): `NotificationService`. Todos los componentes comparten los mismos avisos.

**2. Por componente**: [`core/services/click-counter.ts`](../../frontend/src/app/core/services/click-counter.ts), **sin** `providedIn`:

```ts
@Injectable()
export class ClickCounter {
  count = 0;
  hit() { return ++this.count; }
}
```

Y cada `ProductCard` lo declara en sus `providers`:

```ts
@Component({
  selector: 'app-product-card',
  providers: [ClickCounter],   // ← una instancia propia por tarjeta
  /* ... */
})
export class ProductCard {
  protected counter = inject(ClickCounter);
  onAdd() { this.counter.hit(); this.add.emit(this.product()); }
}
```

**Experimento:** pulsa "Agregar" 3 veces en una tarjeta y 1 en otra. Cada una muestra **su propio** "Clics en esta tarjeta". Si `ClickCounter` fuera `providedIn: 'root'`, todas compartirían el mismo contador.

Código real: [`products/product-card.ts`](../../frontend/src/app/products/product-card.ts).

## Organización
Una estructura simple, por responsabilidad:

```
src/app/
├── core/                     # servicios y piezas únicas de toda la app
│   ├── services/             #   notification, loading, click-counter
│   ├── interceptors/         #   (tema 13 y 15)
│   └── guards/               #   (tema 15)
├── shared/                   # reutilizable, sin lógica de negocio
│   ├── ui/                   #   button, card, badge, field-error, toast-container
│   └── validators.ts
├── models/                   # interfaces y tipos
├── layouts/
├── pages/
└── products/                 # una carpeta por funcionalidad (feature)
    ├── product-list.ts
    ├── product-form.ts
    └── products.api.ts       # servicio de datos de esta funcionalidad
```

Criterios:
- Lo que usa **toda** la app → `core/`. Lo que **muchas** pantallas reutilizan, sin saber de productos → `shared/`.
- El servicio que solo usa una funcionalidad vive **dentro** de esa funcionalidad (`products/products.api.ts`).
- Nombra el servicio por lo que **hace**: `ProductsApi`, `NotificationService`, `AuthService`.

## Servicios de UI vs servicios de datos
| | UI | Datos |
|---|---|---|
| Ejemplo | `NotificationService`, `LoadingService` | `ProductsApi`, `AuthService` |
| Maneja | Cosas de pantalla: avisos, carga, modales | Comunicación con la API y datos |
| Conoce HTTP | No | Sí (a partir del tema 13) |
| Reutilización | Entre cualquier pantalla | Entre pantallas de una misma funcionalidad |

**Por qué separarlos:** si mezclas "pedir productos" con "mostrar un aviso", no puedes reutilizar ninguno por separado, y cualquier cambio de la API arrastra a la UI.

### Datos: el contrato
En este tema, [`products/products.api.ts`](../../frontend/src/app/products/products.api.ts) devuelve `Observable` con datos **en memoria**:

```ts
getAll(): Observable<Product[]> {
  return of([...this.items]).pipe(delay(400));  // simula la latencia de la red
}
```

Se diseñó con la **misma firma** que tendrá el servicio HTTP del tema 13. En ese tema, solo cambia el interior de `ProductsApi`; **ningún componente** se modifica. Ese es el valor de la DI.

> En el tag `tema-12`, `ProductList` carga los datos en `ngOnInit` y los guarda en un `signal`; cuando termina la carga, el signal refresca la vista (zoneless).

## En el proyecto
```bash
git checkout tema-12
cd frontend && npm install && npm start
```
Entra a `/products`: los productos tardan ~400 ms en aparecer. Pulsa "Agregar": aparece un aviso (toast) abajo a la derecha, y el contador de **esa** tarjeta sube.

## Ejercicios
1. Crea un servicio `ThemeService` (global) con un `signal` `dark` y un método `toggle()`. Úsalo en el navbar.
2. Haz que `ClickCounter` sea global (`providedIn: 'root'`) y observa cómo cambia el comportamiento.
3. Añade `NotificationService.info()` y úsalo al entrar a la página de contacto.

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [Olvídate de los constructores en Angular con la función inject](https://www.youtube.com/watch?v=7-WsOsnLv80) | nicobytes | ES | `inject()` |
| [Entendiendo los servicios - Inyección de dependencias \| Angular](https://www.youtube.com/watch?v=ONtQ8r0sxCw) | Carlos Codea | ES | Servicios y DI desde cero |
| [Angular Basics - Servicios e Inyección de Dependencias](https://www.youtube.com/watch?v=MVR4VmbiEzo) | akotech | ES | Básico |
| [Manejando la Inyección de Dependencias @Optional \| @SkipSelf \| @Self \| @Host en Angular v20](https://www.youtube.com/watch?v=1NoRjpLYx0k) | CodeScript | ES | Avanzado: jerarquía de inyectores |

## Documentación oficial
- [angular.dev – Dependency injection](https://angular.dev/guide/di)
- [angular.dev – Creating an injectable service](https://angular.dev/guide/di/creating-injectable-service)
- [angular.dev – Hierarchical injectors](https://angular.dev/guide/di/hierarchical-dependency-injection)
