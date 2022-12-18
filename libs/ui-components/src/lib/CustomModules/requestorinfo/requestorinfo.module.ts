import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularmaterialModule } from '../../angularmaterial.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { RequestorinfoComponent } from './requestorinfo/requestorinfo.component';
import { RequestorhomeComponent } from './requestorhome/requestorhome.component';

@NgModule({
  declarations: [
    RequestorinfoComponent,
    RequestorhomeComponent
  ],
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    AngularmaterialModule, 
    FlexLayoutModule
  ],
  exports: [
    RequestorinfoComponent,
    RequestorhomeComponent
  ],
})
export class RequestorinfoModule {}



