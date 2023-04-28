import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { DantocService } from "@app/_services/danhmuc/dantoc.service";
import { GlobalConstants } from '@app/_models/config';
import { Query, DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Options } from '@angular-slider/ngx-slider';
import { CongviecphatsinhService } from '@app/_services/congviec/congviecphatsinh.service';
import { Tr_NhapluongService } from '@app/_services/danhmuc/Tr_nhapluong.service';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { TuyenduongService } from "@app/_services/danhmuc/tuyenduong.service";
import { DuongService } from "@app/_services/danhmuc/a_duong.service";
import { ConfirmService } from "@app/_modules/confirm/confirm.service";
import { LuongphanService } from "@app/_services/danhmuc/luongphan.service";
@Component({
  selector: 'app-ctluong-chonvitri',
  templateUrl: './chuyenvitri.component.html'
})
export class Chuyenvitri_ctluongComponent implements OnInit {
  @Input() title: string;
  @Input() data: any;
  @Input() vitri: any;

  @Output() event = new EventEmitter<boolean>();

  Ma_nhanvien = localStorage.getItem('Ma_nhanvien') ? localStorage.getItem('Ma_nhanvien') : sessionStorage.getItem('Ma_nhanvien') || '';
  UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';
  serviceBase = `${environment.apiURL}`;

  form: FormGroup;
  loading = false;
  submitted = false;
  ds_header: any = [];
  ilevels: any = [];
  level_header: any = [];
  level_max = 0;
  ds_data: any = [];
  countitem_data: any = [];
  itype = 0;
  dataduong= [];
  ct_vattus: any = [];
  filedinhkem_bl = '';
  filedinhkem: any = [];
  //
  showthemnguoi = false;
  showfollwer = false;
  showbtngui = true;
  showtraodoi = true;
  dataitems = [
  ];
  selecteds = [
  ];
  danhsachfile: any = [];
  danhsachnguoiphoihop: any = [];
  danhsachdonviphoihop: any = [];
  danhsachbinhluan: any = [];
  vitris: any = [];
  //
  donvichutri = '';
  ten_nguoichutri = '';
  ten_nguoigiao = '';
  ten_nguoigiamsat = '';
  ngaygiao = '';
  tencongviec = '';
  noidungthuchien = '';
  tilehoanthanh = '';
  ngaybatdau = '';
  ngayketthuc = '';
  nguonphatsinh = '';
  douutien = '';
  anh_chutri = '';
  anh_nguoigiao = '';
  anh_nguoigiamsat = '';
  noidung_thaoluan = '';

  // Tiến độ
  sliderControl: FormControl = new FormControl(20);
  options: Options = {
    floor: 0,
    ceil: 100,
    step: 10,
    showTicks: true,
    translate: (value: number): string => {
      return value + '%';
    }
  };

  constructor(
    public modalRef: BsModalRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private confirmService: ConfirmService,
    private congviecPSService: CongviecphatsinhService,
    private router: Router,
    private tr_NhapluongService: Tr_NhapluongService,
    private tuyenduongService: TuyenduongService,
    private duongService: DuongService,
    private luongphanService: LuongphanService,
  ) { }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.getduong_byphanxuong()
    this.form = this.formBuilder.group({
      vitri: [],
      ma_duong: [],
    });
    console.log(this.data);
  }

  showAssignTosTask() {
    if (this.showthemnguoi) {
      this.showthemnguoi = false;
    } else {
      this.showthemnguoi = true;
    }
  }

  antraodoi() {
    if (!this.showtraodoi) {
      this.showtraodoi = true;
    } else {
      this.showtraodoi = false;
    }
  }

  hienbuttongui() {
    if (!this.showbtngui) {
      this.showbtngui = true;
    }
    this.showbtngui = true;
  }
  anbuttongui() {
    // if (this.showbtngui) {
    //     this.showbtngui = false;
    // }
    this.showbtngui = true;
  }
  //Hiển thị dữ liệu text sang dạng edit
  showEditTitle(e) {
    var permision = true;
    if (permision) {
      $(e).hide();
      $(e).parents('.modal-title').find('input').val($(e).text().trim());
      $(e).parents('.modal-title').find('input').show();
      $(e).parents('.modal-title').find('input').focus();
    }
  }

  showfollwerTosTask() {
    if (this.showfollwer) {
      this.showfollwer = false;
    } else {
      this.showfollwer = true;
    }
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
    this.vitri = this.f.vitri.value
    this.submitted = this.vitri;

    if (this.form.invalid) {
      return;
    }
    let options = {
      prompt: 'Bạn có muốn chuyển luống phân này sang vị trí mới không?',
      title: "Thông báo",
      okText: `Đồng ý`,
      cancelText: `Hủy`,
    };

    this.confirmService.confirm(options).then((res: boolean) => {
      if (res) {
        let input = {
          "ma_luong": this.data.ma_luong,
          "ma_duong": this.f.ma_duong.value,
          "vitri_cu": this.data.vitri,
          "vitri_moi": this.f.vitri.value,
        };
        this.luongphanService.chuyenvitri(input).subscribe({
          next: (_data) => {
            this.toastr.success("Chuyển vị trí thành công", 'Thông báo', {
              timeOut: 3000,
              closeButton: true,
              positionClass: 'toast-bottom-right',
            });
            
          },
          error: (error) => {
            this.toastr.error(error);
          },
        });
        console.log('XÓA');
      }
    });
    this.closed()
  }
  closed() {
    this.event.emit(this.vitri);
    this.modalRef.hide();
  }

  change_duong(item){
    this.get_vitri_theoduong()
  }
  getduong_byphanxuong() { 
    return new Promise<any>((resolve) => {
      this.duongService.get_byphanxuong({"ma_xuong":this.data.ma_xuong})
        .subscribe(
          _data => {
            this.dataduong = _data; 
            this.f.ma_duong.setValue(_data[0].ma_duong) ;
            this.get_vitri_theoduong()
          }
        );
    })
  }
  // get nguoi phoi hop
  get_vitri_theoduong() { 
    return new Promise<any>((resolve) => {
      this.tuyenduongService.getbyma(this.f.ma_duong.value)
        .subscribe(
          _data => {
            this.vitris = _data.filter(x=> x.vitri != 1 && x.vitri != 8 && x.trangthai != 1);     
          }
        );
    })
  }
}