import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ICustomer } from './customer';
//import {map } from 'rxjs/add/operator/map';


@Injectable({
  providedIn: 'root',
})
export class UserService {

  //webUrl = _spPageContextInfo.webServerRelativeUrl;

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

  
  // customersList:ICustomer[] = [
  //   {
  //     CustId: "1000",
  //     CustPassword: "demo",
  //     CustName: "Mostafa Kamal",
  //     CustCompanyName: "Berger Paints Bangladesh Limited",
  //     CustCompany1stAddress: "Uttara, Dhaka, Bangladesh",
  //     CustCompany2ndAddress: "Uttara, Dhaka, Bangladesh",
  //     CustCompany3rdAddress: "Uttara, Dhaka, Bangladesh",
  //     Cust1stEmail: "kamal@bergertech.com",
  //     Cust2ndEmail: "kamal@bergertech.com",
  //     Cust3rdEmail: "kamal@bergertech.com",
  //     Cust1stPhone: "0191324255310",
  //     Cust2ndPhone: "0191324255310",
  //     Cust3rdPhone: "0191324255310",
  //     Cust1stMobile: "0191324255310",
  //     Cust2ndMobile: "0191324255310",
  //     Cust3rdMobile: "0191324255310",
  //     CustDesignation: "Software Engineer",
  //     SecurityQuestion1: "",
  //     SecurityQuestion1Answer: "",
  //     SecurityQuestion2: "",
  //     SecurityQuestion2Answer: "",
  //     SecurityQuestion3: "",
  //     SecurityQuestion3Answer: "",
  //     RegistrationDate: ""
  //   },
  //   {
  //     CustId: "2000",
  //     CustPassword: "demo",
  //     CustName: "Mostafa Kamal",
  //     CustCompanyName: "Berger Paints Bangladesh Limited",
  //     CustCompany1stAddress: "Berger Paints Bangladesh Limited",
  //     CustCompany2ndAddress: "Berger Paints Bangladesh Limited",
  //     CustCompany3rdAddress: "Berger Paints Bangladesh Limited",
  //     Cust1stEmail: "kamal@bergertech.com",
  //     Cust2ndEmail: "kamal@bergertech.com",
  //     Cust3rdEmail: "kamal@bergertech.com",
  //     Cust1stPhone: "0191324255310",
  //     Cust2ndPhone: "0191324255310",
  //     Cust3rdPhone: "0191324255310",
  //     Cust1stMobile: "0191324255310",
  //     Cust2ndMobile: "0191324255310",
  //     Cust3rdMobile: "0191324255310",
  //     CustDesignation: "Software Engineer",
  //     SecurityQuestion1: "",
  //     SecurityQuestion1Answer: "",
  //     SecurityQuestion2: "",
  //     SecurityQuestion2Answer: "",
  //     SecurityQuestion3: "",
  //     SecurityQuestion3Answer: "",
  //     RegistrationDate: ""
  //   },
  //   {
  //     CustId: "3000",
  //     CustPassword: "demo",
  //     CustName: "Mostafa Kamal",
  //     CustCompanyName: "Berger Paints Bangladesh Limited",
  //     CustCompany1stAddress: "Uttara, Dhaka, Bangladesh",
  //     CustCompany2ndAddress: "Uttara, Dhaka, Bangladesh",
  //     CustCompany3rdAddress: "Uttara, Dhaka, Bangladesh",
  //     Cust1stEmail: "kamal@bergertech.com",
  //     Cust2ndEmail: "kamal@bergertech.com",
  //     Cust3rdEmail: "kamal@bergertech.com",
  //     Cust1stPhone: "0191324255310",
  //     Cust2ndPhone: "0191324255310",
  //     Cust3rdPhone: "0191324255310",
  //     Cust1stMobile: "0191324255310",
  //     Cust2ndMobile: "0191324255310",
  //     Cust3rdMobile: "0191324255310",
  //     CustDesignation: "Software Engineer",
  //     SecurityQuestion1: "",
  //     SecurityQuestion1Answer: "",
  //     SecurityQuestion2: "",
  //     SecurityQuestion2Answer: "",
  //     SecurityQuestion3: "",
  //     SecurityQuestion3Answer: "",
  //     RegistrationDate: ""
  //   }

  // ];

  customersList:ICustomer[] = [];  
  
  apiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistration')/items?&$top=200&$select=*`;

  get loggedUserInfo$(){
    return new Promise((resolve:any, reject:any)=>{
      resolve(this._loggedUserInfo$);
      return this._loggedUserInfo$;
    })
    
  }
  
