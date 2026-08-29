import { Routes } from '@angular/router';
import { QuienesSomos } from './pages/quienes-somos/quienes-somos';
import { Registro } from './pages/auth/registro/registro';

export const routes: Routes = [
  { path: 'quienes-somos', component: QuienesSomos },
  { path: 'registro', component: Registro },
];
