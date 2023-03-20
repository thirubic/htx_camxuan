import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';

import { AppDmRoutingModule } from './app.qtdanhmuc-routing.module';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { BrowserModule } from '@angular/platform-browser';
import { NumbersDirectivesModule } from '@app/_services/Directive/number.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TreeModule } from '@circlon/angular-tree-component';
// import { QuillModule } from 'ngx-quill';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { Edit_phanxuongComponent } from './phanxuong/edit_phanxuong.component';
import { PhanxuongComponent } from './phanxuong/phanxuong.component';
import { GiavattuComponent } from './giavattu/giavattu.component';
import { Edit_GiavattuComponent } from './giavattu/edit_giavattu.component';
import { VattuComponent } from './vattu/vattu.component';
import { Edit_VattuComponent } from './vattu/edit_vattu.component';
import { TraicungcapComponent } from './traicungcap/traicungcap.component';
import { Edit_TraiComponent } from './traicungcap/edit_traicungcap.component';
import { KhoComponent } from './kho/kho.component';
import { Edit_KhoComponent } from './kho/edit_kho.component';
import { LuongphanComponent } from './luongphan/luongphan.component';
import { Edit_LuongphanComponent } from './luongphan/edit_luongphan.component';
import { Edit_tuyenduongComponent } from './tuyenduong/edit_tuyenduong.component';
import { TuyenduongComponent } from './tuyenduong/tuyenduoing.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AppDmRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        TabsModule,
        NumbersDirectivesModule,
        KanbanModule,
        NgSelectModule,
        HttpClientModule,
        AngularEditorModule,
        TreeModule,
        
    // QuillModule.forRoot(),
    // QuillModule
    ], 
    declarations: [
        // nguon phat sinh
        Edit_phanxuongComponent, PhanxuongComponent, GiavattuComponent,Edit_GiavattuComponent,VattuComponent,
        Edit_VattuComponent,TraicungcapComponent,Edit_TraiComponent,KhoComponent,Edit_KhoComponent,LuongphanComponent,Edit_LuongphanComponent,
        TuyenduongComponent, Edit_tuyenduongComponent
    ]
})
export class AppqtdanhmucModulue { }