import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {LoaderTypeOneComponent} from "@components/Loaders/loader-type-one/loader-type-one.component";
import {NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "@services/UserServices/user.service";
import {UserRegister} from "@models/User";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    LoaderTypeOneComponent,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
submitting = false;
  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly toast: ToastrService
  ) { }

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit(){
    this.submitting = true;
    const formValues: UserRegister = {
      name: this.registerForm.value.name || '',
      email: this.registerForm.value.email || '',
      password: this.registerForm.value.password || '',
    }
    this.userService.register(formValues).subscribe(
      res => {
        this.toast.success('Registrado exitosamente', 'Success');
        this.submitting = false;
        this.router.navigate(['/']);
      },
      err => {
        this.submitting = false;
        if(err.error.errors){
          for (let error in err.error.errors){
            this.toast.error(err.error.errors[error], 'Error');
          }
        }else {
          this.toast.error('Error desconocido o problemas internos. Intentalo mas tarde!', 'Error');
        }
      }
    )
  }

  protected readonly PluginArray = PluginArray;
}
