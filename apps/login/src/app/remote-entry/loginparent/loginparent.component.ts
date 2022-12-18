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

// export class IFunctionalContact{
//   Name: any;
//   Role: any;
//   Phone: any;
//   Email: any;
// }

export class IProcessLogs {
  CustId: string;
  Created: any;        
  Status: string;
  ProcessByName: any;
  ProcessByEmail: string;
  Comments: string;
}

export class IAttachmentFiles {
  FileName: any;
  ServerRelativeUrl: any; 
}

export class IAttachments {
  CustId: string;
  ActionBy: any;        
  ActionDate: any;
  AttachmentFiles: IAttachmentFiles[];
  Attachments: boolean;
  ID: number;
};

export interface ISystemDetails {
  rowId?: any;
  SystemType: string;
  SystemModule: string;        
  SAPCustomerNumber: string;
  SUser: string;
  SystemDescription: string;
  Manufacturer: string;
  Model: string;
  OperatingSystem: string;
  OSRelease: string;
  DatabaseName: string;
  DatabaseRelease: string;
  PersonIncharge: string;
  SIContactNo: string;
  SIEmail: string;
};

export interface IRequestor {
  CustId: string;
  CustName: string;
  CustCompanyName: string;
  CustCompany1stAddress: string;
  CustCompany2ndAddress: string;
  CustCompany3rdAddress: string;
  Cust1stEmail: string;
  Cust2ndEmail: string;
  Cust3rdEmail: string;
  Cust1stPhone: string;
  Cust2ndPhone: string;
  Cust3rdPhone: string;
  Cust1stMobile: string;
  Cust2ndMobile: string;
  Cust3rdMobile: string;
  CustDesignation: string;
  PendingTo: string;
  Status: string; 
}

export interface IAppParameters {
  SystemDetails: ISystemDetails[];
  Requestor: IRequestor;
  Attachments?: IAttachments[]                      
}


@Component({
  selector: 'portal-loginparent',
  templateUrl: './loginparent.component.html',
  styleUrls: ['./loginparent.component.scss']
})
export class LoginparentComponent implements OnInit {
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
  supModel:any;

  FunctionalContacts: IFunctionalContact[] = [];

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

  requestorSchema: Schema = {
    "type": "object",
    "properties": {
    "System Opener": { type: "string", description: "Please enter your name", style: {width: '400px', height: "10px"} },
    "Contact Details": { type: "string", description: "Please enter your name", style: {width: '400px', "height": "100px"}, widget: "textarea", widgetType: "rich-text-editor" },
    "Systen Information":{
      type: "string",
      widget: "select",
      displayWithChoices: [
        "SAP",
        "Microsoft",
        "AWS"
      ],
      choices: [
        "SAP",
        "Microsoft",
        "AWS"
      ],
      style: {width: '400px', height: "10px"},
    },
    "Product Area":{
      type: "string",
      widget: "select",
      displayWithChoices: [
        "SAP-FICO",
        "SAP-SD",
        "SAP-MM",
        "SAP-PP"
      ],
      choices: [
        "SAP-FICO",
        "SAP-SD",
        "SAP-MM",
        "SAP-PP"
      ],
      style: {width: '400px'},
    }
    }
    
  };

  descriptionSchema: Schema = {
    "type": "object",
    "properties": {
      "DesConsent": { type: "boolean", description: "I Consent to SAP Support......", style: {width: '400px'} },
      "Subject": { type: "string", description: "Give the issue a title", style: {width: '400px'} },
      "Description": { type: "string", description: "Please enter issue details", style: {width: '400px', "height": "100px"}, widget: "textarea", widgetType: "rich-text-editor" },
        
    }    
  };

  prioritySchema: Schema = {
    "type": "object",
    "properties": {
      "Priority":{
        type: "string",
        widget: "select",
        displayWithChoices: [
          "Low-Business operations not affected",
          "Medium-Business operations are affected",
          "High-Business operations are highly affected",
          "Very High-Business operations are extremely affected"
        ],
        choices: [
          "Low-Business operations not affected",
          "Medium-Business operations are affected",
          "High-Business operations are highly affected",
          "Very High-Business operations are extremely affected"
        ],
        style: {width: '400px'},
      }
        
    }
    
  };

