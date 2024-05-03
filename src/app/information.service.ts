import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { Information } from './information';

@Injectable({
  providedIn: 'root'
})

export class InformationService {
  private informationsUrl = '/api/information';

  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

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

  getInformations(): Observable<Information[]> {
    return this.http.get<Information[]>(this.informationsUrl)
      .pipe(
        tap(_ => this.log(`fetched informations`)),
        catchError(this.handleError<Information[]>('getInformations', []))
      );
  }

  getInformation(id: number): Observable<Information> {
    const url = `${this.informationsUrl}/${id}`;
    return this.http.get<Information>(url)
      .pipe(
        tap(_ => this.log(`fetched information id=${id}`)),
        catchError(this.handleError<Information>('getInformation'))
      );
  }

  deleteInformation(id: number): Observable<Information> {
    const url = `${this.informationsUrl}/${id}`;
    return this.http.delete<Information>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted information id=${id}`)),
        catchError(this.handleError<Information>('deleteInformation'))
      );
  }
}
