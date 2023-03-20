import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '@app/views/dashboard/dashboard.component';

const qlhethong = () => import('../../views/qlhethong/app.qlhethong.module').then(x => x.AppqlhethongModulue);
const qlnghiepvu = () => import('../../views/nghiepvu/app.nghiepvu.module').then(x => x.AppNghiepvuModulue);
const dmModule = () => import('../../views/cat/app.dm.module').then(x => x.AppDmModulue);
const cvModule = () => import('../../views/congviec/app.cv.module').then(x => x.AppCvModulue);
const gsModule = () => import('../../views/giamsat/app.gs.module').then(x => x.AppGsModulue);
const qtnoidungModule = () => import('../../views/quantrinoidung/app.qtnoidung.module').then(x => x.AppqtnoidungModulue);
const qtdanhmucModule = () => import('../../views/quantridanhmuc/app.qtdanhmuc.module').then(x => x.AppqtdanhmucModulue);
const baocao = () => import('../../views/baocao/app.baocao.module').then(x => x.AppbaocaoModulue);


const routes: Routes = [
    { path: '', redirectTo: 'home'},
    { path: 'home', component: DashboardComponent },    
    { 
        path: 'danh-muc', 
        loadChildren: dmModule
    },{ 
        path: 'Congviec', 
        loadChildren: cvModule
    },{ 
        path: 'Quantrinoidung', 
        loadChildren: qtnoidungModule
    }
    ,{ 
        path: 'Quanlydanhmuc', 
        loadChildren: qtdanhmucModule
    }
    ,{ 
        path: 'Hethong', 
        loadChildren: qlhethong
    }
    ,{ 
        path: 'Baocao', 
        loadChildren: baocao
    },
    { 
        path: 'Nghiepvu', 
        loadChildren: qlnghiepvu
    },
    { 
        path: 'Giamsat', 
        loadChildren: gsModule
    }
    
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AuthorisedRoutingModule {}