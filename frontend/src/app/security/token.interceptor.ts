import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { catchError } from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!request.url.endsWith("/token")) {
      request = request.clone({
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.auth.getToken()}`
        })
      });
    }

    //console.log(request);
    return next.handle(request).pipe(
      catchError(response => {
        if (response instanceof HttpErrorResponse) {
          if (response.status === 401) {
            this.router.navigate(["/login"/*, {message: "Token not found or invalid."}*/]);
          }
        }
        return Observable.throw(response);
      }));
  }
}
