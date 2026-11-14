# 2. Entorno, Node y Angular CLI

**Duración:** 2 h · **Bloque 1** · **Tag del proyecto:** `tema-02`

## Objetivos
- Instalar Node.js con **nvm** y fijar la versión del proyecto.
- Instalar Angular CLI y crear un proyecto standalone con `ng new`.
- Reconocer la estructura de carpetas, los scripts y las buenas prácticas iniciales.

## Node.js y npm
Angular CLI corre sobre Node.js. Cada versión de Angular exige un rango de Node:

| Angular | Node requerido |
|---|---|
| 21.2 | `^20.19`, `^22.12` o `>=24` |

Para no pelear con versiones, usa **nvm** (Node Version Manager):

```bash
nvm install 22.23.2     # instalar una versión
nvm use 22.23.2         # usarla en esta terminal
node -v && npm -v
```

El proyecto fija la versión en [`.nvmrc`](../../.nvmrc), así que basta con `nvm use` dentro de la carpeta.

> **Aviso (macOS/Linux):** si tienes un Angular CLI global antiguo instalado fuera de nvm (por ejemplo en `/usr/local/bin/ng`), `which ng` te dirá cuál se ejecuta. Con nvm activo, el de nvm tiene prioridad.

## Angular CLI
```bash
npm install -g @angular/cli@21
ng version          # confirma CLI 21.x y tu versión de Node
```

Comandos que más usarás:

| Comando | Para qué sirve |
|---|---|
| `ng new` | Crear un proyecto |
| `ng serve` (o `npm start`) | Servidor de desarrollo con recarga |
| `ng generate` (`ng g`) | Crear componentes, servicios, guards… |
| `ng build` | Compilar para producción |
| `ng test` | Ejecutar pruebas |

## `ng new` con standalone
```bash
ng new frontend --style=css --ssr=false --routing --defaults
```

- No hace falta ninguna opción "standalone": **es el modo por defecto** desde Angular 17.
- `--ssr=false` evita el renderizado en servidor, que no usamos en el curso.
- `--routing` crea `app.routes.ts` y registra el router.

Este curso lo ejecutó dentro de la carpeta raíz del repositorio. El resultado está en [`frontend/`](../../frontend).

> **Nota sobre `npm install`:** durante la creación de este proyecto, `npm install` falló con el error interno `Cannot read properties of null (reading 'edgesOut')`. La solución fue instalar con `--legacy-peer-deps` y dejar esa opción en [`frontend/.npmrc`](../../frontend/.npmrc). Esa opción omite la comprobación estricta de conflictos entre dependencias; si en tu equipo `npm install` funciona sin ella, puedes quitarla.

## Estructura del proyecto
```
frontend/
├── angular.json          # configuración del workspace y del builder
├── package.json          # dependencias y scripts
├── tsconfig*.json        # TypeScript (modo estricto)
├── public/               # archivos estáticos (favicon…)
└── src/
    ├── index.html        # único HTML de la SPA
    ├── main.ts           # punto de entrada: bootstrapApplication
    ├── styles.css        # estilos globales
    └── app/
        ├── app.ts            # componente raíz
        ├── app.config.ts     # proveedores globales
        └── app.routes.ts     # rutas
```

Archivos clave: [`main.ts`](../../frontend/src/main.ts), [`app.config.ts`](../../frontend/src/app/app.config.ts) y [`package.json`](../../frontend/package.json).

### Convención de nombres (Angular 20+)
Desde Angular 20, el CLI ya no añade el sufijo `.component`: el componente raíz es `app.ts` con la clase `App`, no `app.component.ts` con `AppComponent`. El tema 5 lo explica.

## Scripts principales
En [`package.json`](../../frontend/package.json):

| Script | Comando | Uso |
|---|---|---|
| `npm start` | `ng serve` | Desarrollo en `http://localhost:4200` |
| `npm run build` | `ng build` | Build de producción en `dist/` |
| `npm run watch` | `ng build --watch --configuration development` | Build continuo en desarrollo |
| `npm test` | `ng test` | Pruebas con Vitest |

## Buenas prácticas iniciales
- Fija la versión de Node (`.nvmrc`) y usa `package-lock.json` en el control de versiones.
- Deja el **modo estricto** de TypeScript activado: detecta errores antes de ejecutar.
- Haz commits pequeños y descriptivos. Este proyecto tiene un commit por tema.
- Mantén una estructura por responsabilidad desde el inicio: `core/`, `shared/`, `layouts/`, `pages/` o carpetas por funcionalidad (`products/`, `auth/`).
- No instales librerías "por si acaso": cada dependencia aumenta el bundle.

## En el proyecto
Este tema equivale al commit `tema-02`: el proyecto Angular vacío más la API .NET. Para ver ese estado:

```bash
git checkout tema-02
cd frontend && npm install && npm start
```

Verás la página de bienvenida generada por el CLI.

## Ejercicios
1. Instala otra versión de Node con nvm y comprueba que `ng version` te da un aviso de incompatibilidad.
2. Genera un componente con `ng g c shared/hello` y observa qué archivos crea y qué nombre le pone a la clase.
3. Cambia el puerto de desarrollo con `ng serve --port 4300`.

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [1 Instalacion Node Js - Angular CLI v.17](https://www.youtube.com/watch?v=dlAnHSolq-g) | V Code | ES | Angular 17: los comandos de instalación son equivalentes |
| [Angular CLI: Crear una aplicación Angular](https://www.youtube.com/watch?v=-laNks4zKow) | DesarrolloWeb.com | ES | Video más antiguo: revisa las opciones de `ng new` |
| [Creación de proyecto y ruteo en Angular 18 - Curso completo de Angular (parte 2)](https://www.youtube.com/watch?v=pniWw8FPHHc) | Punto Json | ES | Creación del proyecto y estructura (Angular 18) |

## Documentación oficial
- [angular.dev – Instalación](https://angular.dev/installation)
- [angular.dev – Angular CLI](https://angular.dev/tools/cli)
- [nvm en GitHub](https://github.com/nvm-sh/nvm)
