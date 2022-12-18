import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Renderer2
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

import { ActivatedRoute } from '@angular/router'; // to read the url route

//=========for voice recognition ===========
import { TransferState, makeStateKey } from '@angular/platform-browser';
//import { WebsocketService } from '@portal/core';
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
// import 'ag-grid-enterprise';
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

  constructor(public http: HttpClient) { }


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




declare let webkitSpeechRecognition: any; // for voice recognition



@Component({
  selector: 'portal-parentdashboardlanding',
  templateUrl: './parentdashboardlanding.component.html',
  styleUrls: ['./parentdashboardlanding.component.scss'],
})
export class ParentdashboardlandingComponent implements OnInit, AfterViewInit {
  panelOpenState = false;
  tg = new Tablegrid();
  
  //siteAbsoluteUrl = window.location.origin;
  siteAbsoluteUrl = "https://portal.bergerbd.com/";
  //public rowDataCM: string;
  public rowDataWP: any;
  mpTG = new Tablegrid();
  public workflows = [];
  rowData: any;
  public txtOfQuickSearchInpFld:any;
  //public rowHeight:any;

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  rowData$!: Observable<any[]>;

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
    wfName: '',
    acessPermission: "Unauthorized",
    listIndex: 0,
    serviceFnName: 'fetchListItemWithExpStFilOrd',
    config: {},
    mapedData: {d:[]},
    recMstLocDat: {d:[]}
  };

  socket:any;
  recentMstLocData:any;
  dashboardsListsInfo:any;
  elementRenderer!:any;
  updatedata!:any;

  
  displayText = "";

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      //'Content-Type': 'application/json',

      // "ACCEPT": "application/json;odata=verbose",
      // "content-type": "application/json;odata=verbose"

      "Accept": "application/json; odata=verbose",
      "Content-Type": "application/json; odata=verbose",
      "X-HTTP-Method": "MERGE",
      'IF-MATCH': "*"
    }),
  };


  constructor(
    private sharepointlistService: SharepointlistService,
    private _actRoute: ActivatedRoute,
    //private websocketService: WebsocketService,
    private httpClient: HttpClient,
    elRenderer: Renderer2
    ) { this.elementRenderer = elRenderer}
    

  // updateLocalStorage(){
  //    const writeToFile = this.clickedDashboardInfo.config['WfName'] +'/'+  this.clickedDashboardInfo.config['MasterListInfo'].name +'/recent.json' ;
  //    const config ={
  //     proName: this.clickedDashboardInfo.config['WfName'],
  //     fileName: writeToFile
  //    }

  //    return new Promise((resolve, reject)=>{
  //     if(this.clickedDashboardInfo.mapedData.d.length >0){     
        
  //       const emitData:any = new Observable(emitDataOutput =>{ 
  //         const emitService = this.websocketService.emit('updateData', (this.clickedDashboardInfo.mapedData.d).slice(0, 20), config);         
  //         emitDataOutput.next(emitService);

  //         emitDataOutput.next(emitData.unsubscribe());
  //       })

  //       emitData.subscribe(res => {
  //         //res;
  //       })

  //       emitData.unsubscribe();
  //       //this.websocketService.emit('updateData', (this.clickedDashboardInfo.mapedData.d).slice(0, 20), config);
  //       //resolve("updateData successfull !"); 

  //       reject("updateData successfull !");
  //     }else{
  //        console.log("Mapped Data is not available to update with !")
  //      }      
  //   })     
  // }

  getMappedData(){ 
    //========mapping for EmployeeReimbursement===========  
    return new Promise((resolve, reject)=>{
      if(this.clickedDashboardInfo.wfName == 'EmployeeReimbursement'){
        const mapedData = (JSON.parse((JSON.stringify(this.rowData)))).map((e:any) => ({
          Title: e.Title,
          ID: e.ID,
          GUID: e.GUID,
          Modified: e.Modified,
          Created: e.Created,
          Status: e.Status,
          PendingWith: { ID: e.PendingWith.ID, Title: e.PendingWith.Title },
          Author: { ID: e.Author.ID, Title: e.Author.Title, Office: e.Author.Office, JobTitle: e.Author.JobTitle },
          EmployeeId: e.EmployeeId,
          Entitlement: e.Entitlement,
          GLCode: e.GLCode,
          CostCenter: e.CostCenter,
          TotalReimbursementAmount: e.TotalReimbursementAmount,
          ItemName: e.ItemName
        })) 
  
        //update local in memory from storage by recently fetched data from SP list 
        this.clickedDashboardInfo.mapedData.d = mapedData;
  
        setTimeout(function(){ 
          //======performane testing =====
          const startForEach = performance.now()
          mapedData.forEach((x:any) => (x + x) * 10000000000)
          const endForEach = performance.now()
          console.log(`Speed [forEach]: ${endForEach - startForEach} miliseconds`)
  
          const startMap = performance.now()
          mapedData.map((x:any) => (x + x) * 10000000000)
          const endMap = performance.now()
          console.log(`Speed [map]: ${endMap - startMap} miliseconds`)
          //-----------------------  
        }, 1000);

        resolve(mapedData);
        return mapedData;
      }
      
      else if(this.clickedDashboardInfo.wfName == 'MobileHandsetRequests'){
        const mapedData = (JSON.parse((JSON.stringify(this.rowData)))).map((e:any) => ({
          Title: e.Title,
          ID: e.ID,
          GUID: e.GUID,
          Modified: e.Modified,
          Created: e.Created,
          Status: e.Status,
          PendingWith: { ID: e.PendingWith.ID, Title: e.PendingWith.Title },
          Author: { ID: e.Author.ID, Title: e.Author.Title, Office: e.Author.Office, JobTitle: e.Author.JobTitle },
          EmployeeId: e.EmployeeId,
          Justification: e.Justification
        })) 
  
        //update local in memory from storage by recently fetched data from SP list 
        this.clickedDashboardInfo.mapedData.d = mapedData;
  
        setTimeout(function(){ 
          //======performane testing =====
          const startForEach = performance.now()
          mapedData.forEach((x:any) => (x + x) * 10000000000)
          const endForEach = performance.now()
          console.log(`Speed [forEach]: ${endForEach - startForEach} miliseconds`)
  
          const startMap = performance.now()
          mapedData.map((x:any) => (x + x) * 10000000000)
          const endMap = performance.now()
          console.log(`Speed [map]: ${endMap - startMap} miliseconds`)
          //-----------------------  
        }, 1000);

        resolve(mapedData);
        return mapedData;
      }

      else if(this.clickedDashboardInfo.wfName == 'PoolCarRequisition'){
        const mapedData = (JSON.parse((JSON.stringify(this.rowData)))).map((e:any) => ({
          Title: e.Title,
          ID: e.ID,
          GUID: e.GUID,
          Modified: e.Modified,
          Created: e.Created,
          Status: e.Status,
          PendingWith: { ID: e.PendingWith.ID, Title: e.PendingWith.Title },
          Author: { ID: e.Author.ID, Title: e.Author.Title, Office: e.Author.Office, JobTitle: e.Author.JobTitle },
          EmployeeId: e.EmployeeId,
          StartDate: e.StartDate,
          EndDate: e.EndDate,
          NoOfDays: e.NoOfDays,
          StartTime: e.StartTime,
          EndTime: e.EndTime,
          TotalHours: e.TotalHours,
          AccompaniedPersonNo: e.AccompaniedPersonNo,
          AccompaniedPersonsName: e.AccompaniedPersonsName,
          PurposeOfVisit: e.PurposeOfVisit
        })) 
        this.clickedDashboardInfo.mapedData.d = mapedData;     

        resolve(mapedData);
        return mapedData;
      }

      else if(this.clickedDashboardInfo.wfName == 'EmployeeAdvanceRequest'){
        const mapedData = (JSON.parse((JSON.stringify(this.rowData)))).map((e:any) => ({
          Title: e.Title,
          ID: e.ID,
          GUID: e.GUID,
          Modified: e.Modified,
          Created: e.Created,
          Status: e.Status,
          PendingWith: { ID: e.PendingWith.ID, Title: e.PendingWith.Title },
          Author: { ID: e.Author.ID, Title: e.Author.Title, Office: e.Author.Office, JobTitle: e.Author.JobTitle },
          EmployeeId: e.EmployeeId,
          Description: e.Description,
          Amount: e.Amount,
          Date: e.Date,
          PurposeType: e.PurposeType,
          Purpose: e.Purpose,
          Location: e.Location,
          AdjustmentAmount: e.AdjustmentAmount,
          ReasonNotAdjust: e.ReasonNotAdjust,
          ActualExpenditureDate: e.ActualExpenditureDate,
          ActualExpenditureAmount: e.ActualExpenditureAmount,
          ClaimOrRefundAmountDate: e.ClaimOrRefundAmountDate,
          ClaimOrRefundAmount: e.ClaimOrRefundAmount,
          MRNO: e.MRNO,
          IsAdjusted: e.IsAdjusted
        })) 

  
        //update local in memory from storage by recently fetched data from SP list 
        this.clickedDashboardInfo.mapedData.d = mapedData;     

        resolve(mapedData);
        return mapedData;
      }

      else if(this.clickedDashboardInfo.wfName == 'EmployeePaintDiscount'){
        const mapedData = (JSON.parse((JSON.stringify(this.rowData)))).map((e:any) => ({
          Title: e.Title,
          ID: e.ID,
          GUID: e.GUID,
          Modified: e.Modified,
          Created: e.Created,
          Status: e.Status,
          PendingWith: { ID: e.PendingWith.ID, Title: e.PendingWith.Title },
          Author: { ID: e.Author.ID, Title: e.Author.Title, Office: e.Author.Office, JobTitle: e.Author.JobTitle },
          EmployeeId: e.EmployeeId,
          DeliveryOffice: e.DeliveryOffice
        })) 
  
        //update local in memory from storage by recently fetched data from SP list 
        this.clickedDashboardInfo.mapedData.d = mapedData;

        resolve(mapedData);
        return mapedData;
      }

      else if(this.clickedDashboardInfo.wfName == 'HRServices'){
        const mapedData = (JSON.parse((JSON.stringify(this.rowData)))).map((e:any) => ({
          Title: e.Title,
          ID: e.ID,
          GUID: e.GUID,
          Modified: e.Modified,
          Created: e.Created,
          Status: e.Status,
          PendingWith: { ID: e.PendingWith.ID, Title: e.PendingWith.Title },
          Author: { ID: e.Author.ID, Title: e.Author.Title, Office: e.Author.Office, JobTitle: e.Author.JobTitle },
          EmployeeId: e.EmployeeId,
          RequestFor: e.RequestFor,
          VisitPurpose: e.VisitPurpose,
          WhenNeed: e.WhenNeed,
          TaskAssignDate: e.TaskAssignDate,
          RequestedById: e.RequestedById
        })) 
  
        //update local in memory from storage by recently fetched data from SP list 
        this.clickedDashboardInfo.mapedData.d = mapedData;

        resolve(mapedData);
        //return mapedData;
      }
    })
      
     

          
    //------mapping ends---------
  }

  async getGridReadyprocesses(){
    try{
      //await this.getSelectedDashboardInfo(this.clickedDashboardInfo);
      this.listInfo.top = 200000;
      await this.getRowData(this.clickedDashboardInfo);
      await this.getTitleTag(this.rowData);
      // # map data of this dashboard SP list  #
      await this.getMappedData();
      // # emit to loc Server to strore in loc file #
      //await this.updateLocalStorage();   
      //this.websocketService.subscribe();   
    } 
    catch(err){
      console.log("Error: " + err)
    }
  }

  ngAfterViewInit(){
    console.log('ngAfterViewInit called before onGridReady() and after ngOnInit() ...............');    
  }

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
    
  }

  createColDef(i:any) {

    const htmlEleRenderer = this.elementRenderer;

    return new Promise((resolve, reject)=>{    
    
        this.dashboardsListsInfo[i.listIndex].DbViewColDef.forEach((element:any, index:number ) => {
          
          const ftype = element.fldType;
          const eGui: HTMLDivElement = htmlEleRenderer.createElement('div');          
          const mpTgColDef = new ColumnDefinition(i, element, eGui);    
          return this.mpTG.columnDefs.push(mpTgColDef.fieldMapper(element));          
    
        });

        resolve(this.mpTG.columnDefs);

    })    
  }

  createColDef_Old(i:any) {

    const htmlEleRenderer = this.elementRenderer;

    return new Promise((resolve, reject)=>{
        function setTitleWithMDField(el:any) {
          return {
            headerName: el.headerName,
            field: el.field,
            cellRenderer: 'agGroupCellRenderer',
            sortable: true,
            enableRowGroup: false,
            filter: 'agSetColumnFilter',
            filterParams: {
              resetButton: true,
            },
            minWidth: el.minWidth,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            editable: false,
            cellClass: "titleWithMDFieldClass",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  textItems: 'center !important',
                  display: 'flex',
                  alignSelf: 'normal',
                  marginTop: '-8px',
                  marginBottom: '0px',
                  borderBottom: '0px',
                  paddingBottom: '0px'
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            }
          };
        }
    
        function setTitleWitouthMDField(el:any) {
          return {
            headerName: el.headerName,
            field: el.field,
            //cellRenderer: 'agGroupCellRenderer',
            sortable: true,
            enableRowGroup: false,
            filter: 'agSetColumnFilter',
            filterParams: {
              resetButton: true,
            },
            minWidth: el.minWidth,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            cellClass: "ag-header-group-cell-label",
            editable: false,
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            },
          };
        }
    
        function setDateField(el:any) {
          const dtFld = {
            headerName: el.headerName,
            //valueGetter: function (params:any) { if (params.data[el.valueGetter] != null && params.data[el.valueGetter] != undefined) { return moment((params.data[el.valueGetter]).split("T")[0]).format("DD MMM, YYYY"); } },            
            sortable: true,
            enableRowGroup: true,
            filter: 'agDateColumnFilter',
            filterParams: {
              // comparator: function (filterLocalDateAtMidnight:any, cellValue:any) {
              //   const dateAsString = moment(cellValue).format('DD/MM/YYYY');
              //   const dateParts = dateAsString.split('/');
              //   const cellDate = new Date(
              //     Number(dateParts[2]),
              //     Number(dateParts[1]) - 1,
              //     Number(dateParts[0])
              //   );
              //   if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
              //     return 0;
              //   }
              //   if (cellDate < filterLocalDateAtMidnight) {
              //     return -1;
              //   }
              //   if (cellDate > filterLocalDateAtMidnight) {
              //     return 1;
              //   }
              // },
              //applyButton: true,
              resetButton: true,
            },
            // valueFormatter: function(params) {
            //     return moment(params.value).format('DD MMM, YYYY');
            // },
            columnGroupShow: 'open',
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  //color: 'red', 
                  //backgroundColor: 'green',
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            },
            minWidth: el.minWidth,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            editable: el.editable,
            cellEditor: 'agTextCellEditor'
          }
    
          return dtFld;
        }
    
        const setTextField = (el:any)=> {
          const txtFld = {
            headerName: el.headerName,
            field: el.field,
            sortable: true,
            enableRowGroup: true,
            filter: 'agSetColumnFilter',
            filterParams: {
              resetButton: true,
            },
            minWidth: el.minWidth,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            editable: el.editable,
            cellEditor: 'agTextCellEditor',
            //cellEditorPopup: true,
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            },
          }
    
          return txtFld;
        }

        function setLargeTextField(el:any) {
          const txtFld = {
            headerName: el.headerName,
            field: el.field,
            sortable: true,
            enableRowGroup: true,
            filter: 'agSetColumnFilter',
            filterParams: {
              resetButton: true,
            },
            minWidth: el.minWidth,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            editable: el.editable,
            cellEditor: 'agLargeTextCellEditor',
            //cellEditorPopup: true,
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            },
          }
    
          return txtFld;
        }

        function setSelectField(el:any) {
          const txtFld = {
            headerName: el.headerName,
            field: el.field,
            sortable: true,
            enableRowGroup: true,
            filter: 'agSetColumnFilter',
            filterParams: {
              resetButton: true,
            },
            minWidth: el.minWidth,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            editable: el.editable,
            cellEditor: 'agSelectCellEditor', //'agTextCellEditor', //'agLargeTextCellEditor',
            //cellEditorPopup: true,
            cellEditorParams: {
              values: [el.cellEditorParams],
            }, 
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            },
          }
    
          return txtFld;
        }
    
        function setNumberField(el:any) {
          const numFld = {
            headerName: el.headerName,
            field: el.field,
            sortable: true,
            enableRowGroup: true,
            filter: 'agNumberColumnFilter',
            //filter: 'agSetColumnFilter',
            filterParams: {
              resetButton: true,
            },
            minWidth: el.minWidth,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  //color: 'red', 
                  //backgroundColor: 'green',
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            }
          }
          return numFld;
        }
    
        function setViewLinkGuidField(el:any) { 
    
          const vwLnkFld = {
            headerName: el.headerName,
            field: el.field,
            cellRenderer: function (params:any) {
              return '<a href="https://portal.bergerbd.com/leaveauto/SitePages/' + i.wfName + '.aspx?UniqueId=' + params.value + '&mode=read" target="_blank">view</a>';
              //return '<a href="https://portal.bergerbd.com/leaveauto/SitePages/' + this.dashboardsListsInfo[i.listIndex].WfName + '.aspx?UniqueId=' + params.value + '&mode=read" target="_blank">View</a>'
            },
            enableRowGroup: false,
            menuTabs: ['columnsMenuTab'],
            editable: false,
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            },
            minWidth: 85,
          }
    
          return vwLnkFld;
        }

        function setActionViewLinkGuidField(el:any) {
    
          const vwLnkFld = {
            headerName: el.headerName,
            field: el.field,
            // cellRenderer: function (params:any) {
            //   const eGui: HTMLDivElement = htmlEleRenderer.createElement('div');            
            //   const editingCells = params.api.getEditingCells();
            //   const isCurrentRowEditing = editingCells.some((cell:any) => {
            //     return cell.rowIndex === params.node.rowIndex;
            //   });
            
            //   if (isCurrentRowEditing) {
            //     eGui.innerHTML = `
            //       <a  class="action-button update"  data-action="update" style="margin: 0px; padding: 0px 5px; font-size: 14px; color: blue; cursor:pointer" onmouseover="this.style.color='green'" onmouseout="this.style.color='blue'" > Update  </a>
            //       <a  class="action-button cancel"  data-action="cancel" style="margin: 0px; padding: 0px 5px; font-size: 14px; color: blue; cursor:pointer" onmouseover="this.style.color='red'" onmouseout="this.style.color='blue'" > Cancel </a>
            //       `;
            //     } else {
            //       eGui.innerHTML = `
            //         <a href="https://portal.bergerbd.com/leaveauto/SitePages/${i.wfName}.aspx?UniqueId=${params.value}&mode=read" target="_blank">view</a>
            //         <a class="action-button edit"  data-action="edit" style="margin: 0px; padding: 0px 5px; font-size: 14px; color: blue; cursor:pointer" onmouseover="this.style.color='green'" onmouseout="this.style.color='blue'" >Edit</a>
            //         `;
            //     }
            //     return eGui;
            // },

            cellRenderer: function (params:any) {
              const eGui: HTMLDivElement = htmlEleRenderer.createElement('div');            
              const editingCells = params.api.getEditingCells();
              const isCurrentRowEditing = editingCells.some((cell:any) => {
                return cell.rowIndex === params.node.rowIndex;
              });
            
              if (isCurrentRowEditing) {
                eGui.innerHTML = `
                  <a  class="action-button update"  data-action="update" style="margin: 0px; padding: 0px 5px; font-size: 14px; color: blue; cursor:pointer" onmouseover="this.style.color='green'" onmouseout="this.style.color='blue'" > Update  </a>
                  <a  class="action-button cancel"  data-action="cancel" style="margin: 0px; padding: 0px 5px; font-size: 14px; color: blue; cursor:pointer" onmouseover="this.style.color='red'" onmouseout="this.style.color='blue'" > Cancel </a>
                  `;
                } else {
                  eGui.innerHTML = `                    
                    <Button class="action-button edit" data-action="edit" variant="outlined" color="primary" (click)="handleUpdate(params.data)" style="height:20px;">Edit</Button>
                    <Button class="action-button delete" data-action="delete" variant="outlined" color="secondary" style="height:20px;">Delete</Button>                    
                    `;
                }
                return eGui;
            },           
            enableRowGroup: false,
            menuTabs: [],
            editable: false,
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            },
            minWidth: el.minWidth,
          }
    
          return vwLnkFld;
        }
    
        function setViewLinkIdField(el:any) {
          const vwLnkFld = {
            headerName: el.headerName,
            field: el.field,
            cellRenderer: function (params:any) {
              const siteUrl = window.location.href + el.siteUrl;
              // let pageUrl = el.pageUrl;
              // let qString = el.qString;
              // let qVal = el.qVal;
              // let mode1 = el.mode1;
    
              return '<a href="' + siteUrl + el.pageUrl + '?' + el.qString + '=' + params.data.ID + '&' + el.mode1 + el.mode2 + '" target="_blank">View</a>';
    
            },
            enableRowGroup: false,
            menuTabs: ['generalMenuTab', 'columnsMenuTab'],
            editable: false,
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            },
            minWidth: el.minWidth,
          }
    
          return vwLnkFld;
        }
    
        function setGetSetDateField(el:any) {
          const dtFld = {
            headerName: el.headerName,
            valueGetter: function (params:any) { 
              if (params.data[el.valueGetter] != null && params.data[el.valueGetter] != undefined) { 
                return moment((params.data[el.valueGetter]).split("T")[0]).format("DD MMM, YYYY"); 
              } 
              return null;
            },
            //valueGetter: el.valueGetter,
            //valueGetter: function(params){return moment((params.data.Created).split("T")[0]).format("DD MMM, YYYY")},
            //valueSetter: el.valueSetter,
            sortable: true,
            enableRowGroup: true,
            filter: 'agDateColumnFilter',
            filterParams: {
              comparator: function (filterLocalDateAtMidnight:any, cellValue:any) {
                const dateAsString = moment(cellValue).format('DD/MM/YYYY');
                const dateParts = dateAsString.split('/');
                const cellDate = new Date(
                  Number(dateParts[2]),
                  Number(dateParts[1]) - 1,
                  Number(dateParts[0])
                );
                if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                  return 0;
                }
                if (cellDate < filterLocalDateAtMidnight) {
                  return -1;
                }
                if (cellDate > filterLocalDateAtMidnight) {
                  return 1;
                }
                return null;
              },
              //applyButton: true,
              resetButton: true,
            },
            columnGroupShow: 'open',
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  //color: 'red', 
                  //backgroundColor: 'green',
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            },
            minWidth: el.minWidth,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            editable: el.editable,
            cellEditor: 'agTextCellEditor',
            //cellEditorPopup: true,
          }
    
          return dtFld;
        }
    
        function setGetSetTextField(el:any) {
          const txtFld = {
            headerName: el.headerName,
            //field: el.field,
            valueGetter: el.valueGetter,
            //valueGetter: function(params){if(params.data[el.valueGetter] != null && params.data[el.valueGetter] != undefined){console.log(el.valueGetter); return el.valueGetter}},
            //valueSetter: el.valueSetter,
            sortable: true,
            enableRowGroup: true,
            filter: 'agSetColumnFilter',
            filterParams: {
              resetButton: true,
            },
            minWidth: el.minWidth,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            editable: el.editable,
            cellEditor: 'agTextCellEditor',
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            },
          }
    
          return txtFld;
        }
    
        function setGetSetNumberField(el:any) {
          const numFld = {
            headerName: el.headerName,
            //field: el.field,
            valueGetter: el.valueGetter,
            //valueSetter: el.valueSetter,
            sortable: true,
            enableRowGroup: true,
            filter: 'agNumberColumnFilter',
            //filter: 'agSetColumnFilter',
            filterParams: {
              resetButton: true,
            },
            minWidth: el.minWidth,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  //color: 'red', 
                  //backgroundColor: 'green',
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            },
            editable: el.editable,
            cellEditor: 'agTextCellEditor'
          }
          return numFld;
        }
    
        function setCustomLinkField(el:any) {
          const vwLnkFld = {
            headerName: el.headerName,
            field: el.field,
            // cellRenderer: function (params:any) {
            //   return '<a href="https://portal.bergerbd.com/leaveauto/SitePages/' + this.dashboardsListsInfo[i.listIndex].WfName + '.aspx?UniqueId=' + params.value + '&mode=read" target="_blank">View</a>';    
            // },
            enableRowGroup: false,
            menuTabs: ['generalMenuTab', 'columnsMenuTab'],
            editable: false,
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            },
            minWidth: el.minWidth,
          }
    
          return vwLnkFld;
        }
    
        function setGetSetPeopleField(el:any) {
          const txtFld = {
            headerName: el.headerName,
            //field: el.field,
            valueGetter: function (params:any) {
              let pending = "";
              if (typeof params.data[el.valueGetter].results == "object") {
                if (params.data[el.valueGetter].results.length > 0) {
                  
                  for (let i = 0; i < (params.data[el.valueGetter].results.length); i++) {
                    pending += params.data[el.valueGetter].results[i].Title + ';  ';
                  }
                  // (params.data[el.valueGetter].results).forEach(ele => {
                  //   pending += ele.Title + ';  ';
                  //   return pending;
                  // }); 
                  return pending;
                  //return params.data[el.valueGetter].results.length;         
                }
                //return params.data[el.valueGetter].results.length;
                //return params.data[el.valueGetter].results[0].Title;
              }
              return pending;
              //return '';
            },
            //valueSetter: el.valueSetter,
            sortable: true,
            enableRowGroup: true,
            filter: 'agSetColumnFilter',
            filterParams: {
              resetButton: true,
            },
            cellStyle: { 'white-space': 'normal', 'line-height': 1.5 },
            autoHeight: true,
            minWidth: el.minWidth,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            //cellClass: "ag-header-group-cell-label",
            // cellStyle: function(params) {
            //   if (params.value !='') {
            //       return {
            //       textAlign: 'center', 
            //       display: 'flex',
            //     };
            //   } else {
            //       return {
            //         textAlign: 'center',
            //       }
            //     }
            // },    
          }
    
          return txtFld;
        }
    
        const setGetSetMulLinTextField = (el:any)=>{
          const txtFld = {
            headerName: el.headerName,
            //field: el.field,        
            valueGetter: function (params:any) {
              return params.data[el.valueGetter];
            },
            //valueSetter: el.valueSetter,
            sortable: true,
            enableRowGroup: true,
            filter: 'agSetColumnFilter',
            filterParams: {
                resetButton: true,
            },
            minWidth: el.minWidth,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            cellClass: "ag-header-group-cell-label",
            cellStyle: { 'white-space': 'normal', 'line-height': 1.5 },
            autoHeight: true,
            editable: el.editable,
            cellEditor: 'agLargeTextCellEditor',
            cellEditorPopup: true,   
          }
    
          return txtFld;
        }
    
    
    
        this.dashboardsListsInfo[i.listIndex].DbViewColDef.forEach((element:any, index:number ) => {
          
          //========= with object notation ================
          const ftype = element.fldType;

          const obj:any = {
            "TitleWithMDField": setTitleWithMDField(element),
            "TitleWitouthMDField": setTitleWitouthMDField(element),
            "DateField": setDateField(element),
            "TextField": setTextField(element),
            "LargeTextField": setLargeTextField(element),
            "NumberField": setNumberField(element),
            "GetSetDateField": setGetSetDateField(element),
            "GetSetTextField": setGetSetTextField(element),
            "GetSetLargeTextField": setLargeTextField(element),
            "GetSetNumberField": setGetSetNumberField(element),
            "CustomLinkField": setCustomLinkField(element),
            "GetSetPeopleField": setGetSetPeopleField(element),
            "GetSetMulLinTextField": setGetSetMulLinTextField(element),
            "SelectField": setSelectField(element),
            "ActionViewLinkGuidField": setActionViewLinkGuidField(element),
            "ViewLinkGuidField": setViewLinkGuidField(element),
            "ViewLinkIdField": setViewLinkIdField(element)
          };          
    
          return this.mpTG.columnDefs.push(obj[ftype]);


          //========== with traditional if-else condition ===================
    
          // if (element.fldType == "TitleWithMDField") {
          //   this.mpTG.columnDefs.push(setTitleWithMDField(element));
          // }
          // else if (element.fldType == "TitleWitouthMDField") {
          //   this.mpTG.columnDefs.push(setTitleWitouthMDField(element));
          // }
          // else if (element.fldType == "DateField") {
          //   this.mpTG.columnDefs.push(setDateField(element));
          // }
          // else if (element.fldType == "TextField") {
          //   this.mpTG.columnDefs.push(setTextField(element));
          // }
          // else if (element.fldType == "LargeTextField") {
          //   this.mpTG.columnDefs.push(setLargeTextField(element));
          // }
          // else if (element.fldType == "SelectField") {
          //   this.mpTG.columnDefs.push(setSelectField(element));
          // }
          // else if (element.fldType == "NumberField") {
          //   this.mpTG.columnDefs.push(setNumberField(element));
          // }
          // else if (element.fldType == "ActionViewLinkGuidField") {
          //   this.mpTG.columnDefs.push(setActionViewLinkGuidField(element)); 
          // }
          // else if (element.fldType == "ViewLinkGuidField") {
          //   this.mpTG.columnDefs.push(setViewLinkGuidField(element));  
          //   this.dbTagUrlInfo.qryStrKeyTyp = 'GUID';
          //   this.dbTagUrlInfo.urlVoice = 'https://portal.bergerbd.com/leaveauto/SitePages/' + this.dashboardsListsInfo[i.listIndex].WfName + '.aspx?UniqueId=';
          // }
          // else if (element.fldType == "ViewLinkIdField") {
          //   this.mpTG.columnDefs.push(setViewLinkIdField(element));
          //   this.dbTagUrlInfo.qryStrKeyTyp = 'ID';
          //   //this.dbTagUrlInfo.urlVoice = window.location.href + element.pageUrl + '?' + element.qString + '=';
          //   this.dbTagUrlInfo.urlVoice = 'https://portal.bergerbd.com/' + element.siteUrl + element.pageUrl + '?' + element.qString + '=';
          //   this.dbTagUrlInfo.mode1 = element.mode1;
          //   this.dbTagUrlInfo.mode2 = element.mode2;
          // }
          // else if (element.fldType == "GetSetDateField") {
          //   this.mpTG.columnDefs.push(setGetSetDateField(element));
          // }
          // else if (element.fldType == "GetSetTextField") {
          //   this.mpTG.columnDefs.push(setGetSetTextField(element));
          // }
          // else if (element.fldType == "GetSetLargeTextField") {
          //   this.mpTG.columnDefs.push(setLargeTextField(element));
          // }
          // else if (element.fldType == "GetSetNumberField") {
          //   this.mpTG.columnDefs.push(setGetSetNumberField(element));
          // }
          // // else if (element.fldType == "GetSetNumberField") {
          // //   this.mpTG.columnDefs.push(setGetSetNumberField(element));
          // // }
          // else if (element.fldType == "CustomLinkField") {
          //   this.mpTG.columnDefs.push(setCustomLinkField(element));
          // }
          // else if (element.fldType == "GetSetPeopleField") {
          //   this.mpTG.columnDefs.push(setGetSetPeopleField(element));
          // }
          // else if (element.fldType == "GetSetMulLinTextField") {
          //   this.mpTG.columnDefs.push(setGetSetMulLinTextField(element));
          // }
    
        });

        resolve(this.mpTG.columnDefs);

    })    
  }

  // importLocalStorageData(){

  //   return new Promise((resolve, reject)=>{

  //     //let recMstLocFil = 'src/assets/businessprocesslocaldata/'+ this.clickedDashboardInfo.wfName +'/'+ this.clickedDashboardInfo.config['MasterListInfo'].name +'/recent.json';
      
  //     const recMstLocFilImport = import('src/assets/businessprocesslocaldata/'+ this.clickedDashboardInfo.wfName +'/'+ this.clickedDashboardInfo.config['MasterListInfo'].name +'/recent.json');
  //     //let recMstLocFilImport = import('src/assets/businessprocesslocaldata/'+ this.clickedDashboardInfo.wfName +'/'+ this.clickedDashboardInfo.config['MasterListInfo'].name +'/recent.json');

  //     recMstLocFilImport.then(res => {
  //       if( res.default.length > 0){ //check wheather target file includes any array with no item
  //         this.clickedDashboardInfo.recMstLocDat.d = res.default;
  //         resolve(res.default);
  //       }else{
  //         this.getSelectedDashboardInfo(this.clickedDashboardInfo).then(res=>{
  //           this.getRowData(this.clickedDashboardInfo).then(res =>{
  //             resolve(res);
  //           });
  //         });        
  //       } 
  //     })
      
          
     
  //     // if(this.clickedDashboardInfo.wfName == 'PoolCarRequisition'){
  //     //   import('src/assets/businessprocesslocaldata/PoolCarRequisition/PoolCarRequisitionInfo/recent.json').then(data => {
  //     //     if( data.default.length > 0){ //check wheather target file includes any array with no item
  //     //       this.clickedDashboardInfo.recMstLocDat.d = data.default;
  //     //       resolve(data.default);
  //     //     }     
  //     //   });
  //     // }

  //     // else if(this.clickedDashboardInfo.wfName == 'EmployeePaintDiscount'){
  //     //   import('src/assets/businessprocesslocaldata/EmployeePaintDiscount/EmpPaintDiscountRequest/recent.json').then(data => {
  //     //     if( data.default.length > 0){ //check wheather target file includes any array with no item
  //     //       this.clickedDashboardInfo.recMstLocDat.d = data.default;
  //     //       resolve(data.default);
  //     //     }else{
  //     //       this.getSelectedDashboardInfo(this.clickedDashboardInfo).then(res=>{
  //     //         this.getRowData(this.clickedDashboardInfo).then(res=>{
  //     //           resolve(res);
  //     //         });
  //     //       });        
  //     //     }      
  //     //   });
  //     // }

  //     // else if(this.clickedDashboardInfo.wfName == 'HRServices'){
  //     //   import('src/assets/businessprocesslocaldata/HRServices/HRServices/recent.json').then(data => {
  //     //     if( data.default.length > 0){ //check wheather target file includes any array with no item
  //     //       this.clickedDashboardInfo.recMstLocDat.d = data.default;
  //     //       resolve(data.default);
  //     //     }else{
  //     //       this.getSelectedDashboardInfo(this.clickedDashboardInfo).then(res=>{
  //     //         this.getRowData(this.clickedDashboardInfo).then(res=>{
  //     //           resolve(res);
  //     //         });
  //     //       });        
  //     //     }       
  //     //   });
  //     // }
      
  //     // else if(this.clickedDashboardInfo.wfName == 'EmployeeReimbursement'){
  //     //   import('src/assets/businessprocesslocaldata/EmployeeReimbursement/ReimburseMaster/recent.json').then(data => {
  //     //     if( data.default.length > 0){ //check wheather target file includes any array with no item
  //     //       this.clickedDashboardInfo.recMstLocDat.d = data.default;
  //     //       resolve(data.default);
  //     //     }else{
  //     //       this.getSelectedDashboardInfo(this.clickedDashboardInfo).then(res=>{
  //     //         this.getRowData(this.clickedDashboardInfo).then(res=>{
  //     //           resolve(res);
  //     //         });
  //     //       });        
  //     //     }      
  //     //   });
  //     // }
  //     // else if(this.clickedDashboardInfo.wfName == 'MobileHandsetRequests'){
  //     //   import('src/assets/businessprocesslocaldata/MobileHandsetRequests/MobileHandsetRequests/recent.json').then(data => {
  //     //     if( data.default.length > 0){ //check wheather target file includes any array with no item
  //     //       this.clickedDashboardInfo.recMstLocDat.d = data.default;
  //     //       resolve(data.default);
  //     //     }else{
  //     //       this.getSelectedDashboardInfo(this.clickedDashboardInfo).then(res=>{
  //     //         this.getRowData(this.clickedDashboardInfo).then(res=>{
  //     //           resolve(res);
  //     //         });
  //     //       });        
  //     //     }       
  //     //   });
  //     // }

  //     // else if(this.clickedDashboardInfo.wfName == 'MobileHandsetRequests'){
  //     //   import('src/assets/businessprocesslocaldata/MobileHandsetRequests/MobileHandsetRequests/recent.json').then(data => {
  //     //     if( data.default.length > 0){ //check wheather target file includes any array with no item
  //     //       this.clickedDashboardInfo.recMstLocDat.d = data.default;
  //     //       resolve(data.default);
  //     //     }else{
  //     //       this.getSelectedDashboardInfo(this.clickedDashboardInfo).then(res=>{
  //     //         this.getRowData(this.clickedDashboardInfo).then(res=>{
  //     //           resolve(res);
  //     //         });
  //     //       });        
  //     //     }       
  //     //   });
  //     // }

  //     // else{
  //     //   this.getSelectedDashboardInfo(this.clickedDashboardInfo).then(res=>{
  //     //     this.getRowData(this.clickedDashboardInfo).then(res=>{
  //     //       resolve(res);
  //     //     });
  //     //   });        
  //     // }

       
  //   })
    
  // }

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
    let apiUrl = `https://portal.bergerbd.com/leaveauto/_api/web/lists/getByTitle('${listname}')/items?&$top=${itmNum}&$select=${selQry}&$filter=Author/ID eq '${this.logedInUser.aDId}' `; 
    //let apiUrl = `https://portal.bergerbd.com/leaveauto/_api/web/lists/getByTitle('${listname}')/items?&$top=${itmNum}&$select=${selQry} `; 
    return new Promise((resolve, reject)=>{ 
      if(this.logedInUser.access != 'NoAccess'){

        if(this.logedInUser.office != "Corporate"){
          apiUrl = `https://portal.bergerbd.com/leaveauto/_api/web/lists/getByTitle('${listname}')/items?&$top=${itmNum}&$select=${selQry}&$filter=Author/ID eq '${this.logedInUser.aDId}' `; 
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
                this.rowData = parsedData;
                //this.rowData = parsedData.filter((res:any)=>{return res.Title != null});
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
      this.mpTG.rowGroupPanelShow = 'always';

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
      this.mpTG.paginationPageSize = 1000;
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

  //=======step-1
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
          this.displayText = this.dashboardsListsInfo[wfIndex].DisplayTxt;
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
            const apiUrl = `https://portal.bergerbd.com/_api/web/sitegroups/getByName('${authGrp}')/Users?$filter=Id eq ${this.logedInUser.aDId}` ;
            
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

    // return new Promise((resolve, reject)=>{
    //   this._actRoute.paramMap.subscribe(url => {
    //     const wfName = url.get('id');
    //     this.dashboardsListsInfo[0].wfName = wfName;
    //     if (wfName) { 
    //       this.clickedDashboardInfo.wfName = wfName;          
    //       this.clickedDashboardInfo.listIndex = this.dashboardsListsInfo.findIndex((item:any) => item.WfName === wfName);
    //       const wfIndex = this.clickedDashboardInfo.listIndex;
    //       // # pushing clickedDashboardInfo from 'this.dashboardsListsInfo' file to in memory #
    //       this.clickedDashboardInfo.config = this.dashboardsListsInfo[wfIndex];          

          

    //       // # check dashboard view access is Public or Protected # 
    //       if(this.dashboardsListsInfo[this.clickedDashboardInfo.listIndex].AcessPermission == 'Public'){
    //         this.clickedDashboardInfo.acessPermission = 'Public';
    //         this.logedInUser.access = 'FullAccess';
    //         resolve(this.clickedDashboardInfo);
    //       }else{
            
            
    //         if(aDIdGrp.length > 0){
    //           this.ifInAuthUsersADId(aDIdGrp);
    //         }

    //         if(empIdGrp.length > 0 && this.logedInUser.access != 'FullAccess'){
    //           this.ifInAuthUsersEmpId(empIdGrp).then();
    //         }

    //         if(authGrp.length > 0 && this.logedInUser.access != 'FullAccess'){
    //           this.ifInAuthGroups(authGrp);
    //         }

    //         if(this.logedInUser.access == 'FullAccess'){
    //           alert("FullAccess");
    //         }

           
            


    //         // if(this.ifInAuthUsersADId(aDIdGrp) || this.ifInAuthUsersEmpId(empIdGrp) || this.ifInAuthGroups(authGrp)){
              
    //         //   resolve(this.clickedDashboardInfo);
    //         // }


    //         // else{
    //         //   this.clickedDashboardInfo.acessPermission = 'Unauthorized';
    //         //   this.logedInUser.access = 'NoAccess';
    //         //   alert("Unauthorized Access: You have no permission to get access this page ! Please contact with admin for your access.");
    //         //   reject('NoAccess');
    //         // } 

    //       }

    //       //resolve(this.clickedDashboardInfo);
    //     }
    //     else{
    //       reject("NoAccess");
    //     }
    //   })
    // })
    
  }

  async executeOnInitProcesses(){    
    try{
      await this.checkAuthorization();
      await this.getSelectedDashboardInfo(this.clickedDashboardInfo);
      //await this.importLocalStorageData();
      await this.dashboardGridDef();
      await this.createColDef(this.clickedDashboardInfo);
      this.listInfo.top = 20;
      await this.getRowData(this.clickedDashboardInfo);
      this.listInfo.top = 2000000;
      await this.getRowData(this.clickedDashboardInfo);
      await this.getTitleTag(this.rowData);
      //await this.getRecentMstrLocalData();
      //await this.getSocketConnection(this.clickedDashboardInfo.wfName);

      //this.getSocketConnectionWithSPServer();
    } 
    catch(err){
      console.log("Error: " + err)
    }
  }

  async ngOnInit() {
    
    const dbListsInfoUrl = "https://portal.bergerbd.com/Style Library/myapproval/V1/assets/myApprovedWF.ts";
    //const dbListsInfoUrl = "http://localhost:4211/assets/myApprovedWF.ts";
    this.httpClient.get(dbListsInfoUrl).subscribe(data =>{
      this.dashboardsListsInfo = data;
      if(this.dashboardsListsInfo.length >0){
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

    const quickVoiceSearch = (txt:any) => {
      this.onGridReadyParamsApi.setQuickFilter(txt);

      let itm = [];
      let prKey = '';

      const reqDbInfo = this.dashboardsListsInfo[this.clickedDashboardInfo.listIndex];

      if(Object.prototype.hasOwnProperty.call(reqDbInfo.MasterListInfo, 'primaryKey')){
        prKey = reqDbInfo.MasterListInfo.primaryKey;
        if(prKey != 'Title'){
          itm = this.rowData.filter((item:any) => item[prKey] == this.dbTagUrlInfo.titleTag + txt);
        }
        else{
          itm = this.rowData.filter((item:any) => item.Title == this.dbTagUrlInfo.titleTag + txt);
        }
      }else{
        itm = this.rowData.filter((item:any) => item.Title == this.dbTagUrlInfo.titleTag + txt);
      }
        
        (document.getElementById('viewByVoiceText') as HTMLInputElement).value = '        ' + this.dbTagUrlInfo.titleTag + txt;
        
        if(reqDbInfo.ViewUrl.qryStrKeyTyp == 'GUID'){
          
          this.dbTagUrlInfo.qryStrKeyVal = itm[0].GUID;
          const url = this.siteAbsoluteUrl +  reqDbInfo.ViewUrl.siteUrl + this.dbTagUrlInfo.qryStrKeyVal + reqDbInfo.ViewUrl.mode;
          window.open(url, "_blank");
        }
        else if(reqDbInfo.ViewUrl.qryStrKeyTyp == 'ID'){
          this.dbTagUrlInfo.qryStrKeyVal = itm[0].ID;
          const url = this.siteAbsoluteUrl +  reqDbInfo.ViewUrl.siteUrl + this.dbTagUrlInfo.qryStrKeyVal + reqDbInfo.ViewUrl.mode;
          window.open(url, "_blank");
        }
        
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
                        
            this.txtOfQuickSearchInpFld = e.results[0][0].transcript;
            //(document.getElementById('filter-text-box') as HTMLInputElement).value = this.txtOfQuickSearchInpFld;
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

  onCellClicked(params:any) {    //params:CellClickedEvent
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
                const stockListsUrl = "https://portal.bergerbd.com/leaveauto/_api/web/lists/getByTitle('ITAccessoriesStock')/items?&$top=2000&$select=ID,GUID,RemainingBalance&$filter=AccessoryCode eq '" + accessoryCode + "'";
                
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

}

//let rowHeight; 
let groupHeight:any;



















