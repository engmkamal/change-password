import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularmaterialModule } from '../../angularmaterial.module';
import { SupportapplicantComponent } from './supportapplicant/supportapplicant.component';

@NgModule({
  declarations: [SupportapplicantComponent],
  imports: [CommonModule],
  exports: [SupportapplicantComponent],
})
export class SupportapplicantModule {}
