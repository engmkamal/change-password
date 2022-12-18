// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'portal-supportapplicant',
//   templateUrl: './supportapplicant.component.html',
//   styleUrls: ['./supportapplicant.component.scss'],
// })
// export class SupportapplicantComponent implements OnInit {
//   constructor() {}

//   ngOnInit(): void {}
// }
//========================
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ChangeDetectorRef, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ControlContainer, FormGroupDirective, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
//import {default as _rollupMoment} from 'moment';
import { MediaChange, MediaObserver, FlexLayoutModule } from '@angular/flex-layout';
import { Observable, Subscription } from 'rxjs';
import { AngularmaterialModule } from '../../../angularmaterial.module';
import { PendingwithComponent } from '../../../pendingwith/pendingwith.component';

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
  selector: 'portal-supportapplicant',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AngularmaterialModule, PendingwithComponent, FlexLayoutModule],
  templateUrl: './supportapplicant.component.html',
  styleUrls: ['./supportapplicant.component.scss'],
  // providers: [
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  //   },

  //   {provide: MAT_DATE_FORMATS, useValue: MY_DATEFORMATS},

  //   { provide: ControlContainer, useExisting: FormGroupDirective }
  // ],
  encapsulation: ViewEncapsulation.Emulated,
  
})

export class SupportapplicantComponent implements OnInit{
  
  @Input() public requestorsInfo!: any;
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
      
      // if(this.requestorsInfo == undefined){

      //   this.applicantInfo.CustName = "";
      //   this.applicantInfo.CustCompanyName = "";
      //   this.applicantInfo.CustId = "";
      //   this.applicantInfo.CustDesignation = "";
      //   this.applicantInfo.CustCompany1stAddress = "";
      //   this.applicantInfo.Cust1stEmail = "";
      //   this.applicantInfo.Cust1stMobile = "";

      // }else{

      //   this.applicantInfo.CustName = JSON.parse(JSON.stringify(this.requestorsInfo.CustName));
      //   this.applicantInfo.CustCompanyName = JSON.parse(JSON.stringify(this.requestorsInfo.CustCompanyName));
      //   this.applicantInfo.CustId = JSON.parse(JSON.stringify(this.requestorsInfo.CustId));
      //   this.applicantInfo.CustDesignation = JSON.parse(JSON.stringify(this.requestorsInfo.CustDesignation));
      //   this.applicantInfo.CustCompany1stAddress = JSON.parse(JSON.stringify(this.requestorsInfo.CustCompany1stAddress));
      //   this.applicantInfo.Cust1stEmail = JSON.parse(JSON.stringify(this.requestorsInfo.Cust1stEmail));
      //   this.applicantInfo.Cust1stMobile = JSON.parse(JSON.stringify(this.requestorsInfo.Cust1stMobile));
        
      // }   
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
      CustName: [this.requestorsInfo.CustName],
      CustCompanyName: [this.requestorsInfo.CustCompanyName],
      CustId: [this.requestorsInfo.CustId],      
      CustDesignation: [this.requestorsInfo.CustDesignation],
      CustCompany1stAddress: [this.requestorsInfo.CustCompany1stAddress],
      Cust1stEmail: [this.requestorsInfo.Cust1stEmail],
      Cust1stMobile: [this.requestorsInfo.Cust1stMobile],
      //RequestDate: [this.applicantInfo.RequestDate]
    };
    this.formGroup.addControl('Requestor', this.formbuilder.group(config));  

    // this._frmGrp.addControl('Requestor', this.formbuilder.group(data2));
  }
  
  feeedCustomerInfo(){
    let custId = this._frmGrp.value.requestorsInfo.CustId;
    alert(custId);
  }
  
}






