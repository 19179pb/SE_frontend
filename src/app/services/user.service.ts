import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = '/api/users';
  private adminUsersUrl = '/api/admin/users';

  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
    })
  };

  constructor(
    private http: HttpClient,
  ) { }

  private log(message: string) {
    console.log (message);
    //TODO: pass to message service
  }

  private handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.adminUsersUrl)
      .pipe(
        tap(_ => this.log(`fetched users`)),
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  deleteUser(id: number): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete<User>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted user id=${id}`)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.adminUsersUrl, user, this.httpOptions).pipe(
      tap((newUser: User) => this.log(`added user w/ id=${newUser.id}`)),
      catchError(this.handleError<User>('addUser'))
    );
  }
  
  registerUser(user: User): Observable<any> {
    return this.http.post(this.usersUrl, user, this.httpOptions).pipe(
      tap(_=>this.log('registered user login=${user.login}')),
      catchError(this.handleError<any>('registerUser'))
    );
  }
}
