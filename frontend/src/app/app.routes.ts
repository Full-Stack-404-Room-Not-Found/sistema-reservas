import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { QuienesSomos } from './pages/quienes-somos/quienes-somos';
import { Registro } from './pages/auth/registro/registro';
import { Inicio } from './pages/dashboard-admin/inicio/inicio';
import { Layout } from './pages/dashboard-admin/layout/layout';
import { Login } from './pages/auth/login/login';

export const routes: Routes = [
  { path: '', component: Home, title: 'Inicio',},
  { path: 'quienes-somos', component: QuienesSomos },
  { path: 'registro', component: Registro },
  { path: 'login', component: Login},


  {
    path: 'dashboard-admin',
    component: Layout,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: Inicio },
    ]
  },
]
