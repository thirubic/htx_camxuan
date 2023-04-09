import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { VattuService } from '@app/_services/danhmuc/vattu.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmService } from '@app/_modules/confirm/confirm.service';
import { GlobalConstants } from '@app/_models/config';
import {Edit_VattuComponent  } from './edit_vattu.component';
import { environment } from '@environments/environment';
import { NhapkhoService } from '@app/_services/danhmuc/nhapkho.service';

@Component({
  selector: 'app-vattu',
  templateUrl: './vattu.component.html',
  styleUrls: ['./vattu.component.scss'],
  providers: [
  ]
})
export class VattuComponent implements OnInit {
  donvis: any[];
  sovattu: "10";
  totalItems = 0;
  term : string = '';
  p: number = 1;
  TreeNode: [];
  node: [];
  items: any;
  loaivt_id = 0;
  options = {
  };
  donvi = [];
  dataloaivattu = [{ "loaivt_id": 0, "ten_loaivt": "Tất cả" },{ "loaivt_id": 1, "ten_loaivt": "Vật tư phục vụ sản xuất" }, { "loaivt_id": 2, "ten_loaivt": "Nguyên liệu" }];
  modalRef: BsModalRef;
  id_donvi: any;
  isDataAvailable: boolean = false;
  vattus = [];
  serviceBase = `${environment.apiURL}`;
  type_view = false;  

  constructor(
    private vattuService: VattuService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private confirmService: ConfirmService,
    private nhapkhoService: NhapkhoService,

  ) { }

  ngOnInit(): void {
    this.getValueWithAsync().then(() =>
      this.isDataAvailable = true);      
  }

  async getValueWithAsync() {
    this.items = await this.get_byloaivattu();    
    this.node = this.items;
    console.log(123);
  }

  get_all() { 
    return new Promise<any>((resolve) => {
      this.vattuService.get_all()
        .subscribe(
          _data => {
            this.vattus = _data;     
                this.totalItems = _data.length;
            this.p = 1;
            console.log(this.vattus)
          }
        );
    })
  }

  onInitialized(tree) {
    setTimeout(() => {
      tree.treeModel.expandAll();
    });
  }

  change_loaivt(){
      this.get_byloaivattu()
  }
  add() {
      const initialState = { title: GlobalConstants.THEMMOI + " vật tư", data: '0' };
      this.modalRef = this.modalService.show(
        Edit_VattuComponent,
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

  edit(vattu) {    
      const initialState = { title: GlobalConstants.DIEUCHINH + " vật tư", data:vattu };
      this.modalRef = this.modalService.show(
        Edit_VattuComponent,
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
  get_byloaivattu(): void {
      this.vattuService.dm_vattu_getbyloai({"loai_vt":this.loaivt_id})
        .subscribe(
            _data => {
                this.vattus = _data;
            }
        );
  }
  
  viewboard(){
    this.type_view = true;
    this.p = 0;
  }
  viewlist(){
    this.type_view = false;
    this.p = 0;
  }
  timkiem(key){
    console.log(key)
    //this.vattus = this.vattus.filter((x) => x.nd_tra_con)
  }
  deletevattu(datadel){
    console.log(datadel)
    let options = {
      prompt: 'Bạn có muốn xóa vật tư [' + datadel['ma_vattu'] + '] này không?',
      title: "Thông báo",
      okText: `Đồng ý`,
      cancelText: `Hủy`,
    };

    this.confirmService.confirm(options).then((res: boolean) => {
      if (res) {
        let input = {
          "ma_vattu": datadel.ma_vattu
        };
        this.vattuService.Del(input).subscribe({
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
        console.log('XÓA');
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