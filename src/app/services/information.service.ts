import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { Information, PagedRequest } from '../models/information';
import { Content } from '../models/information';

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

  getPagedInformations(pagedRequest: PagedRequest): Observable<Content> {
    const url = `${this.informationsUrl}/paged?page=${pagedRequest.page}&size=${pagedRequest.size}&sortBy=${pagedRequest.sortRow}&direction=${pagedRequest.sortDir}`
    return this.http.get<Content>(url)
      .pipe(
        tap(_ => this.log(`fetched informations`)),
        catchError(this.handleError<Content>('getPagetInformations'))
      );
  }

  getPublicInformations(): Observable<Information[]> {
    const url = `/api/public`;
    return this.http.get<Information[]>(url)
      .pipe(
        tap(_ => this.log(`fetched informations`)),
        catchError(this.handleError<Information[]>('getInformations', []))
      );
  }

  getPublicInformation(id: number): Observable<Information> {
    const url = `${this.informationsUrl}/public/${id}`;
    return this.http.get<Information>(url)
      .pipe(
        tap(_ => this.log(`fetched information id=${id}`)),
        catchError(this.handleError<Information>('getInformation'))
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

  addInformation(information: Information): Observable<Information> {
    //const url = `${this.informationsUrl}/${id}`;
    return this.http.post<Information>(this.informationsUrl, information, this.httpOptions)
      .pipe(
        tap(_ => {
          console.log(_);
          this.log(`added information`)}),
        catchError(this.handleError<Information>('getInformation'))
      );
  }

  updateInformation(information: Information): Observable<Information> {
    const url = `${this.informationsUrl}/${information.id}`;
    return this.http.put<Information>(url, information, this.httpOptions)
      .pipe(
        tap(_ => {
          console.log(_);
          this.log(`update information`)}),
        catchError(this.handleError<Information>('updateInformation'))
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
