import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = localStorage.getItem('AuthToken');
        console.log ("Intercept");
        if (authToken) {
            console.log("dodaje Token")
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${authToken}`
                }
            });
        }
        return next.handle(req);
    }
}

export function authInterceptor(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('AuthToken');
    console.log ("Intercept");
        if (authToken) {
            console.log("dodaje Token")
            req = req.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + authToken
                }
            });
        }
        return next.handle(req);
}