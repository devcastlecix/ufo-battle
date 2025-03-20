import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenManagerService } from '../../shared/services/token-manager.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate{

  constructor(private tokenService: TokenManagerService,
              private toastr: ToastrService,
              private router: Router) { }

  canActivate(): boolean {
    if (this.tokenService.getJwtToken() == null) {
      return true;
    }
    this.toastr.error("Already logged in, logout first", "Access denied");
    this.router.navigate(['home']);
    return false;
  }              
}
