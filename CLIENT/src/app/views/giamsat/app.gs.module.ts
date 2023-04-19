import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { TreeModule } from '@circlon/angular-tree-component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { AppGsRoutingModule } from './app.gs-routing.module';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { BrowserModule } from '@angular/platform-browser';
import { NumbersDirectivesModule } from '@app/_services/Directive/number.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
//giám sát trạng thái luống phân
import { GsluongComponent } from './trangthailuong/gsluong.component';
import { View_ctluongComponent } from './trangthailuong/view_ctluong.component';
import { Chonvitri_ctluongComponent } from './trangthailuong/chonvitri.component';
// import { View_cvcuatoiComponent  } from './cuatoi/view_cvcuatoi.component';
// //Công việc chủ trì
// import { CvduocgiaoComponent } from './cvduocgiao/cvduocgiao.component';
// import { Ins_cvduocgiaoComponent } from './cvduocgiao/ins_cvduocgiao.component';
// // công việc phối hợp
// import { CvphoihopComponent } from './cvphoihop/cvphoihop.component';
// import { Ins_cvphoihopComponent } from './cvphoihop/ins_cvphoihop.component';

// // Giám sát
// import { CvgiamsatComponent } from './cvgiamsat/cvgiamsat.component';
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AppGsRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        TreeModule,
        TabsModule,
        NumbersDirectivesModule,
        KanbanModule,
        NgSelectModule,
        NgxSliderModule
    ], 
    declarations: [ 
        // CvcuatoiComponent,Ins_cvcuatoiComponent,View_cvcuatoiComponent,
        // CvduocgiaoComponent,Ins_cvduocgiaoComponent,
        // CvphoihopComponent,Ins_cvphoihopComponent,
        // CvgiamsatComponent

        GsluongComponent, View_ctluongComponent,Chonvitri_ctluongComponent
        ]
})
export class AppGsModulue { }