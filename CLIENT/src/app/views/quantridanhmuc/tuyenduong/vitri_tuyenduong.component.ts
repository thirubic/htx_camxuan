import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { QuantrinoidungService } from '@app/_services/quantri/quantrinoidung.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ConfirmService } from '@app/_modules/confirm/confirm.service';
import { DonviService } from "@app/_services/danhmuc/donvi.service";
import { TuyenduongService } from "@app/_services/danhmuc/tuyenduong.service";
import { PhanxuongService } from "@app/_services/danhmuc/phanxuong.service";
import { CongviecphatsinhService } from '@app/_services/congviec/congviecphatsinh.service';
import { DMChungService } from "@app/_services/danhmuc/dmchung.service";
@Component({
  selector: 'app-qltuyenduong-Vitri',
  templateUrl: './vitri_tuyenduong.component.html'
})
export class Vitri_tuyenduongComponent implements OnInit {
  @Input() title: string;
  @Input() data: any;


  @Output() event = new EventEmitter<boolean>();
  form: FormGroup;
  loading = false;
  submitted = false;  
  filepreview = '';
  totalItems = 0;
  term : string = '';
  p: number = 1;
  ten_duong = '';
  ma_duong = '';
  file: any = null;
  fileinput = '';
  fileattachs: any = [];
  tuyenduongs: any = [];
  danhsachfile: any = [];
  dataphanxuong = [];
  phanxuong_select = [];
  ma_xuong_user = localStorage.getItem('Ma_donvi') ? localStorage.getItem('Ma_donvi') : sessionStorage.getItem('Ma_donvi') || '';
  serviceBase = `${environment.apiURL}`;
  viewtrangthai = false;
  Ma_nhanvien = localStorage.getItem('Ma_nhanvien') ? localStorage.getItem('Ma_nhanvien') : sessionStorage.getItem('Ma_nhanvien') || '';
  UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';
  constructor(
    public modalRef: BsModalRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private quantriService: QuantrinoidungService,
    private confirmService: ConfirmService,
    private donviService: DonviService,
    private phanxuongService: PhanxuongService,
    private tuyenduongService: TuyenduongService,
    private dmchungService: DMChungService,
  ) { }

  html: string;


  get f() { return this.form.controls; }

  ngOnInit() {  
    this.ten_duong = this.data.ten_duong
    this.ma_duong = this.data.ma_duong;
    this.get_vitri_theoduong()
  }
  

  public logValue(): void {
    const element = document.querySelector('.ql-editor');
    this.html = element.innerHTML;
  }
  checknull(text): boolean {
    if (text == null || text == '' || text == undefined) {
      return true;
    }
    else {
      return false;
    }
  }
  groupByKey(array, key) {
    return array
      .reduce((hash, obj) => {
        if (obj[key] === undefined) return hash;
        return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
      }, {})
  };
  checkiteminlist(aryy_, ilevel): boolean {
    for (let k = 0; k < aryy_.length; k++) {
      if (aryy_[k] == ilevel) {
        return false;
      }
    }
    return true;
  }

  closed() {
    this.event.emit(true);
    this.modalRef.hide();
  }
  get_vitri_theoduong() { 
    return new Promise<any>((resolve) => {
      this.tuyenduongService.getbyma(this.ma_duong)
        .subscribe(
          _data => {
            this.tuyenduongs = _data; 
            this.totalItems = _data.length;
            this.p = 1;    
          }
        );
    })
  }
}
