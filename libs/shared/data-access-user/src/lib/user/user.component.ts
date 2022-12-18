import { Component, OnInit } from '@angular/core';
//import { LoginService } from '../login.service';
//import { UserService } from '../user.service';
//import { LoggeduserinfoService } from '../loggeduserinfo.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'portal-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userName = "";

  // get userName(): string {
  //   let custInfo = this.loadCustomerInfo();
  //   if(Object.prototype.hasOwnProperty.call( custInfo, 'CustName' )){
  //     return custInfo['CustName'];
  //   }
  //   else{
  //     return "";
  //   }
    
  // }

  constructor(
    //private userService: UserService,
    //private loginService: LoginService,
    //private LoggeduserinfoService: LoggeduserinfoService,
    private _httpClient: HttpClient) { }

  ngOnInit(): void {
    this.loadCustomerInfo();
    //console.log("UserComponent ngOnInit initialized ");
  };

  async loadCustomerInfo(){
    return new Promise((resolve:any, reject:any)=>{
      const itemSet = (localStorage.getItem('logedCustId') !== null);

      if(itemSet){
        let ls = localStorage.getItem('logedCustId');
        if(ls != "" ){

          let requestorsInfo = {
            CustId: "",
            CustName: "",
            CustCompanyName: "",    
            CustCompany1stAddress: "",
            CustDesignation: "",
            Cust1stEmail: "",
            Cust1stMobile: "",
            RequestDate: ""
          };

          let filApiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('customerregistration')/items?&$top=200&$select=*&$filter=CustId eq '${ls}'  `;

          
          this._httpClient.get(filApiUrl).subscribe((res:any)=>{
            if(res.value.length > 0){
              requestorsInfo = {
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
              this.userName = requestorsInfo.CustName;
              return resolve(requestorsInfo);
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

}
