import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

// Caso de uso Iniciar Sesión. Valida las credenciales contra la API y, según el
// rol que devuelve, manda al panel de administrador o al de usuario.
@Component({
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private formbuilder = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cd = inject(ChangeDetectorRef);

  errorLogin = '';

  LoginForm = this.formbuilder.group({
    email: ['', [Validators.required, Validators.email], []],
    password: ['', [Validators.required], []],
  });

  // ========== INICIAR SESIÓN ==========
  // Paso 4 del caso de uso: valida credenciales y verifica el rol asociado.
  enviar() {
    if (!this.LoginForm.valid) {
      this.LoginForm.markAllAsTouched();
      return;
    }

    this.errorLogin = '';
    const email = this.LoginForm.value.email ?? '';
    const clave = this.LoginForm.value.password ?? '';

    this.authService.login(email, clave).subscribe({
      next: (usuarios) => {
        if (usuarios.length !== 1) {
          this.errorLogin = 'correo electrónico o contraseña incorrectos';
          this.cd.markForCheck();
          return;
        }

        const usuario = usuarios[0];
        this.authService.guardarSesion(usuario);

        // id_rol 1 es Administrador, 2 es Usuario
        if (usuario.id_rol === 1) {
          this.router.navigate(['/dashboard-admin']);
        } else {
          this.router.navigate(['/dashboard-usuario']);
        }
      },
      error: (error) => {
        this.errorLogin = error.message;
        this.cd.markForCheck();
      },
    });
  }

  get Email() {
    return this.LoginForm.get('email');
  }

  get Password() {
    return this.LoginForm.get('password');
  }
}
