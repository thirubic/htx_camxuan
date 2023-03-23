import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormsModule } from '@angular/forms';
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
import { DonvitinhService } from "@app/_services/danhmuc/donvitinh.service";
import { NhapkhoService } from "@app/_services/danhmuc/nhapkho.service";
import { DuongService } from "@app/_services/danhmuc/a_duong.service";
import { LuongphanService } from "@app/_services/danhmuc/luongphan.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { NhapluongService } from "@app/_services/danhmuc/nhapluong.service";


@Component({
  selector: 'app-qlnhapluong-Edit',
  templateUrl: './edit_nhapluong.component.html'
})
export class Edit_NhapluongComponent implements OnInit {
  @Input() title: string;
  @Input() data: any;
  @Input() phanxuong: string;
  @Input() ma_duong: string;


  @Output() event = new EventEmitter<boolean>();
  form: FormGroup;
  loading = false;
  submitted = false;
  filepreview = '';
  p: number = 1;
  file: any = null;
  fileinput = '';
  fileattachs: any = [];
  danhsachfile: any = [];
  datavattu: any = [];
  dataduong: any = [];
  soluong_max = 0;
  datadonvitinh: any = [];
  dataxuong: any = [];
  datanguyenlieus: any = [];
  datakho: any = [];
  nhaptukho = 1;
  dataluongs: any = [];
  dataluong_khac: any = [];
  datasoluong: any = [];
  loai_vattu = 1;
  dataloaivattu = [{ "loaivt_id": 1, "ten_loaivt": "Vật tư phục vụ sản xuất" }, { "loaivt_id": 2, "ten_loaivt": "Nguyên liệu" }];
  datatinhtrang = [{ "ttcl_id": 1, "ten_ttcl": "Tốt" }, { "ttcl_id": 2, "ten_ttcl": "Hỏng" }, { "ttcl_id": 3, "ten_ttcl": "Sắp hết hạn sử dụng" }]
  maxuong_select = '';
  ma_duong_select = '';
  ma_luong_khac = '';
  soluong_luongkhac = '';
  donvi_tinh_luongkhac = '';
  ghichu_luongkhac= '';
  ma_kho_select = '';
  disabled = false;
  serviceBase = `${environment.apiURL}`;
  viewtrangthai = false;
  Ma_nhanvien = localStorage.getItem('Ma_nhanvien') ? localStorage.getItem('Ma_nhanvien') : sessionStorage.getItem('Ma_nhanvien') || '';
  UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';

  constructor(
    public modalRef: BsModalRef,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private khoService:KhoService,
    private xuongService: PhanxuongService,
    private luongphanService: LuongphanService,
    private duongService: DuongService,
    private nhapkhoService: NhapkhoService,
    private nhapluongService: NhapluongService,
    private donvitinhService: DonvitinhService
    
  ) { }

