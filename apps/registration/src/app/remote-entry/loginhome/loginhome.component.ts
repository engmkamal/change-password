// @ts-nocheck
import { Component, OnInit, HostListener } from '@angular/core';
import { from } from "rxjs";
import { SharepointlistService } from '@portal/core';
//import { Router } from '@angular/router';
import { IProcessLog, ISupModel, IAttachmentFiles, IAttachment, ISystemDetail, ISystemDetailToDB, IRequestor, IAppParameters } from '../core/interfaces/Supportmodel';
import { arrayBuffer } from 'stream/consumers';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';


@Component({
  selector: 'portal-loginhome',
  templateUrl: './loginhome.component.html',
  styleUrls: ['./loginhome.component.scss'],
})
export class LoginhomeComponent implements OnInit {

  currentAbsoluteUrl = window.location.href;
  Status = "";
  uId = "";
  readMode = "";
  logedUserAdId = null;
  requestInfo: any = {};
  parsedTestParameters:any;
  childBtnClickAction = "";

  createReqInfoFrmChild:ISupModel = {
    uId: "",
    readMode: "",
    ID: null,
    Title: null,
    Status: null,
    AppParameters: {
      Requestor: {},
      SystemDetails: [],                    
      ProcessLogs: [],
      Attachments: []
    },
    PendingWith: null,
    RequestorAdId: null,
  };

