import { Component, ViewEncapsulation, Input} from '@angular/core';
import { AuthService } from '@app/_services';
import { CardSettingsModel, SwimlaneSettingsModel, DialogEventArgs, DragEventArgs } from '@syncfusion/ej2-angular-kanban';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { Ins_gsluongComponent } from './ins_gsluongi.component';
import { View_ctluongComponent } from './view_ctluong.component';
import { Options } from '@angular-slider/ngx-slider';
import { CongviecphatsinhService } from '@app/_services/congviec/congviecphatsinh.service';
import { environment } from '@environments/environment';
import { ToastrService } from "ngx-toastr";
import { ConfirmService } from '@app/_modules/confirm/confirm.service';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';
//
import { PhanxuongService } from "@app/_services/danhmuc/phanxuong.service";
import { NhapluongService } from '@app/_services/danhmuc/nhapluong.service';
import { DuongService } from '@app/_services/danhmuc/a_duong.service';
import { LuongphanService } from '@app/_services/danhmuc/luongphan.service';
import { GiamsatluongService } from '@app/_services/danhmuc/giamsatluong.service';
import { Chonvitri_ctluongComponent } from './chonvitri.component';
import { TuyenduongService } from '@app/_services/danhmuc/tuyenduong.service';

@Component({
  selector: 'app-gsluong',
  templateUrl: './gsluong.component.html',
  styleUrls: ['./gsluong.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GsluongComponent {
  @Input() data_input: any;
  constructor(
    // private dashboardService: DashboardService
    private modalService: BsModalService,
    private congviecPSService: CongviecphatsinhService,
    private toastr: ToastrService,
    private confirmService: ConfirmService,
    private router: Router,
    private route: ActivatedRoute,
    private xuongService: PhanxuongService,
    private duongService: DuongService,
    private luongphanService: LuongphanService,
    private giamsatluongService: GiamsatluongService,
    private tuyenduongService: TuyenduongService,
  ) { }  
  macongviec_input = '';
  myParam: any;
  serviceBase = `${environment.apiURL}`;
  ds_list_moi: any = [];
  vitris: any = [];
  ds_list_choxl: any = [];
  dang_xuli: number = 0;
  vitri = 0;
  moi_tiepnhan: number = 0;
  xuli_dunghan: number = 0;
  xuli_trehan: number = 0;
  modalRef: BsModalRef;
  hide_title = true;
  group = {
    keyField: 'lan_xuly',
    text: 'Lần xử lý'
  }
  thu:'thu';
  content = false;
  ma_xuong_select = '';
  ma_duong_select: '';
  dataluongs = []; 
  vitris_all= []; 
  ma_xuong_user = localStorage.getItem('Ma_donvi') ? localStorage.getItem('Ma_donvi') : sessionStorage.getItem('Ma_donvi') || '';
  dataxuong = [];
  dataduong = [];


  totalItems = 0;
  term : string = '';
  p: number = 1;

  options: Options = {
    floor: 0,
    ceil: 100,
    step: 10,
    showTicks: true,
    disabled: true,
    translate: (value: number): string => {
      return value + '%';
    }
  };

  Ma_nhanvien = localStorage.getItem('Ma_nhanvien') ? localStorage.getItem('Ma_nhanvien') : sessionStorage.getItem('Ma_nhanvien') || '';
  UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';
  ngaybatdau_tk = '';
  ngayketthuc_tk = '';

  public data: any[] = [

  ];

  public data_search: any[] = [

  ];
  public swimlaneSettings: SwimlaneSettingsModel = { keyField: 'ten_loaiphan',textField:'loai_luongphan',template: '#swimlaneSettingsTemplate' };
  public cardSettings: CardSettingsModel = {
    contentField: 'mota',
    headerField: 'ma_luong',
    showHeader: false,
  };
  dialogOpen(args: DialogEventArgs): void { 
    args.cancel = true;
  }

  

  EnableDropdown(){
    this.content = !this.content
  }
  editcard(data) {
    const initialState = { title: "Chi tiết: " + data.ten_luong, data: data };
    this.hide_title = false;
    this.modalRef = this.modalService.show(
      View_ctluongComponent,
      Object.assign({}, {
        animated: true, keyboard: false, backdrop: false, ignoreBackdropClick: true
      }, {
        class: 'modal-lg xlg', initialState
      }));
      
    this.modalRef.content.event
      .subscribe(arg => {
        if (arg) {
          this.hide_title = true;
        }
      });
  }
  public Delete(key) {
    console.log(key);
  }
  // get nguoi phoi hop
  get_vitri_theoduong_all(ma_duong) { 
    return new Promise<any>((resolve) => {
      this.tuyenduongService.getbyma(ma_duong)
        .subscribe(
          _data => {
            this.vitris_all = _data
            console.log(this.vitris_all)
          }
        );
      })
  }
   // get nguoi phoi hop
   get_vitri_theoduong(ma_duong) { 
    return new Promise<any>((resolve) => {
      this.tuyenduongService.getbyma(ma_duong)
        .subscribe(
          _data => {
            this.vitris = _data.filter(x=> x.vitri != 1 && x.vitri != 8);     
          }
        );
    })
  }
  
  onKanbanBDragStop(args: DragEventArgs) {
    var ma_luong = args.data[0].ma_luong;    
    var trangthai = args.data[0].keyfield; 
    var ma_duong = args.data[0].ma_duong; 
    var vitri_cu = args.data[0].vitri; 
     
    if(trangthai == 2){
       this.get_vitri_theoduong(ma_duong)
      const initialState = { title:" Chọn vị trí chuyển", data:args.data[0] ,vitri: 0};
      this.hide_title = false;
      this.modalRef = this.modalService.show(
        Chonvitri_ctluongComponent,
        Object.assign({}, {
          animated: true, keyboard: false, backdrop: false, ignoreBackdropClick: true
        }, {
          class: 'modal-lg xlg', initialState
        }));
        
      this.modalRef.content.event
        .subscribe(arg => {
          if (arg) {
            this.vitri = arg
            this.hide_title = true;
            const obj = {}
            var model = {
              "ma_luong": ma_luong,
              "vitri_moi": this.vitri,
              "vitri_cu": vitri_cu,
              "trangthai": trangthai,
              "nguoi_capnhat": this.UserName,
            }
              ;    

            this.giamsatluongService.capnhatrangthai(model)
            .subscribe({
              next: (_data) => {
                this.getluong_trongduong();
              },
              error: error => {
                this.toastr.error(error)
              }
            });
          }
        });
    }else{
      
      if(trangthai==3){
        this.vitri = this.vitris_all.find(x => x.vitri == "8").id
      }else{
        this.vitri = this.vitris_all.find(x => x.vitri == "1").id
      }

      const obj = {}
      var model = {
        "ma_luong": ma_luong,
        "vitri_moi": this.vitri,
        "vitri_cu": vitri_cu,
        "trangthai": trangthai,
        "nguoi_capnhat": this.UserName,
      }
        ;    

      this.giamsatluongService.capnhatrangthai(model)
        .subscribe({
          next: (_data) => {
            this.getluong_trongduong();
          },
          error: error => {
            this.toastr.error(error)
          }
        });
    }
  };
  ngOnInit(): void {
    this.ma_xuong_select = this.ma_xuong_user;
    
    this.get_danhsachxuong();
    this.getluong_trongduong();
    
  }

  timkiemcongviec_bydate() {
    if (this.ngaybatdau_tk == '' || this.ngayketthuc_tk == '') {
      this.toastr.warning(
        'Vui lòng chọn ngày',
        'Cảnh báo',
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right',
        }
      );
      return;
    }
    if (this.ngaybatdau_tk > this.ngayketthuc_tk) {
      this.toastr.warning(
        'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
        'Cảnh báo',
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right',
        }
      );
      return;
    }
    this.congviecPSService.get_congviec_bydate(this.Ma_nhanvien, '1', this.ngaybatdau_tk, this.ngayketthuc_tk)
      .subscribe(
        _data => {
          this.data = _data;
          this.data_search = _data;
        }
      );
  }
  onSearchChange(event) {
    if (event == '' || event == null) {
      this.data = this.data_search;
    } else {
      this.data = this.data_search.filter((x) => x.ten_cv.toUpperCase().includes(event.toUpperCase()));
    }
  }
  get_danhsachxuong(): void {
    this.xuongService.get_all()
        .subscribe(
            _data => {
                this.dataxuong = _data;
                this.getduong_byphanxuong()
            }
        );
  }
  getduong_byphanxuong() { 
    return new Promise<any>((resolve) => {
      this.duongService.get_byphanxuong({"ma_xuong":this.ma_xuong_select})
        .subscribe(
          _data => {
            this.dataduong = _data;     
            this.dataduong.push({"ma_duong":"0","ten_duong": "Tất cả"})      
            this.totalItems = _data.length;
            this.p = 1;
            this.ma_duong_select = _data.find(x => x.ma_duong == '0').ma_duong;
            this.get_vitri_theoduong_all(this.ma_duong_select)
            this.getluong_trongduong()
          }
        );
    })
  }
  change_xuong(){
    this.getduong_byphanxuong()
  }
  change_duong(){
    this.getluong_trongduong();
    this.get_vitri_theoduong_all(this.ma_duong_select)
  }
  
  getluong_trongduong() { 
    return new Promise<any>((resolve) => {
      this.luongphanService.get_byduong({"ma_duong":this.ma_duong_select})
        .subscribe(
          _data => {

            this.data = [];
            _data.forEach(element => {
              if (element.keyfield == 1) {
                element.keyfield = '1';
              }
              if (element.keyfield == 2) {
                element.keyfield = '2';
              }
              if (element.keyfield == 3) {
                element.keyfield = '3';
              }
              this.data.push(element);
            }
              );
          }
        );
    })
  }
 
}