  contactDetSchema: Schema = {
    "type": "object",
    "properties": {
      "Name": { type: "string", description: "Please enter your Name", style: {width: '400px', height: "10px"} },
      "Role": { type: "string", description: "Please enter your Role", style: {width: '400px', height: "10px"} },
      "Primary Phone": { type: "string", description: "Please enter your Primary Phone", style: {width: '400px', height: "10px"} },
      "Secondary Phone": { type: "string", description: "Please enter your Secondary Phone", style: {width: '400px', height: "10px"} },
      "Email": { type: "string", description: "Please enter your Email", style: {width: '400px', height: "10px"} },      
      "Time Zone":{
        type: "string",
        widget: "select",
        displayWithChoices: [
          "BDT",
          "BST"
        ],
        choices: [
          "BDT",
          "BST"
        ],
        style: {width: '400px', height: "10px"},
      }
        
    }
    
  };

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

  systemModules: any[] = [
    {value: 'Financial Accounting and Controlling (FICO)', viewValue: 'Financial Accounting and Controlling (FICO)'},
    {value: 'Material Management (MM)', viewValue: 'Material Management (MM)'},
    {value: 'Plant Maintenance (PM)', viewValue: 'Plant Maintenance (PM)'},
    {value: 'Quality Management (QM)', viewValue: 'Quality Management (QM)'},
    {value: 'Success Factor (SF)', viewValue: 'Success Factor (SF)'},
    {value: 'Production Planning (PP)', viewValue: 'Production Planning (PP)'},
    {value: 'Sales Distribution (SD)', viewValue: 'Sales Distribution (SD)'},
    {value: 'Financial Supply Chain Management (FSCM)', viewValue: 'Financial Supply Chain Management (FSCM)'},
    {value: 'Enterprise Asset Management (EAM)', viewValue: 'OtEnterprise Asset Management (EAM)hers'},
    {value: 'Others', viewValue: 'Others'}
  ];

  allProcessLogs:IProcessLogs[];
  allAttachments:IAttachments[];

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

    if (this.currentAbsoluteUrl.indexOf('=') > -1) {
      let varCurrentUrlSplitArray = this.currentAbsoluteUrl.split('?');
      if (varCurrentUrlSplitArray.length >= 2) {
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
    this._form = this.formBuilder.group({
      AppParameters: this.formBuilder.group({  
        
        SystemDetails: this.formBuilder.array([]),
        		
        Requestor: this.formBuilder.group({
          "CustId": ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(8)])],
          "CustPassword": ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
          "CustName": ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(50)])],
          "CustCompanyName": ['', Validators.compose([Validators.required, Validators.minLength(10)])],
          "CustCompany1stAddress": ['', Validators.compose([Validators.required, Validators.minLength(10)])],
          "CustCompany2ndAddress": ['', ""],
          "CustCompany3rdAddress": ['', ""],
          "Cust1stEmail": ['', Validators.required],
          "Cust2ndEmail": ['', ""],
          "Cust3rdEmail": ['', ""],
          "Cust1stPhone": ['', Validators.compose([Validators.required, Validators.pattern(this.phonePattern)])],
          "Cust2ndPhone": ['', Validators.pattern(this.phonePattern)],
          "Cust3rdPhone": ['', Validators.pattern(this.phonePattern)],
          "Cust1stMobile": ['', Validators.compose([Validators.required, Validators.pattern(this.phonePattern)])],
          "Cust2ndMobile": ['', Validators.pattern(this.phonePattern)],
          "Cust3rdMobile": ['', Validators.pattern(this.phonePattern)],
          "CustDesignation": ['', Validators.compose([Validators.required, Validators.minLength(10)])]          
        }),

        //Attachments: ['', ""],

