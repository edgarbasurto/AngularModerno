# 4. Integración de ng-icons

**Duración:** 3 h · **Bloque 1** · **Tag del proyecto:** `tema-04`

## Objetivos
- Entender qué es ng-icons y por qué usar una librería de iconos SVG.
- Instalarla, registrar iconos y usarlos en componentes.
- Organizar la iconografía de la app y seguir buenas prácticas.

## Qué es ng-icons
**ng-icons** (`@ng-icons/core`) es una librería que muestra iconos SVG en Angular con un único componente, `<ng-icon>`. Reúne decenas de sets (Heroicons, Feather, Lucide, Material…) como paquetes separados.

```html
<ng-icon name="heroCube" size="1.5rem" />
```

Ventajas:
- Los iconos son SVG inline: escalan, heredan el color del texto (`currentColor`) y no hacen peticiones extra.
- Solo se incluyen en el bundle los iconos que **registras**.
- Se puede mezclar sets distintos.

## Instalación y configuración
Se instala el núcleo y **un** set de iconos:

```bash
npm install @ng-icons/core @ng-icons/heroicons
```

> Este proyecto usa la versión 36 de ambos paquetes, publicada para Angular recientes. Antes de instalar en otro proyecto, revisa la tabla de compatibilidad en el [repositorio oficial](https://github.com/ng-icons/ng-icons).

Los iconos de Heroicons vienen en estilos separados: `outline`, `solid`, `mini`, `micro`. Cada uno se importa de su subruta:

```ts
import { heroHome } from '@ng-icons/heroicons/outline';
```

### Dónde registrar (`provideIcons`)
Hay dos sitios válidos:

**1. En un componente** (iconos que solo ese componente usa):
```ts
@Component({
  imports: [NgIcon],
  providers: [provideIcons({ heroUsers })],
  template: `<ng-icon name="heroUsers" />`,
})
```

**2. En toda la app** ([`app.config.ts`](../../frontend/src/app/app.config.ts)): este es el enfoque del proyecto, porque el mismo icono aparece en varios componentes.
```ts
providers: [
  provideIcons(APP_ICONS), // iconos disponibles en toda la app
]
```

## Uso de iconos en componentes
Un componente importa `NgIcon` y escribe el nombre:

```ts
import { NgIcon } from '@ng-icons/core';

@Component({
  imports: [NgIcon],
  template: `
    <h1 class="page-title flex items-center gap-2">
      <ng-icon name="heroCube" size="1.75rem" /> MiniInventario
    </h1>
    <button class="inline-flex items-center gap-2 ...">
      <ng-icon name="heroPlus" /> Nuevo producto
    </button>
  `,
})
export class App {}
```

Inputs principales (según la documentación oficial):

| Input | Para qué |
|---|---|
| `name` | Nombre del icono registrado |
| `size` | Tamaño (`"1.5rem"`, `"24px"`…). Por defecto hereda el tamaño de fuente |
| `color` | Color. Por defecto hereda el del texto |
| `strokeWidth` | Grosor del trazo, solo en sets de línea |

Con Tailwind puedes colorear con clases de texto: `<ng-icon class="text-brand-600" />`.

Código real: [`app.ts`](../../frontend/src/app/app.ts) y [`shared/ui/button.ts`](../../frontend/src/app/shared/ui/button.ts), que acepta un `icon` como input.

## Organización de la iconografía
En lugar de importar iconos suelto por toda la app, hay **un solo archivo** que es el catálogo: [`shared/icons.ts`](../../frontend/src/app/shared/icons.ts).

```ts
import { heroHome, heroCube, heroTag /* ... */ } from '@ng-icons/heroicons/outline';

export const APP_ICONS = { heroHome, heroCube, heroTag /* ... */ };
```

Beneficios:
- Un solo lugar para ver, añadir o quitar iconos.
- Se registra con una línea en `app.config.ts`.
- El nombre del icono (`heroCube`) es el mismo en toda la app.

## Buenas prácticas de uso
- **Registra solo lo que usas.** Importar un set completo infla el bundle.
- **Un solo set principal** para que el estilo sea consistente (aquí, Heroicons *outline*).
- **Accesibilidad:** un icono decorativo junto a un texto no necesita nada más. Un botón que solo tiene icono necesita `aria-label` (por ejemplo, el botón del menú en [`main-layout.ts`](../../frontend/src/app/layouts/main-layout.ts)).
- **Tamaño con `size`** o con el tamaño de fuente del contenedor, no con CSS suelto.
- **Registra todo icono cuyo nombre pases por un `input`** (como hace `Button` con `icon`). El nombre es un texto libre: el compilador no avisa si te equivocas, así que revisa en el navegador que se vea.

## En el proyecto
```bash
git checkout tema-04
cd frontend && npm install && npm start
```
Verás un título y un botón con iconos. Prueba `name="heroNoExiste"` y observa qué pasa.

## Ejercicios
1. Añade `heroBell` al catálogo y muéstralo junto al título.
2. Cambia el tamaño y el color del icono de dos formas: con `size`/`color` y con clases de Tailwind.
3. Explica cuándo registrarías un icono en un componente y no en `app.config.ts`.

## 📺 Videos recomendados

**No encontré videos dedicados a ng-icons** en las búsquedas hechas; solo aparecieron tutoriales de otras librerías (Font Awesome, Bootstrap Icons, Material Icons) y no los incluyo porque su API es distinta. Para este tema, usa la documentación oficial:

- [ng-icons – Repositorio y README](https://github.com/ng-icons/ng-icons)
- [`@ng-icons/core` en npm](https://www.npmjs.com/package/@ng-icons/core)
- [Documentación de ng-icons](https://ng-icons.github.io/ng-icons/)

Si encuentras un video útil, súmalo aquí con su enlace.

## Documentación oficial
- [Heroicons](https://heroicons.com/) (catálogo para buscar nombres de iconos)
