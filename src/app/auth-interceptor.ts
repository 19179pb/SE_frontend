import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = localStorage.getItem('AuthToken');
        if (authToken) {
            req = req.clone({
                setHeaders: {
                    Authorization: 'Token ' + authToken
                }
            });
        }
        return next.handle(req);
    }
}
