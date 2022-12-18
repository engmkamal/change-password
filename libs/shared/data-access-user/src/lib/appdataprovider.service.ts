import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ISupModel } from './Supportmodel';
//import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppdataproviderService {

  urlOrigin = window.location.origin;

  private isUserLoggedIn = new BehaviorSubject(false);
  isUserLoggedIn$ = this.isUserLoggedIn.asObservable();

  currentAbsoluteUrl = window.location.href;

  supModel:ISupModel = {
    uId: "",
    readMode: "",
    ID: null,
    Title: null,
    Status: null,
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
    RequestorAdId: null,
    sapModules: [],
    otherCategories: []
  };

  

  private _appData = new BehaviorSubject(this.supModel) ;
  appData$ = this._appData.asObservable();



 

  constructor(
    private httpClient: HttpClient,
    //private _loginService: LoginService,
    private router: Router) { }

  
  async getUid(url?:string){
    
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
      if (varCurrentUrlSplitArray.length >= 1) {
        let queryString = varCurrentUrlSplitArray[1];
        let parameters = queryString.split('&');
        for (let i = 0; i < parameters.length; i++) {
          let param = parameters[i];
          if (param.toLowerCase().indexOf('guid=') > -1){
            this.supModel.uId = param.split('=')[1];
            this._appData.next(this.supModel);
        }
          else if (param.toLowerCase().indexOf('mode=') > -1)
            this.supModel.readMode = param.split('=')[1];
        }

        if(this.supModel.uId != ""){ 
          await this.getSupCatResponsibles();
          //await this.getMasterListInfo(this.supModel.uId);
        }else{
          //==============checking login authorization ===========            
          // this.isLoggedIn$
          //   .pipe(distinctUntilChanged())
          //   .subscribe(async (loggedIn) => {
          //     if (!loggedIn) {
          //       this.router.navigate(['/login']);
                
          //     }else if( localStorage.getItem('logedCustId') == null && localStorage.getItem('logedBrgrEmpEmail') == null){
          //       this.router.navigate(['/login']);          
          //     } 
          //     else {
          //       this.router.navigate(['/login']);
          //     }
          //   });  
          //---------------------------
        }
      }
    };


  };

  getSupCatResponsibles(title?:any){

    return new Promise((resolve, reject)=>{
      try{ 
        this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('SupportCategoryResponsibles')/items?&$top=2000&$select=*&$filter=To ge '${new Date().toISOString()}'`) 
        .subscribe(
          (res:any)=>{
            if(res.value.length > 0){                
              
              (res.value).forEach((val:any) => {

                if(val.Category == "SAP"){
                  let sm = {
                    value: val.Modules,
                    viewValue: val.Modules,
                    resName: val.InChargeName,
                    resEmail: val.InChargeEmail
                  };
                  this.supModel.sapModules.push(sm);
                  this._appData.next(this.supModel);
                }else{
                  let om = {
                    value: val.Modules,
                    viewValue: val.Modules,
                    resName: val.InChargeName,
                    resEmail: val.Incharge.Email
                  };
                  this.supModel.otherCategories.push(om);
                  this._appData.next(this.supModel);
                }                  

              })
              
              resolve(this.supModel.sapModules);
              return this.supModel.sapModules;
            }else{
              resolve(this.supModel.sapModules);
              return this.supModel.sapModules;
            }           
            
        })            
      } 
      catch(err){
        reject('Retrieve SupCatResponsibles failed !');
        console.log("Error: " + err);
      }
    })
  };

  getMasterListInfo(guid?:any){
  
    return new Promise((resolve, reject)=>{
      try{

            this.httpClient.get(`https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('supportmaster')/items?&$top=2000&$select=*&$filter=GUID eq '${guid}'`)
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

                this.supModel.AppParameters!.ProblemDescription =                
                {
                  RequestFor: res.value[0].RequestFor,
                  RequestCategory: res.value[0].RequestCategory,
                  Subject: res.value[0].Subject,
                  Description: res.value[0].Description,
                };


                this.supModel.AppParameters!.PriorityInfo =                
                {
                  Priority: res.value[0].Priority,
                  EmergContact: res.value[0].EmergContact,
                  BusinessImpact: res.value[0].BusinessImpact,
                  EmergContactNumber: res.value[0].BusinessImpact,
                  EmergContactEmail: res.value[0].BusinessImpact,
                };

                this.supModel.AppParameters!.Attachments = res.value[0].Attachments;               
                
                this.supModel.AppParameters!.SystemDetail =                
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
                
                

                this.supModel = { 
                  uId: this.supModel.uId,
                  readMode: this.supModel.readMode,
                  ID: res.value[0].ID,
                  Title: res.value[0].Title,
                  Status: res.value[0].Status,
                  PendingTo: JSON.parse(res.value[0].PendingTo),
                  Requestor: this.supModel.Requestor,
                  AppParameters: this.supModel.AppParameters,
                  sapModules: this.supModel.sapModules,
                  otherCategories: this.supModel.otherCategories,
                  OnBehalfOf: res.value[0].OnBehalfOf 
                };

                if(res.value[0].OnBehalfOf){
                  this.supModel.Employee =                
                  {
                    EmpId: res.value[0].EmpId,
                    EmpName: res.value[0].EmpName,
                    EmpCompanyName: res.value[0].EmpCompanyName,
                    EmpCompany1stAddress: res.value[0].EmpCompany1stAddress,
                    Emp1stEmail: res.value[0].Emp1stEmail,
                    Emp1stMobile: res.value[0].Emp1stMobile,
                    EmpDesignation: res.value[0].EmpDesignation
                  };
                  
                  
                }

                this._appData.next(this.supModel);

              resolve(this.supModel);
              return this.supModel;
            })            
      } 
      catch(err){
        reject('Retrieve master data failed as on AppDataService!');
        console.log("Error: " + err);
      }
    })
  };

  login(customerId:string, password: string): void {
    
    let filApiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistration')/items?&$top=200&$select=*&$filter=CustId eq '${customerId}' and CustPassword eq '${password}' `;

      this.httpClient.get(filApiUrl).subscribe((res:any)=>{
        this.isUserLoggedIn.next(true);  
  
        localStorage.setItem('logedCustId', res.value[0].CustId);
        localStorage.setItem('logedCustName', res.value[0].CustName);  
        
        window.location.href = this.urlOrigin;
      })
    
  };

  loginAsEmployee(empEmail:string, password: string): void {
    
    let filApiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('BergerTechEmployeeInformation')/items?&$top=200&$select=*&$filter=EmployeeEmail eq '${empEmail}' `;

      this.httpClient.get(filApiUrl).subscribe((res:any)=>{

        localStorage.clear();
        window.localStorage.clear();

        this.isUserLoggedIn.next(true);  
  
        localStorage.setItem('logedEmpEmail', res.value[0].EmployeeEmail);
        localStorage.setItem('logedEmpName', res.value[0].EmployeeName);  
         
        window.location.href = this.urlOrigin;
      })
    
  };

  checkCredentials2(customerId:string, password: string, username?: string ) {    

    let filApiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistration')/items?&$top=200&$select=*&$filter=CustId eq '${customerId}' and CustPassword eq '${password}' `;

    this.httpClient.get(filApiUrl).subscribe((res:any)=>{

      if(res.value.length > 0 ){
        localStorage.removeItem('logedCustId');
        localStorage.removeItem('logedCustName');
  
        localStorage.clear();
        window.localStorage.clear();
  
        this.isUserLoggedIn.next(true);        
  
          let lUserInfo = {
            CustId: res.value[0].CustId,
            CustPassword: res.value[0].CustPassword,
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
            RegistrationDate: res.value[0].RegistrationDate
          }
  
          localStorage.setItem('logedCustId', res.value[0].CustId);
          localStorage.setItem('logedCustName', res.res.value[0].CustName);        
          window.location.href = this.urlOrigin;
          //this.router.navigate(['./']); 
      }else{
        alert("Login Failed !");
      }

      
    })
  
  };

  logout() {
    this.isUserLoggedIn.next(false);

    // localStorage.setItem('logedCustId', "");
    // localStorage.setItem('logedCustName', "");

    // localStorage.removeItem('logedCustId');
    // localStorage.removeItem('logedCustName');
    localStorage.clear();
    window.localStorage.clear();

    window.location.href = this.urlOrigin + '/login';
  };


  logoutAsEmployee() {
    this.isUserLoggedIn.next(false);

    // localStorage.setItem('logedEmpEmail', "");
    // localStorage.setItem('logedEmpName', "");

    // localStorage.removeItem('logedEmpEmail');
    // localStorage.removeItem('logedEmpName');
    localStorage.clear();
    window.localStorage.clear();

    window.location.href = this.urlOrigin + '/login';
  };


  checkCredentials(customerId:string, password: string, username?: string, ) {    

    let filApiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistration')/items?&$top=200&$select=*&$filter=CustId eq '${customerId}' and CustPassword eq '${password}' `;

    this.httpClient.get(filApiUrl).subscribe((res:any)=>{
      this.isUserLoggedIn.next(true);        

        // let lUserInfo = {
        //   CustId: res.value[0].CustId,
        //   CustPassword: res.value[0].CustPassword,
        //   CustName: res.value[0].CustName,
        //   CustCompanyName: res.value[0].CustCompanyName,
        //   CustCompany1stAddress: res.value[0].CustCompany1stAddress,
        //   CustCompany2ndAddress: res.value[0].CustCompany2ndAddress,
        //   CustCompany3rdAddress: res.value[0].CustCompany3rdAddress,
        //   Cust1stEmail: res.value[0].Cust1stEmail,
        //   Cust2ndEmail: res.value[0].Cust2ndEmail,
        //   Cust3rdEmail: res.value[0].Cust3rdEmail,
        //   Cust1stPhone: res.value[0].Cust1stPhone,
        //   Cust2ndPhone: res.value[0].Cust2ndPhone,
        //   Cust3rdPhone: res.value[0].Cust3rdPhone,
        //   Cust1stMobile: res.value[0].Cust1stMobile,
        //   Cust2ndMobile: res.value[0].Cust2ndMobile,
        //   Cust3rdMobile: res.value[0].Cust3rdMobile,
        //   CustDesignation: res.value[0].CustDesignation,
        //   RegistrationDate: res.value[0].RegistrationDate
        // }

        // localStorage.setItem('logedCustId', lUserInfo.CustId);
        // localStorage.setItem('logedCustName', lUserInfo.CustName);

        // this.loogedCustomer = lUserInfo;
        // this._customerInfo = lUserInfo;

        // this._loggedUserInfo$ = new Observable((observer)=>{
        //   observer.next(lUserInfo);
        // })

        // this._customerInfo = lUserInfo;
        // this._userName = res.value[0].CustName;

        window.location.href = this.urlOrigin;
        //this.router.navigate(['./']); 
    })
  
}

  




}
