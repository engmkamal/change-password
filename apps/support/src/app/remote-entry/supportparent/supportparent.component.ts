// @ts-nocheck

import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';

import { Schema } from "@dashjoin/json-schema-form";
import { SharepointlistService } from '@portal/core';
//import {MatAccordion} from '@angular/material/expansion';
import { 
  //UserService, 
  LoggeduserinfoService,
  //AppdataproviderService,
  ISupModel,
  IAttachment 
} from '@portal/shared/data-access-user';
import { Subscription, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
// import {far} from '@fortawesome/free-regular-svg-icons';
// import {fas} from '@fortawesome/free-solid-svg-icons';
import { AngularEditorConfig } from '@kolkov/angular-editor';
//=========for access token =========
// import * as spauth from 'node-sp-auth';
// import * as requestprom from 'request-promise';

import { 
  DisplayanyinfohomeComponent, 
  ComponentdatabindingService, 
  CustomerInfoloaderService,
  CustomerhomeComponent,  
  RequestorinfoloaderService,
  RequestorhomeComponent
} from '@portal/ui-components';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { map } from 'rxjs/operators'

@Component({
  selector: 'portal-supportparent',
  templateUrl: './supportparent.component.html',
  styleUrls: [
    './supportparent.component.scss',   
  ]
})
export class SupportparentComponent implements OnInit {
  currentAbsoluteUrl = window.location.href;
  readMode = "";
  uId = "";
  onbehalfof = false;

  //isLoggedIn$ = false;
  
  listInfo = {
    name: "",
    select: "",
    expand: "",
    filterBy: "",
    filterWith: "",
    top: ""
  };

  parsedRequestInfo:ISupModel = { 
    uId: "",
    readMode: "",
    ID: null,
    Title: null,
    Status: null,
    Requestor: {},
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
        EmergContactNumber: "",
        EmergContactEmail: ""
      },
      SystemDetail: {},                    
      ProcessLog: [],
      Attachments: [],
      Comments: "",
      AssignedTasks: [],
      ChildInfo: {},
      Action: ""
    },
    PendingTo: null,
    sapModules: [],
    otherCategories: [],
    OnBehalfOf: false
  };
  //requestorsInfo!: ICustomer;

  _pendingWith = "";
  approvalHistory: any = [];
  allApprovers: any = {};
  @Output() outputToParent = new EventEmitter<any>();
  @Output() btnClickAction: EventEmitter<any> = new EventEmitter<any>();

  disabled = false; //disabled input text field for Suppord Info Grp
  SupportInfoFG:FormGroup;

  showReqInfoDiv: boolean = false;
  
  supModel:ISupModel = {
    uId: "",
    readMode: "",
    ID: null,
    Title: null,
    Status: null,
    Requestor: {},
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
        EmergContactNumber: "",
        EmergContactEmail: ""
      },
      SystemDetail: {},                    
      ProcessLog: [],
      Attachments: [],
      Comments: "",
      AssignedTasks: [],
      ChildInfo: {},
      Action: ""
    },
    PendingTo: null,
    RequestorAdId: null,
    sapModules: [],
    otherCategories: [],
    OnBehalfOf: false
  };

  

  //-----for attachment -----

  @ViewChild('attachments') attachment: any;

  fileList: File[] = [];
  listOfFiles: any[] = [];
  isLoading = false;
  //-----------------------
  _form!: FormGroup;

  //requestorsInfo!:IRequestor = {};
  
  // get requestorsInfo(): any {
  //   return this.userService.customerInfo;
  // }

  requestorsInfo = {
    CustId: '',
    CustName: '',
    CustCompanyName: '',    
    CustCompany1stAddress: '',
    CustDesignation: '',
    Cust1stEmail: '',
    Cust1stMobile: '',
    //RequestDate: '... '
  };

  panelOpenState = false;

  openedStartDrawer = false;
  openedEndDrawer = false;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  requestInfo: any = {};

  //Consent = false;

  priorities: any[] = [
    {value: 'Low', viewValue: 'Low'},
    {value: 'Medium', viewValue: 'Medium'},
    {value: 'High', viewValue: 'High'},
    {value: 'Highest', viewValue: 'Highest'}
  ];

  requestFors: any[] = [
    {value: 'SAP', viewValue: 'SAP', disabled: false},
    {value: 'Others', viewValue: 'Others', disabled: false}
  ];

  systemTypes: any[] = [
    {value: 'SAP', viewValue: 'SAP', disabled: false},
    {value: 'Others', viewValue: 'Others', disabled: false}
  ];

  addMoreAddress = true;
  addMoreEmail= true;

  sapModules: any[] = [
    {value: 'Financial Accounting and Controlling - FICO', viewValue: 'Financial Accounting and Controlling - FICO', disabled: false},
    {value: 'Material Management - MM', viewValue: 'Material Management - MM', disabled: false},
    {value: 'Plant Maintenance - PM', viewValue: 'Plant Maintenance - PM', disabled: false},
    {value: 'Quality Management - QM', viewValue: 'Quality Management - QM', disabled: false},
    {value: 'Success Factor - SF', viewValue: 'Success Factor - SF', disabled: false},
    {value: 'Production Planning - PP', viewValue: 'Production Planning - PP', disabled: false},
    {value: 'Sales Distribution - SD', viewValue: 'Sales Distribution - SD', disabled: false},
    {value: 'Human Capital Management - HCM', viewValue: 'Human Capital Management - HCM', disabled: false},
    {value: 'Project System - PS', viewValue: 'Project System - PS', disabled: false},
    {value: 'Business Warehouse - BW', viewValue: 'Business Warehouse - BW', disabled: false},
    {value: 'Fiori Apps', viewValue: 'Fiori Apps', disabled: false},
    {value: 'Solution Manager', viewValue: 'Solution Manager', disabled: false},
    {value: 'Others', viewValue: 'Others', disabled: false}
  ];

  otherCategories: any[] = [
    {value: 'Business Automation', viewValue: 'Business Automation', disabled: false},
    {value: 'Cloud Solution', viewValue: 'Cloud Solution', disabled: false},
    {value: 'IT Audit', viewValue: 'IT Audit', disabled: false},
    {value: 'IT Security Solution', viewValue: 'IT Security Solution', disabled: false},
    {value: 'Others', viewValue: 'Others', disabled: false}
  ];

  requestForCategories = [
    {value: '', viewValue: ''}
  ]
 // @ViewChild(MatAccordion) accordion: MatAccordion;

  _matcardInfo = { 
    dragPosition: {x: 10, y: 10},
    divStyle: {
      resize: 'both',
      overflow: 'hidden',
      width: '340px',
      height: '300px',
      background: 'whitesmoke'
    },    
    matCardTitle: 'Info to identify a solution:',
    styleTitle:{
      textAlign: 'center', 
      color: 'navy',
      fontFamily:'Arial',
      fontWeight: 100,
      fontSize: '16px'
    },
    matCardSubtitle: 'Please provide some more details about your issue.',
    styleSubTitle:{
      textAlign: 'left', 
      color: 'black',
      fontFamily:'Arial',
      fontWeight: 80,
      fontSize: '12px'
    },
    matCardContent: '',
    styleContent:{
      textAlign: 'left', 
      color: 'gray',
      fontFamily:'Arial',
      fontWeight: 50,
      fontSize: '10px'
    },
    matCardImage: '',
    matCardActions: '',
    matCardFooter: '',
  };

