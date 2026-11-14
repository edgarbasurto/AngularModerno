import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

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
            path: 'new',
            canActivate: [authGuard],
            loadComponent: () => import('./products/product-form').then((m) => m.ProductForm),
          },
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
      { path: 'cart', loadComponent: () => import('./cart/cart-page').then((m) => m.CartPage) },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact').then((m) => m.Contact),
      },
      {
        path: 'admin-demo',
        canActivate: [roleGuard('Admin')],
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
        loadComponent: () => import('./auth/login').then((m) => m.Login),
      },
    ],
  },
  { path: '**', loadComponent: () => import('./pages/not-found').then((m) => m.NotFound) },
];
