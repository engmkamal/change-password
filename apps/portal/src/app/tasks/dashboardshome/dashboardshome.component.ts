import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
//import { dashboardsListsInfo } from '../../../assets/dashboardslistsinfo';
import { SharepointlistService } from '@portal/core';

@Component({
  selector: 'portal-dashboardshome',
  templateUrl: './dashboardshome.component.html',
  styleUrls: ['./dashboardshome.component.scss'],
})
export class DashboardshomeComponent implements OnInit {
  panelOpenState = false
  //dashboardsListsInfo:any;

  //allWf = dashboardsListsInfo;

  allWf:any;
  myApprovalWf:any = [];

  public webAbsoluteUrl = window.location.origin;
  //public webAbsoluteUrl = "https://portal.bergerbd.com/leaveauto";

  private logedInUser = { 
    aDId: 0,
    name: "",
    email: "",
    empID: "",
    office: "",
    access: "NoAccess"
  };

  constructor(
    private _router:Router,
    private httpClient: HttpClient,
    private sharepointlistService: SharepointlistService
    ) { }
    
    
    async getRowItem(){

      return new Promise((resolve, reject)=>{
        this.allWf.forEach((i:any) => {
  
          const detListname = i.ApprovalListInfo[0].name;
          const detSelQry = i.ApprovalListInfo[0].select;
          let detApiUrl = `https://portal.bergerbd.com/leaveauto/_api/web/lists/getByTitle('${detListname}')/items?&$top=2&$select=${detSelQry}&$filter=Author/ID eq '${this.logedInUser.aDId}' `; 
                    
          this.httpClient.get(detApiUrl).subscribe((wf:any) =>{
  
            if(wf.value.length >0){
              this.myApprovalWf.push(i);
            }
                     
          })          
          
        });
      })
    }
    
    
    //==== get loged user info===
    async getUserInfo(){
      return new Promise((resolve, reject)=>{ 
        this.sharepointlistService.getEmpIdNdOffice().then((res:any)=>{
          this.logedInUser.aDId = res.ADId;
          this.logedInUser.empID = res.EmpID;
          this.logedInUser.office = res.Office;
          resolve(this.logedInUser);
        })
      })
    }

    async executeOnInitProcesses(){    
      try{
        await this.getUserInfo();
        await this.getRowItem();
      } 
      catch(err){
        console.log("Error: " + err)
      }
    }

    async ngOnInit() {
      const dbListsInfoUrl = "https://portal.bergerbd.com/Style Library/myapproval/V1/assets/myApprovedWF.ts";
      //const dbListsInfoUrl = "http://localhost:4211/assets/myApprovedWF.ts";
      this.httpClient.get(dbListsInfoUrl).subscribe((data:any) =>{
        this.allWf = data;
        if(this.allWf.length >0){
          this.executeOnInitProcesses();   
        }else{
          alert("Fetching List info failed !");
        }
      });       
    }

  // ngOnInit(): void {
  //   const dbListsInfoUrl = "https://portal.bergerbd.com/Style Library/pendingtasks/V2/assets/myApprovedWF.ts";
  //   //const dbListsInfoUrl = "http://localhost:4211/assets/myApprovedWF.ts";
  //   this.httpClient.get(dbListsInfoUrl).subscribe((data:any) =>{
  //     //this.allWf = data;      
  //   })    
  // }

  trackByFnMenu(index:number, wf:any){
    return wf.WfName;
  }
  //========for passing url link while click on each Menu/Tiles ============
  editButtonClick(wf:any){
    this._router.navigate(['/admin', wf])
  }

}

