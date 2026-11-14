import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../core/services/notification.service';
import { Button } from '../shared/ui/button';
import { FieldError } from '../shared/ui/field-error';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Button, FieldError],
  template: `
    <h1 class="page-title mb-4">Iniciar sesión</h1>
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-3" novalidate>
      <div>
        <input formControlName="username" placeholder="Usuario"
          class="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <app-field-error [control]="form.controls.username" />
      </div>
      <div>
        <input formControlName="password" type="password" placeholder="Contraseña"
          class="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <app-field-error [control]="form.controls.password" />
      </div>
      @if (failed()) {
        <p class="text-sm text-red-600">Usuario o contraseña incorrectos.</p>
      }
      <app-button type="submit" [disabled]="busy()">{{ busy() ? 'Ingresando…' : 'Ingresar' }}</app-button>
    </form>
    <p class="mt-4 text-xs text-slate-500">Demo: admin / admin123 · user / user123</p>
  `,
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);

  returnUrl = input<string>('/'); // llega del query param ?returnUrl=
  busy = signal(false);
  failed = signal(false);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.busy.set(true);
    this.failed.set(false);
    const { username, password } = this.form.getRawValue();
    this.auth.login(username, password).subscribe({
      next: () => {
        this.notify.success(`Bienvenido, ${username}`);
        this.router.navigateByUrl(this.returnUrl());
      },
      error: () => {
        this.failed.set(true);
        this.busy.set(false);
      },
    });
  }
}
