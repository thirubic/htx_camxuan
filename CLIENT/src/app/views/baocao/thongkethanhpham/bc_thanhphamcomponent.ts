import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from '@app/_services';
import { CardSettingsModel, SwimlaneSettingsModel, DialogSettingsModel, DialogEventArgs, DragEventArgs } from '@syncfusion/ej2-angular-kanban';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BaocaoService } from '@app/_services/Baocao/baocao.service';
import { environment } from '@environments/environment';
import { ConfirmService } from '@app/_modules/confirm/confirm.service';
import { ToastrService } from "ngx-toastr";
import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
import { DonviService } from "@app/_services/danhmuc/donvi.service";
// module realtime
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { BaocaothanhphamService } from '@app/_services/danhmuc/baocao.service';
import { PhanxuongService } from '@app/_services/danhmuc/phanxuong.service';
@Component({
  selector: 'app-bc-thanhpham',
  templateUrl: './bc_thanhpham.component.html',
  styleUrls: ['./bc_thanhpham.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})

export class Bc_thanhphamComponent {
  constructor(
    // private dashboardService: DashboardService
    private modalService: BsModalService,
    private baocaoService: BaocaoService,
    private confirmService: ConfirmService,
    private baocaothanhphamService: BaocaothanhphamService,
    
    private toastr: ToastrService,
    private http: HttpClient,
    private phanxuongService: PhanxuongService,
    private datePipe: DatePipe
  ) { }
  public allowDragAndDrop: Boolean = false;

  Ma_nhanvien = localStorage.getItem('Ma_nhanvien') ? localStorage.getItem('Ma_nhanvien') : sessionStorage.getItem('Ma_nhanvien') || '';
  UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';
  Ma_donvi = localStorage.getItem('Ma_donvi') ? localStorage.getItem('Ma_donvi') : sessionStorage.getItem('Ma_donvi') || '';
  serviceBase = `${environment.apiURL}`;

  modalRef: BsModalRef;
  hide_title = true;
  ngaybatdau_tk = '';
  ngayketthuc_tk = '';
  donvichutri_select = '';
  dataxuong = [];
  tinhchat = 0;
  data_baocao = [];
  ma_xuong_select: '';
  title = 'angular-app';
  fileName = 'ExcelSheet.xlsx';

  ngOnInit(): void {
    this.get_danhsachxuong();
    this.ngayketthuc_tk = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.ngaybatdau_tk = moment(
      "01/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear(),
      'DD/MM/YYYY'
    ).format('YYYY-MM-DD');
    this.donvichutri_select = this.Ma_donvi;

  }
  xembaocao() {
    if (this.donvichutri_select == "" || this.donvichutri_select == null) {
      this.toastr.warning("Chưa chọn đơn vị", "Cảnh báo",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }
    const model = {
      "ma_xuong": this.ma_xuong_select,
    };
    this.baocaothanhphamService.baocao_thanhpham(model).subscribe({
      next: (_data) => {
        console.log(_data);
        this.data_baocao = _data;
      },
      error: (error) => {
        this.toastr.error(error);
      },
    });
  }
  taifile() {
    if (this.donvichutri_select == "" || this.donvichutri_select == null) {
      this.toastr.warning("Chưa chọn đơn vị", "Cảnh báo",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }
    //  /* pass here the table id */
    //  let element = document.getElementById('baocao-result');
    //  const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    //  /* generate workbook and add the worksheet */
    //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    //  /* save to file */  
    //  XLSX.writeFile(wb, "Báo cáo theo đơn vị.xlsx");

    this.baocaothanhphamService.baocao_thanhpham_exp(this.ma_xuong_select).subscribe(
      response => {
        var file = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64'
        });
        var fileURL = window.URL.createObjectURL(file);
        console.log(response);
        var seconds = new Date().getTime() / 1000;
        var fileName = "Baocaotheodonvi.xlsx";
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.href = fileURL;
        a.download = fileName;
        a.click();
      });

  }

  get_danhsachxuong(): void {
    this.phanxuongService.get_all()
        .subscribe(
            _data => {
              console.log(_data);
                this.dataxuong = _data;
                  const isLargeNumber = (element) => element.ma_xuong == this.ma_xuong_select;
                  if(_data.findIndex(isLargeNumber) < 0)
                  {
                    this.ma_xuong_select = _data[0].ma_xuong;
                  }
            }
        );
  }

}
