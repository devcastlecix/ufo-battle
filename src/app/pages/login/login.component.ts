import { Component } from '@angular/core';
import { UsersService } from '../../shared/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserLogin } from '../../shared/model/user-login.model';
import { HttpResponse } from '@angular/common/http';
import { TokenManagerService } from '../../shared/services/token-manager.service';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
  user: UserLogin  = new UserLogin('','');
  loading:boolean = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UsersService,
    private tokenService: TokenManagerService
  ) {}  

  onSubmit() {
    const validations = this.checkFieldsLogin(this.user);
    if (validations.length > 0) {
      this.handleValidationErrors(validations);
      return;
    }
    this.loading=true;
    this.userService.doLogin(this.user).subscribe({
      next: (response: HttpResponse<any>) => this.handleLoginSuccess(response),
      error: (error: HttpResponse<any>) => this.handleLoginError(error)
    });
  }

  handleValidationErrors(validations: string[]): void {
    validations.forEach(message => this.toastr.warning(message, 'Validation'));
  }

  handleLoginSuccess(response: HttpResponse<any>): void {
    this.loading=false;
    if (response.status !== 200) {
      this.toastr.info('Login: Worked but errors', 'Login failed');
      return;
    }

    const token = response.headers.get('Authorization') ?? '';
    if (token.trim() === '') {
      this.toastr.info('Token not found in the response', 'Login failed');
      return;
    }

    const isSaved : boolean = this.tokenService.saveTokenAndUserSession(token);
    if(!isSaved) {
      this.toastr.info('Token was not processed', 'Login failed');
      return;
    }
    const username = this.tokenService.getUsername();
    this.toastr.success(`Welcome ${username}!`, 'Logged in!');
    this.router.navigate(['home']);
  }

  handleLoginError(error: HttpResponse<any>): void {
    this.loading=false;
    
    if (error.status === 400) {
      this.toastr.error('no username or password', 'Login failed');
      return;
    }
    if (error.status === 401) {
      this.toastr.error('invalid username/password supplied', 'Login failed');
      return;
    }
    this.toastr.error('Login failed. Please try again.', 'Error');
    console.error(error);
  }

  checkFieldsLogin(userLogin: UserLogin): string[] {
    const validations: string[] = [];
    if (!userLogin.username?.trim()) {
      validations.push('username is required');
    }
    if (!userLogin.password?.trim()) {
      validations.push('password is required');
    }
    return validations;
  }
}
