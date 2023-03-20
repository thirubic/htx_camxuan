import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { TreeModule } from '@circlon/angular-tree-component';

import { GsluongComponent } from "./trangthailuong/gsluong.component";
// import { CvphoihopComponent } from "./cvphoihop/cvphoihop.component";
// import { CvgiamsatComponent } from "./cvgiamsat/cvgiamsat.component";

const routes: Routes = [        
    { path: 'trangthailuong',              component: GsluongComponent },
    // { path: 'Chutri/:id',              component: CvduocgiaoComponent },    
    // { path: 'Phoihop/:id',              component: CvphoihopComponent },    
    // { path: 'Giamsat/:id',              component: CvgiamsatComponent },    
    // { path: 'Giaoviec',              component: CvcuatoiComponent }, 
    // { path: 'Chutri',              component: CvduocgiaoComponent },    
    // { path: 'Phoihop',              component: CvphoihopComponent },    
    // { path: 'Giamsat',              component: CvgiamsatComponent }    
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        TreeModule
    ],
    exports: [RouterModule]
})

export class AppGsRoutingModule {}