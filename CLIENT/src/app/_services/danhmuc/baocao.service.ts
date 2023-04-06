import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dantoc } from '@app/_models/dm/dantoc';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

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
  baocao_thanhpham_exp(formData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/baocao_thanhpham_exp`,
      formData
    );
  }
}
