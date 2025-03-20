import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { SessionStorageManagerService } from './session-storage-manager.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { KEY_TOKEN, TOKEN_LIFETIME_MS } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class TokenManagerService {
  private isLoggedInSource = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.isLoggedInSource.asObservable();
  private tokenExpirationTimer: any;

  constructor(private router: Router, private sessionStorageService: SessionStorageManagerService) {
    this.isLoggedInSource.next(this.checkLoginStatusInitial());         
  }

  private checkLoginStatusInitial(): boolean {
    const jwtToken = this.getJwtToken();  
    return jwtToken != null;
  }

  saveTokenAndUserSession(token: string): boolean {
    console.log(token);  
    this.sessionStorageService.saveJwtToken(token);    
    const decodedHeader = this.decodeToken(token);
    if(!decodedHeader) {
      this.sessionStorageService.deleteJWT();
      return false;
    }
    console.log(decodedHeader);        
    this.sessionStorageService.saveUsername(decodedHeader["username"]); 
    this.isLoggedInSource.next(true);   
    return true;
  }

  refreshTokenExpirationTimeout(): void {
    if (this.tokenExpirationTimer) 
      clearTimeout(this.tokenExpirationTimer);
    
    this.tokenExpirationTimer = setTimeout(() => this.clearToken(), TOKEN_LIFETIME_MS);
  }

  clearToken(): void {
    this.sessionStorageService.deleteJWT();
    this.sessionStorageService.deleteUsername();
    this.isLoggedInSource.next(false);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    this.router.navigate(['']);
  }

  getUsername():string {
    return this.sessionStorageService.getUsername();
  }

  getJwtToken(): string | null {
    const jwtToken = this.sessionStorageService.getJwtToken();  
    const decodeJwtToken = this.decodeToken(jwtToken);
    if(decodeJwtToken == null) return null;
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime < decodeJwtToken["exp"] ? jwtToken : null;  
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {      
      return null;
    }
  }  
}
