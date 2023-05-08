import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { LuongphanService } from '@app/_services/danhmuc/luongphan.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmService } from '@app/_modules/confirm/confirm.service';
import { GlobalConstants } from '@app/_models/config';
import {Edit_LuongphanComponent  } from './edit_luongphan.component';
import { environment } from '@environments/environment';
import { PhanxuongService } from "@app/_services/danhmuc/phanxuong.service";
import { DuongService } from '@app/_services/danhmuc/a_duong.service';
import { DMChungService } from "@app/_services/danhmuc/dmchung.service";
import { Chuyenvitri_ctluongComponent } from './chuyenvitri.component';
import { Chonvitri_ctluongComponent } from '@app/views/giamsat/trangthailuong/chonvitri.component';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import {
  ColDef,
  ColGroupDef,
  GridReadyEvent,
  ICellRendererParams,
  RowGroupingDisplayType,
} from 'ag-grid-community';
@Component({
  selector: 'app-luongphan',
  templateUrl: './luongphan.component.html',
  styleUrls: ['./luongphan.component.scss'],
  providers: [
  ]
})


export class LuongphanComponent implements OnInit  {
  
  editrow(luongphan) {    
    console.log(luongphan)
    const decodedData = decodeURIComponent(luongphan);
    const objectData = JSON.parse(decodedData);
      const initialState = { title: GlobalConstants.DIEUCHINH + " luống phân", data:objectData, ma_duong: this.ma_duong_select};
      this.modalRef = this.modalService.show(
        Edit_LuongphanComponent,
        Object.assign({}, {
          animated: true, keyboard: false, backdrop: false, ignoreBackdropClick: true
        }, {
          class: 'modal-lg xlg', initialState
        }));

      this.modalRef.content.event
        .subscribe(arg => {
          if (arg) {
            this.getValueWithAsync().then(() =>            
                this.isDataAvailable = true
            );
          }
        });
    
  }
  columnDefs: (ColDef| ColGroupDef)[] = [
    
    { headerName:"Loại phân", field: 'ten_loaiphan',rowGroup: true,hide: true,minWidth: 300,openByDefault: true },
    { headerName:"Trạng thái", field: 'ten_trangthai', rowGroup: true, hide: true},
    { headerName:"Lần xủ lý", field: 'ten_lanxl', rowGroup: true, hide: true },
    {
      headerName: "",
      minWidth: 120,
      cellRenderer: (params) => {
        const rowDataJson = params.data;
        var dataString = encodeURIComponent(JSON.stringify(params.data));
        if (params.node.group) {
          return '';
        } else {
          return `
            <a href="javascript:void(0);" class="edit-row" onclick="this.editrow('${(dataString)}')">
              <i class="fa fa-edit"></i>
            </a>
            <a href="javascript:void(0);" onclick="this.deleteluongphan('${dataString}')">
              <i class="fa fa-times-circle" style="color: red; font-size: 20px;"></i>
            </a>
          `;
        }
      },
    },
    {
      headerName:"Mã luống",
      field: 'ma_luong',
      minWidth: 250,
    },
    { headerName:"Tên luống", field: 'ten_luong', minWidth: 200 },
    { headerName:"Tên đường", field: 'ten_duong' },
    { headerName:"Trọng lượng", field: 'trongluong',
   },
    { headerName:"Vị trí luống", field: 'vitri_luong' },
    { headerName:"Mô tả", field: 'mota' }, 
    { headerName:"Số lượng nguyên liệu", field: 'soluong_nguyenlieu' },
  ];
  
  groupDefaultExpanded: -1;
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 200,
    sortable: true,
    resizable: true,
    
