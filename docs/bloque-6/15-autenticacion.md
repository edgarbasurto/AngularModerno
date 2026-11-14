# 15. Autenticación y autorización

**Duración:** 2 h · **Bloque 6** · **Tag del proyecto:** `tema-15`

## Objetivos
- Implementar el login contra la API .NET.
- Entender qué es un JWT y cómo se guarda y se lee.
- Agregar el token a las peticiones con un interceptor.
- Proteger rutas con *guards* (por sesión y por rol).

## Autenticación vs autorización
- **Autenticación:** *¿quién eres?* → el login.
- **Autorización:** *¿qué puedes hacer?* → los roles y permisos.

## El flujo
```
 Login (usuario, clave)
      │ POST /api/auth/login
      ▼
   API .NET ──► valida ──► devuelve { token, username, role }
      │
      ▼
 Angular guarda el token ──► cada petición lleva
                             Authorization: Bearer <token>
      │
      ▼
 API valida el token en cada petición ──► 200 / 401 / 403
```

## Manejo de JWT
Un **JWT** (*JSON Web Token*) son tres partes en base64url separadas por puntos: `cabecera.payload.firma`.

- **Payload:** datos (*claims*) como el usuario, el rol y la expiración (`exp`, en segundos desde 1970).
- **Firma:** la crea la API con una clave secreta; garantiza que nadie alteró el token.

El payload real que emite la API de este proyecto (decodificado):

```json
{
  "sub": "admin",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Admin",
  "exp": 1794689899
}
```

> **Detalle de .NET:** el rol viaja con el nombre largo `http://schemas.microsoft.com/…/claims/role`, no como `role`. El frontend debe leer ese nombre exacto.

### `AuthService`
[`auth/auth.service.ts`](../../frontend/src/app/auth/auth.service.ts) usa **signals**: el estado de sesión es estado de la vista, y los `computed` se actualizan solos.

```ts
private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

private payload = computed(() => { const t = this._token(); return t ? this.decode(t) : null; });

readonly username = computed(() => this.payload()?.sub ?? null);
readonly role     = computed(() => (this.payload()?.[ROLE_CLAIM] as string) ?? null);
readonly isLoggedIn = computed(() => {
  const p = this.payload();
  return !!p && p.exp * 1000 > Date.now();   // hay token Y no expiró
});

login(username: string, password: string) {
  return this.http.post<LoginResponse>('/api/auth/login', { username, password }).pipe(
    tap((res) => { localStorage.setItem(TOKEN_KEY, res.token); this._token.set(res.token); }),
  );
}

logout() {
  localStorage.removeItem(TOKEN_KEY);
  this._token.set(null);
  this.router.navigate(['/auth/login']);
}
```

Puntos clave:
- **Persistencia:** el token se guarda en `localStorage` para sobrevivir a una recarga, y se lee al arrancar.
- **Decodificar ≠ validar.** El frontend solo **lee** el payload (para mostrar el usuario y comprobar la expiración). No puede verificar la firma: eso lo hace la API.
- `isLoggedIn` revisa `exp` en cada lectura: un token vencido cuenta como "sin sesión".

## Login
[`auth/login.ts`](../../frontend/src/app/auth/login.ts) es un formulario reactivo (tema 10) dentro del `AuthLayout` (tema 9):

```ts
submit() {
  if (this.form.invalid) return this.form.markAllAsTouched();
  this.busy.set(true);
  this.auth.login(username, password).subscribe({
    next: () => { this.notify.success(`Bienvenido, ${username}`); this.router.navigateByUrl(this.returnUrl()); },
    error: () => { this.failed.set(true); this.busy.set(false); },
  });
}
```

- `returnUrl` llega como `input()` desde `?returnUrl=...` (gracias a `withComponentInputBinding`): tras el login, el usuario vuelve a **donde quería ir**.
- `busy` y `failed` son signals: el botón se deshabilita mientras se envía y se muestra el error de credenciales.

Usuarios de prueba: **`admin` / `admin123`** (rol Admin) y **`user` / `user123`** (rol User).

## Interceptor de autenticación
[`core/interceptors/auth.interceptor.ts`](../../frontend/src/app/core/interceptors/auth.interceptor.ts):

```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  if (!token || !req.url.startsWith('/api')) return next(req);   // no enviar el token a terceros
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
```

- Las peticiones son **inmutables**: se usa `req.clone(...)`.
- **Solo se adjunta a rutas propias** (`/api`). Enviar el token a un dominio externo lo filtraría.
- Se registra en [`app.config.ts`](../../frontend/src/app/app.config.ts): `withInterceptors([loadingInterceptor, authInterceptor, errorInterceptor])`.
- El `errorInterceptor` ahora también **cierra sesión ante un `401`** si había un token (vencido o inválido).

## Guards
[`core/guards/auth.guard.ts`](../../frontend/src/app/core/guards/auth.guard.ts):

```ts
/** Exige sesión. Si no hay, redirige al login recordando a dónde iba. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  return auth.isLoggedIn()
    ? true
    : inject(Router).createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};

/** Fábrica de guard por rol: canActivate: [roleGuard('Admin')] */
export const roleGuard = (role: string): CanActivateFn => () => {
  const auth = inject(AuthService);
  return auth.hasRole(role) ? true : inject(Router).createUrlTree(['/']);
};
```

