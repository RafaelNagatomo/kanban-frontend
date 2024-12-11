import { FormControl } from "@angular/forms"

export interface SignupForm {
  name: FormControl,
  email: FormControl,
  password: FormControl,
  confirmPassword: FormControl
}
