import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { QuienesSomos } from './pages/quienes-somos/quienes-somos';
import { Login } from './pages/auth/login/login';
import { Registro } from './pages/auth/registro/registro';
import { DashboardUsuarioLayout } from './pages/dashboard-usuario/layout/layout';
import { DashboardUsuarioInicio } from './pages/dashboard-usuario/inicio/inicio';
import { ReservarHabitacion } from './pages/dashboard-usuario/reservar-habitacion/reservar-habitacion';
import { HistorialReservas } from './pages/dashboard-usuario/historial-reservas/historial-reservas';
import { ConfirmacionReserva } from './pages/dashboard-usuario/confirmacion-reserva/confirmacion-reserva';
import { DashboardAdminLayout } from './pages/dashboard-admin/layout/layout';
import { DashboardAdminInicio } from './pages/dashboard-admin/inicio/inicio';
import { CrearHabitacion } from './pages/dashboard-admin/crear-habitacion/crear-habitacion';
import { DetalleHabitacion } from './pages/dashboard-admin/detalle-habitacion/detalle-habitacion';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home, title: 'Inicio' },
  { path: 'quienes-somos', component: QuienesSomos, title: 'Quiénes somos' },
  { path: 'login', component: Login, title: 'Iniciar sesión' },
  { path: 'registro', component: Registro, title: 'Registrarse' },

  {
    path: 'dashboard-usuario',
    component: DashboardUsuarioLayout,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: DashboardUsuarioInicio, title: 'Mi panel' },
      { path: 'reservar', component: ReservarHabitacion, title: 'Reservar habitación' },
      { path: 'historial', component: HistorialReservas, title: 'Historial de reservas' },
      { path: 'confirmacion', component: ConfirmacionReserva, title: 'Reserva confirmada' },
    ],
  },

  {
    path: 'dashboard-admin',
    component: DashboardAdminLayout,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: DashboardAdminInicio, title: 'Habitaciones' },
      { path: 'crear-habitacion', component: CrearHabitacion, title: 'Nueva habitación' },
      { path: 'habitacion/:id', component: DetalleHabitacion, title: 'Detalle de habitación' },
      { path: 'habitacion/:id/editar', component: CrearHabitacion, title: 'Editar habitación' },
    ],
  },

  { path: '**', component: NotFound, title: 'Página no encontrada' },
];