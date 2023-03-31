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
import { VattuService } from "@app/_services/danhmuc/vattu.service";
import { CongviecphatsinhService } from '@app/_services/congviec/congviecphatsinh.service';
import * as moment from "moment";
import { TraicungcapService } from "@app/_services/danhmuc/a_traicungcap.service";

@Component({
  selector: 'app-qlvattu-Edit',
  templateUrl: './edit_vattu.component.html'
})
export class Edit_VattuComponent implements OnInit {
  @Input() title: string;
  @Input() data: any;


  @Output() event = new EventEmitter<boolean>();
  form: FormGroup;
  loading = false;
  submitted = false;  
  filepreview = '';
  file: any = null;
  fileinput = '';
  code = '';
  fileattachs: any = [];
  danhsachfile: any = [];
  datatrai: any = [];
  dataloaivattu = [{"loaivt_id": 1,"ten_loai":"Vật tư sản xuất"},{"loaivt_id": 2,"ten_loai":"Nguyên liệu"}]
  matrai_select = '';
  serviceBase = `${environment.apiURL}`;
  viewtrangthai = false;
  Ma_nhanvien = localStorage.getItem('Ma_nhanvien') ? localStorage.getItem('Ma_nhanvien') : sessionStorage.getItem('Ma_nhanvien') || '';
  UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';
  constructor(
    public modalRef: BsModalRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private traiService: TraicungcapService,
    private vattuService: VattuService
  ) { }

  html: string;


  get f() { return this.form.controls; }

  ngOnInit(): void {  
    this.generateCode()  
    this.get_danhsachtrai();
    if(this.data=='0'){
      this.form = this.formBuilder.group({
        ma_vattu: [this.code],
        ten_vattu: [''],
        ma_trai: [''],
        mota: [''],
        loai_vattu: [''],
        taitrong: [''],
      });
      this.f.loai_vattu.setValue(this.dataloaivattu[0].loaivt_id)
    }else{
      this.form = this.formBuilder.group({        
        ma_vattu: [this.data.ma_vattu, Validators.required],
        ten_vattu: [this.data.ten_vattu],
        ma_trai: [this.data.ma_trai],
        mota: [this.data.mota],
        loai_vattu: [this.data.loai_vattu],
        taitrong: [this.data.taitrong]
      });
      this.matrai_select = this.data.ma_trai;
    }
  }
  
  generateCode() {
    let codeNumber = Math.floor(Math.random() * 10000) + 1;
    let codeString = codeNumber.toString().padStart(5, "0");
    this.code = "VT" + codeString;
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
    if (this.f.ten_vattu.value == "" || this.f.ten_vattu.value == null) {
      this.toastr.warning("Chưa nhập tên vật tư", "Cảnh báo",
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
    obj['MA_VATTU'] = this.f.ma_vattu.value;
    obj['TEN_VATTU'] = this.f.ten_vattu.value;
    obj['LOAI_VATTU'] = this.f.loai_vattu.value;
    obj['MA_TRAI'] = this.f.ma_trai.value;
    obj['MOTA'] = this.f.mota.value;
    obj['TAITRONG'] = this.f.taitrong.value;
    obj['NGUOI_CAPNHAT'] = this.UserName;
    formData['data'] = JSON.stringify(obj);
    if(this.data=='0'){
      try{
        console.log(formData)
        this.vattuService.vattu_ins(formData)
        .subscribe({
          next: (_data) => {
            this.event.emit(true);
            this.modalRef.hide();
            this.toastr.success("Thêm mới vật tư thành công", "",
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
      console.log(formData)
      this.vattuService.vattu_up(formData)
      .subscribe({
        next: (_data) => {
          console.log(_data)
          this.event.emit(true);
          this.modalRef.hide();
          this.toastr.success("Cập nhật vật tư thành công", "",
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
    get_danhsachtrai(): void {
      this.traiService.get_all()
          .subscribe(
              _data => {
                  this.datatrai = _data;
                  this.f.ma_trai.setValue(this.datatrai[0].ma_trai)
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
