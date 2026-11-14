# 3. Integración de Tailwind CSS

**Duración:** 3 h · **Bloque 1** · **Tag del proyecto:** `tema-03`

## Objetivos
- Entender qué es Tailwind CSS y cuándo conviene frente a otros frameworks CSS.
- Instalar y configurar **Tailwind 3** en Angular 21.
- Usar utilidades y distinguir estilos globales de locales.

> **Versión:** este curso usa **Tailwind 3.4**, que se configura con `tailwind.config.js`. La versión 4 cambió el modelo (configuración en CSS con `@theme`, sin ese archivo). Si buscas tutoriales, comprueba cuál versión usan: muchos videos recientes son de Tailwind 4 y sus pasos de instalación no coinciden con los de este documento.

## Qué es Tailwind CSS
Un framework CSS **utility-first**: en lugar de clases con significado ("`.card`", "`.btn-primary`"), das clases pequeñas que hacen una sola cosa y las combinas en el HTML.

```html
<button class="rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">
  Guardar
</button>
```

## Ventajas frente a frameworks CSS
| | Bootstrap / Material | Tailwind |
|---|---|---|
| Componentes | Ya hechos (botón, modal…) | No incluye: los construyes |
| Aspecto | Reconocible, difícil de personalizar | Libre: no impone diseño |
| CSS final | Incluye todo el framework | Solo las clases que usas |
| Responsive | Grid y clases propias | Prefijos: `md:flex`, `lg:w-1/2` |
| Costo | Menos trabajo inicial | Más HTML en cada elemento |

Tailwind encaja bien con Angular porque los componentes ya encapsulan la repetición: la clase larga vive en **un** componente (`Button`) y no se copia por toda la app.

## Instalación en Angular
```bash
cd frontend
npm install -D tailwindcss@3 postcss autoprefixer
```

Dos archivos de configuración en la raíz de `frontend/`:

**[`tailwind.config.js`](../../frontend/tailwind.config.js)**
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],   // dónde buscar clases usadas
  theme: {
    extend: {
      colors: {
        brand: { 50: '#eef2ff', 100: '#e0e7ff', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' },
      },
    },
  },
  plugins: [],
};
```

**[`postcss.config.js`](../../frontend/postcss.config.js)**
```js
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

En este proyecto no fue necesario tocar `angular.json`: el builder de Angular detecta `tailwind.config.js` y aplica Tailwind al procesar `styles.css`. Se comprobó compilando y viendo la clase `bg-brand-600` en el CSS generado.

Después se añaden las directivas en [`src/styles.css`](../../frontend/src/styles.css):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Configuración (`tailwind.config.js`)
- **`content`**: es lo más importante. Tailwind genera solo el CSS de las clases que encuentra en estos archivos. Si olvidas incluir `.ts` y `.html`, tus clases no aparecerán.
- **`theme.extend`**: añade valores (como el color `brand`) sin perder los que trae Tailwind. Si pones el valor directamente en `theme` (sin `extend`), **reemplazas** los de Tailwind.
- **`plugins`**: extensiones oficiales o propias (`@tailwindcss/forms`, etc.).

## Uso de utilidades
| Categoría | Ejemplos |
|---|---|
| Espaciado | `p-4`, `px-6`, `mt-2`, `gap-3` |
| Layout | `flex`, `grid`, `grid-cols-2`, `items-center` |
| Tipografía | `text-lg`, `font-semibold`, `text-slate-600` |
| Color y borde | `bg-white`, `border`, `rounded-xl`, `shadow-sm` |
| Estados | `hover:bg-brand-700`, `disabled:opacity-50`, `focus:ring` |
| Responsive | `sm:`, `md:`, `lg:` (de menor a mayor: *mobile first*) |

Ejemplo del curso: [`app.ts`](../../frontend/src/app/app.ts) y los componentes de [`shared/ui/`](../../frontend/src/app/shared/ui) (tema 5).

## Estilos globales vs locales
En Angular, cada componente tiene su propio CSS **encapsulado**. Eso da dos niveles:

**Global** ([`styles.css`](../../frontend/src/styles.css)): afecta a toda la app. Aquí van las directivas de Tailwind, estilos base y clases reutilizables con `@layer`:

```css
@layer base {
  body { @apply bg-slate-50 text-slate-800 antialiased; }
}
@layer components {
  .page-title { @apply text-2xl font-bold text-brand-700; }
}
```

**Local** (`styles` del componente): solo aplica a ese componente. Se usa poco con Tailwind, pero sirve para casos puntuales:

```ts
@Component({
  /* ... */
  styles: `p { border-left: 4px solid theme('colors.brand.500'); }`,
})
```

`theme('colors.brand.500')` lee el valor desde `tailwind.config.js`.

**Regla práctica:** utilidades en el template; `@layer components` solo para algo que repites en muchos sitios (como `.page-title`); y mejor aún, un **componente** (`Button`) antes que una clase.

## En el proyecto
```bash
git checkout tema-03
cd frontend && npm install && npm start
```
Verás un título, un párrafo con borde lateral (estilo local) y un botón con utilidades. Cambia `brand` en `tailwind.config.js` y comprueba cómo cambian todos los usos.

## Ejercicios
1. Añade un color `accent` al tema y úsalo en un botón.
2. Haz que el botón sea `w-full` en móvil y `w-auto` desde `md`.
3. Crea una clase `.card` con `@layer components` y úsala. Después reemplázala por un componente: ¿qué prefieres y por qué?

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [Guía paso a paso para instalar Tailwind en Angular 17](https://www.youtube.com/watch?v=Qh6GJAgCvPI) | Neider Ruiz | ES | Angular 17; revisa que use Tailwind 3 |
| [instalar tailwind en angular 18](https://www.youtube.com/watch?v=9MqLiZ9HGd8) | DosEnCodigo | ES | Angular 18 |
| [Cómo Instalar Tailwind CSS en Angular: Paso a Paso #angular18](https://www.youtube.com/watch?v=RQ5ekcrv55I) | Domini Code | ES | Angular 18 |
| [2️⃣ Instalación y Configuración de Tailwind en Angular](https://www.youtube.com/watch?v=NWqZtQKgymU) | Code Craft Zone | ES | Verifica la versión de Tailwind |
| [✅ Instalar Tailwind CSS v4 en Angular paso a paso (2025)](https://www.youtube.com/watch?v=f6E2kf7W1fk) | Domini Code | ES | ⚠️ **Tailwind 4**: sirve para comparar con la v3, no para seguir los pasos |

## Documentación oficial
- [Tailwind CSS v3 – Guía para Angular](https://v3.tailwindcss.com/docs/guides/angular)
- [Tailwind CSS v3 – Configuración](https://v3.tailwindcss.com/docs/configuration)
- [Tailwind CSS v3 – Directivas (`@layer`, `@apply`)](https://v3.tailwindcss.com/docs/functions-and-directives)
