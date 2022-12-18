import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { 
  from, observable, Observable, of, Subject, pipe,
  groupBy, tap, mergeMap, reduce, map, filter, catchError
} from 'rxjs';
import * as pnp from "sp-pnp-js";

//import { groupBy, tap, mergeMap, reduce, map, filter, catchError } from 'rxjs/operators';
import { GroupedObservable } from 'rxjs/internal/operators/groupBy';
//import { ISPList, IValueItems, IMyProcessItems, IUserAccess, AuthorItems, DashboardUsers} from "../../list-interface";
//import { IItemAddResult } from "../../../../node_modules/@pnp/sp/items";

interface Workflow {
  Title: string; 
  ProcessName: string; 
  RequestedByName:string; 
  Status:string;
}
interface WorkflowGroup{
  key: string;
  value: Array<Workflow>;
}

@Injectable({
  providedIn: 'root'
})
export class SharepointlistService {  
  
  public webAbsoluteUrl = "https://bergerpaintsbd.sharepoint.com/sites/BergerTech"; //uncomment for localhost //PendingApproval
  public apiUrl = "https://bergerpaintsbd.sharepoint.com/sites/BergerTech"; //uncomment for localhost //PendingApproval
  //public webAbsoluteUrl = window.location.origin + "/leaveauto";

  //public webAbsoluteUrl = "https://portal.bergerbd.com/leaveauto"; //uncomment for localhost //PendingApproval
  //public apiUrl = "https://portal.bergerbd.com"; //uncomment for localhost //PendingApproval
  
  httpGetHeaders = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Origin', 'https://www.bergertechbd.com')
    .set('Vary', 'Origin')
    .set('crossDomain', 'true');
  
  private getConfigInfo(){
    const mySP = pnp.sp.configure({
      headers:{
        "Accept": "application/json; odata=verbose"
      }
    }, this.webAbsoluteUrl);
    //console.log("Returned config: "+ mySP);
    return mySP;
  }; 
  
  private getApiConfigInfo(){
    const mySP = pnp.sp.configure({
      headers:{
        "Accept": "application/json; odata=verbose"
      }
    }, this.apiUrl);
    //console.log("Returned config: "+ mySP);
    return mySP;
  }; 



  constructor(private http: HttpClient) { }

  

  async getSPLoggedInUser():Promise<any>{   
    let userADId;
    const apiUrl = this.webAbsoluteUrl + "/_api/web/currentuser?$expand=Groups"; 
    

    await this.http
        .get(apiUrl, {"headers": this.httpGetHeaders})
        .toPromise()
        .then(
        (res) => {
          userADId = JSON.parse(JSON.stringify(res)).Id;
          }            
          ).catch(
            (res)=>{
              const sringify = JSON.stringify(res);
              userADId = "";
            }
          );
    return Number(userADId);
    //return +userADId; 
  }

  async getEmpIdNdOffice(user?:any):Promise<any>{
    const logedUser = {
      Office: "",
      EmpID:"",
      ADId: 0,
      //Access:user.Access,
    }
    const userADId = Number(await this.getSPLoggedInUser());  
    
    logedUser.ADId = userADId;
    
      //let apiUrl = "https://portaldv.bergerbd.com/leaveauto/_api/web/lists/getByTitle('BergerEmployeeInformation')/items?&$top=2000000&$select=EmployeeName,Email/ID,Email/Title,Email/EMail,OptManagerEmail/ID,OptManagerEmail/Title,DeptID,EmployeeId,EmployeeGrade,Department,Designation,OfficeLocation,Mobile,CostCenter,CompanyCode&$expand=Email/ID,OptManagerEmail/ID&$filter=Email/ID eq 1026"
      const apiUrl = this.webAbsoluteUrl + "/_api/web/lists/getByTitle('BergerEmployeeInformation')/items?&$top=2000000&$select=EmployeeName,Email/ID,Email/Title,Email/EMail,OptManagerEmail/ID,OptManagerEmail/Title,DeptID,EmployeeId,EmployeeGrade,Department,Designation,OfficeLocation,Mobile,CostCenter,CompanyCode&$expand=Email/ID,OptManagerEmail/ID&$filter=Email/ID eq '"+userADId+"'"; 
        await this.http
            .get(apiUrl, {"headers": this.httpGetHeaders})
            .toPromise()
            .then(
            (res) => {
              const sringify = JSON.stringify(res);
              const parse = JSON.parse(sringify);
              logedUser.Office = parse.value[0].OfficeLocation;
              logedUser.EmpID = parse.value[0].EmployeeId;

              console.log("Loged user's Office Location : " + logedUser.Office +"; Emp ID: "+ logedUser.EmpID);
              //alert("Loged user's OfficeLocation: " + parse.value[0].OfficeLocation +"; Emp ID: "+ parse.value[0].EmployeeId);
              }            
              )
              .catch(
                (res)=>{
                  const sringify = JSON.stringify(res);
                  if(userADId == 1026){
                    logedUser.Office = "Corporate";
                    logedUser.EmpID = "000";
                  }else{
                    logedUser.Office = "";
                    logedUser.EmpID = "";
                    //logedUser.Access = user.Access;
                  }
                }
              );
    
    return logedUser;
  }

