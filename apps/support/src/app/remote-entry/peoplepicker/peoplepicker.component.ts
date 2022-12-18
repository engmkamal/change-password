import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ControlContainer, FormGroupDirective, ReactiveFormsModule, FormsModule, FormControlName } from '@angular/forms';
import { AngularmaterialModule } from '@portal/ui-components';
import { MediaChange, MediaObserver, FlexLayoutModule } from '@angular/flex-layout';
import { 
  //AppdataproviderService, 
  ISupModel } from '@portal/shared/data-access-user';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
//import {MatFormFieldModule} from '@angular/material/form-field';



export class State {
  constructor(
    public name: string, 
    public population: string, 
    public flag: string) { }
}


@Component({
  selector: 'portal-peoplepicker',
  templateUrl: './peoplepicker.component.html',
  styleUrls: ['./peoplepicker.component.scss'],
  //standalone: true,
  //imports: [CommonModule, FormsModule, ReactiveFormsModule, AngularmaterialModule, FlexLayoutModule],
})
export class PeoplepickerComponent {
  stateCtrl: FormControl;
  filteredPeople: Observable<any[]>;

  question = 'Would you like to add "';

  @Input()
  requestInfo!: any;

  people: any[] = [
    {
      value: 'Mohammad Abu Nader Al Mokaddes',
      description: 'Chief Information Officer, Information Technology',
      details: 'nader@bergerbd.com'
    },
    {
      value: 'Shoab Mahmood Al Naoshad',
      description: 'Head IT Infrastructure, Governance & Security, Information Technology',
      details: 'shoaib@bergerbd.com'
    },
    {
      value: 'Md Razibur Rahman',
      description: 'Head ERP Administration',
      details: 'razib@bergerbd.com'
    },
    {
      value: 'S M Tamjeed Hasan',
      description: 'Sr Solution Architect',
      details: 'tamjeed@bergerbd.com'
    },
    {
      value: 'Sheikh Mohammed Jamal',
      description: 'Head IT Infrastructure, Governance & Security, Information Technology',
      details: 'jamal@bergerbd.com'
    },
    {
      value: 'Md Sakibur Rahman',
      description: 'SOC Analyst',
      details: 'sakib@bergerbd.com'
    },
    {
      value: 'Ata Ullah Hasan Mahmud',
      description: 'Officer BASIS Administration',
      details: 'hasanm@bergerbd.com'
    },
    {
      value: 'Md Khalid Shifullah',
      description: 'SOC Analyst',
      details: 'shifullah@bergerbd.com'
    },
    {
      value: 'Tania  Ferdusi',
      description: 'ABAP & Fiori Developer',
      details: 'tania.ferdusi@bergerbd.com'
    },
    {
      value: 'Ryan Marzan',
      description: 'Software Engineer',
      details: 'ryan@bergerbd.com'
    },
    {
      value: 'Mostafa Kamal',
      description: 'Software Engineer',
      details: 'kamal@bergerbd.com'
    }
  ];

  formControlName: any;

  frmCtlName = "AssignedTo";

  @Output() changeSelection = new EventEmitter<any>();

  @Output() selectionAssignee = new EventEmitter<any>();

  @Input()
  childGroup!: any;

  @Input()
  formGroupName: any;

  @Input()
  formGroup!:any;

  AssignedToName: any = 'AssignedToName';

  @Output() outputToParent = new EventEmitter<any>();

  _showPickedUpBtn = false;
  _showQueryFrmAssigneeBtn = false;
  _showReadyforUATBtn = false;
  _showReleaseAssigneeBtn = false;
  _showReAssignBtn = false;

  _showActualTimeTakenFld = false;
  _showAcceptedTimeTakenFld = false;
  _showExpectedTimeTakenFld = false;
  _btnAssigneeDisabled = false;

  //appDataSubscription!: Subscription;

  _masterFrmStatus = "";

  currentAbsoluteUrl = window.location.href;

  parsedRequestInfoByPP:ISupModel = {
    uId: "",
    readMode: "",
    ID: null,
    Title: null,
    Status: null,
    //Requestor: {},
    AppParameters: {      
      ProblemDescription: {
        RequestFor: "",
        RequestCategory: "",
        Subject: "",
        Description: "",
      },
      PriorityInfo: {          
        Priority: "",
        EmergContact: "",
        BusinessImpact: "",
      },
      //SystemDetail: {},                    
      //ProcessLog: [],
      Attachments: [],
      Comments: "",
      AssignedTasks: [],
      ChildInfo: {},
      Action: ""
    },
    PendingTo: null,
    sapModules: [],
    otherCategories: []
  };

