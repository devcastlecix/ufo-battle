import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../shared/services/users.service';
import { HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  standalone: false,
  
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  form: FormGroup;
  loadingReview: boolean = false;
  loadingRegister: boolean = false;

  constructor(private fb: FormBuilder,     
    private userService: UsersService,
    private toastr: ToastrService) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      username:['',
        {
          validators: [Validators.required, Validators.minLength(5), Validators.maxLength(8)],
          asyncValidators: [this.asyncExistsUsername()],
          updateOn: 'blur'
        }],            
      email :['',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],      
      password :['',Validators.required],
      repeatedpwd :['',Validators.required],
    });
  }  

  asyncExistsUsername(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ userExists: boolean | null, notcompleted: boolean } | null> => {
      if (!control.value) {
        return of(null);
      }
      this.loadingReview = true;
      return this.userService.existsUser(control.value).pipe(
        map((response: HttpResponse<any>) => { 
          this.loadingReview = false;         
          return { userExists: true, notcompleted: false }; 
        }),
        catchError((error) => {
          this.loadingReview = false;
          if (error.status === 404) {            
            return of(null); 
          }
          return of({ userExists : null, notcompleted: true });
        })
      );
    };
  }
  

  onSubmit() {    
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        if(control instanceof FormGroup){
          Object.values(control.controls).forEach(control=>control.markAsTouched());
        }else control.markAsTouched();
      });
      return;
    }
    const username = this.form.get('username')?.value;
    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;

    this.loadingRegister = true;
    this.userService.registerUser(username, email, password).subscribe({
      next: (response: HttpResponse<any>) => this.handleRegisterSuccess(response, username),
      error: (error: HttpResponse<any>) => this.handleRegisterError(error)
    });
  }

  handleRegisterSuccess(response: HttpResponse<any>, username: string): void {
    this.loadingRegister=false;
    if (response.status !== 201) {
      this.toastr.info('Register: Worked but errors', 'Register failed');
      return;
    }    
    this.toastr.success(`The user ${username} was registered successfully !`, 'Register!');
    this.form.reset({
      username:'',
      email: '',
      password: '',
      repeatedpwd: ''
    });
  }

  handleRegisterError(error: HttpResponse<any>): void {
    this.loadingRegister=false;
    
    if (error.status === 400) {
      this.toastr.error('no username or email or password', 'Register failed');
      return;
    }
    if (error.status === 409) {
      this.toastr.error('duplicated user name', 'Register failed');
      return;
    }
    this.toastr.error('Register failed. Please try again.', 'Error');
    console.error(error);
  }  

  get usernameNotExists() {
    return this.form.get('username')?.errors?.['userExists'];
  }

  get usernameNotAsyncProcessed() {    
    return this.form.get('username')?.errors?.['userExists'] == null  
    &&  this.form.get('username')?.errors?.['notcompleted'];
  }

  get usernameNotValidMin(){    
    return this.form.get('username')?.invalid && this.form.get('username')?.touched && (
      this.form.get('username')?.errors?.["required"] ||
      this.form.get('username')?.errors?.["minlength"] ||
      this.form.get('username')?.errors?.["maxlength"]
    );
  }

  get emailNotValid() {
    return this.form.get('email')?.invalid && this.form.get('email')?.touched;
  }

  get passwordNotValid() {
    return this.form.get('password')?.invalid && this.form.get('password')?.touched;
  }
  
  get repeatedpwdNotValid() {
    const password = this.form.get('password')?.value;
    const repeatedpwd = this.form.get('repeatedpwd')?.value;
    return !(password === repeatedpwd);
  }  
}