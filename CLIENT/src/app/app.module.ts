import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { GuestComponent } from './layouts/guest/guest.component';
import { AuthorisedComponent } from './layouts/authorised/authorised.component';
import { TopNavComponent } from './layouts/shared/top-nav/top-nav.component';
import { SideNavComponent } from './layouts/shared/side-nav/side-nav.component';
import { SideNavTogglerComponent } from './layouts/shared/side-nav-toggler/side-nav-toggler.component';

import { appInitializer, AuthInterceptor, ErrorInterceptor } from './_helpers';
import { AuthService } from './_services';
import { ConfirmModule } from './_modules/confirm/confirm.module';
import { DatePipe } from '@angular/common';
import { TreeviewModule } from 'ngx-treeview';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TreeModule } from '@circlon/angular-tree-component';
// import { QuillModule } from 'ngx-quill';
import * as moment from 'moment';
import * as $ from "jquery";
// RECOMMENDED
@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    SideNavComponent,
    SideNavTogglerComponent,
    GuestComponent,
    AuthorisedComponent
  ],
  imports: [
    BrowserModule,
    KanbanModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BsDropdownModule.forRoot(),
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    ModalModule.forRoot(),
    ConfirmModule,
    TreeviewModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    TextareaAutosizeModule,    
    BrowserModule,
    KanbanModule,
    AngularEditorModule,
    TreeModule
    // QuillModule.forRoot(),
    // QuillModule
  ],
  providers: [
    // { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
