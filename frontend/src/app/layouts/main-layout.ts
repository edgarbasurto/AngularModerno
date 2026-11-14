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
  templateUrl: './main-layout.html',
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
