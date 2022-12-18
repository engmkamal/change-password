import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ChangeDetectorRef, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ControlContainer, FormGroupDirective} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Observable, Subscription } from 'rxjs';


const moment = _moment;

export const MY_DATEFORMATS = {
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
  selector: 'portal-requestorinfo',
  templateUrl: './requestorinfo.component.html',
  styleUrls: ['./requestorinfo.component.scss'],

  //standalone: true,
  //imports: [CommonModule, FormsModule, ReactiveFormsModule, AngularmaterialModule, FlexLayoutModule],
  //encapsulation: ViewEncapsulation.Emulated

  // providers: [
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  //   },

  //   {provide: MAT_DATE_FORMATS, useValue: MY_DATEFORMATS},

  //   { provide: ControlContainer, useExisting: FormGroupDirective }
  // ],
  
  
})

export class RequestorinfoComponent implements OnInit{
  
  @Input() public empInfo!: any;
  @Input() formGroup!: FormGroup;
   
  media$;
  _frmGrp!: FormGroup;
  
  disabled = true;
  
  private mediaSub!: Subscription;
  date = new FormControl(moment());
  private applicantInfo!: any;

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
  }

  ngOnDestroy(){
    if(this.mediaSub){
      this.mediaSub.unsubscribe();
    }
  }

  private addGroupToParent() {
    const config = {
      EmpName: [this.empInfo.EmpName],
      EmpCompanyName: [this.empInfo.EmpCompanyName],
      EmpId: [this.empInfo.EmpId],      
      EmpDesignation: [this.empInfo.EmpDesignation],
      EmpCompany1stAddress: [this.empInfo.EmpCompany1stAddress],
      Emp1stEmail: [this.empInfo.Emp1stEmail],
      Emp1stMobile: [this.empInfo.Emp1stMobile],
      //RequestDate: [this.requestorInfo.RequestDate],
    };
    this.formGroup.addControl('Employee', this.formbuilder.group(config)); 
  }
  
  feeedEmpInfo(){
    let EmpId = this._frmGrp.value.empInfo.EmpId;
    alert(EmpId);
  }
  
}