  approvalLink:any;
  reviewLink:any;
  pendingApprovalListInfo:any;
  processLogListInfo:any;
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
      SystemDetails: [],                    
      ProcessLog: [],
      Attachments: []
    },
    PendingWith: null,
    RequestorAdId: null,
    
  };
  

  webAbsoluteUrl = window.location.origin;
  //webAbsoluteUrl = "http://support.bergertechbd.com";

  //==for alert==
  options = {
    autoClose: false,
    keepAfterRouteChange: false
  };

  //=========for customer feedback ===========
  rating:number = 3;
  starCount:number = 5;
  allApprovers: any = {};
  dataFrmExcelUpload: any = [];
  _showCustomerLoginFrm = true;


  constructor(
    public sharepointlistService: SharepointlistService,
    private httpClient: HttpClient ) {
    //=====Reading unique id from url for Berger Tech BD-- start ==========
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
    //------Reading unique id from url -- End-----
  }

  ngOnInit(): void {
    
    if (this.uId != "") {

      this.parsedRequestInfo = { 
        uId: this.uId,
        readMode: this.readMode,
      }

      this.requestInfo = {
        uId: this.uId,
        readMode: this.readMode,
        Status: res[0].Status,
      };

    
    } else {
    
        this.requestInfo = {
          uId: "",
          readMode: "",
          Status: "",          
        };

       
      
    }
  };

  private _getAllApprovers(title:any){

    return new Promise((resolve, reject)=>{
      try{ 
        this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('BergerTechApproversInfo')/items?&$top=2000&$select=* `) 
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
    this.executeAfterViewInit();
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

  async GetOutputVal(valFrmChild: any) {

    let _status = '';
    let _pendingWith:any = [];
    let _updatedMstrListData;
    let _newDetailLstData = [];
    let _newApvrofcustListData = [];    
    let _updatedDetailLstData = [];
    let _attachmentListData = [];
    let _processLogData: IProcessLog;
    let _itemData;
    let approvers:any = [];
    let notifiers:any = [];
    let _pendingApprovalItemData: any;
    let _updatedAllLstsInfo:any;

    this.childBtnClickAction = valFrmChild.AppParameters.Action;

    switch (this.childBtnClickAction) {
      case "Submitted": {
        //==== validate whether requestor info is exist or not===
        if(valFrmChild.AppParameters.Requestor.CustId == null
          || valFrmChild.AppParameters.Requestor.CustName == null
          || valFrmChild.AppParameters.Requestor.Cust1stPhone == null
          || valFrmChild.AppParameters.Requestor.Cust1stEmail == null){
            alert("Requestor info is not found. Please try again later.");
            return false;
          };
        //---- validate whether requestor info is exist or not ends ----       
        this.createReqInfoFrmChild.AppParameters.Requestor = valFrmChild.AppParameters.Requestor;
        //this.createReqInfoFrmChild.AppParameters.SystemDetails = valFrmChild.AppParameters.SystemDetails;
        this.createReqInfoFrmChild.AppParameters.Attachments = valFrmChild.AppParameters.Attachments;
        this.createReqInfoFrmChild.AppParameters.Action = valFrmChild.AppParameters.Action;
        
        this.createReqInfoFrmChild.AppParameters.RequestDate = new Date().toString().substring(4, 15);

        let allItems = this.createReqInfoFrmChild.AppParameters;
        let _status = "Submitted";

        approvers.push({
          approversName: this.createReqInfoFrmChild.AppParameters.Requestor.CustName,
          approversEmail: this.createReqInfoFrmChild.AppParameters.Requestor.Cust1stEmail
        });

        notifiers.push({
          approversName: this.allApprovers.gmITName,
          approversEmail: this.allApprovers.gmITEmail
        });

        if(this.createReqInfoFrmChild.AppParameters.Requestor.RegistrationFor == "SAP"){
          notifiers.push({
            approversName: this.allApprovers.headERPName,
            approversEmail: this.allApprovers.headERPEmail
          });
        }else if(this.createReqInfoFrmChild.AppParameters.Requestor.RegistrationFor == "Others"){
          notifiers.push({
            approversName: this.allApprovers.headITInfraName,
            approversEmail: this.allApprovers.headITInfraEmail
          });
        }else{
          notifiers.push({
            approversName: this.allApprovers.headERPName,
            approversEmail: this.allApprovers.headERPEmail
          });
          notifiers.push({
            approversName: this.allApprovers.headITInfraName,
            approversEmail: this.allApprovers.headITInfraEmail
          });
        }
        

        let itemData = {
          CustId: this.createReqInfoFrmChild.AppParameters.Requestor.CustId,
          CustPassword: this.createReqInfoFrmChild.AppParameters.Requestor.CustPassword,
          CustName: this.createReqInfoFrmChild.AppParameters.Requestor.CustName,
          CustCompanyName: this.createReqInfoFrmChild.AppParameters.Requestor.CustCompanyName,
          CustCompany1stAddress: this.createReqInfoFrmChild.AppParameters.Requestor.CustCompany1stAddress,
          CustCompany2ndAddress: this.createReqInfoFrmChild.AppParameters.Requestor.CustCompany2ndAddress,
          CustCompany3rdAddress: this.createReqInfoFrmChild.AppParameters.Requestor.CustCompany3rdAddress,
          Cust1stEmail: this.createReqInfoFrmChild.AppParameters.Requestor.Cust1stEmail,
          Cust2ndEmail: this.createReqInfoFrmChild.AppParameters.Requestor.Cust2ndEmail,
          Cust3rdEmail: this.createReqInfoFrmChild.AppParameters.Requestor.Cust3rdEmail,
          Cust1stPhone: (this.createReqInfoFrmChild.AppParameters.Requestor.Cust1stPhone).toString(),
          Cust2ndPhone: (this.createReqInfoFrmChild.AppParameters.Requestor.Cust2ndPhone).toString(),
          Cust3rdPhone: (this.createReqInfoFrmChild.AppParameters.Requestor.Cust3rdPhone).toString(),
          Cust1stMobile: (this.createReqInfoFrmChild.AppParameters.Requestor.Cust1stMobile).toString(),
          Cust2ndMobile: (this.createReqInfoFrmChild.AppParameters.Requestor.Cust2ndMobile).toString(),
          Cust3rdMobile: (this.createReqInfoFrmChild.AppParameters.Requestor.Cust3rdMobile).toString(),
          CustDesignation: this.createReqInfoFrmChild.AppParameters.Requestor.CustDesignation,
          PendingTo: JSON.stringify(approvers),
          Status: _status,
          RegistrationFor: this.createReqInfoFrmChild.AppParameters.Requestor.RegistrationFor
        }

        let createMstrLstInfo ={
          name: "customerregistration",
          item: itemData
        }

        //====== 1.  save Masterlist ======
        await this.sharepointlistService.saveListItem(createMstrLstInfo)
          .then(
            (res) => {
              this.reviewLink = this.webAbsoluteUrl + '/registration?guid=' + res.GUID + "&mode=read";
              this.approvalLink = this.webAbsoluteUrl + '/registration?guid=' + res.GUID ;
               
              itemData.CustId = itemData.CustId + 'C' + res.ID;

              _updatedMstrListData = { 
                Title: "BCR-" + res.ID,
                CustId: itemData.CustId,
                ProcessLink: this.approvalLink
              };              

              this.updatedMstrLstInfo = {
                name: "customerregistration",
                rId: res.ID,
                item: _updatedMstrListData
              };

              //====== 0.  populating SystemInfo ======
              // (this.createReqInfoFrmChild.AppParameters.SystemDetails).forEach((sd:any) => {
              //   _newDetailLstData.push({
              //     CustId: this.createReqInfoFrmChild.AppParameters.Requestor.CustId,
              //     SystemType: sd.SystemType,
              //     SystemModule: sd.SystemModule,
              //     SAPCustomerNumber: sd.SAPCustomerNumber,
              //     SUser: sd.SUser,
              //     Manufacturer: sd.Manufacturer,
              //     Model: sd.Model,              
              //     OperatingSystem: sd.OperatingSystem,
              //     OSRelease: sd.OSRelease,
              //     DatabaseName: sd.DatabaseName,
              //     DatabaseRelease: sd.DatabaseRelease,
              //     PersonIncharge: sd.PersonIncharge,
              //     SIContactNo: sd.SIContactNo,
              //     SIEmail: sd.SIEmail
              //   })

              //   if(sd.SystemType == "SAP"){
              //     notifiers.push({
              //       approversName: this.allApprovers.headERPName,
              //       approversEmail: this.allApprovers.headERPEmail
              //     });
              //   }else{
              //     notifiers.push({
              //       approversName: this.allApprovers.headITInfraName,
              //       approversEmail: this.allApprovers.headITInfraEmail
              //     });
              //   }
                
                

              // });

              // this.newDetailLstInfo = {
              //   name: "CustomerSystemDetails",
              //   item: _newDetailLstData
              // };              
              
              // ## === Audit log/Process Log data =====
              _processLogData = {
                CustId: itemData.CustId,
                ActionDate: new Date(),
                Status: _status,
                ProcessByName: this.createReqInfoFrmChild.AppParameters.Requestor.CustName,
                ProcessByEmail: this.createReqInfoFrmChild.AppParameters.Requestor.Cust1stEmail,
                Comments: "Request Submitted"
              };

              this.processLogListInfo = {
                name: "customerregistrationlog",
                item: _processLogData
              };
              

              // ## === Pending Approval List data =====
              _pendingApprovalItemData = {    
                Title: itemData.CustId,
                ProcessName: "CustomerRegistration",
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

              // ## === Attachment List data =====
              (this.createReqInfoFrmChild.AppParameters.Attachments).forEach((file:any) => {
                _attachmentListData.push({
                  CustId: itemData.CustId,
                  ActionBy: this.createReqInfoFrmChild.AppParameters.Requestor.CustName,
                  ActionDate: new Date(),
                  File: file
                })
              });  

              this.attachmentListInfo = {
                name: "customerregistrationattachment",
                item: _attachmentListData
              };          

              // ## === Email Notification List data =====
              this.notificationListInfo = {  
                name: "NotificationList",
                item: {
                  Approvers: approvers,
                  Notifiers: notifiers,
                  Requestor: this.createReqInfoFrmChild.AppParameters.Requestor.CustName, 
                  Title: itemData.CustId, 
                  Status: _status,
                  ProcessLink: this.approvalLink,
                  ReviewLink: this.reviewLink 
                }
              };
              

              _updatedAllLstsInfo = {
                updatedMstrLstInfo: this.updatedMstrLstInfo,
                //updatedDetailLstInfo: this.newDetailLstInfo,
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
      case "Accepted from Email": {

        if(valFrmChild.AppParameters.Requestor != undefined){
          this.createReqInfoFrmChild.AppParameters.Requestor = valFrmChild.AppParameters.Requestor;
        }
        //this.createReqInfoFrmChild.AppParameters.SystemDetails = valFrmChild.AppParameters.SystemDetails;
        this.createReqInfoFrmChild.AppParameters.Attachments = valFrmChild.AppParameters.Attachments;
        this.createReqInfoFrmChild.AppParameters.Action = valFrmChild.AppParameters.Action;
  
        this.createReqInfoFrmChild.ID = valFrmChild.ID;
        this.createReqInfoFrmChild.Status = valFrmChild.Status;
        this.createReqInfoFrmChild.readMode = valFrmChild.readMode;
        this.createReqInfoFrmChild.uId = valFrmChild.uId;
  
        this.emitedDataFrmChild = this.createReqInfoFrmChild;

        this.reviewLink = this.webAbsoluteUrl + '/registration?guid=' + this.emitedDataFrmChild.uId + "&mode=read";
        this.approvalLink = this.webAbsoluteUrl + '/registration?guid=' + this.emitedDataFrmChild.uId ;

        if(this.createReqInfoFrmChild.AppParameters.Requestor.RegistrationFor == "SAP" || this.createReqInfoFrmChild.AppParameters.Requestor.RegistrationFor == "Both SAP and Others"){
          approvers.push({
            approversName: this.allApprovers.headERPName,
            approversEmail: this.allApprovers.headERPEmail
          });
        }else{
          approvers.push({
            approversName: this.allApprovers.headITInfraName,
            approversEmail: this.allApprovers.headITInfraEmail
          });
        }

        notifiers.push({
          approversName: this.allApprovers.gmITName,
          approversEmail: this.allApprovers.gmITEmail
        });

        _status = "Accepted from Email";

        _updatedMstrListData = {
          PendingTo: JSON.stringify(approvers),
          Status: _status          
        };

        this.updatedMstrLstInfo = {
          name: "customerregistration",
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

        //-----------sample received comments -----
        _processLogData = {
          CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
          ActionDate: new Date(),
          Status: _status,
          ProcessByName: this.emitedDataFrmChild.AppParameters.Requestor.CustName,
          ProcessByEmail: this.emitedDataFrmChild.AppParameters.Requestor.Cust1stEmail,
          Comments: "Proceeded by the requestor from his Email"
        };        

        this.processLogListInfo = {
          name: "customerregistrationlog",
          item: _processLogData
        };  

        // (this.emitedDataFrmChild.AppParameters.SystemDetails).forEach((sd:any) => {

        //   if(Object.prototype.hasOwnProperty.call(sd, 'rowId')){
        //     if(sd.rowId == undefined || sd.rowId == null){
              
        //       _newDetailLstData.push({
        //         CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
        //         SystemType: sd.SystemType,
        //         SystemModule: sd.SystemModule,
        //         SAPCustomerNumber: sd.SAPCustomerNumber,
        //         SUser: sd.SUser,
        //         Manufacturer: sd.Manufacturer,
        //         Model: sd.Model,              
        //         OperatingSystem: sd.OperatingSystem,
        //         OSRelease: sd.OSRelease,
        //         DatabaseName: sd.DatabaseName,
        //         DatabaseRelease: sd.DatabaseRelease,
        //         PersonIncharge: sd.PersonIncharge,
        //         SIContactNo: sd.SIContactNo,
        //         SIEmail: sd.SIEmail
        //       })
        //     }else{
        //       _updatedDetailLstData.push({
        //         rowId: sd.rowId,
        //         CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
        //         SystemType: sd.SystemType,
        //         SystemModule: sd.SystemModule,
        //         SAPCustomerNumber: sd.SAPCustomerNumber,
        //         SUser: sd.SUser,
        //         Manufacturer: sd.Manufacturer,
        //         Model: sd.Model,              
        //         OperatingSystem: sd.OperatingSystem,
        //         OSRelease: sd.OSRelease,
        //         DatabaseName: sd.DatabaseName,
        //         DatabaseRelease: sd.DatabaseRelease,
        //         PersonIncharge: sd.PersonIncharge,
        //         SIContactNo: sd.SIContactNo,
        //         SIEmail: sd.SIEmail
        //       })
        //     }
        //   }else{
        //     _updatedDetailLstData.push({
        //       rowId: sd.rowId,
        //       CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
        //       SystemType: sd.SystemType,
        //       SystemModule: sd.SystemModule,
        //       SAPCustomerNumber: sd.SAPCustomerNumber,
        //       SUser: sd.SUser,
        //       Manufacturer: sd.Manufacturer,
        //       Model: sd.Model,              
        //       OperatingSystem: sd.OperatingSystem,
        //       OSRelease: sd.OSRelease,
        //       DatabaseName: sd.DatabaseName,
        //       DatabaseRelease: sd.DatabaseRelease,
        //       PersonIncharge: sd.PersonIncharge,
        //       SIContactNo: sd.SIContactNo,
        //       SIEmail: sd.SIEmail
        //     })
        //   }     

        // });

        // this.newDetailLstInfo = {
        //   name: "CustomerSystemDetails",
        //   item: _newDetailLstData
        // };
        
        // this.updatedDetailLstInfo = {
        //   name: "CustomerSystemDetails",
        //   item: _updatedDetailLstData
        // };

        

        (this.emitedDataFrmChild.AppParameters.Attachments).forEach((file:any) => {
          _attachmentListData.push({
            CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
            ActionBy: this.emitedDataFrmChild.AppParameters.Requestor.CustName,
            ActionDate: new Date(),
            File: file
          })
        });  

        this.attachmentListInfo = {
          name: "customerregistrationattachment",
          item: _attachmentListData
        }; 
        
        _updatedAllLstsInfo = {
          updatedMstrLstInfo: this.updatedMstrLstInfo,
          //updatedDetailLstInfo: this.updatedDetailLstInfo,
          //newDetailLstInfo: this.newDetailLstInfo,
          pendingApprovalListInfo: this.pendingApprovalListInfo,
          processLogListInfo: this.processLogListInfo,
          attachmentListInfo: this.attachmentListInfo,
          notificationListInfo: {
              name: "NotificationList",
              item: {
                Approvers: approvers,
                Notifiers: approvers,
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

      case "Reviewed": {

        if(valFrmChild.AppParameters.Requestor != undefined){
          this.createReqInfoFrmChild.AppParameters.Requestor = valFrmChild.AppParameters.Requestor;
        }
        
        this.createReqInfoFrmChild.AppParameters.SystemDetails = valFrmChild.AppParameters.SystemDetails;
        this.createReqInfoFrmChild.AppParameters.Attachments = valFrmChild.AppParameters.Attachments;
        this.createReqInfoFrmChild.AppParameters.Action = valFrmChild.AppParameters.Action;
  
        this.createReqInfoFrmChild.ID = valFrmChild.ID;
        this.createReqInfoFrmChild.Status = valFrmChild.Status;
        this.createReqInfoFrmChild.readMode = valFrmChild.readMode;
        this.createReqInfoFrmChild.uId = valFrmChild.uId;
  
        this.emitedDataFrmChild = this.createReqInfoFrmChild;

        this.reviewLink = this.webAbsoluteUrl + '/registration?guid=' + this.emitedDataFrmChild.uId + "&mode=read";
        this.approvalLink = this.webAbsoluteUrl + '/registration?guid=' + this.emitedDataFrmChild.uId ;

        if(this.createReqInfoFrmChild.AppParameters.Requestor.RegistrationFor == "SAP" ){
          approvers.push({
            approversName: this.allApprovers.gmITName,
            approversEmail: this.allApprovers.gmITEmail
          });

          _status = "Reviewed SAP System Info";
          
          notifiers.push({
            approversName: this.allApprovers.headITInfraName,
            approversEmail: this.allApprovers.headITInfraEmail
          });
          

        }else if(this.createReqInfoFrmChild.AppParameters.Requestor.RegistrationFor == "Others" ){
          approvers.push({
            approversName: this.allApprovers.gmITName,
            approversEmail: this.allApprovers.gmITEmail
          });

          _status = "Reviewed Others System Info";

          notifiers.push({
            approversName: this.allApprovers.headERPName,
            approversEmail: this.allApprovers.headERPEmail
          });

        }else if(this.createReqInfoFrmChild.AppParameters.Requestor.RegistrationFor == "Both SAP and Others"){
          approvers.push({
            approversName: this.allApprovers.headITInfraName,
            approversEmail: this.allApprovers.headITInfraEmail
          });

          _status = "Reviewed SAP System Info";

          notifiers.push({
            approversName: this.allApprovers.gmITName,
            approversEmail: this.allApprovers.gmITEmail
          });

        }else{
          approvers.push({
            approversName: this.allApprovers.gmITName,
            approversEmail: this.allApprovers.gmITEmail
          });

          _status = "Reviewed Others System Info";

          notifiers.push({
            approversName: this.allApprovers.headITInfraName,
            approversEmail: this.allApprovers.headITInfraEmail
          });
        }        

        _updatedMstrListData = {
          PendingTo: JSON.stringify(approvers),
          Status: _status          
        };

        this.updatedMstrLstInfo = {
          name: "customerregistration",
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

        //-----------sample received comments -----
        _processLogData = {
          CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
          ActionDate: new Date(),
          Status: _status,
          ProcessByName: this.emitedDataFrmChild.AppParameters.Requestor.CustName,
          ProcessByEmail: this.emitedDataFrmChild.AppParameters.Requestor.Cust1stEmail,
          Comments: "Reviewed and System Info is being updated."
        };        

        this.processLogListInfo = {
          name: "customerregistrationlog",
          item: _processLogData
        };  

        (this.emitedDataFrmChild.AppParameters.SystemDetails).forEach((sd:any) => {

          if(Object.prototype.hasOwnProperty.call(sd, 'rowId')){
            if(sd.rowId == undefined || sd.rowId == null){
              
              _newDetailLstData.push({
                CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
                SystemType: sd.SystemType,
                SystemModule: sd.SystemModule,
                SAPCustomerNumber: sd.SAPCustomerNumber,
                SUser: sd.SUser,
                SystemDescription: sd.SystemDescription,
                Manufacturer: sd.Manufacturer,
                Model: sd.Model,              
                OperatingSystem: sd.OperatingSystem,
                OSRelease: sd.OSRelease,
                DatabaseName: sd.DatabaseName,
                DatabaseRelease: sd.DatabaseRelease,
                PersonIncharge: sd.PersonIncharge,
                SIContactNo: sd.SIContactNo,
                SIEmail: sd.SIEmail,
                BergerTechIncharge: sd.BergerTechIncharge,
                BergerTechInchargeContactNo: sd.BergerTechInchargeContactNo,
                BergerTechInchargeEmail: sd.BergerTechInchargeEmail
              })
            }else{
              _updatedDetailLstData.push({
                rowId: sd.rowId,
                CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
                SystemType: sd.SystemType,
                SystemModule: sd.SystemModule,
                SAPCustomerNumber: sd.SAPCustomerNumber,
                SUser: sd.SUser,
                Manufacturer: sd.Manufacturer,
                Model: sd.Model,              
                OperatingSystem: sd.OperatingSystem,
                OSRelease: sd.OSRelease,
                DatabaseName: sd.DatabaseName,
                DatabaseRelease: sd.DatabaseRelease,
                PersonIncharge: sd.PersonIncharge,
                SIContactNo: sd.SIContactNo,
                SIEmail: sd.SIEmail,
                BergerTechIncharge: sd.BergerTechIncharge,
                BergerTechInchargeContactNo: sd.BergerTechInchargeContactNo,
                BergerTechInchargeEmail: sd.BergerTechInchargeEmail
              })
            }
          }else{
            _updatedDetailLstData.push({
              rowId: sd.rowId,
              CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
              SystemType: sd.SystemType,
              SystemModule: sd.SystemModule,
              SAPCustomerNumber: sd.SAPCustomerNumber,
              SUser: sd.SUser,
              SystemDescription: sd.SystemDescription,
              Manufacturer: sd.Manufacturer,
              Model: sd.Model,              
              OperatingSystem: sd.OperatingSystem,
              OSRelease: sd.OSRelease,
              DatabaseName: sd.DatabaseName,
              DatabaseRelease: sd.DatabaseRelease,
              PersonIncharge: sd.PersonIncharge,
              SIContactNo: sd.SIContactNo,
              SIEmail: sd.SIEmail,
              BergerTechIncharge: sd.BergerTechIncharge,
              BergerTechInchargeContactNo: sd.BergerTechInchargeContactNo,
              BergerTechInchargeEmail: sd.BergerTechInchargeEmail
            })
          }     

        });

        this.newDetailLstInfo = {
          name: "CustomerSystemDetails",
          item: _newDetailLstData
        };
        
        this.updatedDetailLstInfo = {
          name: "CustomerSystemDetails",
          item: _updatedDetailLstData
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

        (this.emitedDataFrmChild.AppParameters.Attachments).forEach((file:any) => {
          _attachmentListData.push({
            CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
            ActionBy: this.emitedDataFrmChild.AppParameters.Requestor.CustName,
            ActionDate: new Date(),
            File: file
          })
        });  

        this.attachmentListInfo = {
          name: "customerregistrationattachment",
          item: _attachmentListData
        }; 
        
        _updatedAllLstsInfo = {
          updatedMstrLstInfo: this.updatedMstrLstInfo,
          //updatedDetailLstInfo: this.updatedDetailLstInfo,
          newDetailLstInfo: this.newDetailLstInfo,
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

      case "ReviewOtherSystemInfo": {

        if(valFrmChild.AppParameters.Requestor != undefined){
          this.createReqInfoFrmChild.AppParameters.Requestor = valFrmChild.AppParameters.Requestor;
        }
        
        this.createReqInfoFrmChild.AppParameters.SystemDetails = valFrmChild.AppParameters.SystemDetails;
        this.createReqInfoFrmChild.AppParameters.Attachments = valFrmChild.AppParameters.Attachments;
        this.createReqInfoFrmChild.AppParameters.Action = valFrmChild.AppParameters.Action;
  
        this.createReqInfoFrmChild.ID = valFrmChild.ID;
        this.createReqInfoFrmChild.Status = valFrmChild.Status;
        this.createReqInfoFrmChild.readMode = valFrmChild.readMode;
        this.createReqInfoFrmChild.uId = valFrmChild.uId;
  
        this.emitedDataFrmChild = this.createReqInfoFrmChild;

        this.reviewLink = this.webAbsoluteUrl + '/registration?guid=' + this.emitedDataFrmChild.uId + "&mode=read";
        this.approvalLink = this.webAbsoluteUrl + '/registration?guid=' + this.emitedDataFrmChild.uId ;

        if(this.createReqInfoFrmChild.AppParameters.Requestor.RegistrationFor == "Others" 
        || this.createReqInfoFrmChild.AppParameters.Requestor.RegistrationFor == "Both SAP and Others"){
          approvers.push({
            approversName: this.allApprovers.gmITName,
            approversEmail: this.allApprovers.gmITEmail
          });

          _status = "Reviewed Others System Info";

          notifiers.push({
            approversName: this.allApprovers.headERPName,
            approversEmail: this.allApprovers.headERPEmail
          });

        }else{
          approvers.push({
            approversName: this.allApprovers.gmITName,
            approversEmail: this.allApprovers.gmITEmail
          });

          _status = "Reviewed Others System Info";

          notifiers.push({
            approversName: this.allApprovers.headITInfraName,
            approversEmail: this.allApprovers.headITInfraEmail
          });
        }        

        _updatedMstrListData = {
          PendingTo: JSON.stringify(approvers),
          Status: _status          
        };

        this.updatedMstrLstInfo = {
          name: "customerregistration",
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

        //-----------sample received comments -----
        _processLogData = {
          CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
          ActionDate: new Date(),
          Status: _status,
          ProcessByName: this.emitedDataFrmChild.AppParameters.Requestor.CustName,
          ProcessByEmail: this.emitedDataFrmChild.AppParameters.Requestor.Cust1stEmail,
          Comments: "Reviewed and System Info is being updated."
        };        

        this.processLogListInfo = {
          name: "customerregistrationlog",
          item: _processLogData
        };  

        (this.emitedDataFrmChild.AppParameters.SystemDetails).forEach((sd:any) => {

          if(Object.prototype.hasOwnProperty.call(sd, 'rowId')){
            if(sd.rowId == undefined || sd.rowId == null){
              
              _newDetailLstData.push({
                CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
                SystemType: sd.SystemType,
                SystemModule: sd.SystemModule,
                SAPCustomerNumber: sd.SAPCustomerNumber,
                SUser: sd.SUser,
                SystemDescription: sd.SystemDescription,
                Manufacturer: sd.Manufacturer,
                Model: sd.Model,              
                OperatingSystem: sd.OperatingSystem,
                OSRelease: sd.OSRelease,
                DatabaseName: sd.DatabaseName,
                DatabaseRelease: sd.DatabaseRelease,
                PersonIncharge: sd.PersonIncharge,
                SIContactNo: sd.SIContactNo,
                SIEmail: sd.SIEmail
              })
            }else{
              _updatedDetailLstData.push({
                rowId: sd.rowId,
                CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
                SystemType: sd.SystemType,
                SystemModule: sd.SystemModule,
                SAPCustomerNumber: sd.SAPCustomerNumber,
                SUser: sd.SUser,
                SystemDescription: sd.SystemDescription,
                Manufacturer: sd.Manufacturer,
                Model: sd.Model,              
                OperatingSystem: sd.OperatingSystem,
                OSRelease: sd.OSRelease,
                DatabaseName: sd.DatabaseName,
                DatabaseRelease: sd.DatabaseRelease,
                PersonIncharge: sd.PersonIncharge,
                SIContactNo: sd.SIContactNo,
                SIEmail: sd.SIEmail
              })
            }
          }else{
            _updatedDetailLstData.push({
              rowId: sd.rowId,
              CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
              SystemType: sd.SystemType,
              SystemModule: sd.SystemModule,
              SAPCustomerNumber: sd.SAPCustomerNumber,
              SUser: sd.SUser,
              SystemDescription: sd.SystemDescription,
              Manufacturer: sd.Manufacturer,
              Model: sd.Model,              
              OperatingSystem: sd.OperatingSystem,
              OSRelease: sd.OSRelease,
              DatabaseName: sd.DatabaseName,
              DatabaseRelease: sd.DatabaseRelease,
              PersonIncharge: sd.PersonIncharge,
              SIContactNo: sd.SIContactNo,
              SIEmail: sd.SIEmail
            })
          }     

        });

        this.newDetailLstInfo = {
          name: "CustomerSystemDetails",
          item: _newDetailLstData
        };
        
        this.updatedDetailLstInfo = {
          name: "CustomerSystemDetails",
          item: _updatedDetailLstData
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

        (this.emitedDataFrmChild.AppParameters.Attachments).forEach((file:any) => {
          _attachmentListData.push({
            CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
            ActionBy: this.emitedDataFrmChild.AppParameters.Requestor.CustName,
            ActionDate: new Date(),
            File: file
          })
        });  

        this.attachmentListInfo = {
          name: "customerregistrationattachment",
          item: _attachmentListData
        }; 
        
        _updatedAllLstsInfo = {
          updatedMstrLstInfo: this.updatedMstrLstInfo,
          //updatedDetailLstInfo: this.updatedDetailLstInfo,
          newDetailLstInfo: this.newDetailLstInfo,
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

      case "Completed": {

        if(valFrmChild.AppParameters.Requestor != undefined){
          this.createReqInfoFrmChild.AppParameters.Requestor = valFrmChild.AppParameters.Requestor;
        }
        this.createReqInfoFrmChild.AppParameters.SystemDetails = valFrmChild.AppParameters.SystemDetails;
        this.createReqInfoFrmChild.AppParameters.Attachments = valFrmChild.AppParameters.Attachments;
        this.createReqInfoFrmChild.AppParameters.Action = valFrmChild.AppParameters.Action;
  
        this.createReqInfoFrmChild.ID = valFrmChild.ID;
        this.createReqInfoFrmChild.Status = valFrmChild.Status;
        this.createReqInfoFrmChild.readMode = valFrmChild.readMode;
        this.createReqInfoFrmChild.uId = valFrmChild.uId;
  
        this.emitedDataFrmChild = this.createReqInfoFrmChild;

        this.reviewLink = this.webAbsoluteUrl + '/registration?guid=' + this.emitedDataFrmChild.uId + "&mode=read";
        this.approvalLink = this.webAbsoluteUrl + '/registration?guid=' + this.emitedDataFrmChild.uId ;

        notifiers.push({
          approversName: this.allApprovers.headITInfraName,
          approversEmail: this.allApprovers.headITInfraEmail
        });

        notifiers.push({
          approversName: this.allApprovers.headERPName,
          approversEmail: this.allApprovers.headERPEmail
        });

        _status = "Completed";

        _updatedMstrListData = {
          PendingTo: JSON.stringify(approvers),
          Status: _status          
        };

        this.updatedMstrLstInfo = {
          name: "customerregistration",
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
        _processLogData = {
          CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
          ActionDate: new Date(),
          Status: _status,
          ProcessByName: this.emitedDataFrmChild.AppParameters.Requestor.CustName,
          ProcessByEmail: this.emitedDataFrmChild.AppParameters.Requestor.Cust1stEmail,
          Comments: "Approved and Completed."
        };        

        this.processLogListInfo = {
          name: "customerregistrationlog",
          item: _processLogData
        };  

        (this.emitedDataFrmChild.AppParameters.SystemDetails).forEach((sd:any) => {

          if(Object.prototype.hasOwnProperty.call(sd, 'rowId')){
            if(sd.rowId == undefined || sd.rowId == null){
              
              _newDetailLstData.push({
                CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
                SystemType: sd.SystemType,
                SystemModule: sd.SystemModule,
                SAPCustomerNumber: sd.SAPCustomerNumber,
                SUser: sd.SUser,
                SystemDescription: sd.SystemDescription,
                Manufacturer: sd.Manufacturer,
                Model: sd.Model,              
                OperatingSystem: sd.OperatingSystem,
                OSRelease: sd.OSRelease,
                DatabaseName: sd.DatabaseName,
                DatabaseRelease: sd.DatabaseRelease,
                PersonIncharge: sd.PersonIncharge,
                SIContactNo: sd.SIContactNo,
                SIEmail: sd.SIEmail,
                BergerTechIncharge: sd.BergerTechIncharge,
                BergerTechInchargeContactNo: sd.BergerTechInchargeContactNo,
                BergerTechInchargeEmail: sd.BergerTechInchargeEmail
              });

            }else{
              _updatedDetailLstData.push({
                rowId: sd.rowId,
                rowItems: {
                  CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
                  SystemType: sd.SystemType,
                  SystemModule: sd.SystemModule,
                  SAPCustomerNumber: sd.SAPCustomerNumber,
                  SUser: sd.SUser,
                  SystemDescription: sd.SystemDescription,
                  Manufacturer: sd.Manufacturer,
                  Model: sd.Model,              
                  OperatingSystem: sd.OperatingSystem,
                  OSRelease: sd.OSRelease,
                  DatabaseName: sd.DatabaseName,
                  DatabaseRelease: sd.DatabaseRelease,
                  PersonIncharge: sd.PersonIncharge,
                  SIContactNo: sd.SIContactNo,
                  SIEmail: sd.SIEmail,
                  BergerTechIncharge: sd.BergerTechIncharge,
                  BergerTechInchargeContactNo: sd.BergerTechInchargeContactNo,
                  BergerTechInchargeEmail: sd.BergerTechInchargeEmail
                }
                
              });

              _newApvrofcustListData.push({
                CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
                SystemType: sd.SystemType,
                SystemModule: sd.SystemModule,                
                BergerTechIncharge: sd.BergerTechIncharge,
                BergerTechInchargeContactNo: sd.BergerTechInchargeContactNo,
                BergerTechInchargeEmail: sd.BergerTechInchargeEmail
              })
            }
          }else{
            _updatedDetailLstData.push({
              rowId: sd.rowId,
              CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
              SystemType: sd.SystemType,
              SystemModule: sd.SystemModule,
              SAPCustomerNumber: sd.SAPCustomerNumber,
              SUser: sd.SUser,
              SystemDescription: sd.SystemDescription,
              Manufacturer: sd.Manufacturer,
              Model: sd.Model,              
              OperatingSystem: sd.OperatingSystem,
              OSRelease: sd.OSRelease,
              DatabaseName: sd.DatabaseName,
              DatabaseRelease: sd.DatabaseRelease,
              PersonIncharge: sd.PersonIncharge,
              SIContactNo: sd.SIContactNo,
              SIEmail: sd.SIEmail,
              BergerTechIncharge: sd.BergerTechIncharge,
              BergerTechInchargeContactNo: sd.BergerTechInchargeContactNo,
              BergerTechInchargeEmail: sd.BergerTechInchargeEmail
            });

            _newApvrofcustListData.push({
              CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
              SystemType: sd.SystemType,
              SystemModule: sd.SystemModule,                
              BergerTechIncharge: sd.BergerTechIncharge,
              BergerTechInchargeContactNo: sd.BergerTechInchargeContactNo,
              BergerTechInchargeEmail: sd.BergerTechInchargeEmail,
              From: new Date(),
              To: new Date(63072000000 + (new Date()).getTime()),
            })
          }     

        });

        this.newDetailLstInfo = {
          name: "CustomerSystemDetails",
          item: _newDetailLstData
        };
        
        this.updatedDetailLstInfo = {
          name: "CustomerSystemDetails",
          item: _updatedDetailLstData
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

        (this.emitedDataFrmChild.AppParameters.Attachments).forEach((file:any) => {
          _attachmentListData.push({
            CustId: this.emitedDataFrmChild.AppParameters.Requestor.CustId,
            ActionBy: this.emitedDataFrmChild.AppParameters.Requestor.CustName,
            ActionDate: new Date(),
            File: file
          })
        });  

        this.attachmentListInfo = {
          name: "customerregistrationattachment",
          item: _attachmentListData
        }; 
        
        _updatedAllLstsInfo = {
          updatedMstrLstInfo: this.updatedMstrLstInfo,
          updatedDetailLstInfo: this.updatedDetailLstInfo,
          newDetailLstInfo: this.newDetailLstInfo,
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
          },
          apvrofcustomerListInfo: {
            name: "ApproversOfCustomers",
            item: _newApvrofcustListData
          }
          
        }

        //=========calling function to update data ======
        this.updateRequest(_updatedAllLstsInfo);

        break;
      }

      default: {
        alert("Action is undefined for this type of click event !!");
        break;
      }
      
    }


  }

  GetGridData(valFrmChild: any) {
    if (this.uId == "") {
      this.createReqInfoFrmChild = valFrmChild;
    }
    else {
      this.emitedDataFrmChild = valFrmChild;
    }

  }

  async createNotification(emailInfo:any) {
    
    return await new Promise((resolve:any, reject:any)=>{

      try{

        if (this.uId != "") {
          this.reviewLink = this.webAbsoluteUrl + '/registration?guid=' + this.uId + "&mode=read";
          this.approvalLink = this.webAbsoluteUrl + '/registration?guid=' + this.uId;
        }
    
        let emailFldData;
    
        switch (emailInfo.item.Templet) {
          case "Notification": {
            emailFldData = {
              Status: emailInfo.item.Status,
              To: emailInfo.item.Notifiers.approversEmail,
              Subject: `Request for 'Berger Tech Customer Registration' process with Customer ID# ${emailInfo.item.Title} has been initiated`,
              __metadata: {
                "type": "SP.Data.NotificationListListItem"
              },
              Body: `
                <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
                  <p><b>Dear Mr./Ms. ${emailInfo.item.Notifiers.approversName},</b><br/></p>
                  <p>Request for &quot;Berger Tech Customer Registration&quot; process has been initiated. <br/>
                    Please click on &quot;review link&quot; attached below to view the request.<br/>
                    <b>Request ID/Ref:&#160; ${emailInfo.item.Title},</b><br/>
                    Status: ${emailInfo.item.Status},<br/>                    
                  </p>
                  <p>Review Link : <a href="${emailInfo.item.ReviewLink}">Review Link </a></p>
                  <div style="font-family: verdana; color: #030e81; font-size: 12px;">
                    <p><b>Thanks & Regards,</b><br/>System Admin,<br/>Berger Tech Consulting Ltd.,<br/>Email: info@bergertechbd.com<br/>
                    [This is a System Generated Email from Berger Portal and no reply is required.]
                    </p>                          
                  </div>              
                </div>
              `,
              
            }
            break;
          }
          case "AcceptFrmMail": {
            emailFldData = {
              Status: emailInfo.item.Status,
              To: emailInfo.item.Notifiers.approversEmail,
              Subject: `Request for 'Berger Tech Customer Registration' process with Customer ID# ${emailInfo.item.Title} has been initiated`,
              __metadata: {
                "type": "SP.Data.NotificationListListItem"
              },
              Body: `
                <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
                  <p><b>Dear Mr./Ms. ${emailInfo.item.Notifiers.approversName},</b><br/></p>
                  <p>Request for &quot;Berger Tech Customer Registration&quot; process has been initiated. <br/>
                    Please click on &quot;process link&quot; attached below to verify your email and to complete the registration.<br/>
                    <b>Customer ID/Ref:&#160; ${emailInfo.item.Title},</b><br/>
                    <p>Please preserve this <b>Customer ID</b> and the <b>Password</b> you have given while creating this application for any future login in Berger Tech Portal.</p>
                    Application Status: ${emailInfo.item.Status},<br/>                    
                  </p>
                  <p>Process Link : <a href="${emailInfo.item.ProcessLink}">Process Link </a></p>
                  <div style="font-family: verdana; color: #030e81; font-size: 12px;">
                    <p><b>Thanks & Regards,</b><br/>System Admin,<br/>Berger Tech Consulting Ltd.,<br/>Email: info@bergertechbd.com<br/>
                    [This is a System Generated Email from Berger Portal and no reply is required.]
                    </p>                          
                  </div>              
                </div>
              `,
              
            }
            break;
          }
          case "AcceptedFrmMail": {
            emailFldData = {
              Status: emailInfo.item.Status,
              To: emailInfo.item.Notifiers.approversEmail,
              Subject: `Request for 'Berger Tech Customer Registration' process with Customer ID# ${emailInfo.item.Title} has been submitted`,
              __metadata: {
                "type": "SP.Data.NotificationListListItem"
              },
              Body: `
                <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
                  <p><b>Dear Mr./Ms. ${emailInfo.item.Notifiers.approversName},</b><br/></p>
                  <p>Request for &quot;Berger Tech Customer Registration&quot; process has been submitted successfully and is waiting to accept by Berger Tech Consulting Ltd. upon review by the responsible personnel. <br/>
                    You will be notified once it's been accepted. <br/>
                    Please click on &quot;review link&quot; attached below to view the updated status of this request.<br/>
                    <b>Request ID/Ref:&#160; ${emailInfo.item.Title},</b><br/>
                    Status: ${emailInfo.item.Status},<br/>
                  </p>
                  <p>Review Link : <a href="${emailInfo.item.ReviewLink}">Review Link </a></p>
                  <div style="font-family: verdana; color: #030e81; font-size: 12px;">
                    <p><b>Thanks & Regards,</b><br/>System Admin,<br/>Berger Tech Consulting Ltd.,<br/>Email: info@bergertechbd.com<br/>
                    [This is a System Generated Email from Berger Portal and no reply is required.]
                    </p>                          
                  </div>              
                </div>
              `,
              
            }
            break;
          }
          case "Review": {
            emailFldData = {
              Status: emailInfo.item.Status,
              To: emailInfo.item.Notifiers.approversEmail,
              Subject: `Request for 'Berger Tech Customer Registration' process with Customer ID# ${emailInfo.item.Title} is waiting for your review.`,
              __metadata: {
                "type": "SP.Data.NotificationListListItem"
              },
              Body: `
                <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
                  <p><b>Dear Mr./Ms. ${emailInfo.item.Notifiers.approversName},</b><br/></p>
                  <p>Request for &quot;Berger Tech Customer Registration&quot; process is waiting for your review and to update Customer System Details as well. <br/>
                    Please click on &quot;process link&quot; attached below to process this registration.<br/>
                    <b>Request ID/Ref:&#160; ${emailInfo.item.Title},</b><br/>
                    Status: ${emailInfo.item.Status},<br/>                    
                  </p>
                  <p>Process Link : <a href="${emailInfo.item.ProcessLink}">Process Link </a></p>
                  <div style="font-family: verdana; color: #030e81; font-size: 12px;">
                    <p><b>Thanks & Regards,</b><br/>System Admin,<br/>Berger Tech Consulting Ltd.,<br/>Email: info@bergertechbd.com<br/>
                    [This is a System Generated Email from Berger Portal and no reply is required.]
                    </p>                          
                  </div>              
                </div>
              `,
              
            }
            break;
          }
          case "Reviewed": {
            emailFldData = {
              Status: emailInfo.item.Status,
              To: emailInfo.item.Notifiers.approversEmail,
              Subject: `Request for 'Berger Tech Customer Registration' process with Customer ID# ${emailInfo.item.Title} is being reviewed.`,
              __metadata: {
                "type": "SP.Data.NotificationListListItem"
              },
              Body: `
                <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
                  <p><b>Dear Mr./Ms. ${emailInfo.item.Notifiers.approversName},</b><br/></p>
                  <p>  Request for &quot;Berger Tech Customer Registration&quot; process is is being reviewed and is waiting for final approval. <br/>
                    Please click on &quot;review link&quot; attached below to view the updated status of this registration process.<br/>
                    <b>Request ID/Ref:&#160; ${emailInfo.item.Title},</b><br/>
                    Status: ${emailInfo.item.Status},<br/>
                  </p>
                  <p>Review Link : <a href="${emailInfo.item.ReviewLink}">Review Link </a></p>
                  <div style="font-family: verdana; color: #030e81; font-size: 12px;">
                    <p><b>Thanks & Regards,</b><br/>System Admin,<br/>Berger Tech Consulting Ltd.,<br/>Email: info@bergertechbd.com<br/>
                    [This is a System Generated Email from Berger Portal and no reply is required.]
                    </p>                          
                  </div>              
                </div>
              `,
              
            }
            break;
          }
          case "Completed": {
            emailFldData = {
              Status: emailInfo.item.Status,
              To: emailInfo.item.Notifiers.approversEmail,
              Subject: `Request for 'Berger Tech Customer Registration' process with Customer ID# ${emailInfo.item.Title} is being approved and completed.`,
              __metadata: {
                "type": "SP.Data.NotificationListListItem"
              },
              Body: `
                <div style="padding-top:0px; margin-top: 0px; font-family: verdana; color: #030e81; font-size: 12px;">              
                  <p><b>Dear Mr./Ms. ${emailInfo.item.Notifiers.approversName},</b><br/></p>
                  <p>  Request for &quot;Berger Tech Customer Registration&quot; process is is being approved and completed. <br/>
                    Please click on &quot;review link&quot; attached below to view the updated status of this registration process.<br/>
                    <b>Request ID/Ref:&#160; ${emailInfo.item.Title},</b><br/>
                    Status: ${emailInfo.item.Status},<br/>                    
                  </p>
                  <p>Review Link : <a href="${emailInfo.item.ReviewLink}">Review Link </a></p>
                  <div style="font-family: verdana; color: #030e81; font-size: 12px;">
                    <p><b>Thanks & Regards,</b><br/>System Admin,<br/>Berger Tech Consulting Ltd.,<br/>Email: info@bergertechbd.com<br/>
                    [This is a System Generated Email from Berger Portal and no reply is required.]
                    </p>                          
                  </div>              
                </div>
              `,
              
            }
            break;
          }
          case "Approval": {
            emailFldData = {
              To: emailInfo.item.Notifiers.approversEmail,
              ReviewLink: this.reviewLink,
              ApprovalLink: this.approvalLink,
              Status: emailInfo.item.Status,
              Title: "Request for 'Berger Tech Customer Registration' workflow with ref# " + emailInfo.item.Title + " is waiting for your approval",
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
                  <p> Request for &quot;Berger Tech Customer Registration&quot; workflow is waiting for your approval. Please process to continue either from Pending Approval of Berger Portal or from the process link below.<br/>
                    <b>Request ID/Ref:&#160; ${emailInfo.item.Title},</b><br/>
                    Status: ${emailInfo.item.Status},<br/>                    
                  </p>
                  <p>Process Link : <a href="${emailInfo.item.ProcessLink}">Process Link </a></p>              
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
          default: {
            alert("Action is undefined for this type of click event !!");
            break;
          }
        }
    
        let notificationlListInfo = {
          name: "NotificationList",
          item: emailFldData
        };

        this.sharepointlistService.saveListItem(notificationlListInfo)
        .then(
          (res:any) => {
            if(res.ID != null){
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

    
  }

  async saveInNotificationList(notificationInfo:any) {
    return await new Promise((resolve:any, reject:any)=>{

      try{

        if (this.uId == "") {

          (notificationInfo.item.Approvers).forEach((apvr:any, index:number) => {
            let notInfo = {
              name: notificationInfo.name,
              item: {
                Templet: "AcceptFrmMail",
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
    
    
          setTimeout(function () {
            window.location.href = "https://support.bergertechbd.com";
          }, 30000);
        } else {
          let req = this.pendingApprovalListInfo.item;
          switch (this.childBtnClickAction) {
            case "Accepted from Email": {
    
              (notificationInfo.item.Approvers).forEach((apvr:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "Review",
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
        
              (notificationInfo.item.Approvers).forEach((n:any) => {
                let notInfo = {
                  name: notificationInfo.name,
                  item: {
                    Templet: "AcceptedFrmMail",
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
                window.location.href = "https://support.bergertechbd.com/pendingtasks";
              }, 30000);
    
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
                window.location.href = "https://support.bergertechbd.com/pendingtasks";
              }, 30000);
    
              break;
            }
            case "ReviewOtherSystemInfo": {
    
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
                window.location.href = "https://support.bergertechbd.com/pendingtasks";
              }, 30000);
    
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
          }
        }
           
      } 
      catch(err){

        reject('Failed');
        console.log("Error: " + err);

      }
    })
    
  }

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
  
  async saveCustApproversItem(detListInfo: any) {    

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

  async createReqTitle(data:any) {
    
    await this.sharepointlistService.updateListItem(data.updatedMstrLstInfo).then((res:any) => { 
      })
      .then((res:any) => {
        if( Object.prototype.hasOwnProperty.call(data, 'processLogListInfo') ){
          this.createProcessLog(data.processLogListInfo);
        }
      })
      .then((res:any) => {
        if( Object.prototype.hasOwnProperty.call(data, 'pendingApprovalListInfo') ){
          this.saveInPendingApvrList(data.pendingApprovalListInfo)
        }
      })
      .then((res:any) => {

        //===========save Attachments start ================
        if( Object.prototype.hasOwnProperty.call(data, 'attachmentListInfo') &&  data.attachmentListInfo.item.length >0 ){
          for(let a=0; a < data.attachmentListInfo.item.length; a++){
            let file = data.attachmentListInfo.item[a];
            let attachmentItem = {
              CustId: file.CustId,
              ActionBy: file.ActionBy,
              ActionDate: new Date()
            };
  
            let attachmentListInfo = {
              name: "customerregistrationattachment",
              item: attachmentItem
            };
  
            this.createAttachment(attachmentListInfo, file.File);
          }
        }
        
        //---------------attachment ends ------------
          
      })
      .then((res:any) => {
        if( Object.prototype.hasOwnProperty.call(data, 'notificationListInfo') ){
          this.saveInNotificationList(data.notificationListInfo);
        }
        
      })
      // .then((res:any) => {
      //   for(let d=0; d < data.updatedDetailLstInfo.item.length; d++){

      //     let detailListInfo = {
      //       name: "CustomerSystemDetails",
      //       item: data.updatedDetailLstInfo.item[d]
      //     };

      //     if(Object.prototype.hasOwnProperty.call(detailListInfo.item, 'rowId')){
      //       delete detailListInfo.item.rowId;
      //       this.saveDetailItem(detailListInfo);
      //     }else{
      //       this.saveDetailItem(detailListInfo);
      //     }          
      //   }
      // })
      .then(()=>{
          this.toastSucAlert( 'success', true, 'A process link is being sent to your email. Please click on Accept through this link for further proceeding !', true);
      }).then(()=>{
        setTimeout(function () {
          window.location.href = "https://support.bergertechbd.com";
        }, 10000);
      });
  }

  //========= update application having uId===
  async updateRequest(data:any) {
    await this.sharepointlistService.updateListItem(data.updatedMstrLstInfo)
      .then(
        (res:any) => {
          if(res == 'Successful'){
            console.log('Update in MstrLstInfo is Successful');
          }else{
            console.log('Update in MstrLstInfo is Failed');
          }
          
        })

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

      if(Object.prototype.hasOwnProperty.call(data, 'notificationListInfo') ){
        await this.saveInNotificationList(data.notificationListInfo)
        .then(
          (res:any) => {
            if(res.ID != ''){
              console.log('Update in EmailNotification List is Successful');
            }else{
              console.log('Update in EmailNotification List is Failed');
            }
            
          }) 
      }       

      if(Object.prototype.hasOwnProperty.call(data, 'updatedDetailLstInfo') && data.updatedDetailLstInfo.item.length > 0){
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

      if(Object.prototype.hasOwnProperty.call(data, 'newDetailLstInfo') && data.newDetailLstInfo.item.length > 0 ){
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

      if(Object.prototype.hasOwnProperty.call(data, 'attachmentListInfo') && data.attachmentListInfo.item.length > 0){
        await this.saveInAttachmentList(data.attachmentListInfo)
        .then(
          (res:any) => {
            console.log('Save in Attachment List is Successful');            
          }) 

          
      }

      setTimeout(()=> {
        this.toastSucAlert( 'success', true, 'Request Approved Successfully !', true);
      }, 1000);

      
      if(Object.prototype.hasOwnProperty.call(data, 'apvrofcustomerListInfo') && data.apvrofcustomerListInfo.item.length > 0 ){
        await this.saveInApvrofcustomerList(data.apvrofcustomerListInfo)
        .then(
          (res:any) => {
            if(res.ID != ''){
              console.log('Save in SystemDetail List is Successful');
            }else{
              console.log('Save in SystemDetail List is Failed');
            }
            
          }) 
      }

      
      setTimeout(function () {
        window.location.href = "https://support.bergertechbd.com/pendingtasks";
        //window.location.href = this.webAbsoluteUrl;
      }, 10000);
      

    
     

  }

  async getBtnClickAction(valFrmChild: any) { }

  async saveInPendingApvrList(pendingListInfo: any) {

    await this.sharepointlistService.saveListItem(pendingListInfo).then(
      (res:any) => {})

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

    
  }
  
  async saveInApvrofcustomerList(itemsData:any) {  
    
    return await new Promise((resolve:any, reject:any)=>{

      try{

        if(itemsData.item.length > 0){
          for(let sd=0; sd < itemsData.item.length; sd++){

            let listInfo = {
              name: itemsData.name,
              item: itemsData.item[sd]
            }; 
            
            this.saveCustApproversItem(listInfo).then((res:any) => {             
              
              if(Object.prototype.hasOwnProperty.call(res, 'ID')){
                resolve(res);
              }else{
                reject('Failed');
              }
            }); 
            
          }
        }else{
          resolve({ID: 0, GUID: "0"});
          console.log('No Item found to update in saveInApvrofcustomerList List');
        }
      } 
      catch(err){
        reject('Failed');
        console.log("Error: " + err);
      }
    })

    
  }

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

    
  }

  async saveInAttachmentList(attachmentListInfo:any) {  
    
    return await new Promise((resolve:any, reject:any)=>{

      try{

        if(attachmentListInfo.item.length > 0){
          for(let a=0; a < attachmentListInfo.item.length; a++){
            let file = attachmentListInfo.item[a];
            let attachmentItem = {
              CustId: file.CustId,
              ActionBy: file.ActionBy,
              ActionDate: new Date()
            };
  
            let attachListInfo = {
              name: "customerregistrationattachment",
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

  async createAttachment(attachmentInfo, file) {

    return new Promise((resolve, reject)=>{
      try{
          this.sharepointlistService.saveListItem(attachmentInfo).then((res) =>{ 
              let fileList ={
                name: "customerregistrationattachment",
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

}

