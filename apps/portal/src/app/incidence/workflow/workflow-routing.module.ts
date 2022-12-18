import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowhomeComponent } from './workflowhome/workflowhome.component';
//import {} from '../itservice/itservice.module';

const routes: Routes = [
  // {
  //   path: 'itequipmententry',
  //   loadChildren: () =>
  //     import('itequipmententry/Module').then((m) => m.RemoteEntryModule),
  // },
  // {
  //   path: 'itservice',
  //   loadChildren: () =>
  //     import('../itservice/itservice.module').then((m) => m.ItserviceModule),
  // },
  // {
  //   path: 'carecard',
  //   loadChildren: () =>
  //     import('../carecard/carecard.module').then((m) => m.CarecardModule),
  // },  
  {
    path: '',
    component: WorkflowhomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }
