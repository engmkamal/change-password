// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'portal-supportform',
//   templateUrl: './supportform.component.html',
//   styleUrls: ['./supportform.component.scss']
// })
// export class SupportformComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

//=======================
// import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'portal-supportcustomer',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './supportcustomer.component.html',
//   styleUrls: ['./supportcustomer.component.scss'],
//   encapsulation: ViewEncapsulation.Emulated,
// })
// export class SupportcustomerComponent implements OnInit {
//   constructor() {}

//   ngOnInit(): void {}
// }

//=============================
import { Component, OnDestroy, OnInit, ChangeDetectorRef, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ControlContainer, FormGroupDirective, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
//import {default as _rollupMoment} from 'moment';
import { MediaChange, MediaObserver, FlexLayoutModule } from '@angular/flex-layout';
import { Observable, Subscription } from 'rxjs';


const moment = _moment;

export const SF_DATEFORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'portal-supportform',
  templateUrl: './supportform.component.html',
  styleUrls: ['./supportform.component.scss']
})

export class SupportformComponent implements OnInit{
  
  @Input() public requestorsInfo!: any;
  @Input() formGroup!: FormGroup;
   
  media$;
  _frmGrp!: FormGroup;
  
  disabled = true;
  
  private mediaSub!: Subscription;
  date = new FormControl(moment());
  

  constructor(private controlContainer: ControlContainer, 
    parent: FormGroupDirective, 
    private formbuilder: FormBuilder,
    private mediaObserver: MediaObserver,
    private cdRef: ChangeDetectorRef
    ) {
      this.formGroup = parent.control;
      this.media$ = mediaObserver.asObservable();    
  }  
  

  ngOnInit() {
    this._frmGrp = this.controlContainer.control as FormGroup;
    this.addGroupToParent();
    //console.log("Requestor component initialized !!");
  }

  ngOnDestroy(){
    if(this.mediaSub){
      this.mediaSub.unsubscribe();
    }
  }



  private addGroupToParent() {
    const config = {
      EmployeeName: [this.requestorsInfo.EmployeeName],
      Company: [this.requestorsInfo.Company],
      EmployeeId: [this.requestorsInfo.EmployeeId],
      OfficeLocation: [this.requestorsInfo.OfficeLocation],
      Designation: [this.requestorsInfo.Designation],
      Department: [this.requestorsInfo.Department],
      Email: [this.requestorsInfo.Email],
      CostCenter: [this.requestorsInfo.CostCenter],
      Mobile: [this.requestorsInfo.Mobile],
      RequestDate: [this.requestorsInfo.RequestDate]
    };
    this.formGroup.addControl('Requestor', this.formbuilder.group(config));  

    // this._frmGrp.addControl('Requestor', this.formbuilder.group(data2));
  }  
  
}






