import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { TreeModule } from '@circlon/angular-tree-component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';

import { AppDmRoutingModule } from './app.baocao-routing.module';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { BrowserModule } from '@angular/platform-browser';
import { NumbersDirectivesModule } from '@app/_services/Directive/number.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { Bc_thanhphamComponent } from './thongkethanhpham/bc_thanhphamcomponent';
// import { QuillModule } from 'ngx-quill';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AppDmRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        TreeModule,
        TabsModule,
        NumbersDirectivesModule,
        KanbanModule,
        NgSelectModule,
        HttpClientModule,
        AngularEditorModule,
        
    // QuillModule.forRoot(),
    // QuillModule
    ], 
    declarations: [ Bc_thanhphamComponent
       
        ]
})
export class AppbaocaoModulue { }