  constructor(
    public _controlContainer: ControlContainer,
    parent: FormGroupDirective,
    private _fb: FormBuilder,
    //private appdataproviderService: AppdataproviderService,
    private _httpClient: HttpClient,
    private router: Router
  ) {
      if (this.currentAbsoluteUrl.indexOf('=') > -1) {
      let varCurrentUrlSplitArray = this.currentAbsoluteUrl.split('?');
      if (varCurrentUrlSplitArray.length >= 1) {
        let queryString = varCurrentUrlSplitArray[1];
        let parameters = queryString.split('&');
        for (let i = 0; i < parameters.length; i++) {
          let param = parameters[i];
          if (param.toLowerCase().indexOf('guid=') > -1)
            this.parsedRequestInfoByPP.uId = param.split('=')[1];
          else if (param.toLowerCase().indexOf('mode=') > -1)
            this.parsedRequestInfoByPP.readMode = param.split('=')[1];
        }
      }
    }
    this.stateCtrl = new FormControl();
    this.filteredPeople = this.stateCtrl.valueChanges
      .pipe(
      startWith(''),
      map(state => state ? this.filterStates(state) : this.people.slice())
      );
  }

  ngOnInit(){   

    if( this.formGroup.value.AssignedTaskStatus == "Assigned" ){
      this._showPickedUpBtn = true;
      this._showExpectedTimeTakenFld = true;
      this._showActualTimeTakenFld = false;
    }
    else if( this.formGroup.value.AssignedTaskStatus == "TaskPickedUp" ){
      this._showQueryFrmAssigneeBtn = true;
      this._showReadyforUATBtn = true;
      this._showReleaseAssigneeBtn = true;
      this._showActualTimeTakenFld = true;
      this._showExpectedTimeTakenFld = true;
    }
    else if( this.formGroup.value.AssignedTaskStatus == "ReadyforUAT" ){
      this._showQueryFrmAssigneeBtn = true;
      this._showReleaseAssigneeBtn = true;
      this._showAcceptedTimeTakenFld = true;
      this._showExpectedTimeTakenFld = true;
      this._showActualTimeTakenFld = true;
    }
    else if( this.formGroup.value.AssignedTaskStatus == "ReAssigned" ){
      this._showPickedUpBtn = true;
      this._showExpectedTimeTakenFld = true;
      this._showActualTimeTakenFld = true;
    }

    if(this.parsedRequestInfoByPP.uId != "" ){
      this.getMasterListInfo(this.parsedRequestInfoByPP.uId);
    }
    
    // this.appDataSubscription = this.appdataproviderService.appData$.subscribe((res:any) => {
    //   if (res.uId != "") {
        
    //     this._masterFrmStatus = res.Status;

    //     this.parsedRequestInfoByPP.uId = res.uId;
    //     this.parsedRequestInfoByPP.Status = res.Status;
    //     this.parsedRequestInfoByPP.AppParameters = res.AppParameters;
    //     this.parsedRequestInfoByPP.ID = res.ID;
    //     this.parsedRequestInfoByPP.Title = res.Title;
    //     this.parsedRequestInfoByPP.PendingTo = res.PendingTo;
    //     this.parsedRequestInfoByPP.Requestor = res.Requestor;


    //     if(res.Status == "UATRequest" ){
    //       this._showQueryFrmAssigneeBtn = false;
    //       this._showReleaseAssigneeBtn = false;
    //       this._showReadyforUATBtn = false;
    //     }

    //     if(res.Status == "UATFeedbackFrmCustomer" ){
    //       this._showAcceptedTimeTakenFld = true;
    //       this._showQueryFrmAssigneeBtn = false;
    //       this._showReleaseAssigneeBtn = true;
    //       this._showReadyforUATBtn = false;
    //       this._showReAssignBtn = true;
    //     }

    //   }
    // });
  }

  filterStates(name: string) {
    let results = this.people.filter(state =>
      state.value.toLowerCase().indexOf(name.toLowerCase()) === 0);

    if (results.length < 1) {
      results = [this.question + name + '"?'];
    }
    this.changeSelection.emit(results);
    return results;
  }

  optionSelected(option:any) {
    console.log('optionSelected:', option.value);
    if (option.value.indexOf(this.question) === 0) {
      const newState = option.value.substring(this.question.length).split('"?')[0];
      this.people.push(newState);
      this.stateCtrl.setValue(newState);
    };

    this.people.some(entry => {
      if(entry.value === option.value){
        this.selectionAssignee.emit({
          AssignedToEmail: entry.details,
          AssignedToDesignation: entry.description
        });
      }
      
    })        
  };

  enter() {
    const value = this.stateCtrl.value;
    if (!this.people.some(entry => entry === value)) {
      this.people.push(value);
    }
    setTimeout(() => this.stateCtrl.setValue(value));
  }

  onKeyUpEvent(e:any) {
    this.enter();
  }

