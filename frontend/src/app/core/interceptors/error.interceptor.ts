import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { NotificationService } from '../services/notification.service';

const MESSAGES: Record<number, string> = {
  0: 'No se pudo conectar con el servidor. ¿Está la API encendida?',
  400: 'Los datos enviados no son válidos.',
  401: 'Necesitas iniciar sesión para hacer esto.',
  403: 'No tienes permisos para esta acción.',
  404: 'El recurso solicitado no existe.',
  500: 'Error interno del servidor.',
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Token vencido o inválido: cerrar sesión y volver al login
      if (err.status === 401 && auth.token()) auth.logout();
      notify.error(MESSAGES[err.status] ?? `Error inesperado (${err.status}).`);
      return throwError(() => err); // el componente también puede reaccionar
    }),
  );
};
