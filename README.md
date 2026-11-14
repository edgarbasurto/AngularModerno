# Angular Moderno – Curso y proyecto MiniInventario

Documentación en Markdown del curso (16 temas, 6 bloques) y un proyecto de ejemplo que crece tema a tema.

- 📚 **Documentación:** [`docs/README.md`](docs/README.md) (índice del curso)
- 🅰️ **Frontend:** [`frontend/`](frontend) – Angular 21, Tailwind 3, ng-icons
- 🔧 **API:** [`api/`](api) – .NET 10 Minimal API con JWT

## Requisitos
| Herramienta | Versión usada |
|---|---|
| Node.js (con nvm) | 22.23.2 (`.nvmrc`) |
| Angular CLI | 21.2.x |
| .NET SDK | 10.0 |

```bash
nvm use                         # lee .nvmrc
npm install -g @angular/cli@21
```

## Puesta en marcha
Necesitas **dos terminales**.

```bash
# Terminal 1 – API (http://localhost:5000)
cd api
dotnet run

# Terminal 2 – Frontend (http://localhost:4200)
cd frontend
npm install
npm start
```

Usuarios de prueba: `admin` / `admin123` (rol Admin) y `user` / `user123` (rol User).

> `frontend/.npmrc` contiene `legacy-peer-deps=true` porque `npm install` falló con un error interno de npm al crear el proyecto. Si en tu máquina funciona sin esa opción, puedes quitarla.

## Seguir el curso por tags
Cada tema es un commit con su tag. Para ver el proyecto tal como queda al terminar un tema:

```bash
git checkout tema-08
```

| Tag | Qué se añade |
|---|---|
| `tema-02` | Proyecto Angular + API .NET |
| `tema-03` | Tailwind CSS 3 |
| `tema-04` | ng-icons |
| `tema-05` | Componentes `Button`, `Card`, `Badge` |
| `tema-06` | `ProductCard` y data binding |
| `tema-07` | `ngModel`, ciclo de vida |
| `tema-08` | Router, lazy loading, guard introductorio |
| `tema-09` | Layouts, rutas hijas, parámetros |
| `tema-10` | Formularios template-driven y reactive |
| `tema-11` | Validadores y estados de formulario |
| `tema-12` | Servicios y DI |
| `tema-13` | `HttpClient`, interceptores, API .NET |
| `tema-14` | Carrito con `BehaviorSubject` |
| `tema-15` | JWT, guards, roles |
| `tema-16` | Environments, build, pruebas (incluye la corrección zoneless) |

Vuelve a la última versión con `git checkout master` (o el nombre de tu rama principal).

## Estructura
```
AngularModerno/
├── docs/        # documentación por tema + plus
├── frontend/    # app Angular
│   └── src/app/
│       ├── core/      # servicios, interceptores, guards
│       ├── shared/    # UI reutilizable, validadores, iconos
│       ├── layouts/   # MainLayout, AuthLayout
│       ├── pages/     # home, contacto, 404…
│       ├── products/  # lista, detalle, formulario, API
│       ├── cart/      # store con RxJS
│       ├── auth/      # login y AuthService
│       └── models/    # interfaces y DTOs
└── api/         # Minimal API .NET
```

## Notas
- Los videos de YouTube de la documentación se comprobaron con el endpoint oEmbed de YouTube (existen y coinciden título y canal). No se revisó su contenido completo; muchos son de versiones anteriores de Angular. Ver [`docs/README.md`](docs/README.md#sobre-los-videos).
- La API es **solo para el curso**: datos en memoria, usuarios y contraseñas en el código, clave JWT fija. No es apta para producción.
