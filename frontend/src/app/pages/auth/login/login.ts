import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private formbuilder = inject(FormBuilder)
  private router = inject(Router)

  LoginForm = this.formbuilder.group({
  email: ['',[Validators.required, Validators.email],[]],
  password: ['',[Validators.required],[]],
  
});

  enviar()
  {
    if(this.LoginForm.valid)
    {
      console.log(this.LoginForm.value)
      this.router.navigate(['dashboard-usuario'])
    }
    else
    {
      this.LoginForm.markAllAsTouched();
    }
  }

  get Email()
  {
    return this.LoginForm.get("email");
  }

  get Password()
  {
    return this.LoginForm.get("password");
  }


}