  async getEmpIdNdAllInfo(user?:any):Promise<any>{
    const logedUser = {
      EmployeeName: "",
      Office: "",
      EmpID:"",
      ADId: 0,
      Email: ""
      //Access:user.Access,
    }
    const userADId = Number(await this.getSPLoggedInUser());  
    
    logedUser.ADId = userADId;
    
      //let apiUrl = "https://portaldv.bergerbd.com/leaveauto/_api/web/lists/getByTitle('BergerEmployeeInformation')/items?&$top=2000000&$select=EmployeeName,Email/ID,Email/Title,Email/EMail,OptManagerEmail/ID,OptManagerEmail/Title,DeptID,EmployeeId,EmployeeGrade,Department,Designation,OfficeLocation,Mobile,CostCenter,CompanyCode&$expand=Email/ID,OptManagerEmail/ID&$filter=Email/ID eq 1026"
      const apiUrl = this.webAbsoluteUrl + "/_api/web/lists/getByTitle('BergerEmployeeInformation')/items?&$top=2000000&$select=EmployeeName,Email/ID,Email/Title,Email/EMail,OptManagerEmail/ID,OptManagerEmail/Title,DeptID,EmployeeId,EmployeeGrade,Department,Designation,OfficeLocation,Mobile,CostCenter,CompanyCode&$expand=Email/ID,OptManagerEmail/ID&$filter=Email/ID eq '"+userADId+"'"; 
        await this.http
            .get(apiUrl, {"headers": this.httpGetHeaders})
            .toPromise()
            .then(
            (res) => {
              const sringify = JSON.stringify(res);
              const parse = JSON.parse(sringify);
              logedUser.Office = parse.value[0].OfficeLocation;
              logedUser.EmpID = parse.value[0].EmployeeId;
              logedUser.EmployeeName = parse.value[0].EmployeeName;
              logedUser.Email = parse.value[0].Email.EMail;

              console.log("Loged user's Office Location : " + logedUser.Office +"; Emp ID: "+ logedUser.EmpID);
              //alert("Loged user's OfficeLocation: " + parse.value[0].OfficeLocation +"; Emp ID: "+ parse.value[0].EmployeeId);
              }            
              )
              .catch(
                (res)=>{
                  const sringify = JSON.stringify(res);
                  if(userADId == 1026){
                    logedUser.Office = "Corporate";
                    logedUser.EmpID = "000";
                  }else{
                    logedUser.Office = "";
                    logedUser.EmpID = "";
                    //logedUser.Access = user.Access;
                  }
                }
              );
    
    return logedUser;
  }

  // async getLoggedInUsersProcess(){   
  //   const user = {
  //     ADId:0,
  //     Access:"",
  //     Office: "",
  //     EmpID:"",
  //     Locations:[],        
  //   }
    
  //   user.ADId = await this.getSPLoggedInUser();
    
