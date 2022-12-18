import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayanyinfohomeComponent } from './displayanyinfohome/displayanyinfohome.component';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [DisplayanyinfohomeComponent],
  imports: [
    CommonModule,
    AgGridModule,
    //AgGridModule.withComponents([])
  ],
  exports: [DisplayanyinfohomeComponent],
})
export class DisplayanyinfoModule {}



