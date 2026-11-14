import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Guard introductorio: deja pasar solo si localStorage tiene demo-access=1.
 * Para probar: localStorage.setItem('demo-access', '1') en la consola del navegador.
 * En el tema 15 se reemplaza por un guard real basado en JWT.
 */
export const demoGuard: CanActivateFn = () => {
  const router = inject(Router);
  return localStorage.getItem('demo-access') === '1' ? true : router.createUrlTree(['/']);
};
