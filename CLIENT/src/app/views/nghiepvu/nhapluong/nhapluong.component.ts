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
@Component({
  selector: 'app-nhapluong',
  templateUrl: './nhapluong.component.html',
  styleUrls: ['./nhapluong.component.scss'],
  providers: [
  ]
})
export class NhapluongComponent implements OnInit {
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
            this.totalItems = _data.length;
            this.p = 1;
            if (_data.length > 0) {
              this.ma_duong_select = _data[0].ma_duong;
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