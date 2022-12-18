// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MysapworkflowComponent } from './mysapworkflow/mysapworkflow.component';
// import { MyappliedworkflowhomeComponent } from './myappliedworkflowhome/myappliedworkflowhome.component';
// import { MyworkflowlandingComponent } from './myworkflowlanding/myworkflowlanding.component';

// @NgModule({
//   declarations: [
//     MysapworkflowComponent,
//     MyappliedworkflowhomeComponent,
//     MyworkflowlandingComponent,
//   ],
//   imports: [CommonModule],
// })
// export class MyappliedworkflowModule {}
//===============================================
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

import {
  UtilsModule,
  AngularmaterialModule,
} from '@portal/utils';


import { MyappliedworkflowhomeComponent } from './myappliedworkflowhome/myappliedworkflowhome.component';

import { MyworkflowlandingComponent } from './myworkflowlanding/myworkflowlanding.component';



import { MysapworkflowComponent } from './mysapworkflow/mysapworkflow.component';


@NgModule({
  declarations: [
    MyappliedworkflowhomeComponent,
    MyworkflowlandingComponent,
    MysapworkflowComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AgGridModule,
    //AgGridModule.withComponents([]),
    AngularmaterialModule,
    RouterModule.forChild([
      {
        path: 'myrequests',
        children: [
          {
            path: ':id',
            component: MyworkflowlandingComponent,
          },
          {
            path: '',        
            component: MyappliedworkflowhomeComponent
          },
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
  exports: [],
})
export class MyappliedworkflowModule {}

