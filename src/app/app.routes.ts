import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  // {
  //   path: '', pathMatch: 'full', redirectTo: 'products'
  // },
  {
    path: 'products',
    loadChildren: () => import('./products/products.routes').then(r => r.PRODUCT_ROUTES)
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart/cart.component').then(c => c.CartComponent)
  },
  {
    path: '',
    loadComponent: () => import('./login/login.component').then(l => l.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(h => h.HomeComponent)
  },
  {
    path: 'departments/:id',
    loadComponent: () => import('./departments/departments.component').then(d => d.DepartmentDetailComponent)
  },
  {
    path: 'avaliacoes',
    loadComponent: () => import('./evaluations/evaluations.component').then(e => e.EvaluationsComponent)
  }
];
