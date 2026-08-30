import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { QuienesSomos } from './pages/quienes-somos/quienes-somos';
import { Registro } from './pages/auth/registro/registro';
import { Inicio } from './pages/dashboard-admin/inicio/inicio';
import { Layout } from './pages/dashboard-admin/layout/layout';

import { DetalleHabitacion } from './pages/dashboard-admin/detalle-habitacion/detalle-habitacion';
import { CrearHabitacion } from './pages/dashboard-admin/crear-habitacion/crear-habitacion';

import { Login } from './pages/auth/login/login';
import { ConfirmarReserva } from './pages/dashboard-usuario/confirmar-reserva/confirmar-reserva';
import { HistorialReservas} from './pages/dashboard-usuario/historial-reservas/historial-reservas'; 
import { InicioUsuario } from './pages/dashboard-usuario/inicio/inicio';
import { ReservarHabitacion } from './pages/dashboard-usuario/reservar-habitacion/reservar-habitacion';


export const routes: Routes = [
  { path: '', component: Home, title: 'Inicio', },
  { path: 'quienes-somos', component: QuienesSomos },
  { path: 'registro', component: Registro },
  {path: "login", component: Login},
  {path: "confirmar-reserva", component: ConfirmarReserva},
  {path: "historial-reservas", component: HistorialReservas},
  {path: "inicio-usuario", component: InicioUsuario},
  {path: "reservar-habitacion", component: ReservarHabitacion},
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



