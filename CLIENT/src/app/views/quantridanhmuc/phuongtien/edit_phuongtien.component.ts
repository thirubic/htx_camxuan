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
import { Tr_phuongtienService } from "@app/_services/danhmuc/Tr_phuongtien.service";
import { CongviecphatsinhService } from '@app/_services/congviec/congviecphatsinh.service';
import * as moment from "moment";
import { TraicungcapService } from "@app/_services/danhmuc/a_traicungcap.service";

@Component({
  selector: 'app-qlphuongtien-Edit',
  templateUrl: './edit_phuongtien.component.html'
})
export class Edit_PhuongtienComponent implements OnInit {
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
    private phuongtienService: Tr_phuongtienService
  ) { }

  html: string;


  get f() { return this.form.controls; }

  ngOnInit(): void {    
    this.get_danhsachtrai();
    if(this.data=='0'){
      this.form = this.formBuilder.group({
        ma_phuongtien: [''],
        ten_phuongtien: [''],
        ma_trai: [''],
        trongtai: [''],
        giavanchuyen: [''],
        ghichu: ['']
      });
      //this.f.loai_phuongtien.setValue(this.dataloaivattu[0].loaivt_id)
    }else{
      this.form = this.formBuilder.group({        
        ma_phuongtien: [this.data.ma_pt, Validators.required],
        ten_phuongtien: [this.data.ten_pt],
        ma_trai: [this.data.ma_trai],
        trongtai: [this.data.taitrong],
        giavanchuyen: [this.data.gia_vanchuyen],
        ghichu: [this.data.ghichu]
      });
      this.matrai_select = this.data.ma_trai;
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
    if (this.f.ma_phuongtien.value == "" || this.f.ma_phuongtien.value == null) {
      this.toastr.warning("Chưa nhập mã phương tiện", "Cảnh báo",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }

    if (this.f.ten_phuongtien.value == "" || this.f.ten_phuongtien.value == null) {
      this.toastr.warning("Chưa nhập tên phương tiện", "Cảnh báo",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }

    if (this.f.ma_trai.value == "" || this.f.ma_trai.value == null) {
      this.toastr.warning("Chưa chọn trại nguyên liệu", "Cảnh báo",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }

    if (this.f.trongtai.value == "" || this.f.trongtai.value == null) {
      this.toastr.warning("Chưa nhập trọng tải của phương tiện", "Cảnh báo",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }

    if (this.f.giavanchuyen.value == "" || this.f.giavanchuyen.value == null) {
      this.toastr.warning("Chưa nhập giá vận chuyển của phương tiện", "Cảnh báo",
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
    obj['MA_PT'] = this.f.ma_phuongtien.value;
    obj['TEN_PT'] = this.f.ten_phuongtien.value;
    obj['TAITRONG'] = this.f.trongtai.value;
    obj['GIA_VANCHUYEN'] = this.f.giavanchuyen.value;
    obj['MA_TRAI'] = this.f.ma_trai.value;
    obj['GHICHU'] = this.f.ghichu.value;
    obj['NGUOI_CAPNHAT'] = this.UserName;
    formData['data'] = JSON.stringify(obj);
    if(this.data=='0'){
      try{
        this.phuongtienService.phuongtien_up(formData)
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
      this.phuongtienService.phuongtien_up(formData)
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
