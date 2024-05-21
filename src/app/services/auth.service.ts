import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { RegistrationResponse, UserRegistrationData, LoginData, LoginResponse } from '../models/auth.interfaces';
import { Observable, of, firstValueFrom } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registrationUrl = 'api/users';
  private loginUrl = 'api/users/login';
  private logoutUrl = 'api/users/logout';
  private userUrl = 'api/users/me';


  isAdmin = signal(false);
  isFullUser = signal(false);
  isLimitedUser = signal(false);


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  private log(message: string) {
    console.log (`AuthService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  registerUser(userData: UserRegistrationData): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(this.registrationUrl, userData, this.httpOptions)
    .pipe(
      tap((regResp: RegistrationResponse) => this.log(`registered user: ${regResp.username}`)),
      catchError(this.handleError<RegistrationResponse>('registerUser'))
    )
  }

  login(loginData: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, loginData, this.httpOptions)
    .pipe(
      tap((loginResp: LoginResponse) => this.log(`user logged in with auth token: ${loginResp.auth_token}`)),
      catchError(this.handleError<LoginResponse>('login'))
    )
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.logoutUrl, this.httpOptions)
    .pipe(
      tap(() => this.log(`user logged out`)),
      catchError(this.handleError<void>('logout'))
    )
  }
  
  async verifyToken(): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.http.get<User>(this.userUrl));
      if (response instanceof Object){
        if (response.id) {
          this.setSignals(response);
          return true;
        } else {
          localStorage.removeItem('AuthToken');
          this.resetSignals();
          return false;
        }
      } else {
        localStorage.removeItem('AuthToken');
        this.resetSignals();
        return false;
      }
    } catch (error) {
      this.resetSignals();
      this.handleError<void>(`verifyToken: ${error}`);
      return false;
    }
  }

  private resetSignals(): void {
    this.isAdmin.set(false);
    this.isFullUser.set(false);
    this.isLimitedUser.set(false);
  }

  private setSignals(user: User): void {
    //TODO: get data from REST API
    this.isAdmin.set(true);
    this.isFullUser.set(false);
    this.isLimitedUser.set(false);
  }

}
