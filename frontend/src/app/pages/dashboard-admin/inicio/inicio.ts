import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HabitacionService } from '../../../services/habitacion.service';
import { ComodidadService } from '../../../services/comodidad.service';
import { ReservaService } from '../../../services/reserva.service';
import { Habitacion } from '../../../models/habitacion';

// CU-03 Gestión de Habitaciones, flujo 4: consultar el catálogo.
// Incluye además el flujo 3, eliminar, con su verificación CU-03-A5.
@Component({
  imports: [RouterLink],
  selector: 'app-dashboard-admin-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class DashboardAdminInicio implements OnInit {
  private habitacionService = inject(HabitacionService);
  private comodidadService = inject(ComodidadService);
  private reservaService = inject(ReservaService);
  private cd = inject(ChangeDetectorRef);

  habitaciones: Habitacion[] = [];
  cargado = false;
  error = '';
  borrando = false;

  ngOnInit(): void {
    this.cargar();
  }

  // ========== CARGA DEL CATÁLOGO ==========
  private cargar(): void {
    this.habitacionService.listar().subscribe({
      next: (habitaciones) => {
        this.habitaciones = habitaciones;
        this.cargado = true;
        this.borrando = false;
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

  // ========== ELIMINAR UNA HABITACIÓN ==========
  // Flujo 3 del CU-03: confirmar, verificar que no tenga reservas vigentes,
  // borrar sus comodidades y recién entonces la habitación.
  eliminar(habitacion: Habitacion): void {
    if (!confirm('¿Está seguro de eliminar esta habitación?')) {
      return;
    }

    this.error = '';
    this.borrando = true;
    const id = String(habitacion.id);

    this.reservaService.listarPorHabitacion(id).subscribe({
      next: (reservas) => {
        // CU-03-A5: no se borra si quedan reservas activas o futuras
        const vigentes = reservas.filter(
          (reserva) =>
            reserva.estado !== 'Cancelada' && reserva.fecha_checkout >= this.fechaDeHoy(),
        );

        if (vigentes.length > 0) {
          this.error =
            'No se puede eliminar la habitación porque tiene reservas activas o futuras. ' +
            'Podés marcarla como Mantenimiento en vez de eliminarla.';
          this.borrando = false;
          this.cd.markForCheck();
          return;
        }

        this.borrarComodidadesY(id);
      },
      error: (error) => this.fallar(error),
    });
  }

  // Las filas de la tabla puente se borran primero, para no dejar claves foráneas huérfanas
  private borrarComodidadesY(id: string): void {
    this.comodidadService.listarRelaciones(id).subscribe({
      next: (relaciones) => {
        if (relaciones.length === 0) {
          this.borrarHabitacion(id);
          return;
        }

        let restantes = relaciones.length;
        relaciones.forEach((relacion) => {
          this.comodidadService.eliminarRelacion(Number(relacion.id)).subscribe({
            next: () => {
              restantes--;
              if (restantes === 0) {
                this.borrarHabitacion(id);
              }
            },
            error: (error) => this.fallar(error),
          });
        });
      },
      error: (error) => this.fallar(error),
    });
  }

  private borrarHabitacion(id: string): void {
    this.habitacionService.eliminar(id).subscribe({
      next: () => {
        // No se vuelve a consultar la API: json-server recarga el archivo después de escribir
        // y el pedido inmediato puede fallar. La fila se saca de la lista que ya está en memoria.
        this.habitaciones = this.habitaciones.filter((habitacion) => String(habitacion.id) !== id);
        this.borrando = false;
        this.cd.markForCheck();
      },
      error: (error) => this.fallar(error),
    });
  }

  private fechaDeHoy(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }

  private fallar(error: Error): void {
    this.error = error.message;
    this.borrando = false;
    this.cd.markForCheck();
  }
}