  //   const apiUrl = this.webAbsoluteUrl + "/_api/web/lists/getByTitle('PendingApproval')/items?&$top=2000&$select=Title,ProcessName,Status,RequestLink,Modified,Created,PendingWith/ID,PendingWith/Title,Author/ID,Author/Title&$expand=Author,PendingWith&$filter=Author/ID eq '"+Number(user.ADId)+"'&$orderby=ProcessName asc"; 
  //   let items;
  //   const data:IMyProcessItems[] = []; 
  //   await this.http
  //       .get(apiUrl)
  //       .toPromise()
  //       .then(
  //       //.subscribe(
  //       (res) => {
  //         items = JSON.parse(JSON.stringify(res));
  //         let pWith;
  //         for(let i = 0; i< items.value.length; i++){
  //           if(items.value[i].PendingWith != undefined){
  //               pWith = items.value[i].PendingWith[0].Title;
  //           }
  //           const eachItem:IMyProcessItems = {
  //             Title: items.value[i].Title,
  //             ProcessName: items.value[i].ProcessName,
  //             Author: items.value[i].Author,
  //             Status: items.value[i].Status,              
  //             PendingWith: pWith,
  //             Created: items.value[i].Created,
  //             Modified: items.value[i].Modified,
  //             RequestLink: items.value[i].RequestLink
  //           }

            
  //           data.push(eachItem);
  //         }
  //         }            
  //         ).catch(
  //           (res)=>{
  //             const sringify = JSON.stringify(res);
  //           }
  //         );
  //   return data; 
  // }

  //========= for all dashboards start ==========
  // async getLoggedInUsersDashboards(){   
  //   const user = {
  //     ADId:0,
  //     Access:"",
  //     Office: "",
  //     EmpID:"",
  //     Locations:[],        
  //   }
    
  //   //user.ADId = await this.getSPLoggedInUser();  // activate and implement for user access on dashboards
    
  //   const apiUrl = this.webAbsoluteUrl + "/_api/web/lists/getByTitle('PendingApproval')/items?&$top=2000&$select=Title,ProcessName,Status,RequestLink,Modified,Created,PendingWith/ID,PendingWith/Title,Author/ID,Author/Title&$expand=Author,PendingWith&$orderby=ProcessName asc"; 
  //   let items;
  //   const data:IMyProcessItems[] = []; 
  //   await this.http
  //       .get(apiUrl)
  //       .toPromise()
  //       .then(
  //       //.subscribe(
  //       (res) => {
  //         items = JSON.parse(JSON.stringify(res));
  //         let pWith;
  //         for(let i = 0; i< items.value.length; i++){
  //           if(items.value[i].PendingWith != undefined){
  //               pWith = items.value[i].PendingWith[0].Title;
  //           }
  //           const eachItem:IMyProcessItems = {
  //             Title: items.value[i].Title,
  //             ProcessName: items.value[i].ProcessName,
  //             Author: items.value[i].Author,
  //             Status: items.value[i].Status,              
  //             PendingWith: pWith,
  //             Created: items.value[i].Created,
  //             Modified: items.value[i].Modified,
  //             RequestLink: items.value[i].RequestLink
  //           }

            
  //           data.push(eachItem);
  //         }
  //         }            
  //         ).catch(
  //           (res)=>{
  //             const sringify = JSON.stringify(res);
  //           }
  //         );
  //   return data; 
  // }
  //-----------for all dashbboards ends ---------
  public async getUsersWFMasterListItems(list?: any, user?: any):Promise<any>{
    //let userADId = user;
    let data:any;
    //const data = 
    await from(this.getConfigInfo().web
          .lists.getByTitle(list.name) 
          .items.select(list.query)
          .expand('Author') 
          //.expand('PendingWith', 'Author')             
          //.filter("Author/ID eq '"+Number(userADId)+"'")          
          .orderBy('Created', false)
          .top(20000)   
          .get()
          .then((r:any)=>{
            data = r;
            return data;
          })          
          );
    return data;
          //console.log("Fetched data by getLoggedUsersWFMasterListItems: "+ JSON.stringify(data));
        


    // if(user.Office == "Corporate"){
    //   let data;
    //     data = 
    //     from(this.getConfigInfo().web
    //       .lists.getByTitle(list.name) 
    //       .items.select(list.query)
    //       //.expand('Author') 
    //       //.expand('PendingWith', 'Author')             
    //       //.filter("Author/ID eq '"+Number(userADId)+"'")          
    //       .orderBy('Created', false)
    //       .top(20000)   
    //       .get()          
    //       );
    //       //console.log("Fetched data by getLoggedUsersWFMasterListItems: "+ JSON.stringify(data));
    //     return data;
    // }
    // else {
    //   let data;
    //     data = 
    //     from(this.getConfigInfo().web
    //       .lists.getByTitle(list.name)
    //       .items
    //       //.filter("Status eq 'Submitted'")
    //       //.filter("Author/Office eq 'Corporate (9000)'")
    //       //.filter(`substringof('Corporate' ,Author/Office)`)
    //       .expand('Author')
    //       //.expand('PendingWith', 'Author')
    //       .orderBy('Created', false)
    //       .select(list.query)           
    //       //.filter("Author/ID eq '"+Number(userADId)+"'")
    //       .top(100)   
    //       .get()         
    //       );
    //       console.log("Fetched data by getLoggedUsersWFMasterListItems: "+ JSON.stringify(data));
    //     return data;
    // }
     
  }

