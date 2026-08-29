import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule, FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private formbuilder = inject(FormBuilder)

  LoginForm = this.formbuilder.group({
  email: ['',[Validators.required, Validators.email],[]],
  password: ['',[Validators.required],[]],
  
});

  enviar()
  {
    if(this.LoginForm.valid)
    {
      console.log(this.LoginForm.value)
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

