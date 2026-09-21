import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HabitacionService } from '../../../services/habitacion.service';
import { ComodidadService } from '../../../services/comodidad.service';
import { Habitacion } from '../../../models/habitacion';

// CU-03 Gestión de Habitaciones, flujo 4: ver el detalle de una habitación.
@Component({
  selector: 'app-detalle-habitacion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-habitacion.html',
  styleUrl: './detalle-habitacion.css',
})
export class DetalleHabitacion implements OnInit {
  @Input() id!: string;

  private habitacionService = inject(HabitacionService);
  private comodidadService = inject(ComodidadService);
  private cd = inject(ChangeDetectorRef);

  habitacion: Habitacion | null = null;
  comodidades: string[] = [];
  error = '';

  // ========== CARGA INICIAL ==========
  // La habitación y sus comodidades se piden por separado: json-server no hace joins.
  ngOnInit(): void {
    this.habitacionService.obtener(this.id).subscribe({
      next: (habitacion) => {
        this.habitacion = habitacion;
        this.cd.markForCheck();
      },
      error: (error) => {
        this.error = error.message;
        this.cd.markForCheck();
      },
    });

    this.comodidadService.listarRelaciones(this.id).subscribe({
      next: (relaciones) => {
        this.comodidadService.listar().subscribe({
          next: (comodidades) => {
            this.comodidades = this.comodidadService.nombresDe(relaciones, comodidades);
            this.cd.markForCheck();
          },
          error: (error) => {
            this.error = error.message;
            this.cd.markForCheck();
          },
        });
      },
      error: (error) => {
        this.error = error.message;
        this.cd.markForCheck();
      },
    });
  }

  // ========== PRESENTACIÓN ==========
  claseEstado(estado: string): string {
    if (estado === 'Disponible') {
      return 'available';
    }
    if (estado === 'Ocupada') {
      return 'occupied';
    }
    return 'maintenance';
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
}
