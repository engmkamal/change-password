// @ts-nocheck

import { Component, OnInit, HostListener } from '@angular/core';
import { Subscription, from } from 'rxjs';
import { SharepointlistService } from '@portal/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { 
  LoginService,
  IProcessLog,
  ISupModel,
  ISupportQuery,
  //AppdataproviderService 
} from '@portal/shared/data-access-user';

import Swal from 'sweetalert2';

//import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'portal-supporthome',
  templateUrl: './supporthome.component.html',
  styleUrls: ['./supporthome.component.scss']
})
export class SupporthomeComponent implements OnInit {

  currentAbsoluteUrl = window.location.href;
  Status = "";
  uId:string = "";
  readMode = "";
  logedUserAdId = null;
  _testParamNode = null;
  requestInfo: any = {};
  parsedTestParameters:any;
  testParameters = {};//should be omited
  reportReleaseGrp = {}; //should be omited
  childBtnClickAction = "";
  //createReqInfoFrmChild:any;
  createReqInfoFrmChild:ISupModel = {
    uId: "",
    readMode: "",
    ID: null,
    Title: null,
    Status: null,
    AppParameters: {
      Requestor: {},
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
      Action: ""
    },
    PendingTo: null,
  };

  approvalLink:any;
  reviewLink:any;
  pendingApprovalListInfo:any;
  processLogListInfo:any;
  queryResponseListInfo:any;
  updatedMstrLstInfo:any;
  newDetailLstInfo:any;
  updatedDetailLstInfo:any;
  attachmentListInfor:any;
  notificationListInfo:any;
  labResponsibles = [];
  labResponsiblesOpms = [];
  emitedDataFrmChild:any;
  auditLogComments = "";

  public listInfo = {
    name: "",
    select: "",
    expand: "",
    filterBy: "",
    filterWith: "",
    top: 0
  };

  parsedRequestInfo = {
    uId: "",
    readMode: "",
    ID: null,
    Title: null,
    Status: null,
    AppParameters: {
      Requestor: {},
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
    },
    PendingWith: null,
  };
  
  webAbsoluteUrl = window.location.origin;
  //webAbsoluteUrl = "https://portaldv.bergerbd.com/leaveauto";

  //==for alert==
  options = {
    autoClose: false,
    keepAfterRouteChange: false
  };

  //=========for customer feedback ===========
  rating:number = 3;
  starCount:number = 5;
  starColor = 'accent';

  allApprovers: any = {};

  dataFrmExcelUpload: any = [];

  appDataSubscription!: Subscription;

  isLoggedIn$ = this._loginService.isUserLoggedIn$;

  pendingtasksUrl = "https://support.bergertechbd.com/pendingtasks";
  myrequestsUrl = "https://support.bergertechbd.com/myrequests" ;

  // starColorP:StarRatingColor = StarRatingColor.primary;
  // starColorW:StarRatingColor = StarRatingColor.warn;

  // public feedback = {
  //   infoAvailabilityR : 3,
  //   serviceResponseR : 3,
  //   repClarificationR : 3,
  //   servReliabilityR : 3,
  //   presentationModeR : 3
  // }

  constructor(
    private router: Router,
    private _loginService: LoginService,
    public sharepointlistService: SharepointlistService,
    //private appdataproviderService: AppdataproviderService,
    private httpClient: HttpClient 
    ) {
      
    //=====Reading unique id from url -- start ==========
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
    //------Reading unique id from url -- End-----

    if (this.currentAbsoluteUrl.indexOf('=') > -1) {
      let varCurrentUrlSplitArray = this.currentAbsoluteUrl.split('?');
      if (varCurrentUrlSplitArray.length >= 2) {
        let queryString = varCurrentUrlSplitArray[1];
        let parameters = queryString.split('&');
        for (let i = 0; i < parameters.length; i++) {
          let param = parameters[i];
          if (param.toLowerCase().indexOf('guid=') > -1){
            this.uId = param.split('=')[1];
            if( this.uId == "" && localStorage.getItem('logedCustId') == null && localStorage.getItem('logedEmpEmail') == null){
              this.router.navigate(['/login']);          
            }
          }
          else if (param.toLowerCase().indexOf('mode=') > -1)
            this.readMode = param.split('=')[1];
        }
      }
    }
    
  }

  ngOnInit(): void {

    //this.toastSucAlert('success', false, 'Request Submitted Successfully');

    //this.appdataproviderService.getUid();

    this.isLoggedIn$
    .pipe(distinctUntilChanged())
    .subscribe(async (loggedIn) => {
      if (!loggedIn) {
        this.router.navigate(['/login']);
        
      }else if( localStorage.getItem('logedCustId') == null && localStorage.getItem('logedEmpEmail') == null){
        this.router.navigate(['/login']);          
      } 
      else { 
        
        if (this.uId != "") {             
        } else {
            this.requestInfo = {
              uId: "",
              readMode: "",
              Status: "" 
            };
        }
        
        // this.appDataSubscription = this.this.appdataproviderService.appData$.subscribe((res:any) => {
        //   if (res.uId != "") {             
        //   } else {
        //       this.requestInfo = {
        //         uId: "",
        //         readMode: "",
        //         Status: "" 
        //       };
        //   }
        // })
      }
    });

  }

  async executeAfterViewInit(){

    let _approvers = await this._getAllApprovers();

    if(_approvers.value.length >0){
      this.allApprovers = 
      {
        headITInfraName: _approvers.value[0].BusDevLeadName,
        headITInfraEmail: _approvers.value[0].BusDevLeadEmail,
        headERPName: _approvers.value[0].SAPProgLeadName,
        headERPEmail: _approvers.value[0].SAPProgLeadEmail,
        gmITName: _approvers.value[0].COOName,
        gmITEmail: _approvers.value[0].COOEmail,
      }
    }else{
      alert("Approver Info not found !");
      return false;
    }

  }

  ngAfterViewInit() { 
    //this.executeAfterViewInit();
  }


