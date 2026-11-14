import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../auth/auth.service';
import { CartStore } from '../cart/cart.store';
import { LoadingService } from '../core/services/loading.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIcon, AsyncPipe],
  template: `
    <header class="sticky top-0 z-10 flex items-center gap-3 bg-brand-700 px-4 py-3 text-white">
      <!-- Botón hamburguesa: solo visible en móvil -->
      <button class="md:hidden" aria-label="Abrir menú" (click)="sidebarOpen.set(!sidebarOpen())">
        <ng-icon name="heroBars3" size="1.5rem" />
      </button>
      <ng-icon name="heroCube" size="1.5rem" />
      <span class="font-semibold">MiniInventario</span>
      <span class="flex-1"></span>
      <a routerLink="/cart" class="flex items-center gap-1 text-sm hover:underline">
        <ng-icon name="heroShoppingCart" /> {{ cart.count$ | async }}
      </a>
      @if (auth.isLoggedIn()) {
        <span class="flex items-center gap-1 text-sm">
          <ng-icon name="heroUser" /> {{ auth.username() }} ({{ auth.role() }})
        </span>
        <button class="flex items-center gap-1 text-sm hover:underline" (click)="auth.logout()">
          <ng-icon name="heroArrowRightOnRectangle" /> Salir
        </button>
      } @else {
        <a routerLink="/auth/login" class="flex items-center gap-1 text-sm hover:underline">
          <ng-icon name="heroUser" /> Ingresar
        </a>
      }
    </header>

    @if (loadingService.loading()) {
      <div class="h-1 w-full animate-pulse bg-brand-500"></div>
    }

    <div class="md:flex">
      <!-- Sidebar: oculto en móvil salvo que se abra; fijo en md+ -->
      <aside
        class="w-full border-r border-slate-200 bg-white p-4 md:block md:min-h-[calc(100vh-52px)] md:w-56"
        [class.hidden]="!sidebarOpen()"
      >
        <nav class="flex flex-col gap-1">
          @for (item of visibleMenu(); track item.link) {
            <a
              [routerLink]="item.link"
              routerLinkActive="bg-brand-100 text-brand-700"
              [routerLinkActiveOptions]="{ exact: item.link === '/' }"
              class="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100"
              (click)="sidebarOpen.set(false)"
            >
              <ng-icon [name]="item.icon" /> {{ item.label }}
            </a>
          }
        </nav>
      </aside>

      <main class="flex-1 p-4 md:p-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class MainLayout {
  auth = inject(AuthService);
  cart = inject(CartStore);
  loadingService = inject(LoadingService);
  sidebarOpen = signal(false);
  menu: { link: string; label: string; icon: string; admin?: boolean }[] = [
    { link: '/', label: 'Inicio', icon: 'heroHome' },
    { link: '/products', label: 'Productos', icon: 'heroCube' },
    { link: '/products/new', label: 'Nuevo producto', icon: 'heroPlus' },
    { link: '/contact', label: 'Contacto', icon: 'heroUser' },
    { link: '/admin-demo', label: 'Admin', icon: 'heroTag', admin: true },
  ];

  visibleMenu() {
    return this.menu.filter((m) => !m.admin || this.auth.hasRole('Admin'));
  }
}