`roleGuard` es una **fábrica**: una función que devuelve un guard configurado con el rol.

## Protección de rutas
En [`app.routes.ts`](../../frontend/src/app/app.routes.ts):

```ts
{ path: 'new',        canActivate: [authGuard],          loadComponent: /* ProductForm */ },
{ path: 'admin-demo', canActivate: [roleGuard('Admin')], loadComponent: /* AdminDemo   */ },
```

La interfaz también se adapta al rol:
- El navbar muestra "Ingresar" o `usuario (rol)` + "Salir" ([`main-layout.ts`](../../frontend/src/app/layouts/main-layout.ts)).
- El enlace **Admin** del sidebar y el botón **Eliminar** solo se muestran a los Admin.

### ⚠️ Esto es UX, no seguridad
Ocultar un botón o proteger una ruta **en el navegador** no impide nada: cualquiera puede modificar el JavaScript o llamar a la API directamente. **La seguridad real está en la API**, que valida el token y el rol en cada petición. Se comprobó con `curl` contra la API de este proyecto:

| Petición | Resultado |
|---|---|
| Login con credenciales incorrectas | `401` |
| `DELETE /api/products/3` sin token | `401` |
| `DELETE /api/products/3` con token de **user** | `403` |
| `DELETE /api/products/3` con token de **admin** | `204` |

### Dónde guardar el token
`localStorage` es simple, pero **cualquier script que se ejecute en tu página (XSS) puede leerlo**. Alternativas: cookies `HttpOnly` (inaccesibles desde JavaScript, pero requieren manejar CSRF) o tokens de vida corta con *refresh token*. Para un curso, `localStorage` basta; en producción, evalúa el riesgo.

### Limitaciones de este ejemplo (a propósito)
- Las contraseñas están escritas a mano en la API y se comparan en texto plano. **Nunca hagas esto en producción:** usa *hash* (por ejemplo, ASP.NET Core Identity).
- La clave de firma del JWT está en el código. En producción va en una variable de entorno o un gestor de secretos.
- No hay *refresh token*: al expirar (1 hora) hay que volver a iniciar sesión.

## En el proyecto
```bash
# Terminal 1
cd api && dotnet run

# Terminal 2
git checkout tema-15
cd frontend && npm install && npm start
```
Prueba, en este orden:
1. Entra a `/products/new` sin sesión → te redirige a `/auth/login?returnUrl=/products/new`.
2. Inicia sesión como `user` / `user123` → vuelves a `/products/new`. **No** ves el enlace Admin ni el botón Eliminar. Crea un producto.
3. Cierra sesión e inicia como `admin` / `admin123` → aparece Admin y Eliminar. Borra un producto.
4. Fuerza un `403`: con la sesión de `user`, ejecuta en la consola del navegador un `fetch('/api/products/1', {method:'DELETE', headers:{Authorization:'Bearer '+localStorage.getItem('mi.token')}})` y mira la respuesta.

## Ejercicios
1. Muestra en el navbar cuántos minutos le quedan al token.
2. Crea un `guestGuard` que redirija a `/` si el usuario **ya** tiene sesión e intenta entrar a `/auth/login`.
3. Agrega un `PUT` desde una pantalla de edición y proteja la ruta con `authGuard`.

## 📺 Videos recomendados

| Video | Canal | Idioma | Nota |
|---|---|---|---|
| [Autenticación en Angular con JWT](https://www.youtube.com/watch?v=cm7KzeKMLHA) | Walberth Felipe Gutiérrez Telles | ES | Es el único en español encontrado; revisa la versión de Angular que usa |
| [Angular 19 Tutorial \| What is Interceptor \| JWT login in Angular \| Part 27](https://www.youtube.com/watch?v=I27bRQC5gEY) | LEARNING PARTNER | EN | Angular 19 |
| [How to Use Angular Interceptor for JWT Token-Based Authentication](https://www.youtube.com/watch?v=o2J_p6mvHHQ) | LEARNING PARTNER | EN | Interceptor con JWT |
| [Interceptors in Angular #2 - Adding Authentication Token to HTTP Requests](https://www.youtube.com/watch?v=eqLqn7txjHY) | A Coder's Journey | EN | Adjuntar el token |
| [Interceptores en Angular 19+: Token, Loader y Mejora de UX con Debounce](https://www.youtube.com/watch?v=Xx77sA8Cxh8) | DotTech-ES | ES | Incluye el interceptor de token |

> No se encontró un video en español específico de **guards funcionales** que se pudiera validar; el video de rutas del tema 8 ([Luis Arias Dev](https://www.youtube.com/watch?v=WyydiGTOTxQ)) los menciona. Varios de los videos de esta tabla son de versiones antiguas (interceptores y guards **basados en clases**): el concepto es el mismo, pero hoy se escriben como funciones.

## Documentación oficial
- [angular.dev – Route guards](https://angular.dev/guide/routing/route-guards)
- [angular.dev – Interceptores](https://angular.dev/guide/http/interceptors)
- [jwt.io](https://jwt.io/) (para decodificar un token y ver sus partes)
- [Microsoft – JWT Bearer en ASP.NET Core](https://learn.microsoft.com/aspnet/core/security/authentication/)
