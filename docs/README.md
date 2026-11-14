# Angular Moderno: documentación del curso

Curso de **Angular 21** con componentes standalone, Tailwind CSS 3 y una API en .NET. Cada tema tiene su documento y un proyecto de ejemplo (**MiniInventario**) que crece tema a tema.

> **Versiones usadas:** Angular 21.2 · Node 22.23 (con nvm) · Tailwind CSS 3.4 · ng-icons 36 · .NET 10.

## Cómo seguir el curso

1. Lee el documento del tema.
2. Mira el código real del proyecto con el tag del tema: `git checkout tema-08`. Cada tema tiene un commit y un tag (`tema-02` … `tema-16`).
3. Haz los ejercicios al final de cada documento.
4. Refuerza con los videos de YouTube de la sección **📺 Videos recomendados**.

Para levantar el proyecto, mira el [README de la raíz](../README.md).

## Temario

### Bloque 1 – Fundamentos y setup del proyecto (10 h)
| # | Tema | Duración | Tag |
|---|---|---|---|
| 1 | [Introducción a Angular moderno](bloque-1/01-introduccion.md) | 2 h | — |
| 2 | [Entorno, Node y Angular CLI](bloque-1/02-entorno-cli.md) | 2 h | `tema-02` |
| 3 | [Integración de Tailwind CSS](bloque-1/03-tailwind.md) | 3 h | `tema-03` |
| 4 | [Integración de ng-icons](bloque-1/04-ng-icons.md) | 3 h | `tema-04` |

### Bloque 2 – Componentes y templates (10 h)
| # | Tema | Duración | Tag |
|---|---|---|---|
| 5 | [Componentes standalone](bloque-2/05-componentes-standalone.md) | 3 h | `tema-05` |
| 6 | [Templates y data binding](bloque-2/06-templates-data-binding.md) | 4 h | `tema-06` |
| 7 | [Two-way binding, ciclo de vida y buenas prácticas](bloque-2/07-two-way-ciclo-vida.md) | 3 h | `tema-07` |

### Bloque 3 – Routing y layouts (8 h)
| # | Tema | Duración | Tag |
|---|---|---|---|
| 8 | [Routing con standalone](bloque-3/08-routing.md) | 4 h | `tema-08` |
| 9 | [Layouts y navegación con Tailwind](bloque-3/09-layouts-tailwind.md) | 4 h | `tema-09` |

### Bloque 4 – Formularios y validaciones (8 h)
| # | Tema | Duración | Tag |
|---|---|---|---|
| 10 | [Formularios en Angular](bloque-4/10-formularios.md) | 4 h | `tema-10` |
| 11 | [Validaciones y UX](bloque-4/11-validaciones-ux.md) | 4 h | `tema-11` |

### Bloque 5 – Servicios, estado y API (.NET) (8 h)
| # | Tema | Duración | Tag |
|---|---|---|---|
| 12 | [Servicios e inyección de dependencias](bloque-5/12-servicios-di.md) | 3 h | `tema-12` |
| 13 | [HttpClient y consumo de API](bloque-5/13-httpclient-api.md) | 5 h | `tema-13` |

### Bloque 6 – Estado, seguridad y cierre (6 h)
| # | Tema | Duración | Tag |
|---|---|---|---|
| 14 | [Manejo de estado sin Signals](bloque-6/14-estado-rxjs.md) | 2 h | `tema-14` |
| 15 | [Autenticación y autorización](bloque-6/15-autenticacion.md) | 2 h | `tema-15` |
| 16 | [Optimización y cierre del proyecto](bloque-6/16-build-produccion.md) | 2 h | `tema-16` |

### Plus
- [Novedades de Angular 21](plus/01-novedades-angular-21.md)
- [Control flow: @if, @for, @switch, @defer](plus/02-control-flow.md)
- [Testing básico con Vitest](plus/03-testing.md)

## Sobre los videos

- Cada enlace se comprobó con el endpoint oEmbed de YouTube el 2026-11-14: el video existe y el título y el canal coinciden con los de la tabla.
- Eso **no** significa que el contenido esté revisado línea por línea. Muchos videos son de Angular 15 a 20: los conceptos siguen valiendo, pero la sintaxis puede diferir un poco de este curso (Angular 21, sin `NgModule`, sin `zone.js`).
- Dónde la versión del video difiere de manera importante, la tabla lo indica en la columna **Nota**.
- Si un enlace deja de funcionar, avísalo y se reemplaza.

## Convenciones de estos documentos

- Los fragmentos de código salen del proyecto real. Cada uno enlaza a su archivo.
- Los nombres de archivo siguen la convención de Angular 20+: `button.ts` con la clase `Button`, sin sufijo `.component`. El tema 5 explica la diferencia.
