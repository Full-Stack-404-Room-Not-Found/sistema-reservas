import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ReservaService, ReservaConHabitacion } from '../../../services/reserva.service';
import { HabitacionService } from '../../../services/habitacion.service';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/usuario';

// Poscondición del caso de uso Realizar una Reserva: el historial del usuario.
// Filtra por el id de la sesión, así cada uno ve solo sus reservas.
@Component({
  imports: [],
  selector: 'app-historial-reservas',
  styleUrl: './historial-reservas.css',
  templateUrl: './historial-reservas.html',
})
export class HistorialReservas implements OnInit {
  private reservaService = inject(ReservaService);
  private habitacionService = inject(HabitacionService);
  private authService = inject(AuthService);
  private cd = inject(ChangeDetectorRef);

  usuario: Usuario | null = null;
  items: ReservaConHabitacion[] = [];
  cargado = false;
  error = '';

  // ========== CARGA DEL HISTORIAL ==========
  // Las reservas traen el id_habitacion, no su nombre: el cruce lo hace el servicio.
  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual;

    if (!this.usuario) {
      this.error = 'Tenés que iniciar sesión para ver tus reservas.';
      return;
    }

    this.reservaService.listarPorUsuario(String(this.usuario.id)).subscribe({
      next: (reservas) => {
        this.habitacionService.listar().subscribe({
          next: (habitaciones) => {
            this.items = this.reservaService.conHabitacion(reservas, habitaciones);
            this.cargado = true;
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
  // La clase se asigna según el estado que devuelve la API, no fija en la plantilla.
  claseEstado(estado: string): string {
    if (estado === 'Confirmada') {
      return 'status-confirmed';
    }
    if (estado === 'Pendiente') {
      return 'status-pending';
    }
    return '';
  }
}
