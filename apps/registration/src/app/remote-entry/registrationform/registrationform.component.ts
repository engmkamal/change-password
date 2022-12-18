// @ts-nocheck

import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Schema } from "@dashjoin/json-schema-form";
import { SharepointlistService } from '@portal/core';
//import { UserService, ICustomer } from '@portal/shared/data-access-user';
import { from, Observable, BehaviorSubject } from 'rxjs'; 

//=========for access token =========
// import * as spauth from 'node-sp-auth';
// import * as requestprom from 'request-promise';
import * as $ from 'jquery';
import { get } from 'scriptjs'; //### to dynamically lazy loading script file ###
import {DOCUMENT} from "@angular/common";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forEach } from 'lodash';

import { IProcessLogs, IAttachmentFiles, IAttachment, ISystemDetail, IRequestor, IAppParameters, ISupModel } from '../core/interfaces/Supportmodel';
//import { DatatabledisplayinfoComponent } from '@portal/ui-components';
import { PasswordStrengthValidator } from "../password-strength.validators";
import Swal from 'sweetalert2';
import { is } from 'immer/dist/internal';


@Component({
  selector: 'portal-registrationform',
  templateUrl: './registrationform.component.html',
  styleUrls: ['./registrationform.component.scss']
})
export class RegistrationformComponent implements OnInit {
  //========================
  currentAbsoluteUrl = window.location.href;
  readMode = "";
  uId = "";
  
  listInfo = {
    name: "",
    select: "",
    expand: "",
    filterBy: "",
    filterWith: "",
    top: ""
  };

  parsedRequestInfo = { 
    uId: "",
    readMode: "",
    ID: null,
    Title: null,
    Status: null,
    AppParameters: {
      Requestor: {},
      SystemDetails: [],                    
      ProcessLog: [],
      Attachments: []
    },
    PendingWith: null,
    RequestorAdId: null,
    
  };

  //requestorsInfo!: ICustomer;

  PendingWith = "Mostafa Kamal";
  approvalHistory: any = [];
  allApprovers: any = {};
  @Output() outputToParent = new EventEmitter<any>();
  @Output() btnClickAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() approverAction: EventEmitter<any> = new EventEmitter<any>();

  disabled = false; //disabled input text field for Suppord Info Grp
  SupportInfoFG:FormGroup;

  showReqInfoDiv: boolean = false;
  
  supModel:ISupModel = {
    uId: "",
    readMode: "",
    ID: null,
    Title: null,
    Status: null,
    AppParameters: {
      Requestor: {},
      SystemDetails: [],                    
      ProcessLog: [],
      Attachments: []
    },
    PendingWith: null,
    RequestorAdId: null,
  };
  



  //-----for attachment -----

  @ViewChild('attachments') attachment: any;

  fileList: File[] = [];
  listOfFiles: any[] = [];
  isLoading = false;
  //-----------------------
  _form!: FormGroup;

  requestorsInfo:any;

  // requestorsInfo = {
  //   CustName: 'Mostafa Kamal',
  //   CustCompanyName: 'BPBL',
  //   CustId: '1270',
  //   CustCompanyAddress: 'Corporate',
  //   CustDesignation: 'Kamal',
  //   CustEmail: 'kamal@bergerbd.com',
  //   CostCenter: '77777777',
  //   CustContact: '345464',
  //   RequestDate: '2022'
  // };

  panelOpenState = false;

  openedStartDrawer = false;
  openedEndDrawer = false;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  requestInfo: any = {};

 // @ViewChild(MatAccordion) accordion: MatAccordion;


  addMoreAddress = false;
  addMoreEmail = false; 
  addMoreMobile = false; 
  addMorePhone = false;

