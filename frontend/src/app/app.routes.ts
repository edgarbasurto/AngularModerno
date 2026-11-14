import { Routes } from '@angular/router';
import { demoGuard } from './core/guards/demo.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home').then((m) => m.Home) },
  {
    path: 'products',
    loadComponent: () => import('./products/product-list').then((m) => m.ProductList),
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./products/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'admin-demo',
    canActivate: [demoGuard],
    loadComponent: () => import('./pages/admin-demo').then((m) => m.AdminDemo),
  },
  { path: '**', loadComponent: () => import('./pages/not-found').then((m) => m.NotFound) },
];
