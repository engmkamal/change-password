import {
  NgModule,
  APP_INITIALIZER,
  ErrorHandler,
  InjectionToken,
} from '@angular/core';
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
import { SupporthomeComponent } from './supporthome/supporthome.component';
import { SupportparentComponent } from './supportparent/supportparent.component';
import { SupportformComponent } from './supportform/supportform.component';

//import { createCustomElement } from '@angular/elements';
import {
  UiComponentsModule,
  AttachmentprimengModule,
  CustomerinfoModule,
  CardtemplettiltedComponent,
  DropdownAutocompleteComponent,
  RequestorComponent,
} from '@portal/ui-components';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedDataAccessUserModule } from '@portal/shared/data-access-user';

import { JsonSchemaFormModule } from '@dashjoin/json-schema-form';
import { TasksboardComponent } from './tasksboard/tasksboard.component';

import {
  startsWith,
  WebComponentWrapper,
  WebComponentWrapperOptions,
} from '@angular-architects/module-federation-tools';
import { WorkflowModule } from './workflow/workflow.module';
import { HomemenusComponent } from './homemenus/homemenus.component';
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PeoplepickerComponent } from './peoplepicker/peoplepicker.component';
import { DatetimepickerComponent } from './datetimepicker/datetimepicker.component';

import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
  NGX_MAT_DATE_FORMATS,
  NgxMatDateFormats,
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatIconModule } from '@angular/material/icon';

import 'ag-grid-enterprise';
import { GroupcontrolComponent } from './groupcontrol/groupcontrol.component';
import { ConditionFormComponent } from './condition-form/condition-form.component';
import { ActionButtonsBarComponent } from './action-buttons-bar/action-buttons-bar.component';
import { TaskassigneeselectComponent } from './taskassigneeselect/taskassigneeselect.component';
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";

export const NGX_MAT_DATEX = new InjectionToken<NgxMatDateFormats>(
  'ngx-mat-date-formats'
);

const CUSTOM_MOMENT_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'DD-MM/YYYY, LTS',
  },
  display: {
    dateInput: 'MM-DD-YYYY, LTS',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
// import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    RemoteEntryComponent,
    NxWelcomeComponent,
    SupporthomeComponent,
    SupportparentComponent,
    SupportformComponent,
    TasksboardComponent,
    HomemenusComponent,
    DatetimepickerComponent,
    PeoplepickerComponent,
    GroupcontrolComponent,
    ConditionFormComponent,
    ActionButtonsBarComponent,
    TaskassigneeselectComponent,
  ],
  imports: [
    CommonModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    AngularmaterialModule,
    UtilsModule,
    UiModule,
    UiComponentsModule,
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
    JsonSchemaFormModule,    
    //WorkflowModule,
    RouterModule.forChild([
      {
        path: 'supporthome',
        component: SupporthomeComponent,
      },
      {
        path: 'request',
        component: SupportparentComponent,
      },
      {
        path: 'supporthome',
        //loadChildren: () => import('./entry.module').then(m => m.RemoteEntryModule)
        children: [
          {
            path: 'supporthome',
            component: SupporthomeComponent,
          },
        ],
      },
      {
        path: 'tasksboard',
        component: TasksboardComponent,
      },
      {
        path: 'wf',
        loadChildren: () =>
          import('./workflow/workflow.module').then((m) => m.WorkflowModule),
      },
      {
        matcher: startsWith('itservicerequest'),
        component: WebComponentWrapper,
        data: {
          remoteEntry: 'http://localhost:4202/remoteEntry.mjs',
          // remoteEntry: 'http://localhost:4202/remoteEntry.js',
          remoteName: 'itservicerequest',
          exposedModule: './web-components',
          elementName: 'itservicerequest-home-element',
        } as WebComponentWrapperOptions,
      },
      {
        path: '',
        component: SupporthomeComponent,
        //component: SupportparentComponent,
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
    //FontAwesomeModule,
    AngularEditorModule,
    //AgGridModule
    // NzSpinModule,
    // NzIconModule.forRoot([]),
    // environment.production ? [] : AkitaNgDevtools,
    // AkitaNgRouterStoreModule,
    // QuillModule.forRoot()
    NgxMatDatetimePickerModule,

    NgxMatTimepickerModule,
    NgxMatMomentModule,
    SweetAlert2Module.forRoot()
  ],
  exports: [],
  providers: [
    SplistcrudService,
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_MOMENT_FORMATS },
  ],
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
export class RemoteEntryModule {}
