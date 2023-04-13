import { Component, ViewEncapsulation } from '@angular/core';
import { Dashboard_CV_Chitiet } from '@app/_models/dashboard/dashboard';
import { AuthService } from '@app/_services';
import { DashboardService } from '@app/_services/dashboard/dashboard.service';
import { PhanxuongService } from '@app/_services/danhmuc/phanxuong.service';
import { TuyenduongService } from '@app/_services/danhmuc/tuyenduong.service';
import { LuongphanService } from '@app/_services/danhmuc/luongphan.service';
import { Tr_NhapluongService } from '@app/_services/danhmuc/Tr_nhapluong.service';
import { CardSettingsModel, SwimlaneSettingsModel, DialogSettingsModel, DialogEventArgs, DragEventArgs } from '@syncfusion/ej2-angular-kanban';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BsModalService } from 'ngx-bootstrap/modal';
import { View_cvcuatoiComponent } from '../congviec/cuatoi/view_cvcuatoi.component';
import { TreeNode, TreeModel } from '@circlon/angular-tree-component';

// module realtime
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent {

  Ma_nhanvien = localStorage.getItem('Ma_nhanvien') ? localStorage.getItem('Ma_nhanvien') : sessionStorage.getItem('Ma_nhanvien') || '';
  UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';
 
  canvas: any;
  ctx: any;
  canvas2: any;
  ctx2: any;
  constructor(
    private modalService: BsModalService,
    private dashboardService: DashboardService,
    private phanxuongService: PhanxuongService,
    private tuyenduongService: TuyenduongService,
    private luongphanService: LuongphanService,
    private tr_NhapluongService: Tr_NhapluongService,
  ) { }
  data_htxs: any[];
  sonhansu: "10";
  totalItems = 0;
  countChild = 0;
  term : string = '';
  p: number = 1;
  TreeNode: [];
  node: [];
  items: any;
  options = {
  };
  donvi = [];
  id_donvi: any ;
  isDataAvailable: boolean = false;
  nhansus = [];
// view chi tiết
  view_cap = 0;
  phanxuongview = [];
  tuyenduongview = [];
  luongview = [];
  nguyenlieuview = [];
  // giam sat don vi  
  ngOnInit(): void {
    // this.get_box();
    // this.get_chitiet();
    // this.get_bieudo();    

    this.getValueWithAsync().then(() =>
      this.isDataAvailable = true);
    this.get_data_htx();
    this.view_cap = 0;
  }

  get_chitiet(): void {
   
  }
  onSelect(value){
  }

  editContact(contact) {
    console.log(contact)
    //this.router.navigate([route], { queryParams: { id: contact.id } });
  }
  get_bieudo(): void {
    
  }

  
  async getValueWithAsync() {
    this.items = await this.get_all();    
    this.node = this.items;
    console.log(this.node);
  }

  get_all() {
    return new Promise<any>((resolve) => {
      this.dashboardService.get_tree()
        .subscribe(
          _data => {
            console.log(_data);
            resolve(_data);         
          }
        );
    })
  }

  get_data_htx() {
    return new Promise<any>((resolve) => {
      this.dashboardService.get_data_htx()
        .subscribe(
          _data => {
            this.data_htxs  = _data;
          }
        );
    })
  }
  filter_node(ma_obj: any) {
    let kq = this.data_htxs.filter(i => i.ma_dv == ma_obj);
    console.log(kq);
    return kq[0].cap;
  }
  get_box(): void {
    // this.dashboardService.get_box_donvi(this.id_donvi,this.countChild)
    //   .subscribe(
    //     _data => {
    //       this.data_box = _data;
    //       this.tongso = _data[0].tongso;
    //       this.quahan = _data[0].quahan;
    //       this.chuathuchien = _data[0].chuahoanthanh;
    //       this.dangthuchien = _data[0].dangthuchien;
    //       this.hoanthanh = _data[0].hoanthanh
    //     }
    //   )
  }
  get_chitiet_donvi(): void {
    // this.dashboardService.get_chitiet_donvi(this.id_donvi,this.countChild)
    //   .subscribe(
    //     _data => {
    //       this.list_quahan = _data.table;
    //       this.list_duocgiao = _data.table1;
    //     }
    //   )
  }
  onInitialized(tree) {
    setTimeout(() => {
      tree.treeModel.expandAll();
    });
  }


  // get phân xưởng
  get_phanxuong(ma_obj: any) {

    console.log(ma_obj);
    this.phanxuongService.get_all()
      .subscribe(
        _data => {
          let kq = _data.filter(i => i.ma_xuong == ma_obj);
          if (kq.length > 0) {
            this.phanxuongview = kq[0];           
          }
        }
      )
    
  }

  // get phân xưởng
  get_tuyenduong(ma_obj: any) {
    this.tuyenduongService.get_all()
      .subscribe(
        _data => {
          let kq = _data.filter(i => i.ma_duong == ma_obj);
          if (kq.length > 0) {
            this.tuyenduongview = kq[0];           
          }
        }
      )
    
  }

  // get phân xưởng
  get_luong(ma_obj: any) {
    var model = {
      "ma_luong": ma_obj}
      ;    

    this.luongphanService.get_byid(model)
      .subscribe(
        _data => {
          console.log(_data);
          this.luongview = _data[0];
        }
      );
  }


  get_bynguyenlieu(ma_obj: any) {
    var model = {
      "ma_luong": ma_obj}
      ;    

    this.tr_NhapluongService.get_bynguyenlieu(model)
      .subscribe(
        _data => {
          console.log(_data);
          this.nguyenlieuview = _data;
        }
      );
  }

  onEvent(node: TreeNode): void {
   this.id_donvi = node.data.id;
   this.countChild = node.data.children.length;
   console.log(this.id_donvi);
   console.log(  this.countChild);

   this.view_cap = this.filter_node(this.id_donvi);
   if(this.view_cap == 0 ){
       
   }
   if(this.view_cap == 1 ){
    // phân xưởng
    this.get_phanxuong(this.id_donvi);    
   }
   if(this.view_cap == 2 ){
    this.get_tuyenduong(this.id_donvi);
   }
   if(this.view_cap == 3 ){
    console.log("Luống");
    this.get_luong(this.id_donvi);
    this.get_bynguyenlieu(this.id_donvi);
   }
  //  this.donviService.get_nhansubydv(this.id_donvi)
  //  .subscribe(
  //    _data => {
  //     this.nhansus = _data;   
  //     this.totalItems = _data.length;
  //     this.p = 1;
  //     this.get_box();
  //     this.get_chitiet_donvi()
  //    }
  //  );
  }
  filterFn(value: string, treeModel: TreeModel) {
    treeModel.filterNodes((node: TreeNode) => fuzzysearch(value, node.data.ten_dv));
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
