import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { GiavattuComponent } from "./giavattu/giavattu.component";
import { KhoComponent } from "./kho/kho.component";
import { LuongphanComponent } from "./luongphan/luongphan.component";
import { PhanxuongComponent } from "./phanxuong/phanxuong.component";
import { TuyenduongComponent } from "./tuyenduong/tuyenduong.component";
import { TraicungcapComponent } from "./traicungcap/traicungcap.component";
import { VattuComponent } from "./vattu/vattu.component";
import { PhuongtienComponent } from "././phuongtien/phuongtien.component";
import { LoaiphanComponent } from "./loaiphan/loaiphan.component";




const routes: Routes = [           
    { path: 'phanxuong',              component: PhanxuongComponent },
    { path: 'duong',              component: TuyenduongComponent },
    { path: 'giavattu',              component: GiavattuComponent },
    { path: 'vattu',              component: VattuComponent },
    { path: 'trai',              component: TraicungcapComponent },
    { path: 'kho',              component: KhoComponent },
    { path: 'luongphan',              component: LuongphanComponent },
    { path: 'phuongtien',              component: PhuongtienComponent },
    { path: 'loaiphan',              component: LoaiphanComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})

export class AppDmRoutingModule {}