  html: string;


  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.get_danhsachxuong();
    this.getkho_byphanxuong();
    this.get_danhsachduong();
    this.getluong_trongduong();
    this.get_donvitinh();
    this.form = this.formBuilder.group({
        ma_xuong: [this.phanxuong],
        ma_duong: [this.ma_duong],
        ma_luong: [this.data.ma_luong],
        ghichu: [this.data.ghichu],
        ma_kho: [this.data.ghichu],
        ma_vattu: [this.data.ma_vattu],
        nhaptukho:[1],
        soluong:[0],
        donvi_tinh:[3],
        ma_luong_khac: [''],
        soluong_luongkhac:[0],
        donvi_tinh_luongkhac:['TAN'],
        ghichu_luongkhac:['']
    });
    this.f.ma_xuong.setValue(this.phanxuong)
    this.f.ma_duong.setValue(this.ma_duong)
    this.f.ma_kho.setValue(this.datakho[0].ma_kho);
    this.getvattu_bykho();
    
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
  onOptionSelected(event){
    if (event.target.checked && event.target.value === '1') {
      this.nhaptukho =1
    } else if (event.target.checked && event.target.value === '2') {
      this.nhaptukho =2
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
    if (this.f.nhaptukho.value == '1') {
      if (this.f.soluong.value == "" || this.f.soluong.value == null) {
        this.toastr.warning("Chưa nhập số lượng nguyên liệu cần nhập luống", "Cảnh báo",
          {
            timeOut: 3000,
            closeButton: true,
            positionClass: 'toast-bottom-right'
          });
        return;
      }
      const obj = {}
      const formData = {}
      obj['MA_LUONG'] = this.f.ma_luong.value;
      obj['MA_VT'] = this.f.ma_vattu.value;
      obj['SOLUONG'] = this.f.soluong.value;
      obj['DONVI_TINH'] = this.f.donvi_tinh.value;
      obj['GHICHU'] = this.f.ghichu.value;
      obj['NGUOI_CAP'] = this.UserName;
      formData['data'] = JSON.stringify(obj);
      try {
        this.nhapluongService.nhapnguyenlieu_tukho(formData)
          .subscribe({
            next: (_data) => {
              this.event.emit(true);
              this.toastr.success("Nhập nguyên liệu vào luống thành công", "",
                {
                  timeOut: 3000,
                  closeButton: true,
                  positionClass: 'toast-bottom-right'
                });
                this.getnguyenlieu_byluong(); 
            }
          });
      } catch (err) {
        this.toastr.error(err)
      }

    } else {
      if (this.f.soluong_luongkhac.value == "" || this.f.soluong_luongkhac.value == null) {
        this.toastr.warning("Chưa nhập số lượng nguyên liệu cần nhập luống", "Cảnh báo",
          {
            timeOut: 3000,
            closeButton: true,
            positionClass: 'toast-bottom-right'
          });
        return;
      }
      const obj = {}
      const formData = {}
      obj['MA_LUONG'] = this.f.ma_luong.value;
      obj['MA_LUONGKHAC'] = this.f.ma_luong_khac.value;
      obj['SOLUONG'] = this.f.soluong_luongkhac.value;
      obj['DONVI_TINH'] = this.f.donvi_tinh_luongkhac.value;
      obj['GHICHU'] = this.f.ghichu_luongkhac.value;
      obj['NGUOI_CAP'] = this.UserName;
      formData['data'] = JSON.stringify(obj);
      console.log(formData)
      this.nhapluongService.nhapnguyenlieu_tuluongkhac(formData)
        .subscribe({
          next: (_data) => {
            console.log(_data)
            this.event.emit(true);
            this.modalRef.hide();
            this.toastr.success("Cập nhật nguyên liệu từ luống khác thành công", "",
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
          console.log(_data)
        }
      );
  }
  change_kho(){
    this.getvattu_bykho()
  }
  change_vattu(){
    this.getsoluong_vattu();
  }
  getnguyenlieu_byluong() { 
    console.log(2343443545)
    return new Promise<any>((resolve) => {
      this.nhapluongService.get_nguyenlieu_byluong({"ma_luong":this.f.ma_luong.value})
        .subscribe(
          _data => {
            this.datanguyenlieus = _data;   
          }
        );
    })
  }
  getkho_byphanxuong() { 
    return new Promise<any>((resolve) => {
      this.khoService.get_byphanxuong({"ma_xuong":this.phanxuong})
        .subscribe(
          _data => {
            this.datakho = _data;   
          }
        );
    })
  }
  get_donvitinh(): void {
    this.donvitinhService.get_all()
        .subscribe(
            _data => {
                this.datadonvitinh = _data;
                this.f.donvi_tinh.setValue(_data[0].ma_dv_tinh)
            }
        );
  }
  getvattu_bykho() { 
    return new Promise<any>((resolve) => {
      this.nhapkhoService.get_bymakho({"ma_kho":this.f.ma_kho.value})
        .subscribe(
          _data => {
            this.datavattu = _data;  
            //this.f.ma_vattu.setValue(_data[0].ma_vattu) 
          }
        );
    })
  }
  get_danhsachduong(): void {
    this.duongService.get_byphanxuong({ma_xuong:this.phanxuong})
      .subscribe(
        _data => {
          this.dataduong = _data;
        }
      );
  }
  getluong_trongduong() { 
    return new Promise<any>((resolve) => {
      this.luongphanService.get_byduong({"ma_duong":this.ma_duong})
        .subscribe(
          _data => {
            this.dataluongs = _data; 
            this.getnguyenlieu_byluong();  
            this.dataluong_khac = this.dataluongs.filter((x) => x.ma_luong != this.f.ma_luong.value);
          }
        );
    })
  }
  change_luongkhac(){
    this.getkhoiluong_luong()
  }
  getkhoiluong_luong() { 
    return new Promise<any>((resolve) => {
      this.nhapluongService.get_khoiluong_byluong({"ma_luong":this.f.ma_luong_khac.value})
        .subscribe(
          _data => { 
            this.f.soluong_luongkhac.setValue(_data[0].soluong);
          }
        );
    })
  }
  getsoluong_vattu() { 
    return new Promise<any>((resolve) => {
      this.nhapluongService.getsoluong({"ma_kho":this.f.ma_kho.value,"ma_vattu":this.f.ma_vattu.value})
        .subscribe(
          _data => {
            this.datasoluong = _data; 
            this.f.soluong.setValue(_data[0].soluong);
            this.soluong_max = _data[0].soluong;
            this.f.donvi_tinh.setValue(_data[0].donvi_tinh);
          }
        );
    })
  }
}
