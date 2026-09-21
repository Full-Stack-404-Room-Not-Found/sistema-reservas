import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HabitacionService } from '../../../services/habitacion.service';
import { ReservaService } from '../../../services/reserva.service';
import { Habitacion } from '../../../models/habitacion';

// Primera pantalla del caso de uso Realizar una Reserva, pasos 1 a 4.
// Busca habitaciones libres y, si no hay ninguna, muestra el flujo alternativo A.
@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-dashboard-usuario-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class DashboardUsuarioInicio {
  private fb = inject(FormBuilder);
  private habitacionService = inject(HabitacionService);
  private reservaService = inject(ReservaService);
  private cd = inject(ChangeDetectorRef);

  habitaciones: Habitacion[] = [];
  buscado = false;
  errorBusqueda = '';

  // Viajan en la url hacia la pantalla de reserva, que las necesita para el POST
  filtros = { checkin: '', checkout: '', huespedes: '1' };

  buscador = this.fb.nonNullable.group({
    checkin: ['', [Validators.required]],
    checkout: ['', [Validators.required]],
    huespedes: ['1', [Validators.required]],
    tipo: [''],
  });

  // ========== BUSCAR HABITACIONES ==========
  // Dos consultas encadenadas: las habitaciones candidatas y todas las reservas.
  // El descarte por fechas lo hace el servicio, porque json-server no lo resuelve.
  buscar(): void {
    this.errorBusqueda = '';
    const { checkin, checkout, huespedes, tipo } = this.buscador.getRawValue();

    if (!checkin || !checkout) {
      this.errorBusqueda = 'Elegí la fecha de entrada y la de salida.';
      return;
    }

    // Paso 2 del caso de uso: la salida tiene que ser posterior a la entrada
    if (checkout <= checkin) {
      this.errorBusqueda = 'La fecha de salida debe ser posterior a la de entrada.';
      return;
    }

    this.habitacionService.listarDisponibles(tipo, Number(huespedes)).subscribe({
      next: (habitaciones) => {
        this.reservaService.listar().subscribe({
          next: (reservas) => {
            this.habitaciones = this.habitacionService.filtrarPorFechas(
              habitaciones,
              reservas,
              checkin,
              checkout,
            );
            this.filtros = { checkin, checkout, huespedes };
            this.buscado = true;
            this.cd.markForCheck();
          },
          error: (error) => {
            this.errorBusqueda = error.message;
            this.cd.markForCheck();
          },
        });
      },
      error: (error) => {
        this.errorBusqueda = error.message;
        this.cd.markForCheck();
      },
    });
  }
}
