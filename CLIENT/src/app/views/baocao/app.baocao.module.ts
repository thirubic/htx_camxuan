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

import { Bc_congviecphatsinhComponent } from './congviecphatsinh/bc_congviecphatsinh.component';
import { Bc_donviComponent } from './congviecphatsinh/bc_donvicomponent';
import { Bc_nhanvienComponent } from './congviecphatsinh/bc_nhanvien.component';
import { Bc_nguonphatsinhComponent } from './congviecphatsinh/bc_nguonphatsinh.component';
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
    declarations: [ Bc_congviecphatsinhComponent, Bc_donviComponent, Bc_nhanvienComponent, Bc_nguonphatsinhComponent
       
        ]
})
export class AppbaocaoModulue { }