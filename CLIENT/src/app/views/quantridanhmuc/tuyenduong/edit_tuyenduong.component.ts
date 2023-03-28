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
  selector: 'app-qltuyenduong-Edit',
  templateUrl: './edit_tuyenduong.component.html'
})
export class Edit_tuyenduongComponent implements OnInit {
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
  dataphanxuong = [];
  phanxuong_select = [];
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
    this.get_danhsachdonvi();
    this.get_key();
    if(this.data =='0'){
      this.form = this.formBuilder.group({
        ten_duong: ['', Validators.required],
        ma_duong: [''],
        noidung: [''],
        phanxuong: [''],
        mota: [''],
        trangthai: [''],
      });
      this.f.ma_duong.setValue(this.ma_duong);
    }else{
      this.viewtrangthai = true;
      this.form = this.formBuilder.group({
        
        ten_duong: [this.data.ten_duong, Validators.required],
        ma_duong: [this.data.ma_duong, Validators.required],
        phanxuong: [this.data.ma_xuong],
        mota: [this.data.mota],
        trangthai: [''],
      });
      this.phanxuong_select = this.data.ma_xuong;
      this.viewtrangthai = true;
    }
  }
  

  public logValue(): void {
    const element = document.querySelector('.ql-editor');
    this.html = element.innerHTML;
  }

  get_key(): void {
    this.dmchungService.get_key({"key":"DM_DUONG"})
      .subscribe(
          _data => {
            this.f.ma_duong.setValue(_data[0].ma_duong);
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
    if (this.f.ma_duong.value == "" || this.f.ma_duong.value == null) {
      this.toastr.warning("Chưa nhập mã đường", "Cảnh báo",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }
    if (this.f.ten_duong.value == "" || this.f.ten_duong.value == null) {
      this.toastr.warning("Chưa nhập tên đường", "Cảnh báo",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }    
    if (this.f.phanxuong.value == "" || this.f.phanxuong.value == null) {
      this.toastr.warning("Chưa chọn phân xưởng", "Cảnh báo",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
        console.log("1333" );
      return;
    }  
    
    this.loading = true;
     var model = {
       "MA_DUONG": this.f.ma_duong.value,
       "TEN_DUONG": this.f.ten_duong.value,
       "MA_XUONG": this.phanxuong_select,
       "MOTA": this.f.mota.value,
      "NGAY_CAPNHAT":"2022-12-20T00:00:00Z",
      "NGUOI_CAPNHAT":this.UserName};    
   
    this.tuyenduongService.insert (JSON.stringify(model))
      .subscribe({
        next: (_data) => {
          this.event.emit(true);
          this.modalRef.hide();
          this.toastr.success("Thêm mới đường thành công", "",
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

  closed() {
    this.event.emit(true);
    this.modalRef.hide();
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
  // lấy danh sách đơn vị giao việc
  get_danhsachdonvi() {
    // var madonvi = localStorage.getItem('Ma_donvi') ? localStorage.getItem('Ma_donvi') : sessionStorage.getItem('Ma_donvi') || '';
    // console.log(madonvi);
    this.phanxuongService.get_all()
        .subscribe(
            _data => {
                this.dataphanxuong = _data;
                console.log(_data);
            }
        );
}
}
