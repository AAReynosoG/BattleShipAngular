import { UserLogin } from '@models/User';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { UserService } from '@services/UserServices/user.service';
import {CodeComponent} from "../code/code.component";
import {LoaderTypeOneComponent} from "@components/Loaders/loader-type-one/loader-type-one.component";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    CodeComponent,
    LoaderTypeOneComponent
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    submitting = false;
    verifyCodeView = false;
    email = ''
    password = ''

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private toast: ToastrService
  ) { }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  onSubmit(){
    this.submitting = true;
    const form: UserLogin = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || ''
    }

    this.userService.login(form).subscribe(
      data => {
        this.email = form.email
        this.password = form.password
        this.submitting = false;
        this.verifyCodeView = true;
        this.toast.info('Codigo 2FA enviado a tu email', '2FA')
        this.router.navigate(['/menu'])
      },
err => {
        this.submitting = false;
        if (err.error.errors){
          for (let error in err.error.errors){
            this.toast.error(err.error.errors[error], 'Error')
          }
        }else if(err.status == 401){
          this.toast.error('Usuario o contraseña incorrectos', 'Error')
        }else if(err.status == 403){
          this.toast.error('Usuario no verificado', 'Error')
        }else if (err.status == 404) {
          this.toast.error('Usuario no encontrado', 'Error')
        }
      }
    )
  }
}
