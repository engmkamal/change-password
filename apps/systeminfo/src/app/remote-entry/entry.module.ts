// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// import { RemoteEntryComponent } from './entry.component';
// import { NxWelcomeComponent } from './nx-welcome.component';
// import { SysteminfohomeComponent } from './systeminfohome/systeminfohome.component';

// @NgModule({
//   declarations: [
//     RemoteEntryComponent,
//     NxWelcomeComponent,
//     SysteminfohomeComponent,
//   ],
//   imports: [
//     CommonModule,
//     RouterModule.forChild([
//       {
//         path: '',
//         component: SysteminfohomeComponent
//         //component: RemoteEntryComponent,
//       },
//     ]),
//   ],
//   providers: [],
// })
// export class RemoteEntryModule {}
//========================
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

import {
  UtilsModule,
  AngularmaterialModule
} from '@portal/utils';

import { RemoteEntryComponent } from './entry.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { SysteminfohomeComponent } from './systeminfohome/systeminfohome.component';

@NgModule({
  declarations: [
    RemoteEntryComponent,
    NxWelcomeComponent,
    SysteminfohomeComponent
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
        path: '',
        component: SysteminfohomeComponent
        //component: RemoteEntryComponent,
      },
    ]),
  ],
  providers: [],
  exports: [RemoteEntryComponent],
})
export class RemoteEntryModule {}

