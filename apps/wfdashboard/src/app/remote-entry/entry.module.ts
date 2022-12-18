import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

import {
  UtilsModule,
  AngularmaterialModule,
  // AccordionLinkDirective,
  // AccordionDirective,
  // AccordionAnchorDirective
} from '@portal/utils';

import { RemoteEntryComponent } from './entry.component';
//import { NxWelcomeComponent } from './nx-welcome.component';
import { DashboardshomeComponent } from './dashboardshome/dashboardshome.component';
import { MasterdetailsrendererComponent } from './masterdetailsrenderer/masterdetailsrenderer.component';
import { ParentdashboardlandingComponent } from './parentdashboardlanding/parentdashboardlanding.component';
import { ParentreportlandingComponent } from './parentreportlanding/parentreportlanding.component';

import 'ag-grid-enterprise';

@NgModule({
  declarations: [
    RemoteEntryComponent, 
    //NxWelcomeComponent, 
    DashboardshomeComponent, 
    MasterdetailsrendererComponent, 
    ParentdashboardlandingComponent, 
    ParentreportlandingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AgGridModule,
    //AgGridModule.withComponents([]),
    //HttpClientModule,
    AngularmaterialModule,
    RouterModule.forChild([
      {
        path: ':id/report',
        component: ParentreportlandingComponent 
      },
      {
        path: ':id/renderer',
        component: MasterdetailsrendererComponent 
      },
      {
        path: ':id',
        component: ParentdashboardlandingComponent
        
        // children: [
        //   {
        //     path: '',
        //     component: ParentdashboardlandingComponent
        //   },
        //   {
        //     path: 'masterdetail',
        //     component: MasterdetailslandingComponent
        //   },
        //   {
        //     path: 'report',
        //     component: ParentreportlandingComponent
        //   }  
        // ]
      },
      {
        path: '',
        component: DashboardshomeComponent,
        //   component: RemoteEntryComponent,
      },      
    ]),
  ],
  providers: [],
})
export class RemoteEntryModule {}

