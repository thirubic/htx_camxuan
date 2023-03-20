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
@Component({
  selector: 'app-ctluong-view',
  templateUrl: './view_ctluong.component.html'
})
export class View_ctluongComponent implements OnInit {
  @Input() title: string;
  @Input() data: any;

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
    private congviecPSService: CongviecphatsinhService,
    private router: Router,
    private tr_NhapluongService: Tr_NhapluongService
  ) { }

  get f() { return this.form.controls; }

  ngOnInit() {
    this.form = this.formBuilder.group({
      tencongviec: [, Validators.required],
      ngaybatdau: [],
      ngayketthuc: [],
      noidungcongviec: [],
      nguonphatsinh: [],
      douutien: [],
      noidung_binhluan: [],
    });
    console.log(this.data);
    this.get_bynguyenlieu();
    // this.get_chitietcongviec();
    // this.get_congviec_file();
    // this.get_congviec_nguoiphoihop();
    // this.get_congviec_donviphoihop();
    // this.get_congviec_binhluan();
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
  guitraodoi() {
    // this.noidung_thaoluan = this.f.noidung_binhluan.value;
    // if (this.noidung_thaoluan == "" || this.noidung_thaoluan == null) {
    //   return;
    // }

    // this.loading = true;
    // const formData = new FormData();
    // formData.append('file', this.filedinhkem);
    // formData.append('prmMA_CONGVIEC', this.data.ma_congviec);
    // formData.append('prmMA_NHANVIEN', this.Ma_nhanvien);
    // formData.append('prmNOIDUNG_THAOLUAN', this.noidung_thaoluan);
    // formData.append('prmNGUOI_CAPNHAT', this.UserName);
    // this.congviecPSService.thaoluan_ins_upload(formData)
    //   .subscribe({
    //     next: (_data) => {
    //       this.get_congviec_binhluan();
    //       // reset data
    //       this.form = this.formBuilder.group({
    //         noidung_binhluan: [],
    //       });
    //       this.filedinhkem_bl = '';
    //       this.send_data_realtime(this.data);
    //       this.toastr.success("Thêm mới bình luận thành công", "",
    //         {
    //           timeOut: 3000,
    //           closeButton: true,
    //           positionClass: 'toast-bottom-right'
    //         });

    //     },
    //     error: error => {
    //       this.toastr.error(error)
    //     }
    //   });


  }
  //Hiển thị dữ liệu text sang dạng edit
  showEditTitle(e) {
    var permision = true;
    // kiểm tra quyền
    // for (var i = 0; i < taskRole.length; i++) {
    // 	if (permissonTask['edit_content'][taskRole[i]]) {
    // 		permision = true;
    // 		break;
    // 	}
    // }
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
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    // var UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';
    // const model = {
    //     'ID': this.f.id.value,
    //     'MA_DANTOC':this.f.ma_dantoc.value,
    //     'TEN_DANTOC':this.f.ten_dantoc.value,
    //     'TEN_GOIKHAC': this.f.ten_goikhac.value,
    //     'TRANGTHAI': this.f.trangthai.value,
    //     'NGUOI_CAPNHAT':UserName
    // };

  }
  // đính kèm file
  attachfile(event) {
    if (event.target.files.length > 0) {
      this.filedinhkem_bl = event.target.files[0].name;
      this.filedinhkem = event.target.files[0];
    }
  }
  // xóa file
  deletefile() {
    this.filedinhkem_bl = '';
    this.filedinhkem = [];
  }
  closed() {
    this.event.emit(true);
    this.modalRef.hide();
  }

  // Chi tiết công việc
  get_chitietcongviec() {
    // this.congviecPSService.get_congviecchitiet(this.data.ma_congviec)
    //   .subscribe(
    //     _data => {
    //       this.donvichutri = _data[0].ten_dv;
    //       this.ten_nguoichutri = _data[0].ten_chutri;
    //       this.ten_nguoigiao = _data[0].ten_nguoigiao;
    //       this.ten_nguoigiamsat = _data[0].ten_nguoigiamsat;
    //       this.ngaygiao = _data[0].ngay_giao;
    //       this.tencongviec = _data[0].ten_cv;
    //       this.noidungthuchien = _data[0].noidung;
    //       this.sliderControl = new FormControl(_data[0].tile_hoanthanh);
    //       this.ngaybatdau = _data[0].ngay_batdau;
    //       this.ngayketthuc = _data[0].ngay_ketthuc;
    //       this.nguonphatsinh = _data[0].ten_ps;
    //       this.douutien = _data[0].tinh_chat;
    //       this.anh_chutri = _data[0].hinhanh_chutri;
    //       this.anh_nguoigiao = _data[0].hinhanh_nguoigiao;
    //       this.anh_nguoigiamsat = _data[0].hinhanh_giamsat;
    //       //this.ngayketthuc = this.ngayketthuc.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")

    //       //   this.form.patchValue({
    //       //     ngayketthuc: this.ngayketthuc,
    //       // });
    //       this.form = this.formBuilder.group({
    //         tencongviec: [this.tencongviec,],
    //         ngayketthuc: [this.ngayketthuc],
    //         ngaybatdau: [this.ngaybatdau],
    //         noidungcongviec: [this.noidungthuchien],
    //         nguonphatsinh: [this.nguonphatsinh],
    //         douutien: [this.douutien == '0' ? "Thường" : "Ưu tiên"],
    //         noidung_binhluan: ['']
    //       });
    //     }
    //   );
  }

  // lấy danh sách file đính kèm
  get_congviec_file() {
    this.congviecPSService.get_congviec_file_all(this.data.ma_congviec, this.data.nguon_phatsinh)
      .subscribe(
        _data => {
          this.danhsachfile = _data;
        }
      );
  }
  // get nguoi phoi hop
  get_congviec_nguoiphoihop() {
    this.congviecPSService.get_congviec_nguoiphoihop(this.data.ma_congviec)
      .subscribe(
        _data => {
          this.danhsachnguoiphoihop = _data;
        }
      );
  }

  // get donvi phoi hop
  get_congviec_donviphoihop() {
    this.congviecPSService.get_congviec_donviphoihop(this.data.ma_congviec)
      .subscribe(
        _data => {
          this.danhsachdonviphoihop = _data;
        }
      );
  }
  // get binh luan
  get_congviec_binhluan() {
    this.congviecPSService.get_thaoluan_bycongviec(this.data.ma_congviec)
      .subscribe(
        _data => {
          this.danhsachbinhluan = _data;
        }
      );
  }
  onChange(event) {
    console.log(event);
  }
  onChangetyle() {
    var ma_congviecDrag = this.data.ma_congviec;
    var nguoi_chutriDrag = this.data.nguoi_chutri;
    var trangthaiDrag = this.data.trangthai;
    var tylehoanthanh = Number(this.sliderControl.value);

    // chỉ người chủ trì mới thay đổi được tỷ của task
    if (nguoi_chutriDrag != this.Ma_nhanvien) {
      this.toastr.warning(
        'Chỉ được thay đổi trạng thái công việc anh/chị chủ trì',
        'Cảnh báo',
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right',
        }
      );
      this.sliderControl = new FormControl(this.data.tile_hoanthanh);
      return;
    } else {

      // xét tỷ lệ hoàn thành   
      if (tylehoanthanh < 100 && tylehoanthanh > 0) {
        trangthaiDrag = '1';
      }
      if (tylehoanthanh == 100) {
        trangthaiDrag = '2';
      }
      this.congviecPSService.up_trangthai(ma_congviecDrag, trangthaiDrag, this.sliderControl.value)
        .subscribe(
          _data => {
            //this.data = _data;
            this.send_data_realtime(this.data);
          }
        );
    }
  }
  // Gửi data realtime cho những người liên quan
  send_data_realtime(data_in) {
    this.congviecPSService.get_congviec_nguoiphoihop(data_in.ma_congviec)
      .subscribe(
        _data => {                  
           var prmnguoiphoidhop = '';
        _data.forEach(element => {
            prmnguoiphoidhop = prmnguoiphoidhop + element.ma_nv_ph + ',';
        });       

         prmnguoiphoidhop = prmnguoiphoidhop.substring(0, prmnguoiphoidhop.length - 1);         
         // gửi thông báo realtime
             var data={
              Type: 'Thông báo',
              Information: data_in.ten_cv,
              Id: data_in.nguoi_chutri + ',' + data_in.nguoi_giamsat + ',' + prmnguoiphoidhop,
              Nguoigui: this.Ma_nhanvien,
              Nguoichutri: data_in.nguoi_chutri,
              Nguoiphoihop: prmnguoiphoidhop,
              Nguoigiamsat: data_in.nguoi_giamsat
              
            }
        }
      );
  }

  // get nguoi phoi hop
  get_bynguyenlieu() {
    var model = {
      "ma_luong": this.data.ma_luong}
      ;    

    this.tr_NhapluongService.get_bynguyenlieu(model)
      .subscribe(
        _data => {
          console.log(_data);
          this.ct_vattus = _data;
        }
      );
  }
}