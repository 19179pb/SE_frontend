import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesUrl = '/api/categories';

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

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl)
      .pipe(
        tap(_ => this.log(`fetched informations`)),
        catchError(this.handleError<Category[]>('getCategories', []))
      );
  }

  getCategory(id: number): Observable<Category> {
    const url = `${this.categoriesUrl}/${id}`;
    return this.http.get<Category>(url)
      .pipe(
        tap(_ => this.log(`fetched information id=${id}`)),
        catchError(this.handleError<Category>('getCategory'))
      );
  }

  addCategory(category: Category): Observable<Category> {
    //const url = `${this.categoriesUrl}/${id}`;
    return this.http.post<Category>(this.categoriesUrl, category, this.httpOptions)
      .pipe(
        tap((cat: Category)=> this.log(`added category id=${cat.id}`)),
        catchError(this.handleError<Category>('addCategory'))
      );
  }

  editCategory(category: Category): Observable<Category> {
    console.log(category);
    const url = `${this.categoriesUrl}/${category.id}`;
    return this.http.put<Category>(url, category, this.httpOptions)
      .pipe(
        tap((cat: Category)=> this.log(`updated category id=${cat.id}`)),
        catchError(this.handleError<Category>('editCategory'))
      );
  }


  deleteCategory(id: number): Observable<Category> {
    const url = `${this.categoriesUrl}/${id}`;
    return this.http.delete<Category>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted category id=${id}`)),
        catchError(this.handleError<Category>('deleteInformation'))
      );
  }
}
