import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/usuario';

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const passwordControl = group.get('password');
  const confirmPasswordControl = group.get('confirmPassword');

  if (passwordControl && confirmPasswordControl) {
    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
  }
  return null;
}

// Caso de uso Registrarse. El formulario pide nombre, apellido, correo y
// contraseña, que son los campos que enumera el paso 2 del caso de uso.
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly cd = inject(ChangeDetectorRef);

  protected readonly form = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator },
  );

  protected submitted = false;
  protected errorRegistro = '';

  // ========== REGISTRAR ==========
  // Paso 5: se consulta el correo antes de guardar. Si ya existe, no se registra.
  protected onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorRegistro = '';
    const datos = this.form.getRawValue();

    this.authService.buscarPorEmail(datos.email).subscribe({
      next: (usuarios) => {
        if (usuarios.length > 0) {
          this.errorRegistro = 'El correo electrónico ya se encuentra registrado';
          this.cd.markForCheck();
          return;
        }

        const usuario: Usuario = {
          id_rol: 2,
          nombre: datos.nombre,
          apellido: datos.apellido,
          email: datos.email,
          clave_acceso: datos.password,
          fecha_registro: this.fechaDeHoy(),
        };

        this.authService.registrar(usuario).subscribe({
          next: () => {
            this.router.navigateByUrl('/login');
          },
          error: (error) => {
            this.errorRegistro = error.message;
            this.cd.markForCheck();
          },
        });
      },
      error: (error) => {
        this.errorRegistro = error.message;
        this.cd.markForCheck();
      },
    });
  }

  // ========== AUXILIARES ==========
  // Fecha local en formato YYYY-MM-DD, como las del db.json
  private fechaDeHoy(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }
}
