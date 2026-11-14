import { Routes } from '@angular/router';
import { demoGuard } from './core/guards/demo.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout').then((m) => m.MainLayout),
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home').then((m) => m.Home) },
      {
        path: 'products',
        children: [
          {
            path: '',
            loadComponent: () => import('./products/product-list').then((m) => m.ProductList),
          },
          {
            path: ':id',
            loadComponent: () => import('./products/product-detail').then((m) => m.ProductDetail),
          },
        ],
      },
      {
        path: 'admin-demo',
        canActivate: [demoGuard],
        loadComponent: () => import('./pages/admin-demo').then((m) => m.AdminDemo),
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout').then((m) => m.AuthLayout),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login-placeholder').then((m) => m.LoginPlaceholder),
      },
    ],
  },
  { path: '**', loadComponent: () => import('./pages/not-found').then((m) => m.NotFound) },
];
