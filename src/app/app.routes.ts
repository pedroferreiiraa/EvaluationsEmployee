import { Routes } from '@angular/router';


export const APP_ROUTES: Routes = [
  // {
  //   path: '', pathMatch: 'full', redirectTo: 'products'
  // },

  {
    path: '',
    loadComponent: () => import('./login/login.component').then(l => l.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(h => h.HomeComponent),
   
  },
  {
    path: 'departments/:id',
    loadComponent: () => import('./departments/departments.component').then(d => d.DepartmentDetailComponent),
    
  },
  {
    path: 'avaliacoes',
    loadComponent: () => import('./evaluations/evaluations.component').then(e => e.EvaluationsComponent)
  },
  {
    path: 'edit-user/:id',
    loadComponent: () => import('./edit-user/edit-user.component').then(e => e.EditUserComponent)
  },
  {
    path: 'add-user',
    loadComponent: () => import('./add-user/add-user.component').then(a => a.AddUserComponent)
  }
];
