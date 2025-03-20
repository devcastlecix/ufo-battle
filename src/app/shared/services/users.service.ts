import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_USER_URL } from '../constants/constants';
import { UserLogin } from '../model/user-login.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  doLogin(user: UserLogin): Observable<HttpResponse<any>> {    
    return this.http.get(
      `${API_USER_URL}/login?username=${user.username}&password=${user.password}`,
      { observe: "response" }
    );
  }

  existsUser(username: string): Observable<any> {        
    return this.http.get(
      `${API_USER_URL}/${username}`, { observe: "response" });
  }

  registerUser(username: string, email: string, password: string): Observable<any> {    
    const urlEncodedParams: HttpParams = new HttpParams()
      .set('username', username)
      .set('email', email)
      .set('password', password);

    const headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    headers.set('accept', 'application/json');

    return this.http.post(API_USER_URL, urlEncodedParams,{ headers, observe: 'response' });
  }  
}
