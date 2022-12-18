import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularmaterialModule } from '../../angularmaterial.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CustomerhomeComponent } from './customerhome/customerhome.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';


@NgModule({
  declarations: [CustomerhomeComponent, CustomerInfoComponent],
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    AngularmaterialModule, 
    FlexLayoutModule
  ],
  exports: [CustomerhomeComponent, CustomerInfoComponent],
})
export class CustomerinfoModule {}
