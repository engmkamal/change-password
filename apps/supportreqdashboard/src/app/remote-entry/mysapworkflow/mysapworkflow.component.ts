import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Renderer2,
  HostListener
} from '@angular/core';
//========to covert promise to observer======
import {
  from,
  forkJoin,
  combineLatest,
  Observable,
  Subscription,
  retry, 
  catchError,
  throwError,
  of,
  map,
  Subject
} from 'rxjs';

import { Tablegrid, ColumnDefinition } from '@portal/dashboard';
import * as moment from 'moment';
//---------date formate ends ---
import { SharepointlistService } from '@portal/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//import { MasterdetailsrendererComponent } from '../masterdetailsrenderer/masterdetailsrenderer.component';

import { ActivatedRoute, Router } from '@angular/router'; // to read the url route

//=========for voice recognition ===========
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { WebsocketService } from '@portal/core';
//import { io } from 'socket.io-client';

const configKey = makeStateKey('CONFIG');
//------------

//====import data from local storage ==
//import * as fs from 'fs';
//import * as path from 'path';

import { AgGridAngular } from 'ag-grid-angular';
import { 
  CellClickedEvent, 
  ColDef,
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  ICellEditorParams,
  RowEditingStartedEvent,
  RowEditingStoppedEvent, 
} from 'ag-grid-community';

//===for editing starts====
import * as $ from 'jquery';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import Swal from 'sweetalert2';


//=============================
import { Grid, GridOptions } from 'ag-grid-community';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
//-------------------------


export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

//--------------editing ends ---

//===========ajax service starts ====

export class HttpajaxService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(public http: HttpClient) {}


  public saveData(
    url: string, 
    data: any
    ): Observable<any> {
        return this.http.post(
          url, 
          data, 
          { headers: this.headers});
  }
}
//----------ajax service ends ----

export interface IPendingTaskModel {
  GUID?: any;
  ID?: any;
  Title?: any;
  ProcessName?: any;
  RequestedByName?: any;
  Status?: any;
  EmployeeID?: any;
  RequestedByEmail?: any;
  RequestLink?: any;
  PendingTo?: any;
  Created?: any;
  Modified?: any;

}

declare let webkitSpeechRecognition: any; // for voice recognition

@Component({
  selector: 'portal-mysapworkflow',
  templateUrl: './mysapworkflow.component.html',
  styleUrls: ['./mysapworkflow.component.scss'],
})
export class MysapworkflowComponent implements OnInit, AfterViewInit {

  windowOrigin = window.location.origin;
  panelOpenState = false;
  tg = new Tablegrid();
  
  siteAbsoluteUrl = "https://bergerpaintsbd.sharepoint.com/sites/BergerTech/";
  //siteAbsoluteUrl = window.location.origin;
  //siteAbsoluteUrl = "https://portal.bergerbd.com/";

  //public rowDataCM: string;
  public rowDataWP: any;
  mpTG = new Tablegrid();
  public workflows = [];
  rowData: any;

  public txtOfQuickSearchInpFld:any;
  //public rowHeight:any;

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  rowData$!: Observable<any[]>;

  delegatedUsers:any = [];

  private logedInUser = { 
    aDId: 0,
    name: "",
    email: "",
    empID: "",
    office: "",
    access: "NoAccess"
  };

  private listInfo = {  
    name: "",
    query: "",
    expand: "",
    select: "",
    filter: "",
    orderByPrm: "",
    orderByVal: false,
    top: 20,
  };


  private detListInfo = {
    name: "",
    query: "",
    expand: "",
    select: "",
    filter: "",
    top: 200000,
  };

  //=========for infinite scrolling and lazy loading start=========
  rowBuffer:any;
  cacheOverflowSize:any;
  maxConcurrentDatasourceRequests:any;
  infiniteInitialRowCount:any;
  maxBlocksInCache:any;
  components:any;

  private onGridReadyParamsApi:any;

  private dbTagUrlInfo ={ 
    titleTag: '',
    urlVoice : '',
    qryStrKeyVal: '',
    qryStrKeyTyp: 'GUID',
    mode1: '',
    mode2: ''
  }

  @ViewChild('filterTextBox') filterTextBox:any;

  private clickedDashboardInfo = { 
    wfName: 'PendingApproval',
    acessPermission: "Public",
    listIndex: 0,
    serviceFnName: 'fetchListItemWithExpStFilOrd',
    config: {},    
    mapedData: {d:[]},
    recMstLocDat: {d:[]}
  };

  dashboardsListsInfo:any;

  socket:any;
  recentMstLocData:any;