  public async getUsersWFMasterFewListItems(list?: any, user?: any):Promise<any>{
    const userADId = user;
    if(user.Office == "Corporate"){
      let data:any;
      await from(this.getConfigInfo().web
          .lists.getByTitle(list.name) 
          .items
          .orderBy('Created', false)
          .select(list.query)
          .expand('PendingWith', 'Author')              
          //.filter("Author/ID eq '"+Number(userADId)+"'")         
          .top(100)   
          .get()
          .then((r:any)=>{
            data = r;
            return data;
          })          
          );
          //console.log("Fetched data by getLoggedUsersWFMasterListItems: "+ JSON.stringify(data));
        return data;
    }
    else {
      let data:any;
      await from(this.getConfigInfo().web
          .lists.getByTitle(list.name)
          .items
          .orderBy('Created', false)
          .filter("substringof('"+ user.Office +"' ,Author/Office)")
          .expand('PendingWith', 'Author')         
          .select(list.query)           
          //.filter("Author/ID eq '"+Number(userADId)+"'")
          .top(100)   
          .get() 
          .then((r:any)=>{
            data = r;
            return data;
          })         
          );
          console.log("Fetched data by getLoggedUsersWFMasterListItems: "+ JSON.stringify(data));
        return data;
    }
     
  }

  public async getUsersTMMasterListItems(list?: any, user?: any):Promise<any>{
    let data:any;    
      const uempID = user;
      await from(this.getConfigInfo().web
        .lists.getByTitle(list.name) 
        .items.select('ID','RequestID','RequestorEmployeeID','RequestorName','RequestorLocation','RequestorBusinessArea','RequestorCostCenter','Division','MerchandizingType','RequestorEmail','Author/Title','RequestStatus','ApprovalStatus','PendingTo','Created','VendorName','VendorCode','VendorAddress','VendorEmail','VendorStatus','TotalAmount','GUID','Modified')  
        .filter("RequestorEmployeeID eq '"+uempID+"'")
        .expand('Author')
        .orderBy('Created', false)
        .top(200000)        
        .get()
        .then((r:any)=>{
          data = r;
          return data;
        })          
         );
        //console.log("Fetched data by ListWithSppnpjs Service: "+ JSON.stringify(data));
      return data;      
    
  }

  public async getUsersWFOldMasterListItems(list?: any, user?: any):Promise<any>{
    let data:any;    
      const uempID = user;
      await from(this.getConfigInfo().web
        .lists.getByTitle(list.name) 
        .items.select(list.query)  
        .filter("RequestorEmployeeID eq '"+uempID+"'")
        .expand(list.expand)
        .orderBy('Created', false)
        .top(200000)        
        .get() 
        .then((r:any)=>{
          data = r;
          return data;
        })         
         );
        //console.log("Fetched data by getUsersWFOldMasterListItems Service: "+ JSON.stringify(data));
      return data;
  }


  async getGroupedListItems(){
    //let all = this.workflows$;
    let group:any[];

    const all = await this.getMasterListItems();
    const allReq = await JSON.parse(JSON.stringify(all));
    
    await allReq
      .pipe(
        groupBy((workflow: Workflow) => workflow.ProcessName),
        // tap(console.log)
        mergeMap((workflowsGroup$: GroupedObservable<string, Workflow>) =>
          workflowsGroup$.pipe(
            reduce((acc: Array<Workflow>, cur: Workflow) => [...acc, cur], []),
            map((arr: Array<Workflow>) => {
              return {
                key: arr[0].ProcessName,
                value: [...arr]
              };
            }),
            tap((data: WorkflowGroup) => {group.push(data); console.log(data); console.log(group.length)})
          )
        )
      )
      .subscribe(()=>{
        const data = {
          all: allReq,
          grouped: group,
        }
        return data;
      });

      
  }

