import { Injectable } from '@angular/core';
import { KEY_TOKEN, KEY_USERNAME } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageManagerService {

  constructor() { }

  saveJwtToken(token: string) :void {
    sessionStorage.setItem(KEY_TOKEN, token);
  }

  getJwtToken(): string {
    return sessionStorage.getItem(KEY_TOKEN) as string;
  }

  userIsLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }

  deleteJWT():void {
    sessionStorage.removeItem(KEY_TOKEN);
  }

  saveUsername(username: string):void {
    sessionStorage.setItem(KEY_USERNAME, username);
  }

  getUsername(): string {
    return sessionStorage.getItem(KEY_USERNAME) as string;
  }

  deleteUsername():void {
    sessionStorage.removeItem(KEY_USERNAME);
  }   
}