    cellRenderer: 'agGroupCellRenderer',
  };
  
  groupDisplayType: RowGroupingDisplayType = 'multipleColumns';
  donvis: any[];
  soluongphan: "10";
  totalItems = 0;
  term : string = '';
  p: number = 1;
  TreeNode: [];
  node: [];
  items: any;
  options = {
  };
  
  ma_luong_key:'';
  ma_xuong_select = '';
  ma_duong_select= '';
  ma_xuong_user = localStorage.getItem('Ma_donvi') ? localStorage.getItem('Ma_donvi') : sessionStorage.getItem('Ma_donvi') || '';
  dataxuong = [];
  dataduong= [];
  donvi = [];
  modalRef: BsModalRef;
  id_donvi: any;
  isDataAvailable: boolean = false;
  luongphans = [];
  luongphans_moi = [];
  luongphans_xuly = [];
  luongphans_hoanthanh = [];
  tong_moi = 0;
  tong_xuly = 0;
  collapsed: true;
  tong_hoanthanh = 0;
  serviceBase = `${environment.apiURL}`;
  type_view = false;  
 
  constructor(
    
    private luongphanService: LuongphanService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private confirmService: ConfirmService,
    private xuongService: PhanxuongService,
    private duongService: DuongService,
    private dmchungService: DMChungService,
    
  ) {
    
   }

  ngOnInit(): void {
    this.ma_xuong_select = this.ma_xuong_user;
    this.get_danhsachxuong()
    this.getValueWithAsync().then(() =>
      this.isDataAvailable = true);   
       
  }

  async getValueWithAsync() {
    this.items = await this.getluongphan_byduong();    
    this.node = this.items;
  }
  onRowClicked(params) {
    if (params.node.group && params.event.target.nodeName === "INPUT") {
      const expanded = params.node.expanded ? 'collapsed' : 'expanded';
      params.node.setExpanded(expanded === 'expanded');
    }
  }
  change_duong(){
    this.getluongphan_byduong()
  }
  change_xuong(){
    this.getduong_byphanxuong()
  }
  getluongphan_byduong() { 
    return new Promise<any>((resolve) => {
      this.luongphanService.get_byduong({"ma_duong":this.ma_duong_select})
        .subscribe(
          _data => {
            this.luongphans = _data;    
            this.luongphans_moi = _data.filter((x) => x.trangthai == 1); 
            this.luongphans_xuly = _data.filter((x) => x.trangthai == 2); 
            this.luongphans_hoanthanh = _data.filter((x) => x.trangthai == 3); 
           
            this.tong_moi = this.tinhtong_khoiluong(this.luongphans_moi);
            this.tong_xuly = this.tinhtong_khoiluong(this.luongphans_xuly);
            this.tong_hoanthanh = this.tinhtong_khoiluong(this.luongphans_hoanthanh);
            this.totalItems = _data.length;
            this.p = 1;
          }
        );
    })
  }
  Chuyenvitri(luongphan) {
      const initialState = { title:" Chọn vị trí chuyển",data: luongphan,vitri: 0};
      this.modalRef = this.modalService.show(
        Chuyenvitri_ctluongComponent,
        Object.assign({}, {
          animated: true, keyboard: false, backdrop: false, ignoreBackdropClick: true
        }, {
          class: 'modal-lg xlg', initialState
        }));
        
        this.modalRef.content.event
        .subscribe(arg => {
          if (arg) {
            this.getValueWithAsync().then(() =>            
                this.isDataAvailable = true
            );
          }
        });
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
            this.ma_duong_select = this.dataduong.find(x=>x.ma_duong == "0").ma_duong;
            this.getluongphan_byduong()
          }
        );
    })
  }

  onInitialized(tree) {
    setTimeout(() => {
      tree.treeModel.expandAll();
    });
  }


  async add() {
      const initialState = { title: GlobalConstants.THEMMOI + " luống phân", data: '0',ma_duong: this.ma_duong_select};
      this.modalRef = this.modalService.show(
        Edit_LuongphanComponent,
        Object.assign({}, {
          animated: true, keyboard: false, backdrop: false, ignoreBackdropClick: true
        }, {
          class: 'modal-lg xlg', initialState
        }));

      this.modalRef.content.event
        .subscribe(arg => {
          if (arg) {
            this.getValueWithAsync().then(() =>            
                this.isDataAvailable = true
            );
          }
        });
  }

  
  tinhtong_khoiluong(list : any){
    var tong = 0;
    list.forEach(element => {
      if(element.khoiluong != null || element.khoiluong != "")
      {
        tong = tong + element. khoiluong;
      }     
    });
    return tong;
  }

  viewboard(){
    this.type_view = true;
    this.p = 0;
  }
  viewlist(){
    this.type_view = false;
    this.p = 0;
  }
  deleteluongphan(datadel){
    console.log(datadel)
    let options = {
      prompt: 'Bạn có muốn xóa luống phân [' + datadel['ma_luong'] + '] này không?',
      title: "Thông báo",
      okText: `Đồng ý`,
      cancelText: `Hủy`,
    };

    this.confirmService.confirm(options).then((res: boolean) => {
      if (res) {
        let input = {
          "ma_luong": datadel.ma_luong
        };
        this.luongphanService.Del(input).subscribe({
          next: (_data) => {
            this.toastr.success("Xóa thành công", 'Thông báo', {
              timeOut: 3000,
              closeButton: true,
              positionClass: 'toast-bottom-right',
            });
            this.getluongphan_byduong();
          },
          error: (error) => {
            this.toastr.error(error);
          },
        });
        console.log('XÓA');
      }
    });
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
}

function fuzzysearch(needle: string, haystack: string) {
  const haystackLC = haystack.toLowerCase();
  const needleLC = needle.toLowerCase();

  const hlen = haystack.length;
  const nlen = needleLC.length;

  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needleLC === haystackLC;
  }
  outer: for (let i = 0, j = 0; i < nlen; i++) {
    const nch = needleLC.charCodeAt(i);

    while (j < hlen) {
      if (haystackLC.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}