import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

interface LoginResponse { token: string; username: string; role: string }
interface JwtPayload { sub: string; exp: number; [claim: string]: unknown }

const TOKEN_KEY = 'mi.token';
// .NET emite el rol con este nombre de claim largo
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly token = this._token.asReadonly();

  private payload = computed(() => {
    const t = this._token();
    return t ? this.decode(t) : null;
  });

  readonly username = computed(() => this.payload()?.sub ?? null);
  readonly role = computed(() => (this.payload()?.[ROLE_CLAIM] as string) ?? null);
  /** Autenticado = hay token Y no ha expirado. */
  readonly isLoggedIn = computed(() => {
    const p = this.payload();
    return !!p && p.exp * 1000 > Date.now();
  });

  login(username: string, password: string) {
    return this.http.post<LoginResponse>('/api/auth/login', { username, password }).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.token);
        this._token.set(res.token);
      }),
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
    this.router.navigate(['/auth/login']);
  }

  hasRole(role: string) {
    return this.isLoggedIn() && this.role() === role;
  }

  /** Un JWT es header.payload.firma en base64url. Solo leemos el payload (NO valida la firma). */
  private decode(token: string): JwtPayload | null {
    try {
      const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(escape(atob(b64))));
    } catch {
      return null;
    }
  }
}
