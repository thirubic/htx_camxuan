import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';



import { TreeModule } from '@circlon/angular-tree-component';
import { Bc_thanhphamComponent } from "./thongkethanhpham/bc_thanhphamcomponent";



const routes: Routes = [        
    { path: 'CVphatsinh',              component: Bc_thanhphamComponent },    
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        TreeModule
    ],
    exports: [RouterModule]
})

export class AppDmRoutingModule {}