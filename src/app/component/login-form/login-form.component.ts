import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.sass'
})
export class LoginFormComponent {
  @Input() isLogin: boolean = false
  @Output("submit") onSubmit = new EventEmitter()

  constructor(private router: Router) {}

  submit(){
    this.onSubmit.emit()
  }
  
  navigate(){
    this.isLogin = !this.isLogin
    const targetRoute = this.isLogin ? '/login' : '/signup'
    this.router.navigate([targetRoute])
  }
}
