import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HabitacionService } from '../../../services/habitacion.service';
import { ComodidadService } from '../../../services/comodidad.service';
import { ReservaService } from '../../../services/reserva.service';
import { PagoService } from '../../../services/pago.service';
import { AuthService } from '../../../services/auth.service';
import { Habitacion } from '../../../models/habitacion';
import { Reserva } from '../../../models/reserva';

// Segunda pantalla del caso de uso Realizar una Reserva.
// Implementa los pasos 6 a 12: muestra el detalle de la habitación elegida
// y, al confirmar, registra la reserva, su pago y la nueva disponibilidad.
@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-reservar-habitacion',
  styleUrl: './reservar-habitacion.css',
  templateUrl: './reservar-habitacion.html',
})
export class ReservarHabitacion implements OnInit {
  // ========== DATOS QUE LLEGAN POR LA URL ==========
  // El id viene de la ruta reservar/:id; las fechas y los huéspedes, de los
  // query params que arma el buscador. withComponentInputBinding() los liga solo.
  @Input() id = '';
  @Input() checkin = '';
  @Input() checkout = '';
  @Input() huespedes = '1';

  // ========== ESTADO DE LA PANTALLA ==========
  habitacion: Habitacion | null = null;
  comodidades: string[] = [];
  errorDetalle = '';
  errorReserva = '';
  guardando = false;

  form: FormGroup;
  get NombreApellido() {
    return this.form.get('nombreApellido');
  }
  get Telefono() {
    return this.form.get('telefono');
  }
  get Email() {
    return this.form.get('email');
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private habitacionService: HabitacionService,
    private comodidadService: ComodidadService,
    private reservaService: ReservaService,
    private pagoService: PagoService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
  ) {
    this.form = this.formBuilder.group({
      nombreApellido: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // ========== CARGA INICIAL ==========
  // La habitación y sus comodidades se piden por separado porque json-server no
  // hace joins: el cruce de la tabla puente se resuelve en el servicio.
  ngOnInit(): void {
    // Paso 8 del caso de uso: los datos personales ya están en USUARIO,
    // el formulario los muestra para que el huésped los confirme.
    const usuario = this.authService.usuarioActual;
    if (usuario) {
      this.form.patchValue({
        nombreApellido: `${usuario.nombre} ${usuario.apellido}`,
        telefono: usuario.telefono ?? '',
        email: usuario.email,
      });
    }

    this.habitacionService.obtener(this.id).subscribe({
      next: (habitacion) => {
        this.habitacion = habitacion;
        this.cd.markForCheck();
      },
      error: (error) => {
        this.errorDetalle = error.message;
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
            this.errorDetalle = error.message;
            this.cd.markForCheck();
          },
        });
      },
      error: (error) => {
        this.errorDetalle = error.message;
        this.cd.markForCheck();
      },
    });
  }

  // ========== CÁLCULOS DE LA ESTADÍA ==========
  get noches(): number {
    if (!this.checkin || !this.checkout) {
      return 0;
    }
    const entrada = new Date(this.checkin).getTime();
    const salida = new Date(this.checkout).getTime();
    return Math.round((salida - entrada) / (1000 * 60 * 60 * 24));
  }

  get precioTotal(): number {
    return this.habitacion ? this.noches * this.habitacion.precio_noche : 0;
  }

  // ========== CONFIRMAR LA RESERVA ==========
  // Pasos 10 a 12 del caso de uso, en tres pedidos encadenados: la reserva
  // primero, porque el pago necesita el id que devuelve, y la disponibilidad al final.
  onEnviar(event: Event) {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const usuario = this.authService.usuarioActual;
    if (!usuario) {
      this.errorReserva = 'Tenés que iniciar sesión para reservar.';
      return;
    }

    // Sin fechas no hay estadía que calcular: se llega acá entrando a la url a mano
    if (this.noches <= 0 || !this.habitacion) {
      this.errorReserva = 'Volvé al buscador y elegí las fechas de la estadía.';
      return;
    }

    this.errorReserva = '';
    this.guardando = true;

    const reserva: Reserva = {
      id_usuario: Number(usuario.id),
      id_habitacion: Number(this.id),
      fecha_checkin: this.checkin,
      fecha_checkout: this.checkout,
      cantidad_huespedes: Number(this.huespedes),
      estado: 'Confirmada',
      precio_total: this.precioTotal,
    };

    this.reservaService.crear(reserva).subscribe({
      next: (creada) => {
        // Paso 12 del caso de uso: el pago queda pendiente y la habitación pasa a ocupada
        this.pagoService
          .crear({
            id_reserva: Number(creada.id),
            estado: 'Pendiente',
            monto: creada.precio_total,
            fecha: new Date().toISOString(),
          })
          .subscribe({
            next: () => {
              this.habitacionService.actualizarEstado(Number(this.id), 'Ocupada').subscribe({
                next: () => {
                  this.router.navigate(['/dashboard-usuario/confirmacion'], {
                    queryParams: { reserva: creada.id },
                  });
                },
                error: (error) => {
                  this.fallo(error);
                },
              });
            },
            error: (error) => {
              this.fallo(error);
            },
          });
      },
      error: (error) => {
        this.fallo(error);
      },
    });
  }

  private fallo(error: Error): void {
    this.errorReserva = error.message;
    this.guardando = false;
    this.cd.markForCheck();
  }
}
