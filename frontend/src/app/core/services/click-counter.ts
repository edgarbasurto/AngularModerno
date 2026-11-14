import { Injectable } from '@angular/core';

/**
 * SIN providedIn: no es global. Cada componente que lo declare en `providers`
 * recibe SU PROPIA instancia (scope de componente).
 */
@Injectable()
export class ClickCounter {
  count = 0;
  hit() { return ++this.count; }
}
