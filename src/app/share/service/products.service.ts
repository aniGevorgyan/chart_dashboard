import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {IList} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {
  }


  getProducts(skip: number, limit: number): Observable<IList> {
    const url = 'https://dummyjson.com/products';
    const params = new HttpParams()
      .set('skip', skip)
      .set('limit', limit);
    return this.http.get<IList>(url, {params}).pipe(
      map(res => {
        return res;
      }),
      catchError(error => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }


  getProductsCategories(): Observable<string[]> {
    return this.http.get<string[]>('https://dummyjson.com/products/categories').pipe(
      map(res => {
        return res;
      }),
      catchError(error => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }
}
