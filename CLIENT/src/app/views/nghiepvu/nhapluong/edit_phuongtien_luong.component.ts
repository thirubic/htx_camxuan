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
import { Tr_phuongtienService } from "@app/_services/danhmuc/Tr_phuongtien.service";
import { DonvitinhService } from "@app/_services/danhmuc/donvitinh.service";
import { NhapkhoService } from "@app/_services/danhmuc/nhapkho.service";
import { DuongService } from "@app/_services/danhmuc/a_duong.service";
import { LuongphanService } from "@app/_services/danhmuc/luongphan.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { NhapluongService } from "@app/_services/danhmuc/nhapluong.service";


@Component({
  selector: 'app-qlphuongtien_luong-Edit',
  templateUrl: './edit_phuongtien_luong.component.html'
})
export class Edit_Phuongtien_luongComponent implements OnInit {
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
  data_pt_in_luongs: any = [];
  datakho: any = [];
  nhaptukho = 1;
  dataluongs: any = [];
  dataphuongtiens: any = [];
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
    private donvitinhService: DonvitinhService,
    private phuongtienService: Tr_phuongtienService,    
    private confirmService: ConfirmService,
    
  ) { }

  html: string;


  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.get_danhsachxuong();
    this.get_danhsachduong();
    this.getluong_trongduong();
    this.getphuongtien();
    this.getphuongtien_byluong();
    this.form = this.formBuilder.group({
        ma_xuong: [this.phanxuong],
        ma_duong: [this.ma_duong],
        ma_luong: [this.data.ma_luong],
        ghichu: [this.data.ghichu],
        ma_pt: ['']
    });
    this.f.ma_xuong.setValue(this.phanxuong);
    this.f.ma_duong.setValue(this.ma_duong);
    
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
      if (this.f.ma_pt.value == "" || this.f.ma_pt.value == null) {
        this.toastr.warning("Chưa chọn phương tiện vận chuyển", "Cảnh báo",
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
      obj['MA_PT'] = this.f.ma_pt.value;
      obj['GHICHU'] = this.f.ghichu.value;
      obj['NGUOI_CAP'] = this.UserName;
      formData['data'] = JSON.stringify(obj);
      try {
        this.phuongtienService.phuongtien_add(formData)
          .subscribe({
            next: (_data) => {
              this.getphuongtien_byluong();
              this.event.emit(true);
              this.toastr.success("Thêm phương tiện vận chuyển thành công", "",
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
  getphuongtien_byluong() { 
    return new Promise<any>((resolve) => {
      this.phuongtienService.get_byluong({"ma_luong": this.data.ma_luong})
        .subscribe(
          _data => {
            console.log(_data);
            this.data_pt_in_luongs = _data;   
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
            //this.getnguyenlieu_byluong();  
            this.dataluong_khac = this.dataluongs.filter((x) => x.ma_luong != this.f.ma_luong.value);
          }
        );
    })
  }
  getphuongtien() { 
    return new Promise<any>((resolve) => {
      this.phuongtienService.get_all()
        .subscribe(
          _data => {
            console.log(_data);
            this.dataphuongtiens = _data;
          }
        );
    })
  }
  deletephuongtien(datadel){
    let options = {
      prompt: 'Bạn có muốn xóa phương tiện [' + datadel.ten_pt + '] này không?',
      title: "Thông báo",
      okText: `Đồng ý`,
      cancelText: `Hủy`,
    };

    this.confirmService.confirm(options).then((res: boolean) => {
      if (res) {
        let input = {
          "id": datadel.id
        };
        this.phuongtienService.phuongtien_del(input).subscribe({
          next: (_data) => {
            this.toastr.success("Xóa thành công", 'Thông báo', {
              timeOut: 3000,
              closeButton: true,
              positionClass: 'toast-bottom-right',
            });
            this.getphuongtien_byluong();
          },
          error: (error) => {
            this.toastr.error(error);
          },
        });
      }
    });
  }
}
