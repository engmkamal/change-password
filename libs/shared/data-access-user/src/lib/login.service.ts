import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ICustomer } from './customer';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class LoginService {

  absoluteUrl = window.location.origin;  

  private isUserLoggedIn = new BehaviorSubject(false);
  isUserLoggedIn$ = this.isUserLoggedIn.asObservable();
  private _loggedUserInfo$!: Observable<ICustomer> ;

  loogedCustomer!: ICustomer;

  private _userName = '';
  private _customerId = '';

  private _customerInfo = {};

  get customerInfo(){
    return this._customerInfo;
  } 

  
  apiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistration')/items?&$top=200&$select=*`;

  get loggedUserInfo$(){
    return new Promise((resolve:any, reject:any)=>{
      resolve(this._loggedUserInfo$);
      return this._loggedUserInfo$;
    })
    
  }
  
  constructor(
    private _http:HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ){
      // const itemSet = (localStorage.getItem('logedCustId') !== null);

      // if(itemSet){
      //   let ls = localStorage.getItem('logedCustId');
      //   if(ls != "" ){
      
      //     this.reloadCustomerInfo(ls);
  
      //   }else{
      //     this.getAllCustomers().subscribe((res:any)=>{
      //       this.customersList = res.value;
      //     });
      //   }
      // }else{
      //   this.getAllCustomers().subscribe((res:any)=>{
      //     this.customersList = res.value;
      //   });
      // }
  
      


    // //login and fetch profile data
    // this.auth.isAuth.pipe(
    //   switchMap(isAuth => {
    //    if (isAuth) return this.http.getProfile;
    //    return of(undefined)
    //   }))
    //   .subscribe(profile => {
    //     if (profile) { 
    //       this.profile.next(profile))
    //     } else {
    //      // do whatever you want if user is not authorized
    //     }
    //   });
  }  

  getAllCustomers():any{
    // const username:string = 'kamal@bergerbd.com';
    // const password: string = 'Bismillah@Aug22';
    // let headers = new HttpHeaders();

    // headers = headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
    // headers = headers.append('Content-Type', 'application/json');
    // headers = headers.append('cache-control', 'no-cache');
    // headers = headers.append('Access-Control-Allow-Origin', '*');

    //return this._http.get(this.apiUrl,{ headers:headers })

    return this._http.get(`${this.apiUrl}`);
  }

  checkCredentials(customerId:string, password: string, username?: string, ) {    

      let filApiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistration')/items?&$top=200&$select=*&$filter=CustId eq '${customerId}' and CustPassword eq '${password}' `;

      this._http.get(filApiUrl).subscribe((res:any)=>{
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
          };

          localStorage.clear();
          window.localStorage.clear();
  
          localStorage.setItem('logedCustId', lUserInfo.CustId);
          localStorage.setItem('logedCustName', lUserInfo.CustName);
          localStorage.setItem('logedCustEmail', lUserInfo.Cust1stEmail);

          this.loogedCustomer = lUserInfo;
          this._customerInfo = lUserInfo;
  
          this._loggedUserInfo$ = new Observable((observer)=>{
            observer.next(lUserInfo);
          })
  
          this._customerInfo = lUserInfo;
          this._userName = res.value[0].CustName;
          
          
          window.location.href = this.absoluteUrl ;
           
      })
    
  }

  // logout() {
  //   this.isUserLoggedIn.next(false);

  //   let lUserInfo = {
  //     CustId: "",
  //     CustPassword: "",
  //     CustName: "",
  //     CustCompanyName: "",
  //     CustCompany1stAddress: "",
  //     CustCompany2ndAddress: "",
  //     CustCompany3rdAddress: "",
  //     Cust1stEmail: "",
  //     Cust2ndEmail: "",
  //     Cust3rdEmail: "",
  //     Cust1stPhone: "",
  //     Cust2ndPhone: "",
  //     Cust3rdPhone: "",
  //     Cust1stMobile: "",
  //     Cust2ndMobile: "",
  //     Cust3rdMobile: "",
  //     CustDesignation: "",
  //     SecurityQuestion1: "",
  //     SecurityQuestion1Answer: "",
  //     SecurityQuestion2: "",
  //     SecurityQuestion2Answer: "",
  //     SecurityQuestion3: "",
  //     SecurityQuestion3Answer: "",
  //     RegistrationDate: ""
  //   }

  //   this._loggedUserInfo$ = new Observable((observer)=>{
  //     observer.next(lUserInfo);
  //   })
  //   this._userName = '';

  //   localStorage.setItem('logedCustId', "");
  //   localStorage.setItem('logedCustName', "");

  //   localStorage.removeItem('logedCustId');
  //   localStorage.removeItem('logedCustName');
  //   localStorage.clear();
  //   window.localStorage.clear();
  // }

  logout() {
    this.isUserLoggedIn.next(false);

    // localStorage.setItem('logedCustId', "");
    // localStorage.setItem('logedCustName', "");

    // localStorage.removeItem('logedCustId');
    // localStorage.removeItem('logedCustName');
    localStorage.clear();
    window.localStorage.clear();

    window.location.href = this.absoluteUrl + '/login';
  };

  public get userName(): string {
    return this._userName;
  }

  public set userName(user:any) {
    this._userName = user;
  }

  login(customerId:string, password: string): void {
    
    let filApiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistration')/items?&$top=200&$select=*&$filter=CustId eq '${customerId}' and CustPassword eq '${password}' `;

      this._http.get(filApiUrl).subscribe((res:any)=>{
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
  
          localStorage.setItem('logedCustId', lUserInfo.CustId);
          localStorage.setItem('logedCustName', lUserInfo.CustName);
          localStorage.setItem('logedCustEmail', lUserInfo.Cust1stEmail);
          
          this.loogedCustomer = lUserInfo;
          this._customerInfo = lUserInfo;
  
          this._loggedUserInfo$ = new Observable((observer)=>{
            observer.next(lUserInfo);
          })
  
          this._customerInfo = lUserInfo;
          this._userName = res.value[0].CustName.CustName;
      })

    
  }

  async reloadCustomerInfo(customerId:any){

    return await new Promise((resolve:any, reject:any)=>{      

      try{

        let filApiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistration')/items?&$top=200&$select=*&$filter=CustId eq '${customerId}'  `;

      return this._http.get(filApiUrl).subscribe((res:any)=>{

          if(res.value.length > 0){
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
    
            window.localStorage.setItem('logedCustId', lUserInfo.CustId);
            window.localStorage.setItem('logedCustName', lUserInfo.CustName);

            this.loogedCustomer = lUserInfo;
            this._customerInfo = lUserInfo;
    
            this._loggedUserInfo$ = new Observable((observer)=>{
              observer.next(lUserInfo);
            })
    
            this._customerInfo = lUserInfo;
            this._userName = res.value[0].CustName;

            resolve(lUserInfo);
            return (lUserInfo);

          }else{
            reject();
            return ("");
          }
          
        })
        
      } 
      catch(err){

        reject('Retrieve master data failed !');
        console.log("Error: " + err);
        return("");

      }
    })

    
  }

  loginAsEmployee(empEmail:string, password: string): void {
    
    let filApiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('BergerTechEmployeeInformation')/items?&$top=200&$select=*&$filter=EmployeeEmail eq '${empEmail}' `;

      this._http.get(filApiUrl).subscribe((res:any)=>{

        if(res.value.length > 0 ){
          localStorage.clear();
          window.localStorage.clear();
  
          this.isUserLoggedIn.next(true);  
    
          localStorage.setItem('logedEmpEmail', res.value[0].EmployeeEmail);
          localStorage.setItem('logedEmpName', res.value[0].EmployeeName);  

          window.location.href = this.absoluteUrl ;
        }
        
         
      })
    
  };

  

}

