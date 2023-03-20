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
  file: any = null;
  fileinput = '';
  fileattachs: any = [];
  danhsachfile: any = [];
  datavattu: any = [];
  dataduongs: any = [];
  datadonvitinh: any = [];
  dataxuong: any = [];
  datakho: any = [];
  nhaptukho = 1;
  dataluongs: any = [];
  loai_vattu = 1;
  dataloaivattu = [{ "loaivt_id": 1, "ten_loaivt": "Vật tư phục vụ sản xuất" }, { "loaivt_id": 2, "ten_loaivt": "Nguyên liệu" }];
  datatinhtrang = [{ "ttcl_id": 1, "ten_ttcl": "Tốt" }, { "ttcl_id": 2, "ten_ttcl": "Hỏng" }, { "ttcl_id": 3, "ten_ttcl": "Sắp hết hạn sử dụng" }]
  maxuong_select = '';
  ma_duong_select = '';
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
        donvi_tinh:[1]
    });
    this.f.ma_xuong.setValue(this.phanxuong)
    this.f.ma_duong.setValue(this.ma_duong)
    this.f.ma_kho.setValue(this.datakho[0].ma_kho);
    this.getvattu_bykho()
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
      this.nhaptukho = 1
    } else if (event.target.checked && event.target.value === '2') {
      this.nhaptukho = 2
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
    if (this.f.soluong.value == "" || this.f.soluong.value == null) {
      this.toastr.warning("Chưa nhập mã kho", "Cảnh báo",
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
    obj['MA_VATTU'] = this.f.ma_vattu.value;
    obj['SOLUONG'] = this.f.soluong.value;
    obj['DONVI_TINH'] = this.f.donvi_tinh.value;
    obj['TINHTRANG_CHATLUONG'] = this.f.tinhtrang_chatluong.value;
    obj['GHICHU'] = this.f.ghichu.value;
    obj['NGUOI_CAPNHAT'] = this.UserName;
    formData['data'] = JSON.stringify(obj);
    if (this.data == '0') {
      try {
        this.nhapkhoService.nhapkho(formData)
          .subscribe({
            next: (_data) => {
              this.event.emit(true);
              this.modalRef.hide();
              this.toastr.success("Nhập vật tư vào kho thành công", "",
                {
                  timeOut: 3000,
                  closeButton: true,
                  positionClass: 'toast-bottom-right'
                });
            }
          });
      } catch (err) {
        this.toastr.error(err)
      }

    } else {
      this.nhapkhoService.nhapkho(formData)
        .subscribe({
          next: (_data) => {
            console.log(_data)
            this.event.emit(true);
            this.modalRef.hide();
            this.toastr.success("Cập nhật vật tư kho thành công", "",
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
          this.dataduongs = _data;
        }
      );
  }
  getluong_trongduong() { 
    return new Promise<any>((resolve) => {
      this.luongphanService.get_byduong({"ma_duong":this.ma_duong})
        .subscribe(
          _data => {
            this.dataluongs = _data;    
          }
        );
    })
  }
}