        //ApprovalHistory: this.formBuilder.array([])

      })        
    }); 
    this.addSystemDetail();
    // this._form = this.formBuilder.group({
    //   AppParameters: this.formBuilder.group({})        
    // }); 

    // this._form.get('AppParameters').addControl('SupportInfo', this.formBuilder.group({
    //   SupportCategory: ['', Validators.required],
    //   ConcernedPerson: ['', Validators.required],
    //   ContactNo: ['', Validators.required],
    //   ContactEmail: ['', Validators.required],
    // }));
    
    //  this._form.controls.AppParameters.controls.SupportInfo.addControl('SystemDetail', this.formBuilder.control('', Validators.required));
    //  this._form.controls.AppParameters.controls.SupportInfo.addControl('ProductArea', this.formBuilder.control('', Validators.required));

    

    // this._form.get('AppParameters').addControl('ProblemDescription', this.formBuilder.group({
    //   Subject: ['', Validators.required],
    //   Description: ['', Validators.required],
    //   Attachment: ['', Validators.required],
    //   Priority: ['', Validators.required],
    //   Consent: ['', Validators.required],
    // }));

    // this._form.controls.AppParameters.controls.ProblemDescription.addControl('EmergContact', this.formBuilder.control('', Validators.required));
    // this._form.get('AppParameters').controls.ProblemDescription.addControl('BusinessImpact', this.formBuilder.control('', Validators.required));

    // this._form.get('AppParameters').addControl('FunctionalContact', this.formBuilder.array([
    //   {
    //     Subject: ['', Validators.required],
    //     Description: ['', Validators.required],
    //     Attachment: ['', Validators.required],
    //     Priority: ['', Validators.required],
    //     Consent: ['', Validators.required],
    //   }
    // ]));  

    
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
        MatcardInfo: this._matcardInfo 
      };

      this.supModel = 
      {
        AppParameters: 
        {
          
          Attachments: [],
          SystemDetails: [
            {
              SystemType: "",
              SystemModule: "",
              SAPCustomerNumber: "",
              SUser: "",
              Manufacturer: "",
              Model: "",              
              OperatingSystem: "",
              OSRelease: "",
              DatabaseName: "",
              DatabaseRelease: "",
              PersonIncharge: "",
              SIContactNo: "",
              SIEmail: ""
            }
          ],
          Requestor:
          {
            "CustId": "4000",
            "CustPassword": "demo",
            "CustName": "Mostafa Kamal",
            "CustCompanyName": "Berger Becker Bangladesh limited",
            "CustCompany1stAddress": "Chittagong, Bangladesh",
            "CustCompany2ndAddress": "Chittagong, Bangladesh",
            "CustCompany3rdAddress": "Chittagong, Bangladesh",
            "Cust1stEmail": "kamal@fosroc.com",
            "Cust2ndEmail": "kamaltech@fosroc.com",
            "Cust3rdEmail": "kamal2@fosroc.com",
            "Cust1stPhone": "4444444444",
            "Cust2ndPhone": "3333333",
            "Cust3rdPhone": "2222222222",
            "Cust1stMobile": "01324255310",
            "Cust2ndMobile": "01324255310",
            "Cust3rdMobile": "01324255310",
            "CustDesignation": "Software Engineer"
          },
          // Recovery:
          // {          
          //   "SecurityQuestion1": "My nick name?",
          //   "SecurityQuestion1Answer": "kamal",
          //   "SecurityQuestion2": "My nick name?",
          //   "SecurityQuestion2Answer": "kamal",
          //   "SecurityQuestion3": "My nick name?",
          //   "SecurityQuestion3Answer": "kamal",
          // },
          // Singlesignon:
          // { 
          //   GmailForSSO: "kamal@gmail.com"
          // }
          
        }        
      }; 

      try{
        await this._createForm();

        //const loggedUser = await this.userService.loggedUserInfo$; 
        //const loggedUser = await this.userService.customerInfo; //from Database Table
        //const loggedUser = await this.userService.customersList[0]; //from local storage data of service
        

        //this.logedUserAdId = loggedUser.cId;
        //let applicantInfo = await this.getEmpInfo(empAdId);

        //this.requestorsInfo = loggedUser;
        this.showReqInfoDiv = true;

        //this._form.get('Requestor').patchValue(loggedUser);        

        // get("https://code.jquery.com/jquery-2.2.4.js", () => {
        //   get("https://bergerpaintsbd.sharepoint.com/sites/kamalportal/_layouts/15/sp.runtime.js", () => {
        //     get("https://bergerpaintsbd.sharepoint.com/sites/kamalportal/_layouts/15/sp.js", () => {
        //       this.GetListItem();
        //     });
        //   });
        // });

        // const scriptElt = this.renderer.createElement('script');
        // this.renderer.setAttribute(scriptElt, 'type', 'text/javascript');
        // this.renderer.setAttribute(scriptElt, 'src', 'https://code.jquery.com/jquery-2.2.4.js');
        // this.renderer.appendChild(this.htmlDocument.head, scriptElt);

        // const scriptElt2 = this.renderer.createElement('script');
        // this.renderer.setAttribute(scriptElt2, 'type', 'text/javascript');
        // this.renderer.setAttribute(scriptElt2, 'src', 'https://bergerpaintsbd.sharepoint.com/sites/kamalportal/_layouts/15/sp.runtime.js');
        // this.renderer.appendChild(this.htmlDocument.head, scriptElt2);

        // const scriptElt3 = this.renderer.createElement('script');
        // this.renderer.setAttribute(scriptElt3, 'type', 'text/javascript');
        // this.renderer.setAttribute(scriptElt3, 'src', 'https://bergerpaintsbd.sharepoint.com/sites/kamalportal/_layouts/15/sp.js');
        // this.renderer.appendChild(this.htmlDocument.body, scriptElt3);

        

        //this.loadScript('https://bergerpaintsbd.sharepoint.com/sites/kamalportal/_layouts/15/sp.js');

        
        // setTimeout(()=>{                          
        //   //this.GetListItem();
        //   this.GetListItem('https://bergerpaintsbd.sharepoint.com/sites/kamalportal');
        // }, 30000);
        
      } 
      catch(err){
        console.log("Error: " + err)
      }
    }

    async executeOnInitProcessesOnUid(){    
      try{
        await this._createForm();
  
        //const loggedUser = await this.userService.loggedUserInfo$; //this.getEmpAdId();

        let masterListInfo:any = await this.getMasterListInfo();
        //let masterListInfo:any = await this.getMasterListInfo(loggedUser);

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
              //this._form.controls.AppParameters.get('SystemDetails').patchValue(this.supModel.AppParameters.SystemDetails);
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

        }

        

        // if(Object.prototype.hasOwnProperty.call(masterListInfo, 'AppParameters')){   
        //   this.requestorsInfo = this.parsedRequestInfo.AppParameters.Requestor;
        //   this._form.controls.AppParameters.get('Requestor').patchValue(this.requestorsInfo);
        // }

        

        // let sd = [
        //   {
        //     SystemType: "SAP",
        //     SystemModule: "rrrrrrrrr",
        //     SAPCustomerNumber: "rrrrrrrr",
        //     SUser: "rrrrrrrrrr",
        //     Manufacturer: "rrrrrrrrrrr",
        //     Model: "rrrrrrrrr",              
        //     OperatingSystem: "rrrrrrrrrrr",
        //     OSRelease: "rrrrrrrrrr",
        //     DatabaseName: "rrrrrrrrrr",
        //     DatabaseRelease: "rrrrrrrr",
        //     PersonIncharge: "rrrrrrrr",
        //     SIContactNo: "rrrrrrrrrrrr",
        //     SIEmail: "rrrrrrrrrrr"
        //   },
        //   {
        //     SystemType: "Others",
        //     SystemModule: "222rrrrrrrrr",
        //     SAPCustomerNumber: "222rrrrrrrr",
        //     SUser: "rrrrrrrrrr",
        //     Manufacturer: "rrrrrrrrrrr",
        //     Model: "rrrrrrrrr",              
        //     OperatingSystem: "rrrrrrrrrrr",
        //     OSRelease: "rrrrrrrrrr",
        //     DatabaseName: "rrrrrrrrrr",
        //     DatabaseRelease: "rrrrrrrr",
        //     PersonIncharge: "rrrrrrrr",
        //     SIContactNo: "rrrrrrrrrrrr",
        //     SIEmail: "rrrrrrrrrrr"
        //   }
        // ],
        // //this._form.controls.AppParameters.get('SystemDetails').patchValue(this.supModel.AppParameters.SystemDetails);
        // this._form.controls.AppParameters.get('SystemDetails').patchValue(sd);
         
        
       
        // /* creating grid coltrols array start */
  
        // let gridValidationParam =          
        //   { 
        //     ClassCode: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     ClassDescription: [Validators.maxLength(6)], 
        //     BusinessArea: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     AreaDescription: [Validators.maxLength(6)], 
        //     CostCenter: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     CCDescription: [Validators.maxLength(6)], 
        //     ProposedItemDescription: [Validators.maxLength(40)],
        //     ImportOrLocal: [Validators.required, Validators.maxLength(6)], 
        //     Qty: [Validators.required, Validators.maxLength(3)], 
        //     UM: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     UnitPrice: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     TotalBDT: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     Justfication: [Validators.required, Validators.minLength(4), Validators.maxLength(6)],
        //     UserName: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     UserEmpID: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     '5YearPlan': [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     CurAvaCapacity: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     ReqProdCapacity: [Validators.required, Validators.minLength(4), Validators.maxLength(6)],
        //     SalesForecast: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     ExpectedCapacity: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     ExpComMonth: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     NewOrReplace: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     ExistingAssetID: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     CAPEXStrategy: [Validators.required, Validators.minLength(4), Validators.maxLength(6)], 
        //     Comments: [Validators.required, Validators.minLength(4), Validators.maxLength(6)]
        // };
  
        
        
  
        //this.PendingWith = this.parsedRequestInfo.AppParameters.PendingWith;
  
        //this.approvalHistory = this.parsedRequestInfo.AppParameters.Requestor.ApprovalHistory;
        
        
        
      } 
      catch(err){
        console.log("Error: " + err)
      }
    }

    getMasterListInfo(empADId?:any){
  
      return new Promise((resolve, reject)=>{
        try{

              this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistration')/items?&$top=2000&$select=*&$filter=GUID eq '${this.uId}'`)
              .subscribe(
                (res:any)=>{

                this.supModel = 
                {
                  AppParameters: 
                  {
                    SystemDetails: [],
                    Requestor:
                    {
                      "CustId": res.value[0].CustId,
                      "CustName": res.value[0].CustName,
                      "CustCompanyName": res.value[0].CustCompanyName,
                      "CustCompany1stAddress": res.value[0].CustCompany1stAddress,
                      "CustCompany2ndAddress": res.value[0].CustCompany2ndAddress,
                      "CustCompany3rdAddress": res.value[0].CustCompany3rdAddress,
                      "Cust1stEmail": res.value[0].Cust1stEmail,
                      "Cust2ndEmail": res.value[0].Cust2ndEmail,
                      "Cust3rdEmail": res.value[0].Cust3rdEmail,
                      "Cust1stPhone": res.value[0].Cust1stPhone,
                      "Cust2ndPhone": res.value[0].Cust2ndPhone,
                      "Cust3rdPhone": res.value[0].Cust3rdPhone,
                      "Cust1stMobile": res.value[0].Cust1stMobile,
                      "Cust2ndMobile": res.value[0].Cust2ndMobile,
                      "Cust3rdMobile": res.value[0].Cust3rdMobile,
                      "CustDesignation": res.value[0].CustDesignation
                    },
                    Attachments: []                      
                  }        
                };


                this.parsedRequestInfo = { 
                  uId: this.uId,
                  readMode: this.readMode,
                  ID: res.value[0].ID,
                  Title: res.value[0].Title,
                  Status: res.value[0].Status,
                  PendingWith: res.value[0].PendingToName,
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
                    SIEmail: val.SIEmail
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
                this.supModel.AppParameters.ProcessLog = processLogs;
                this.parsedRequestInfo.AppParameters.ProcessLog = this.supModel.AppParameters.ProcessLog;                
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
                  this.supModel.AppParameters.Attachments.push(sd);
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
      // (document.getElementById('btnSubmitNewReq') as HTMLInputElement).disabled = true;
      // setTimeout(function () {
      //   (document.getElementById('btnSubmitNewReq') as HTMLInputElement).style.display = 'none';
      // }, 1000);      
    }

    processAction(action:any){
      if(this.parsedRequestInfo.Status == "Submitted"){
        //this.parsedRequestInfo.AppParameters.SystemDetails = this._form.value.SystemDetails;
        this.outputToParent.emit(this.parsedRequestInfo);

        (document.getElementById('btnSubmitNewReq') as HTMLInputElement).disabled = true;
        setTimeout(function () {
          (document.getElementById('btnSubmitNewReq') as HTMLInputElement).style.display = 'none';
        }, 1000);

      }else{
        this.outputToParent.emit(this._form.value);
      }

      
      this.btnClickAction.emit(action);
      //this.approverAction.emit(this._form.value);
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


    /* Handle form errors in Angular 8 */
    public errorHandling = (control: string, error: string) => {
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
        SIEmail: ['', ""]
      });

    }


    
    addSystemDetail(): void {
      const sysDetRowData = {
        rowId: (1 + this.systemTypes),
        SystemType: "",
        SystemModule: "",        
        SAPCustomerNumber: "",
        SUser: "",
        SystemDescription: "",
        Manufacturer: "",
        Model: "",
        OperatingSystem: "",
        OSRelease: "",
        DatabaseName: "",
        DatabaseRelease: "",
        PersonIncharge: "",
        SIContactNo: "",
        SIEmail: ""
      };

      let sysDetControl = (this._form.controls.AppParameters.controls.SystemDetails as FormArray);
      //this.systemTypes.push(sysDetRowData);
      
      //let sdArray = this.supModel;


      //this.supModel.AppParameters.SystemDetail.push(sysDetRowData);
      
      sysDetControl.push(this.createSystemDetail());
    }

    getSysDetControls(){
      return (this._form.controls.AppParameters.controls.SystemDetails as FormArray).controls;
    }
  
   

}

//===================================


