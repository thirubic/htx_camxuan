import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { TuyenduongService } from '@app/_services/danhmuc/tuyenduong.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmService } from '@app/_modules/confirm/confirm.service';
import { GlobalConstants } from '@app/_models/config';
import {Edit_tuyenduongComponent  } from './edit_tuyenduong.component';
import { environment } from '@environments/environment';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-tuyenduong',
  templateUrl: './tuyenduong.component.html',
  styleUrls: ['./tuyenduong.component.scss'],
  providers: [
  ]
})
export class TuyenduongComponent implements OnInit {
  donvis: any[];
  sonhansu: "10";
  totalItems = 0;
  term : string = '';
  p: number = 1;
  TreeNode: [];
  node: [];
  items: any;
  options = {
  };
  donvi = [];
  modalRef: BsModalRef;
  id_donvi: any;
  isDataAvailable: boolean = false;
  tuyenduongs = [];
  serviceBase = `${environment.apiURL}`;
  type_view = false;  

  constructor(
    private tuyenduongService: TuyenduongService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private confirmService: ConfirmService,

  ) { }

  ngOnInit(): void {
    this.getValueWithAsync().then(() =>
      this.isDataAvailable = true);      
  }

  async getValueWithAsync() {
    this.items = await this.get_all();    
    this.node = this.items;
  }

  get_all() { 
    return new Promise<any>((resolve) => {
      this.tuyenduongService.get_all()
        .subscribe(
          _data => {
            this.tuyenduongs = _data;     
                this.totalItems = _data.length;
            this.p = 1;
            console.log(this.tuyenduongs)
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
    console.log("add");
      const initialState = { title: GlobalConstants.THEMMOI + " nguồn phát sinh", data:'0' };
      this.modalRef = this.modalService.show(
        Edit_tuyenduongComponent,
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

  edit(nhansu) {    
    console.log("Edit");
      const initialState = { title: GlobalConstants.DIEUCHINH + " nhân sự", data:nhansu };
      this.modalRef = this.modalService.show(
        Edit_tuyenduongComponent,
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
  delete(datanguonp){
    let options = {
      prompt: 'Bạn có muốn xóa  đường [' + datanguonp.ten_duong + '] này không?',
      title: "Thông báo",
      okText: `Đồng ý`,
      cancelText: `Hủy`,
    };

    this.confirmService.confirm(options).then((res: boolean) => {
      if (res) {
        try {
          this.tuyenduongService.Del(datanguonp.ma_duong).subscribe({
            next: (_data) => {       
              this.toastr.success("Xóa thành công", 'Thông báo', {
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
          
        } catch (error) {
          console.log(error.exceptionmessage);
        }
      }
    });
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