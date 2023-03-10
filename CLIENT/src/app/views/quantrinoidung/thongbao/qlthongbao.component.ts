import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from '@app/_services';
import { CardSettingsModel, SwimlaneSettingsModel, DialogSettingsModel, DialogEventArgs, DragEventArgs  } from '@syncfusion/ej2-angular-kanban';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {Ins_qlthongbaoComponent  } from './ins_qlthongbao.component';
import {View_qlthongbaoComponent  } from './view_qlthongbao.component';
import {Edit_qlthongbaoComponent  } from './edit_qlthongbao.component';
import { QuantrinoidungService } from '@app/_services/quantri/quantrinoidung.service';
import { environment } from '@environments/environment';
import { ConfirmService } from '@app/_modules/confirm/confirm.service';
import { ToastrService } from "ngx-toastr";
import { HttpClient, HttpUrlEncodingCodec } from '@angular/common/http';
// module realtime
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

import { RealtimeService } from '@app/_services/realtime.service';
@Component({
  selector: 'app-qlthongbao',
  templateUrl: './qlthongbao.component.html',
  styleUrls: ['./qlthongbao.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class QlthongbaoComponent {
  constructor(
    // private dashboardService: DashboardService
    private modalService: BsModalService,
    private quantriService: QuantrinoidungService,
    private confirmService: ConfirmService,
    private toastr: ToastrService,
    private http: HttpClient,
    private realtimeService: RealtimeService
  ) { }
  public allowDragAndDrop: Boolean = false;

  Ma_nhanvien = localStorage.getItem('Ma_nhanvien') ? localStorage.getItem('Ma_nhanvien') : sessionStorage.getItem('Ma_nhanvien') || '';
  UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';
  serviceBase = `${environment.apiURL}`;
  serviceurl_realtime = `${environment.apiURL_Realtime}`;
  private _hubConnection: HubConnection;
  public connectionId: string;

  ds_list_moi: any = [];
  ds_list_choxl: any = [];
  dang_xuli: number = 0;
  moi_tiepnhan: number = 0;
  xuli_dunghan: number = 0;
  xuli_trehan: number = 0;
  modalRef: BsModalRef;
  hide_title = true;
  thongbaos : any = [];

  public data: Object[] = [
    
];
  public cardSettings: CardSettingsModel = {
      contentField: 'ma_tb',
      headerField: 'ma_tb',
      showHeader: true
  };
  public swimlaneSettings: SwimlaneSettingsModel = { 
   keyField: '',
   textField: 'ngay_dang',
   sortDirection: 'Descending',    
   };
  dialogOpen(args: DialogEventArgs): void {
    args.cancel = true;
    this.editcard(args.data);
}
viewbyboard(){
   this.swimlaneSettings = { 
    keyField: '',
    textField: 'ngay_dang',
   sortDirection: 'Descending',
   };
}
viewbydate(){
  this.swimlaneSettings = { 
   keyField: 'ngay_dang',
   textField: 'ngay_dang',
   sortDirection: 'Descending',
  };
}
ins_thongbao() {     
   const initialState = {title: "Th??m m???i th??ng b??o", data: null };
   this.hide_title = false;   
   this.modalRef = this.modalService.show(
    Ins_qlthongbaoComponent,
     Object.assign({}, {
       animated: true, keyboard: false, backdrop: false, ignoreBackdropClick: true
     }, {
       class: 'modal-lg xlg', initialState
     }));

   this.modalRef.content.event
     .subscribe(arg => {
       if (arg) {
         this.get_all();
         this.hide_title = true;
       }
     });
 }
  editcard(data) {
    const initialState = { title: "Ch???nh s???a th??ng b??o", data: data };
    this.hide_title = false;
    this.modalRef = this.modalService.show(
      Edit_qlthongbaoComponent,
      Object.assign({}, {
        animated: true, keyboard: false, backdrop: false, ignoreBackdropClick: true
      }, {
        class: 'modal-lg xlg', initialState
      }));

    this.modalRef.content.event
      .subscribe(arg => {
        if (arg) {
          this.get_all();
          this.hide_title = true;
        }
      });


  }
  public Delete(key)
{
  console.log(key);
}
deletecard(data){
  let options = {
    prompt: 'B???n c?? mu???n x??a th??ng b??o [' + data.tieude + '] n??y kh??ng?',
    title: "Th??ng b??o",
    okText: `?????ng ??`,
    cancelText: `H???y`,
  };

  this.confirmService.confirm(options).then((res: boolean) => {
    if (res) {
      this.quantriService.delete_thongbao(data.ma_tb, "admin").subscribe({
        next: (_data) => {
          this.toastr.success("X??a th??nh c??ng", 'Th??ng b??o', {
            timeOut: 3000,
            closeButton: true,
            positionClass: 'toast-bottom-right',
          });
          this.get_all();
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
    }
  });  
}
onKanbanBDragStop(args: DragEventArgs) {
  console.log(args);
};
  // public swimlaneSettings: SwimlaneSettingsModel = { keyField: 'Assignee' };
  ngOnInit(): void {
    this.get_all();
    this.connect_realtime();
  }
  get_all(): void {
    this.quantriService.get_all(1)
      .subscribe(
        _data => {
          this.thongbaos = _data;
          this.data = this.thongbaos;
        }
      )
  }


  connect_realtime(): void {    
    //this.realtimeService.connect_realtime(this.UserName);   
    this.realtimeService._hubConnection.on('Thongbao', (message)=>{
      console.log(message);
      this.get_all();
      //this.getConnectionId();
    })
  }
  // private getConnectionId = () => {
  //   this._hubConnection.invoke('getconnectionid')
  //   .then((data) => {

  //     console.log(data);
  //     this.connectionId = data;
  //     this.senddata();
  //   });
  // }
  // senddata(){
  //   var data={
  //     Type: this.UserName,
  //     Information: this.connectionId,
  //   }
  //   console.log(data);
  //   this.http.post("https://localhost:44368/api/Msg", data).subscribe(
  //     data=>{
  //       console.log(data);
  //     }
  //   );
  // }

 
}
