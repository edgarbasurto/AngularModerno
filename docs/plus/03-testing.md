# Plus 3. Testing básico con Vitest

Angular 21 usa **Vitest** como ejecutor de pruebas por defecto (antes era Karma + Jasmine).

## Ejecutar
```bash
cd frontend
ng test --watch=false     # una sola vez (CI)
ng test                   # modo observador
```
Resultado en este proyecto: `1 archivo, 2 pruebas, 2 pasan`.

## Una prueba real
[`shared/validators.spec.ts`](../../frontend/src/app/shared/validators.spec.ts) prueba los validadores del tema 11. Es una función pura: no necesita `TestBed` ni DOM.

```ts
import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { noWhitespace, priceRange } from './validators';

describe('validators', () => {
  it('noWhitespace rechaza solo espacios', () => {
    expect(noWhitespace(new FormControl('   '))).toEqual({ whitespace: true });
    expect(noWhitespace(new FormControl('Mouse'))).toBeNull();
  });

  it('priceRange valida el rango', () => {
    const v = priceRange(1, 100);
    expect(v(new FormControl(0))).not.toBeNull();
    expect(v(new FormControl(50))).toBeNull();
    expect(v(new FormControl(101))).not.toBeNull();
  });
});
```

Se importan `describe`, `it` y `expect` desde `vitest` de forma explícita.

## Qué probar primero
| Qué | Dificultad | Valor |
|---|---|---|
| Funciones puras (validadores, utilidades) | Baja | Alto |
| Servicios sin HTTP (`CartStore`) | Baja | Alto |
| Servicios con HTTP | Media (`provideHttpClientTesting`) | Alto |
| Componentes | Media (`TestBed`) | Medio |
| Guards e interceptores | Media | Alto |

La documentación oficial incluye un ejemplo de prueba de un guard con `RouterTestingHarness` y un servicio de autenticación simulado.

## Ejercicio
Escribe una prueba para `CartStore` ([`cart.store.ts`](../../frontend/src/app/cart/cart.store.ts)): agregar el mismo producto dos veces debe dar un solo ítem con `qty = 2`. Pista: lee el valor con `firstValueFrom(store.items$)`.

## 📺 Videos recomendados
No se encontraron ni validaron videos de pruebas con **Vitest en Angular** (es un cambio reciente). Usa la documentación oficial y el video de novedades de Angular 21 del [plus 1](01-novedades-angular-21.md).

## Documentación oficial
- [angular.dev – Testing](https://angular.dev/guide/testing)
- [Vitest](https://vitest.dev/)
