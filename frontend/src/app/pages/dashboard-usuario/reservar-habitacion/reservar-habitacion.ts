import { Component } from '@angular/core';

import { RouterLink, Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-reservar-habitacion',
  styleUrl: './reservar-habitacion.css',
  templateUrl: './reservar-habitacion.html'
})

export class ReservarHabitacion {

  form: FormGroup;
  fechaInvalida: boolean = false;

  get NombreApellido() {
    return this.form.get('nombreApellido');
  }

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
    private router: Router
  ) {

    this.form = this.formBuilder.group({

      nombreApellido: ['', [Validators.required]],

      fechaCheckin: ['', [Validators.required]],

      fechaCheckout: ['', [Validators.required]],

      cantidadHuespedes: [1, [Validators.required, Validators.min(1), Validators.max(2)]]

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

      this.router.navigate(['/dashboard-usuario/confirmacion']);

    } else {

      this.form.markAllAsTouched();

    }

  }

}