//===for text editor ====
htmlContent = '';
config: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: '15rem',
  minHeight: '5rem',
  placeholder: 'Problem Description...',
  translate: 'no',
  defaultParagraphSeparator: 'p',
  defaultFontName: 'Arial',
  toolbarHiddenButtons: [
    ['bold']
    ],
  customClasses: [
    {
      name: "quote",
      class: "quote",
    },
    {
      name: 'redText',
      class: 'redText'
    },
    {
      name: "titleText",
      class: "titleText",
      tag: "h1",
    },
  ]
};


  showLoginFrm = true;

  urls:any = []; //for attachment

  allAttachments:IAttachment[];

  public ApplicantComponent: any;
  public RequestorComponent: any;
  public DynamicComponent: any;
  public ProcessLogComponent: any;
  public QueryLogComponent: any;
  public processLogInjector!: Injector;
  public queryLogInjector!: Injector;
  public myInjector!: Injector;
  public applicantInjector!: Injector;
  public employeeInjector!: Injector;
  
  public rejectedItmInjector!: Injector;
  public empInfoInjector!: Injector;
  displayApplicant = false;
  displayRequestor = false;
  public displayAttachments = false;
  public displayRejectedItems = false;
  public displayEmpInfo = false;
  displayProcessLog = false;
  displayQueryLog = false;
  
  appDataSubscription!: Subscription; 

  showHPBusImpactDiv = false;

  btnDisabled = false;

  validationMessages = {
    RequestFor: {
      required: 'Request For is required',
    },
    RequestCategory: {
      required: 'Request Category is required',
    },
    Subject: {
      required: 'Subject is required',
      minlength: 'Subject must be greater than 9 characters',
      maxlength: 'Subject must be less than 200 characters'
    },
    Description: {
      required: 'Description is required',
    },
    Priority: {
      required: 'Priority is required',
    }        
  };

  formErrors = {
    RequestFor: "",
    RequestCategory: "",
    Subject: "",
    Description: "",
    Priority: "",
  };
  
  nsapModl = [];
  nOtherModl = [];

  constructor(
    private formBuilder: FormBuilder,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    //public userService: UserService,
    private loggeduserinfoService: LoggeduserinfoService,
    //private appdataproviderService: AppdataproviderService,
    public sharepointlistService: SharepointlistService,
    private httpClient: HttpClient,
    //private route: ActivatedRoute
    //library: FaIconLibrary
    ) {
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
    }

    //this.uId = "";
    //this.uId = "87d13f32-1fd4-4073-ab7d-da34bc6d7d4f";
    //this.uId = "e6717631-646c-437e-ba65-8b79d0b7f6b8";
    //this.userService.reloadCustomerInfo('1000');

    
  }

  ngOnInit(): void { 
    
    if (this.uId != "") {
      this.executeOnInitProcessesOnUid();
    } 
    else {
      this.executeOnInitProcesses();
      // ## ====== logValidationErrors =====
      this._form.controls.AppParameters.valueChanges.subscribe((cVal:any)=>{
        this.logValidationErrors(this._form.controls.AppParameters); 
      })
    };


    // this.appDataSubscription = this.appdataproviderService.appData$.subscribe((res:any) => {
    //   if (res.uId != "") {
    //     this.uId = JSON.parse(JSON.stringify(res.uId));
    //     this.executeOnInitProcessesOnUid();
    //   } 
    //   else {  
    //     this.executeOnInitProcesses();
    //     // ## ====== logValidationErrors =====
    //     this._form.controls.AppParameters.valueChanges.subscribe((cVal:any)=>{
    //       this.logValidationErrors(this._form.controls.AppParameters); 
    //     })        
    //   }
    // });
    
   
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
            ProblemDescription: this.formBuilder.group({
              RequestFor: ['', Validators.required],
              RequestCategory: ['', Validators.required],
              Subject: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(199)])],
              Description: ['', Validators.required]
            }),
            PriorityInfo: this.formBuilder.group({          
              Priority: ['', Validators.required],
              EmergContact: ['', ""],
              BusinessImpact: ['', ""],
              EmergContactNumber: ['', ""],
              EmergContactEmail: ['', ""]
            }),
            Attachments: ['', ""],
            SystemDetail: this.formBuilder.group({
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
              SIEmail: ['', ""]
            }),
            //AssignedTasks: this.formBuilder.array([]),
            Comments: ['', ""]
          })        
        });        
            
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
            ProblemDescription: this.formBuilder.group({
              RequestFor: [info.AppParameters.ProblemDescription.RequestFor, Validators.required],
              RequestCategory: [info.AppParameters.ProblemDescription.RequestCategory, Validators.required],
              Subject: [info.AppParameters.ProblemDescription.Subject, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(199)])],
              Description: [info.AppParameters.ProblemDescription.Description, Validators.required]
            }),
            PriorityInfo: this.formBuilder.group({          
              Priority: [info.AppParameters.PriorityInfo.Priority, Validators.required],
              EmergContact: [info.AppParameters.PriorityInfo.EmergContact, ""],
              BusinessImpact: [info.AppParameters.PriorityInfo.BusinessImpact, ""],
              EmergContactNumber: [info.AppParameters.PriorityInfo.EmergContactNumber, ""],
              EmergContactEmail: [info.AppParameters.PriorityInfo.EmergContactEmail, ""]
            }),
            Attachments: ['', ""],
            SystemDetail: this.formBuilder.group({
              SystemType: [info.AppParameters.SystemDetail.SystemType, ""],
              SystemModule: [info.AppParameters.SystemDetail.SystemModule, ""],        
              SAPCustomerNumber: [info.AppParameters.SystemDetail.SAPCustomerNumber, ""],
              SUser: [info.AppParameters.SystemDetail.SUser, ""],
              SystemDescription: [info.AppParameters.SystemDetail.SystemDescription, ""],
              Manufacturer: [info.AppParameters.SystemDetail.Manufacturer, ""],
              Model: [info.AppParameters.SystemDetail.Model, ""],
              OperatingSystem: [info.AppParameters.SystemDetail.OperatingSystem, ""],
              OSRelease: [info.AppParameters.SystemDetail.OSRelease, ""],
              DatabaseName: [info.AppParameters.SystemDetail.DatabaseName, ""],
              DatabaseRelease: [info.AppParameters.SystemDetail.DatabaseRelease, ""],
              PersonIncharge: [info.AppParameters.SystemDetail.PersonIncharge, ""],
              SIContactNo: [info.AppParameters.SystemDetail.SIContactNo, ""],
              SIEmail: [info.AppParameters.SystemDetail.SIEmail, ""]
            }),
            Comments: ['', ""]
          })        
        });        
            
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

    if(this.parsedRequestInfo.Status == "Assigned" || this.parsedRequestInfo.Status == "ReAssigned"){
      this.parsedRequestInfo.AppParameters.Action = valFrmChild.action;
      this.parsedRequestInfo.AppParameters.ChildInfo = valFrmChild;
      this.parsedRequestInfo.AppParameters.Comments = this._form.value.AppParameters.Comments;
      this.outputToParent.emit(this.parsedRequestInfo);
    }
    else if( this.parsedRequestInfo.Status == "TaskPickedUp" || this.parsedRequestInfo.Status == "ReadyforUAT" || this.parsedRequestInfo.Status == "UATRequest" || this.parsedRequestInfo.Status == "UATFeedbackFrmCustomer" || this.parsedRequestInfo.Status == "PickedUp" ){
      this.parsedRequestInfo.AppParameters.Action = valFrmChild.action;
      this.parsedRequestInfo.AppParameters.ChildInfo = valFrmChild;
      this.parsedRequestInfo.AppParameters.Comments = this._form.value.AppParameters.Comments;
      this.outputToParent.emit(this.parsedRequestInfo);
    }
    else{
      alert("Action is undefined for this event");
    }
  }

    //===========implementing Reactive form start====

      //======implementing async - await =====
  async executeOnInitProcesses(){ 

    try{
      
      await this._createForm();
      
      if( localStorage.getItem('logedCustId') != null ){

        this._getApproversOfCustomers(localStorage.getItem('logedCustId'));
        
        let customerInfo = await this.loadCustomerInfo();      
        await this._loadCustomerInfoView(customerInfo);            
        this.showReqInfoDiv = true;

      } else if( localStorage.getItem('logedEmpEmail') != null){
        
        let employeeInfo = await this.loadBrgrEmployeeInfo();      
        await this._loadEmployeeInfoView(employeeInfo);            
        this.showReqInfoDiv = true;
        this.onbehalfof = true;
      }else{
        this.router.navigate(['/login']);
      }

      //await this._getAllSupCategories();

      
      
    } 
    catch(err){
      console.log("Error: " + err)
    }
  }

    async executeOnInitProcessesOnUid(){    
      try{

        let masterListInfo:any = await this.getMasterListInfo(this.supModel.uId);

        //===passing ngif values===
        if(masterListInfo.AppParameters.PriorityInfo.Priority == 'Highest'){
          this.showHPBusImpactDiv = true;
        }

        if(this.supModel.AppParameters.SystemDetail.SystemType == 'SAP'){
          this.requestForCategories = this.sapModules;
        }else{
          this.requestForCategories = this.otherCategories;
        }
    
        await this._loadFormDataOnUid(this.parsedRequestInfo);
  
        //const loggedUser = await this.userService.loggedUserInfo$;
        
        if(Object.prototype.hasOwnProperty.call(masterListInfo, 'AppParameters')){ 
          
          this.requestorsInfo = masterListInfo.Requestor;
          
          if(this.requestorsInfo.CustId != ""){
            
            //====================loading requestors info =============
            this.applicantInjector = Injector.create({
              providers: [
                {
                  provide: CustomerInfoloaderService ,
                  deps: []
                }
              ],
              parent: this.injector
            });
    
            let applicantService = this.applicantInjector.get(CustomerInfoloaderService ); 
            
            let grdInfo = {
                formGroup: this._form,
                requestorInfo: this.supModel.Requestor,
                mode: 'edit'
            }

            applicantService.gridInfo = grdInfo; 
    
            setTimeout(() => {
              this.ApplicantComponent = CustomerhomeComponent ;
    
              this.displayApplicant = true;
            }, 1); 

            //-----------------------loading requestors info ends ---------

            if(this.parsedRequestInfo.OnBehalfOf){
              await this._loadEmployeeInfoView(this.parsedRequestInfo.Employee);            
              this.showReqInfoDiv = true;
              this.onbehalfof = true;
            }
            
            // === accessing all Attachments  ===
            let attachments:any = await this.getAllAttachments(masterListInfo.Title);
       
            if(attachments.length > 0){
      
              let attachmentGridFlds = [
                { headerName: "Sl", valueGetter: "node.rowIndex + 1", editable: false, menuTabs: [], minWidth: 50,  maxWidth: 80 },
                {
                  headerName:"Attachment",
                  cellRenderer: function (params) { 
                    if (params.data.AName != null && params.data.AName != undefined) { 
                      let fileLink = "<a href="+params.data.AName.ServerRelativeUrl+">" + params.data.AName.FileName + "</a>";
                      return fileLink;
                    }
                  },
                  editable:false,
                  minWidth: 300,
                  menuTabs: [],
                },
                { headerName: 'Uploaded By', field: 'UploadedBy', minWidth: 150, editable: false, colId: "UploadedBy", menuTabs: []},        
                {
                  headerName:"Uploaded Date",                  
                  field: "UploadedDate",
                  valueFormatter: function(params) {
                      return moment(params.value).format('DD MMM, YYYY');
                  },
                  // cellRenderer: function (params) { 
                  //   if (params.data.UploadedDate != null && params.data.UploadedDate != undefined) { 
                  //     return moment(params.value).format('DD MMM, YYYY');
                  //   }                    
                  // },
                  editable:false,
                  minWidth: 150,
                  menuTabs: [],
                }        
              ];
      
              let attachmentRwDt = [];

              Object.values(attachments).forEach(attachment => {
                if(attachment.AttachmentFiles.length >0){
                  attachmentRwDt.push({
                    AName: {
                      FileName: attachment.AttachmentFiles[0].FileName,
                      ServerRelativeUrl: attachment.AttachmentFiles[0].ServerRelativeUrl
                    },
                    UploadedBy: attachment.ActionBy,
                    UploadedDate: attachment.ActionDate  
                  })
                }
                        
              });
      
              let attachmentInfo = { 
                GridColDef: attachmentGridFlds,
                GridColVal: attachmentRwDt
              }
      
              this.myInjector = Injector.create({
                providers: [
                  {
                    provide: ComponentdatabindingService,
                    deps: []
                  }
                ],
                parent: this.injector
              });
      
              let attachmentService = this.myInjector.get(ComponentdatabindingService); 
              attachmentService.gridInfo = attachmentInfo;
      
              setTimeout(() => {
                this.DynamicComponent = DisplayanyinfohomeComponent;
      
                this.displayAttachments = true;
              }, 100); 
      
              
            }
           
            // === accessing Process Log List data  ===
            let processLog:any = await this.getProcessLog(masterListInfo.Title);

             
            if(processLog.length > 0){              
    
              let processLogGridFlds = [
                { headerName: "Sl", valueGetter: "node.rowIndex + 1", editable: false, menuTabs: [], minWidth: 50,  maxWidth: 80 },                  
                {
                  headerName:"Action Date",                  
                  field: "Created",
                  valueFormatter: function(params) {
                      return moment(params.value).format('DD MMM, YYYY');
                  },
                  // cellRenderer: function (params) { 
                  //   if (params.data.UploadedDate != null && params.data.UploadedDate != undefined) { 
                  //     return moment(params.value).format('DD MMM, YYYY');
                  //   }                    
                  // },
                  editable:false,
                  minWidth: 150,
                  menuTabs: [],
                },
                { headerName: 'Status', field: 'Status', minWidth: 150, editable: false, colId: "UploadedBy", menuTabs: []},        
                { headerName: 'Process By', field: 'ProcessByName', minWidth: 150, editable: false, colId: "UploadedBy", menuTabs: []},                
                { headerName: 'Comments', field: 'Comments', minWidth: 150, editable: false, colId: "UploadedBy", menuTabs: []},                
              ];
      
              let processLogRwDt = [];

              Object.values(processLog).forEach(pl => {
                
                  processLogRwDt.push({
                    Created: pl.Created,
                    Status: pl.Status,
                    ProcessByName: pl.ProcessByName,
                    Comments: pl.Comments  
                  })
                
                        
              });
      
              let processLogInfo = { 
                GridColDef: processLogGridFlds,
                GridColVal: processLogRwDt
              }
      
              this.processLogInjector = Injector.create({
                providers: [
                  {
                    provide: ComponentdatabindingService,
                    deps: []
                  }
                ],
                parent: this.injector
              });
      
              let processLogService = this.processLogInjector.get(ComponentdatabindingService); 
              processLogService.gridInfo = processLogInfo;
      
              setTimeout(() => {
                this.ProcessLogComponent = DisplayanyinfohomeComponent;
      
                this.displayProcessLog = true;
              }, 100); 
      
              
            }

          }          

        }
        
        this._form.controls.AppParameters.addControl('AssignedTasks', this.formBuilder.array([]));
                
        if(masterListInfo.Status == "Submitted" ){
          this.addAssignedTasks();
        }
        
        if(masterListInfo.Status == "Assigned" || masterListInfo.Status == "ReAssigned" || masterListInfo.Status == "TaskPickedUp" || masterListInfo.Status == "UATFeedbackFrmCustomer" ){
          
          //## == disabling text editor == ##
          this.config = {editable: false};

          let assignedTasks:any = await this.getAssignedTasks(masterListInfo.Title);

          let assignees:any = await this.getAssignees(masterListInfo.Title);          

          assignedTasks.forEach((asTas:any, tNo:index) => {
          
          this.addAssignedTasks();

            asTas.Assignees = [];

            assignees.forEach((asItem:any, ind:index) => {

            if(asItem.TaskId == asTas.TaskId){
              asTas.Assignees.push(asItem);
              //set html with formcontrol
              // if(ind >0){
              //   this.addAssignee(1 + ind);
              // }
              
            }
            
            });            

          });           

          this._form.controls.AppParameters.controls.AssignedTasks.patchValue(assignedTasks);

          this.parsedRequestInfo.AppParameters.AssignedTasks = assignedTasks;

          // === accessing Process Log List data  ===
          let queryLog:any = await this.getProcessLog(masterListInfo.Title);
  
          if(queryLog.length > 0){              
  
            let queryLogGridFlds = [
              { headerName: "Sl", valueGetter: "node.rowIndex + 1", editable: false, menuTabs: [], minWidth: 20,  maxWidth: 60 },                  
              { headerName: 'QueryOrResponse', field: 'QueryOrResponse', minWidth: 380, editable: false, colId: "QueryOrResponse", menuTabs: []},                
              { headerName: 'Query/ResponseBy', field: 'ProcessByName', minWidth: 160, editable: false, colId: "ProcessByName", menuTabs: []},                
              {
                headerName:"Action Date",                  
                field: "Created",
                valueFormatter: function(params) {
                    return moment(params.value).format('DD MMM, YYYY');
                },
                // cellRenderer: function (params) { 
                //   if (params.data.UploadedDate != null && params.data.UploadedDate != undefined) { 
                //     return moment(params.value).format('DD MMM, YYYY');
                //   }                    
                // },
                editable:false,
                minWidth: 100,
                menuTabs: [],
              },
              
            ];
    
            let queryLogRwDt = [];

            Object.values(processLog).forEach(pl => {
              
              queryLogRwDt.push({
                  Created: pl.Created,
                  Status: pl.Status,
                  ProcessByName: pl.ProcessByName,
                  QueryOrResponse: pl.QueryOrResponse  
                })
              
                      
            });
    
            let queryLogInfo = { 
              GridColDef: queryLogGridFlds,
              GridColVal: queryLogRwDt
            }
    
            this.queryLogInjector = Injector.create({
              providers: [
                {
                  provide: ComponentdatabindingService,
                  deps: []
                }
              ],
              parent: this.injector
            });
    
            let queryLogService = this.queryLogInjector.get(ComponentdatabindingService); 
            queryLogService.gridInfo = queryLogInfo;
    
            setTimeout(() => {
              this.QueryLogComponent = DisplayanyinfohomeComponent;
    
              this.displayQueryLog = true;
            }, 100); 
    
            
          }
          
          //---------------- Query List ends -----

        }

        if(masterListInfo.Status == "ReadyforUAT" ){

          //## == disabling text editor == ##
          this.config = {editable: false};

          let assignedTasks:any = await this.getAssignedTasks(masterListInfo.Title);

          let assignees:any = await this.getAssignees(masterListInfo.Title);          

           assignedTasks.forEach((asTas:any, tNo:index) => {
            
            this.addAssignedTasks();

             asTas.Assignees = [];

             assignees.forEach((asItem:any, ind:index) => {

              if(asItem.TaskId == asTas.TaskId){
                asTas.Assignees.push(asItem);
                //set html with formcontrol
                // if(ind >0){
                //   this.addAssignee(1 + ind);
                // }
                
              }
             
             });            

           });

           this._form.controls.AppParameters.controls.AssignedTasks.patchValue(assignedTasks);

           this.parsedRequestInfo.AppParameters.AssignedTasks = assignedTasks;

           setTimeout(() => {

            this._form.controls.AppParameters.controls.ProblemDescription.disable();
            this._form.controls.AppParameters.controls.PriorityInfo.disable();
            this._form.controls.AppParameters.controls.SystemDetail.disable();

          }, 30000);

          // === accessing Process Log List data  ===
          let queryLog:any = await this.getProcessLog(masterListInfo.Title);

  
          if(queryLog.length > 0){              
  
            let queryLogGridFlds = [
              { headerName: "Sl", valueGetter: "node.rowIndex + 1", editable: false, menuTabs: [], minWidth: 20,  maxWidth: 60 },                  
              { headerName: 'QueryOrResponse', field: 'QueryOrResponse', minWidth: 380, editable: false, colId: "QueryOrResponse", menuTabs: []},                
              { headerName: 'Query/ResponseBy', field: 'ProcessByName', minWidth: 160, editable: false, colId: "ProcessByName", menuTabs: []},                
              {
                headerName:"Action Date",                  
                field: "Created",
                valueFormatter: function(params) {
                    return moment(params.value).format('DD MMM, YYYY');
                },
                // cellRenderer: function (params) { 
                //   if (params.data.UploadedDate != null && params.data.UploadedDate != undefined) { 
                //     return moment(params.value).format('DD MMM, YYYY');
                //   }                    
                // },
                editable:false,
                minWidth: 100,
                menuTabs: [],
              },
              
            ];
    
            let queryLogRwDt = [];

            Object.values(processLog).forEach(pl => {
              
              queryLogRwDt.push({
                  Created: pl.Created,
                  Status: pl.Status,
                  ProcessByName: pl.ProcessByName,
                  QueryOrResponse: pl.QueryOrResponse  
                })
              
                      
            });
    
            let queryLogInfo = { 
              GridColDef: queryLogGridFlds,
              GridColVal: queryLogRwDt
            }
    
            this.queryLogInjector = Injector.create({
              providers: [
                {
                  provide: ComponentdatabindingService,
                  deps: []
                }
              ],
              parent: this.injector
            });
    
            let queryLogService = this.queryLogInjector.get(ComponentdatabindingService); 
            queryLogService.gridInfo = queryLogInfo;
    
            setTimeout(() => {
              this.QueryLogComponent = DisplayanyinfohomeComponent;
    
              this.displayQueryLog = true;
            }, 100); 
    
            
          }
          
          //---------------- Query List ends -----

        }

        if(masterListInfo.Status == "UATRequest" ){ 

          //## == disabling text editor == ##
          this.config = {editable: false};

          let assignedTasks:any = await this.getAssignedTasks(masterListInfo.Title);

          let assignees:any = await this.getAssignees(masterListInfo.Title);          

           assignedTasks.forEach((asTas:any, tNo:index) => {
            
            this.addAssignedTasks();

             asTas.Assignees = [];

             assignees.forEach((asItem:any, ind:index) => {

              if(asItem.TaskId == asTas.TaskId){
                asTas.Assignees.push(asItem);
              }
             
             });            

           });
           

           this._form.controls.AppParameters.controls.AssignedTasks.patchValue(assignedTasks);

          this.parsedRequestInfo.AppParameters.AssignedTasks = assignedTasks;

          setTimeout(() => {

            this._form.controls.AppParameters.controls.AssignedTasks.disable();
            this._form.controls.AppParameters.controls.ProblemDescription.disable();
            this._form.controls.AppParameters.controls.PriorityInfo.disable();
            this._form.controls.AppParameters.controls.SystemDetail.disable();            
            
          }, 30000);

          // === accessing Process Log List data  ===
          let queryLog:any = await this.getProcessLog(masterListInfo.Title);

  
          if(queryLog.length > 0){              
  
            let queryLogGridFlds = [
              { headerName: "Sl", valueGetter: "node.rowIndex + 1", editable: false, menuTabs: [], minWidth: 20,  maxWidth: 60 },                  
              { headerName: 'QueryOrResponse', field: 'QueryOrResponse', minWidth: 380, editable: false, colId: "QueryOrResponse", menuTabs: []},                
              { headerName: 'Query/ResponseBy', field: 'ProcessByName', minWidth: 160, editable: false, colId: "ProcessByName", menuTabs: []},                
              {
                headerName:"Action Date",                  
                field: "Created",
                valueFormatter: function(params) {
                    return moment(params.value).format('DD MMM, YYYY');
                },
                // cellRenderer: function (params) { 
                //   if (params.data.UploadedDate != null && params.data.UploadedDate != undefined) { 
                //     return moment(params.value).format('DD MMM, YYYY');
                //   }                    
                // },
                editable:false,
                minWidth: 100,
                menuTabs: [],
              },
              
            ];
    
            let queryLogRwDt = [];

            Object.values(processLog).forEach(pl => {
              
              queryLogRwDt.push({
                  Created: pl.Created,
                  Status: pl.Status,
                  ProcessByName: pl.ProcessByName,
                  QueryOrResponse: pl.QueryOrResponse  
                })
              
                      
            });
    
            let queryLogInfo = { 
              GridColDef: queryLogGridFlds,
              GridColVal: queryLogRwDt
            }
    
            this.queryLogInjector = Injector.create({
              providers: [
                {
                  provide: ComponentdatabindingService,
                  deps: []
                }
              ],
              parent: this.injector
            });
    
            let queryLogService = this.queryLogInjector.get(ComponentdatabindingService); 
            queryLogService.gridInfo = queryLogInfo;
    
            setTimeout(() => {
              this.QueryLogComponent = DisplayanyinfohomeComponent;
    
              this.displayQueryLog = true;
            }, 100); 
    
            
          }
          
          //---------------- Query List ends -----

        };

        if(masterListInfo.Status == "Completed" || masterListInfo.Status == "Rejected"){
          this.config = {editable: false};
        }
        
        //this.appDataSubscription.unsubscribe();
        
        //await this.appdataproviderService.getMasterListInfo(this.uId);

        //await this._getAllSupCategories();

        //this._getApproversOfCustomers(masterListInfo.Requestor.CustId);
        
      } 
      catch(err){
        console.log("Error: " + err)
      }
    }

    getCustomerInfo(custId?:any){
  
      return new Promise((resolve, reject)=>{
        try{
            this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistration')/items?&$top=2000&$select=*&$filter=CustId eq '${custId}'`)
              .subscribe(
                (res:any)=>{

                  this.supModel.Requestor =                
                  {
                    CustId: res.value[0].CustId,
                    CustName: res.value[0].CustName,
                    CustCompanyName: res.value[0].CustCompanyName,
                    CustCompany1stAddress: res.value[0].CustCompany1stAddress,
                    Cust1stEmail: res.value[0].Cust1stEmail,
                    Cust1stMobile: res.value[0].Cust1stMobile,
                    CustDesignation: res.value[0].CustDesignation
                  },

                
                  this.parsedRequestInfo.uId= this.uId;
                  this.parsedRequestInfo.readMode= this.readMode;
                  this.parsedRequestInfo.ID= res.value[0].ID;
                  this.parsedRequestInfo.Title= res.value[0].Title;
                  this.parsedRequestInfo.Status= res.value[0].Status;
                  this.parsedRequestInfo.PendingWith= res.value[0].PendingToName;
                  this.parsedRequestInfo.Requestor= this.supModel.Requestor; 
                
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

    getSystemInfo(custId?:any, sysType?:any){
  
      return new Promise((resolve, reject)=>{
        try{
          this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('CustomerSystemDetails')/items?&$top=2000&$select=*&$filter=CustId eq '${custId}' and SystemType eq '${sysType}'`)
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
                    SIEmail: val.SIEmail
                  };

                  this.supModel.AppParameters.SystemDetail = sd;
                })

                this.parsedRequestInfo.AppParameters.SystemDetail = this.supModel.AppParameters.SystemDetail;                
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

    getSubSystemInfo(custId?:any, sysCatType?:any){
  
      return new Promise((resolve, reject)=>{
        try{
          this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('CustomerSystemDetails')/items?&$top=2000&$select=*&$filter=CustId eq '${custId}' and SystemModule eq '${sysCatType}'`)
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
                    SIEmail: val.SIEmail
                  };

                  this.supModel.AppParameters.SystemDetail = sd;
                })

                this.parsedRequestInfo.AppParameters.SystemDetail = this.supModel.AppParameters.SystemDetail;                
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
      //(document.getElementById('btnSubmitNewReq') as HTMLInputElement).disabled = true;
      // setTimeout(function () {
      //   (document.getElementById('btnSubmitNewReq') as HTMLInputElement).style.display = 'none';
      // }, 1000);      
    }

    approverAction(action:any){
      this.outputToParent.emit(this._form.value);
      this.btnClickAction.emit(action);

      if(this.parsedRequestInfo.Status == "Submitted"){

        // (document.getElementById('btnAssigned') as HTMLInputElement).disabled = true;
        // setTimeout(function () {
        //   (document.getElementById('btnAssigned') as HTMLInputElement).style.display = 'none';
        // }, 1000);
        

      }else{
        (document.getElementById('btnSubmitNewReq') as HTMLInputElement).disabled = true;
        setTimeout(function () {
          (document.getElementById('btnSubmitNewReq') as HTMLInputElement).style.display = 'none';
        }, 1000);
      }

      
    }

    processAction(action:any){

      Swal.fire({
        title: 'Are you sure?',
        text: 'This process is irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, go ahead.',
        cancelButtonText: 'No, let me think',
      }).then((result) => {
        if (result.value) {
          if(this.parsedRequestInfo.uId == ""){
        
            this.parsedRequestInfo.AppParameters.Requestor = this._form.value.Requestor;
            this.parsedRequestInfo.AppParameters.ProblemDescription = this._form.value.AppParameters.ProblemDescription;
            this.parsedRequestInfo.AppParameters.PriorityInfo = this._form.value.AppParameters.PriorityInfo;
            this.parsedRequestInfo.AppParameters.SystemDetail = this._form.value.AppParameters.SystemDetail;
            this.parsedRequestInfo.AppParameters.Attachments = this.listOfFiles;
            this.parsedRequestInfo.AppParameters.Action = action;
            this.parsedRequestInfo.AppParameters.Comments = this._form.value.AppParameters.Comments;
            this.parsedRequestInfo.AppParameters.OnBehalfOf = this.onbehalfof;
            if(this.onbehalfof){          
              this.parsedRequestInfo.AppParameters.Employee = this._form.value.Employee;
            }
            this.outputToParent.emit(this.parsedRequestInfo);
    
            this.btnClickAction.emit(this.parsedRequestInfo);
    
            this.btnDisabled = true;
    
            
            setTimeout(function () {
              (document.getElementById('btnSubmitNewReq') as HTMLInputElement).style.display = 'none';
            }, 1000);
    
          }else{
    
            if(action == 'Assigned'){
              this.parsedRequestInfo.AppParameters.Requestor = this._form.value.AppParameters.Requestor;
              this.parsedRequestInfo.AppParameters.SystemDetails = this._form.value.AppParameters.SystemDetails;
              this.parsedRequestInfo.AppParameters.Attachments = this.listOfFiles;
              this.parsedRequestInfo.AppParameters.AssignedTasks = this._form.value.AppParameters.AssignedTasks;
              this.parsedRequestInfo.AppParameters.Action = action;
              this.parsedRequestInfo.AppParameters.Comments = this._form.value.AppParameters.Comments;
              this.outputToParent.emit(this.parsedRequestInfo);
              //this.btnClickAction.emit(action);
    
              this.btnDisabled = true;
              
              setTimeout(function () {
                (document.getElementById('btnAssigned') as HTMLInputElement).style.display = 'none';
              }, 1000);
    
            }
            else if(action == 'UATRequest'){
              this.parsedRequestInfo.AppParameters.Requestor = this._form.value.AppParameters.Requestor;
              this.parsedRequestInfo.AppParameters.SystemDetails = this._form.value.AppParameters.SystemDetails;
              this.parsedRequestInfo.AppParameters.Attachments = this.listOfFiles;
              this.parsedRequestInfo.AppParameters.AssignedTasks = this._form.value.AppParameters.AssignedTasks;
              this.parsedRequestInfo.AppParameters.Action = action;
              this.parsedRequestInfo.AppParameters.Comments = this._form.value.AppParameters.Comments;
              this.outputToParent.emit(this.parsedRequestInfo);
              //this.btnClickAction.emit(action);
    
              this.btnDisabled = true;
              
              setTimeout(function () {
                (document.getElementById('btnUATRequest') as HTMLInputElement).style.display = 'none';
              }, 1000);
    
            }
            else if(action == 'UATFeedbackFrmCustomer'){
              this.parsedRequestInfo.AppParameters.Requestor = this.parsedRequestInfo.Requestor;
              this.parsedRequestInfo.AppParameters.SystemDetail = this.parsedRequestInfo.AppParameters.SystemDetail;
              this.parsedRequestInfo.AppParameters.Attachments = this.listOfFiles;
              this.parsedRequestInfo.AppParameters.AssignedTasks = this.parsedRequestInfo.AppParameters.AssignedTasks;
              this.parsedRequestInfo.AppParameters.Action = action;
              this.parsedRequestInfo.AppParameters.Comments = this._form.value.AppParameters.Comments;
              this.outputToParent.emit(this.parsedRequestInfo);
              //this.btnClickAction.emit(action);
    
              this.btnDisabled = true;             
              
              // setTimeout(function () {
              //   (document.getElementById('btnCustomerUATFeedback') as HTMLInputElement).style.display = 'none';
              // }, 1000);
    
            }
            else if(action == 'Query'){
    
              if( this._form.value.AppParameters.Comments == "" ){
                alert("Please type your Query in the Comments field and try again.");
                return false;
              }
              else{
                this.parsedRequestInfo.AppParameters.Requestor = this._form.value.AppParameters.Requestor;
                this.parsedRequestInfo.AppParameters.SystemDetails = this._form.value.AppParameters.SystemDetails;
                this.parsedRequestInfo.AppParameters.Attachments = this.listOfFiles;
                this.parsedRequestInfo.AppParameters.AssignedTasks = this._form.value.AppParameters.AssignedTasks;
                this.parsedRequestInfo.AppParameters.Action = action;
                this.parsedRequestInfo.AppParameters.Comments = this._form.value.AppParameters.Comments;
                this.outputToParent.emit(this.parsedRequestInfo);
              }          
              
              this.btnDisabled = true;
    
            }
            else if(action == 'Completed'){
              this.parsedRequestInfo.AppParameters.Requestor = this.parsedRequestInfo.Requestor;
              this.parsedRequestInfo.AppParameters.SystemDetail = this.parsedRequestInfo.AppParameters.SystemDetail;
              this.parsedRequestInfo.AppParameters.Attachments = this.listOfFiles;
              this.parsedRequestInfo.AppParameters.AssignedTasks = this.parsedRequestInfo.AppParameters.AssignedTasks;
              this.parsedRequestInfo.AppParameters.Action = action;
              this.parsedRequestInfo.AppParameters.Comments = this._form.value.AppParameters.Comments;
              this.outputToParent.emit(this.parsedRequestInfo);
    
              this.btnDisabled = true;             
              
              // setTimeout(function () {
              //   (document.getElementById('btnCustomerUATFeedback') as HTMLInputElement).style.display = 'none';
              // }, 1000);
    
            }else{
              this.parsedRequestInfo.AppParameters.Requestor = this._form.value.AppParameters.Requestor;
              this.parsedRequestInfo.AppParameters.SystemDetails = this._form.value.AppParameters.SystemDetails;
              this.parsedRequestInfo.AppParameters.Attachments = this.listOfFiles;
              this.parsedRequestInfo.AppParameters.Comments = this._form.value.AppParameters.Comments;
              this.parsedRequestInfo.AppParameters.Action = action;
      
              this.outputToParent.emit(this.parsedRequestInfo);
              //this.btnClickAction.emit(action);
              this.btnDisabled = true;
            }
    
            
          }
          
          
          //Swal.fire('Successfull !', 'Request submitted successfully.', 'success');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Request still not submitted.)', 'error');
        }
      });



      
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
        SIEmail: ['', ""]
      });

    }


    
    addSystemDetail(): void {     

      let sysDetControl = (this._form.controls.AppParameters.controls.SystemDetails as FormArray);
      
      sysDetControl.push(this.createSystemDetail());
    }

    getSysDetControls(){
      return (this._form.controls.AppParameters.controls.SystemDetails as FormArray).controls;
    }

    async onSystemTypeSelect(e:any){
      let systemInfo:any = await this.getSystemInfo(this.requestorsInfo.CustId, e);

      if(Object.prototype.hasOwnProperty.call(systemInfo, 'AppParameters')){
        this._form.controls.AppParameters.get('SystemDetail').patchValue(systemInfo.AppParameters.SystemDetail);        
      }
    };

    async onSubSystemTypeSelect(module:any){
      let systemInfo:any = await this.getSubSystemInfo(this.requestorsInfo.CustId, module);

      if(Object.prototype.hasOwnProperty.call(systemInfo, 'AppParameters')){
        this._form.controls.AppParameters.get('SystemDetail').patchValue(systemInfo.AppParameters.SystemDetail);        
      }
    }

    async onRequestForSelect(e:any){
      if(e.value == "SAP"){
        this.requestForCategories = [];
        this.requestForCategories = this.nsapModl;
      }else{
        this.requestForCategories = [];
        this.requestForCategories = this.nOtherModl;
      }
      
    }

    onReqForCategorySelect(selection:any){
      this.onSubSystemTypeSelect(selection);           
    }

    getAllAttachments(title:any){
      let attachments:any = [];
      return new Promise((resolve, reject)=>{
        try{ 
          this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('supportattachment')/items?&$top=2000&$select=ID,Title,AttachmentFiles,Attachments,ActionDate,ActionBy&$expand=AttachmentFiles&$filter=Title eq '${title}'`)
          .subscribe(
            (res:any)=>{
              if(res.value.length > 0){                
                
                (res.value).forEach((val) => {
                  let sd = {
                    Title: val.CustId,
                    ActionBy: val.ActionBy,        
                    ActionDate: val.ActionDate,
                    AttachmentFiles: val.AttachmentFiles,
                    Attachments: val.Attachments,
                    ID: val.ID
                  };
                  attachments.push(sd);
                })
                
                resolve(attachments);
                return attachments;
              }else{
                resolve(attachments);
                return attachments;
              }           
              
          })            
        } 
        catch(err){
          reject('Retrieve details data failed !');
          console.log("Error: " + err);
        }
      })
    }

    getMasterListInfo(empADId?:any){
  
      return new Promise((resolve, reject)=>{
        try{

              this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('supportmaster')/items?&$top=2000&$select=*&$filter=GUID eq '${this.uId}'`)
              .subscribe(
                (res:any)=>{

                  this.supModel.Requestor =                
                  {
                    CustId: res.value[0].CustId,
                    CustName: res.value[0].CustName,
                    CustCompanyName: res.value[0].CustCompanyName,
                    CustCompany1stAddress: res.value[0].CustCompany1stAddress,
                    Cust1stEmail: res.value[0].Cust1stEmail,
                    Cust1stMobile: res.value[0].Cust1stMobile,
                    CustDesignation: res.value[0].CustDesignation
                  };

                  this.supModel.AppParameters.ProblemDescription =                
                  {
                    RequestFor: res.value[0].RequestFor,
                    RequestCategory: res.value[0].RequestCategory,
                    Subject: res.value[0].Subject,
                    Description: res.value[0].Description,
                  };

                  this.supModel.AppParameters.PriorityInfo =                
                  {
                    Priority: res.value[0].Priority,
                    EmergContact: res.value[0].EmergContact,
                    BusinessImpact: res.value[0].BusinessImpact,
                    EmergContactNumber: res.value[0].EmergContactNumber,
                    EmergContactEmail: res.value[0].EmergContactEmail,
                  };

                  this.supModel.AppParameters.Attachments = res.value[0].Attachments;               
                  
                  this.supModel.AppParameters.SystemDetail =                
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

                  this.parsedRequestInfo = { 
                    uId: this.uId,
                    readMode: this.readMode,
                    ID: res.value[0].ID,
                    Title: res.value[0].Title,
                    Status: res.value[0].Status,
                    PendingTo: JSON.parse(res.value[0].PendingTo),
                    Requestor: this.supModel.Requestor,
                    AppParameters: this.supModel.AppParameters,
                    OnBehalfOf: res.value[0].OnBehalfOf, 
                  };

                  if(this.parsedRequestInfo.PendingTo.length >0 ){
        
                    this.parsedRequestInfo.PendingTo.forEach(pen => {
                      //this._pendingWith = pen.approversName + " ; " + this._pendingWith;
                      if(res.value[0].Status == "Assigned" || res.value[0].Status == "ReAssigned" || res.value[0].Status == "TaskPickedUp" || res.value[0].Status == "UATFeedbackFrmCustomer" || res.value[0].Status == "ReadyforUAT"){
                        this._pendingWith = "Support Group Members" ;
                      }
                      else{
                        this._pendingWith = pen.approversName ;
                      }
                      
                    });
        
                  }else{
                    this._pendingWith = "";
                  };

                  if(res.value[0].OnBehalfOf){
                    this.supModel.Employee =                
                    {
                      EmpId: res.value[0].Employee.EmpId,
                      EmpName: res.value[0].Employee.EmpName,
                      EmpCompanyName: res.value[0].Employee.EmpCompanyName,
                      EmpCompany1stAddress: res.value[0].Employee.EmpCompany1stAddress,
                      Emp1stEmail: res.value[0].Employee.Emp1stEmail,
                      Emp1stMobile: res.value[0].Employee.Emp1stMobile,
                      EmpDesignation: res.value[0].Employee.EmpDesignation
                    };
                    
                    this.parsedRequestInfo.Employee = this.supModel.Employee;
                  };
                
                resolve(this.parsedRequestInfo);
                return this.parsedRequestInfo;
              })            
        } 
        catch(err){
          reject('Retrieve master data failed !');
          console.log("Error: " + err);
        }
      })
    };

    async getProcessLog(title:any){
  
      return await new Promise((resolve, reject)=>{
        let processLogs:any = [];

        try{
          return this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('supportprocesslog')/items?&$top=2000&$select=*&$filter=Title eq '${title}'`)
          .subscribe(
            (res:any)=>{
              if(res.value.length > 0){                
                
                (res.value).forEach((val) => {
                  let sd = {
                    Title: val.CustId,
                    Created: val.Created,        
                    Status: val.Status,
                    ProcessByName: val.ProcessByName,
                    ProcessByEmail: val.ProcessByEmail,
                    Comments: val.Comments
                  };
                  processLogs.push(sd);
                  
                })
                //this.allProcessLogs = processLogs;
                //this.parsedRequestInfo.AppParameters.ProcessLog = processLogs;
                resolve(processLogs);
                return processLogs;                
              }else{
                //this.allProcessLogs = processLogs;
                resolve(processLogs);
                return processLogs;
              }
           
          })            
        } 
        catch(err){
          reject('Retrieve details data failed !');
          console.log("Error: " + err);
        }
      })
    };

    async getAssignedTasks(title:any){
  
      return await new Promise((resolve, reject)=>{
        let assignedTasks:any = [];

        try{
          return this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('SupportAssignedTasks')/items?&$top=2000&$select=*&$filter=Title eq '${title}'`)
          .subscribe(
            (res:any)=>{
              if(res.value.length > 0){                
                
                (res.value).forEach((val) => {
                  let sd = {
                    Title: val.Title,
                    TaskId: val.TaskId,
                    TaskTitle: val.TaskTitle,
                    ExpectedStartDate: val.ExpectedStartDate,
                    ExpectedEndDate: val.ExpectedEndDate,
                    ReporterId: val.ReporterId,
                    ReporterName: val.ReporterName,
                    ReporterEmail: val.ReporterEmail,
                  };
                  assignedTasks.push(sd);
                  
                })
                //this.allProcessLogs = processLogs;
                //this.parsedRequestInfo.AppParameters.ProcessLog = processLogs;
                resolve(assignedTasks);
                return assignedTasks;                
              }else{
                //this.allProcessLogs = processLogs;
                resolve(assignedTasks);
                return assignedTasks;
              }
           
          })            
        } 
        catch(err){
          reject('Retrieve details data failed !');
          console.log("Error: " + err);
        }
      })
    };

    async getAssignees(title:any){
  
      return await new Promise((resolve, reject)=>{
        let assignees:any = [];

        try{
          return this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('SupportTaskAssignee')/items?&$top=2000&$select=*&$filter=Title eq '${title}'`)
          .subscribe(
            (res:any)=>{
              if(res.value.length > 0){                
                
                (res.value).forEach((val) => {
                  let sd = {
                    rowId: val.ID,
                    Title: val.Title,
                    TaskId: val.TaskId,
                    AssignedToName: val.AssignedToName,
                    AssignedToEmail: val.AssignedToEmail,
                    AssignedToDesignation: val.AssignedToDesignation,
                    ExpectedTimeTaken: val.ExpectedTimeTaken,
                    ActualTimeTaken: val.ActualTimeTaken,
                    AssignedTaskStatus: val.AssignedTaskStatus,
                    AcceptedTimeTaken: val.AcceptedTimeTaken,
                    AssigneeQuery: val.AssigneeQuery
                  };
                  assignees.push(sd);
                  
                })
                //this.allProcessLogs = processLogs;
                //this.parsedRequestInfo.AppParameters.ProcessLog = processLogs;
                resolve(assignees);
                return assignees;                
              }else{
                //this.allProcessLogs = processLogs;
                resolve(assignees);
                return assignees;
              }
           
          })            
        } 
        catch(err){
          reject('Retrieve details data failed !');
          console.log("Error: " + err);
        }
      })
    };

    async loadCustomerInfo(custId?: any){
      return new Promise((resolve:any, reject:any)=>{
        let itemSet = (localStorage.getItem('logedCustId') !== null);

        if(itemSet){

          let ls = localStorage.getItem('logedCustId');
          if(ls != "" ){           

            let filApiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistration')/items?&$top=200&$select=*&$filter=CustId eq '${ls}'  `;

            this.httpClient.get(filApiUrl).subscribe((res:any)=>{
              if(res.value.length > 0){
                this.requestorsInfo = {
                  CustId: res.value[0].CustId,
                  CustName: res.value[0].CustName,
                  CustCompanyName: res.value[0].CustCompanyName,    
                  CustCompany1stAddress: res.value[0].CustCompany1stAddress,
                  CustDesignation: res.value[0].CustDesignation,
                  Cust1stEmail: res.value[0].Cust1stEmail,
                  Cust1stMobile: res.value[0].Cust1stMobile,
                  RequestDate: res.value[0].RequestDate
                }

                //this._form.controls.Requestor.patchValue(this.requestorsInfo);
                
                return resolve(this.requestorsInfo);
                //return(this.requestorsInfo);
              }else{
                return reject();
              }
            })
    
          }else{
            return reject();
          }          

        }else if(custId != undefined){

          let filApiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistration')/items?&$top=200&$select=*&$filter=CustId eq '${custId}'  `;

          this.httpClient.get(filApiUrl).subscribe((res:any)=>{
            if(res.value.length > 0){
              this.requestorsInfo = {
                CustId: res.value[0].CustId,
                CustName: res.value[0].CustName,
                CustCompanyName: res.value[0].CustCompanyName,    
                CustCompany1stAddress: res.value[0].CustCompany1stAddress,
                CustDesignation: res.value[0].CustDesignation,
                Cust1stEmail: res.value[0].Cust1stEmail,
                Cust1stMobile: res.value[0].Cust1stMobile,
                RequestDate: res.value[0].RequestDate
              }

              //this._form.controls.Employee.patchValue(this.requestorsInfo);
              
              return resolve(this.requestorsInfo);
              //return(this.requestorsInfo);
            }else{
              return reject();
            }
          })
        }
        else{
          alert("Please login first !");
          return reject();
        }
      })
    };

    async loadBrgrEmployeeInfo(){

      return new Promise((resolve:any, reject:any)=>{
        const itemSet = (localStorage.getItem('logedEmpEmail') !== null);
  
        if(itemSet){
          let lee = localStorage.getItem('logedEmpEmail');
          if(lee != "" ){
            let filApiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('BergerTechEmployeeInformation')/items?&$top=200&$select=*&$filter=EmployeeEmail eq '${lee}' `;

            this.httpClient.get(filApiUrl).subscribe((res:any)=>{
              if(res.value.length > 0){
                this.requestorsInfo = {
                  EmpId: res.value[0].EmployeeId,
                  EmpName: res.value[0].EmployeeName,
                  EmpCompanyName: res.value[0].Company,    
                  EmpCompany1stAddress: res.value[0].OfficeLocation,
                  EmpDesignation: res.value[0].Designation,
                  Emp1stEmail: res.value[0].EmployeeEmail,
                  Emp1stMobile: res.value[0].Mobile,
                  RequestDate: new Date()
                }

                //this._form.controls.Requestor.patchValue(this.requestorsInfo);
                
                return resolve(this.requestorsInfo);
                //return(this.requestorsInfo);
              }else{
                return reject();
              }
            })
    
          }else{
            return reject();
          }

          

        }else{
          alert("Please login first !");
          return reject();
        }
      })
    }

    createAssignedTasks(): FormGroup {

      return this.formBuilder.group({
        rowId: [null, ""],
        TaskId: ['', ""],
        TaskTitle: ['', ""],
        ExpectedStartDate: ['', ""],
        ExpectedEndDate: ['', ""],
        Assignees: this.formBuilder.array([])
      });

    };

    
    addAssignedTasks(): void {   

      let assignedTasks = (this._form.controls.AppParameters.controls.AssignedTasks as FormArray);
      let taskLength = assignedTasks.length;     
      assignedTasks.push(this.createAssignedTasks());
      this.addAssignee(taskLength);
    }

    peoplepickerSelection(e:any){    
      //this.openedStartDrawer = true;
      //this.openedEndDrawer = true;
    }

    
    assignedTasksCtl(){

      let assignedTasks = (this._form.controls.AppParameters.controls.AssignedTasks as FormArray);
      return assignedTasks;

    };

    assigneeFGroup(): FormGroup {

      return this.formBuilder.group({
        rowId: [null, ""],
        TaskId: ['', ""],
        AssignedToName: ['', ""],
        AssignedToEmail: ['', ""],
        AssignedToDesignation: ['', ""],
        ExpectedTimeTaken: [null, ""],
        ActualTimeTaken: [null, ""],
        AcceptedTimeTaken: [null, ""],
        AssignedTaskStatus: ['', ""],
        AssigneeQuery: ['', ""],
      });

    };

    addAssignee(i: number){      
      let assigneeCtrl = this._groupsFormArray.controls[i].controls.Assignees as FormArray; 
      assigneeCtrl.push(this.assigneeFGroup());
    };

    deleteAssignee(assIndex: number) {
      this.lessons.removeAt(assIndex);
    }

    get _groupsFormArray(): FormArray {
      return this._form.controls.AppParameters.controls.AssignedTasks as FormArray;
    }

    _addGroup() {
      
      this.addAssignedTasks();

      // this._groupsFormArray.push(
      //   this.addAssignedTasks()
      //   //this.createAssignedTasks()
      //   // this.formBuilder.control({
      //   //   AssignedTasks: []
      //   // })
      // );
    }

    _delete(index: number) {
      this._groupsFormArray.removeAt(index);
    }

    getformControlName(i){
      return i as FormControlName;
    }

    _loadCustomerInfoView(customerInfo:any){

      return new Promise((resolve:any, reject:any)=>{
          this.requestorsInfo = customerInfo;

          //====================loading requestors info =============
          this.applicantInjector = Injector.create({
            providers: [
              {
                provide: CustomerInfoloaderService ,
                deps: []
              }
            ],
            parent: this.injector
          });
  
          let applicantService = this.applicantInjector.get(CustomerInfoloaderService ); 
          
          let grdInfo = {
              formGroup: this._form,
              requestorInfo: customerInfo,
              mode: 'edit'
          }

          applicantService.gridInfo = grdInfo; 
  
          setTimeout(() => {
            this.ApplicantComponent = CustomerhomeComponent ;
  
            this.displayApplicant = true;

            resolve();
          }, 1); 

          //-----------------------loading requestors info ends ---------
      })

    }

    _loadEmployeeInfoView(empInfo:any){

      return new Promise((resolve:any, reject:any)=>{
          //this.requestorsInfo = customerInfo;

          //====================loading requestors info =============
          this.employeeInjector = Injector.create({
            providers: [
              {
                provide: RequestorinfoloaderService ,
                deps: []
              }
            ],
            parent: this.injector
          });
  
          let requestorService = this.employeeInjector.get(RequestorinfoloaderService ); 
          
          let grdInfo = {
              formGroup: this._form,
              empInfo: empInfo,
              mode: 'edit'
          }

          requestorService.gridInfo = grdInfo; 
  
          setTimeout(() => {
            this.RequestorComponent = RequestorhomeComponent ;
  
            this.displayRequestor = true;

            resolve();
          }, 1); 

          //-----------------------loading employee as befalf of info ends ---------
      })

    }

    //##=== Get Support Syb-Categories/Modules Dropdown Items ###=====
    private _getAllSupCategories(){

      return new Promise((resolve, reject)=>{
        try{ 
          this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('SupportCategoryResponsibles')/items?&$top=2000&$select=*`) 
          .subscribe(
            (res:any)=>{
              if(res.value.length > 0){  
                
                this.sapModules=[];
                this.otherCategories=[];
                
                (res.value).forEach((val:any) => {
  
                  if(val.Category == "SAP"){
                    let sm = {
                      value: val.Modules,
                      viewValue: val.Modules,
                      resName: val.InChargeName,
                      resEmail: val.InChargeEmail,
                      disabled: false
                    };
                    this.sapModules.push(sm);
                  }else{
                    let om = {
                      value: val.Modules,
                      viewValue: val.Modules,
                      resName: val.InChargeName,
                      resEmail: val.Incharge.Email,
                      disabled: false
                    };
                    this.otherCategories.push(om);
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

    //##=== Get Support Syb-Categories/Modules Dropdown Items ###=====
    private _getApproversOfCustomers(custId:any){

      //return new Promise((resolve, reject)=>{
        try{
          //let custApvrApi = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('ApproversOfCustomers')/items?&$top=2000&$select=*&$filter=CustId eq '${custId}'`;

          this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('ApproversOfCustomers')/items?&$top=2000&$select=*&$filter=CustId eq '${custId}'`) 
          .subscribe(
            (res:any)=>{
              if(res.value.length > 0){ 
                
                let nReqFors = [
                  {value: 'SAP', viewValue: 'SAP', disabled: true},
                  {value: 'Others', viewValue: 'Others', disabled: true}
                ];
                
                (res.value).forEach((val:any) => {
  
                  if(val.SystemType == "SAP"){
                    nReqFors.map((itm:any)=>{
                      if(itm.value == 'SAP'){
                        
                        itm.disabled= false;

                        this.nsapModl.push({
                          value: val.SystemModule, 
                          viewValue: val.SystemModule, 
                          disabled: false,
                          BergerTechIncharge: val.BergerTechIncharge,
                          BergerTechInchargeEmail: val.BergerTechInchargeEmail                        
                        })
                      }
                    })
                    
                  }else if(val.SystemType == "Others"){

                    nReqFors.map((itm:any)=>{
                      if(itm.value == 'Others'){
                        itm.disabled= false;
                        this.nOtherModl.push({
                          value: val.SystemType, 
                          viewValue: val.SystemModule, 
                          disabled: false,
                          BergerTechIncharge: val.BergerTechIncharge,
                          BergerTechInchargeEmail: val.BergerTechInchargeEmail                        
                        })
                      }
                    })
                   
                  }
                  else{ }                                    
  
                })

                this.requestFors = [];
                this.requestFors = nReqFors;

                if(nsapModl.length >0){
                  this.sapModules = [];
                  this.sapModules = nsapModl;
                }

                if(nOtherModl.length >0){
                  this.othersModules = [];
                  this.othersModules = nOtherModl;
                }
                
                //resolve();
                return ;
              }else{
                //resolve();
                return ;
              }           
              
          })            
        } 
        catch(err){
          reject('Retrieve SupCatResponsibles failed !');
          console.log("Error: " + err);
        }
      //})
    };


    // private _getSupCatResponsibles(title:any){

    //   return new Promise((resolve, reject)=>{
    //     try{ 
    //       this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('SupportCategoryResponsibles')/items?&$top=2000&$select=*&$filter=To ge '${new Date().toISOString()}'`) 
    //       .subscribe(
    //         (res:any)=>{
    //           if(res.value.length > 0){                
                
    //             (res.value).forEach((val) => {

    //               if(val.Category == "SAP"){
    //                 let sm = {
    //                   value: val.Modules,
    //                   viewValue: val.Modules,
    //                   resName: val.Incharge.Title,
    //                   resEmail: val.Incharge.Email
    //                 };
    //                 this.sapModules.push(sm);
    //               }else{
    //                 let om = {
    //                   value: val.Modules,
    //                   viewValue: val.Modules,
    //                   resName: val.Incharge.Title,
    //                   resEmail: val.Incharge.Email
    //                 };
    //                 this.otherCategories.push(om);
    //               }                  

    //             })

    //             let supReqRors = {
    //               sapModules: this.sapModules,
    //               otherCategories: this.otherCategories
    //             }
                
    //             resolve(supReqRors);
    //             return supReqRors;
    //           }else{
    //             resolve(supReqRors);
    //             return supReqRors;
    //           }           
              
    //       })            
    //     } 
    //     catch(err){
    //       reject('Retrieve SupCatResponsibles failed !');
    //       console.log("Error: " + err);
    //     }
    //   })
    // };

    onPrioritySelect(e:any){

      if(e == "Highest"){
        this.showHPBusImpactDiv = true;
      }
      
    };

    async loadCustomerById(custId: any){
      if(custId == ""){
        alert("Please type your desired Customer Id next to the Cust Id input field !");
      }else if(custId.length <3 || custId.length >10){
        alert("Please type a valid Customer Id next to the Cust Id input field !");
      }else{
        
        let customerInfo = await this.loadCustomerInfo(custId); 
        
        if(Object.prototype.hasOwnProperty.call(customerInfo, "CustId")){
          await this._loadCustomerInfoView(customerInfo);            
          this.showReqInfoDiv = true;
          this.onbehalfof = true;
        }     
        
      }
      
    };

    alertConfirmation() {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This process is irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, go ahead.',
        cancelButtonText: 'No, let me think',
      }).then((result) => {
        if (result.value) {
          Swal.fire('Successfull !', 'Request submitted successfully.', 'success');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Request still not submitted.', 'error');
        }
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

    // async ngAfterViewInit(){
    //   await this.appdataproviderService.getMasterListInfo(this.uId);
    // }

    ngOnDestroy(){
      //this.appDataSubscription.unsubscribe();
    };


}

//===================================

