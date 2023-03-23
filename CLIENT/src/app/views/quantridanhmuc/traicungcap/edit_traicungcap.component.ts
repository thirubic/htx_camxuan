import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from '@environments/environment';
import * as moment from "moment";
import { TraicungcapService } from "@app/_services/danhmuc/a_traicungcap.service";

@Component({
  selector: 'app-qltrai-Edit',
  templateUrl: './edit_traicungcap.component.html'
})
export class Edit_TraiComponent implements OnInit {
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
  datatrai: any = [];
  matrai_select = '';
  serviceBase = `${environment.apiURL}`;
  viewtrangthai = false;
  Ma_nhanvien = localStorage.getItem('Ma_nhanvien') ? localStorage.getItem('Ma_nhanvien') : sessionStorage.getItem('Ma_nhanvien') || '';
  UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';
  constructor(
    public modalRef: BsModalRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private traiService: TraicungcapService
  ) { }

  html: string;


  get f() { return this.form.controls; }

  ngOnInit(): void {    
    if(this.data=='0'){
      this.form = this.formBuilder.group({
        ma_trai: [''],
        ten_trai: [''],
        diachi: [''],
        sdt: [''],
        ten_chutrai: [''],
        mota: ['']
      });
    }else{
      this.form = this.formBuilder.group({        
        ma_trai: [this.data.ma_trai, Validators.required],
        ten_trai: [this.data.ten_trai],
        diachi: [this.data.diachi],
        sdt: [this.data.sdt],
        ten_chutrai: [this.data.ten_chutrai],
        mota: [this.data.mota]
      });
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
    if (this.f.ma_trai.value == "" || this.f.ma_trai.value == null) {
      this.toastr.warning("Chưa nhập mã trại", "Cảnh báo",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }
    if (this.f.ten_trai.value == "" || this.f.ten_trai.value == null) {
      this.toastr.warning("Chưa nhập tên trại", "Cảnh báo",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }
    if (this.f.sdt.value == "" || this.f.sdt.value == null) {
      this.toastr.warning("Chưa nhập số điện thoại liên hệ", "Cảnh báo",
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
    obj['MA_TRAI'] = this.f.ma_trai.value;
    obj['TEN_TRAI'] = this.f.ten_trai.value;
    obj['SDT'] = this.f.sdt.value;
    obj['DIACHI'] = this.f.diachi.value;
    obj['TEN_CHUTRAI'] = this.f.ten_chutrai.value;
    obj['MOTA'] = this.f.mota.value;
    obj['NGUOI_CAPNHAT'] = this.UserName;
    formData['data'] = JSON.stringify(obj);
    if(this.data=='0'){
      try{
        this.traiService.trai_ins(formData)
        .subscribe({
          next: (_data) => {
            this.event.emit(true);
            this.modalRef.hide();
            this.toastr.success("Thêm mới trại thành công", "",
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
      this.traiService.trai_up(formData)
      .subscribe({
        next: (_data) => {
          console.log(_data)
          this.event.emit(true);
          this.modalRef.hide();
          this.toastr.success("Cập nhật trại thành công", "",
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
