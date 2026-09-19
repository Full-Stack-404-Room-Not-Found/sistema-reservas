import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservaService } from '../../../services/reserva.service';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-reservar-habitacion',
  styleUrl: './reservar-habitacion.css',
  templateUrl: './reservar-habitacion.html'
})

export class ReservarHabitacion {

  form: FormGroup;
  fechaInvalida = false;

  get FechaCheckin() {
    return this.form.get('fechaCheckin');
  }
  get FechaCheckout() {
    return this.form.get('fechaCheckout');
  }
  get CantidadHuespedes() {
    return this.form.get('cantidadHuespedes');
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private reservaService: ReservaService
  ) {

    this.form = this.formBuilder.group({
      fechaCheckin: ['', [Validators.required]],
      fechaCheckout: ['', [Validators.required]],
      cantidadHuespedes: [1, [
        Validators.required,
        Validators.min(1),
        Validators.max(2)
      ]]
    });

  }

  onEnviar(event: Event) {

    console.log(this.form.value);
    this.fechaInvalida = false;

    if (this.form.valid) {

      const fechaCheckin = new Date(this.form.value.fechaCheckin);
      const fechaCheckout = new Date(this.form.value.fechaCheckout);

      if (fechaCheckout <= fechaCheckin) {
        this.fechaInvalida = true;
        return;

      }

      const reserva = {
        id_usuario: 2,
        id_habitacion: 4,
        fecha_checkin: this.form.value.fechaCheckin,
        fecha_checkout: this.form.value.fechaCheckout,
        cantidad_huespedes: this.form.value.cantidadHuespedes,
        estado: 'Pendiente',
        precio_total: 0
      };

      console.log('Reserva a enviar:', reserva);

      this.reservaService.crearReserva(reserva).subscribe({

        next: (respuesta) => {
          console.log('Reserva creada:', respuesta);
          this.router.navigate(['/dashboard-usuario/confirmacion']);
        },

        error: (error) => {
          console.error('Error al crear la reserva:', error);
        }
      });

    } else {
      this.form.markAllAsTouched();
    }

  }

}