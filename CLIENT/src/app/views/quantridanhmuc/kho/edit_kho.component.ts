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
import { KhoService } from "@app/_services/danhmuc/kho.service";
import { CongviecphatsinhService } from '@app/_services/congviec/congviecphatsinh.service';
import * as moment from "moment";
import { TraicungcapService } from "@app/_services/danhmuc/a_traicungcap.service";
import { PhanxuongService } from "@app/_services/danhmuc/phanxuong.service";
import { DMChungService } from "@app/_services/danhmuc/dmchung.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: 'app-qlkho-Edit',
  templateUrl: './edit_kho.component.html'
})
export class Edit_KhoComponent implements OnInit {
  @Input() title: string;
  @Input() data: any;
  @Input() phanxuong: string;


  @Output() event = new EventEmitter<boolean>();
  form: FormGroup;
  loading = false;
  submitted = false;  
  filepreview = '';
  file: any = null;
  fileinput = '';
  fileattachs: any = [];
  danhsachfile: any = [];
  dataxuong: any = [];
  dataloaikho = [{"loaikho_id": 1,"ten_loaikho":"Kho vật tư"},{"loaikho_id": 2,"ten_loaikho":"Kho thành phẩm"},{"loaikho_id": 3,"ten_loaikho":"Kho nguyên liệu"}]
  maxuong_select = '';
  disabled = false;
  serviceBase = `${environment.apiURL}`;
  viewtrangthai = false;
  Ma_nhanvien = localStorage.getItem('Ma_nhanvien') ? localStorage.getItem('Ma_nhanvien') : sessionStorage.getItem('Ma_nhanvien') || '';
  UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';
  
  constructor(
    public modalRef: BsModalRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private xuongService: PhanxuongService,
    private khoService: KhoService,
    private dmchungService: DMChungService
  ) { }

  html: string;


  get f() { return this.form.controls; }

  ngOnInit(): void {    
    this.get_danhsachxuong();
    if(this.data=='0'){
      this.disabled = false;
      this.form = this.formBuilder.group({
        ma_kho: [''],
        ten_kho: [''],
        loai_kho: [''],
        ma_xuong: [''],
        ghichu: ['']
      });
      this.f.loai_kho.setValue(this.dataloaikho[0].loaikho_id)
    }else{
      this.disabled = true;
      this.form = this.formBuilder.group({        
        ma_kho: [this.data.ma_kho, Validators.required],
        ten_kho: [this.data.ten_kho],
        loai_kho: [this.data.loai_kho],
        ma_xuong: [this.data.ma_xuong],
        ghichu: [this.data.ghichu]
      });
    }
    this.f.ma_xuong.setValue(this.phanxuong);
    this.get_key()
  }
  

  public logValue(): void {
    const element = document.querySelector('.ql-editor');
    this.html = element.innerHTML;
  }

  get_key(): void {
    this.dmchungService.get_key({"key":"KHO"})
      .subscribe(
          _data => {
            if(_data.length > 0){
              this.f.ma_kho.setValue(_data[0].ma_kho);
            }else{
              this.f.ma_kho.setValue('KHO001');
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
    if (this.f.ma_kho.value == "" || this.f.ma_kho.value == null) {
      this.toastr.warning("Chưa nhập mã kho", "Cảnh báo",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }
    if (this.f.ten_kho.value == "" || this.f.ten_kho.value == null) {
      this.toastr.warning("Chưa nhập tên kho", "Cảnh báo",
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
    obj['MA_KHO'] = this.f.ma_kho.value;
    obj['TEN_KHO'] = this.f.ten_kho.value;
    obj['LOAI_KHO'] = this.f.loai_kho.value;
    obj['MA_XUONG'] = this.f.ma_xuong.value;
    obj['GHICHU'] = this.f.ghichu.value;
    obj['NGUOI_CAPNHAT'] = this.UserName;
    formData['data'] = JSON.stringify(obj);
    if(this.data=='0'){
      try{
        this.khoService.kho_ins(formData)
        .subscribe({
          next: (_data) => {
            this.event.emit(true);
            this.modalRef.hide();
            this.toastr.success("Thêm mới kho thành công", "",
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
      this.khoService.kho_up(formData)
      .subscribe({
        next: (_data) => {
          console.log(_data)
          this.event.emit(true);
          this.modalRef.hide();
          this.toastr.success("Cập nhật kho thành công", "",
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

    get_danhsachxuong(): void {
      this.xuongService.get_all()
          .subscribe(
              _data => {
                  this.dataxuong = _data;
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
