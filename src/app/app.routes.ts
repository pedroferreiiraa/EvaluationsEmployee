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
    path: 'evaluations',
    loadComponent: () => import('./evaluations/evaluations.component').then(e => e.EvaluationsComponent)
  },
  {
    path: 'do-user-evaluation',
    loadComponent: () => import('./do-user-evaluation/do-user-evaluation.component').then(e => e.DoUserEvaluationComponent)
  },
  {
    path: 'do-leader-evaluation',
    loadComponent: () => import('./do-leader-evaluation/do-leader-evaluation.component').then(l => l.DoLeaderEvaluationComponent)
  },
  {
    path: 'departments/:id',
    loadComponent: () => import('./departments/departments.component').then(d => d.DepartmentDetailComponent),
  },
  {
    path: 'edit-department/:id',
    loadComponent: () => import('./edit-department/edit-department.component').then(e => e.EditDepartmentComponent)
  },
  {
    path: 'user-details/:id',
    loadComponent: () => import('./user-details/user-details.component').then(u => u.UserDetailsComponent)
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
