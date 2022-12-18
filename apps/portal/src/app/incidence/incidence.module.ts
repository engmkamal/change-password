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


import {
  UiComponentsModule,
  AttachmentprimengModule,
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
import { HomemenusComponent } from './homemenus/homemenus.component';
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
    RouterModule.forChild([
      {
        path: 'incidence',
        children: [
          {
            path: 'support',
            component: SupporthomeComponent,
          },
          {
            path: '',
            redirectTo: 'support',
            pathMatch: 'full',
          },
        ],
      },
      // {
      //   path: 'supporthome',
      //   component: SupporthomeComponent,
      // },
      // {
      //   path: 'request',
      //   component: SupportparentComponent,
      // },
      // {
      //   path: 'supporthome',
      //   children: [
      //     {
      //       path: 'supporthome',
      //       component: SupporthomeComponent,
      //     },
      //   ],
      // },
      // {
      //   path: 'tasksboard',
      //   component: TasksboardComponent,
      // },
      // {
      //   path: 'wf',
      //   loadChildren: () =>
      //     import('./workflow/workflow.module').then((m) => m.WorkflowModule),
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
      //   component: SupporthomeComponent
      // }

    ]),
    AttachmentprimengModule,
    AngularEditorModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    SweetAlert2Module.forRoot()
  ],
  exports: [],
  providers: [
    SplistcrudService,
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_MOMENT_FORMATS },
  ]
})
export class IncidenceModule {}

