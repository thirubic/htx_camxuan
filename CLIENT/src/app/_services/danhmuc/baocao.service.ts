import { HttpClient, HttpHeaders, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dantoc } from '@app/_models/dm/dantoc';
import { environment } from '@environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const baseUrl = `${environment.apiURL}/api/baocao`;

@Injectable({
  providedIn: 'root'
})
export class BaocaothanhphamService {

  constructor(private http: HttpClient) { }

  baocao_thanhpham(formData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/baocao_thanhpham`,
      formData
    );
  }
  // baocao_thanhpham_exp(formData: any): Observable<any> {
  //   return this.http.post(
  //     `${baseUrl}/baocao_thanhpham_exp`,
  //     formData
  //   );
  // }

  baocao_thanhpham_exp( ma_xuong: string) {
    return this.http.get(`${baseUrl}/baocao_thanhpham_exp?ma_xuong=` + ma_xuong,
      this.getDownloadOptions(),
      ).pipe(catchError(this.handleError));
  }

  getDownloadOptions() {
    var token = this.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      }),
      responseType: 'blob' as 'blob'    
    };

    return httpOptions;
  }
  getToken() {
    let accessToken = localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token') || '';
    if (accessToken !== '') {
      return `Bearer ${accessToken}`;
    } else {
      return '';
    }
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.message}`);
    }
    return throwError(error);
  }

}
