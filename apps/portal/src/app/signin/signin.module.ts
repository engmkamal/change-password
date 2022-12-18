// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';



// @NgModule({
//   declarations: [],
//   imports: [
//     CommonModule
//   ]
// })
// export class SigninModule { }
//===============================

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
        path: 'user',
        children: [
          {
            path: 'registration',
            component: LoginhomeComponent,
          },
          {
            path: 'loginhome',
            component: LoginhomeComponent,
          },
          {
            path: 'loginhome',
            component: LoginhomeComponent,
          },
          {
            path: 'login',
            component: LoginformComponent,
          },
          // {
          //   path: '',
          //   redirectTo: 'login',
          // }
        ],
      },
      // {
      //   path: 'registration',
      //   component: LoginhomeComponent,
      // },
      // {
      //   path: 'request',
      //   component: LoginparentComponent,
      // },
      // {
      //   path: 'supporthome',
      //   children: [
      //     {
      //       path: 'loginhome',
      //       component: LoginhomeComponent,
      //     },
      //   ],
      // },
      // {
      //   matcher: startsWith('itservicerequest'),
      //   component: WebComponentWrapper,
      //   data: {
      //     remoteEntry: 'http://localhost:4202/remoteEntry.mjs',
      //     remoteName: 'itservicerequest',
      //     exposedModule: './web-components',
      //     elementName: 'itservicerequest-home-element',
      //   } as WebComponentWrapperOptions,
      // },
      // {
      //   path: '',
      //   component: LoginformComponent,
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
  providers: [SplistcrudService],
  // providers: [
  //   SplistcrudService,
  //   {
  //     provide: NG_ENTITY_SERVICE_CONFIG,
  //     useValue: { baseUrl: 'https://jsonplaceholder.typicode.com' }
  //   },
  //   {
  //     provide: ErrorHandler,
  //     useValue: Sentry.createErrorHandler()
  //   },
  //   {
  //     provide: Sentry.TraceService,
  //     deps: [Router],
  //   },
  //   {
  //     provide: APP_INITIALIZER,
  //     useFactory: () => () => {return ""},
  //     deps: [Sentry.TraceService],
  //     multi: true,
  //   },
  // ],
})
export class SigninModule {}

