import { Component, ViewEncapsulation, Input} from '@angular/core';
import { AuthService } from '@app/_services';
import { CardSettingsModel, SwimlaneSettingsModel, DialogSettingsModel, DialogEventArgs, DragEventArgs } from '@syncfusion/ej2-angular-kanban';
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
  ) { }  
  macongviec_input = '';
  myParam: any;
  serviceBase = `${environment.apiURL}`;
  ds_list_moi: any = [];
  ds_list_choxl: any = [];
  dang_xuli: number = 0;
  moi_tiepnhan: number = 0;
  xuli_dunghan: number = 0;
  xuli_trehan: number = 0;
  modalRef: BsModalRef;
  hide_title = true;
  content = false;
  ma_xuong_select = '';
  ma_duong_select: '';
  dataluongs = []; 
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
  public cardSettings: CardSettingsModel = {
    contentField: 'mota',
    headerField: 'ma_luong',
    showHeader: false,
    noCardsMessage: "Không có thẻ để hiển thị"
  };
  public swimlaneSettings: SwimlaneSettingsModel = {
    keyField: '',
  };
  dialogOpen(args: DialogEventArgs): void {
    args.cancel = true;
    this.View_detail(args.data);
  }
  viewbyboard() {
    this.swimlaneSettings = {
      keyField: '',
    };
    console.log('Assignee');
  }

  viewbynhansu() {
    this.swimlaneSettings = {
      keyField: 'ngay_batdau',
      textField: 'ngay_batdau'
    };
  }

  ins_cvcuatoi() {
    // const initialState = { title: "Thêm mới công việc", data: null };
    // this.hide_title = false;
    // this.modalRef = this.modalService.show(
    //   Ins_gsluongComponent,
    //   Object.assign({}, {
    //     animated: true, keyboard: false, backdrop: false, ignoreBackdropClick: true
    //   }, {
    //     class: 'modal-lg xlg', initialState
    //   }));

    // this.modalRef.content.event
    //   .subscribe(arg => {
    //     if (arg) {
    //       this.get_danhsachcongviecgiao();
    //       this.hide_title = true;
    //     }
    //   });
  }
  View_detail(data) {
    // const initialState = { title: "Chi tiết công việc", data: data };
    // this.hide_title = false;
    // this.modalRef = this.modalService.show(
    //   View_GsluongComponent,
    //   Object.assign({}, {
    //     animated: true, keyboard: false, backdrop: false, ignoreBackdropClick: true
    //   }, {
    //     class: 'modal-lg xlg', initialState
    //   }));

    // this.modalRef.content.event
    //   .subscribe(arg => {
    //     if (arg) {
    //       this.macongviec_input = '';
    //       this.get_danhsachcongviecgiao();
    //       this.hide_title = true;

    //     }
    //   });


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
          this.get_danhsachcongviecgiao();
          this.hide_title = true;
        }
      });
  }
  public Delete(key) {
    console.log(key);
  }
  deleteCard(datain) {
    if (datain.trangthai == 2) {
      this.toastr.warning(
        'Công việc đã hoàn thành không thể xóa',
        'Cảnh báo',
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right',
        }
      );
      return;
    }
    let options = {
      prompt: 'Bạn có muốn xóa công việc [' + datain.ten_cv + '] này không?',
      title: "Thông báo",
      okText: `Đồng ý`,
      cancelText: `Hủy`,
    };

    this.confirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.congviecPSService.Del(datain.ma_congviec).subscribe({
          next: (_data) => {
            this.toastr.success("Xóa thành công", 'Thông báo', {
              timeOut: 3000,
              closeButton: true,
              positionClass: 'toast-bottom-right',
            });
            this.get_danhsachcongviecgiao();
                
          },
          error: (error) => {
            this.toastr.error(error);
          },
        });
      }
    });

  }
  onKanbanBDragStop(args: DragEventArgs) {
    var ma_luong = args.data[0].ma_luong;    
    var trangthai = args.data[0].keyfield;    
    // if (nguoi_chutriDrag != this.Ma_nhanvien) {
    //   this.get_danhsachcongviecgiao();
    //   this.toastr.warning(
    //     'Chỉ được thay đổi trạng thái công việc anh/chị chủ trì',
    //     'Cảnh báo',
    //     {
    //       timeOut: 3000,
    //       closeButton: true,
    //       positionClass: 'toast-bottom-right',
    //     }
    //   );
    //   return;
    // }
    // if (trangthaiDrag == '2' && tylehoanthanh < 100) {
    //   this.get_danhsachcongviecgiao();
    //   this.toastr.warning(
    //     'Tỷ lệ hoàn thành nhỏ hơn 100 nên không thể chuyển trạng thái của công việc sang hoàn thành',
    //     'Cảnh báo',
    //     {
    //       timeOut: 3000,
    //       closeButton: true,
    //       positionClass: 'toast-bottom-right',
    //     }
    //   );
    //   return;
    // }

    const obj = {}
    var model = {
      "ma_luong": ma_luong,
      "trangthai": trangthai,
      "nguoi_capnhat": this.UserName,
    }
      ;    

    this.giamsatluongService.capnhatrangthai(model)
      .subscribe(
        _data => {
          this.getluong_trongduong();
        }
      );

  };
  // public swimlaneSettings: SwimlaneSettingsModel = { keyField: 'Assignee' };
  ngOnInit(): void {
    // this.route.paramMap.subscribe((params: ParamMap) => {
    //   this.macongviec_input = params.get('id')
    // })
    //this.get_danhsachcongviecgiao(); 
    this.ma_xuong_select = this.ma_xuong_user;
    console.log(this.ma_xuong_select);
    this.get_danhsachxuong();
    this.getduong_byphanxuong();
    this.getluong_trongduong();
    
  }

  // lấy danh sách công việc giao
  get_danhsachcongviecgiao() {
    this.congviecPSService.get_congviecgiao(this.Ma_nhanvien, this.UserName)
      .subscribe(
        _data => {
          this.data = _data;
          this.data_search = _data;
          if(this.macongviec_input != '' && this.macongviec_input != null){            
            var congviecview = this.data.filter((x) => x.ma_congviec == this.macongviec_input);
            if (congviecview.length > 0) {
              this.View_detail(congviecview[0]);
            }
          }
        }
      );
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
            this.totalItems = _data.length;
            this.p = 1;
            this.ma_duong_select = _data[0].ma_duong;
            this.getluong_trongduong()
          }
        );
    })
  }
  change_xuong(){
    this.getduong_byphanxuong()
  }
  change_duong(){
    this.getluong_trongduong()
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
            console.log(this.data);   
            //     this.totalItems = _data.length;
            // this.p = 1;
          }
        );
    })
  }
 
}
