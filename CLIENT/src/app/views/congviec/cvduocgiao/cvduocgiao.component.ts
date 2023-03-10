import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from '@app/_services';
import { CardSettingsModel, SwimlaneSettingsModel, DialogSettingsModel, DialogEventArgs, DragEventArgs } from '@syncfusion/ej2-angular-kanban';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Ins_cvduocgiaoComponent } from './ins_cvduocgiao.component';
import { View_cvcuatoiComponent } from '../cuatoi/view_cvcuatoi.component';
import { Options } from '@angular-slider/ngx-slider';
import { CongviecphatsinhService } from '@app/_services/congviec/congviecphatsinh.service';
import { ToastrService } from "ngx-toastr";
import { environment } from '@environments/environment';
import { RealtimeService } from '@app/_services/realtime.service';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-congviecduocgiao',
  templateUrl: './cvduocgiao.component.html',
  styleUrls: ['./cvduocgiao.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CvduocgiaoComponent {

  constructor(
    // private dashboardService: DashboardService
    private modalService: BsModalService,
    private congviecPSService: CongviecphatsinhService,
    private toastr: ToastrService,
    private realtimeService: RealtimeService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  macongviec_input = '';
  Ma_nhanvien = localStorage.getItem('Ma_nhanvien') ? localStorage.getItem('Ma_nhanvien') : sessionStorage.getItem('Ma_nhanvien') || '';
  UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';
  serviceBase = `${environment.apiURL}`;
  ngaybatdau_tk = '';
  ngayketthuc_tk = '';

  ds_list_moi: any = [];
  ds_list_choxl: any = [];
  dang_xuli: number = 0;
  moi_tiepnhan: number = 0;
  xuli_dunghan: number = 0;
  xuli_trehan: number = 0;
  modalRef: BsModalRef;
  hide_title = true;

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


  public data: any[] = [    
  ];
  public data_search: any[] = [

  ];
  public cardSettings: CardSettingsModel = {
    contentField: 'noidung',
    headerField: 'ma_congviec',
    showHeader: true
  };
  public swimlaneSettings: SwimlaneSettingsModel = {
    keyField: '',
  };
  dialogOpen(args: DialogEventArgs): void {
    args.cancel = true;
    console.log(args);
    this.editcard(args.data);
  }
  viewbyboard() {
    this.swimlaneSettings = {
      keyField: '',
    };
  }

  viewbynhansu() {
    this.swimlaneSettings = {
      keyField: 'ngay_batdau',
      textField: 'ngay_batdau'
    };
  }

  ins_cvcuatoi() {
    const initialState = { title: "Th??m m???i c??ng vi???c", data: null };
    this.hide_title = false;
    console.log("th??m c??ng vi???c");
    this.modalRef = this.modalService.show(
      Ins_cvduocgiaoComponent,
      Object.assign({}, {
        animated: true, keyboard: false, backdrop: false, ignoreBackdropClick: true
      }, {
        class: 'modal-lg xlg', initialState
      }));

    this.modalRef.content.event
      .subscribe(arg => {
        if (arg) {
          //this.get_all();
          this.hide_title = true;
          console.log(this.hide_title);
        }
      });
  }
  editcard(data) {
    const initialState = { title: "Chi ti???t c??ng vi???c", data: data };
    this.hide_title = false;
    this.modalRef = this.modalService.show(
      View_cvcuatoiComponent,
      Object.assign({}, {
        animated: true, keyboard: false, backdrop: false, ignoreBackdropClick: true
      }, {
        class: 'modal-lg xlg', initialState
      }));

    this.modalRef.content.event
      .subscribe(arg => {
        if (arg) {
          this.macongviec_input = '';
          this.get_danhsachcongviecchutri();
          this.hide_title = true;          
        }
      });


  }
  public Delete(key) {
    console.log(key);
  }
  deleteCard(data) {
    console.log('delete');
    console.log(data);
  }
  onKanbanBDragStop(args: DragEventArgs) {
    console.log(args.data[0]);
    var ma_congviecDrag = args.data[0].ma_congviec;
    var nguoi_chutriDrag = args.data[0].nguoi_chutri;
    var trangthaiDrag = args.data[0].keyfield;
    var tylehoanthanh = Number(args.data[0].tile_hoanthanh);
    if (trangthaiDrag =='2' && tylehoanthanh < 100) {
      this.get_danhsachcongviecchutri();
      this.toastr.warning(
        'T??? l??? ho??n th??nh nh??? h??n 100 n??n kh??ng th??? chuy???n tr???ng th??i c???a c??ng vi???c sang ho??n th??nh' ,
        'C???nh b??o',
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right',
        }
      );      
      return;
    }

    if (nguoi_chutriDrag != this.Ma_nhanvien) {
      this.toastr.warning(
        'Ch??? ???????c thay ?????i tr???ng th??i c??ng vi???c anh/ch??? ch??? tr??',
        'C???nh b??o',
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right',
        }
      );
      this.get_danhsachcongviecchutri();
      return;
    }else{
      this.congviecPSService.up_trangthai(ma_congviecDrag, trangthaiDrag, args.data[0].tile_hoanthanh)
      .subscribe(
        _data => {
          this.data = _data;
          this.data_search = _data;
        }
      );
    }
  };
  // public swimlaneSettings: SwimlaneSettingsModel = { keyField: 'Assignee' };
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.macongviec_input = params.get('id')
    })
    this.get_danhsachcongviecchutri();
    this.connect_realtime();
  }
  // l???y danh s??ch c??ng vi???c chu tri
  get_danhsachcongviecchutri() {
    this.congviecPSService.get_congviecchutri(this.Ma_nhanvien)
      .subscribe(
        _data => {
          this.data = _data;
          this.data_search = _data;
          if(this.macongviec_input != '' && this.macongviec_input != null){            
            var congviecview = this.data.filter((x) => x.ma_congviec == this.macongviec_input);
            if (congviecview.length > 0) {
              this.editcard(congviecview[0]);
            }
          }
        }
      );
  }
  timkiemcongviec_bydate() {
    if(this.ngaybatdau_tk == '' || this.ngayketthuc_tk == ''){
      this.toastr.warning(
        'Vui l??ng ch???n ng??y',
        'C???nh b??o',
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right',
        }
      );
      return;
    }
    if(this.ngaybatdau_tk > this.ngayketthuc_tk){
      this.toastr.warning(
        'Ng??y b???t ?????u ph???i nh??? h??n ng??y k???t th??c',
        'C???nh b??o',
        {
          timeOut: 3000,
          closeButton: true,
          positionClass: 'toast-bottom-right',
        }
      );
      return;
    }
    this.congviecPSService.get_congviec_bydate(this.Ma_nhanvien, '2', this.ngaybatdau_tk, this.ngayketthuc_tk)
      .subscribe(
        _data => {
          this.data = _data;
          this.data_search = _data;
        }
      );
  }
  // realtime
  connect_realtime(): void {    
    //this.realtimeService.connect_realtime(this.UserName);   
    try{
    this.realtimeService._hubConnection.on('Congviec_phatsinh', (message)=>{
      console.log(message);
      this.get_danhsachcongviecchutri();
      //this.getConnectionId();
    })
  } catch (e) {
    //console.log("L???i");
    this.router.navigate(['/']);
  }
  }
  onSearchChange(event){    
    if(event == '' || event == null){
     this.data = this.data_search;
    }else{
    this.data = this.data_search.filter((x) => x.ten_cv.toUpperCase().includes(event.toUpperCase()));
    }
   }
}