  constructor(
    private _http:HttpClient
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
    
    // if(this.customersList.length > 0){
    //   this.customersList.forEach(c => {
    //     if (c.CustId === customerId && c.CustPassword === password) {
    //       this.isUserLoggedIn.next(true);        
  
    //       let lUserInfo = {
    //         CustId: c.CustId,
    //         CustPassword: c.CustPassword,
    //         CustName: c.CustName,
    //         CustCompanyName: c.CustCompanyName,
    //         CustCompany1stAddress: c.CustCompany1stAddress,
    //         CustCompany2ndAddress: c.CustCompany2ndAddress,
    //         CustCompany3rdAddress: c.CustCompany3rdAddress,
    //         Cust1stEmail: c.Cust1stEmail,
    //         Cust2ndEmail: c.Cust2ndEmail,
    //         Cust3rdEmail: c.Cust3rdEmail,
    //         Cust1stPhone: c.Cust1stPhone,
    //         Cust2ndPhone: c.Cust2ndPhone,
    //         Cust3rdPhone: c.Cust3rdPhone,
    //         Cust1stMobile: c.Cust1stMobile,
    //         Cust2ndMobile: c.Cust2ndMobile,
    //         Cust3rdMobile: c.Cust3rdMobile,
    //         CustDesignation: c.CustDesignation,
    //         RegistrationDate: c.RegistrationDate,
    //         SystemDetails: c.SystemDetails
    //       }
  
    //       this.loogedCustomer = lUserInfo;
    //       this._customerInfo = lUserInfo;
  
    //       this._loggedUserInfo$ = new Observable((observer)=>{
    //         observer.next(lUserInfo);
    //       })
  
    //       this._customerInfo = c;
    //       this._userName = c.CustName;

    //       localStorage.setItem('logedCustId', c.CustId);
    //       localStorage.setItem('logedCustName', c.CustName);
    //     }
    //   });

    // }else{

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
            RegistrationDate: res.value[0].RegistrationDate,
            SystemDetails: res.value[0].SystemDetails
          }
  
          localStorage.setItem('logedCustId', lUserInfo.CustId);
          localStorage.setItem('logedCustName', lUserInfo.CustName);

          this.loogedCustomer = lUserInfo;
          this._customerInfo = lUserInfo;
  
          this._loggedUserInfo$ = new Observable((observer)=>{
            observer.next(lUserInfo);
          })
  
          this._customerInfo = lUserInfo;
          this._userName = res.value[0].CustName.CustName;
      })

   // }

    
  }

  logout() {
    this.isUserLoggedIn.next(false);

    let lUserInfo = {
      CustId: "",
      CustPassword: "",
      CustName: "",
      CustCompanyName: "",
      CustCompany1stAddress: "",
      CustCompany2ndAddress: "",
      CustCompany3rdAddress: "",
      Cust1stEmail: "",
      Cust2ndEmail: "",
      Cust3rdEmail: "",
      Cust1stPhone: "",
      Cust2ndPhone: "",
      Cust3rdPhone: "",
      Cust1stMobile: "",
      Cust2ndMobile: "",
      Cust3rdMobile: "",
      CustDesignation: "",
      SecurityQuestion1: "",
      SecurityQuestion1Answer: "",
      SecurityQuestion2: "",
      SecurityQuestion2Answer: "",
      SecurityQuestion3: "",
      SecurityQuestion3Answer: "",
      RegistrationDate: ""
    }

    this._loggedUserInfo$ = new Observable((observer)=>{
      observer.next(lUserInfo);
    })
    this._userName = '';

    window.localStorage.clear();
  }

  public get userName(): string {
    return this._userName;
  }

  public set userName(user:any) {
    this._userName = user;
  }

  login(userName: string, customerId:string, password: string): void {
    
    this.customersList.forEach(c => {
      if (c.CustId === customerId && c.CustPassword === password) {
        this.isUserLoggedIn.next(true);        

        let lUserInfo = {
          CustId: c.CustId,
          CustPassword: c.CustPassword,
          CustName: c.CustName,
          CustCompanyName: c.CustCompanyName,
          CustCompany1stAddress: c.CustCompany1stAddress,
          CustCompany2ndAddress: c.CustCompany2ndAddress,
          CustCompany3rdAddress: c.CustCompany3rdAddress,
          Cust1stEmail: c.Cust1stEmail,
          Cust2ndEmail: c.Cust2ndEmail,
          Cust3rdEmail: c.Cust3rdEmail,
          Cust1stPhone: c.Cust1stPhone,
          Cust2ndPhone: c.Cust2ndPhone,
          Cust3rdPhone: c.Cust3rdPhone,
          Cust1stMobile: c.Cust1stMobile,
          Cust2ndMobile: c.Cust2ndMobile,
          Cust3rdMobile: c.Cust3rdMobile,
          CustDesignation: c.CustDesignation,          
          RegistrationDate: c.RegistrationDate,
          SystemDetails: c.SystemDetails
        }

        this._customerInfo = lUserInfo;

        this.loogedCustomer = lUserInfo;

        this._loggedUserInfo$ = new Observable((observer)=>{
          observer.next(lUserInfo);
        })

        this._customerInfo = c;
        this._userName = c.CustName;

        localStorage.setItem('logedCustId', c.CustId);
        localStorage.setItem('logedCustName', c.CustName);
      }
    });

    this._userName = userName;
    this._customerId = customerId;

    
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
              RegistrationDate: res.value[0].RegistrationDate,
              SystemDetails: res.value[0].SystemDetails
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

  

}
