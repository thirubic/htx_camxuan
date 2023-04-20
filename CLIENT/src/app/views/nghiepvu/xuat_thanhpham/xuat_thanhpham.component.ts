import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { KhoService } from '@app/_services/danhmuc/kho.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmService } from '@app/_modules/confirm/confirm.service';
import { GlobalConstants } from '@app/_models/config';
import { Edit_Xuat_thanhphamComponent  } from './edit_xuat_thanhpham.component';
import { environment } from '@environments/environment';
import { PhanxuongService } from "@app/_services/danhmuc/phanxuong.service";
import { NhapkhoService } from '@app/_services/danhmuc/nhapkho.service';
@Component({
  selector: 'app-xuat_thanhpham',
  templateUrl: './xuat_thanhpham.component.html',
  styleUrls: ['./xuat_thanhpham.component.scss'],
  providers: [
  ]
})
export class Xuat_thanhphamComponent implements OnInit {
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
  ma_kho_select: '';
  vattukhos = []; 
  ma_xuong_user = localStorage.getItem('Ma_donvi') ? localStorage.getItem('Ma_donvi') : sessionStorage.getItem('Ma_donvi') || '';
  dataxuong = [];
  datakho = [];
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
    private nhapkhoService: NhapkhoService,

  ) { }

  ngOnInit(): void {
    this.ma_xuong_select = this.ma_xuong_user;
    this.get_danhsachxuong();
    this.getkho_byphanxuong();
    this.getvattu_trongkho();
    this.getValueWithAsync().then(() =>
      this.isDataAvailable = true);      
  }

  async getValueWithAsync() {
    this.items = await this.getvattu_trongkho();    
    this.node = this.items;
  }
  change_xuong(){
    this.getkho_byphanxuong()
  }
  change_kho(){
    this.getvattu_trongkho()
  }
  getvattu_trongkho() { 
    return new Promise<any>((resolve) => {
      this.nhapkhoService.get_bymakho({"ma_kho":this.ma_kho_select})
        .subscribe(
          _data => {
            this.vattukhos = _data;     
                this.totalItems = _data.length;
            this.p = 1;
          }
        );
    })
  }
  getkho_byphanxuong() { 
    return new Promise<any>((resolve) => {
      this.khoService.get_byphanxuong({"ma_xuong":this.ma_xuong_select})
        .subscribe(
          _data => {
            this.datakho = _data;     
            this.totalItems = _data.length;
            this.p = 1;
            this.ma_kho_select = _data[1].ma_kho;
            this.getvattu_trongkho()
            console.log(this.ma_kho_select)
          }
        );
    })
  }

  onInitialized(tree) {
    setTimeout(() => {
      tree.treeModel.expandAll();
    });
  }


  add() {
      const initialState = { title:"Nhập thành phẩm vào kho", data: '0',phanxuong: this.ma_xuong_select,ma_kho: this.ma_kho_select };
      this.modalRef = this.modalService.show(
        Edit_Xuat_thanhphamComponent,
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

  edit(kho) {    
      const initialState = { title: GlobalConstants.DIEUCHINH + " vật tư trong kho", data:kho, phanxuong: this.ma_xuong_select,ma_kho: this.ma_kho_select  };
      this.modalRef = this.modalService.show(
        Edit_Xuat_thanhphamComponent,
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
  deletevattu(datadel){
    console.log(datadel)
    let options = {
      prompt: 'Bạn có muốn xóa vật tư [' + datadel['ma_vattu'] + '] trong kho này không?',
      title: "Thông báo",
      okText: `Đồng ý`,
      cancelText: `Hủy`,
    };

    this.confirmService.confirm(options).then((res: boolean) => {
      if (res) {
        let input = {
          "ma_vattu": datadel.ma_vattu
        };
        this.nhapkhoService.Del(input).subscribe({
          next: (_data) => {
            this.toastr.success("Xóa vật tư trong kho thành công", 'Thông báo', {
              timeOut: 3000,
              closeButton: true,
              positionClass: 'toast-bottom-right',
            });
            this.getvattu_trongkho();
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
                this.getkho_byphanxuong()
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