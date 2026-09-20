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
   get NombreApellido() { return this.form.get('nombreApellido'); }
   get Telefono() { return this.form.get('telefono');}
   get Email() { return this.form.get('email'); }

   constructor(
     private formBuilder: FormBuilder,
     private router: Router
    ) {
      
      this.form = this.formBuilder.group({
        nombreApellido: ['', [Validators.required]],
        telefono: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]]
      });
      
    }
    
    onEnviar(event: Event) {
    console.log(this.form.value);
    if (this.form.valid) {
      this.router.navigate(['/confirmar-reserva']);
    } else {
      this.form.markAllAsTouched();
    }

  }
}
