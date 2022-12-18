import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { UtilsModule, AngularmaterialModule } from '@portal/utils';

import { UiModule } from '@portal/ui';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ResizableModule } from 'angular-resizable-element';
import { AngularResizeEventModule } from 'angular-resize-event';

import { SplistcrudService } from '@portal/core';
import { RemoteEntryComponent } from './entry.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { LoginhomeComponent } from './loginhome/loginhome.component';

//import { createCustomElement } from '@angular/elements';
import {
  AttachmentprimengModule,
  CardtemplettiltedComponent,
  DropdownAutocompleteComponent,
  RequestorComponent,
  SupportcustomerComponent,
  //DatatabledisplayinfoComponent
} from '@portal/ui-components';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedDataAccessUserModule } from '@portal/shared/data-access-user';

import { JsonSchemaFormModule } from '@dashjoin/json-schema-form';

import {
  startsWith,
  WebComponentWrapper,
  WebComponentWrapperOptions,
} from '@angular-architects/module-federation-tools';
import { LoginparentComponent } from './loginparent/loginparent.component';
import { RegistrationformComponent } from './registrationform/registrationform.component';
import { SysteminfoComponent } from './systeminfo/systeminfo.component';
import { UserloginComponent } from './userlogin/userlogin.component';
import { LoginformComponent } from './loginform/loginform.component';

//import { BrowserModule } from '@angular/platform-browser';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NzIconModule } from 'ng-zorro-antd/icon';
// import { NzSpinModule } from 'ng-zorro-antd/spin';
// import { QuillModule } from 'ngx-quill';
// import * as Sentry from '@sentry/angular';
// import { Router } from '@angular/router';

// import { environment } from '../../environments/environment';
// import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
// import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
// import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';

@NgModule({
  declarations: [
    RemoteEntryComponent,
    NxWelcomeComponent,
    LoginhomeComponent,
    LoginparentComponent,
    RegistrationformComponent,
    SysteminfoComponent,
    UserloginComponent,
    LoginformComponent,
  ],
  imports: [
    CommonModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    AngularmaterialModule,
    UtilsModule,
    UiModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ResizableModule,
    AngularResizeEventModule,
    FlexLayoutModule,
    RequestorComponent,
    CardtemplettiltedComponent,
    SharedDataAccessUserModule,
    DropdownAutocompleteComponent,
    SupportcustomerComponent,
    JsonSchemaFormModule,
    RouterModule.forChild([      
      {
        path: '',
        children: [
          {
            path: 'login',
            component: LoginformComponent,
          },
          {
            path: '',
            component: LoginhomeComponent,
            pathMatch: 'full'
          },
        ],
      },      
      
      // {
      //   path: 'tasks',
      //   loadChildren: () => import('./project/project.module').then((m) => m.ProjectModule)
      // },
      // {
      //   path: '',
      //   redirectTo: 'request',
      //   pathMatch: 'full'
      //   //component: SupporthomeComponent,
      // },

      // {
      //   path: 'wip',
      //   loadChildren: () =>
      //     import('./work-in-progress/work-in-progress.module').then(
      //       (m) => m.WorkInProgressModule
      //     )
      // },
      // {
      //   path: '',
      //   redirectTo: 'project',
      //   pathMatch: 'full'
      // }
    ]),
    AttachmentprimengModule,
    // NzSpinModule,
    // NzIconModule.forRoot([]),
    // environment.production ? [] : AkitaNgDevtools,
    // AkitaNgRouterStoreModule,
    // QuillModule.forRoot()
  ],
  exports: [],
  providers: [SplistcrudService]
})
export class RemoteEntryModule {}