  // //================= working with screen size starts ==============
  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   if (event.target.innerWidth < 768) {
  //     //implement logic
  //   } else {
  //     //implement logic
  //   }
  // }

  // isBiggerScreen() {
  //   const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  //   if (width < 768) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  // //------------ working with screen size ends --------------------------

  getBtnClickAction(valFrmChild: any) {
    // if (this.uId == "") {

    //   this.parsedRequestInfo.AppParameters.Requestor = valFrmChild.AppParameters.Requestor;
    //   this.parsedRequestInfo.AppParameters.ProblemDescription = valFrmChild.AppParameters.ProblemDescription;
    //   this.parsedRequestInfo.AppParameters.PriorityInfo = valFrmChild.AppParameters.PriorityInfo;
    //   this.parsedRequestInfo.AppParameters.SystemDetail = valFrmChild.AppParameters.SystemDetail;
    //   this.parsedRequestInfo.AppParameters.Attachments = valFrmChild.AppParameters.Attachments;
    //   //this.parsedRequestInfo.AppParameters.Action = action;

    //   this.allApprovers = 
    //   {
    //     // headITInfraName: "Shoab Mahmood Al Naoshad",
    //     // headITInfraEmail: "shoaib@bergerbd.com",
    //     // headITInfraAdId: 21,
    //     // headERPName: "Md Razibur Rahman",
    //     // headERPEmail: "razib@bergerbd.com",
    //     // gmITName: "Mohammad Abu Nader Al Mokaddes",
    //     // gmITEmail: "nader@bergerbd.com",

    //     headITInfraName: "Kamal Infra",
    //     headITInfraEmail: "kamal@bergerbd.com",
    //     headITInfraAdId: 1026,
    //     headERPName: "Kamal ERP",
    //     headERPEmail: "kamal@bergerbd.com",
    //     gmITName: "Kamal GM",
    //     gmITEmail: "kamal@bergerbd.com",
    //   }

    // }
    // else {
    //   this.emitedDataFrmChild = valFrmChild;

    //   this.allApprovers = 
    //   {
    //     // headITInfraName: "Shoab Mahmood Al Naoshad",
    //     // headITInfraEmail: "shoaib@bergerbd.com",
    //     // headITInfraAdId: 21,
    //     // headERPName: "Md Razibur Rahman",
    //     // headERPEmail: "razib@bergerbd.com",
    //     // gmITName: "Mohammad Abu Nader Al Mokaddes",
    //     // gmITEmail: "nader@bergerbd.com",

    //     headITInfraName: "Kamal Infra",
    //     headITInfraEmail: "kamal@bergerbd.com",
    //     headITInfraAdId: 1026,
    //     headERPName: "Kamal ERP",
    //     headERPEmail: "kamal@bergerbd.com",
    //     gmITName: "Kamal GM",
    //     gmITEmail: "kamal@bergerbd.com",
    //   }
      
    // }

  }

  GetGridData(valFrmChild: any) {
    if (this.uId == "") {
      this.createReqInfoFrmChild = valFrmChild;
    }
    else {
      this.emitedDataFrmChild = valFrmChild;
    }

  }

  createNotification(templet:any) {
    if (this.uId != "") {
      this.reviewLink = this.webAbsoluteUrl + '/support?guid=' + this.uId + "&mode=read";
      this.approvalLink = this.webAbsoluteUrl + '/support?guid=' + this.uId;
    }

    let emailFldData;

    switch (templet.item.Templet) {
      case "Notification": {
        emailFldData = {
          Status: "Submitted",
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: "",
          ApprovalLink: "",
          Subject: "Request for 'Support Request' workflow with ref# " + templet.item.Title + " has been initiated",
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Mr./Mrs. ${templet.item.Notifiers.approversName},</b><br/></p>
              <p>Request for &quot;Support Request&quot; workflow has been initiated. Any review or update will be available in the requestor&#39;s My Process of Berger Tech Portal.</p>
              
              <p><b>Request ID/Ref:&#160; ${templet.item.Title},</b></p>
              
              <p>Status: ${templet.item.Status},</p>
              
              <p>Review Link : <a href="${templet.item.ReviewLink}">Review Link </a></p>
              
              <div style="font-family: verdana; color: #030e81; font-size: 12px;">
                <p><b>Thanks & Regards,</b><br/>Berger Tech Consulting Limited,<br/>Email: info@bergertechbd.com<br/>
                [This is a System Generated Email from Berger Tech Portal and no reply is required.]
                </p>                          
              </div>
                            
            </div>
          `,
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>Berger Tech Consulting Limited,<br/>Email: info@bergertechbd.com<br/>
            [This is a System Generated Email from Berger Tech Portal and no reply is required.]
            </p>                          
          </div>`,
        }
        break;
      }
      case "Assigned": {
        emailFldData = {
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: this.reviewLink,
          ApprovalLink: this.approvalLink,
          Status: "Assigned",
          Subject: "Request for 'Support request' workflow with ref# " + templet.item.Title + " is being assigned to you.",
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Tech Consulting Limited,<br/>Email: info@bergertechbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Concern,</b><br/></p>
              <p>  Request for &quot;Support Request&quot; workflow is being assigned to you. Please process to continue either from Pending Approval of Berger Tech Portal or from the process link below.<br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: ${templet.item.Status},<br/>
                
              </p>
              <p>Process Link : <a href="${templet.item.ProcessLink}">Process Link </a></p>              
            </div>

            <div style="font-family: verdana; color: #030e81; font-size: 12px;">
              <p><b>Thanks & Regards,</b><br/>Berger Tech Consulting Limited,<br/>Email: info@bergertechbd.com<br/>
              [This is a System Generated Email from Berger Tech Portal and no reply is required.]
              </p>                          
            </div>
          `,
        }
        break;
      }
      case "ReAssigned": {
        emailFldData = {
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: this.reviewLink,
          ApprovalLink: this.approvalLink,
          Status: "ReAssigned",
          Subject: "Request for 'Support request' workflow with ref# " + templet.item.Title + " is being re-assigned to you.",
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Tech Consulting Limited,<br/>Email: info@bergertechbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Concern,</b><br/>
                Request for &quot;Support Request&quot; workflow is being re-assigned to you. <br/>
                Requestors UAT observation can be found in Comments field of <b>Process Log</b> section. <br/>
                Please process to continue either from Pending Approval of Berger Tech Portal or from the process link below.<br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: ${templet.item.Status},<br/>
              </p>              
            </div>
          `,
        }
        break;
      }
      case "TaskPickedUp": {
        emailFldData = {
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: this.reviewLink,
          ApprovalLink: this.approvalLink,
          Status: "TaskPickedUp",
          Subject: "Request for 'Support request' workflow with ref# " + templet.item.Title + " is being TaskPickedUp.",
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Tech Consulting Limited,<br/>Email: info@bergertechbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Concern,</b><br/>
                Request for &quot;Support Request&quot; workflow is being picked up. Please process to continue either from Pending Approval of Berger Tech Portal or from the process link below.<br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: ${templet.item.Status},<br/>
              </p>              
            </div>
          `,
        }
        break;
      }
      case "Submitted": {
        emailFldData = {
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: this.reviewLink,
          ApprovalLink: this.approvalLink,
          Status: "Submitted",
          Subject: "Request for 'Support Request' workflow with ref# " + templet.item.Title + " is being submitted to you.",
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Tech Consulting Limited,<br/>Email: info@bergertechbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Mr./Mrs. ${templet.item.Notifiers.approversName},</b><br/></p>
              <p> Request for &quot;Support Request&quot; workflow is being submitted to you. Please process to continue either from Pending Approval of Berger Tech Portal or from the process link below.</p>
              <br/>
              <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: ${templet.item.Status},<br/>
                
              </p> 
              <p>Process Link : <a href="${templet.item.ProcessLink}">Process Link </a></p>                           
            </div>

            <div style="font-family: verdana; color: #030e81; font-size: 12px;">
              <p><b>Thanks & Regards,</b><br/>Berger Tech Consulting Limited,<br/>Email: info@bergertechbd.com<br/>
              [This is a System Generated Email from Berger Tech Portal and no reply is required.]
              </p>                          
            </div>
          `,
        }
        break;
      }
      case "AssignedNotification": {
        emailFldData = {
          Status: "Assigned",
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: this.reviewLink,
          ApprovalLink: this.approvalLink,
          Subject: "Request for 'Support Request' workflow with ref# " + templet.item.Title + " has been assigned",
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Mr./Mrs. ${templet.item.Notifiers.approversName},</b><br/>
                Request for &quot;Support Request&quot; workflow has been assigned. Any review or update will be available in the requestor&#39;s My Process of Berger Tech Portal.<br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: ${templet.item.Status},<br/>
              </p>              
            </div>
          `,
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>Research & Development Center,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
        }
        break;
      }
      case "TaskPickedUpNotification": {
        emailFldData = {
          Status: "TaskPickedUp",
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: this.reviewLink,
          ApprovalLink: this.approvalLink,
          Subject: "Request for 'Support Request' workflow with ref# " + templet.item.Title + " has been picked up",
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Mr./Mrs. ${templet.item.Notifiers.approversName},</b><br/>
                Request for &quot;Support Request&quot; workflow has been picked up. Any review or update will be available in the requestor&#39;s My Process of Berger Tech Portal.<br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: ${templet.item.Status},<br/>
                Pending with: Task respectives,
              </p>              
            </div>
          `,
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>Research & Development Center,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
        }
        break;
      }
      case "ReadyforUATNotification": { 
        emailFldData = {
          Status: "ReadyforUAT",
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: this.reviewLink,
          ApprovalLink: this.approvalLink,
          Subject: "Request for 'Support Request' workflow with ref# " + templet.item.Title + " has been ready for UAT",
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Mr./Mrs. ${templet.item.Notifiers.approversName},</b><br/>
                Request for &quot;Support Request&quot; workflow is ready for UAT. Any review or update will be available in the requestor&#39;s My Process of Berger Tech Portal.<br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: ${templet.item.Status},<br/>
                Pending with: Task Reporter,
              </p>              
            </div>
          `,
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>Research & Development Center,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
        }
        break;
      }
      case "UATRequestNotification": { 
        emailFldData = {
          Status: "UATRequest",
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: this.reviewLink,
          ApprovalLink: this.approvalLink,
          Subject: "Request for 'Support Request' workflow with ref# " + templet.item.Title + " has been ready for UAT",
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Mr./Mrs. ${templet.item.Notifiers.approversName},</b><br/>
                Request for &quot;Support Request&quot; workflow is ready for UAT. Any review or update will be available in the requestor&#39;s My Process of Berger Tech Portal.<br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: ${templet.item.Status},<br/>
                Pending with: ${templet.item.Notifiers.approversName},
              </p>              
            </div>
          `,
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>Research & Development Center,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
        }
        break;
      }
      case "Approval": { 
        emailFldData = {
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: this.reviewLink,
          ApprovalLink: this.approvalLink,
          Status: "Assigned",
          Subject: "Request for 'Support Request' workflow with ref# " + templet.item.Title + " is waiting for your approval",
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Concern,</b><br/></p>
              <p>  Request for &quot;Support Request&quot; workflow is waiting for your approval. Please process to continue either from Pending Approval of Berger Portal or from the process link below.<br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: ${templet.item.Status},<br/>
              </p> 
              <p>Process Link : <a href="${templet.item.ProcessLink}">Process Link </a></p>                                        
            </div>

            <div style="font-family: verdana; color: #030e81; font-size: 12px;">
              <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
              [This is a System Generated Email from Berger Portal and no reply is required.]
              </p>                          
            </div>
          `,
        }
        break;
      }
      case "ReadyforUAT": { 
        emailFldData = {
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: this.reviewLink,
          ApprovalLink: this.approvalLink,
          Status: "ReadyforUAT",
          Subject: "Request for 'Support Request' workflow with ref# " + templet.item.Title + " is ready for UAT",
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Concern,</b><br/></p>
              <p>  Request for &quot;Support Request&quot; workflow is ready for UAT. <br/>                
                Please process to continue either from Pending Approval of Berger Portal or from the process link below or let us know for any assistance.<br/>
                Looking forward for your kind UAT feedback. <br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: ${templet.item.Status},<br/>
              </p>              
            </div>

            <div style="font-family: verdana; color: #030e81; font-size: 12px;">
              <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
              [This is a System Generated Email from Berger Portal and no reply is required.]
              </p>                          
            </div>
          `,
        }
        break;
      }
      case "UATRequestApvr": { 
        emailFldData = {
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: this.reviewLink,
          ApprovalLink: this.approvalLink,
          Status: "UATRequest",
          Subject: "Request for 'Support Request' workflow with ref# " + templet.item.Title + " is ready for UAT",
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Mr./Mrs.${templet.item.Notifiers.approversName},</b><br/></p>
              <p>  Request for &quot;Support Request&quot; workflow is ready for UAT. <br/>                
                Please process to continue either from Pending Approval of Berger Tech Portal or from the process link below or let us know for any assistance.<br/>
                Looking forward for your kind UAT feedback. <br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: ${templet.item.Status},<br/>
              </p> 
              <p>Process Link : <a href="${templet.item.ProcessLink}">Process Link </a></p>                                                     
            </div>

            <div style="font-family: verdana; color: #030e81; font-size: 12px;">
              <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
              [This is a System Generated Email from Berger Portal and no reply is required.]
              </p>                          
            </div>
          `,
        }
        break;
      }
      case "PickedUp": {
        emailFldData = {
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: "",
          ApprovalLink: "",
          Status: "Submitted",
          Subject: "Acknowledgement of Request received for 'Support Request' workflow with ref# " + templet.item.Title + ".",
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Concern,</b><br/>
              Request has been picked for &quot;Support Request&quot; workflow and is being picked up by respective lab personnel for testing.<br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: "Request Picked",<br/>
              </p>              
            </div>
          `,
        }
        break;
      }
      case "Completed": {
        emailFldData = {
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          Subject: "Request for 'Support Request' workflow with ref# " + templet.item.Title + " has been processed",
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: this.reviewLink,
          ApprovalLink: this.approvalLink,
          Status: "Completed",
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Concern,</b><br/></p>
              <p>  Request for &quot;Support Request&quot; workflow has been processed. It can be viewed either from My Process of Berger Portal or from the review link below.<br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: "Report Released",
              </p>
              
            </div>

            <div style="font-family: verdana; color: #030e81; font-size: 12px;">
              <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
              [This is a System Generated Email from Berger Portal and no reply is required.]
              </p>                          
            </div>
          `,
        }
        break;
      }    
      case "FeedbackSubmitted": {
        emailFldData = {
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          Subject: "Request for 'Support Request' workflow with ref# " + templet.item.Title + " has been processed",
          To: templet.item.Notifiers.approversEmail,      
          ReviewLink: this.reviewLink,
          ApprovalLink: this.approvalLink,
          Status: "FeedbackSubmitted",
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Concern,</b><br/>
                Customer feedback of &quot;Support Request&quot; WF has been submitted. It can be viewed from admin dashboard Feedback link.<br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: "Feedback Submitted",<br/>
              </p>
              
            </div>
          `,
        }
        break;
      }
      case "UATFeedbackFrmCustomer": {
        emailFldData = {
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          Subject: "UAT for 'Support Request' workflow with ref# " + templet.item.Title + " is being completed.",
          To: templet.item.Notifiers.approversEmail,      
          ReviewLink: this.reviewLink,
          ApprovalLink: this.approvalLink,
          Status: "UATFeedbackFrmCustomer",
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Concern,</b><br/>
                Customer UAT feedback of &quot;Support Request&quot; WF has been submitted.<br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: "UAT Feedback Submitted",<br/>
              </p>
              
            </div>
          `,
        }
        break;
      }
      case "OpmNotification": {
        emailFldData = {
          Status: "Submitted",
          To: templet.item.Notifiers.approversEmail,
          ReviewLink: "",
          ApprovalLink: "",
          Subject: "Request for 'Support Request' workflow with ref# " + templet.item.Title + " has been initiated",
          __metadata: {
            "type": "SP.Data.NotificationListListItem"
          },
          Body: `
            <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
              <p><b>Dear Concern,</b><br/>
                Request for &quot;Support Request&quot; workflow has been initiated to your team.<br/>
                <b>Request ID/Ref:&#160; ${templet.item.Title},</b><br/>
                Status: ${templet.item.Status},<br/>
              </p>              
            </div>
          `,
          BodyBottomText:
            `<div style="font-family: verdana; color: #030e81; font-size: 12px;">
            <p><b>Thanks & Regards,</b><br/>IT Department,<br/>Berger Paints Bangladesh Limited,<br/>Email: info@bergerbd.com<br/>
            [This is a System Generated Email from Berger Portal and no reply is required.]
            </p>                          
          </div>`,
        }
        break;
      }
      default: {
        alert("Action is undefined for this type of click event !!");
        break;
      }
    }

    let notificationlListInfo = {
      name: "NotificationList",
      item: emailFldData
    };

    return new Promise((resolve:any, reject:any)=>{
      this.sharepointlistService.saveListItem(notificationlListInfo)
      .then(
        (res:any) => {
          if(res.ID != ""){
            resolve(res);
            return res;
          }else{
            reject();
          }
        })
    })

    
  }

  async saveInNotificationList(notificationInfo:any, title?: string, comments?: string) {
    return await new Promise((resolve:any, reject:any)=>{

      try{

        if (this.uId == "") {

          if(notificationInfo.item.Approvers.length >0 ){
            (notificationInfo.item.Approvers).forEach((apvr:any, index:number) => {
              let notInfo = {
                name: notificationInfo.name,
                item: {
                  Templet: "Submitted",
                  Notifiers: apvr,
                  Requestor: notificationInfo.item.Requestor, 
                  Title: notificationInfo.item.Title, 
                  Status: notificationInfo.item.Status,
                  ProcessLink: notificationInfo.item.ProcessLink,
                  ReviewLink: notificationInfo.item.ReviewLink 
                }
              };
  
              this.createNotification(notInfo).then((res:any)=>{
                if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                  resolve(res);
                  return res;
                }else{
                  reject('Failed');
                  return 'Failed';
                }
              });
  
            });
          }else{
            resolve();
          }

         if(notificationInfo.item.Notifiers.length >0 ){
          (notificationInfo.item.Notifiers).forEach((n:any) => {
            let notInfo = {
              name: notificationInfo.name,
              item: {
                Templet: "Notification",
                Notifiers: n,
                Requestor: notificationInfo.item.Requestor, 
                Title: notificationInfo.item.Title, 
                Status: notificationInfo.item.Status,
                ProcessLink: notificationInfo.item.ProcessLink,
                ReviewLink: notificationInfo.item.ReviewLink 
              }
            };
            
            this.createNotification(notInfo).then((res:any)=>{
              if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                resolve(res);
                return res;
              }else{
                reject('Failed');
                return 'Failed';
              }
            });
            
          });
         }else{
          resolve();
         }
    
         
    
    
          
        } else {
          
          switch (notificationInfo.item.Status) {
            case "Assigned": {
    
              (notificationInfo.item.Approvers).forEach((apvr:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "Assigned",
                    Notifiers: apvr,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
              (notificationInfo.item.Notifiers).forEach((n:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "AssignedNotification",
                    Notifiers: n,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
        
              setTimeout(function () {
                window.location.href = this.pendingtasksUrl ;
              }, 40000);
    
              break;
            }
            case "ReAssigned": {
    
              (notificationInfo.item.Approvers).forEach((apvr:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "Assigned",
                    Notifiers: apvr,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
              (notificationInfo.item.Notifiers).forEach((n:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "AssignedNotification",
                    Notifiers: n,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
        
              setTimeout(function () {
                window.location.href = this.pendingtasksUrl ;
              }, 40000);
    
              break;
            }
            case "TaskPickedUp": {
    
              (notificationInfo.item.Approvers).forEach((apvr:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "TaskPickedUp",
                    Notifiers: apvr,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
              (notificationInfo.item.Notifiers).forEach((n:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "TaskPickedUpNotification",
                    Notifiers: n,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
        
              setTimeout(function () {
                window.location.href = this.pendingtasksUrl ;
              }, 40000);
    
              break;
            }
            case "ReadyforUAT": {
    
              (notificationInfo.item.Approvers).forEach((apvr:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "ReadyforUAT",
                    Notifiers: apvr,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
              (notificationInfo.item.Notifiers).forEach((n:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "ReadyforUATNotification",
                    Notifiers: n,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
        
              setTimeout(function () {
                window.location.href = this.pendingtasksUrl ;
              }, 40000);
    
              break;
            }
            case "UATRequest": {
    
              (notificationInfo.item.Approvers).forEach((apvr:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "UATRequestApvr",
                    Notifiers: apvr,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
              (notificationInfo.item.Notifiers).forEach((n:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "UATRequestNotification",
                    Notifiers: n,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
        
              setTimeout(function () {
                window.location.href = this.pendingtasksUrl;
              }, 40000);
    
              break;
            }
            case "Reviewed": {
    
              (notificationInfo.item.Approvers).forEach((apvr:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "Approval",
                    Notifiers: apvr,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
              (notificationInfo.item.Notifiers).forEach((n:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "Reviewed",
                    Notifiers: n,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
        
              setTimeout(function () {
                window.location.href = this.pendingtasksUrl; 
              }, 40000);
    
              break;
            }
            case "UATFeedbackFrmCustomer": {
    
              (notificationInfo.item.Approvers).forEach((apvr:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "UATFeedbackFrmCustomer",
                    Notifiers: apvr,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
              (notificationInfo.item.Notifiers).forEach((n:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "UATFeedbackFrmCustomer",
                    Notifiers: n,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
        
              setTimeout(function () {
                window.location.href = this.pendingtasksUrl ;
              }, 40000);
    
              break;
            }
            case "ReleaseAssignee": {

              if(notificationInfo.item.Notifiers.length > 0){

                (notificationInfo.item.Notifiers).forEach((n:any) => {
                  let notInfo = {
                    name: notificationInfo.name,
                    item: {
                      Templet: "Completed",
                      Notifiers: n,
                      Requestor: notificationInfo.item.Requestor, 
                      Title: notificationInfo.item.Title, 
                      Status: notificationInfo.item.Status,
                      ProcessLink: notificationInfo.item.ProcessLink,
                      ReviewLink: notificationInfo.item.ReviewLink 
                    }
                  };
  
                  this.createNotification(notInfo).then((res:any)=>{
                    if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                      resolve(res);
                      return res;
                    }else{
                      reject('Failed');
                      return 'Failed';
                    }
                  });
                });
          
              }
    
              break;
            }
            case "Completed": {

              if(notificationInfo.item.Notifiers.length > 0){

                (notificationInfo.item.Notifiers).forEach((n:any) => {
                  let notInfo = {
                    name: notificationInfo.name,
                    item: {
                      Templet: "Completed",
                      Notifiers: n,
                      Requestor: notificationInfo.item.Requestor, 
                      Title: notificationInfo.item.Title, 
                      Status: notificationInfo.item.Status,
                      ProcessLink: notificationInfo.item.ProcessLink,
                      ReviewLink: notificationInfo.item.ReviewLink 
                    }
                  };
  
                  this.createNotification(notInfo).then((res:any)=>{
                    if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                      resolve(res);
                      return res;
                    }else{
                      reject('Failed');
                      return 'Failed';
                    }
                  });
                });
          
              }
    
              break;
            }
            case "QueryFrmAssignee": {
    
              (notificationInfo.item.Approvers).forEach((apvr:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "ReadyforUAT",
                    Notifiers: apvr,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
              (notificationInfo.item.Notifiers).forEach((n:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "ReadyforUATNotification",
                    Notifiers: n,
                    Requestor: notificationInfo.item.Requestor, 
                    Title: notificationInfo.item.Title, 
                    Status: notificationInfo.item.Status,
                    ProcessLink: notificationInfo.item.ProcessLink,
                    ReviewLink: notificationInfo.item.ReviewLink 
                  }
                };

                this.createNotification(notInfo).then((res:any)=>{
                  if(Object.prototype.hasOwnProperty(res, 'ID')){
                    resolve(res);
                    return res;
                  }else{
                    reject('Failed');
                    return 'Failed';
                  }
                });
              });
        
        
              setTimeout(function () {
                window.location.href = this.pendingtasksUrl;
              }, 40000);
    
              break;
            }
          }
        }
           
      } 
      catch(err){

        reject('Failed');
        console.log("Error: " + err);

      }
    })
    
  }


  async createAuditLog(title: string, comments?: string) {
    let comment = (comments == undefined) ? "" : comments;
    let auditLogData = {
      Title: title,
      ActionDate: new Date().toLocaleString(),
      ActionBy: this.createReqInfoFrmChild.Requestor.EmployeeName,
      Comments: comment
    }
    let auditLogListInfo = {
      name: "supportprocesslog",
      item: auditLogData
    }
    await this.sharepointlistService.saveListItem(auditLogListInfo).then(
      (res:any) => {})
  }

  async createReqTitle(data:any) {
    
    await this.sharepointlistService.updateListItem(data.updatedMstrLstInfo).then((res:any) => { 
      })
      .then((res:any) => {

        this.createProcessLog(data.processLogListInfo);

      })
      .then((res:any) => {

          this.saveInPendingApvrList(data.pendingApprovalListInfo)

      })
      .then((res:any) => {

        //===========save Attachments start ================
        for(let a=0; a < data.attachmentListInfo.item.length; a++){
          let file = data.attachmentListInfo.item[a];
          let attachmentItem = {
            Title: file.Title,
            ActionBy: file.ActionBy,
            ActionDate: new Date()
          };

          let attachmentListInfo = {
            name: data.attachmentListInfo.name,
            item: attachmentItem
          };

          this.createAttachment(attachmentListInfo, file.File);
        }
        //---------------attachment ends ------------
          
      })
      .then((res:any) => {
        this.saveInNotificationList(data.notificationListInfo);
        
      })
      .then((res:any) => {

        this.toastSucAlert('success', false, 'Request Submitted Successfully! For any update please follow View Incidents of Support Portal.');

        //Swal.fire("Thank You...", "Request Submitted Successfully !", "success");

        setTimeout(function () {
          window.location.href = "https://support.bergertechbd.com/myrequests"; 
        }, 40000);
      });
  }

  //========= update application having uId===
  async updateRequest(data:any) {

    if(this.emitedDataFrmChild.Status != "ReleaseAssignee" ){
      await this.sharepointlistService.updateListItem(data.updatedMstrLstInfo)
        .then(
          (res:any) => {
            if(res == 'Successful'){
              console.log('Update in MstrLstInfo is Successful');
            }else{
              console.log('Update in MstrLstInfo is Failed');
            }
            
          })
    }

    await this.createProcessLog(data.processLogListInfo)
    .then(
      (res:any) => {
        if(res.ID != ''){
          console.log('Update in PendingApproval List is Successful');
        }else{
          console.log('Update in PendingApproval is Failed');
        }
        
      })
      
        await this.updateInPendingApvrList(data.pendingApprovalListInfo)
        .then(
          (res:any) => {
            if(res == 'Successful'){
              console.log('Update in PendingApproval List is Successful');
            }else{
              console.log('Update in PendingApproval is Failed');
            }
            
          })
     

          
          await this.saveInNotificationList(data.notificationListInfo)
            .then(
              (res:any) => {
                if(res.ID != ''){
                  console.log('Update in EmailNotification List is Successful');
                }else{
                  console.log('Update in EmailNotification List is Failed');
                }
                
              })
         
         
      
    

        if(this.emitedDataFrmChild.Status != "Submitted" 
        && this.emitedDataFrmChild.Status != "Assigned" 
        && this.emitedDataFrmChild.Status != "TaskPickedUp" 
        && this.emitedDataFrmChild.Status != "ReleaseAssignee" 
        && this.emitedDataFrmChild.Status != "UATRequest" 
        && this.emitedDataFrmChild.Status != "UATFeedbackFrmCustomer" 
        && this.emitedDataFrmChild.Status != "Reject" 
        && this.emitedDataFrmChild.Status != "Completed"){
          if(Object.prototype.hasOwnProperty.call(data, 'updatedDetailLstInfo')){
            await this.updateInDetailList(data.updatedDetailLstInfo)
            .then(
              (res:any) => {
                if(res == 'Successful'){
                  console.log('Update in SystemDetail List is Successful');
                }else{
                  console.log('Update in SystemDetail List is Failed');
                }
                
              })
          }

          if(Object.prototype.hasOwnProperty.call(data, 'newDetailLstInfo')){
            await this.saveInDetailList(data.newDetailLstInfo)
              .then(
                (res:any) => {
                  if(res.ID != ''){
                    console.log('Save in SystemDetail List is Successful');
                  }else{
                    console.log('Save in SystemDetail List is Failed');
                  }
                  
                })
          }
           
        };

        if(this.emitedDataFrmChild.Status == "Submitted"){
          if(Object.prototype.hasOwnProperty.call(data, 'newAssignedTaskListInfo')){
            await this.saveInAssignTaskList(data.newAssignedTaskListInfo)
            .then(
              (res:any) => {
                if(res.ID != ''){
                  console.log('Save in AssignedTasks List is Successful');
                }else{
                  console.log('Save in AssignedTasks List is Failed');
                }
                
              }) 
          };

          if(Object.prototype.hasOwnProperty.call(data, 'newAssigneesListInfo')){
            await this.saveInAssigneesList(data.newAssigneesListInfo)
            .then(
              (res:any) => {
                if(res.ID != ''){
                  console.log('Save in AssignedTasks List is Successful');
                }else{
                  console.log('Save in AssignedTasks List is Failed');
                }
                
              }) 
          }
           
        };

        if(this.emitedDataFrmChild.Status == "Assigned" || this.emitedDataFrmChild.Status == "TaskPickedUp" || this.emitedDataFrmChild.Status == "ReleaseAssignee" || this.emitedDataFrmChild.Status == "UATFeedbackFrmCustomer"){          

          if(Object.prototype.hasOwnProperty.call(data, 'updatedAssigneesListInfo')){
            await this.updateInAssigneesList(data.updatedAssigneesListInfo)
            .then(
              (res:any) => {
                if(res == 'Successful'){
                  console.log('Save in Assignees List is Successful');
                }else{
                  console.log('Save in Assignees List is Failed');
                }
                
              }) 
          }
           
        };

        if(this.emitedDataFrmChild.AppParameters.Action == "Query"){
          if(Object.prototype.hasOwnProperty.call(data, 'queryResponseListInfo')){
            await this.createProcessLog(data.queryResponseListInfo)
            .then(
              (res:any) => {
                if(res.ID != ''){
                  console.log('Update in QueryOrResponse List is Successful');
                }else{
                  console.log('Update in QueryOrResponse List is Failed');
                }
                
              })
          }
        }
      

        if(this.emitedDataFrmChild.Status != "Completed" && this.emitedDataFrmChild.Status != "PickedUp" && this.emitedDataFrmChild.Status != "Assigned" && this.emitedDataFrmChild.Status != "TaskPickedUp" && this.emitedDataFrmChild.Status != "UATRequest" && this.emitedDataFrmChild.Status != "UATFeedbackFrmCustomer" ){
          if(Object.prototype.hasOwnProperty.call(data, 'attachmentListInfo')){
            await this.saveInAttachmentList(data.attachmentListInfo)
              .then(
                (res:any) => {
                  console.log('Save in Attachment List is Successful');            
                }) 

                .then((res:any)=>{
                  setTimeout(function () {
                    window.location.href = "https://support.bergertechbd.com/pendingtasks";
                  }, 40000);
                })
          }
           
        }; 
     

  }

  async GetOutputVal(valFrmChild: any) {
    
    let btnClkAction = ""; 

    if (this.uId == "") {

      this.createReqInfoFrmChild.AppParameters.Requestor = valFrmChild.AppParameters.Requestor;
      this.createReqInfoFrmChild.AppParameters.ProblemDescription = valFrmChild.AppParameters.ProblemDescription;
      this.createReqInfoFrmChild.AppParameters.PriorityInfo = valFrmChild.AppParameters.PriorityInfo;
      this.createReqInfoFrmChild.AppParameters.SystemDetail = valFrmChild.AppParameters.SystemDetail;
      this.createReqInfoFrmChild.AppParameters.Attachments = valFrmChild.AppParameters.Attachments;
      this.createReqInfoFrmChild.AppParameters.Action = valFrmChild.AppParameters.Action;
      this.createReqInfoFrmChild.AppParameters.Comments = valFrmChild.AppParameters.Comments;
      this.createReqInfoFrmChild.AppParameters.OnBehalfOf = valFrmChild.AppParameters.OnBehalfOf;
      if(valFrmChild.AppParameters.OnBehalfOf){
        this.createReqInfoFrmChild.AppParameters.Employee = valFrmChild.AppParameters.Employee;
      }
      // this.allApprovers = 
      // { 
      //   headITInfraName: "Kamal Infra",
      //   headITInfraEmail: "kamal@bergerbd.com",
      //   headITInfraAdId: 1026,
      //   headERPName: "Kamal ERP",
      //   headERPEmail: "kamal@bergerbd.com",
      //   gmITName: "Kamal GM",
      //   gmITEmail: "kamal@bergerbd.com",
      // };

      btnClkAction = this.createReqInfoFrmChild.AppParameters.Action;

    }
    else {
      this.emitedDataFrmChild = valFrmChild;

      // this.allApprovers = 
      // {
      //   headITInfraName: "Kamal Infra",
      //   headITInfraEmail: "kamal@bergerbd.com",
      //   headITInfraAdId: 1026,
      //   headERPName: "Kamal ERP",
      //   headERPEmail: "kamal@bergerbd.com",
      //   gmITName: "Kamal GM",
      //   gmITEmail: "kamal@bergerbd.com",
      // };

      btnClkAction = this.emitedDataFrmChild.AppParameters.Action;
      
    };

    let _approvers = await this._getAllApprovers();

    if(_approvers.value.length >0){
      this.allApprovers = 
      {
        headITInfraName: _approvers.value[0].BusDevLeadName,
        headITInfraEmail: _approvers.value[0].BusDevLeadEmail,
        headERPName: _approvers.value[0].SAPProgLeadName,
        headERPEmail: _approvers.value[0].SAPProgLeadEmail,
        gmITName: _approvers.value[0].COOName,
        gmITEmail: _approvers.value[0].COOEmail,
      }
    }else{
      alert("Approver Info not found !");
      return false;
    }

    

    // this.allApprovers = 
    // {
    //   headITInfraName: "Kamal Infra",
    //   headITInfraEmail: "kamal@bergerbd.com",
    //   headITInfraAdId: 1026,
    //   headERPName: "Kamal ERP",
    //   headERPEmail: "kamal@bergerbd.com",
    //   gmITName: "Kamal GM",
    //   gmITEmail: "kamal@bergerbd.com",
    // };

    let _status = '';
    let _detailStatus = '';
    let _pendingWith:any = [];
    let _updatedMstrListData;
    let _newDetailLstData = [];
    let _updatedDetailLstData = [];
    let _attachmentListData = [];
    let _processLogData: IProcessLog;
    let _queriesData: ISupportQuery;
    let _itemData;
    let approvers:any = [];
    let notifiers:any = [];
    let _pendingApprovalItemData: any;
    let _updatedAllLstsInfo:any;
    let _newAssignTskItms:any = [];
    let _newAssignees:any = [];
    let _updatedAssignee:any = {};

    switch (btnClkAction) {
      case "Submitted": {
        //==== validate whether requestor info is exist or not===
        if(this.createReqInfoFrmChild.AppParameters.Requestor.CustName == null
          || this.createReqInfoFrmChild.AppParameters.Requestor.Cust1stEmail == null){
            alert("Requestor info is not found. Please try again later.");
            return false;
          }
        //---- validate whether requestor info is exist or not ends ----       

        //this.createReqInfoFrmChild.Requestor.AdId = this.logedUserAdId;
        this.createReqInfoFrmChild.AppParameters.RequestDate = new Date().toString().substring(4, 15);

        //let approvalLink = "";

        

        
        let _status = "Submitted";
              
        // //====get approval history===
        // let actionComments = "";
        // let actionlog = {
        //   CustId: this.createReqInfoFrmChild.AppParameters.Requestor.CustId,
        //   ActionDate: new Date(),
        //   Status: _status,
        //   ProcessByName: this.createReqInfoFrmChild.AppParameters.Requestor.CustName,
        //   ProcessByEmail: this.createReqInfoFrmChild.AppParameters.Requestor.Cust1stEmail,
        //   Comments: actionComments,
        // }
        // this.createReqInfoFrmChild.AppParameters.ProcessLogs.push(actionlog);
        // //-------------------

        let _custApprovers = await this._getCustomerApprovers( this.createReqInfoFrmChild.AppParameters.Requestor.CustId, this.createReqInfoFrmChild.AppParameters.SystemDetail.SystemType);

        if(_custApprovers.value.length >0){
          
          if(this.createReqInfoFrmChild.AppParameters.SystemDetail.SystemType == "SAP"){
            approvers.push({
              approversName: _custApprovers.value[0].BergerTechIncharge,
              approversEmail: _custApprovers.value[0].BergerTechInchargeEmail
            });
  
            notifiers.push({
              approversName: this.allApprovers.headITInfraName,
              approversEmail: this.allApprovers.headITInfraEmail
            });
            notifiers.push({
              approversName: this.allApprovers.gmITName,
              approversEmail: this.allApprovers.gmITEmail
            })
  
          }else{ 
            approvers.push({
              approversName: _custApprovers.value[0].BergerTechIncharge,
              approversEmail: _custApprovers.value[0].BergerTechInchargeEmail
            });
  
            notifiers.push({
              approversName: this.allApprovers.headERPName,
              approversEmail: this.allApprovers.headERPEmail
            });
            notifiers.push({
              approversName: this.allApprovers.gmITName,
              approversEmail: this.allApprovers.gmITEmail
            });
  
            if(this.createReqInfoFrmChild.AppParameters.PriorityInfo.Priority == "Highest"){
              notifiers.push({
                approversName: this.createReqInfoFrmChild.AppParameters.PriorityInfo.EmergContact,
                approversEmail: this.createReqInfoFrmChild.AppParameters.PriorityInfo.EmergContactEmail,
              });
            }
          }

        }else{

          if(this.createReqInfoFrmChild.AppParameters.SystemDetail.SystemType == "SAP"){
            approvers.push({
              approversName: this.allApprovers.headERPName,
              approversEmail: this.allApprovers.headERPEmail
            });
  
            notifiers.push({
              approversName: this.allApprovers.headITInfraName,
              approversEmail: this.allApprovers.headITInfraEmail
            });
            notifiers.push({
              approversName: this.allApprovers.gmITName,
              approversEmail: this.allApprovers.gmITEmail
            })
  
          }else{ 
            approvers.push({
              approversName: this.allApprovers.headITInfraName,
              approversEmail: this.allApprovers.headITInfraEmail
            });
  
            notifiers.push({
              approversName: this.allApprovers.headERPName,
              approversEmail: this.allApprovers.headERPEmail
            });
            notifiers.push({
              approversName: this.allApprovers.gmITName,
              approversEmail: this.allApprovers.gmITEmail
            });
  
            if(this.createReqInfoFrmChild.AppParameters.PriorityInfo.Priority == "Highest"){
              notifiers.push({
                approversName: this.createReqInfoFrmChild.AppParameters.PriorityInfo.EmergContact,
                approversEmail: this.createReqInfoFrmChild.AppParameters.PriorityInfo.EmergContactEmail,
              });
            }
          }

          // alert("Approver Info not found !");
          // return false;
        }


        if(this.createReqInfoFrmChild.AppParameters.SystemDetail.SystemType == "SAP"){
          approvers.push({
            approversName: this.allApprovers.headERPName,
            approversEmail: this.allApprovers.headERPEmail
          });

          notifiers.push({
            approversName: this.allApprovers.headITInfraName,
            approversEmail: this.allApprovers.headITInfraEmail
          });
          notifiers.push({
            approversName: this.allApprovers.gmITName,
            approversEmail: this.allApprovers.gmITEmail
          })

        }else{ 
          approvers.push({
            approversName: this.allApprovers.headITInfraName,
            approversEmail: this.allApprovers.headITInfraEmail
          });

          notifiers.push({
            approversName: this.allApprovers.headERPName,
            approversEmail: this.allApprovers.headERPEmail
          });
          notifiers.push({
            approversName: this.allApprovers.gmITName,
            approversEmail: this.allApprovers.gmITEmail
          });

          if(this.createReqInfoFrmChild.AppParameters.PriorityInfo.Priority == "Highest"){
            notifiers.push({
              approversName: this.createReqInfoFrmChild.AppParameters.PriorityInfo.EmergContact,
              approversEmail: this.createReqInfoFrmChild.AppParameters.PriorityInfo.EmergContactEmail,
            });
          }
        }

        

        let itemData = {
          CustId: this.createReqInfoFrmChild.AppParameters.Requestor.CustId,
          CustName: this.createReqInfoFrmChild.AppParameters.Requestor.CustName,
          CustCompanyName: this.createReqInfoFrmChild.AppParameters.Requestor.CustCompanyName,
          CustCompany1stAddress: this.createReqInfoFrmChild.AppParameters.Requestor.CustCompany1stAddress,
          CustDesignation: this.createReqInfoFrmChild.AppParameters.Requestor.CustDesignation,
          Cust1stEmail: this.createReqInfoFrmChild.AppParameters.Requestor.Cust1stEmail,
          Cust1stMobile: this.createReqInfoFrmChild.AppParameters.Requestor.Cust1stMobile,
          
          PendingTo: JSON.stringify(approvers),
          Status: _status,

          RequestFor: this.createReqInfoFrmChild.AppParameters.ProblemDescription.RequestFor,
          RequestCategory: this.createReqInfoFrmChild.AppParameters.ProblemDescription.RequestCategory,
          Subject: this.createReqInfoFrmChild.AppParameters.ProblemDescription.Subject,
          Description: this.createReqInfoFrmChild.AppParameters.ProblemDescription.Description,         
          Priority: this.createReqInfoFrmChild.AppParameters.PriorityInfo.Priority,
          EmergContact: this.createReqInfoFrmChild.AppParameters.PriorityInfo.EmergContact,
          BusinessImpact: this.createReqInfoFrmChild.AppParameters.PriorityInfo.BusinessImpact,
          EmergContactNumber: this.createReqInfoFrmChild.AppParameters.PriorityInfo.EmergContactNumber,
          EmergContactEmail: this.createReqInfoFrmChild.AppParameters.PriorityInfo.EmergContactEmail,

          SystemType: this.createReqInfoFrmChild.AppParameters.SystemDetail.SystemType,
          SystemModule: this.createReqInfoFrmChild.AppParameters.SystemDetail.SystemModule,
          SAPCustomerNumber: this.createReqInfoFrmChild.AppParameters.SystemDetail.SAPCustomerNumber,
          SUser: this.createReqInfoFrmChild.AppParameters.SystemDetail.SUser,
          Manufacturer: this.createReqInfoFrmChild.AppParameters.SystemDetail.Manufacturer,
          Model: this.createReqInfoFrmChild.AppParameters.SystemDetail.Model,              
          OperatingSystem: this.createReqInfoFrmChild.AppParameters.SystemDetail.OperatingSystem,
          OSRelease: this.createReqInfoFrmChild.AppParameters.SystemDetail.OSRelease,
          DatabaseName: this.createReqInfoFrmChild.AppParameters.SystemDetail.DatabaseName,
          DatabaseRelease: this.createReqInfoFrmChild.AppParameters.SystemDetail.DatabaseRelease,
          PersonIncharge: this.createReqInfoFrmChild.AppParameters.SystemDetail.PersonIncharge,
          SIContactNo: this.createReqInfoFrmChild.AppParameters.SystemDetail.SIContactNo,
          SIEmail: this.createReqInfoFrmChild.AppParameters.SystemDetail.SIEmail,

          OnBehalfOf: this.createReqInfoFrmChild.AppParameters.OnBehalfOf

        };

        if(itemData.OnBehalfOf){
          itemData.EmpId = this.createReqInfoFrmChild.AppParameters.Employee.EmpId;
          itemData.EmpName = this.createReqInfoFrmChild.AppParameters.Employee.EmpName;
          itemData.EmpCompanyName = this.createReqInfoFrmChild.AppParameters.Employee.EmpCompanyName;
          itemData.EmpCompany1stAddress = this.createReqInfoFrmChild.AppParameters.Employee.EmpCompany1stAddress;
          itemData.EmpDesignation = this.createReqInfoFrmChild.AppParameters.Employee.EmpDesignation;
          itemData.Emp1stEmail = this.createReqInfoFrmChild.AppParameters.Employee.Emp1stEmail;
          itemData.Emp1stMobile = this.createReqInfoFrmChild.AppParameters.Employee.Emp1stMobile;
        }

        let createMstrLstInfo ={
          name: "supportmaster",
          item: itemData
        }

        //====== 1.  save Masterlist ======
        await this.sharepointlistService.saveListItem(createMstrLstInfo)
          .then(
            (res) => {
              this.reviewLink = this.webAbsoluteUrl + '/support?guid=' + res.GUID + "&mode=read";
              this.approvalLink = this.webAbsoluteUrl + '/support?guid=' + res.GUID ;
              
              

              _updatedMstrListData = { 
                Title: "SR-" + res.ID,
                ProcessLink: this.approvalLink
              };              

              this.updatedMstrLstInfo = {
                name: "supportmaster",
                rId: res.ID,
                item: _updatedMstrListData
              };                           
              
              //=== Audit log/Process Log data =====
              _processLogData = {
                Title: _updatedMstrListData.Title,
                ActionDate: new Date(),
                Status: _status,
                ProcessByName: this.createReqInfoFrmChild.AppParameters.Requestor.CustName,
                ProcessByEmail: this.createReqInfoFrmChild.AppParameters.Requestor.Cust1stEmail,
                Comments: this.createReqInfoFrmChild.AppParameters.Comments
              };

              this.processLogListInfo = {
                name: "supportprocesslog",
                item: _processLogData
              };
              //-------------------

              
              _pendingApprovalItemData = {    
                Title: _updatedMstrListData.Title,
                ProcessName: "SupportRequest",
                RequestedByName: this.createReqInfoFrmChild.AppParameters.Requestor.CustName,
                Status: "Submitted",
                RequestedByEmail: this.createReqInfoFrmChild.AppParameters.Requestor.Cust1stEmail,
                PendingTo: JSON.stringify(approvers),
                RequestLink: this.approvalLink
              };

              this.pendingApprovalListInfo = {
                name: "PendingApproval",
                item: _pendingApprovalItemData
              };

              (this.createReqInfoFrmChild.AppParameters.Attachments).forEach((file:any) => {
                _attachmentListData.push({
                  Title: _updatedMstrListData.Title,
                  ActionBy: this.createReqInfoFrmChild.AppParameters.Requestor.CustName,
                  ActionDate: new Date(),
                  File: file
                })
              });  

              this.attachmentListInfo = {
                name: "supportattachment",
                item: _attachmentListData
              };          

              this.notificationListInfo = {  
                name: "NotificationList",
                item: {
                  Approvers: approvers,
                  Notifiers: notifiers,
                  Requestor: this.createReqInfoFrmChild.AppParameters.Requestor.CustName, 
                  Title: _updatedMstrListData.Title, 
                  Status: _status,
                  ProcessLink: this.approvalLink,
                  ReviewLink: this.reviewLink 
                }
              };

              _updatedAllLstsInfo = {
                updatedMstrLstInfo: this.updatedMstrLstInfo,
                pendingApprovalListInfo: this.pendingApprovalListInfo,
                processLogListInfo: this.processLogListInfo,
                attachmentListInfo: this.attachmentListInfo,
                notificationListInfo: this.notificationListInfo
              };

              
            }
          ).then((res:any) => {
            this.createReqTitle(_updatedAllLstsInfo);
          });

          break;
      }
      case "Assigned": {

        if( localStorage.getItem('logedEmpName') == "" || localStorage.getItem('logedEmpEmail') == "" ){
          this.router.navigate(['/login']);
        }

        this.reviewLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId + "&mode=read";
        this.approvalLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId ;

        let asTsks = this.emitedDataFrmChild.AppParameters.AssignedTasks;

        asTsks.forEach(at => {
          let assignees = at.Assignees;

          assignees.forEach(as => {
            approvers.push({
              approversName: as.AssignedToName,
              approversEmail: as.AssignedToEmail
            });
          });
        });

        notifiers.push({
          approversName: this.emitedDataFrmChild.Requestor.CustName,
          approversEmail: this.emitedDataFrmChild.Requestor.Cust1stEmail
        });
        

        _status = "Assigned";

        _updatedMstrListData = {
          PendingTo: JSON.stringify(approvers),
          Status: _status          
        };

        this.updatedMstrLstInfo = {
          name: "supportmaster",
          rId: this.emitedDataFrmChild.ID,
          item: _updatedMstrListData
        }

        _pendingApprovalItemData = { 
          Status: _status,
          PendingTo: JSON.stringify(approvers)
        };

        this.pendingApprovalListInfo = {
          priKey: this.emitedDataFrmChild.Title,
          name: "PendingApproval",
          item: _pendingApprovalItemData
        };       

        //---------- comments -----
        _processLogData = {
          Title: this.emitedDataFrmChild.Title,
          ActionDate: new Date(),
          Status: _status,
          ProcessByName: localStorage.getItem('logedEmpName'),
          ProcessByEmail: localStorage.getItem('logedEmpEmail'),
          Comments: this.emitedDataFrmChild.AppParameters.Comments
        };        

        this.processLogListInfo = {
          name: "supportprocesslog",
          item: _processLogData
        }; 
        
        



        //this.notificationListInfo = { 
        // let notInfo = {  
        //   name: "NotificationList",
        //   item: {
        //     Approvers: approvers,
        //     Notifiers: approvers,
        //     Requestor: this.emitedDataFrmChild.AppParameters.Requestor.CustName, 
        //     Title: this.emitedDataFrmChild.AppParameters.Requestor.CustId, 
        //     Status: _status,
        //     ProcessLink: this.approvalLink,
        //     ReviewLink: this.reviewLink 
        //   }
        // }

      

       
        
        
        this.emitedDataFrmChild.AppParameters.AssignedTasks.forEach((ati:any, i:index) => {
          _newAssignTskItms.push({
            ProcessName: "Support Request",
            Title: this.emitedDataFrmChild.Title,
            TaskId: this.emitedDataFrmChild.Title + "T"+(1+i),
            TaskTitle: ati.TaskTitle, 
            ExpectedStartDate: ati.ExpectedStartDate, 
            ExpectedEndDate: ati.ExpectedEndDate,
            ReporterName:  localStorage.getItem('logedEmpName'),
            ReporterEmail:  localStorage.getItem('logedEmpEmail')
          });

          ati.Assignees.forEach(eass => {
            _newAssignees.push({
              Title: this.emitedDataFrmChild.Title,
              TaskId: this.emitedDataFrmChild.Title + "T"+(1+i),
              AssignedToName: eass.AssignedToName,
              AssignedToEmail: eass.AssignedToEmail,
              AssignedToDesignation: eass.AssignedToDesignation,
              ExpectedTimeTaken: eass.ExpectedTimeTaken,
              ActualTimeTaken: eass.ActualTimeTaken,
              AssignedTaskStatus: "Assigned"
            })
          });

        });


        
        _updatedAllLstsInfo = {
          updatedMstrLstInfo: this.updatedMstrLstInfo,
          pendingApprovalListInfo: this.pendingApprovalListInfo,
          processLogListInfo: this.processLogListInfo,
          //attachmentListInfo: this.attachmentListInfo,
          notificationListInfo: {
              name: "NotificationList",
              item: {
                Approvers: approvers,
                Notifiers: approvers,
                Requestor: this.emitedDataFrmChild.Requestor.CustName, 
                Title: this.emitedDataFrmChild.Title, 
                Status: _status,
                ProcessLink: this.approvalLink,
                ReviewLink: this.reviewLink 
              }
          },
          newAssignedTaskListInfo: {
            name: "SupportAssignedTasks",
            item: _newAssignTskItms
          },
          newAssigneesListInfo: {
            name: "SupportTaskAssignee",
            item: _newAssignees
          }



          
        }

        if(this.emitedDataFrmChild.AppParameters.Attachments.length > 0){
          (this.emitedDataFrmChild.AppParameters.Attachments).forEach((file:any) => {
            _attachmentListData.push({
              Title: "SR-" + res.ID,
              ActionBy: this.emitedDataFrmChild.Requestor.CustName,
              ActionDate: new Date(),
              File: file
            })
          });  
  
          this.attachmentListInfo = {
            name: "supportattachment",
            item: _attachmentListData
          };

          _updatedAllLstsInfo.attachmentListInfo= this.attachmentListInfo;
        }

        //=========calling function to update data ======
        this.updateRequest(_updatedAllLstsInfo);

        break;
      }

      case "PickedUp": {

        if( localStorage.getItem('logedEmpName') == "" || localStorage.getItem('logedEmpEmail') == "" ){
          this.router.navigate(['/login']);
        }

        this.reviewLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId + "&mode=read";
        this.approvalLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId ;

        let asTsks = this.emitedDataFrmChild.AppParameters.AssignedTasks;

        asTsks.forEach(at => {

          if(at.TaskId == this.emitedDataFrmChild.AppParameters.ChildInfo.TaskId){
            let assignees = at.Assignees;

            assignees.forEach(as => {

              if(as.AssignedToEmail != this.emitedDataFrmChild.AppParameters.ChildInfo.AssignedToEmail){
                notifiers.push({
                  approversName: as.AssignedToName,
                  approversEmail: as.AssignedToEmail
                });
              }

            });

          }
          
        });


        approvers.push({
          approversName: this.emitedDataFrmChild.AppParameters.ChildInfo.AssignedToName, 
          approversEmail: this.emitedDataFrmChild.AppParameters.ChildInfo.AssignedToEmail 
        });

                

        _status = "TaskPickedUp";

        _updatedMstrListData = {
          PendingTo: JSON.stringify(approvers),
          Status: _status          
        };

        this.updatedMstrLstInfo = {
          name: "supportmaster",
          rId: this.emitedDataFrmChild.ID,
          item: _updatedMstrListData
        }

        _pendingApprovalItemData = { 
          Status: _status,
          PendingTo: JSON.stringify(approvers)
        };

        this.pendingApprovalListInfo = {
          priKey: this.emitedDataFrmChild.Title,
          name: "PendingApproval",
          item: _pendingApprovalItemData
        };       

        //-----------comments -----
        _processLogData = {
          Title: this.emitedDataFrmChild.Title,
          ActionDate: new Date(),
          Status: _status,
          ProcessByName: localStorage.getItem('logedEmpName'),
          ProcessByEmail: localStorage.getItem('logedEmpEmail'),
          Comments: this.emitedDataFrmChild.AppParameters.Comments
        };        

        this.processLogListInfo = {
          name: "supportprocesslog",
          item: _processLogData
        };        

        _updatedAssignee = {
          ExpectedTimeTaken: this.emitedDataFrmChild.AppParameters.ChildInfo.ExpectedTimeTaken,
          AssignedTaskStatus: "TaskPickedUp"
        };     
        
        _updatedAllLstsInfo = {
          updatedMstrLstInfo: this.updatedMstrLstInfo,
          pendingApprovalListInfo: this.pendingApprovalListInfo,
          processLogListInfo: this.processLogListInfo,
          notificationListInfo: {
              name: "NotificationList",
              item: {
                Approvers: approvers,
                Notifiers: approvers,
                Requestor: this.emitedDataFrmChild.Requestor.CustName, 
                Title: this.emitedDataFrmChild.Title, 
                Status: _status,
                ProcessLink: this.approvalLink,
                ReviewLink: this.reviewLink 
              }
          },
          updatedAssigneesListInfo: {
            name: "SupportTaskAssignee",
            rId: this.emitedDataFrmChild.AppParameters.ChildInfo.rowId,
            item: _updatedAssignee
          }



          
        }

        //=========calling function to update data ======
        this.updateRequest(_updatedAllLstsInfo);

        break;
      }

      case "ReadyforUAT": {

        if( localStorage.getItem('logedEmpName') == "" || localStorage.getItem('logedEmpEmail') == "" ){
          this.router.navigate(['/login']);
        }

        this.reviewLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId + "&mode=read";
        this.approvalLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId ;

        let asTsks = this.emitedDataFrmChild.AppParameters.AssignedTasks;

        asTsks.forEach(at => {

          if(at.TaskId == this.emitedDataFrmChild.AppParameters.ChildInfo.TaskId){
            
            approvers.push({
              approversName: at.ReporterName, 
              approversEmail: at.ReporterEmail 
            });

            notifiers.push({
              approversName: at.ReporterName, //should be fix up
              approversEmail: at.ReporterEmail //should be fix up
            });

          }
          
        });                

        _status = "ReadyforUAT";

        _updatedMstrListData = {
          PendingTo: JSON.stringify(approvers),
          Status: _status          
        };

        this.updatedMstrLstInfo = {
          name: "supportmaster",
          rId: this.emitedDataFrmChild.ID,
          item: _updatedMstrListData
        }

        _pendingApprovalItemData = { 
          Status: _status,
          PendingTo: JSON.stringify(approvers)
        };

        this.pendingApprovalListInfo = {
          priKey: this.emitedDataFrmChild.Title,
          name: "PendingApproval",
          item: _pendingApprovalItemData
        };       

        //----------- comments -----
        _processLogData = {
          Title: this.emitedDataFrmChild.Title,
          ActionDate: new Date(),
          Status: _status,
          ProcessByName: localStorage.getItem('logedEmpName'),
          ProcessByEmail: localStorage.getItem('logedEmpEmail'),
          Comments: this.emitedDataFrmChild.AppParameters.Comments
        };        

        this.processLogListInfo = {
          name: "supportprocesslog",
          item: _processLogData
        };        

        _updatedAssignee = {
          ExpectedTimeTaken: this.emitedDataFrmChild.AppParameters.ChildInfo.ExpectedTimeTaken,
          ActualTimeTaken: this.emitedDataFrmChild.AppParameters.ChildInfo.ActualTimeTaken,
          AssignedTaskStatus: "ReadyforUAT",
        };     
        
        _updatedAllLstsInfo = {
          updatedMstrLstInfo: this.updatedMstrLstInfo,
          pendingApprovalListInfo: this.pendingApprovalListInfo,
          processLogListInfo: this.processLogListInfo,
          notificationListInfo: {
              name: "NotificationList",
              item: {
                Approvers: approvers,
                Notifiers: approvers,
                Requestor: this.emitedDataFrmChild.Requestor.CustName, 
                Title: this.emitedDataFrmChild.Title, 
                Status: _status,
                ProcessLink: this.approvalLink,
                ReviewLink: this.reviewLink 
              }
          },
          updatedAssigneesListInfo: {
            name: "SupportTaskAssignee",
            rId: this.emitedDataFrmChild.AppParameters.ChildInfo.rowId,
            item: _updatedAssignee
          }



          
        }

        //=========calling function to update data ======
        this.updateRequest(_updatedAllLstsInfo);

        break;
      }

      case "UATRequest": {

        
        if( localStorage.getItem('logedEmpName') == "" || localStorage.getItem('logedEmpEmail') == "" ){
          this.router.navigate(['/login']);
        }

        this.reviewLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId! + "&mode=read";
        this.approvalLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId! ;

        let asTsks = this.emitedDataFrmChild.AppParameters.AssignedTasks;

        approvers.push({
          approversName: this.emitedDataFrmChild.AppParameters.SystemDetail.PersonIncharge, 
          approversEmail: this.emitedDataFrmChild.AppParameters.SystemDetail.SIEmail 
        });

        notifiers.push({
          approversName: this.emitedDataFrmChild.Requestor.CustName, 
          approversEmail: this.emitedDataFrmChild.Requestor.Cust1stEmail 
        });  
        
        notifiers.push({
          approversName: this.allApprovers.gmITName,
          approversEmail: this.allApprovers.gmITEmail
        });

        _status = "UATRequest";

        _updatedMstrListData = {
          PendingTo: JSON.stringify(approvers),
          Status: _status          
        };

        this.updatedMstrLstInfo = {
          name: "supportmaster",
          rId: this.emitedDataFrmChild.ID,
          item: _updatedMstrListData
        }

        _pendingApprovalItemData = { 
          Status: _status,
          PendingTo: JSON.stringify(approvers)
        };

        this.pendingApprovalListInfo = {
          priKey: this.emitedDataFrmChild.Title,
          name: "PendingApproval",
          item: _pendingApprovalItemData
        };       

        //----------- comments -----
        _processLogData = {
          Title: this.emitedDataFrmChild.Title,
          ActionDate: new Date(),
          Status: _status,
          ProcessByName: localStorage.getItem('logedEmpName'),
          ProcessByEmail: localStorage.getItem('logedEmpEmail'),
          Comments: this.emitedDataFrmChild.AppParameters.Comments
        };        

        this.processLogListInfo = {
          name: "supportprocesslog",
          item: _processLogData
        };        

        _updatedAssignee = {
          ExpectedTimeTaken: this.emitedDataFrmChild.AppParameters.ChildInfo.ExpectedTimeTaken,
          ActualTimeTaken: this.emitedDataFrmChild.AppParameters.ChildInfo.ActualTimeTaken,
          AssignedTaskStatus: "ReadyforUAT",
        };     
        
        _updatedAllLstsInfo = {
          updatedMstrLstInfo: this.updatedMstrLstInfo,
          pendingApprovalListInfo: this.pendingApprovalListInfo,
          processLogListInfo: this.processLogListInfo,
          notificationListInfo: {
              name: "NotificationList",
              item: {
                Approvers: approvers,
                Notifiers: approvers,
                Requestor: this.emitedDataFrmChild.Requestor.CustName, 
                Title: this.emitedDataFrmChild.Title, 
                Status: _status,
                ProcessLink: this.approvalLink,
                ReviewLink: this.reviewLink 
              }
          },
          updatedAssigneesListInfo: {
            name: "SupportTaskAssignee",
            rId: this.emitedDataFrmChild.AppParameters.ChildInfo.rowId,
            item: _updatedAssignee
          }



          
        }

        //=========calling function to update data ======
        this.updateRequest(_updatedAllLstsInfo);

        break;
      }

      case "Query": {

        
        if( localStorage.getItem('logedEmpName') == null || localStorage.getItem('logedEmpEmail') == null ){
          this.router.navigate(['/login']);
        }

        this.reviewLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId! + "&mode=read";
        this.approvalLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId! ;

        let asTsks = this.emitedDataFrmChild.AppParameters.AssignedTasks;

        approvers.push({
          approversName: this.emitedDataFrmChild.AppParameters.SystemDetail.PersonIncharge, 
          approversEmail: this.emitedDataFrmChild.AppParameters.SystemDetail.SIEmail 
        });

        notifiers.push({
          approversName: this.emitedDataFrmChild.Requestor.CustName, 
          approversEmail: this.emitedDataFrmChild.Requestor.Cust1stEmail 
        });  
        
        notifiers.push({
          approversName: this.allApprovers.gmITName,
          approversEmail: this.allApprovers.gmITEmail
        });

        _status = "Query";

        _updatedMstrListData = {
          PendingTo: JSON.stringify(approvers),
          Status: _status,
          LastStatus: this.emitedDataFrmChild.Status,
          LastApproverName: localStorage.getItem('logedEmpName'),
          LastApproverEmail: localStorage.getItem('logedEmpEmail'),
                    
        };

        this.updatedMstrLstInfo = {
          name: "supportmaster",
          rId: this.emitedDataFrmChild.ID,
          item: _updatedMstrListData
        }

        _pendingApprovalItemData = { 
          Status: _status,
          PendingTo: JSON.stringify(approvers)
        };

        this.pendingApprovalListInfo = {
          priKey: this.emitedDataFrmChild.Title,
          name: "PendingApproval",
          item: _pendingApprovalItemData
        };       

        //----------- comments -----
        _processLogData = {
          Title: this.emitedDataFrmChild.Title,
          ActionDate: new Date(),
          Status: _status,
          ProcessByName: localStorage.getItem('logedEmpName'),
          ProcessByEmail: localStorage.getItem('logedEmpEmail'),
          Comments: this.emitedDataFrmChild.AppParameters.Comments
        };       

        this.processLogListInfo = {
          name: "supportprocesslog",
          item: _processLogData
        };  
        
        //========for Query start =====
        _queriesData = {
          Title: this.emitedDataFrmChild.Title,
          ActionDate: new Date(),
          Status: _status,
          ProcessByName: localStorage.getItem('logedEmpName'),
          ProcessByEmail: localStorage.getItem('logedEmpEmail'),
          QueryOrResponse: this.emitedDataFrmChild.AppParameters.Comments
        };        

        this.queryResponseListInfo = {
          name: "SupportRequestQueries",
          item: _queriesData
        }; 
        //-------- for query ends -----

        _updatedAssignee = {
          ExpectedTimeTaken: this.emitedDataFrmChild.AppParameters.ChildInfo.ExpectedTimeTaken,
          ActualTimeTaken: this.emitedDataFrmChild.AppParameters.ChildInfo.ActualTimeTaken,
          AssignedTaskStatus: "ReadyforUAT",
        };     
        
        _updatedAllLstsInfo = {
          updatedMstrLstInfo: this.updatedMstrLstInfo,
          pendingApprovalListInfo: this.pendingApprovalListInfo,
          processLogListInfo: this.processLogListInfo,
          queryResponseListInfo: this.queryResponseListInfo,
          notificationListInfo: {
              name: "NotificationList",
              item: {
                Approvers: approvers,
                Notifiers: approvers,
                Requestor: this.emitedDataFrmChild.Requestor.CustName, 
                Title: this.emitedDataFrmChild.Title, 
                Status: _status,
                ProcessLink: this.approvalLink,
                ReviewLink: this.reviewLink 
              }
          },
          updatedAssigneesListInfo: {
            name: "SupportTaskAssignee",
            rId: this.emitedDataFrmChild.AppParameters.ChildInfo.rowId,
            item: _updatedAssignee
          }



          
        }

        //=========calling function to update data ======
        this.updateRequest(_updatedAllLstsInfo);

        break;
      }

      case "UATFeedbackFrmCustomer": {

        this.reviewLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId + "&mode=read";
        this.approvalLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId ;

        let asTsks = this.emitedDataFrmChild.AppParameters.AssignedTasks;

        let apvr = [];

        asTsks.forEach(at => {
            
          apvr.push({
            approversName: at.ReporterName, 
            approversEmail: at.ReporterEmail 
          });         
          
        });

        let uapvr = this._removeDuplicateObjects(apvr);
        approvers = uapvr;

        notifiers.push({
          approversName: this.allApprovers.gmITName,
          approversEmail: this.allApprovers.gmITEmail
        });                

        _status = "UATFeedbackFrmCustomer";

        _updatedMstrListData = {
          PendingTo: JSON.stringify(approvers),
          Status: _status          
        };

        this.updatedMstrLstInfo = {
          name: "supportmaster",
          rId: this.emitedDataFrmChild.ID,
          item: _updatedMstrListData
        }

        _pendingApprovalItemData = { 
          Status: _status,
          PendingTo: JSON.stringify(approvers)
        };

        this.pendingApprovalListInfo = {
          priKey: this.emitedDataFrmChild.Title,
          name: "PendingApproval",
          item: _pendingApprovalItemData
        };       

        //-----------comments -----
        _processLogData = {
          Title: this.emitedDataFrmChild.Title,
          ActionDate: new Date(),
          Status: _status,
          ProcessByName: this.emitedDataFrmChild.Requestor.CustName,//should be replaced by logged user Name
          ProcessByEmail: this.emitedDataFrmChild.Requestor.Cust1stEmail,//should be replaced by logged user email
          Comments: this.emitedDataFrmChild.AppParameters.Comments
        };        

        this.processLogListInfo = {
          name: "supportprocesslog",
          item: _processLogData
        };        

        _updatedAssignee = {
          ExpectedTimeTaken: this.emitedDataFrmChild.AppParameters.ChildInfo.ExpectedTimeTaken,
          ActualTimeTaken: this.emitedDataFrmChild.AppParameters.ChildInfo.ActualTimeTaken,
          AssignedTaskStatus: "ReadyforUAT",
        };     
        
        _updatedAllLstsInfo = {
          updatedMstrLstInfo: this.updatedMstrLstInfo,
          pendingApprovalListInfo: this.pendingApprovalListInfo,
          processLogListInfo: this.processLogListInfo,
          notificationListInfo: {
              name: "NotificationList",
              item: {
                Approvers: approvers,
                Notifiers: approvers,
                Requestor: this.emitedDataFrmChild.Requestor.CustName, 
                Title: this.emitedDataFrmChild.Title, 
                Status: _status,
                ProcessLink: this.approvalLink,
                ReviewLink: this.reviewLink 
              }
          },
          updatedAssigneesListInfo: {
            name: "SupportTaskAssignee",
            rId: this.emitedDataFrmChild.AppParameters.ChildInfo.rowId,
            item: _updatedAssignee
          }



          
        }

        //=========calling function to update data ======
        this.updateRequest(_updatedAllLstsInfo);

        break;
      }

      case "ReleaseAssignee": {

        if( localStorage.getItem('logedEmpName') == "" || localStorage.getItem('logedEmpEmail') == "" ){
          this.router.navigate(['/login']);
        }

        this.reviewLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId + "&mode=read";
        this.approvalLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId ;

        let asTsks = this.emitedDataFrmChild.AppParameters.AssignedTasks;

        approvers.push({
          approversName: this.emitedDataFrmChild.AppParameters.ChildInfo.AssignedToName, 
          approversEmail: this.emitedDataFrmChild.AppParameters.ChildInfo.AssignedToEmail, 
        });

        notifiers.push({
          approversName: this.emitedDataFrmChild.AppParameters.ChildInfo.AssignedToName,
          approversEmail: this.emitedDataFrmChild.AppParameters.ChildInfo.AssignedToEmail,
        });                

        _status = "ReadyforUAT";
        _detailStatus = "ReleaseAssignee";

        _updatedMstrListData = {
          PendingTo: JSON.stringify(approvers),
          Status: _status          
        };

        this.updatedMstrLstInfo = {
          name: "supportmaster",
          rId: this.emitedDataFrmChild.ID,
          item: _updatedMstrListData
        }

        _pendingApprovalItemData = { 
          Status: _status,
          PendingTo: JSON.stringify(approvers)
        };

        this.pendingApprovalListInfo = {
          priKey: this.emitedDataFrmChild.Title,
          name: "PendingApproval",
          item: _pendingApprovalItemData
        };       

        //-----------comments -----
        _processLogData = {
          Title: this.emitedDataFrmChild.Title,
          ActionDate: new Date(),
          Status: _detailStatus,
          ProcessByName: localStorage.getItem('logedEmpName'),
          ProcessByEmail: localStorage.getItem('logedEmpEmail'),
          Comments: _detailStatus
        };        

        this.processLogListInfo = {
          name: "supportprocesslog",
          item: _processLogData
        };        

        _updatedAssignee = {
          ExpectedTimeTaken: this.emitedDataFrmChild.AppParameters.ChildInfo.ExpectedTimeTaken,
          AcceptedTimeTaken: this.emitedDataFrmChild.AppParameters.ChildInfo.ExpectedTimeTaken,
          AssignedTaskStatus: _detailStatus,
        };     
        
        _updatedAllLstsInfo = {
          updatedMstrLstInfo: this.updatedMstrLstInfo,
          pendingApprovalListInfo: this.pendingApprovalListInfo,
          processLogListInfo: this.processLogListInfo,
          notificationListInfo: {
              name: "NotificationList",
              item: {
                Approvers: approvers,
                Notifiers: approvers,
                Requestor: this.emitedDataFrmChild.Requestor.CustName, 
                Title: this.emitedDataFrmChild.Title, 
                Status: _detailStatus,
                ProcessLink: this.approvalLink,
                ReviewLink: this.reviewLink 
              }
          },
          updatedAssigneesListInfo: {
            name: "SupportTaskAssignee",
            rId: this.emitedDataFrmChild.AppParameters.ChildInfo.rowId,
            item: _updatedAssignee
          }



          
        }

        //=========calling function to update data ======
        this.updateRequest(_updatedAllLstsInfo);

        break;
      }

      case "QueryFrmAssignee": {

        if( localStorage.getItem('logedEmpName') == "" || localStorage.getItem('logedEmpEmail') == "" ){
          this.router.navigate(['/login']);
        }

        this.reviewLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId + "&mode=read";
        this.approvalLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId ;

        let asTsks = this.emitedDataFrmChild.AppParameters.AssignedTasks;          
            
        approvers.push({
          approversName: this.emitedDataFrmChild.AppParameters.SystemDetail.PersonIncharge, 
          approversEmail: this.emitedDataFrmChild.AppParameters.SystemDetail.SIEmail 
        });

        notifiers.push({
          approversName: this.emitedDataFrmChild.Requestor.CustName, 
          approversEmail: this.emitedDataFrmChild.Requestor.Cust1stEmail,
        });                  

        _status = "QueryFrmAssignee";

        _updatedMstrListData = {
          PendingTo: JSON.stringify(approvers),
          Status: _status          
        };

        this.updatedMstrLstInfo = {
          name: "supportmaster",
          rId: this.emitedDataFrmChild.ID,
          item: _updatedMstrListData
        }

        _pendingApprovalItemData = { 
          Status: _status,
          PendingTo: JSON.stringify(approvers)
        };

        this.pendingApprovalListInfo = {
          priKey: this.emitedDataFrmChild.Title,
          name: "PendingApproval",
          item: _pendingApprovalItemData
        };       

        //-----------comments -----
        _processLogData = {
          Title: this.emitedDataFrmChild.Title,
          ActionDate: new Date(),
          Status: _status,
          ProcessByName: localStorage.getItem('logedEmpName'),
          ProcessByEmail: localStorage.getItem('logedEmpEmail'),
          Comments: this.emitedDataFrmChild.AppParameters.Comments
        };        

        this.processLogListInfo = {
          name: "supportprocesslog",
          item: _processLogData
        };        

        _updatedAssignee = {
          AssigneeQuery: this.emitedDataFrmChild.AppParameters.ChildInfo.AssigneeQuery,
          AssignedTaskStatus: "QueryFrmAssignee",
        };     
        
        _updatedAllLstsInfo = {
          updatedMstrLstInfo: this.updatedMstrLstInfo,
          pendingApprovalListInfo: this.pendingApprovalListInfo,
          processLogListInfo: this.processLogListInfo,
          notificationListInfo: {
              name: "NotificationList",
              item: {
                Approvers: approvers,
                Notifiers: approvers,
                Requestor: this.emitedDataFrmChild.Requestor.CustName, 
                Title: this.emitedDataFrmChild.Title, 
                Status: _status,
                ProcessLink: this.approvalLink,
                ReviewLink: this.reviewLink 
              }
          },
          updatedAssigneesListInfo: {
            name: "SupportTaskAssignee",
            rId: this.emitedDataFrmChild.AppParameters.ChildInfo.rowId,
            item: _updatedAssignee
          }



          
        }

        //=========calling function to update data ======
        this.updateRequest(_updatedAllLstsInfo);

        break;
      }

      case "ReAssign": {

        if( localStorage.getItem('logedEmpName') == null || localStorage.getItem('logedEmpEmail') == null ){
          this.router.navigate(['/login']);
        }

        this.reviewLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId + "&mode=read";
        this.approvalLink = this.webAbsoluteUrl + '/support?guid=' + this.emitedDataFrmChild.uId ;

        let asTsks = this.emitedDataFrmChild.AppParameters.AssignedTasks;

        asTsks.forEach(at => {

          if(at.TaskId == this.emitedDataFrmChild.AppParameters.ChildInfo.TaskId){
            
            approvers.push({
              approversName: this.emitedDataFrmChild.AppParameters.ChildInfo.AssignedToName, 
              approversEmail: this.emitedDataFrmChild.AppParameters.ChildInfo.AssignedToEmail, 
            });

            notifiers.push({
              approversName: this.emitedDataFrmChild.Requestor.CustName,
              approversEmail: this.emitedDataFrmChild.Requestor.Cust1stEmail
            });

            notifiers.push({
              approversName: this.allApproversgmITName, 
              approversEmail: this.allApproversgmITEmail 
            });

          }
          
        });                

        _status = "ReAssigned";

        _updatedMstrListData = {
          PendingTo: JSON.stringify(approvers),
          Status: _status          
        };

        this.updatedMstrLstInfo = {
          name: "supportmaster",
          rId: this.emitedDataFrmChild.ID,
          item: _updatedMstrListData
        }

        _pendingApprovalItemData = { 
          Status: _status,
          PendingTo: JSON.stringify(approvers)
        };

        this.pendingApprovalListInfo = {
          priKey: this.emitedDataFrmChild.Title,
          name: "PendingApproval",
          item: _pendingApprovalItemData
        };       

        //----------- comments -----
        _processLogData = {
          Title: this.emitedDataFrmChild.Title,
          ActionDate: new Date(),
          Status: _status,
          ProcessByName: localStorage.getItem('logedEmpName'),
          ProcessByEmail: localStorage.getItem('logedEmpEmail'),
          Comments: this.emitedDataFrmChild.AppParameters.Comments
        };        

        this.processLogListInfo = {
          name: "supportprocesslog",
          item: _processLogData
        };        

        _updatedAssignee = {
          //ExpectedTimeTaken: this.emitedDataFrmChild.AppParameters.ChildInfo.ExpectedTimeTaken,
          //ActualTimeTaken: this.emitedDataFrmChild.AppParameters.ChildInfo.ActualTimeTaken,
          AssignedTaskStatus: "ReAssigned",
        };     
        
        _updatedAllLstsInfo = {
          updatedMstrLstInfo: this.updatedMstrLstInfo,
          pendingApprovalListInfo: this.pendingApprovalListInfo,
          processLogListInfo: this.processLogListInfo,
          notificationListInfo: {
              name: "NotificationList",
              item: {
                Approvers: approvers,
                Notifiers: approvers,
                Requestor: this.emitedDataFrmChild.Requestor.CustName, 
                Title: this.emitedDataFrmChild.Title, 
                Status: _status,
                ProcessLink: this.approvalLink,
                ReviewLink: this.reviewLink 
              }
          },
          updatedAssigneesListInfo: {
            name: "SupportTaskAssignee",
            rId: this.emitedDataFrmChild.AppParameters.ChildInfo.rowId,
            item: _updatedAssignee
          }



          
        }

        //=========calling function to update data ======
        this.updateRequest(_updatedAllLstsInfo);

        break;
      }

      case "Completed": {

        this.reviewLink = this.webAbsoluteUrl + this.emitedDataFrmChild.uId + "&mode=read";
        this.approvalLink = this.webAbsoluteUrl + this.emitedDataFrmChild.uId ;

        notifiers.push({
          approversName: this.allApprovers.headITInfraName,
          approversEmail: this.allApprovers.headITInfraEmail
        });

        notifiers.push({
          approversName: this.allApprovers.headERPName,
          approversEmail: this.allApprovers.headERPEmail
        });

        notifiers.push({
          approversName: this.allApprovers.gmITName,
          approversEmail: this.allApprovers.gmITEmail
        });

        notifiers.push({
          approversName: this.emitedDataFrmChild.AppParameters.SystemDetail.PersonIncharge, 
          approversEmail: this.emitedDataFrmChild.AppParameters.SystemDetail.SIEmail
        });

        notifiers.push({
          approversName: this.emitedDataFrmChild.Requestor.CustName, 
          approversEmail: this.emitedDataFrmChild.Requestor.Cust1stEmail
        });
        

        _status = "Completed";

        _updatedMstrListData = {
          PendingTo: JSON.stringify(approvers),
          Status: _status          
        };

        this.updatedMstrLstInfo = {
          name: "supportmaster",
          rId: this.emitedDataFrmChild.ID,
          item: _updatedMstrListData
        }

        _pendingApprovalItemData = { 
          Status: _status,
          PendingTo: JSON.stringify(approvers)
        };

        this.pendingApprovalListInfo = {
          priKey: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
          name: "PendingApproval",
          item: _pendingApprovalItemData
        };       

        // ## === processLogData === ##
        if(localStorage.getItem('logedCustEmail') != null){
          _processLogData = {
            Title: this.emitedDataFrmChild.Title,
            ActionDate: new Date(),
            Status: _status,
            ProcessByName: localStorage.getItem('logedCustName'),
            ProcessByEmail: localStorage.getItem('logedCustEmail'),
            Comments: this.emitedDataFrmChild.AppParameters.Comments
          }; 
        }else{
          _processLogData = {
            Title: this.emitedDataFrmChild.Title,
            ActionDate: new Date(),
            Status: _status,
            ProcessByName: localStorage.getItem('logedEmpName'),
            ProcessByEmail: localStorage.getItem('logedEmpEmail'),
            Comments: this.emitedDataFrmChild.AppParameters.Comments
          }; 
        }
               

        this.processLogListInfo = {
          name: "supportprocesslog",
          item: _processLogData
        }; 

        // this.notificationListInfo = {
        //   name: "NotificationList",
        //   item: {
        //     Approvers: approvers,
        //     Notifiers: notifiers,
        //     Requestor: this.emitedDataFrmChild.AppParameters.Requestor.CustName, 
        //     Title: this.emitedDataFrmChild.AppParameters.Requestor.CustId, 
        //     Status: _status,
        //     ProcessLink: this.approvalLink,
        //     ReviewLink: this.reviewLink 
        //   }
        // }

        if(this.emitedDataFrmChild.AppParameters.Attachments.length >0 ){
          (this.emitedDataFrmChild.AppParameters.Attachments).forEach((file:any) => {
            _attachmentListData.push({
              CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
              ActionBy: this.emitedDataFrmChild.AppParameters.Requestor.CustName,
              ActionDate: new Date(),
              File: file
            })
          }); 
        }
         

        this.attachmentListInfo = {
          name: "supportattachment",
          item: _attachmentListData
        }; 
        
        _updatedAllLstsInfo = {
          updatedMstrLstInfo: this.updatedMstrLstInfo,          
          pendingApprovalListInfo: this.pendingApprovalListInfo,
          processLogListInfo: this.processLogListInfo,
          attachmentListInfo: this.attachmentListInfo,
          notificationListInfo: {
            name: "NotificationList",
            item: {
              Approvers: approvers,
              Notifiers: notifiers,
              Requestor: this.emitedDataFrmChild.AppParameters.Requestor.CustName, 
              Title: this.emitedDataFrmChild.AppParameters.Requestor.CustId, 
              Status: _status,
              ProcessLink: this.approvalLink,
              ReviewLink: this.reviewLink 
            }
          }
          
        }

        //=========calling function to update data ======
        this.updateRequest(_updatedAllLstsInfo);

        break;
      }

      default: {
        alert("Action is undefined for this type of click event !!!");
        break;
      }
      
    }
  }

  updateInPendingApvrList(itemData:any) {  
    
    return new Promise((resolve:any, reject:any)=>{

      try{

        let penListInfo = {
          name: itemData.name,
          select: 'ID' + "," + 'Title',
          filterBy: 'Title',
          filterWith: itemData.priKey,
          top: 1
        }

        from(
          this.sharepointlistService.getFilteredItemsWithoutExpand(penListInfo)
        ).subscribe(
          (res:any) => {
            let listInfo = {
              name: "PendingApproval",
              rId: res[0].ID,
              item: itemData.item
            }

            this.sharepointlistService.updateListItem(listInfo).then((res:any)=>{
              resolve(res);
            });
          }
        ) 
      } 
      catch(err){
        reject('Failed');
        console.log("Error: " + err);
      }
    })

    
  }

  //=============for customer feedback =========
  onRatingChanged(rating:any){
    this.emitedDataFrmChild = rating;
    //console.log(rating);
    //this.feedback = rating;
    //this.rating = rating;
  }

  //=============get employee info===============
  async getEmpInfo(empADId:any){
    //===== for portaldv and or portal =====
    this.listInfo.name = "BergerEmployeeInformation";
    this.listInfo.select = 'Company'+","+'EmployeeId'+","+'EmployeeName'+","+'OfficeLocation'+","+'Designation'+","+'Department'+","+'CostCenter'+","+'Email/ID'+","+'Email/EMail'+","+'OptManagerEmail/ID'+","+'OptManagerEmail/Title'+","+'OptManagerEmail'+","+'Mobile';
    this.listInfo.expand = 'Email'+","+'OptManagerEmail';
    this.listInfo.filterBy = 'Email/ID';
    this.listInfo.top = 100000;

    let requestorsInfoData ={};
    
    await from(
        this.sharepointlistService.getItemsWithFilterExpand(this.listInfo, empADId)
        ).subscribe(
          (res) =>{ 
                
                requestorsInfoData ={
                  EmployeeName: res[0].EmployeeName,
                  Company: res[0].Company,
                  EmployeeId: res[0].EmployeeId,
                  OfficeLocation: res[0].OfficeLocation,
                  Designation: res[0].Designation,
                  Department: res[0].Department,
                  Email: res[0].Email.EMail,
                  CostCenter: res[0].CostCenter,
                  Mobile: res[0].Mobile,
                  OpmEmail: res[0].OptManagerEmail,
                  OpmADId: res[0].OptManagerEmail.ID,
                  OpmName: res[0].OptManagerEmail.Title,
                  RequestDate: new Date().toString().substring(4, 15)
                };
            
          },    
          (err) => {
              console.log(err)
          },
        );
        
        return requestorsInfoData;
   
  }

  excelDataLoadedInChild(valFrmChild: any) {
    if (this.uId == "") {
      this.dataFrmExcelUpload = valFrmChild;
    }
    else {
      this.dataFrmExcelUpload = valFrmChild;
    }

  }

  async createProcessLog(logListInfo: any) {

    return await new Promise((resolve:any, reject:any)=>{

      try{

        this.sharepointlistService.saveListItem(logListInfo).then(
          (res:any) => {
            if(res.ID != null){
              resolve(res);
            }
          })
           
      } 
      catch(err){

        reject('Failed');
        console.log("Error: " + err);

      }
    })    

  }

  async saveInPendingApvrList(pendingListInfo: any) {

    await this.sharepointlistService.saveListItem(pendingListInfo).then(
      (res:any) => {})

      return new Promise((resolve, reject)=>{
        try{
          this.sharepointlistService.saveListItem(pendingListInfo).then((res) =>{ 
                
                resolve(res.ID);               
                                
              },    
              (err) => {
                  reject('PendingApvrList Add failed !');
                  console.log(err)
              },
            ); 
        } 
        catch(err){
          reject('Retrieve data failed !');
          console.log("Error: " + err);
        }
      })

  }

  async createAttachment(attachmentInfo, file) {

    return new Promise((resolve, reject)=>{
      try{
          this.sharepointlistService.saveListItem(attachmentInfo).then((res) =>{ 
              let fileList ={
                name: "supportattachment",
                id: res.ID,
                arrayBuffer: file.arrayBuffer,
                attachmentName: file.name
              }

              this.sharepointlistService.addAttachment(fileList).then(res =>{
                resolve(res.ID);
              }) 
                              
            },    
            (err) => {
                reject('Attachment Add failed !');
                console.log(err)
            },
          ); 
      } 
      catch(err){
        reject('Retrieve data failed !');
        console.log("Error: " + err);
      }
    })
  };

  async saveDetailItem(detListInfo: any) {    

    return await new Promise((resolve:any, reject:any)=>{

      try{

        this.sharepointlistService.saveListItem(detListInfo).then(
          (res:any) => {
            if(res.ID != ""){
              resolve(res);
              return res;
            }
          })
      } 
      catch(err){

        reject('Failed');
        return 'Failed';
        console.log("Error: " + err);

      }
    })

  };

  async saveAssignTaskItem(detListInfo: any) {    

    return await new Promise((resolve:any, reject:any)=>{

      try{

        this.sharepointlistService.saveListItem(detListInfo).then(
          (res:any) => {
            if(res.ID != ""){
              resolve(res);
              return res;
            }
          })
      } 
      catch(err){

        reject('Failed');
        return 'Failed';
        console.log("Error: " + err);

      }
    })

  };

  async saveAssigneesItem(detListInfo: any) {    

    return await new Promise((resolve:any, reject:any)=>{

      try{

        this.sharepointlistService.saveListItem(detListInfo).then(
          (res:any) => {
            if(res.ID != ""){
              resolve(res);
              return res;
            }
          })
      } 
      catch(err){

        reject('Failed');
        return 'Failed';
        console.log("Error: " + err);

      }
    })

  };

  async updateInDetailList(itemsData:any) {  
    
    return await new Promise((resolve:any, reject:any)=>{

      try{

        if(itemsData.item.length > 0){
          for(let ud=0; ud < itemsData.item.length; ud++){

            let listInfo = {
              name: itemsData.name,
              rId: itemsData.item[ud].rowId,
              item: itemsData.item[ud].rowItems
            };
  
            this.sharepointlistService.updateListItem(listInfo).then((res:any) => {
              if(res == 'Successful'){
                resolve('Successful');
                console.log('Update in SystemDetail List is Successful');
              }else{
                reject('Failed');
                console.log('Update in SystemDetail is Failed');
              }
            });
            
          }
        }else{
          resolve('Successful');
          console.log('No Item found to update in SystemDetail List');
        } 
      } 
      catch(err){
        reject('Failed');
        console.log("Error: " + err);
      }
    })

    
  };

  async updateInAssigneesList(itemsData:any) {  
    
    return await new Promise((resolve:any, reject:any)=>{

      try{

        if(itemsData != undefined ){
          //for(let ud=0; ud < itemsData.item.length; ud++){

            let listInfo = {
              name: itemsData.name,
              rId: itemsData.rId,
              item: itemsData.item
            };
  
            this.sharepointlistService.updateListItem(listInfo).then((res:any) => {
              if(res == 'Successful'){
                resolve('Successful');
                console.log('Update in Assignees List is Successful');
              }else{
                reject('Failed');
                console.log('Update in Assignees is Failed');
              }
            });
            
          //}
        }else{
          resolve('Successful');
          console.log('No Item found to update in SystemDetail List');
        } 
      } 
      catch(err){
        reject('Failed');
        console.log("Error: " + err);
      }
    })

    
  };

  async saveInDetailList(itemsData:any) {  
    
    return await new Promise((resolve:any, reject:any)=>{

      try{

        if(itemsData.item.length > 0){
          for(let sd=0; sd < itemsData.item.length; sd++){

            let listInfo = {
              name: itemsData.name,
              item: itemsData.item[sd]
            }; 
            
            this.saveDetailItem(listInfo).then((res:any) => {             
              
              if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                resolve(res);
              }else{
                reject('Failed');
              }
            }); 
            
          }
        }else{
          resolve({ID: 0, GUID: "0"});
          console.log('No Item found to update in SystemDetail List');
        }
      } 
      catch(err){
        reject('Failed');
        console.log("Error: " + err);
      }
    })

    
  };

  async saveInAssignTaskList(itemsData:any) {  
    
    return await new Promise((resolve:any, reject:any)=>{

      try{

        if(itemsData.item.length > 0){
          for(let sd=0; sd < itemsData.item.length; sd++){

            let listInfo = {
              name: itemsData.name,
              item: itemsData.item[sd]
            }; 
            
            this.saveAssignTaskItem(listInfo).then((res:any) => {             
              
              if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                resolve(res);
              }else{
                reject('Failed');
              }
            }); 
            
          }
        }else{
          resolve({ID: 0, GUID: "0"});
          console.log('No Item found to update in SystemDetail List');
        }
      } 
      catch(err){
        reject('Failed');
        console.log("Error: " + err);
      }
    })

    
  };

  async saveInAssigneesList(itemsData:any) {  
    
    return await new Promise((resolve:any, reject:any)=>{

      try{

        if(itemsData.item.length > 0){
          for(let sd=0; sd < itemsData.item.length; sd++){

            let listInfo = {
              name: itemsData.name,
              item: itemsData.item[sd]
            }; 
            
            this.saveAssigneesItem(listInfo).then((res:any) => {             
              
              if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                resolve(res);
              }else{
                reject('Failed');
              }
            }); 
            
          }
        }else{
          resolve({ID: 0, GUID: "0"});
          console.log('No Item found to update in SystemDetail List');
        }
      } 
      catch(err){
        reject('Failed');
        console.log("Error: " + err);
      }
    })

    
  };

  async saveInAttachmentList(attachmentListInfo:any) {  
    
    return await new Promise((resolve:any, reject:any)=>{

      try{

        if(attachmentListInfo.item.length > 0){
          for(let a=0; a < attachmentListInfo.item.length; a++){
            let file = attachmentListInfo.item[a];
            let attachmentItem = {
              Title: file.Title,
              ActionBy: file.ActionBy,
              ActionDate: new Date()
            };
  
            let attachListInfo = {
              name: "supportattachment",
              item: attachmentItem
            };
  
            this.createAttachment(attachListInfo, file.File);

            resolve();
          }
        }else{
          resolve();
          console.log('No Attachment found to add in Attachment List');
        }
      } 
      catch(err){
        reject('Failed');
        console.log("Error: " + err);
      }
    })

    
  };

  private _removeDuplicateObjects(array: any[]) {
    return [...new Set(array.map(s => JSON.stringify(s)))]
      .map(s => JSON.parse(s));
  };

  
  //ERROR='error', SUCCESS='success', WARNING='warning', INFO='info', QUESTION='question' 
  toastSucAlert(typeIcon = 'success', timerProgressBar: boolean = false, title) {
    Swal.fire({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      icon: typeIcon,
      timerProgressBar,
      timer: 9000,
      title: title,
    });
  };

  private _getAllApprovers(title:any){

    return new Promise((resolve, reject)=>{
      try{ 
        this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('BergerTechApproversInfo')/items?&$top=2000&$select=*`) 
        .subscribe(
          (res:any)=>{
            if(res.value.length > 0){               
              resolve(res);
              return res;
            }else{
              resolve(res);
              return res;
            }           
            
        })            
      } 
      catch(err){
        reject('Get Approver from BergerTechApproversInfo failed !');
        console.log("Error: " + err);
      }
    })
  };

  private _getCustomerApprovers(custId:any, systemType:any){

    return new Promise((resolve, reject)=>{
      try{ 
        this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('ApproversOfCustomers')/items?&$top=2000&$select=*&$filter=((CustId eq '${custId}') and (SystemType eq '${systemType}')) `) 
        //this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('ApproversOfCustomers')/items?&$top=2000&$select=*&$filter=(CustId eq '${custId}') and (SystemModule eq '${systemModule}') and To ge '${new Date().toISOString()}'`) 
        .subscribe(
          (res:any)=>{
            if(res.value.length > 0){               
              resolve(res);
              return res;
            }else{
              resolve(res);
              return res;
            }           
            
        })            
      } 
      catch(err){
        reject('Get Approver from BergerTechApproversInfo failed !');
        console.log("Error: " + err);
      }
    })
  };

  ngOnDestroy(){
    this.appDataSubscription.unsubscribe();
  };

}