  phonePattern = /^[0-9]{10,12}$/;
  emailPattern1 = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  emailPattern2 = /^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})$/;
  emailPattern3 = /^[\w]{1,}[\w.+-]{0,}@[\w-]{2,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/;

  private isIdRegistered = new BehaviorSubject(false);
  isIdRegistered$ = this.isIdRegistered.asObservable();

  //== for JSOM API ==
  oListItems: any;
  clientContext: any;

  urls:any = []; //for attachment

  

  systemTypes: any[] = [
    {value: 'SAP', viewValue: 'SAP'},
    {value: 'Others', viewValue: 'Others'}
  ];

  // systemModules: any[] = [
  //   {value: 'Financial Accounting and Controlling (FICO)', viewValue: 'Financial Accounting and Controlling (FICO)'},
  //   {value: 'Material Management (MM)', viewValue: 'Material Management (MM)'},
  //   {value: 'Plant Maintenance (PM)', viewValue: 'Plant Maintenance (PM)'},
  //   {value: 'Quality Management (QM)', viewValue: 'Quality Management (QM)'},
  //   {value: 'Success Factor (SF)', viewValue: 'Success Factor (SF)'},
  //   {value: 'Production Planning (PP)', viewValue: 'Production Planning (PP)'},
  //   {value: 'Sales Distribution (SD)', viewValue: 'Sales Distribution (SD)'},
  //   {value: 'Financial Supply Chain Management (FSCM)', viewValue: 'Financial Supply Chain Management (FSCM)'},
  //   {value: 'Enterprise Asset Management (EAM)', viewValue: 'OtEnterprise Asset Management (EAM)hers'},
  //   {value: 'Others', viewValue: 'Others'}
  // ];
  

  allProcessLogs:IProcessLogs[];
  allAttachments:IAttachment[];

  public ApprovalLogComponent: any;

  _newCustId = "";
  passwordErr = "";
  swConfirmPasswordErr = false;
  disableCustRegActionBtn = false
  swReviewOtherSIBtn = false;
  swCompleteBtn = false;
  _pendingWith = "";

  sapModules: any[] = [
    {group: 'SAP', groupItems: [
      {value: 'Financial Accounting and Controlling - FICO', viewValue: 'Financial Accounting and Controlling - FICO'},
      {value: 'Material Management - MM', viewValue: 'Material Management - MM'},
      {value: 'Plant Maintenance - PM', viewValue: 'Plant Maintenance - PM'},
      {value: 'Quality Management - QM', viewValue: 'Quality Management - QM'},
      {value: 'Success Factor - SF', viewValue: 'Success Factor - SF'},
      {value: 'Production Planning - PP', viewValue: 'Production Planning - PP'},
      {value: 'Sales Distribution - SD', viewValue: 'Sales Distribution - SD'},
      {value: 'Human Capital Management - HCM', viewValue: 'Human Capital Management - HCM'},
      {value: 'Project System - PS', viewValue: 'Project System - PS'},
      {value: 'Business Warehouse - BW', viewValue: 'Business Warehouse - BW'},
      {value: 'Fiori Apps', viewValue: 'Fiori Apps'},
      {value: 'Solution Manager', viewValue: 'Solution Manager'},
      {value: 'Others', viewValue: 'Others'}
    ]}
  ];

  otherCategories: any[] = [
    {group: 'Others', groupItems: [
      {value: 'Business Automation', viewValue: 'Business Automation'},
      {value: 'Cloud Solution', viewValue: 'Cloud Solution'},
      {value: 'IT Audit', viewValue: 'IT Audit'},
      {value: 'IT Security Solution', viewValue: 'IT Security Solution'},
      {value: 'Others', viewValue: 'Others'}
    ]}
  ];

  requestForCategories = [
    {group: 'SAP', groupItems: [
      {value: '', viewValue: ''}
    ]},
    {group: 'Others', groupItems: [
      {value: '', viewValue: ''}
    ]}     
  ]
  
  validationMessages = {
    //CustPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50), PasswordStrengthValidator])],
    CustName: {
      required: 'Name is required',
      minlength: 'Name must be greater than 5 characters',
      maxlength: 'Name must be less than 50 characters'
    },
    CustCompanyName: {
      required: 'Company Name is required',
      minlength: 'CompanyName must be greater than 5 characters',
      maxlength: 'CompanyName must be less than 250 characters'
    },
    CustCompany1stAddress: {
      required: 'Address is required',
      minlength: 'Address must be greater than 9 characters'
    },
    CustDesignation: {
      required: 'Designation is required',
      minlength: 'Designation must be greater than 9 characters',
      maxlength: 'Designation must be less than 100 characters'
    },    
    Cust1stMobile: {
      required: 'Mobile no is required',
      minlength: 'Must be greater than 10 characters',
      maxlength: 'Must be less than 15 characters',
      pattern: 'Must be number & 11 - 13 charecters'
    },
    Cust1stPhone: {
      required: 'Phone no is required'
    },    
    RegistrationFor: {
      required: 'RegistrationFor is required'
    }         
  };

  formErrors = {
    CustName: "",
    CustCompanyName: "",
    CustCompany1stAddress: "",
    Cust1stPhone: "",
    Cust1stMobile: "",
    CustDesignation: "",
    RegistrationFor: "" 
  };

  isDisableRequestor = true;

  constructor(
    private formBuilder: FormBuilder,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    //public userService: UserService,
    public sharepointlistService: SharepointlistService,
    //@Inject(DOCUMENT) private htmlDocument: Document, 
    private renderer: Renderer2,
    private httpClient: HttpClient) {
    this.openedStartDrawer = false;
    this.openedEndDrawer = true;

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    // if (this.currentAbsoluteUrl.indexOf('=') > -1) {
    //   let varCurrentUrlSplitArray = this.currentAbsoluteUrl.split('?');
    //   if (varCurrentUrlSplitArray.length >= 2) {
    //     let queryString = varCurrentUrlSplitArray[1];
    //     if(queryString2.length > 5){
    //       let queryString2 = queryString.split('%2F')[1];
    //       if(queryString2.length > 5){
    //         let inclGuid = queryString2.split('guid%3D')[1];
    //         let guid = inclGuid.slice(0, 36);
    //         this.uId = guid;
    //         if(inclGuid.length > 40){
    //           let inclMod = inclGuid.split('&')[1];
    //           let mod = inclMod.split('mode%3D')[1];
    //           this.readMode = mod;
    //         }else{
    //           this.readMode = "";
    //         }
    //       }
    //     }       
        
    //   }
    // }

    // this.uId = "399aeb1b-0f49-48fe-bf2c-b99d8d3b5556";
    // this.readMode = "";

    if (this.currentAbsoluteUrl.indexOf('=') > -1) {
      let varCurrentUrlSplitArray = this.currentAbsoluteUrl.split('?');
      if (varCurrentUrlSplitArray.length >= 1) {
        let queryString = varCurrentUrlSplitArray[1];
        let parameters = queryString.split('&');
        for (let i = 0; i < parameters.length; i++) {
          let param = parameters[i];
          if (param.toLowerCase().indexOf('guid=') > -1)
            this.uId = param.split('=')[1];
          else if (param.toLowerCase().indexOf('mode=') > -1)
            this.readMode = param.split('=')[1];
        }
      }
    };

    
  }

  ngOnInit(): void {

    //===========implementing Reactive form start====
    if (this.uId != "") {
      this.executeOnInitProcessesOnUid();     
    } 
    else {
      this.executeOnInitProcesses(); 

      this.isDisableRequestor = false;

      // ## ====== logValidationErrors =====
      this._form.controls.AppParameters.valueChanges.subscribe((cVal:any)=>{
        this.logValidationErrors(this._form.controls.AppParameters.controls.Requestor);
      })
    }

    //----- implementing Reactive form ends ----

    
   
  }

  // getAccesstoken(){
  //   const clientId = "cda7d8f1-e410-413b-8656-1b6ae52c247d";  
  //   const clientSecret = "A6JSnvdhloeVJwv4bOaPGtOJmKpT3GzE4C3qR4bxDIs=";
  //   // Authenticate with hardcoded credentials - Get Access Token  
  //   spauth.getAuth(url, {          
  //     clientId:clientId,  
  //     clientSecret:clientSecret  
  //   })  
  //   .then(function(options){  
  //       // Access Token will be available on the options.headers variable
  //       var headers = options.headers;  
  //       headers['Accept'] = 'application/json;odata=verbose';  
  //       // Pull the SharePoint list items  
  //       //response.end(JSON.stringify(headers));
  //       requestprom.get({  
  //       url: "https://bergerpaintsbd.sharepoint.com/sites/kamalportal/_api/web/lists/getByTitle('customerregistration')/items?&$top=200&$select=*",  
  //       //url: "https://portal.bergerbd.com/leaveauto/_api/web/lists/getByTitle('BusinessProcess')/items?&$top=200&$select=Category,SubCategory,ChildSubCategory,PageURL",
  //           headers: headers,  
  //           json: true  
  //       }).then(function(listresponse){  
  //           var items = listresponse.d.results;  
  //           var responseJSON = [];  
  //           // process  
              
  //           // Print / Send back the data  
  //           //response.end(JSON.stringify(items));
  //           //response.end(JSON.stringify(listresponse));  
              
  //       });  
  //   });
  // }

  private _createForm() {         
    
    return new Promise((resolve, reject)=>{
      try{

        this._form = this.formBuilder.group({ 
          AppParameters: this.formBuilder.group({  
            
            SystemDetails: this.formBuilder.array([]),
                
            Requestor: this.formBuilder.group({
              CustId: [ this._newCustId, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(8)])],
              CustPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50), PasswordStrengthValidator])],
              CustName: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(49)])],
              CustCompanyName: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(249)])],
              CustCompany1stAddress: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
              CustCompany2ndAddress: [''],
              CustCompany3rdAddress: [''],
              Cust1stEmail: ['', Validators.compose([Validators.required, Validators.email])],
              Cust2ndEmail: ['', Validators.email],
              Cust3rdEmail: ['', Validators.email],
              Cust1stPhone: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
              Cust2ndPhone: [''],
              Cust3rdPhone: [''],
              Cust1stMobile: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(14), Validators.pattern(this.phonePattern)])],
              Cust2ndMobile: [''],
              Cust3rdMobile: [''],
              CustDesignation: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(99)])],
              RegistrationFor: ['', Validators.required]          
            }),
    
            Attachments: [''],
            
            //ApprovalHistory: this.formBuilder.array([])
    
          })        
        }); 
        this.addSystemDetail();   
            
        resolve(this._form);
        return this._form;
      } 
      catch(err){
        reject('Retrieve master data failed !');
        console.log("Error: " + err);
      }
    })
    
  };

  private _loadFormDataOnUid(info:any) {         
    
    return new Promise((resolve, reject)=>{
      try{

        this._form = this.formBuilder.group({ 
          AppParameters: this.formBuilder.group({  
            
            SystemDetails: this.formBuilder.array([]),
                
            Requestor: this.formBuilder.group({
              CustId: [ {value: info.CustId}, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(8)])],
              //CustPassword: [{value: info.CustPassword}, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50), PasswordStrengthValidator])],
              CustName: [{value: info.CustName}, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(49)])],
              CustCompanyName: [{value: info.CustCompanyName}, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(249)])],
              CustCompany1stAddress: [{value: info.CustCompany1stAddress}, Validators.compose([Validators.required, Validators.minLength(10)])],
              CustCompany2ndAddress: [{value: info.CustCompany2ndAddress}],
              CustCompany3rdAddress: [{value: info.CustCompany3rdAddress}],
              Cust1stEmail: [{value: info.Cust1stEmail}, Validators.compose([Validators.required, Validators.email])],
              Cust2ndEmail: [{value: info.Cust2ndEmail}, Validators.email],
              Cust3rdEmail: [{value: info.Cust3rdEmail}, Validators.email],
              Cust1stPhone: [{value: info.Cust1stPhone}, Validators.compose([Validators.required, Validators.minLength(4)])],
              Cust2ndPhone: [{value: info.Cust2ndPhone}],
              Cust3rdPhone: [{value: info.Cust3rdPhone}],
              Cust1stMobile: [{value: info.Cust1stMobile}, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(14), Validators.pattern(this.phonePattern)])],
              Cust2ndMobile: [{value: info.Cust2ndMobile}],
              Cust3rdMobile: [{value: info.Cust3rdMobile}],
              CustDesignation: [{value: info.CustDesignation}, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(99)])],
              RegistrationFor: [{value: info.RegistrationFor}, Validators.required]          
            }),
    
            Attachments: [''],
            
            //ApprovalHistory: this.formBuilder.array([])
    
          })        
        }); 
        this.addSystemDetail();   
            
        resolve(this._form);
        return this._form;
      } 
      catch(err){
        reject('Retrieve master data failed !');
        console.log("Error: " + err);
      }
    })
    
  }

  GetOutputVal(valFrmChild: any) {
    console.log("");
  }

    //===========implementing Reactive form start====

    //======implementing async - await =====
    async executeOnInitProcesses(){    

      this.requestInfo = {
        uId: "",
        readMode: "",
        Status: "",
        //MatcardInfo: this._matcardInfo 
      };

      // this.supModel = 
      // {
      //   AppParameters: 
      //   {
          
      //     Attachments: [],
      //     SystemDetails: [
      //       {
      //         SystemType: "",
      //         SystemModule: "",
      //         SAPCustomerNumber: "",
      //         SUser: "",
      //         Manufacturer: "",
      //         Model: "",              
      //         OperatingSystem: "",
      //         OSRelease: "",
      //         DatabaseName: "",
      //         DatabaseRelease: "",
      //         PersonIncharge: "",
      //         SIContactNo: "",
      //         SIEmail: ""
      //       }
      //     ],
      //     Requestor:
      //     {
      //       "CustId": "4000",
      //       "CustPassword": "demo",
      //       "CustName": "Mostafa Kamal",
      //       "CustCompanyName": "Berger Becker Bangladesh limited",
      //       "CustCompany1stAddress": "Chittagong, Bangladesh",
      //       "CustCompany2ndAddress": "Chittagong, Bangladesh",
      //       "CustCompany3rdAddress": "Chittagong, Bangladesh",
      //       "Cust1stEmail": "kamal@fosroc.com",
      //       "Cust2ndEmail": "kamaltech@fosroc.com",
      //       "Cust3rdEmail": "kamal2@fosroc.com",
      //       "Cust1stPhone": "4444444444",
      //       "Cust2ndPhone": "3333333",
      //       "Cust3rdPhone": "2222222222",
      //       "Cust1stMobile": "01324255310",
      //       "Cust2ndMobile": "01324255310",
      //       "Cust3rdMobile": "01324255310",
      //       "CustDesignation": "Software Engineer"
      //     },
      //     // Recovery:
      //     // {          
      //     //   "SecurityQuestion1": "My nick name?",
      //     //   "SecurityQuestion1Answer": "kamal",
      //     //   "SecurityQuestion2": "My nick name?",
      //     //   "SecurityQuestion2Answer": "kamal",
      //     //   "SecurityQuestion3": "My nick name?",
      //     //   "SecurityQuestion3Answer": "kamal",
      //     // },
      //     // Singlesignon:
      //     // { 
      //     //   GmailForSSO: "kamal@gmail.com"
      //     // }
          
      //   }        
      // };

      this.parsedRequestInfo.Status = "";

      let today = (new Date().getDate()).toString();

      if((new Date().getDate()).toString().length == 1){
        today = 0 + (new Date().getDate()).toString()
      }

      this._newCustId = (new Date().getFullYear() - 2000).toString() + (new Date().getMonth() + 1).toString() + today ;

      try{
        await this._createForm();
        this.showReqInfoDiv = true;
      } 
      catch(err){
        console.log("Error: " + err)
      }
    }

    async executeOnInitProcessesOnUid(){    
      try{
        //await this._createForm();
  
        //const loggedUser = await this.userService.loggedUserInfo$; 

        let masterListInfo:any = await this.getMasterListInfo(this.uId);
        //let masterListInfo:any = await this.getMasterListInfo(loggedUser);

        await this._loadFormDataOnUid(masterListInfo.AppParameters.Requestor);

        if(masterListInfo.Status == "Reviewed SAP System Info" && this.parsedRequestInfo.AppParameters.Requestor.RegistrationFor == "Both SAP and Others" ){
          this.swReviewOtherSIBtn = true;
        }else {
          this.swReviewOtherSIBtn = false;
        };

        if(this.parsedRequestInfo.AppParameters.Requestor.RegistrationFor == 'SAP'){
          this.requestForCategories = this.sapModules;
        }else if(this.parsedRequestInfo.AppParameters.Requestor.RegistrationFor == 'Others'){
          this.requestForCategories = this.otherCategories;
        }else{
          this.requestForCategories = [...this.sapModules, ...this.otherCategories];
        }

        if(this.parsedRequestInfo.AppParameters.Requestor.RegistrationFor == "SAP"
        && masterListInfo.Status == "Reviewed SAP System Info"){
          this.swCompleteBtn = true;
        }

        if(this.parsedRequestInfo.AppParameters.Requestor.RegistrationFor == "Others"
        && masterListInfo.Status == "Reviewed Others System Info"){
          this.swCompleteBtn = true;
        }

        if( masterListInfo.Status == "Reviewed Others System Info"){
          this.swCompleteBtn = true;
        }

        if(Object.prototype.hasOwnProperty.call(masterListInfo, 'AppParameters')){   
          this.requestorsInfo = this.parsedRequestInfo.AppParameters.Requestor;
          //this._form.controls.AppParameters.get('Requestor').patchValue(this.requestorsInfo);
          
          if(this.requestorsInfo.CustId != ""){
            //=== accessing Customer System Information  ===
            let detailListInfo:any = await this.getDetailListInfo(this.requestorsInfo.CustId);

            if(detailListInfo.AppParameters.SystemDetails.length > 0){
              if(this.supModel.AppParameters.SystemDetails.length > 1 ){
                for(let i = 0; i< (this.supModel.AppParameters.SystemDetails.length - 1); i++){
                  this.addSystemDetail();
                }
              }
              
            }
            
            //=== loading data ===
            this._form.controls.AppParameters.patchValue(this.supModel.AppParameters);

            // === accessing Process Log List data  ===
            let processLog:any = await this.getProcessLog(this.requestorsInfo.CustId);

            if(Object.prototype.hasOwnProperty.call(processLog, 'Status')){

              //### === initializing Approval History Component start ===###
              // if(this.allProcessLogs.length > 0){
              //     let approvalGridFlds = [
              //       { headerName: "Sl", valueGetter: "node.rowIndex + 1", editable: false, menuTabs: [], minWidth: 50,  maxWidth: 80 },
              //       {
              //         headerName:"Date",                
              //         field: "Created",
              //           valueFormatter: function(params) {
              //               return moment(params.value).format('DD MMM, YYYY');
              //           },
              //           editable:false,
              //           minWidth: 200,
              //           menuTabs: [],
              //       },
              //       { headerName: 'Status', field: 'Status', editable:false, menuTabs: [], minWidth: 200 },
              //       { headerName: 'Action By', field: 'ProcessByName', editable:false, menuTabs: [], minWidth: 200 },
              //       { headerName: 'Comments', field: 'Comments', editable:false, menuTabs: [], minWidth: 200 }
              //     ];

              //     let approvalInfo = { 
              //       GridColDef: approvalGridFlds,
              //       GridColVal: this.approvalHistory
              //     }

              //     this.approvalLogInjector = Injector.create({
              //       providers: [
              //         {
              //           provide: ComponentdatabindingService,
              //           deps: []
              //         }
              //       ],
              //       parent: this.injector
              //     });

              //     let componentdatabindingService = this.approvalLogInjector.get(ComponentdatabindingService); 
              //     componentdatabindingService.gridInfo = approvalInfo;

              //     this.ApprovalLogComponent = DatatabledisplayinfoComponent;        
              // }

            }

            // === accessing all Attachments  ===
            let attachments:any = await this.getAllAttachments(this.requestorsInfo.CustId);
            if(Object.prototype.hasOwnProperty.call(attachments, 'CustId')){
              //this._form.controls.AppParameters.get('SystemDetails').patchValue(this.supModel.AppParameters.SystemDetails);
            }

            // //=== adding rowId formControl ===
            // if(detailListInfo.AppParameters.SystemDetails.length > 0){
            //   for(let fd=0; fd < this.supModel.AppParameters.SystemDetails.length; fd++){
            //     (this._form.controls.AppParameters.controls.SystemDetails as FormArray).addControl('rowId', this.formBuilder.control(null));
            //   } 
            // }



          }          

        };

        if( masterListInfo.Status == "Accepted from Email" 
        || masterListInfo.Status == "Reviewed SAP System Info"
        || masterListInfo.Status == "Reviewed Others System Info"){
          await this._getAllSupCategories();
        }
        

        // if(Object.prototype.hasOwnProperty.call(masterListInfo, 'AppParameters')){   
        //   this.requestorsInfo = this.parsedRequestInfo.AppParameters.Requestor;
        //   this._form.controls.AppParameters.get('Requestor').patchValue(this.requestorsInfo);
        // }      
        
      } 
      catch(err){
        console.log("Error: " + err)
      }
    }

    getMasterListInfo(guid:any){
  
      return new Promise((resolve, reject)=>{
        try{

              this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistration')/items?&$top=2000&$select=*&$filter=GUID eq '${guid}'`)
              .subscribe(
                (res:any)=>{

                  this.supModel.AppParameters.Requestor =                
                  {
                    CustId: res.value[0].CustId,
                    CustName: res.value[0].CustName,
                    CustCompanyName: res.value[0].CustCompanyName,
                    CustCompany1stAddress: res.value[0].CustCompany1stAddress,
                    CustCompany2ndAddress: res.value[0].CustCompany2ndAddress,
                    CustCompany3rdAddress: res.value[0].CustCompany3rdAddress,
                    Cust1stEmail: res.value[0].Cust1stEmail,
                    Cust2ndEmail: res.value[0].Cust2ndEmail,
                    Cust3rdEmail: res.value[0].Cust3rdEmail,
                    Cust1stPhone: res.value[0].Cust1stPhone,
                    Cust2ndPhone: res.value[0].Cust2ndPhone,
                    Cust3rdPhone: res.value[0].Cust3rdPhone,
                    Cust1stMobile: res.value[0].Cust1stMobile,
                    Cust2ndMobile: res.value[0].Cust2ndMobile,
                    Cust3rdMobile: res.value[0].Cust3rdMobile,
                    CustDesignation: res.value[0].CustDesignation,
                    RegistrationFor: res.value[0].RegistrationFor
                  };

                // this.supModel = 
                // {
                //   AppParameters: 
                //   {
                //     SystemDetails: [],
                //     Requestor:
                //     {
                //       "CustId": res.value[0].CustId,
                //       "CustName": res.value[0].CustName,
                //       "CustCompanyName": res.value[0].CustCompanyName,
                //       "CustCompany1stAddress": res.value[0].CustCompany1stAddress,
                //       "CustCompany2ndAddress": res.value[0].CustCompany2ndAddress,
                //       "CustCompany3rdAddress": res.value[0].CustCompany3rdAddress,
                //       "Cust1stEmail": res.value[0].Cust1stEmail,
                //       "Cust2ndEmail": res.value[0].Cust2ndEmail,
                //       "Cust3rdEmail": res.value[0].Cust3rdEmail,
                //       "Cust1stPhone": res.value[0].Cust1stPhone,
                //       "Cust2ndPhone": res.value[0].Cust2ndPhone,
                //       "Cust3rdPhone": res.value[0].Cust3rdPhone,
                //       "Cust1stMobile": res.value[0].Cust1stMobile,
                //       "Cust2ndMobile": res.value[0].Cust2ndMobile,
                //       "Cust3rdMobile": res.value[0].Cust3rdMobile,
                //       "CustDesignation": res.value[0].CustDesignation
                //     },
                //     Attachments: []                      
                //   }        
                // };

                let pendings = JSON.parse(res.value[0].PendingTo);

                if(pendings.length > 0){
                  pendings.forEach(pen => {
                    this._pendingWith = this._pendingWith + pen.approversName + " ; "; 
                  });
                }
                 

                this.parsedRequestInfo = { 
                  uId: this.uId,
                  readMode: this.readMode,
                  ID: res.value[0].ID,
                  Title: res.value[0].Title,
                  Status: res.value[0].Status,
                  PendingWith: pendings,
                  AppParameters: this.supModel.AppParameters 
                }
                resolve(this.parsedRequestInfo);
                return this.parsedRequestInfo;
              })            
        } 
        catch(err){
          reject('Retrieve master data failed !');
          console.log("Error: " + err);
        }
      })
    }

    getDetailListInfo(custId?:any){
  
      return new Promise((resolve, reject)=>{
        try{
          this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('CustomerSystemDetails')/items?&$top=2000&$select=*&$filter=CustId eq '${custId}'`)
          .subscribe(
            (res:any)=>{
              if(res.value.length > 0){                

                (res.value).forEach((val) => {
                  let sd = {
                    rowId: val.ID,
                    SystemType: val.SystemType,
                    SystemModule: val.SystemModule,        
                    SAPCustomerNumber: val.SAPCustomerNumber,
                    SUser: val.SUser,
                    SystemDescription: val.SystemDescription,
                    Manufacturer: val.Manufacturer,
                    Model: val.Model,
                    OperatingSystem: val.OperatingSystem,
                    OSRelease: val.OSRelease,
                    DatabaseName: val.DatabaseName,
                    DatabaseRelease: val.DatabaseRelease,
                    PersonIncharge: val.PersonIncharge,
                    SIContactNo: val.SIContactNo,
                    SIEmail: val.SIEmail,
                    BergerTechIncharge: val.BergerTechIncharge,
                    BergerTechInchargeContactNo: val.BergerTechInchargeContactNo,
                    BergerTechInchargeEmail: val.BergerTechInchargeEmail
                  };

                  this.supModel.AppParameters.SystemDetails.push(sd);
                })

                this.parsedRequestInfo.AppParameters.SystemDetails = this.supModel.AppParameters.SystemDetails;                
              }
           
              resolve(this.parsedRequestInfo);
              return this.parsedRequestInfo;
          })            
        } 
        catch(err){
          reject('Retrieve details data failed !');
          console.log("Error: " + err);
        }
      })
    }

    getProcessLog(custId?:any){
  
      return new Promise((resolve, reject)=>{
        try{
          this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistrationlog')/items?&$top=2000&$select=*&$filter=CustId eq '${custId}'`)
          .subscribe(
            (res:any)=>{
              if(res.value.length > 0){                
                let processLogs:any = [];
                (res.value).forEach((val) => {
                  let sd = {
                    CustId: val.CustId,
                    Created: val.Created,        
                    Status: val.Status,
                    ProcessByName: val.ProcessByName,
                    ProcessByEmail: val.ProcessByEmail,
                    Comments: val.Comments
                  };
                  processLogs.push(sd);
                  
                })
                this.allProcessLogs = processLogs;
                //this.supModel.AppParameters.ProcessLog = processLogs;
                this.parsedRequestInfo.AppParameters.ProcessLog = processLogs;                
              }
           
              resolve(this.parsedRequestInfo);
              return this.parsedRequestInfo;
          })            
        } 
        catch(err){
          reject('Retrieve details data failed !');
          console.log("Error: " + err);
        }
      })
    }


    getAllAttachments(custId?:any){
  
      return new Promise((resolve, reject)=>{
        try{ 
          this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistrationattachment')/items?&$top=2000&$select=ID,CustId,AttachmentFiles,Attachments,ActionDate,ActionBy&$expand=AttachmentFiles&$filter=CustId eq '${custId}'`)
          .subscribe(
            (res:any)=>{
              if(res.value.length > 0){                
                let attachments:any = [];
                (res.value).forEach((val) => {
                  let sd = {
                    CustId: val.CustId,
                    ActionBy: val.ActionBy,        
                    ActionDate: val.ActionDate,
                    AttachmentFiles: val.AttachmentFiles,
                    Attachments: val.Attachments,
                    ID: val.ID
                  };
                  attachments.push(sd);
                  //this.supModel.AppParameters.Attachments.push(sd);
                  this.parsedRequestInfo.AppParameters.Attachments.push(sd);
                })

                this.allAttachments = attachments;
                //this.supModel.AppParameters.Attachments = attachments;
                //this.parsedRequestInfo.AppParameters.Attachments = this.supModel.AppParameters.Attachments;                
              }
           
              resolve(this.parsedRequestInfo);
              return this.parsedRequestInfo;
          })            
        } 
        catch(err){
          reject('Retrieve details data failed !');
          console.log("Error: " + err);
        }
      })
    }


    onSubmitBtn(){
      //this.disableCustRegActionBtn = false;
      // setTimeout(function () {
      //   (document.getElementById('btnSubmitNewReq') as HTMLInputElement).style.display = 'none';
      // }, 1000);      
    }

    processAction(action:any){
      if(this.parsedRequestInfo.uId == ""){

        //==== validate whether requestor info is exist or not===
        if(this._form.value.AppParameters.Requestor.CustId == null
          || this._form.value.AppParameters.Requestor.CustName == null
          || this._form.value.AppParameters.Requestor.Cust1stPhone == null
          || this._form.value.AppParameters.Requestor.Cust1stEmail == null){
            this.toastSucAlert( 'error', true, 'Please provide Requestor info and try again later.', true);
            return false;
          };
        //---- validate whether requestor info is exist or not ends ----

        if(this.listOfFiles.length < 1 ){
          this.toastSucAlert( 'error', true, 'System info file should be attached.', true);
          return false;
        }
        
        this.parsedRequestInfo.AppParameters.Requestor = this._form.value.AppParameters.Requestor;
        //this.parsedRequestInfo.AppParameters.SystemDetails = this._form.value.AppParameters.SystemDetails;
        this.parsedRequestInfo.AppParameters.Attachments = this.listOfFiles;
        this.parsedRequestInfo.AppParameters.Action = action;
        
        this.outputToParent.emit(this.parsedRequestInfo);
        //this.btnClickAction.emit(action);
        
        setTimeout(function () {
          (document.getElementById('btnSubmitNewReq') as HTMLInputElement).style.display = 'none';
        }, 2000);

      }else{

        if(action == "Accepted from Email"){
          
          this.parsedRequestInfo.AppParameters.Requestor = this._form.value.AppParameters.Requestor;
          //this.parsedRequestInfo.AppParameters.SystemDetails = this._form.value.AppParameters.SystemDetails;
          this.parsedRequestInfo.AppParameters.Attachments = this.listOfFiles;
          this.parsedRequestInfo.AppParameters.Action = action;
          
          this.outputToParent.emit(this.parsedRequestInfo);
          //this.btnClickAction.emit(action);  
          
          setTimeout(function () {
            (document.getElementById('btnAcceptFromEmail') as HTMLInputElement).style.display = 'none';
          }, 2000);
  
        }else{
          this.parsedRequestInfo.AppParameters.Requestor = this._form.value.AppParameters.Requestor;
          this.parsedRequestInfo.AppParameters.SystemDetails = this._form.value.AppParameters.SystemDetails;
          this.parsedRequestInfo.AppParameters.Attachments = this.listOfFiles;
          this.parsedRequestInfo.AppParameters.Action = action;
  
          this.outputToParent.emit(this.parsedRequestInfo);
          //this.btnClickAction.emit(action);
        }

        
      }

      this.disableCustRegActionBtn = true;      
      
    }

    //----- implementing Reactive form ends ----


    //============ implementing attachment ==========
    onFileChanged(event: any) {
      this.isLoading = true;
      for (var i = 0; i <= event.target.files.length - 1; i++) {
        var selectedFile = event.target.files[i];
        if (this.listOfFiles.indexOf(selectedFile.name) === -1) {
          this.fileList.push(selectedFile);
          //this.listOfFiles.push(selectedFile.name);
          this.listOfFiles.push(selectedFile);
        }
      }
  
      this.isLoading = false;
  
      //this.attachment.nativeElement.value = '';

      //========= new methood ======
      if (event.target.files && event.target.files[0]) {
        const filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          let reader = new FileReader();
          reader.readAsDataURL(event.target.files[i]);
          reader.onload = (event) => {

            let obj={
              obj: reader['result']
            }             
            console.log(typeof obj);                 
            this.urls.push(event.target.result); 
            this._form.controls.AppParameters.patchValue({
              Attachments:event.target.result
            })      
          }              
        }
      }
      //---------------------
    }
  
    removeSelectedFile(index) {
      // Delete the item from fileNames list
      this.listOfFiles.splice(index, 1);
      // delete file from FileList
      this.fileList.splice(index, 1);
    }
    //---------------attachment ends --------------

    toggleAddEmail(){ 
      this.addMoreEmail = !this.addMoreEmail;
      if(this.uId != ""){
        this._form.controls.AppParameters.controls.Requestor.get('Cust2ndEmail').patchValue(this.requestorsInfo.Cust2ndEmail);
        this._form.controls.AppParameters.controls.Requestor.get('Cust3rdEmail').patchValue(this.requestorsInfo.Cust3rdEmail);
      }
    }

    toggleAddMobile(){ 
      this.addMoreMobile = !this.addMoreMobile;
      if(this.uId != ""){
        this._form.controls.AppParameters.controls.Requestor.get('Cust2ndMobile').patchValue(this.requestorsInfo.Cust2ndMobile);
        this._form.controls.AppParameters.controls.Requestor.get('Cust3rdMobile').patchValue(this.requestorsInfo.Cust3rdMobile);
      }
    }

    toggleAddPhone(){ 
      this.addMorePhone = !this.addMorePhone;
      if(this.uId != ""){
        this._form.controls.AppParameters.controls.Requestor.get('Cust2ndPhone').patchValue(this.requestorsInfo.Cust2ndPhone);
        this._form.controls.AppParameters.controls.Requestor.get('Cust3rdPhone').patchValue(this.requestorsInfo.Cust3rdPhone);
      }
    }
    toggleAddAddress(){ 
      this.addMoreAddress = !this.addMoreAddress;
      if(this.uId != ""){
        this._form.controls.AppParameters.controls.Requestor.get('CustCompany2ndAddress').patchValue(this.requestorsInfo.CustCompany2ndAddress);
        this._form.controls.AppParameters.controls.Requestor.get('CustCompany3rdAddress').patchValue(this.requestorsInfo.CustCompany3rdAddress);
      }
    }

    isIdAvailable(i:any){
      //if(i.length > 3){
        //const items = this.userService.customersList;

        const items = [{
          CustId: 1000,
          CustPassword: 'demo',
          CustName: 'Mostafa Kamal BPBL',
          CustCompanyName: 'BPBL',
          CustCompany1stAddress?: 'Dhaka',
          CustCompany2ndAddress?: 'Dhaka',
          CustCompany3rdAddress?: 'Dhaka',
          Cust1stEmail: 'kamal@bergerbd.com',
          Cust2ndEmail: 'kamal@bergerbd.com',
          Cust3rdEmail: 'kamal@bergerbd.com',
          Cust1stPhone?: '01324255310'
        }];

        if (!items) {
          return [];
        }     

        const avl = items.includes(items.find(el=>el.CustId === i));
        if(avl){
          this.isIdRegistered.next(avl);
        } else{
          this.isIdRegistered.next(false);
        } 
    }   

    onFormValuesChanged()
    {
      for ( const field in this.formErrors )
          {
              if ( !this.formErrors.hasOwnProperty(field) )
              {
                  continue;
              }
              // Clear previous errors
              this.formErrors[field] = {};
              // Get the control
              const control = this.formPersonalRecord.get(field);
              if ( control && control.dirty && !control.valid )
              {
                  this.formErrors[field] = control.errors;
              }
          }
    }


    /* Handle form errors in Angular 14 */
    public errorHandling = (control: string, error: string) => {
      if(this._form.get(control).hasError(error)){
        this.passwordErr = this._form.get(control).errors['passwordStrength'];
      }else{
        this.passwordErr = "";
      }
      
      return this._form.get(control).hasError(error);
      //return this.myForm.controls[control].hasError(error);
    }

    //============create SP list item using JSOM API ======



    //======= for get SP List Items ====    
 
    GetListItem(siteUrl) {
      let clientContext = new SP.ClientContext(siteUrl);
      let oList = clientContext.get_web().get_lists().getByTitle('customerregistration');
        
      let camlQuery = new SP.CamlQuery();
      camlQuery.set_viewXml(
        //"<View><Query><Where><Eq><FieldRef Name='CustId' /><Value Type='Text'>2000</Value></Eq></Where></Query></View>"
        "<View><Query><OrderBy><FieldRef Name='ID' /></OrderBy></Query></View>"						
      );
      this.collListItem = oList.getItems(camlQuery);
        
      clientContext.load(this.collListItem);
      clientContext.executeQueryAsync(
        Function.createDelegate(this, this.onQuerySucceeded), 
        Function.createDelegate(this, this.onQueryFailed)
      );
    }
    
    onQuerySucceeded(sender, args) {
      let listItemInfo = '';
      let listItemEnumerator = collListItem.getEnumerator();
        
      while (listItemEnumerator.moveNext()) {
        let oListItem = listItemEnumerator.get_current();
        listItemInfo += '\nID: ' + oListItem.get_id() + 
          '\nTitle: ' + oListItem.get_item('Title');
      }

      alert(listItemInfo.toString());
    }

    onQueryFailed(sender, args) {
      alert('Request failed. ' + args.get_message() + 
        '\n' + args.get_stackTrace());
    }

    //------------ JSOM API ends ------------------

    //========== loading external script ====
    loadScript(url) {
      const body = <HTMLDivElement> document.body;
      const script = document.createElement('script');
      script.innerHTML = '';
      script.src = url;
      script.async = false;
      script.defer = true;
      body.appendChild(script);
    }


    createSystemDetail(): FormGroup {
      return this.formBuilder.group({
        rowId: [null, ""],
        SystemType: ['', ""],
        SystemModule: ['', ""],        
        SAPCustomerNumber: ['', ""],
        SUser: ['', ""],
        SystemDescription: ['', ""],
        Manufacturer: ['', ""],
        Model: ['', ""],
        OperatingSystem: ['', ""],
        OSRelease: ['', ""],
        DatabaseName: ['', ""],
        DatabaseRelease: ['', ""],
        PersonIncharge: ['', ""],
        SIContactNo: ['', ""],
        SIEmail: ['', ""],
        BergerTechIncharge: ['', ""],
        BergerTechInchargeContactNo: ['', ""],
        BergerTechInchargeEmail: ['', ""]
      });

    }


    
    addSystemDetail(): void {   

      let sysDetControl = (this._form.controls.AppParameters.controls.SystemDetails as FormArray);
            
      sysDetControl.push(this.createSystemDetail());
    }

    getSysDetControls(){
      return (this._form.controls.AppParameters.controls.SystemDetails as FormArray).controls;
    };

    confirmPassword(e:Event){

      
      let pass = this._form.value.AppParameters.Requestor.CustPassword;
      let conPass = (e.target as HTMLInputElement).value; 

      if(pass != conPass){
        this.swConfirmPasswordErr = true;
      }else{
        this.swConfirmPasswordErr = false;
      }
      
    };

    //icontypes: >> ERROR='error', SUCCESS='success', WARNING='warning', INFO='info', QUESTION='question' 
    toastSucAlert(typeIcon:string, timerProgressBar: boolean, title:string, showConfirmButton: boolean) {
      Swal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: showConfirmButton,
        icon: typeIcon,
        timerProgressBar,
        timer: 9000,
        title: title,
      });
    };

    logValidationErrors(group: FormGroup){
      Object.keys(group.controls).forEach((key: string)=>{
        if(key != 'CustId' && key != 'CustPassword'){
          const abstractControl = group.get(key);
          if(abstractControl instanceof FormGroup){
            this.logValidationErrors(abstractControl);
          }else{
            
              this.formErrors[key] = "";
              if(abstractControl && !abstractControl.valid ){
                const messages = this.validationMessages[key];
            
                for(const errorKey in abstractControl.errors){
                  if(errorKey){
                    this.formErrors[key] += messages[errorKey] + ' ';
                  }
                }
              }
            
            
          }
        }

        
      })
    };

    async onRequestForSelect(e:any){
      // if(e.value == "SAP"){
      //   this.requestForCategories = [];
      //   this.requestForCategories = this.sapModules;
      // }else{
      //   this.requestForCategories = [];
      //   this.requestForCategories = this.otherCategories;
      // }
    };


        //##=== Get Support Syb-Categories/Modules Dropdown Items ###=====
        private _getAllSupCategories(){

          return new Promise((resolve, reject)=>{
            try{ 
              this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('SupportCategoryResponsibles')/items?&$top=2000&$select=*`) 
              .subscribe(
                (res:any)=>{
                  if(res.value.length > 0){ 

                    this.sapModules=[
                      {group: 'SAP', groupItems: []}
                    ];
                    this.otherCategories=[
                      {group: 'Others', groupItems: []}
                    ];

                    (res.value).forEach((val:any) => {
      
                      if(val.Category == "SAP"){
                        let sm = {
                          value: val.Modules,
                          viewValue: val.Modules,
                          resName: val.InChargeName,
                          resEmail: val.InChargeEmail
                        };
                        this.sapModules[0].groupItems.push(sm);
                      }else{
                        let om = {
                          value: val.Modules,
                          viewValue: val.Modules,
                          resName: val.InChargeName,
                          resEmail: val.Incharge.Email
                        };
                        this.otherCategories[0].groupItems.push(om);
                      }                                    
      
                    })
    
                    let supReqRors = {
                      sapModules: this.sapModules,
                      otherCategories: this.otherCategories
                    }
                    
                    resolve(supReqRors);
                    return supReqRors;
                  }else{
                    resolve(supReqRors);
                    return supReqRors;
                  }           
                  
              })            
            } 
            catch(err){
              reject('Retrieve SupCatResponsibles failed !');
              console.log("Error: " + err);
            }
          })
        };



   
  
   

}





