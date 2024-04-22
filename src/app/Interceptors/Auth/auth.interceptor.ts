import {
  HTTP_INTERCEPTORS, HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable, Provider} from "@angular/core";
import {catchError, Observable, throwError} from "rxjs";
import {AuthService} from "@services/AuthService/auth.service";
import { Router } from '@angular/router';
import {ToastrService} from "ngx-toastr";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private route: Router, private toast: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();

    if (this.shouldExclude(req)) {
      return next.handle(req);
    }

    if (authToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
        setParams: {
          '_': Date.now().toString()
        }
      });
      console.log(req)
      console.log('interceptor')
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.resetAll()
          this.route.navigate(['/']).then(()=> {
              if (typeof window !== 'undefined') {
                this.toast.error('Unauthorized', 'Error de autenticación');
              } else {
                console.error('Error de autenticación', error);
                this.toast.error('' + error, 'Error de autenticación');
              }
            }
          );
        }
        return throwError(() => error);
      })
    );
  }

  private shouldExclude(req: HttpRequest<any>): boolean {
    const excludedPaths = ['/', '/register'];
    return excludedPaths.some(path => req.url.endsWith(path));
  }

}

export const authInterceptorProvider: Provider =
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true };
