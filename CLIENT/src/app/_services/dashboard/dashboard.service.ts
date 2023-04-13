import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dashboard_box, Dashboard_CV, Dashboard_CV_bieudo } from '@app/_models/dashboard/dashboard';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const baseUrl = `${environment.apiURL}/api/dashboard`;
const baseUrl_chung = `${environment.apiURL}/api/dmchung`;
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }


  get_box(ma: string) {
      return this.http.get<Dashboard_box>(`${baseUrl}/viewbox?prmMA_NV=${ma}`);
  }
  get_box_donvi(ma: string,child: number) {
    return this.http.get<Dashboard_box>(`${baseUrl}/viewbox_donvi?prmMA_DV=${ma}&prmChildNumber=${child}`);
  }
  get_chitiet_donvi(ma: string,child: number) {
    return this.http.get<Dashboard_CV>(`${baseUrl}/view_chitiet_donvi?prmMA_DV=${ma}&prmChildNumber=${child}`);
  }
  get_chitiet(ma: string) {
    return this.http.get<Dashboard_CV>(`${baseUrl}/view_chitiet?prmMA_NV=${ma}`);
  }
  get_bieudo(ma: string) {
    return this.http.get<Dashboard_CV_bieudo>(`${baseUrl}/view_bieudo?prmMA_NV=${ma}`);
  }


  // get tree hợp tác xã
  get_tree() {
    return this.http.get<any>(`${baseUrl_chung}/getdatatree`);
  }

  // get data hợp tác xã
  get_data_htx() {
    return this.http.get<any>(`${baseUrl_chung}/getdatahtx`);
  }

}
