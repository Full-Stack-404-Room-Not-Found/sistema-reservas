import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { QuienesSomos } from './pages/quienes-somos/quienes-somos';
import { Registro } from './pages/auth/registro/registro';
import { Login } from './pages/auth/login/login';
import { Inicio } from './pages/dashboard-admin/inicio/inicio';
import { Layout } from './pages/dashboard-admin/layout/layout';
import { DetalleHabitacion } from './pages/dashboard-admin/detalle-habitacion/detalle-habitacion';
import { CrearHabitacion } from './pages/dashboard-admin/crear-habitacion/crear-habitacion';
import { ConfirmarReserva } from './pages/dashboard-usuario/confirmar-reserva/confirmar-reserva';
import { HistorialReservas } from './pages/dashboard-usuario/historial-reservas/historial-reservas';
import { InicioUsuario } from './pages/dashboard-usuario/inicio/inicio';
import { ReservarHabitacion } from './pages/dashboard-usuario/reservar-habitacion/reservar-habitacion';

export const routes: Routes = [
  // ========== RUTA PRINCIPAL ==========
  { path: '', redirectTo: 'home', pathMatch: 'full' },


  { path: 'home', component: Home, title: 'Inicio' },
  { path: 'quienes-somos', component: QuienesSomos },
  { path: 'registro', component: Registro },
  { path: 'login', component: Login },

  // ========== RUTAS DE USUARIO ==========
  { path: 'confirmar-reserva', component: ConfirmarReserva },
  { path: 'historial-reservas', component: HistorialReservas },
  { path: 'inicio-usuario', component: InicioUsuario },
  { path: 'reservar-habitacion', component: ReservarHabitacion },

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