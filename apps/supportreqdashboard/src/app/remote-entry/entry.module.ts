import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

import { UtilsModule, AngularmaterialModule } from '@portal/utils';

import { MyappliedworkflowhomeComponent } from './myappliedworkflowhome/myappliedworkflowhome.component';
import { MyworkflowlandingComponent } from './myworkflowlanding/myworkflowlanding.component';
import { MysapworkflowComponent } from './mysapworkflow/mysapworkflow.component';
import { RemoteEntryComponent } from './entry.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { MynonsapworkflowComponent } from './mynonsapworkflow/mynonsapworkflow.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SupportdashboardComponent } from './supportdashboard/supportdashboard.component';

@NgModule({
  declarations: [
    MyappliedworkflowhomeComponent,
    MyworkflowlandingComponent,
    MysapworkflowComponent,
    RemoteEntryComponent,
    NxWelcomeComponent,
    MynonsapworkflowComponent,
    SupportdashboardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AgGridModule,
    //AgGridModule.withComponents([]),
    AngularmaterialModule,
    FlexLayoutModule,
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: ':id',
            component: MyworkflowlandingComponent,
          },
          {
            path: '',
            component: SupportdashboardComponent,
            pathMatch: 'full'
          },
        ],
      }
    ]),
  ],
  providers: [],
  exports: [],
})
export class RemoteEntryModule {}
