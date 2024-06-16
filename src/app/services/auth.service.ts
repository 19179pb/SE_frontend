import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { RegistrationResponse, UserRegistrationData, LoginData, LoginResponse } from '../models/auth.interfaces';
import { Observable, of, firstValueFrom } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registrationUrl = 'api/register';
  private loginUrl = 'api/authenticate';
  private logoutUrl = 'api/users/logout';
  private userUrl = 'api/me';


  isAdmin = signal(false);
  isFullUser = signal(false);
  isLimitedUser = signal(false);
  isAnonymous = signal(true);
  user = signal<User | undefined>(undefined);
  
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

  registerUser(user: Partial<User>): Observable<RegistrationResponse> {
    console.log(user);
    return this.http.post<RegistrationResponse>(this.registrationUrl, user, this.httpOptions)
    .pipe(
      tap((regResp: RegistrationResponse) => this.log(`registered user: ${regResp.username}`)),
      catchError(this.handleError<RegistrationResponse>('registerUser'))
    )
  }

  login(loginData: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, loginData, this.httpOptions)
    .pipe(
      tap((loginResp: LoginResponse) => this.log(`user logged in with auth token: ${loginResp.jwt}`)),
      catchError(this.handleError<LoginResponse>('login'))
    )
  }

  logout(): Observable<void> {
    this.resetSignals();
    return this.http.post<void>(this.logoutUrl, this.httpOptions)
    .pipe(
      tap(() => this.log(`user logged out`)),
      catchError(this.handleError<void>('logout'))
    )
  }
  
  async verifyToken(): Promise<User|undefined> {
    try {
      const response = await firstValueFrom(this.http.get<User>(this.userUrl));
      if (response instanceof Object){
        if (response.id) {
          this.setSignals(response);
          return response;
        } else {
          localStorage.removeItem('AuthToken');
          this.resetSignals();
          return undefined;
        }
      } else {
        localStorage.removeItem('AuthToken');
        this.resetSignals();
        return undefined;
      }
    } catch (error) {
      this.resetSignals();
      this.handleError<void>(`verifyToken: ${error}`);
      return undefined;
    }
  }

  private resetSignals(): void {
    this.isAdmin.set(false);
    this.isFullUser.set(false);
    this.isLimitedUser.set(false);
    this.isAnonymous.set(true);
    this.user.set(undefined);
  }

  private setSignals(user: User): void {
    console.log(user);
    this.isAdmin.set(false);
    this.isFullUser.set(false);
    this.isLimitedUser.set(false);
    this.isAnonymous.set(false);
    this.user.set(user);
    if (user.role == "ROLE_ADMIN"){
      console.log("isAdmin");
      this.isAdmin.set(true);

    }
    else if (user.role == "ROLE_LIMITED_USER")
      {
        console.log("isLimited");
        this.isLimitedUser.set(true);

      }
    else if (user.role == "ROLE_FULL_USER") {
      console.log("isFull")
      this.isFullUser.set(true);

    }
    else {
      console.log("isAnon");
      this.isAnonymous.set(true);

    }
  }

}
