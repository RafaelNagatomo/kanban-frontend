import { Component } from '@angular/core'
import { LoginFormComponent } from "../../component/login-form/login-form.component"
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { SignupForm } from '../../shared/interfaces/signup.interface'
import { LoginService } from '../../shared/services/login.service'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [LoginFormComponent, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.sass'
})
export class SignupComponent {
  signupForm!: FormGroup<SignupForm>;

  constructor(
    private loginService: LoginService,
    private toastService: ToastrService
  ){
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })
  }

  submit(){
    this.loginService.signup(
      this.signupForm.value.name,
      this.signupForm.value.email,
      this.signupForm.value.password,
      this.signupForm.value.confirmPassword
    ).subscribe({
      next: () => this.toastService.success("Login feito com sucesso!"),
      error: () => this.toastService.error("Erro inesperado! Tente novamente mais tarde")
    })
  }
}
