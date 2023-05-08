import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { KhoService } from '@app/_services/danhmuc/kho.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmService } from '@app/_modules/confirm/confirm.service';
import { GlobalConstants } from '@app/_models/config';
import {Edit_NhapluongComponent  } from './edit_nhapluong.component';
import {Edit_Phuongtien_luongComponent  } from './edit_phuongtien_luong.component';
import { environment } from '@environments/environment';
import { PhanxuongService } from "@app/_services/danhmuc/phanxuong.service";
import { NhapluongService } from '@app/_services/danhmuc/nhapluong.service';
import { DuongService } from '@app/_services/danhmuc/a_duong.service';
import { LuongphanService } from '@app/_services/danhmuc/luongphan.service';
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
  selector: 'app-nhapluong',
  templateUrl: './nhapluong.component.html',
  styleUrls: ['./nhapluong.component.scss'],
  providers: [
  ]
})
export class NhapluongComponent implements OnInit {

  columnDefs: (ColDef| ColGroupDef)[] = [
    
    { headerName:"Loại phân", field: 'ten_loaiphan',rowGroup: true,hide: true, openByDefault: true },
    { headerName:"Trạng thái", field: 'ten_trangthai', rowGroup: true, hide: true },
    { headerName:"Lần xủ lý", field: 'ten_lanxl', rowGroup: true, hide: true },
    {
      headerName: "",
      field: "edit",
      minWidth: 30,
      
      cellRenderer: (params) => {
        if(params.data != undefined){
          var dataString = encodeURIComponent(JSON.stringify(params.data.trangthai));
        }
        
        
        if (params.node.group) {
          return '';
        } else {
          if(dataString != '3')
          return `
          <a href="javascript:void(0);">
          <span class="glyphicon glyphicon-plus" style="color: #11A34F;" aria-hidden="true"></span>
        </a>
          `;
        }
      },
    },    
    {
      headerName: "",
      field: "edit_phuongtien",
      minWidth: 55,
      
      cellRenderer: (params) => {
        if(params.data != undefined){
          var dataString = encodeURIComponent(JSON.stringify(params.data.trangthai));
        }
        
        
        if (params.node.group) {
          return '';
        } else {
          if(dataString != '3')
          return `
          <a href="javascript:void(0);">
          <img src="../../../../assets/images/slider/pick-up-truck.png" style="margin-left: 8px;" width="25px" height="25px" />
        </a>
          `;
        }
      },
    },
    {
      headerName:"Mã luống",
      field: 'ma_luong',
      minWidth: 150,
    },
    { headerName:"Tên luống", field: 'ten_luong', minWidth: 300 },
    { headerName:"Tên đường", field: 'ten_duong' },
    { headerName:"Trọng lượng", field: 'trongluong' , minWidth: 150,
   },
    { headerName:"Vị trí luống", field: 'vitri_luong' },
    { headerName:"Mô tả", field: 'mota' }, 
    { headerName:"Số lượng nguyên liệu", field: 'soluong_nguyenlieu', minWidth: 500 },
  ];
  
  groupDefaultExpanded: -1;
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 200,
    sortable: true,
    resizable: true,
    
    cellRenderer: 'agGroupCellRenderer',
  };
  
  groupDisplayType: RowGroupingDisplayType = 'groupRows';

  donvis: any[];
  sokho: "10";
  totalItems = 0;
  term : string = '';
  p: number = 1;
  TreeNode: [];
  node: [];
  items: any;
  options = {
  };
  ma_xuong_select = '';
  ma_duong_select: '';
  dataluongs = []; 
  ma_xuong_user = localStorage.getItem('Ma_donvi') ? localStorage.getItem('Ma_donvi') : sessionStorage.getItem('Ma_donvi') || '';
  dataxuong = [];
  dataduong = [];
  donvi = [];
  modalRef: BsModalRef;
  id_donvi: any;
  isDataAvailable: boolean = false;
  khos = [];
  serviceBase = `${environment.apiURL}`;
  type_view = false;  
  constructor(
    private khoService: KhoService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private confirmService: ConfirmService,
    private xuongService: PhanxuongService,
    private duongService: DuongService,
    private nhapluongService: NhapluongService,
    private luongphanService: LuongphanService,
    
    

  ) { }

  ngOnInit(): void {
    this.ma_xuong_select = this.ma_xuong_user;
    this.get_danhsachxuong();
    this.getduong_byphanxuong();
    this.getluong_trongduong();
    this.getValueWithAsync().then(() =>
      this.isDataAvailable = true);      
  }


  onCellClicked(event){
    if(event.colDef.field =="edit"){
      this.edit(event.data);
    }
    if(event.colDef.field =="edit_phuongtien"){
      this.edit_phuongtien(event.data);
    }
  }

  async getValueWithAsync() {
    this.items = await this.getluong_trongduong();    
    this.node = this.items;
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
            this.dataluongs = _data;     
                this.totalItems = _data.length;
            this.p = 1;
          }
        );
    })
  }
  getduong_byphanxuong() { 
    return new Promise<any>((resolve) => {
      this.duongService.get_byphanxuong({"ma_xuong":this.ma_xuong_select})
        .subscribe(
          _data => {
            console.log(_data);
            this.dataduong = _data; 
            this.dataduong.push({"ma_duong":"0","ten_duong": "Tất cả"})          
            this.totalItems = _data.length;
            this.p = 1;
            if (_data.length > 0) {
              this.ma_duong_select = _data.find(x => x.ma_duong == '0').ma_duong;
              this.getluong_trongduong()
            }
          }
        );
    })
  }

  onInitialized(tree) {
    setTimeout(() => {
      tree.treeModel.expandAll();
    });
  }

  edit(dataluong) {    
    console.log(dataluong)
      const initialState = { title: GlobalConstants.DIEUCHINH + " nguyên liệu cho luống phân", data:dataluong, phanxuong: this.ma_xuong_select,ma_duong: this.ma_duong_select  };
      this.modalRef = this.modalService.show(
        Edit_NhapluongComponent,
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
  edit_phuongtien(dataluong) {   
    console.log(dataluong)
      const initialState = { title: "Số chuyến phương tiện vận chuyển nguyên liệu cho luống phân", data:dataluong, phanxuong: this.ma_xuong_select,ma_duong: this.ma_duong_select  };
      this.modalRef = this.modalService.show(
        Edit_Phuongtien_luongComponent,
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

  viewboard(){
    this.type_view = true;
    this.p = 0;
  }
  viewlist(){
    this.type_view = false;
    this.p = 0;
  }
  get_danhsachxuong(): void {
    this.xuongService.get_all()
        .subscribe(
            _data => {
                this.dataxuong = _data;
                  const isLargeNumber = (element) => element.ma_xuong == this.ma_xuong_select;
                  if(_data.findIndex(isLargeNumber) < 0)
                  {
                    this.ma_xuong_select = _data[0].ma_xuong;
                  }
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