import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HabitacionService } from '../../../services/habitacion.service';
import { Habitacion } from '../../../models/habitacion';

// CU-03 Gestión de Habitaciones, flujo 4: consultar el catálogo.
@Component({
  imports: [RouterLink],
  selector: 'app-dashboard-admin-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class DashboardAdminInicio implements OnInit {
  private habitacionService = inject(HabitacionService);
  private cd = inject(ChangeDetectorRef);

  habitaciones: Habitacion[] = [];
  cargado = false;
  error = '';

  ngOnInit(): void {
    this.cargar();
  }

  // ========== CARGA DEL CATÁLOGO ==========
  private cargar(): void {
    this.habitacionService.listar().subscribe({
      next: (habitaciones) => {
        this.habitaciones = habitaciones;
        this.cargado = true;
        this.cd.markForCheck();
      },
      error: (error) => this.fallar(error),
    });
  }

  // ========== TARJETAS Y PRESENTACIÓN ==========
  // Los contadores se calculan sobre el array recibido: no hay ningún total guardado.
  contar(estado: string): number {
    return this.habitaciones.filter((habitacion) => habitacion.estado === estado).length;
  }

  claseEstado(estado: string): string {
    if (estado === 'Disponible') {
      return 'available-text';
    }
    if (estado === 'Ocupada') {
      return 'occupied-text';
    }
    return 'maintenance-text';
  }

  iconoEstado(estado: string): string {
    if (estado === 'Disponible') {
      return '🟢';
    }
    if (estado === 'Ocupada') {
      return '🔴';
    }
    return '🟡';
  }

  private fallar(error: Error): void {
    this.error = error.message;
    this.cd.markForCheck();
  }
}
