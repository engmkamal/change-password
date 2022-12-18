import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
//========to covert promise to observer======
import {
  from,
  forkJoin,
  combineLatest,
  Observable,
  Subscription
} from 'rxjs';



import { 
  //Tablegrid,
  Tablegrid2
 } from '@portal/dashboard';
import * as moment from 'moment';
//---------date formate ends ---
import { SharepointlistService } from '@portal/core';
import { HttpClient } from '@angular/common/http';

//import { MasterdetailsrendererComponent } from '../masterdetailsrenderer/masterdetailsrenderer.component';

import { ActivatedRoute } from '@angular/router'; // to read the url route

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
import { CellClickedEvent, ColDef } from 'ag-grid-community';
//import { View } from '@pnp/sp/views/types';
//import { AnyARecord } from 'dns';



declare let webkitSpeechRecognition: any; // for voice recognition



@Component({
  selector: 'portal-masterdetailsrenderer',
  templateUrl: './masterdetailsrenderer.component.html',
  styleUrls: ['./masterdetailsrenderer.component.scss'],
})
export class MasterdetailsrendererComponent implements OnInit, AfterViewInit {
  public rowDataCM: any;
  public rowDataWP: any;
  mpTG = new Tablegrid2();
  public workflows = [];
  rowData: any;
  public txtOfQuickSearchInpFld: any;
  public rowHeight: any;

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular
  public rowData$!: Observable<any[]>;

  public logedInUser = { 
    aDId: "",
    name: "",
    email: "",
    empID: "",
    office: "",
    access: "", 
  };

  public listInfo = {
    name: "",
    query: "",
    expand: "",
    select: "",
    filter: "",
    orderByPrm: "",
    orderByVal: false,
    top: 20,
  };


  public detListInfo = {
    name: "",
    query: "",
    expand: "",
    select: "",
    filter: "",
    top: 200000,
  };

  //=========for infinite scrolling and lazy loading start=========
  public rowBuffer: any;
  public rowSelection: any;
  //public rowModelType;
  public paginationPageSize: any;
  public cacheOverflowSize: any;
  public maxConcurrentDatasourceRequests: any;
  public infiniteInitialRowCount: any;
  public maxBlocksInCache: any;
  public components: any;

  private onGridReadyParamsApi: any;

  private dbTagUrlInfo ={ 
    titleTag: '',
    urlVoice : '',
    qryStrKeyVal: '',
    qryStrKeyTyp: 'GUID',
    mode1: '',
    mode2: ''
  }


  @ViewChild('filterTextBox') filterTextBox: any;

  public clickedDashboardInfo = { 
    wfName: '',
    acessPermission: '',
    listIndex: 0,
    serviceFnName: 'fetchListItemWithExpStFilOrd',
    config: {},
    mapedData: {d:[]},
    recMstLocDat: {d:[]}
  };

  socket: any;
  recentMstLocData: any;

  dashboardsListsInfo:any;

  colDefs: ColDef[] = [
    { field: 'make'},
    { field: 'model'},
    { field: 'price' }
  ];

  constructor(
    private sharepointlistService: SharepointlistService,
    private _actRoute: ActivatedRoute,
    private websocketService: WebsocketService,
    private httpClient: HttpClient
    ) { }


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



  async getGridReadyprocesses(){
    try{
      await this.getSelectedDashboardInfo(this.clickedDashboardInfo);
      await this.getRowData(this.clickedDashboardInfo);
      //await this.getTitleTag(this.rowData);
      // # map data of this dashboard SP list  #
      //await this.getMappedData();
      // # emit to loc Server to strore in loc file #
      //await this.updateLocalStorage();   
      this.websocketService.subscribe();   
    } 
    catch(err){
      console.log("Error: " + err)
    }
  }

  ngAfterViewInit(){
    console.log('ngAfterViewInit called before onGridReady() and after ngOnInit() ...............');    
  }

  onGridReady(params:any) {
    
    //alert('onGridReady called before ngOnInit() and after ngAfterViewInit()');
    this.mpTG.gridApi = params.api;
    this.mpTG.gridColumnApi = params.columnApi;

    //======= late loading with all row data start ====
    this.listInfo.top = 200000;

    this.getGridReadyprocesses();
    
    this.onGridReadyParamsApi = this.mpTG.gridApi; //for voice recognition    
    
  }

