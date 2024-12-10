import { FormControl } from "@angular/forms"

export interface LoginForm {
    email: FormControl,
    password: FormControl
  }

export type LoginResponse = {
    token: string,
    name: string
}