  public async getMasterListItemsWithParam(list?: any, user?: any){
    let data:any;
      await from(this.getConfigInfo().web
        .lists.getByTitle("PendingApproval") 
        .items.select('ID','Title','ProcessName','RequestedByName','Status','EmployeeID','RequestedByEmail','RequestLink','GUID','Modified','Created','PendingWith/ID','PendingWith/Title','Author/ID','Author/Title')  //,'Author/ID','Author/Title','Author/Office','PendingWith/ID','PendingWith/Title',
        //.expand('Author', 'PendingWith')
        .expand('PendingWith', 'Author')
        .orderBy('Created', false)
        .top(200000)        
        .get()          
         );
        //console.log("Fetched data by SharepointlistService: "+ JSON.stringify(data));
      return data; 
  }

  public async getMasterListItems(){
    let data:any;
      await from(this.getConfigInfo().web
        .lists.getByTitle("PendingApproval") 
        .items.select('ID','Title','ProcessName','RequestedByName','Status','EmployeeID','RequestedByEmail','RequestLink','GUID','Modified','Created','PendingWith/ID','PendingWith/Title','Author/ID','Author/Title')  //,'Author/ID','Author/Title','Author/Office','PendingWith/ID','PendingWith/Title',
        //.expand('Author', 'PendingWith')
        .expand('PendingWith', 'Author')
        .orderBy('Created', false)
        .top(200000)        
        .get()          
         );
        //console.log("Fetched data by SharepointlistService: "+ JSON.stringify(data));
      return data; 
  }





  //=============== only this generic method is being used for Emp Reimbursement & other Dashboards to fetch data =========
  public async fetchListItems(list?: any, user?: any):Promise<any>{
    const userADId = user;
        
    let data:any;
      await from(this.getConfigInfo().web.lists
        .getByTitle(list.name) 
        .items.select(list.select)
        .expand(list.expand)
        //.expand('PendingWith', 'Author') 
        //.filter(list.filter)
        //.filter("substringof('"+ user.Office +"' ,Author/Office)")            
        //.filter("Author/ID eq '"+Number(userADId)+"'")
        .orderBy('Created', false)
        .top(list.top) 
        .get()          
        );        
          //console.log("Fetched data by fetchListItems service: "+ JSON.stringify(data));
        return data;
  }

  //=============== only this generic method is being used for Dashboard to fetch data =========
  public async fetchListItemsWithFilterExpand(list?: any, user?: any):Promise<any>{
    const userADId = user;
        
    let data:any;
      await from(this.getConfigInfo().web.lists
        .getByTitle(list.name) 
        .items.select(list.select)
        .expand(list.expand)
        .filter(list.filterBy+" eq '"+list.filterWith+"'" )
        //.filter(list.filter)
        //.filter("substringof('"+ user.Office +"' ,Author/Office)")            
        //.filter("Author/ID eq '"+Number(userADId)+"'")
        .orderBy('Created', false)
        .top(list.top) 
        .get()          
        );        
        console.log("ConfigInfo: "+ JSON.stringify(data));
        return data;
  }

  //=============== only this generic method is being used for Dashboard to fetch data =========
  public async fetchListItemsWith3NdFilterExpand(list?: any, user?: any):Promise<any>{
    const userADId = user;
        
    let data:any;
      await from(this.getConfigInfo().web.lists
        .getByTitle(list.name) 
        .items.select(list.select)
        .expand(list.expand)
        .filter(`(${list.filterBy} eq '${list.filterWith}') and (IsAdjusted eq 'No') and (Status eq 'CashOfficerProcessed' or Status eq 'CompletedAsTravel')`)        
        .orderBy('Created', false)
        .top(list.top) 
        .get()          
        );        
          //console.log("Fetched data by fetchListItems service: "+ JSON.stringify(data));
        return data;
  }


  //=============== only this generic method is being used for dynamic Dashboards to fetch data =========
  public async fetchListItemWithExpStFilOrd(list?: any, user?: any):  Promise<any>{
    const userADId = user;    
       
    let data;
    try {  
      data = 
        from(this.getConfigInfo().web.lists
        .getByTitle(list.name)
        .items.select(list.select)
        .expand(list.expand)
        .filter(list.filter) 
        .orderBy(list.orderByPrm, list.orderByVal)
        .top(list.top)
        .get());        
          //console.log("Fetched data by fetchListItems service: "+ JSON.stringify(data));
        return data;
    } catch(e) {
      console.log(e); 
    }
      
  }


