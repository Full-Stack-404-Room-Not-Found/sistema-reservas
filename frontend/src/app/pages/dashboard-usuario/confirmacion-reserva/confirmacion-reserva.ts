import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservaService } from '../../../services/reserva.service';
import { HabitacionService } from '../../../services/habitacion.service';
import { PagoService } from '../../../services/pago.service';
import { Reserva } from '../../../models/reserva';
import { Habitacion } from '../../../models/habitacion';
import { Pago } from '../../../models/pago';

// Tercera pantalla del caso de uso Realizar una Reserva, paso 11.
// Muestra la reserva recién creada y su pago; el id llega por query param.
@Component({
  imports: [RouterLink],
  selector: 'app-confirmacion-reserva',
  styleUrl: './confirmacion-reserva.css',
  templateUrl: './confirmacion-reserva.html',
})
export class ConfirmacionReserva implements OnInit {
  @Input() reserva = '';

  reservaCreada: Reserva | null = null;
  habitacion: Habitacion | null = null;
  pago: Pago | null = null;
  error = '';

  constructor(
    private reservaService: ReservaService,
    private habitacionService: HabitacionService,
    private pagoService: PagoService,
    private cd: ChangeDetectorRef,
  ) {}

  // ========== TRAER LO QUE SE ACABA DE CREAR ==========
  ngOnInit(): void {
    if (!this.reserva) {
      return;
    }

    this.reservaService.obtener(this.reserva).subscribe({
      next: (reserva) => {
        this.reservaCreada = reserva;
        this.cd.markForCheck();

        this.habitacionService.obtener(String(reserva.id_habitacion)).subscribe({
          next: (habitacion) => {
            this.habitacion = habitacion;
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

    this.pagoService.listarPorReserva(this.reserva).subscribe({
      next: (pagos) => {
        this.pago = pagos.length > 0 ? pagos[0] : null;
        this.cd.markForCheck();
      },
      error: (error) => {
        this.error = error.message;
        this.cd.markForCheck();
      },
    });
  }
}