  elementRenderer!:any;
  updatedata!:any;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/xml',
      'Access-Control-Allow-Origin': 'https://bergerpaintsbd.sharepoint.com/sites/BergerTech'
    })
  };

  public getScreenWidth: any;
  public getScreenHeight: any;

  tblContentHeight = 380;

  

  constructor(
    private sharepointlistService: SharepointlistService,
    private _actRoute: ActivatedRoute,
    private websocketService: WebsocketService,
    private httpClient: HttpClient,
    elRenderer: Renderer2,    
    private router: Router
    ) {
      this.elementRenderer = elRenderer;
    }


  async getGridReadyprocesses(){
    try{
      // //await this.getSelectedDashboardInfo(this.clickedDashboardInfo);
      // this.listInfo.top = 200000;
      // await this.getRowData(this.clickedDashboardInfo);
      // await this.getTitleTag(this.rowData);
      // // # emit to loc Server to strore in loc file #
      // //await this.updateLocalStorage();   
      // this.websocketService.subscribe();   
    } 
    catch(err){
      console.log("Error: " + err)
    }
  }

  async ngAfterViewInit(){}

  onGridReady(params:any) {

    this.mpTG.gridApi = params.api;
    this.mpTG.gridColumnApi = params.columnApi;

    //======= late loading with all row data start ====
    this.listInfo.top = 200000;    

    //this.getGridReadyprocesses();
    
    this.onGridReadyParamsApi = this.mpTG.gridApi; //for voice recognition 
    
    //====for editing ===
    
    this.mpTG.rowNodeApi = params.rowNodeApi;
    this.mpTG.editType = 'fullRow'; 
    
    // const hp = document.querySelector('.ag-header-row')as HTMLElement | null;//ag-header-row //ag-header-container//ag-header-viewport
    // if(hp){
    //   hp.style.height = '25px';
    // } 

    //this.tblContentHeight = this.getScreenHeight - 200;
    //this.mpTG.paginationPageSize = (this.tblContentHeight - 80)/35; // 80px = tbl header: 55px + footer:20px + additional:5px
    
    const pp = document.querySelector('.ag-paging-panel')as HTMLElement | null;
    if(pp){
      pp.style.height = '20px';
    }

  }

  createColDef(i:any) {

    const htmlEleRenderer = this.elementRenderer;

    return new Promise((resolve, reject)=>{    
    
      i.config.DbViewColDef.forEach((element:any, index:number ) => {
          
          const ftype = element.fldType;
          const eGui: HTMLDivElement = htmlEleRenderer.createElement('div');          
          const mpTgColDef = new ColumnDefinition(i, element, eGui);    
          return this.mpTG.columnDefs.push(mpTgColDef.fieldMapper(element));          
    
        });

        resolve(this.mpTG.columnDefs);

    })    
  }

  getRecentMstrLocalData(){
    return new Promise((resolve, reject)=>{
      if(this.clickedDashboardInfo.acessPermission == 'Public'){      
        if( this.clickedDashboardInfo.recMstLocDat.d.length > 0){ //check wheather target file includes any array with no item
          this.rowData = this.clickedDashboardInfo.recMstLocDat.d;
          resolve(this.clickedDashboardInfo.recMstLocDat.d);
        }else{
          this.getRowData(this.clickedDashboardInfo).then(res=>{
            resolve(res);
          });
        } 
      }
      else if(this.clickedDashboardInfo.acessPermission == 'Protected'){      
        if( this.clickedDashboardInfo.recMstLocDat.d.length > 0){ //check wheather target file includes any array with no item
          
          if(this.logedInUser.access == 'FullAccess'){             
            const myLocationData = (this.clickedDashboardInfo.recMstLocDat.d).filter(item =>{
                return item['Author']['Office'] == this.logedInUser.office;
              });
            this.rowData = myLocationData;
            resolve(myLocationData);
          }
        }else{
          this.getRowData(this.clickedDashboardInfo).then(res=>{
            resolve(res);
          });
        } 
      }
      else{
        this.rowData = [];
        resolve('Un authorized access !!');
      }
    })
  }

  getRowData(i:any) {
    const listname = i.config.MasterListInfo.name;
    const selQry = i.config.MasterListInfo.select;
    const itmNum = this.listInfo.top;
    
    let apiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('PendingApproval')/items?&$top=200000&$select=GUID,ID,Title,ProcessName,RequestedByName,Status,EmployeeID,RequestedByEmail,RequestLink,PendingWith/ID,PendingWith/Title,Author/ID,Created,Author/Title,Author/Office,Modified&$expand=PendingWith/ID,Author/ID&$filter=Author/ID eq '${this.logedInUser.aDId}'&$orderby=Created desc`;    
    //let apiUrl = `https://portal.bergerbd.com/leaveauto/_api/web/lists/getByTitle('PendingApproval')/items?&$top=200000&$select=GUID,ID,Title,ProcessName,RequestedByName,Status,EmployeeID,RequestedByEmail,RequestLink,PendingWith/ID,PendingWith/Title,Author/ID,Created,Author/Title,Author/Office,Modified&$expand=PendingWith/ID,Author/ID&$filter=Author/ID eq '${this.logedInUser.aDId}'&$orderby=Created desc`;
    
    return new Promise((resolve, reject)=>{ 
      if(this.logedInUser.access != 'NoAccess'){

        if(this.logedInUser.office != "Corporate"){
          apiUrl = `bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('${listname}')/items?&$top=${itmNum}&$select=${selQry}&$filter=substringof('${this.logedInUser.office}', Author/Office ) `; 
          //apiUrl = `https://portal.bergerbd.com/leaveauto/_api/web/lists/getByTitle('${listname}')/items?&$top=${itmNum}&$select=${selQry}&$filter=substringof('${this.logedInUser.office}', Author/Office ) `; 
        }
          try {
            this.httpClient.get<any[]>(apiUrl)
            //.pipe(map((res:any) => res.filter((res:any) => res.value.Title == null))
            .subscribe(
              (items:any) => {
                this.rowData = [];
                //this.rowData = JSON.parse(JSON.stringify(items.value));
                const parsedData = JSON.parse(JSON.stringify(items.value));
                this.rowData = parsedData.filter((res:any)=>{return res.Title != null});
                if(this.rowData.length < this.mpTG.paginationPageSize){
                  this.tblContentHeight = (this.rowData.length * 25) + 150;
                }
                resolve(this.rowData);
              }
            );
            
          } catch (e) {
            reject(e);
            console.log(e);
          }
      }else{
        alert("Access Denied !!!");
        reject("No Data !");
      }

    })
  }

  getSelectedDashboardInfo(i:any) {
    return new Promise((resolve, reject)=>{  
      this.listInfo.name = this.dashboardsListsInfo[i.listIndex].MasterListInfo.name;
      this.listInfo.select = this.dashboardsListsInfo[i.listIndex].MasterListInfo.select;
      this.listInfo.expand = this.dashboardsListsInfo[i.listIndex].MasterListInfo.expand;
      this.listInfo.orderByPrm = this.dashboardsListsInfo[i.listIndex].MasterListInfo.orderByPrm;
      this.listInfo.orderByVal = this.dashboardsListsInfo[i.listIndex].MasterListInfo.orderByVal;
      //this.listInfo.top = this.dashboardsListsInfo[i.listIndex].MasterListInfo.top;

      this.sharepointlistService.getEmpIdNdOffice().then((res) => {
        if (res.Office == "Corporate") {
          this.listInfo.filter = '';
        }
        else {
          this.listInfo.filter = "substringof('" + res.Office + "' ,Author/Office)";
        }     
      });

      resolve(this.listInfo);
    })
    
  }

  ifAuthGroupsMember(i:any): boolean{
    //should be implemented;
    return false;    
  }

  // getSocketConnectionWithSPServer(){ 
  //   //=============socket.io implementation strat ===========
  //   const webAbsoluteUrl = window.location.origin;
  //   //let webAbsoluteUrl = 'https://localhost';
  //   const serPort = window.location.protocol == "https:" ? 3000 : 8000;
  //   //let serPort = 3000;
  //   const serverUrl = webAbsoluteUrl + ":" + serPort;

  //   // let serPort = 443;
  //   // let serverUrl = "https://localhost:" + serPort;

  //   this.socket = io('https://portaldv.bergerbd.com/leaveauto/Lists/ReimburseMaster/AllItems.aspx', {
  //       // below config is mendatory and should not be changed ---set to false only if you use self-signed certificate !
  //       transports: ['websocket'],
  //       rejectUnauthorized: false,
  //       secure: false,
  //       withCredentials: false,
  //       forceNew: true,
  //       timeout: 5000, //before connect_error and connect_timeout are emitted.
  //   });     
    
  //   //======check if connected ===
  //   this.socket.on("connect", () => {
  //     if(this.socket.connected){
  //       console.log(`Connect SP server successfull !`);
  //     }
  //     else{console.log(`Unable to connect local server !`);}
  //   });

  //   this.socket.on('item:added', (data) => {
  //     console.log("data.customProperties.id: "+ data.customProperties.id);
  //   });

    
  // }

  //==step 5==

  // getSocketConnection(wfName){ 
  //     //=============socket.io implementation strat ===========
  //     const webAbsoluteUrl = window.location.origin;
  //     //let webAbsoluteUrl = 'https://localhost';
  //     const serPort = window.location.protocol == "https:" ? 3000 : 8000;
  //     //let serPort = 3000;
  //     const serverUrl = webAbsoluteUrl + ":" + serPort;

  //     // let serPort = 443;
  //     // let serverUrl = "https://localhost:" + serPort;

  //     this.socket = io( serverUrl, {
  //         // below config is mendatory and should not be changed ---set to false only if you use self-signed certificate !
  //         transports: ['websocket'],
  //         rejectUnauthorized: false,
  //         secure: false,
  //         withCredentials: false,
  //         forceNew: true,
  //         timeout: 5000, //before connect_error and connect_timeout are emitted.
  //     });     
      
  //     //======check if connected ===
  //     this.socket.on("connect", () => {
  //       if(this.socket.connected){
  //         this.websocketService.listen(wfName).subscribe((data)=>{
  //           console.log(`Auto received data from server with listen event: ${data}`);
  //         });
  //       }
  //       else{console.log(`Unable to connect local server`);}
  //     });

  //     this.socket.on(wfName + 'Back', (msg)=>{
  //       //let ms = JSON.stringify(msg);
  //       console.log("Back MasterData from Server: " + msg);
  //     });      

  //     this.socket.on(wfName + '-updateDataStatus', (msg)=>{
  //       //let ms = JSON.stringify(msg);
  //       console.log("Reply of updateDataStatus from Server: " + msg);
  //     });

      
  // }

  //====step 2==
  dashboardGridDef(){   
    return new Promise((resolve, reject)=>{
      this.mpTG.columnDefs = [];
      //=============set column definition start ===========
      this.mpTG.defaultColDef = {
        flex: 1,
        minWidth: 50,
        resizable: true, //to resize; add resizable: false to any individual column to disable resizingng that col only
        enableValue: true,
        enableRowGroup: true,
        enablePivot: true,
        sortable: true,
        filter: true,
        editable: true,
      };

      this.mpTG.detailCellRenderer = 'myDetailCellRenderer';
      //this.mpTG.frameworkComponents = { myDetailCellRenderer: MasterdetailsrendererComponent };
      this.mpTG.frameworkComponents = { };
      //--------for action btn link rendering start -------
      this.mpTG.rowGroupPanelShow = 'always'; //'onlyWhenGrouping';

      //=========for setting features on every subgroup items start=======
      // this.mpTG.autoGroupColumnDef = {
      //   headerName: 'Group',
      //   field: 'RequestStatus',
      //   minWidth: 30,
      //   cellRenderer: 'agGroupCellRenderer',
      //   cellRendererParams: {
      //     //  checkbox: true
      //   },
      // };
      //------------ subitem fetures ends -----------
      this.mpTG.rowHeight = 24;  
      this.mpTG.masterDetail = true;
      this.mpTG.rowSelection = "multiple";
      this.mpTG.animateRows = true;
      this.mpTG.suppressDragLeaveHidesColumns = true;
      this.mpTG.groupUseEntireRow = true;
      this.mpTG.paginationPageSize = 10;
      this.mpTG.floatingFilter = true;
      this.mpTG.cacheQuickFilter = true;
      this.mpTG.enableCharts = true;
      this.mpTG.enableRangeSelection = true;
      this.mpTG.suppressRowClickSelection = true;

      this.components = {
        loadingRenderer: function (params:any) {
          if (params.value !== undefined) {
            return params.value;
          } else {
            return "<img src=\"https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/images/loading.gif\">";
          }
        },
      };
      //-------------col def ends -------------------
      resolve(this.mpTG);
    }) 
    
    
  }

  //=======step-1 list{apiUrl: , top: ,}
  async getlogedInUser(){ 
    return new Promise((resolve, reject)=>{
      this.sharepointlistService.getEmpIdNdOffice().then((res:any)=>{
        this.logedInUser.aDId = res.ADId;
        this.logedInUser.empID = res.EmpID;
        this.logedInUser.office = res.Office;
        resolve(this.logedInUser);
      })
    })    
  }

  async getPendingTasks(list:any){ 
    return new Promise((resolve, reject)=>{
      try {
        this.httpClient.get<any[]>(list.apiUrl, this.httpOptions)
        //.pipe(map((res:any) => res.filter((res:any) => res.value.RequestLink == null)))
        .subscribe(
          (items:any) => {
            const parsedData = JSON.parse(JSON.stringify(items.value));
            //this.rowData = parsedData;
            // if(this.rowData.length < this.mpTG.paginationPageSize){
            //   this.tblContentHeight = (this.rowData.length * 25) + 150;
            // }
            resolve(parsedData);
            return parsedData;
          }
        );
        
      } catch (e) {
        reject(e);
        console.log(e);
      }
    })


    
  }

  async checkAuthorization(){ 
    return new Promise((resolve, reject)=>{
      this._actRoute.paramMap.subscribe((url:any) => {
        const wfName = url.get('id');
        //this.dashboardsListsInfo[0].wfName = wfName;
        if (wfName) { 
          this.clickedDashboardInfo.wfName = wfName;          
          this.clickedDashboardInfo.listIndex = this.dashboardsListsInfo.findIndex((item:any) => item.WfName === wfName);
          const wfIndex = this.clickedDashboardInfo.listIndex;
          // # pushing clickedDashboardInfo from 'this.dashboardsListsInfo' file to in memory #
          this.clickedDashboardInfo.config = this.dashboardsListsInfo[wfIndex]; 
          
        }
        else{
          alert("Workflow Name not found !");
          return false;
        }
        return this.clickedDashboardInfo;
      });

      if(this.dashboardsListsInfo[this.clickedDashboardInfo.listIndex].AcessPermission == 'Public'){
        this.clickedDashboardInfo.acessPermission = 'Public';
        this.logedInUser.access = 'FullAccess';
        this.sharepointlistService.getEmpIdNdOffice().then((res:any)=>{
          this.logedInUser.aDId = res.ADId;
          this.logedInUser.empID = res.EmpID;
          this.logedInUser.office = res.Office;
        }).then((res:any):void=>{
          resolve(this.logedInUser);
        })
        
      }else{
        this.sharepointlistService.getEmpIdNdOffice().then((res:any)=>{
          this.logedInUser.aDId = res.ADId;
          this.logedInUser.empID = res.EmpID;
          this.logedInUser.office = res.Office;
        }).then((res:any):void=>{

          const aDIdGrp = this.dashboardsListsInfo[this.clickedDashboardInfo.listIndex].AuthUsersADId;
          const empIdGrp = this.dashboardsListsInfo[this.clickedDashboardInfo.listIndex].AuthUsersEmpId;
          const authGrp = this.dashboardsListsInfo[this.clickedDashboardInfo.listIndex].AuthGroups;
              
          if(aDIdGrp.length > 0 && aDIdGrp.includes(this.logedInUser.aDId)){
            this.clickedDashboardInfo.acessPermission = 'Protected';
            this.logedInUser.access = 'FullAccess';
            resolve(this.logedInUser);
          }
          else if(empIdGrp.length >0 && empIdGrp.includes(this.logedInUser.empID)){
            this.clickedDashboardInfo.acessPermission = 'Protected';
            this.logedInUser.access = 'FullAccess';
            resolve(this.logedInUser);
          }
          else if(authGrp.length > 0 ){ 
            const apiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/sitegroups/getByName('${authGrp}')/Users?$filter=Id eq ${this.logedInUser.aDId}` ;
            //const apiUrl = `https://portal.bergerbd.com/_api/web/sitegroups/getByName('${authGrp}')/Users?$filter=Id eq ${this.logedInUser.aDId}` ;
            
            const isInAuthGrp = this.httpClient.get<any[]>(apiUrl).pipe(map((items:any)=>{              
              return (items.value.length > 0 )? true: false;
            }));

            if(isInAuthGrp){
              this.clickedDashboardInfo.acessPermission = 'Protected';
              this.logedInUser.access = 'FullAccess';
              resolve(this.logedInUser);
            }else{
              alert("Unauthorized access !!!");
              reject(this.logedInUser);
              //return false;
            }
           
           
            // this.httpClient.get<any[]>(apiUrl).subscribe(
            //   (items:any) => {
            //     if(items.value.length > 0 ){
            //       this.clickedDashboardInfo.acessPermission = 'Protected';
            //       this.logedInUser.access = 'FullAccess';
            //       resolve(this.logedInUser);
            //     }else{
            //       alert("Unauthorized access !!");
            //       reject(this.logedInUser);
            //       return false;
            //     }
            //     return this.logedInUser;
            //   }              
            // ) 
          }          
        });         
      }
    })


    
  }

  async getDeligets(){ 
    return new Promise((resolve, reject)=>{
      const dt = (new Date()).toISOString(); 
      const apiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('Task%20Delegation')/items?&$top=5&$select=GUID,ID,User/ID,FormDate,ToDate,Delegate_x0020_To/ID,Delegate_x0020_To/Title,Modified&$expand=User/ID,Delegate_x0020_To/ID&$filter=(Delegate_x0020_To/ID eq '${this.logedInUser.aDId}') and(ToDate ge '${dt}')&$orderby=Created desc`;
      //const apiUrl = `https://portal.bergerbd.com/leaveauto/_api/web/lists/getByTitle('Task%20Delegation')/items?&$top=5&$select=GUID,ID,User/ID,FormDate,ToDate,Delegate_x0020_To/ID,Delegate_x0020_To/Title,Modified&$expand=User/ID,Delegate_x0020_To/ID&$filter=(Delegate_x0020_To/ID eq '${this.logedInUser.aDId}') and(ToDate ge '${dt}')&$orderby=Created desc`;
             
          this.httpClient.get<any[]>(apiUrl)
          .subscribe(
            (items:any) => { 
              items.value.forEach((i:any) => {
                this.delegatedUsers.push({
                  ID: i.User.ID,
                  Modified: i.Modified,
                  ToDate: i.ToDate
                });
              });

              resolve(this.delegatedUsers);
            }
          );
    })
    
  }

  async getDeligetsTasks(){
    return new Promise((resolve, reject)=>{
        //this.rowData = [];
        let ownPendings = [];
        this.delegatedUsers.forEach((du:any) => { 
        const apiUrl = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('PendingApproval')/items?&$top=200&$select=GUID,ID,Title,ProcessName,RequestedByName,Status,EmployeeID,RequestedByEmail,RequestLink,PendingWith/ID,PendingWith/Title,Author/ID,Created,Author/Title,Author/Office,Author/JobTitle,Modified&$expand=PendingWith/ID,Author/ID&$filter=PendingWith/ID eq '${du.ID}'&$orderby=Created desc`;
        //const apiUrl = `https://portal.bergerbd.com/leaveauto/_api/web/lists/getByTitle('PendingApproval')/items?&$top=200&$select=GUID,ID,Title,ProcessName,RequestedByName,Status,EmployeeID,RequestedByEmail,RequestLink,PendingWith/ID,PendingWith/Title,Author/ID,Created,Author/Title,Author/Office,Author/JobTitle,Modified&$expand=PendingWith/ID,Author/ID&$filter=PendingWith/ID eq '${du.ID}'&$orderby=Created desc`;
        try {
          this.httpClient.get<any[]>(apiUrl)
            .subscribe(
              (items:any) => {                
                const parsedData = JSON.parse(JSON.stringify(items.value));
                ownPendings = [...this.rowData, ...parsedData];
                this.rowData = ownPendings;
                
                if(this.rowData.length < this.mpTG.paginationPageSize){
                  this.tblContentHeight = (this.rowData.length * 25) + 150;
                }
                
                resolve(this.rowData);
              }
            );
            
          } catch (e) {
            reject(e);
            console.log(e);
          }
        });    
      
    })
    
  }

  async executeOnInitProcesses(){    
    try{
      this.dashboardGridDef();
      this.createColDef(this.clickedDashboardInfo);     

      // await this.getDeligets();  
      // await this.getDeligetsTasks();
    } 
    catch(err){
      console.log("Error: " + err)
    }
  }

  async ngOnInit() {

    let cid = null;

    if( localStorage.getItem('logedCustId') == null && localStorage.getItem('logedEmpEmail') == null){
      alert("Customer Info not found ! Please Log in.");      
      window.location.href = this.windowOrigin + '/login';
    }else{
      
      cid = localStorage.getItem('logedCustId');
    }

    let loggedUser:any = "";    

    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    
    //this.tblContentHeight = this.getScreenHeight - 200;
    this.mpTG.paginationPageSize = (this.tblContentHeight - 80)/35; // 80px = tbl header: 55px + footer:20px + additional:5px
    
    //await this.getlogedInUser();
    
    let pendingList = {
      apiUrl: `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('supportmaster')/items?&$top=100&$select=*&$orderby=Created desc`,      
      //apiUrl: `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('supportmaster')/items?&$top=100&$select=*&$filter=((Status ne 'Completed') and (Status ne 'Rejected'))&$orderby=Created desc`,      
    };

    //let allPendingTasks:any = await this.getPendingTasks(pendingList);

    //this.rowData = [];
    let parsedAllPendingTasks:IPendingTaskModel[];

    this.httpClient.get<any[]>(pendingList.apiUrl, this.httpOptions)
    //.pipe(map((res:any) => res.filter((res:any) => res.value.RequestLink == null)))
    .subscribe(
      (items:any) => {

        

        this.rowData = [];

        for(let i=0; i<items.value.length; i++){
          
            let sapReq = {
              // GUID: items.value[i].GUID,
              // ID: items.value[i].ID,
              Title: items.value[i].Title,
              Subject: items.value[i].Subject,
              Priority: items.value[i].Priority,
              Status: items.value[i].Status,
              //EmployeeID: items.value[i].EmployeeID,
              //RequestedByEmail: items.value[i].RequestedByEmail,
              RequestLink: items.value[i].ProcessLink,
              PendingTo: JSON.parse(items.value[i].PendingTo),
              Created: items.value[i].Created,
              Modified: items.value[i].Modified,
              AllPendingTo: ""
            };

            if(sapReq.PendingTo.length >0){
              let aprv = '';
              for(let j=0; j<sapReq.PendingTo.length; j++){
                aprv = aprv + '  ' + sapReq.PendingTo[j].approversName;
              }
              sapReq.AllPendingTo = aprv;
            }else{
              sapReq.AllPendingTo = "";
            }
  
            this.rowData.push(sapReq);          
          
        }

        //const parsedData = JSON.parse(JSON.stringify(items.value));
        
        //this.rowData = parsedData;
        // if(this.rowData.length < this.mpTG.paginationPageSize){
        //   this.tblContentHeight = (this.rowData.length * 25) + 150;
        // }

        //========= filtering start =====
        if(localStorage.getItem('logedEmpEmail') != null){
          loggedUser = localStorage.getItem('logedEmpEmail');
        }else if(localStorage.getItem('logedEmpEmail') != null){
          loggedUser = localStorage.getItem('logedCustEmail'); 
        }
    
        // parsedData.forEach((apt:any, index:any) => {
        //   let pt = {
        //     GUID: apt.GUID,
        //     ID: apt.ID,
        //     Title: apt.Title,
        //     ProcessName: apt.ProcessName,
        //     RequestedByName: apt.RequestedByName,
        //     Status: apt.Status,
        //     EmployeeID: apt.EmployeeID,
        //     RequestedByEmail: apt.RequestedByEmail,
        //     RequestLink: apt.RequestLink,
        //     PendingTo: JSON.parse(apt.PendingTo),
        //     Created: apt.Created,
        //     Modified: apt.Modified
        //   };
  
        //   parsedAllPendingTasks.push(pt); 
        //   pt.PendingTo.find((t:any)=>{
        //     if(t.approversEmail == loggedUser){
        //       parsedAllPendingTasks.push(pt);            
        //     }
        //   })
  
        //   if(index == parsedData.length){
        //     //this.rowData = parsedAllPendingTasks;              
        //     if(this.rowData.length < this.mpTG.paginationPageSize){
        //       this.tblContentHeight = (this.rowData.length * 25) + 150;
        //     }
        //   }
  
          
        // });     
        


        //---------filtering ends -----        
        
      }
      
    );   
    
    const dbListsInfoUrl = "assets/supdashboardslistsinfo.ts";
    //const dbListsInfoUrl = "../../../assets/dashboardslistsinfo.ts";

    this.httpClient.get(dbListsInfoUrl).subscribe((data:any) =>{
      this.clickedDashboardInfo.config = data[0];
      if(data.length >0){
        this.executeOnInitProcesses();   
      }else{
        alert("Fetching List info failed !");
      }
    });

    
  }

  getTitleTag(rowData:any){
    //=========split titleTag =========
    return new Promise((resolve, reject)=>{
      if(Object.prototype.hasOwnProperty.call(this.dashboardsListsInfo[this.clickedDashboardInfo.listIndex].ViewUrl, 'titleTag')){
        this.dbTagUrlInfo.titleTag = this.dashboardsListsInfo[this.clickedDashboardInfo.listIndex].ViewUrl.titleTag;
      }
      else if(rowData != undefined){
        if(Object.prototype.hasOwnProperty.call(rowData[0], 'Title')){
          if(rowData[0].Title != null && rowData[0].Title != ''){
            this.dbTagUrlInfo.titleTag = rowData[0].Title.split('-')[0] + "-";
          }else if(rowData[5].Title != null && rowData[5].Title != ''){
            this.dbTagUrlInfo.titleTag = rowData[5].Title.split('-')[0] + "-";
          }else {
            this.dbTagUrlInfo.titleTag = rowData[10].Title.split('-')[0] + "-";
          }
        }
        else if(Object.prototype.hasOwnProperty.call(rowData[0], 'RequestId')){
          if(rowData[0].RequestId != null && rowData[0].RequestId != ''){
            this.dbTagUrlInfo.titleTag = rowData[0].RequestId.split('-')[0] + "-";
          }else if(rowData[5].Title != null && rowData[5].Title != ''){
            this.dbTagUrlInfo.titleTag = rowData[5].RequestId.split('-')[0] + "-";
          }else {
            this.dbTagUrlInfo.titleTag = rowData[10].RequestId.split('-')[0] + "-";
          }
        }
        else if(Object.prototype.hasOwnProperty.call(rowData[0], 'RequestID')){
          if(rowData[0].RequestID != null && rowData[0].RequestID != ''){
            this.dbTagUrlInfo.titleTag = rowData[0].RequestID.split('-')[0] + "-";
          }else if(rowData[5].Title != null && rowData[5].Title != ''){
            this.dbTagUrlInfo.titleTag = rowData[5].RequestID.split('-')[0] + "-";
          }else {
            this.dbTagUrlInfo.titleTag = rowData[10].RequestID.split('-')[0] + "-";
          }
        }
      }
      resolve(this.dbTagUrlInfo);
    })
    
  }

  async getDbInfoNdData(){
    await this.getSelectedDashboardInfo(this.clickedDashboardInfo);
    //await this.getRowData(this.clickedDashboardInfo);

    await this.getRecentMstrLocalData();
  }

  //===================== Export Table data to Excel start ==============
  onBtnExportDataAsExcel() {
    function rowGroupCallback(params:any) {
      return params.node.key;
    }

    this.mpTG.gridApi.exportDataAsExcel({
      processRowGroupCallback: rowGroupCallback,
    });
  }
  //===================== Export Table data to Excel end ==============

  //=============== Quick central filter function start ========== 
  //--------method-1: (with angular)--------
  quickSearch() {
    this.mpTG.gridApi.setQuickFilter(this.txtOfQuickSearchInpFld);
  }
  //--------method-2: (with Jquery)--------required to include oninput=onFilterTextBoxChanged() in html file--------
  // onFilterTextBoxChanged(){
  //   this.gridApi.setQuickFilter(document.querySelector('#filter-text-box'));
  // }
  //=============== Quick central filter function ends ==========


  //============= set row height methods starts 100% working ==============
  getRowHeight(params:any) {
    return groupHeight;
    // if (params.node.group) {
    //   return groupHeight;
    // }
  }

  setGroupHeight(height:any) {
    groupHeight = height;
    this.mpTG.rowHeight = height;
    this.mpTG.gridApi.resetRowHeights();
  }

  setRowHeight(height:any) {
    // rowHeight = height;
    // this.mpTG.gridApi.resetRowHeights();

    this.mpTG.gridApi.forEachNode(function (rowNode:any) {
      //if (rowNode.data && rowNode.data.country === 'Russia') {
      // rowHeight = height;
      // this.mpTG.gridApi.resetRowHeights();  
      rowNode.setRowHeight(height);
      //}
    });
    this.mpTG.gridApi.onRowHeightChanged();
  }
  //------- set row height methods ends ---------------

  //=========== voice recognition start ==========  

  voiceSearch(){
    
    alert("Please say any word that you want to search with");

    

    const quickVoiceSearch = (txt:any) => {
      this.onGridReadyParamsApi.setQuickFilter(txt);
    }

    if('webkitSpeechRecognition' in window){
        const vSearch = new webkitSpeechRecognition();
        vSearch.continuous = false;
        vSearch.interimresults = false;
        vSearch.lang = 'en-US';
        vSearch.start();
        //const voiceSearchForm = this.formSearch.nativeElement;
        //const voiceHandler = this.hiddenSearchHandler.nativeElement;
        //const srcTxtVoiceHandler = this.filterTextBox.nativeElement; // for filter
        //console.log(voiceSearchForm);
        vSearch.onresult = function(e:any){
          //console.log(voiceSearchForm);
          //voiceHandler.value = e.results[0][0].transcript;
            vSearch.stop();
            //console.log(voiceHandler);
            //alert(e.results[0][0].transcript);
            
            this.txtOfQuickSearchInpFld = e.results[0][0].transcript;
            (document.getElementById('filter-text-box') as HTMLInputElement).value = this.txtOfQuickSearchInpFld;
            quickVoiceSearch(this.txtOfQuickSearchInpFld);

            
            //voiceSearchForm.submit();
        }
  
        vSearch.onerror = function(e:any){
            console.log(e);
            vSearch.stop();
        }

        
        
    } else {
      alert("webkitSpeechRecognition is not available.");
      //console.log(this.state.get(configKey, undefined as any));
      }
  }

  viewByVoice(){
    
    alert("Please say only the number of your request/application within 2-seconds");

    // const quickVoiceSearch = (txt:any) => {
    //   this.onGridReadyParamsApi.setQuickFilter(txt);

    //   let itm = [];
    //   let prKey = '';

    //   const reqDbInfo = this.dashboardsListsInfo[this.clickedDashboardInfo.listIndex];

    //   if(Object.prototype.hasOwnProperty.call(reqDbInfo.MasterListInfo, 'primaryKey')){
    //     prKey = reqDbInfo.MasterListInfo.primaryKey;
    //     if(prKey != 'Title'){
    //       itm = this.rowData.filter((item:any) => item[prKey] == this.dbTagUrlInfo.titleTag + txt);
    //     }
    //     else{
    //       itm = this.rowData.filter((item:any) => item.Title == this.dbTagUrlInfo.titleTag + txt);
    //     }
    //   }else{
    //     itm = this.rowData.filter((item:any) => item.Title == this.dbTagUrlInfo.titleTag + txt);
    //   }
        
    //     (document.getElementById('viewByVoiceText') as HTMLInputElement).value = '        ' + this.dbTagUrlInfo.titleTag + txt;
        
    //     if(reqDbInfo.ViewUrl.qryStrKeyTyp == 'GUID'){
          
    //       this.dbTagUrlInfo.qryStrKeyVal = itm[0].GUID;
    //       const url = this.siteAbsoluteUrl +  reqDbInfo.ViewUrl.siteUrl + this.dbTagUrlInfo.qryStrKeyVal + reqDbInfo.ViewUrl.mode;
    //       window.open(url, "_blank");
    //     }
    //     else if(reqDbInfo.ViewUrl.qryStrKeyTyp == 'ID'){
    //       this.dbTagUrlInfo.qryStrKeyVal = itm[0].ID;
    //       const url = this.siteAbsoluteUrl +  reqDbInfo.ViewUrl.siteUrl + this.dbTagUrlInfo.qryStrKeyVal + reqDbInfo.ViewUrl.mode;
    //       window.open(url, "_blank");
    //     }
        
    // }

    // if('webkitSpeechRecognition' in window){
    //     const vSearch = new webkitSpeechRecognition();
    //     vSearch.continuous = false;
    //     vSearch.interimresults = false;
    //     vSearch.lang = 'en-US';
    //     vSearch.start();
    //     vSearch.onresult = function(e:any){
    //       vSearch.stop();                        
    //       this.txtOfQuickSearchInpFld = e.results[0][0].transcript;
    //       quickVoiceSearch(this.txtOfQuickSearchInpFld);
    //     }
  
    //     vSearch.onerror = function(e:any){
    //       console.log(e);
    //       vSearch.stop();
    //     }        
        
    // } else {
    //   alert("webkitSpeechRecognition is not available.");
    // }
  }



  clearSelection(){
    this.mpTG.gridApi.deselectAll();
    //this.agGrid.api.deselectAll();
  }

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.mpTG.gridApi.paginationSetPageSize(Number(value));
  }

  //#### CRUD operation starts #### ===========
  async onAddRow() {
    const params = this.mpTG.grid;

    const columns = this.listInfo;

    let newRow:object = {};

    const colDefArray = this.mpTG.gridApi.columnModel.columnDefs;

    await Promise.all(colDefArray.map(async (el:any) => {

      const keyVal = (el:any) => {
        return new Promise((res, rej) => {
          const key = el.field;

          if(key == "ID"){
            const objEle = {[key]: null};
            newRow = Object.assign(newRow, objEle)
          }else{
            const objEle = {[key]: ""};
            newRow = Object.assign(newRow, objEle)
          }
          
          res(newRow);

        })
      }     

      await keyVal(el);

    })).then(results => {

      // this.rowData = [...this.rowData, newRow]
      // this.mpTG.gridApi.setRowData(this.rowData);

      //const nodeIndex = this.mpTG.gridApi.rowModel.rowsToDisplay.length - 1;
      const nodeIndex = 0;

      this.mpTG.gridApi.updateRowData({ 
        add: [newRow],
        addIndex: nodeIndex 
      });

      this.mpTG.defaultColDef.editable = true;

      const newRowNode = this.mpTG.gridApi.getRowNode(nodeIndex);
      newRowNode.setRowHeight(43);
      
      this.mpTG.gridApi.onRowHeightChanged();  

      params.api.startEditingCell({
        rowIndex: nodeIndex,
        // gets the first columnKey
        colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
      }); 
      
          

    }).then(()=>{

      // const listName = (params.node.data['odata.type']).slice(8, -8);

      const listInfo = {
        name: this.listInfo.name,
        //rId: params.node.data.Id,
        item: newRow,
      }
    });
   
    
    

  }

  onCellClicked(params:any) {   
    // Handle click event for action cells
    if (params.column.colId === "ID" && params.event.target.dataset.action) {
      const action = params.event.target.dataset.action;

      if (action === "add") {
        const rowIndex = 1+ params.node.rowIndex;
        let rowDataOnAdd: any[] = [];
        rowDataOnAdd = [];
        this.rowData = [];
        this.rowData = rowDataOnAdd;        
        this.mpTG.gridApi.setRowData(rowDataOnAdd);
        
      }
      else if (action === "edit") {
        this.mpTG.defaultColDef.editable = true;
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });

        //== resize the Row Height ===
        params.node.setRowHeight(43);        
        this.mpTG.gridApi.onRowHeightChanged(); 
      }
      else if (action === "delete") {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
      }
      else if (action === "update") {  

        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, update it!'
        }).then((result:any) => {     

          if (result.isConfirmed) {
            params.api.stopEditing(false);  
            //const confirm = window.confirm("Are you sure, you want to update this row ?");
            
            this.updatedata = Object.keys(params.node.data)
              .filter((key) => (key != "Author" && key != "Author@odata.navigationLinkUrl" && key != "Created" && key != "GUID" && key != "ID" && key != "Id" && key != "odata.editLink" && key != "odata.etag" && key != "odata.id" && key != "odata.type" && key != "[[Prototype]]" && key != "EmployeeId" && key != "PendingWith" && key != "undefined"))
              .reduce((obj, key) => {
                  return Object.assign(obj, {
                    [key]: params.node.data[key]
                  });
            }, {});

             
            
            if(params.node.data.ID == null){
              if(isNaN(this.updatedata.RemainingBalance) || isNaN(this.updatedata.ReceivedQty) || isNaN(this.updatedata.OpeningBalance) ){
                alert("RemainingBalance, ReceivedQty and OpeningBalance fields allows only numerical value !");
                return false;
              }
              const listName = this.listInfo.name;
              const listInfo = {
                name: listName,
                //rId: params.node.data.Id,
                item: this.updatedata,
              }
              
              this.sharepointlistService.saveListItem(listInfo).then((res:any)=>{
                const accessoryCode = this.updatedata.AccessoryCode;
                const stockListsUrl = "https://bergerpaintsbd.sharepoint.com/sites/BergerTech/_api/web/lists/getByTitle('ITAccessoriesStock')/items?&$top=2000&$select=ID,GUID,RemainingBalance&$filter=AccessoryCode eq '" + accessoryCode + "'";
                //mconst stockListsUrl = "https://portal.bergerbd.com/leaveauto/_api/web/lists/getByTitle('ITAccessoriesStock')/items?&$top=2000&$select=ID,GUID,RemainingBalance&$filter=AccessoryCode eq '" + accessoryCode + "'";
                this.httpClient.get(stockListsUrl).subscribe((data:any) =>{

                  const stockListItems = JSON.parse(JSON.stringify(data['value']));

                  if(stockListItems.length >0){
                    const remBal = this.updatedata.RemainingBalance ;
                    const availability = this.updatedata.Availability;                   
                    const stockListInfo = {
                      name: "ITAccessoriesStock",
                      rId: stockListItems[0].ID,
                      item: {
                        "RemainingBalance": remBal,
                        "Availability": availability
                      },
                    }

                    this.sharepointlistService.updateListItem(stockListInfo);
                    
                  }
                  else{
                    //===save in the "ITAccessoriesStock" list as a new item
                    const newData = {
                      AccessoryCode: this.updatedata.AccessoryCode,
                      AccessoryCategory: this.updatedata.AccessoryCategory,
                      AccessorySubCategory: this.updatedata.AccessorySubCategory,
                      AccessoryName: this.updatedata.AccessoryName, 
                      RemainingBalance: Number(this.updatedata.RemainingBalance),
                      UOM: this.updatedata.UOM,
                      Availability : this.updatedata.Availability
                    };

                    const stockListInfo = {
                      name: "ITAccessoriesStock",
                      //rId: stockListItems[0].ID,
                      item: newData,
                    }

                    this.sharepointlistService.saveListItem(stockListInfo);
                  }
                });
              });

            }else{
              if(isNaN(this.updatedata.RemainingBalance) || isNaN(this.updatedata.ReceivedQty) || isNaN(this.updatedata.OpeningBalance) ){
                alert("RemainingBalance, ReceivedQty and OpeningBalance fields allows only numerical value !");
                return false;
              }
              const listName = (params.node.data['odata.type']).slice(8, -8);
              const listInfo = {
                name: listName,
                rId: params.node.data.Id,
                item: this.updatedata,
              }
  
              this.sharepointlistService.updateListItem(listInfo).then((res:any)=>{
                const accessoryCode = this.updatedata.AccessoryCode;
                const stockListsUrl = this.siteAbsoluteUrl + "/leaveauto/_api/web/lists/getByTitle('ITAccessoriesStock')/items?&$top=2000&$select=ID,GUID,RemainingBalance&$filter=AccessoryCode eq '" + accessoryCode + "'";
                
                this.httpClient.get(stockListsUrl).subscribe((data:any) =>{

                  const stockListItems = JSON.parse(JSON.stringify(data['value']));

                  if(stockListItems.length >0){
                    const remBal = this.updatedata.RemainingBalance ;
                    const availability = this.updatedata.Availability;                    
                    const stockListInfo = {
                      name: "ITAccessoriesStock",
                      rId: stockListItems[0].ID,
                      item: {
                        "RemainingBalance":remBal,
                        "Availability": availability
                      },
                    }

                    this.sharepointlistService.updateListItem(stockListInfo);
                    
                  }else{
                    alert("Fetching List info failed !");
                  }
                });
              });
            }

            
          
          }

          //== resize the Row Height ===
          params.node.setRowHeight(25);        
          this.mpTG.gridApi.onRowHeightChanged();
          
          return null;
        })

      }
      else if (action === "cancel") {
        params.api.stopEditing(true);

        //== resize the Row Height ===
        params.node.setRowHeight(25);        
        this.mpTG.gridApi.onRowHeightChanged();
      }
    }
  }

  onRowEditingStarted(params:RowEditingStartedEvent) {
    //this.mpTG.gridApi.refreshCells({force: true});
    params.api.refreshCells({
      columns: ["ID"],
      rowNodes: [params.node],
      force: true
    });
  }

  onRowEditingStopped(params:RowEditingStoppedEvent) {
    params.api.refreshCells({
      columns: ["ID"],
      rowNodes: [params.node],
      force: true
    });
  }

  onCellEditingStarted(event: CellEditingStartedEvent) {
    console.log('cellEditingStarted');
  }

  onCellEditingStopped(event: CellEditingStoppedEvent) {
    console.log('cellEditingStopped');
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

}

//let rowHeight; 
let groupHeight:any;










