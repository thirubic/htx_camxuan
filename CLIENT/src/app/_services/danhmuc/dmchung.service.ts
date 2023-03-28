import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const baseUrl = `${environment.apiURL}/api/dmchung`;

@Injectable({
  providedIn: 'root'
})
export class DMChungService {

  constructor(private http: HttpClient) { }

  get_all() {
      return this.http.get<any[]>(`${baseUrl}/getAll`);
  }
  get_key(formData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}/get_key`,
      formData
    );
  }
}
