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
import { GiavattuService } from "@app/_services/danhmuc/giavattu.service";
import { VattuService } from "@app/_services/danhmuc/vattu.service";
import { CongviecphatsinhService } from '@app/_services/congviec/congviecphatsinh.service';
import * as moment from "moment";

@Component({
  selector: 'app-qlgiavattu-Edit',
  templateUrl: './edit_giavattu.component.html'
})
export class Edit_GiavattuComponent implements OnInit {
  @Input() title: string;
  @Input() data: any;


  @Output() event = new EventEmitter<boolean>();
  form: FormGroup;
  loading = false;
  submitted = false;  
  filepreview = '';
  file: any = null;
  fileinput = '';
  fileattachs: any = [];
  danhsachfile: any = [];
  datagiavattu: any = [];
  mavattu_select = '';
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
    private giavattuService: GiavattuService,
    private vattuService: VattuService,
    private congviecPSService: CongviecphatsinhService,
  ) { }

  html: string;


  get f() { return this.form.controls; }

  ngOnInit(): void {    
    this.get_danhsachvatu();
    if(this.data=='0'){
      this.form = this.formBuilder.group({
        ma_vattu: [''],
        gia: [''],
        donvi_tinh: [''],
        ghichu: [''],
        tungay: [''],
        denngay: [''],
      });
    }else{
      this.form = this.formBuilder.group({        
        ma_vattu: [this.data.ma_vattu, Validators.required],
        gia: [this.data.gia],
        donvi_tinh: [this.data.donvi_tinh],
        ghichu: [this.data.ghichu],
        tungay: moment(this.data.tungay).format('YYYY-MM-DD'),
        denngay: moment( this.data.denngay).format('YYYY-MM-DD'),
      });
      this.mavattu_select = this.data.ma_vattu;
    }
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

  onSubmit(): void {

    this.submitted = true;
    this.loading = true;
    const obj = {}
    const formData = {}
    obj['MA_VATTU'] = this.f.ma_vattu.value;
    obj['GIA'] = this.f.gia.value;
    obj['DONVI_TINH'] = this.f.donvi_tinh.value;
    obj['TUNGAY'] = this.f.tungay.value;
    obj['DENNGAY'] = this.f.denngay.value;
    obj['GHICHU'] = this.f.ghichu.value;
    obj['NGUOI_CAPNHAT'] = this.UserName;
    formData['data'] = JSON.stringify(obj);
    if(this.data=='0'){
      try{
        this.giavattuService.giavattu_ins(formData)
        .subscribe({
          next: (_data) => {
            this.event.emit(true);
            this.modalRef.hide();
            this.toastr.success("Thêm mới giá vật tư thành công", "",
              {
                timeOut: 3000,
                closeButton: true,
                positionClass: 'toast-bottom-right'
              });
          }
        });
      }catch(err){
        this.toastr.error(err)
      }
    
    }else{
      this.giavattuService.giavattu_up(formData)
      .subscribe({
        next: (_data) => {
          console.log(_data)
          this.event.emit(true);
          this.modalRef.hide();
          this.toastr.success("Cập nhật giá vật tư thành công", "",
            {
              timeOut: 3000,
              closeButton: true,
              positionClass: 'toast-bottom-right'
            });
        },
        error: error => {
          this.toastr.error(error)
        }
      });
    }
  }

  closed() {
    this.event.emit(true);
    this.modalRef.hide();
  }

// lấy danh sách đơn vị giao việc
    get_danhsachvatu(): void {
      this.vattuService.get_all()
          .subscribe(
              _data => {
                  this.datagiavattu = _data;
                  this.f.ma_vattu.setValue(this.datagiavattu[0].ma_vattu)
              }
          );
    }
  editorConfigs: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: '"http://cskhhue-api.vnpthue.com.vn/api/upload/upload_anhnoidung"',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
}
