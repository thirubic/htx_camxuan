import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const baseUrl = `${environment.apiURL}/api/loaiphan`;
const baseUrlNS = `${environment.apiURL}/api/nguoidung`;

@Injectable({
  providedIn: 'root'
})
export class LoaiphanService {

  constructor(private http: HttpClient) { }

  get_all() {
      return this.http.get<any[]>(`${baseUrl}/getall`);
  }
  get_byid(formData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/getbyma`,
      formData
    );
  }

  Del(formData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/xoa`,
      formData
    );
  }
  loaiphan_ins(formData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/capnhat`,
      formData
    );
  }

  loaiphan_up(formData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/capnhat`,
      formData
    );
  } 
}
