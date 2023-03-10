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
import { NguonphatsinhService } from "@app/_services/danhmuc/nguonphatsinh.service";
import { CongviecphatsinhService } from '@app/_services/congviec/congviecphatsinh.service';

@Component({
  selector: 'app-qlnguonphatsinh-Edit',
  templateUrl: './edit_nguonphatsinh.component.html'
})
export class Edit_nguonphatsinhComponent implements OnInit {
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
  datadonvi = [];
  donvichutri_select = [];
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
    private nguonphatsinhService: NguonphatsinhService,
    private congviecPSService: CongviecphatsinhService,
  ) { }

  html: string;


  get f() { return this.form.controls; }

  ngOnInit() {    
    console.log(this.data);
    this.get_danhsachdonvi();
    if(this.data =='0'){
      this.form = this.formBuilder.group({
        ten_nguonphatsinh: ['', Validators.required],
        noidung: [''],
        donvi: [''],
        trangthai: [''],
        attachfile: [],
        filepreview: [],
        fileSource: [],
        fileSource1: [],
        fileSource2: [],
        fileSource3: [],
        fileSource4: [],
        fileSource5: [],
      });
    }else{
      this.form = this.formBuilder.group({        
        ten_nguonphatsinh: [this.data.ten, Validators.required],
        noidung: [this.data.noidung],
        donvi: [this.data.madonvi],
        trangthai: [this.data.trangthai],
        attachfile: [],
        filepreview: [],
        fileSource: [],
        fileSource1: [],
        fileSource2: [],
        fileSource3: [],
        fileSource4: [],
        fileSource5: [],
      });
      this.donvichutri_select = this.data.madonvi;
      this.get_congviec_file();
      this.viewtrangthai = true;
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
    if (this.f.ten_nguonphatsinh.value == "" || this.f.ten_nguonphatsinh.value == null) {
      this.toastr.warning("Ch??a nh???p t??n ngu???n ph??t sinh", "C???nh b??o",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }
    console.log("123" );
    if (this.f.donvi.value == "" || this.f.donvi.value == null) {
      this.toastr.warning("Ch??a ch???n ????n v???", "C???nh b??o",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
        console.log("1333" );
      return;
    }
    if (this.f.noidung.value == "" || this.f.noidung.value == null) {
      this.toastr.warning("Ch??a nh???p n???i dung", "C???nh b??o",
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right'
        });
      return;
    }
    for (let i = 0; i < this.fileattachs.length; i++) {
      if (i == 0) this.form.patchValue({
          fileSource1: this.fileattachs[i]
      });
      if (i == 1) this.form.patchValue({
          fileSource2: this.fileattachs[i]
      });
      if (i == 2) this.form.patchValue({
          fileSource3: this.fileattachs[i]
      });
      if (i == 3) this.form.patchValue({
          fileSource4: this.fileattachs[i]
      });
      if (i == 4) this.form.patchValue({
          fileSource5: this.fileattachs[i]
      });
  }
    this.loading = true;
    const formData = new FormData();
    formData.append('file', this.form.get('fileSource1').value);
    formData.append('file', this.form.get('fileSource2').value);
    formData.append('file', this.form.get('fileSource3').value);
    formData.append('file', this.form.get('fileSource4').value);
    formData.append('file', this.form.get('fileSource5').value);
    formData.append('prmMA_NGUON_PS', this.data.ma_nguonphatsinh);
    formData.append('prmTRANG_THAI', this.f.trangthai.value);
    formData.append('prmTEN', this.f.ten_nguonphatsinh.value);
    formData.append('prmMOTA', this.f.noidung.value);
    formData.append('prmMA_DV', this.f.donvi.value);
    formData.append('prmNGUOI_CAPNHAT',this.UserName);
    if(this.data == '0'){
    this.nguonphatsinhService.nguonphatsinh_ins_upload(formData)
      .subscribe({
        next: (_data) => {
          this.event.emit(true);
          this.modalRef.hide();
          this.toastr.success("Th??m m???i ngu???n ph??t sinh th??nh c??ng", "",
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
    }else{
      console.log('s???a ngu???n ph??t sinh');
      console.log(formData);
      this.nguonphatsinhService.nguonphatsinh_up_upload(formData)
      .subscribe({
        next: (_data) => {
          this.event.emit(true);
          this.modalRef.hide();
          this.toastr.success("C???p nh???t ngu???n ph??t sinh th??nh c??ng", "",
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
  attachfile(event) {
    if ((event.target.files.length + this.danhsachfile.length) > 5) {
      this.toastr.error('S??? file ????nh k??m kh??ng ???????c qu?? 5 files')
      return;
    }

    // kiem tra trung ten
    if (this.danhsachfile.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        for (let j = 0; j < this.danhsachfile.length; j++) {
          if (this.danhsachfile[j].name == event.target.files[i].name) {
            this.toastr.error('File v???a ch???n ???? t???n t???i trong danh s??ch file ????nh k??m')
            return;
          }
        }
      }
    }

    for (let i = 0; i < event.target.files.length; i++) {
      this.fileattachs.push(event.target.files[i]);
      this.danhsachfile.push(event.target.files[i]);      
    }
  }
  deletefile(datadel, indexfile) {
    if (typeof (datadel.id_file) == 'undefined') {
      this.fileattachs.splice(indexfile, 1);
      this.danhsachfile.splice(indexfile, 1)
    } else {
      let options = {
        prompt: 'B???n c?? mu???n x??a th??ng b??o [' + datadel.name + '] n??y kh??ng?',
        title: "Th??ng b??o",
        okText: `?????ng ??`,
        cancelText: `H???y`,
      };

      this.confirmService.confirm(options).then((res: boolean) => {
        if (res) {
          this.quantriService.delete_thongbaofile(datadel.id_file, "admin").subscribe({
            next: (_data) => {
              this.toastr.success("X??a th??nh c??ng", 'Th??ng b??o', {
                timeOut: 3000,
                closeButton: true,
                positionClass: 'toast-bottom-right',
              });
              this.danhsachfile.splice(indexfile, 1)
            },
            error: (error) => {
              this.toastr.error(error);
            },
          });
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
  // l???y danh s??ch ????n v??? giao vi???c
  get_danhsachdonvi() {
    var madonvi = localStorage.getItem('Ma_donvi') ? localStorage.getItem('Ma_donvi') : sessionStorage.getItem('Ma_donvi') || '';
    console.log(madonvi);
    this.donviService.get_donvigiaoviec(madonvi)
        .subscribe(
            _data => {
                this.datadonvi = _data;
                console.log(_data);
            }
        );
}
get_congviec_file() {
  this.congviecPSService.get_congviec_file(this.data.ma_nguonphatsinh)
    .subscribe(
      _data => {          
        this.danhsachfile = _data;  
        console.log(_data);
      }
    );
}
}
