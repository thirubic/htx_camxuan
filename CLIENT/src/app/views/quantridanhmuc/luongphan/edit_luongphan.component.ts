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
import { LuongphanService } from "@app/_services/danhmuc/luongphan.service";
import { CongviecphatsinhService } from '@app/_services/congviec/congviecphatsinh.service';
import * as moment from "moment";
import { TraicungcapService } from "@app/_services/danhmuc/a_traicungcap.service";
import { PhanxuongService } from "@app/_services/danhmuc/phanxuong.service";
import { DuongService } from "@app/_services/danhmuc/a_duong.service";
import { DMChungService } from "@app/_services/danhmuc/dmchung.service";
@Component({
  selector: 'app-qlluongphan-Edit',
  templateUrl: './edit_luongphan.component.html'
})
export class Edit_LuongphanComponent implements OnInit {
  @Input() title: string;
  @Input() data: any;
  @Input() ma_duong: string;


  @Output() event = new EventEmitter<boolean>();
  form: FormGroup;
  loading = false;
  submitted = false;  
  filepreview = '';
  file: any = null;
  fileinput = '';
  fileattachs: any = [];
  danhsachfile: any = [];
  ma_xuong_user = localStorage.getItem('Ma_donvi') ? localStorage.getItem('Ma_donvi') : sessionStorage.getItem('Ma_donvi') || '';
  dataduong: any = [];
  dataloailuongphan = [{"loailuongphan_id": 1,"ten_loailuongphan":"luongphan vật tư"},{"loailuongphan_id": 2,"ten_loailuongphan":"luongphan thành phẩm"},{"loailuongphan_id": 3,"ten_loailuongphan":"luongphan nguyên liệu"}]
  maxuong_select = '';
  disabled= false;
  serviceBase = `${environment.apiURL}`;
  viewtrangthai = false;
  Ma_nhanvien = localStorage.getItem('Ma_nhanvien') ? localStorage.getItem('Ma_nhanvien') : sessionStorage.getItem('Ma_nhanvien') || '';
  UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';
  
  constructor(
    public modalRef: BsModalRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private xuongService: PhanxuongService,
    private luongphanService: LuongphanService,
    private duongService: DuongService,
    private dmchungService: DMChungService,
    
  ) { }

  html: string;


  get f() { return this.form.controls; }

  ngOnInit(): void {    
    this.get_danhsachduong();
    if(this.data=='0'){
      this.disabled = false;
      this.form = this.formBuilder.group({
        ma_luong: [''],
        ten_luong: [''],
        ma_duong: [''],
        mota: ['']
      });
      this.get_key();
    }else{
      this.disabled = true;
      this.form = this.formBuilder.group({        
        ma_luong: [this.data.ma_luong, Validators.required],
        ten_luong: [this.data.ten_luong],
        ma_duong: [this.data.ma_duong],
        mota: [this.data.mota]
      });
    }
    this.f.ma_duong.setValue(this.ma_duong)
  }
  

  public logValue(): void {
    const element = document.querySelector('.ql-editor');
    this.html = element.innerHTML;
  }

  async  get_key() {
    this.dmchungService.get_key({"key":"HOSO_LUONGPHAN"})
        .subscribe(
            _data => {
              if(_data.length > 0){
                this.f.ma_luong.setValue(this.ma_xuong_user+'/'+this.ma_duong+'/'+_data[0].ma_luong)
              }else{
                this.f.ma_luong.setValue(this.ma_xuong_user+'/'+this.ma_duong+'/L01')
              }
              
            }
        );
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
    if (this.f.ma_luong.value == "" || this.f.ma_luong.value == null) {
      this.toastr.warning("Chưa nhập mã luống phân", "Cảnh báo",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }
    if (this.f.ten_luong.value == "" || this.f.ten_luong.value == null) {
      this.toastr.warning("Chưa nhập tên luống phân", "Cảnh báo",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }
    this.loading = true;
    const obj = {}
    const formData = {}
    obj['MA_LUONG'] = this.f.ma_luong.value;
    obj['TEN_LUONG'] = this.f.ten_luong.value;
    obj['MA_DUONG'] = this.f.ma_duong.value;
    obj['MOTA'] = this.f.mota.value;
    obj['NGUOI_CAPNHAT'] = this.UserName;
    formData['data'] = JSON.stringify(obj);
    if(this.data=='0'){
      try{
        this.luongphanService.luongphan_ins(formData)
        .subscribe({
          next: (_data) => {
            this.event.emit(true);
            this.modalRef.hide();
            this.toastr.success("Thêm mới luống thành công", "",
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
      this.luongphanService.luongphan_up(formData)
      .subscribe({
        next: (_data) => {
          console.log(_data)
          this.event.emit(true);
          this.modalRef.hide();
          this.toastr.success("Cập nhật luống phân thành công", "",
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

    get_danhsachduong(): void {
      this.duongService.get_all()
          .subscribe(
              _data => {
                  this.dataduong = _data;
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