  createColDef(i:any) {

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
            cellClass: "titleWithMDFieldClass",
            cellStyle: function (params: any) {
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
    
        function setTitleWitouthMDField(el: any) {
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
            cellStyle: function (params: any) {
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
    
        function setDateField(el: any) {
          const dtFld = {
            headerName: el.headerName,
            sortable: true,
            enableRowGroup: true,
            filter: 'agDateColumnFilter',
            filterParams: {
              
              //applyButton: true,
              resetButton: true,
            },
            // valueFormatter: function(params) {
            //     return moment(params.value).format('DD MMM, YYYY');
            // },
            columnGroupShow: 'open',
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params: any) {
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
          }
    
          return dtFld;
        }
    
        function setTextField(el: any) {
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
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params: any) {
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
    
        function setNumberField(el: any) {
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
            cellStyle: function (params: any) {
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
    
        function setViewLinkGuidField(el: any) {
    
          const vwLnkFld = {
            headerName: el.headerName,
            field: el.field,
            cellRenderer: function (params: any) {
              return '<a href="https://portal.bergerbd.com/leaveauto/SitePages/' +i.wfName+ '.aspx?UniqueId=' + params.value + '&mode=read" target="_blank">view</a>';
              //return '<a href="https://portal.bergerbd.com/leaveauto/SitePages/' + this.dashboardsListsInfo[i.listIndex].WfName + '.aspx?UniqueId=' + params.value + '&mode=read" target="_blank">View</a>'
            },
            enableRowGroup: false,
            menuTabs: ['generalMenuTab', 'columnsMenuTab'],
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params: any) {
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
    
        function setViewLinkIdField(el: any) {
          const vwLnkFld = {
            headerName: el.headerName,
            field: el.field,
            cellRenderer: function (params: any) {
              const siteUrl = window.location.href + el.siteUrl;
              // let pageUrl = el.pageUrl;
              // let qString = el.qString;
              // let qVal = el.qVal;
              // let mode1 = el.mode1;
    
             return "";
    
            },
            enableRowGroup: false,
            menuTabs: ['generalMenuTab', 'columnsMenuTab'],
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params: any) {
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
    
        function setGetSetDateField(el: any) {
          const dtFld = {
            headerName: el.headerName,
            sortable: true,
            enableRowGroup: true,
            filter: 'agDateColumnFilter',
            filterParams: {
             
              resetButton: true,
            },
            columnGroupShow: 'open',
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params: any) {
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
          }
    
          return dtFld;
        }
    
        function setGetSetTextField(el: any) {
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
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params: any) {
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
    
        function setGetSetNumberField(el: any) {
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
            cellStyle: function (params: any) {
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
    
        function setCustomLinkField(el: any) {
          const vwLnkFld = {
            headerName: el.headerName,
            field: el.field,           
            enableRowGroup: false,
            menuTabs: ['generalMenuTab', 'columnsMenuTab'],
            cellClass: "ag-header-group-cell-label",           
            minWidth: el.minWidth,
          }
    
          return vwLnkFld;
        }
    
        function setGetSetPeopleField(el: any) {
          const txtFld = {
            headerName: el.headerName,   
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
    
        function setGetSetMulLinTextField(el: any){
          const txtFld = {
            headerName: el.headerName,
            //field: el.field,        
            valueGetter: function (params: any) {
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
            autoHeight: true   
          }
    
          return txtFld;
        }
    
    
    
        this.dashboardsListsInfo[i.listIndex].DbViewColDef.forEach((element: any) => {
          
          // const obj = {
          //   "TitleWithMDField": this.mpTG.columnDefs.push(setTitleWithMDField(element)),
          //   "TitleWitouthMDField": this.mpTG.columnDefs.push(setTitleWitouthMDField(element)),
          //   "DateField": this.mpTG.columnDefs.push(setDateField(element)),
          //   "TextField": this.mpTG.columnDefs.push(setTextField(element)),
          //   "NumberField": this.mpTG.columnDefs.push(setNumberField(element)),
          //   "GetSetDateField": this.mpTG.columnDefs.push(setGetSetDateField(element)),
          //   "GetSetTextField": this.mpTG.columnDefs.push(setGetSetTextField(element)),
          //   "GetSetNumberField": this.mpTG.columnDefs.push(setGetSetNumberField(element)),
          //   "CustomLinkField": this.mpTG.columnDefs.push(setCustomLinkField(element)),
          //   "GetSetPeopleField": this.mpTG.columnDefs.push(setGetSetPeopleField(element)),
          //   "GetSetMulLinTextField": this.mpTG.columnDefs.push(setGetSetMulLinTextField(element)),
          //   "ViewLinkGuidField": function(){
          //     this.dbTagUrlInfo.qryStrKeyTyp = 'GUID';
          //     this.dbTagUrlInfo.urlVoice = 'https://portal.bergerbd.com/leaveauto/SitePages/' + this.dashboardsListsInfo[i.listIndex].WfName + '.aspx?UniqueId=';
          //     return this.mpTG.columnDefs.push(setViewLinkGuidField(element));  
              
          //   },
          //   "ViewLinkIdField": function(){
          //     this.dbTagUrlInfo.qryStrKeyTyp = 'ID';
          //     //this.dbTagUrlInfo.urlVoice = window.location.href + element.pageUrl + '?' + element.qString + '=';
          //     this.dbTagUrlInfo.urlVoice = 'https://portal.bergerbd.com/' + element.siteUrl + element.pageUrl + '?' + element.qString + '=';
          //     this.dbTagUrlInfo.mode1 = element.mode1;
          //     this.dbTagUrlInfo.mode2 = element.mode2;
          //     return this.mpTG.columnDefs.push(setViewLinkIdField(element));
              
          //   }
          // };
    
          // return obj[element.fldType];
    
          if (element.fldType == "TitleWithMDField") {
            this.mpTG.columnDefs.push(setTitleWithMDField(element));
          }
          else if (element.fldType == "TitleWitouthMDField") {
            this.mpTG.columnDefs.push(setTitleWitouthMDField(element));
          }
          else if (element.fldType == "DateField") {
            this.mpTG.columnDefs.push(setDateField(element));
          }
          else if (element.fldType == "TextField") {
            this.mpTG.columnDefs.push(setTextField(element));
          }
          else if (element.fldType == "NumberField") {
            this.mpTG.columnDefs.push(setNumberField(element));
          }
          else if (element.fldType == "ViewLinkGuidField") {
            this.mpTG.columnDefs.push(setViewLinkGuidField(element));  
            this.dbTagUrlInfo.qryStrKeyTyp = 'GUID';
            this.dbTagUrlInfo.urlVoice = 'https://portal.bergerbd.com/leaveauto/SitePages/' + this.dashboardsListsInfo[i.listIndex].WfName + '.aspx?UniqueId=';
          }
          else if (element.fldType == "ViewLinkIdField") {
            this.mpTG.columnDefs.push(setViewLinkIdField(element));
            this.dbTagUrlInfo.qryStrKeyTyp = 'ID';
            //this.dbTagUrlInfo.urlVoice = window.location.href + element.pageUrl + '?' + element.qString + '=';
            this.dbTagUrlInfo.urlVoice = 'https://portal.bergerbd.com/' + element.siteUrl + element.pageUrl + '?' + element.qString + '=';
            this.dbTagUrlInfo.mode1 = element.mode1;
            this.dbTagUrlInfo.mode2 = element.mode2;
          }
          else if (element.fldType == "GetSetDateField") {
            this.mpTG.columnDefs.push(setGetSetDateField(element));
          }
          else if (element.fldType == "GetSetTextField") {
            this.mpTG.columnDefs.push(setGetSetTextField(element));
          }
          else if (element.fldType == "GetSetNumberField") {
            this.mpTG.columnDefs.push(setGetSetNumberField(element));
          }
          // else if (element.fldType == "GetSetNumberField") {
          //   this.mpTG.columnDefs.push(setGetSetNumberField(element));
          // }
          else if (element.fldType == "CustomLinkField") {
            this.mpTG.columnDefs.push(setCustomLinkField(element));
          }
          else if (element.fldType == "GetSetPeopleField") {
            this.mpTG.columnDefs.push(setGetSetPeopleField(element));
          }
          else if (element.fldType == "GetSetMulLinTextField") {
            this.mpTG.columnDefs.push(setGetSetMulLinTextField(element));
          }
    
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
          //this.rowData = this.clickedDashboardInfo.recMstLocDat.d;
          resolve(this.clickedDashboardInfo.recMstLocDat.d);
        }else{
          this.getRowData(this.clickedDashboardInfo).then(res=>{
            resolve(res);
          });
        } 
      }
      else if(this.clickedDashboardInfo.acessPermission == 'Protected'){      
        resolve("res"); 
      }
      else{
        this.rowData = [];
        resolve('Un authorized access !!');
      }
    })
  }

  getRowData(i:any) {

    //========= implementing with httpClient service start ================

    const listname = i.config.MasterListInfo.name;
    const selQry = i.config.MasterListInfo.select;

    const apiUrl = "https://portal.bergerbd.com/leaveauto/_api/web/lists/getByTitle('" + listname + "')/items?&$top=2000000&$select=" + selQry + "";
    
    return new Promise((resolve, reject)=>{      

      try {
        this.httpClient.get<any[]>(apiUrl).subscribe(
          (items:any) => {
            this.rowData = JSON.parse(JSON.stringify(items.value));
            //this.rowData = [];
            resolve(items);

            // if (Object.prototype.hasOwnProperty.call(this.dashboardsListsInfo[i.listIndex].MasterListInfo, 'jsonStringField') && this.dashboardsListsInfo[i.listIndex].MasterListInfo.jsonStringField != "") {
            //   const parsedItems = JSON.parse(items[0][this.dashboardsListsInfo[i.listIndex].MasterListInfo.jsonStringField]);
            //   this.rowData = parsedItems[this.dashboardsListsInfo[i.listIndex].MasterListInfo.parsedFldForDb];

            // } else {
            //   for(let i=0; i<items.value.length; i++){
                
            //     let penWith:any;

            //     if(Object.prototype.hasOwnProperty.call(items.value[i], 'PendingWith')){
            //       penWith = {
            //         ID: items.value[i].PendingWith.ID,
            //         Title: items.value[i].PendingWith.Title
            //       }
            //     }else{
            //       penWith = {
            //         ID: 0,
            //         Title: "" 
            //       }
            //     }
            //       this.rowData.push({                    
            //           ActualExpenditure: items.value[i].ActualExpenditure,
            //           Author: {
            //             ID: items.value[i].Author.ID, 
            //             Title: items.value[i].Author.Title,
            //             Office: items.value[i].Author.Office,
            //             JobTitle: items.value[i].Author.JobTitle
            //           },                  
            //           Created: items.value[i].Created,
            //           ID: items.value[i].ID,
            //           Id: items.value[i].Id,
            //           PendingWith: penWith,                  
            //           Status: items.value[i].Status,
            //           Title: items.value[i].Title,
            //           TotalEstimatedAmount: items.value[i].TotalEstimatedAmount,
            //           WorkshopPurposeOrObjective: items.value[i].WorkshopPurposeOrObjective,
            //           EmployeeID: items.value[i].EmployeeID,
            //           GUID: items.value[i].GUID,
            //       });
            //   }
            // resolve(items);
            // }
          }
        );
        
      } catch (e) {
        console.log(e);
      }
      
    })
    //-----------------with httpClient service ends -------------

    //==================================

    // return new Promise((resolve, reject)=>{
    //   const serviceString = this.sharepointlistService.fetchListItemWithExpStFilOrd(this.listInfo);

    //   try {
    //     from(
    //       serviceString
    //       //this.sharepointlistService.fetchListItemWithExpStFilOrd(this.listInfo, res)
    //     ).subscribe(
    //       (items) => {
    //         this.rowData = [];
    //         if (Object.prototype.hasOwnProperty.call(this.dashboardsListsInfo[i.listIndex].MasterListInfo, 'jsonStringField') && this.dashboardsListsInfo[i.listIndex].MasterListInfo.jsonStringField != "") {
    //           const parsedItems = JSON.parse(items[0][this.dashboardsListsInfo[i.listIndex].MasterListInfo.jsonStringField]);
    //           this.rowData = parsedItems[this.dashboardsListsInfo[i.listIndex].MasterListInfo.parsedFldForDb];

    //         } else {
    //         this.rowData = items;
    //         resolve(items);
    //         //this.clickedDashboardInfo.mapedData.d.push(items);
    //         }
    //       }
    //     )
    //   } catch (e) {
    //     console.log(e);
    //   }
      
    // })


    
  }

  // getRowDataAsPromise(i) {

  //   let serviceString = this.sharepointlistService.fetchListItemWithExpStFilOrd(this.listInfo);

  //   let promise = new Promise((resolve, reject) => {

  //     serviceString
  //       .then(
  //         (items) => {
  //           if (this.dashboardsListsInfo[i.listIndex].MasterListInfo.hasOwnProperty('jsonStringField') && this.dashboardsListsInfo[i.listIndex].MasterListInfo.jsonStringField != "") {
  //             let parsedItems = JSON.parse(items[0][this.dashboardsListsInfo[i.listIndex].MasterListInfo.jsonStringField]);
  //             let rcvUnMapData = parsedItems[this.dashboardsListsInfo[i.listIndex].MasterListInfo.parsedFldForDb];
  //             resolve(rcvUnMapData);

  //             this.getTitleTag(rcvUnMapData);
  //           } else {
  //             let rcvUnMapData = items;
              
  //             resolve(rcvUnMapData);
  //             this.getTitleTag(rcvUnMapData);
  //             //this.websocketService.emit('chat1', items[0]);
  //           }
            
  //         }
  //       )
  //       .catch(err=>{
  //         console.log("Error: "+ err.message);
  //       });

  //   })

  //   return promise;

  // }

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
        //editable: true,
      };

      this.mpTG.detailCellRenderer = 'myDetailCellRenderer';
      this.mpTG.frameworkComponents = {  };
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
      this.rowHeight = 24;
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
  checkAuthorization(){
    return new Promise((resolve, reject)=>{
      this._actRoute.paramMap.subscribe(url => {
        //const wfName = url.get('id');
        const wfName = "WorkshopProposal";
        if (wfName) { 
          this.clickedDashboardInfo.listIndex = 0;
          //const wfIndex = this.clickedDashboardInfo.listIndex;
          const wfIndex = 0;
          // # pushing clickedDashboardInfo from 'this.dashboardsListsInfo' file to in memory #
          this.clickedDashboardInfo.config = this.dashboardsListsInfo[wfIndex];
          // # check dashboard view access is Public or Protected #
          if(this.dashboardsListsInfo[this.clickedDashboardInfo.listIndex].AcessPermission == 'Public'){
            this.clickedDashboardInfo.acessPermission = 'Public';
            this.logedInUser.access = 'FullAccess';
          } 
          
          else{
            this.clickedDashboardInfo.acessPermission = 'Public';
            this.logedInUser.access = 'FullAccess';
          }

          resolve(this.clickedDashboardInfo);
        }
      })
    })
    
  }

  async executeOnInitProcesses(){    
    try{
      await this.checkAuthorization();
      await this.getSelectedDashboardInfo(this.clickedDashboardInfo);
      //await this.importLocalStorageData();
      await this.dashboardGridDef();
      await this.createColDef(this.clickedDashboardInfo);
      await this.getRecentMstrLocalData();
      //await this.getSocketConnection(this.clickedDashboardInfo.wfName);

      //this.getSocketConnectionWithSPServer();
    } 
    catch(err){
      console.log("Error: " + err)
    }
  }

  async ngOnInit() { 
    const dbListsInfoUrl = "https://bergerpaintsbd.sharepoint.com/sites/BergerTech/Style Library/bergertechportal/assets/pendingtaskslistsinfo.ts";
    //const dbListsInfoUrl = "https://portal.bergerbd.com/Style Library/pendingtasks/V2/assets/dashboardslistsinfo.ts";
    //const dbListsInfoUrl = "http://localhost:4211/assets/dashboardslistsinfo.ts";
    this.httpClient.get(dbListsInfoUrl).subscribe(data =>{
      this.dashboardsListsInfo = data;
      if(this.dashboardsListsInfo.length >0){
        this.executeOnInitProcesses();   
      }else{
        alert("Fetching List info failed !");
      }
    });
    
    //==================for online dummy data ================
    // this.rowData$ = this.httpClient
    //   .get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');

     
  }

  // getTitleTag(rowData){
  //   //=========split titleTag =========
  //   return new Promise((resolve, reject)=>{
  //     if(rowData != undefined){
  //       if(Object.prototype.hasOwnProperty.call(rowData[0], 'Title')){
  //         if(rowData[0].Title != null && rowData[0].Title != ''){
  //           this.dbTagUrlInfo.titleTag = rowData[0].Title.split('-')[0] + "-";
  //         }else if(rowData[5].Title != null && rowData[5].Title != ''){
  //           this.dbTagUrlInfo.titleTag = rowData[5].Title.split('-')[0] + "-";
  //         }else {
  //           this.dbTagUrlInfo.titleTag = rowData[10].Title.split('-')[0] + "-";
  //         }
  //       }
  //       else if(Object.prototype.hasOwnProperty.call(rowData[0], 'RequestId')){
  //         if(rowData[0].RequestId != null && rowData[0].RequestId != ''){
  //           this.dbTagUrlInfo.titleTag = rowData[0].RequestId.split('-')[0] + "-";
  //         }else if(rowData[5].Title != null && rowData[5].Title != ''){
  //           this.dbTagUrlInfo.titleTag = rowData[5].RequestId.split('-')[0] + "-";
  //         }else {
  //           this.dbTagUrlInfo.titleTag = rowData[10].RequestId.split('-')[0] + "-";
  //         }
  //       }
  //       else if(Object.prototype.hasOwnProperty.call(rowData[0], 'RequestID')){
  //         if(rowData[0].RequestID != null && rowData[0].RequestID != ''){
  //           this.dbTagUrlInfo.titleTag = rowData[0].RequestID.split('-')[0] + "-";
  //         }else if(rowData[5].Title != null && rowData[5].Title != ''){
  //           this.dbTagUrlInfo.titleTag = rowData[5].RequestID.split('-')[0] + "-";
  //         }else {
  //           this.dbTagUrlInfo.titleTag = rowData[10].RequestID.split('-')[0] + "-";
  //         }
  //       }
  //     }
  //     resolve(this.dbTagUrlInfo);
  //   })
    
  // }

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
    return 30;
    // if (params.node.group) {
    //   return groupHeight;
    // }
  }

  setGroupHeight(height:any) {
    groupHeight = height;
    rowHeight = height;
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
    
    // alert("Please say any word that you want to search with");

    

    // const quickVoiceSearch = (txt) => {
    //   this.onGridReadyParamsApi.setQuickFilter(txt);
    // }

    // if('webkitSpeechRecognition' in window){
    //     const vSearch = new webkitSpeechRecognition();
    //     vSearch.continuous = false;
    //     vSearch.interimresults = false;
    //     vSearch.lang = 'en-US';
    //     vSearch.start();
    //     //const voiceSearchForm = this.formSearch.nativeElement;
    //     //const voiceHandler = this.hiddenSearchHandler.nativeElement;
    //     //const srcTxtVoiceHandler = this.filterTextBox.nativeElement; // for filter
    //     //console.log(voiceSearchForm);
    //     vSearch.onresult = function(e){
    //       //console.log(voiceSearchForm);
    //       //voiceHandler.value = e.results[0][0].transcript;
    //         vSearch.stop();
    //         //console.log(voiceHandler);
    //         //alert(e.results[0][0].transcript);
            
    //         this.txtOfQuickSearchInpFld = e.results[0][0].transcript;
    //         (document.getElementById('filter-text-box') as HTMLInputElement).value = this.txtOfQuickSearchInpFld;
    //         quickVoiceSearch(this.txtOfQuickSearchInpFld);

            
    //         //voiceSearchForm.submit();
    //     }
  
    //     vSearch.onerror = function(e){
    //         console.log(e);
    //         vSearch.stop();
    //     }

        
        
    // } else {
    //   alert("webkitSpeechRecognition is not available.");
    //   //console.log(this.state.get(configKey, undefined as any));
    //   }
  }

  viewByVoice(){
    
    // alert("Please say only the number of your request/application within 2-seconds");

    

    // const quickVoiceSearch = (txt) => {
    //   this.onGridReadyParamsApi.setQuickFilter(txt);

    //   let itm = [];
    //   let prKey = '';

    //   if(Object.prototype.hasOwnProperty.call(this.dashboardsListsInfo[this.clickedDashboardInfo.listIndex].MasterListInfo, 'primaryKey')){
    //     prKey = this.dashboardsListsInfo[this.clickedDashboardInfo.listIndex].MasterListInfo.primaryKey;
    //     if(prKey != 'Title'){
    //       itm = this.rowData.filter(item => item[prKey] == this.dbTagUrlInfo.titleTag + txt);
    //     }
    //     else{
    //       itm = this.rowData.filter(item => item.Title == this.dbTagUrlInfo.titleTag + txt);
    //     }
    //   }else{
    //     itm = this.rowData.filter(item => item.Title == this.dbTagUrlInfo.titleTag + txt);
    //   }

                
      
    //     //alert(itm[0].GUID); //this.dbTagUrlInfo.urlVoice  this.dbTagUrlInfo.idOrGuid
    //     (document.getElementById('viewByVoiceText') as HTMLInputElement).value = '        ' + this.dbTagUrlInfo.titleTag + txt;
        
    //     if(this.dbTagUrlInfo.qryStrKeyTyp == 'GUID'){
    //       this.dbTagUrlInfo.qryStrKeyVal = itm[0].GUID;
    //       const url = this.dbTagUrlInfo.urlVoice + this.dbTagUrlInfo.qryStrKeyVal + '&mode=read';
    //       window.open(url, "_blank");
    //     }
    //     else if(this.dbTagUrlInfo.qryStrKeyTyp == 'ID'){
    //       this.dbTagUrlInfo.qryStrKeyVal = itm[0].ID;
    //       const url = this.dbTagUrlInfo.urlVoice + this.dbTagUrlInfo.qryStrKeyVal + '&' + this.dbTagUrlInfo.mode1 + this.dbTagUrlInfo.mode2;
    //       window.open(url, "_blank");
    //     }
        
    // }

    // if('webkitSpeechRecognition' in window){
    //     const vSearch = new webkitSpeechRecognition();
    //     vSearch.continuous = false;
    //     vSearch.interimresults = false;
    //     vSearch.lang = 'en-US';
    //     vSearch.start();
    //     //const voiceSearchForm = this.formSearch.nativeElement;
    //     //const voiceHandler = this.hiddenSearchHandler.nativeElement;
    //     //const srcTxtVoiceHandler = this.filterTextBox.nativeElement; // for filter
    //     //console.log(voiceSearchForm);
    //     vSearch.onresult = function(e){
    //       //console.log(voiceSearchForm);
    //       //voiceHandler.value = e.results[0][0].transcript;
    //         vSearch.stop();
                        
    //         this.txtOfQuickSearchInpFld = e.results[0][0].transcript;
    //         //(document.getElementById('filter-text-box') as HTMLInputElement).value = this.txtOfQuickSearchInpFld;
    //         quickVoiceSearch(this.txtOfQuickSearchInpFld);

            
    //         //voiceSearchForm.submit();
    //     }
  
    //     vSearch.onerror = function(e){
    //         console.log(e);
    //         vSearch.stop();
    //     }

        
        
    // } else {
    //   alert("webkitSpeechRecognition is not available.");
    //   //console.log(this.state.get(configKey, undefined as any));
    //   }
  }

  onCellClicked(event: CellClickedEvent){
    console.log(event);
  }

  

  clearSelection(){
    this.mpTG.gridApi.deselectAll();
    //this.agGrid.api.deselectAll();
  }

}

let rowHeight; 
let groupHeight;