  _processAction(action:any){    

    if( (action == "PickedUp" || action == "ReadyforUAT" || action == "Assign" || action == "ReAssign" ) && localStorage.getItem('logedEmpEmail') == null){
      this.router.navigate(['/login']);          
    }

    this.formGroup.value.action = action;

    this.outputToParent.emit(this.formGroup.value);

    this._btnAssigneeDisabled = true;
    
  };

  getMasterListInfo(empADId?:any){
  
    return new Promise((resolve, reject)=>{
      try{

            this._httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('supportmaster')/items?&$top=2000&$select=*&$filter=GUID eq '${this.parsedRequestInfoByPP.uId}'`)
            .subscribe(
              (res:any)=>{

                this.parsedRequestInfoByPP.Requestor =                
                {
                  CustId: res.value[0].CustId,
                  CustName: res.value[0].CustName,
                  CustCompanyName: res.value[0].CustCompanyName,
                  CustCompany1stAddress: res.value[0].CustCompany1stAddress,
                  Cust1stEmail: res.value[0].Cust1stEmail,
                  Cust1stMobile: res.value[0].Cust1stMobile,
                  CustDesignation: res.value[0].CustDesignation
                };

                this.parsedRequestInfoByPP.AppParameters!.ProblemDescription =                
                {
                  RequestFor: res.value[0].RequestFor,
                  RequestCategory: res.value[0].RequestCategory,
                  Subject: res.value[0].Subject,
                  Description: res.value[0].Description,
                };


                this.parsedRequestInfoByPP.AppParameters!.PriorityInfo =                
                {
                  Priority: res.value[0].Priority,
                  EmergContact: res.value[0].EmergContact,
                  BusinessImpact: res.value[0].BusinessImpact,
                };

                this.parsedRequestInfoByPP.AppParameters!.Attachments = res.value[0].Attachments;               
                
                this.parsedRequestInfoByPP.AppParameters!.SystemDetail =                
                {                    
                  SystemType: res.value[0].SystemType,
                  SystemModule: res.value[0].SystemModule,        
                  SAPCustomerNumber: res.value[0].SAPCustomerNumber,
                  SUser: res.value[0].SUser,
                  SystemDescription: res.value[0].SystemDescription,
                  Manufacturer: res.value[0].Manufacturer,
                  Model: res.value[0].Model,
                  OperatingSystem: res.value[0].OperatingSystem,
                  OSRelease: res.value[0].OSRelease,
                  DatabaseName: res.value[0].DatabaseName,
                  DatabaseRelease: res.value[0].DatabaseRelease,
                  PersonIncharge: res.value[0].PersonIncharge,
                  SIContactNo: res.value[0].SIContactNo,
                  SIEmail: res.value[0].SIEmail,
                };

                if(res.value[0].Status == "UATRequest" ){
                  this._showQueryFrmAssigneeBtn = false;
                  this._showReleaseAssigneeBtn = false;
                  this._showReadyforUATBtn = false;
                }
        
                if(res.value[0].Status == "UATFeedbackFrmCustomer" ){
                  this._showAcceptedTimeTakenFld = true;
                  this._showQueryFrmAssigneeBtn = false;
                  this._showReleaseAssigneeBtn = true;
                  this._showReadyforUATBtn = false;
                  this._showReAssignBtn = true;
                }

              
              let allPendingObj = JSON.parse(res.value[0].PendingTo);
              
              if(allPendingObj.length >0 ){
                this.parsedRequestInfoByPP = { 
                  uId: this.parsedRequestInfoByPP.uId,
                  readMode: this.parsedRequestInfoByPP.readMode,
                  ID: res.value[0].ID,
                  Title: res.value[0].Title,
                  Status: res.value[0].Status,
                  PendingTo: allPendingObj,
                  Requestor: this.parsedRequestInfoByPP.Requestor,
                  AppParameters: this.parsedRequestInfoByPP.AppParameters 
                };      

              }else{
                this.parsedRequestInfoByPP = { 
                  uId: this.parsedRequestInfoByPP.uId,
                  readMode: this.parsedRequestInfoByPP.readMode,
                  ID: res.value[0].ID,
                  Title: res.value[0].Title,
                  Status: res.value[0].Status,
                  PendingTo: "",
                  Requestor: this.parsedRequestInfoByPP.Requestor,
                  AppParameters: this.parsedRequestInfoByPP.AppParameters 
                }
              }

              
              resolve(this.parsedRequestInfoByPP);
              return this.parsedRequestInfoByPP;
            })            
      } 
      catch(err){
        reject('Retrieve master data failed !');
        console.log("Error: " + err);
      }
    })
  };

  ngOnDestroy(){
    //this.appDataSubscription.unsubscribe();
  };


}

