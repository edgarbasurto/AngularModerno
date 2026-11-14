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
  templateUrl: './login.html',
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
