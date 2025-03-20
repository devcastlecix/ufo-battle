import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,  
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TokenManagerService } from '../services/token-manager.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor(private toastr: ToastrService, private tokenService: TokenManagerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(      
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          //console.log(req);
          if(!req.headers.has("authorization")) return;
          //console.log(event);            
          const token = event.headers.get('Authorization') ?? '';
          if (token.trim() === '') {
            this.toastr.info('Token not found in the response', 'Loaded failed');
            return;
          }
      
          const isSaved : boolean = this.tokenService.saveTokenAndUserSession(token);
          if(!isSaved) {
            this.toastr.info('Token was not processed', 'Token failed');
            return;
          }
          this.tokenService.refreshTokenExpirationTimeout();                  
        }
      })
    );
  }
}
