import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { UyquyengiaoviecService } from '@app/_services/danhmuc/uyquyengiaoviec.service';

import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { TreeNode, TreeModel } from '@circlon/angular-tree-component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmService } from '@app/_modules/confirm/confirm.service';
import { GlobalConstants } from '@app/_models/config';
import { Edit_nguoigiamsatComponent } from './edit_nguoigiamsat.component';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { environment } from '@environments/environment';
import { UserService } from '@app/_services/sys/user.service';
@Component({
  selector: 'app-nguoigiamsat',
  templateUrl: './nguoigiamsat.component.html',
  styleUrls: ['./nguoigiamsat.component.scss'],
  providers: [
  ]
})
export class NguoigiamsatComponent implements OnInit {
  donvis: any[];
  sonhansu: "10";
  totalItems = 0;
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
  dsuyquyens = [];
  serviceBase = `${environment.apiURL}`;
  type_view = false;
  nguoigiamsats = [
  ];
  constructor(
    private uyquyengiaoviecService: UyquyengiaoviecService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private confirmService: ConfirmService,
    private userService: UserService,

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
      this.userService.getgiamsat()
        .subscribe(
          _data => {
            console.log(_data);
            this.nguoigiamsats = _data;
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


  add() {
    const initialState = { title: GlobalConstants.THEMMOI + " ???y quy???n giao vi???c", data: '0' };
    this.modalRef = this.modalService.show(
      Edit_nguoigiamsatComponent,
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
    const initialState = { title: GlobalConstants.DIEUCHINH + " ???y quy???n giao vi???c", data: nhansu };
    this.modalRef = this.modalService.show(
      Edit_nguoigiamsatComponent,
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

  giamsat(nhansu) {

    console.log("Gi??m s??t");
    const initialState = { title: "Chi ti???t c??ng vi???c " + nhansu.ten_nd, data: nhansu };
    this.modalRef = this.modalService.show(
      Edit_nguoigiamsatComponent,
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

  viewboard() {
    this.type_view = true;
    this.p = 0;
  }
  viewlist() {
    this.type_view = false;
    this.p = 0;
  }
  deletenguoigiamsat(datanguonp) {
    let options = {
      prompt: 'B???n c?? mu???n x??a quy???n gi??m s??t c???a ??ng/b?? [' + datanguonp.ten_nd + '] n??y kh??ng?',
      title: "Th??ng b??o",
      okText: `?????ng ??`,
      cancelText: `H???y`,
    };

    this.confirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.userService.nguoigiamsat_add(datanguonp.ma_nv, 0).subscribe({
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
        console.log('X??A');
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