  public getDataFrmLocSer(urn: string){

    return this.http.get(urn);
  }


  

  //=========get logged user Email================
  async getSPLoggedInUserEmail():Promise<any>{   
    let userADEmail;
    const apiUrl = this.webAbsoluteUrl + "/_api/web/currentuser?$expand=Groups"; 
    await this.http
        .get(apiUrl)
        .toPromise()
        .then(
        (res) => {
          userADEmail = JSON.parse(JSON.stringify(res)).Email;
          }            
          ).catch(
            (res)=>{
              const sringify = JSON.stringify(res);
              userADEmail = "";
            }
          );
    //return Number(userADId);
    return userADEmail; 
  }

  //=========fetching list items with filter (filter by ADId)options ================
  public getItemsWithFilterExpand(list?: any, user?: any):Promise<any>{
    const userADId = user; 
     
      return this.getConfigInfo().web.lists
        .getByTitle(list.name) 
        .items.select(list.select)
        .expand(list.expand)
        //.filter("substringof('"+ user.Office +"' ,Author/Office)")            
        .filter(list.filterBy+" eq '"+Number(userADId)+"'")
        .orderBy('Created', false)
        .top(Number(list.top))  
        .get()
        .then()
        .catch((rej)=>{
          console.log(rej.message);
        })         
        //);        
          //console.log("Fetched data by getItemsWithFilterExpand service: "+ JSON.stringify(data));
        
  }

   //=========fetching list items with filter (filter by ADId)options ================
   public getItemWithAnyFilterExpand(list?: any, user?: any):Promise<any>{
    let userADId = user; 
    let data:any;
      data = 
        from(this.getConfigInfo().web.lists
        .getByTitle(list.name) 
        .items.select(list.select)
        .expand(list.expand)
        //.filter("substringof('"+ user.Office +"' ,Author/Office)")            
        .filter(list.filterBy+" eq '"+list.filterWith+"'")
        .orderBy('Created', false)
        .top(Number(list.top))  
        .get()          
        );        
          //console.log("Fetched data by getItemsWithFilterExpand service: "+ JSON.stringify(data));
        return data;
  }

  //=========fetching list items with filter (filter by ADEmail)options ================
  // public getItemsWithEmailFilter(list?: any, userEmail?: any):Promise<any>{
  //   //userEmail = "shoaib@bergerbd.com"; //should be comment out for production
  //   let data;
  //     data = 
  //       from(this.getConfigInfo().web.lists
  //       .getByTitle(list.name) 
  //       .items.select(list.select)
  //       .filter(list.filterBy+" eq '"+userEmail+"'")
  //       .orderBy('Created', false)
  //       .top(Number(list.top))  
  //       .get()          
  //       );        
  //         //console.log("Fetched data by getItemsWithFilterExpand service: "+ JSON.stringify(data));
  //       return data;
  // }

  //=========fetching list items without filter options ================
  // public getItemsWithoutFilter(list?: any, user?: any):Promise<any>{
  //   let userADId = user;
        
  //   let data;
  //     data = 
  //       from(this.getConfigInfo().web.lists
  //       .getByTitle(list.name) 
  //       .items.select(list.select)
  //       .expand(list.expand)
  //       //.filter("substringof('"+ user.Office +"' ,Author/Office)")
  //       //.filter(list.filterBy+" eq '"+Number(userADId)+"'")
  //       .orderBy('Created', false)
  //       .top(list.top) 
  //       .get()          
  //       );        
  //         //console.log("Fetched data by fetchListItems service: "+ JSON.stringify(data));
  //       return data;
  // }

  

  //=========fetching list items with Substring filter options ================
  // public getItemsWithFilterSubstringExpand(list?: any, user?: any):Promise<any>{
  //   let userADId = user; 
  //   let data;
  //     data = 
  //       from(this.getConfigInfo().web.lists
  //       .getByTitle(list.name) 
  //       .items.select(list.select)
  //       .expand(list.expand)
  //       .filter("substringof('"+ user.Office +"' ,"+ list.filterBy +')"')
  //       //.filter("substringof('"+ user.Office +"' ,Author/Office)") 
  //       .orderBy('Created', false)
  //       .top(Number(list.top))  
  //       .get()          
  //       );        
  //         //console.log("Fetched data by getItemsWithFilterSubstringExpand service: "+ JSON.stringify(data));
  //       return data;
  // }

