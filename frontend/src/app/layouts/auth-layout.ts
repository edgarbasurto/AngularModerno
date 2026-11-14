import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-brand-50 p-4">
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <router-outlet />
      </div>
    </div>
  `,
})
export class AuthLayout {}
