import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

import {
  UtilsModule,
  AngularmaterialModule,
} from '@portal/utils';

import { RemoteEntryComponent } from './entry.component';
import { DashboardshomeComponent } from './dashboardshome/dashboardshome.component';
import { MasterdetailsrendererComponent } from './masterdetailsrenderer/masterdetailsrenderer.component';
import { ParentdashboardlandingComponent } from './parentdashboardlanding/parentdashboardlanding.component';
import { ParentreportlandingComponent } from './parentreportlanding/parentreportlanding.component';
import { DelegatedtasksComponent } from './delegatedtasks/delegatedtasks.component';
import { PendingtasksComponent } from './pendingtasks/pendingtasks.component';
import { PendingTaskshomeComponent } from './pending-taskshome/pending-taskshome.component';


@NgModule({
  declarations: [
    RemoteEntryComponent,
    DashboardshomeComponent,
    MasterdetailsrendererComponent,
    ParentdashboardlandingComponent,
    ParentreportlandingComponent,
    DelegatedtasksComponent,
    PendingtasksComponent,
    PendingTaskshomeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AgGridModule,
    //AgGridModule.withComponents([]),
    AngularmaterialModule,
    RouterModule.forChild([
      {
        path: 'tasks',
        children: [
          {
            path: 'pendingtasks',
            component: PendingTaskshomeComponent,
          }
        ],
      },
      // {
      //   path: ':id/report',
      //   component: ParentreportlandingComponent,
      // },
      // {
      //   path: ':id/renderer',
      //   component: MasterdetailsrendererComponent,
      // },
      // {
      //   path: ':id',
      //   component: ParentreportlandingComponent,
      // },
      // {
      //   path: '',        
      //   component: PendingTaskshomeComponent
      // },
    ])
  ],
  providers: [],
  exports: [RemoteEntryComponent],
})
export class TasksModule {}