  //=========fetching list items without filter options ================
  // public getItemsWithoutExpandFilter(list?: any, user?: any):Promise<any>{
  //   let userADId = user;
        
  //   let data;
  //     data = 
  //       from(this.getConfigInfo().web.lists
  //       .getByTitle(list.name) 
  //       .items.select(list.select)
  //       //.expand(list.expand)
  //       //.filter("substringof('"+ user.Office +"' ,Author/Office)")
  //       //.filter(list.filterBy+" eq '"+Number(userADId)+"'")
  //       .orderBy('Created', false)
  //       .top(list.top) 
  //       .get()          
  //       );        
  //         //console.log("Fetched data by fetchListItems service: "+ JSON.stringify(data));
  //       return data;
  // }

  //=========fetching list items with filter and without expand options ================
  // public getFilteredItemsWithoutExpand(list?: any):Promise<any>{
        
  //   let data;
  //     data = 
  //       from(this.getConfigInfo().web.lists
  //       .getByTitle(list.name) 
  //       .items.select(list.select)
  //       .filter(list.filterBy+" eq '"+list.filterWith+"'")
  //       .top(list.top) 
  //       .get()
  //       .catch((rej)=>{
  //         console.log(rej.message);
  //       })          
  //       );        
          
  //       return data;
  // }


  //======== add an item to the list start=============
  async saveListItem(list:any): Promise<any>{

    const savedItemInfo = {
      ID: null,
      GUID: null,
    }
  
    let promiseSLI:any = await new Promise((resolve:any, reject:any) => {

      this.getConfigInfo().web.lists.getByTitle(list.name).items.add(list.item).then((result: any) => { 
        
        if(Object.prototype.hasOwnProperty.call(result, 'data')){ 
          
          savedItemInfo.ID = result.data.Id;
          savedItemInfo.GUID = result.data.GUID;
          resolve(savedItemInfo);
          return savedItemInfo;

        } else{
          resolve(savedItemInfo);
          return savedItemInfo;
        }     

      }, (error: any): void => { 

        console.log('Error while creating the item: ' + error);
        reject(savedItemInfo);

      });   
      
      return savedItemInfo;

    });

    return promiseSLI;

  }
  //-----------add an item to the list ends-----------

  //======== add an item to the list start=============
  async updateListItem(list:any): Promise<any>{

    let promiseULI:any = await new Promise((resolve:any, reject:any) => {

       this.getConfigInfo().web.lists.getByTitle(list.name).items.getById(list.rId).update(list.item).then((result: any) => { 
        if(Object.prototype.hasOwnProperty.call(result, 'data')){ 
          resolve('Successful'); 
          return 'Successful';
        }else{
          resolve('Failed'); 
          return 'Failed'; 
        }        
              
      }, (error: any): void => {
        reject(error); 
        console.log('Error while creating the item: ' + error);
      }); 

     
    });

    return promiseULI;
 
  }
  //-----------add an item to the list ends-----------

    //======== add an item to the list start=============
    async addAttachment(list:any): Promise<any>{
      const savedItemInfo = {
        ID: null,
        GUID: null,
      }
      
      this.getConfigInfo().web.lists.getByTitle(list.name).items.getById(list.id).attachmentFiles.add(list.attachmentName, list.arrayBuffer).then((result) => { 
        //console.log(JSON.stringify(result));
        // let rID= result.data.Id;
        // let rGUID= result.data.GUID;
        savedItemInfo.ID= result.data.Id;
        savedItemInfo.GUID= result.data.GUID;        
      }, (error: any): void => { 
        console.log('Error while creating the item: ' + error);
      });
    
      return savedItemInfo;
    }
    //-----------add an item to the list ends-----------

  //=========fetching list items with filter and without expand options ================
  public getFilteredItemsWithoutExpand(list?: any):Promise<any>{
        
    let data:any;
      data = 
        from(this.getConfigInfo().web.lists
        .getByTitle(list.name) 
        .items.select(list.select)
        .filter(list.filterBy+" eq '"+list.filterWith+"'")
        .top(list.top) 
        .get()
        .catch((rej)=>{
          console.log(rej.message);
        })          
        );        
          
        return data;
  }

  
  
  
}




