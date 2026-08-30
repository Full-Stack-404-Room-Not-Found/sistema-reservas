import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { QuienesSomos } from './pages/quienes-somos/quienes-somos';
import { Registro } from './pages/auth/registro/registro';
import { Login } from './pages/auth/login/login';
import { Inicio } from './pages/dashboard-admin/inicio/inicio';
import { Layout } from './pages/dashboard-admin/layout/layout';
import { DetalleHabitacion } from './pages/dashboard-admin/detalle-habitacion/detalle-habitacion';
import { CrearHabitacion } from './pages/dashboard-admin/crear-habitacion/crear-habitacion';

export const routes: Routes = [
  // ========== RUTA PRINCIPAL ==========
  { path: '', redirectTo: 'home', pathMatch: 'full' },


  { path: 'home', component: Home, title: 'Inicio' },
  { path: 'quienes-somos', component: QuienesSomos },
  { path: 'registro', component: Registro },
  { path: 'login', component: Login },

  // ========== DASHBOARD ADMIN ==========
  {
    path: 'dashboard-admin',
    component: Layout,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: Inicio },
      { path: 'detalle-habitacion/:id', component: DetalleHabitacion },
      { path: 'crear-habitacion/:id', component: CrearHabitacion },
    ]
  },

  // ========== RUTA 404 ==========
  { path: '**', redirectTo: 'dashboard-admin/inicio' }
];

