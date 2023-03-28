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
@Component({
  selector: 'app-luongphan',
  templateUrl: './luongphan.component.html',
  styleUrls: ['./luongphan.component.scss'],
  providers: [
  ]
})
export class LuongphanComponent implements OnInit {
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
    
  ) { }

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
            this.dataduong = _data;     
                this.totalItems = _data.length;
            this.p = 1;
            this.ma_duong_select = this.dataduong[0].ma_duong;
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

  edit(luongphan) {    
      const initialState = { title: GlobalConstants.DIEUCHINH + " luống phân", data:luongphan, ma_duong: this.ma_duong_select};
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