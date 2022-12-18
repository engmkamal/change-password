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
import { SupporthomeComponent } from './supporthome/supporthome.component';
import { SupportparentComponent } from './supportparent/supportparent.component';
import { SupportformComponent } from './supportform/supportform.component';

//import { createCustomElement } from '@angular/elements';
import {
  CardtemplettiltedComponent,
  DropdownAutocompleteComponent,
  RequestorComponent,
  SupportcustomerComponent,
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
    SupporthomeComponent,
    SupportparentComponent,
    SupportformComponent,
    TasksboardComponent,
    HomemenusComponent
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
      // {
      //   path: 'tasksboard',
      //   component: TasksboardComponent,
      // },
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
      // {
      //   path: 'tasks',
      //   loadChildren: () => import('./project/project.module').then((m) => m.ProjectModule)
      // },

      {
        path: '',
        component: SupporthomeComponent,
      },

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
      // },

      // SigninModule,
      // IncidenceModule,
      // TasksModule,
      // MyappliedworkflowModule,
    ])
  ],
  exports: [],
  providers: [SplistcrudService]
})
export class RemoteEntryModule {}
