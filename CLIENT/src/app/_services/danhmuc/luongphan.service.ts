import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const baseUrl = `${environment.apiURL}/api/dmluongphan`;

@Injectable({
  providedIn: 'root'
})
export class LuongphanService {

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
  get_bytrangthai(formData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/getbytrangthai`,
      formData
    );
  }
  get_byduong(formData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/getbyduong`,
      formData
    );
  }
  Del(formData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/xoa`,
      formData
    );
  }
  luongphan_ins(formData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/capnhat`,
      formData
    );
  }
  chuyenvitri(formData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/chuyenvitri`,
      formData
    );
  }
  luongphan_up(formData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/capnhat`,
      formData
    );
  } 
}
