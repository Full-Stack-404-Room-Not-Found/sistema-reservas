import { Routes } from '@angular/router';
import { QuienesSomos } from './pages/quienes-somos/quienes-somos';
import { Registro } from './pages/auth/registro/registro';
import { Inicio } from './pages/dashboard-admin/inicio/inicio';
import { Layout } from './pages/dashboard-admin/layout/layout';
import { DetalleHabitacion } from './pages/dashboard-admin/detalle-habitacion/detalle-habitacion';
import { CrearHabitacion } from './pages/dashboard-admin/crear-habitacion/crear-habitacion';

export const routes: Routes = [

  { path: 'quienes-somos', component: QuienesSomos },
  { path: 'registro', component: Registro },

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


  { path: '', redirectTo: 'quienes-somos', pathMatch: 'full' },


  { path: '**', redirectTo: 'dashboard-admin/inicio' }
];
