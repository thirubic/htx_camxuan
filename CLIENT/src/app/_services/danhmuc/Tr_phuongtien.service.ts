import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const baseUrl = `${environment.apiURL}/api/dmphuongtien`;
const basenhapphuongtien_Url = `${environment.apiURL}/api/nhapphuongtien`;

@Injectable({
  providedIn: 'root'
})
export class Tr_phuongtienService {

  constructor(private http: HttpClient) { }

  get_all() {
      return this.http.get<any[]>(`${baseUrl}/getall`);
  }
  get_byma(formData: any): Observable<any> {
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
  phuongtien_up(formData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/capnhat`,
      formData
    );
  } 

  // nhập phương tiện cho luống
  get_byluong(formData: any): Observable<any> {
    return this.http.post(
      `${basenhapphuongtien_Url}/get_phuongtien_byluong`,
      formData
    );
  }
  phuongtien_add(formData: any): Observable<any> {
    return this.http.post(
      `${basenhapphuongtien_Url}/nhap_phuongtien_luong`,
      formData
    );
  }
  phuongtien_del(formData: any): Observable<any> {
    return this.http.post(
      `${basenhapphuongtien_Url}/xoa_pt_luong`,
      formData
    );
  } 
}
