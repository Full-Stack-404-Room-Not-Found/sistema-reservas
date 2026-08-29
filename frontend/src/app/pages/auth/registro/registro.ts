import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

@Component({
  imports: [],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

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

  protected onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Valores registrados', this.form.getRawValue());
    this.router.navigateByUrl('/login');
  }
}
