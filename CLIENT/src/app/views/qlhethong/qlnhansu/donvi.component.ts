import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { DonviService } from '@app/_services/danhmuc/donvi.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmService } from '@app/_modules/confirm/confirm.service';
import { GlobalConstants } from '@app/_models/config';
import { Edit_nhansuComponent } from './edit_nhansu.component';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-donvi',
  templateUrl: './donvi.component.html',
  styleUrls: ['./donvi.component.scss'],
  providers: [
  ]
})
export class QldonviComponent implements OnInit {
  Ma_donvi = localStorage.getItem('Ma_donvi') ? localStorage.getItem('Ma_donvi') : sessionStorage.getItem('Ma_donvi') || '';

  donvis: any[];
  sonhansu: "10";
  totalItems = 0;
  countChild = 0;
  term: string = '';
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
  nhansus = [];
  serviceBase = `${environment.apiURL}`;

  constructor(
    private donviService: DonviService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.id_donvi = this.Ma_donvi;
    this.get_all();

    console.log(this.nhansus)

  }

  get_all() {
    console.log(111111111)
    return new Promise<any>((resolve) => {
      this.donviService.get_nhansubydv(this.id_donvi)
        .subscribe(
          _data => {
            this.nhansus = _data;
            this.totalItems = _data.length;
            this.p = 1;
          }
        );
    })
  }

  onInitialized(tree) {
    setTimeout(() => {
      tree.treeModel.expandAll();
    });
  }
  get_info(id) {
    this.donvi = [];
    this.donviService.get(id)
      .subscribe(
        _data => {
          this.donvi.push(_data);
        }
      );
  }

  add() {
    const initialState = { title: GlobalConstants.THEMMOI + " nhân sự", data: null };
    this.modalRef = this.modalService.show(
      Edit_nhansuComponent,
      Object.assign({}, {
        animated: true, keyboard: false, backdrop: false, ignoreBackdropClick: true
      }, {
        class: 'modal-lg xlg', initialState
      }));
      
    this.modalRef.content.event
      .subscribe(arg => {
        if (arg) {
          this.donviService.get_nhansubydv(this.id_donvi)
            .subscribe(
              _data => {
                this.nhansus = _data;
                this.totalItems = _data.length;
                this.p = 1;
                console.log(_data);
              }
            );
        }
      });
  }

  edit(nhansu) {
    const initialState = { title: GlobalConstants.DIEUCHINH + " nhân sự", data: nhansu };

    this.modalRef = this.modalService.show(
      Edit_nhansuComponent,
      Object.assign({}, {
        animated: true, keyboard: false, backdrop: false, ignoreBackdropClick: true
      }, {
        class: 'modal-lg xlg', initialState
      }));
    this.modalRef.content.event
      .subscribe(arg => {
        if (arg) {
          this.donviService.get_nhansubydv(this.id_donvi)
            .subscribe(
              _data => {
                this.nhansus = _data;
                this.totalItems = _data.length;
                this.p = 1;
                console.log(_data);
              }
            );
        }
      });

  }


  // delete() {
  //   var UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';
  //   if (this.donvi.length == 0) {
  //     this.toastr.warning(GlobalConstants.warn_missing_donvi, "",
  //       {
  //         timeOut: 3000,
  //         closeButton: true,
  //         positionClass: 'toast-bottom-right'
  //       });
  //     return;
  //   }
  //   else {
  //     let ans = confirm("Bạn có muốn xóa đơn vị " + this.donvi[0][0].ten_donvi + " không?");
  //     if (ans) {
  //       this.donviService.delete(this.donvi[0][0].id, UserName)
  //         .subscribe({
  //           next: (_data) => {
  //             this.toastr.success(GlobalConstants.success_delete, "",
  //               {
  //                 timeOut: 3000,
  //                 closeButton: true,
  //                 positionClass: 'toast-bottom-right'
  //               });
  //               this.getValueWithAsync().then(() =>
  //               this.isDataAvailable = true);
  //           },
  //           error: error => {
  //             this.toastr.error(error)
  //           }
  //         });
  //     };
  //   }
  // }

  delete() {
    let options = {
      prompt: `Bạn có muốn xóa đối tượng ${this.donvi[0][0].ten_donvi} không?`,
      title: GlobalConstants.title_hethong,
      okText: `Đồng ý`,
      cancelText: `Hủy`
    };

    // this.confirmService.confirm(options).then((res: boolean) => {
    //   if (res) {
    //     var UserName = localStorage.getItem('UserName') ? localStorage.getItem('UserName') : sessionStorage.getItem('UserName') || '';
    //     this.donviService.delete(this.donvi[0][0].id, UserName) //Sẽ sửa lại thành user sau
    //       .subscribe({
    //         next: (_data) => {
    //           this.toastr.success(GlobalConstants.success_delete, "",
    //             {
    //               timeOut: 3000,
    //               closeButton: true,
    //               positionClass: 'toast-bottom-right'
    //             });
    //           //this.get_all();
    //           this.getValueWithAsync().then(() =>
    //              this.isDataAvailable = true);
    //         },
    //         error: error => {
    //           this.toastr.error(error)
    //         }
    //       });
    //   }
    // });
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