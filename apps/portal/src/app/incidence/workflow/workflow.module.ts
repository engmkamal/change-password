import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import {
  UtilsModule,
  AngularmaterialModule,
  // AccordionLinkDirective,
  // AccordionDirective,
  // AccordionAnchorDirective
} from '@portal/utils';

import {
  UiModule
} from '@portal/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ResizableModule } from 'angular-resizable-element';
import { AngularResizeEventModule } from 'angular-resize-event';
//import { ResizableComponent } from './itservicehome/resizable/resizable.component';
//import { DragndresizeableComponent } from './itservicehome/dragndresizeable/dragndresizeable.component';

//import { FlexLayoutModule } from '@angular/flex-layout';
//import { ChartistModule } from 'ng-chartist';

import { WorkflowhomeComponent } from './workflowhome/workflowhome.component';
//import { SidebarComponent } from './itservicehome/sidebar/sidebar.component';
//import { SpinnerComponent } from './itservicehome/spinner.component';

import { SplistcrudService } from '@portal/core';


@NgModule({
  declarations: [WorkflowhomeComponent],
  imports: [
    CommonModule, 
    WorkflowRoutingModule,    
    AngularmaterialModule,
    //FlexLayoutModule,
    //ChartistModule,
    UtilsModule,
    UiModule,
    // AccordionLinkDirective,
    // AccordionDirective,
    // AccordionAnchorDirective,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ResizableModule,
    AngularResizeEventModule,
  ],
  exports: [WorkflowhomeComponent],
  providers: [SplistcrudService]
})
export class WorkflowModule {}
