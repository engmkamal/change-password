import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { from, of } from 'rxjs'; 
import { groupBy, map, mergeMap, reduce, toArray } from 'rxjs/operators';
import { SplistcrudService, BreakpointObserverService } from '@portal/core';
//import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'

interface IWorkflow {
  ID:number;
  Category: string; 
  SubCategory: string; 
  PageURL: string; 
  ChildSubCategory: string;
}

interface IDragPosition {
  x: number; 
  y: number;
}

interface IDivStyle {   
  resize: string;
  overflow: string;
  width: string;
  height: string;
  background: string;  
}

interface IMatCard{   
    uId: string;
    readMode: string;
    Status: string;
    logedUserAdId: number;
    MatcardInfo: {            
      matCardTitle: string;
      matCardSubtitle: string;
      matCardContent: string;
      matCardImage: string;
      matCardActions: string;
      matCardFooter: string;
      divStyle: IDivStyle;
      dragPosition: IDragPosition;
    }
}


@Component({
  selector: 'portal-workflowhome',
  templateUrl: './workflowhome.component.html',
  styleUrls: ['./workflowhome.component.scss'],
})
export class WorkflowhomeComponent implements OnInit, OnDestroy, AfterViewInit {

  currentBreakpoint = '';

  deviceWidth = 310;

  contentDivWidth = 310;

  mobileQuery: MediaQueryList;
  //fillerNav = Array.from({length: 50}, (_, i) => `Nav Sidebar Item ${i + 1}`);  
  isCardExpanded = false; //== Mat Card == 
  private _mobileQueryListener: () => void;
  wfDepartments:any[] =[];
  allWorkflows:any[] =[];
  
  todo = [
    'Create Request',
    'Getting Started', 
    'Approval Flow', 
    'Dashboard'
  ];

  opened: boolean;

  private columnNo = 0;
  private rowNo = 0;

  dragPosition = {x: 0, y: 0};

  cardInfo: any = {};

  financeDept:any = {}; 

 
  cardInfo1: any = {};

  cardInfo4: any = {};

  cardInfo3: any = {};

  cardInfo5: any = {};

  cardInfo6: any = {};

  cardInfo7: any = {};

  cardInfo2: any = {};

  _matcardInfo = { 
    dragPosition: {x: 10, y: 10},
    divStyle: {
      resize: 'both',
      overflow: 'hidden',
      width: '200px',
      height: '100px',
      background: '#CC3B5D'
    },
    matCardTitle: 'Finance',
    matCardSubtitle: '11',
    matCardContent: '',
    matCardImage: '',
    matCardActions: '',
    matCardFooter: '',
  };

  _matcardInfo2 = { 
    dragPosition: {x: 380, y: 10},
    divStyle: {
      resize: 'both',
      overflow: 'hidden',
      width: '200px',
      height: '100px',
      background: '#D9AB29'
    },
    matCardTitle: 'Approval Flow',
    matCardSubtitle: '',
    matCardContent: '',
    matCardImage: '',
    matCardActions: '',
    matCardFooter: '',
  };

  _matcardInfo3 = { 
    dragPosition: {x: 750, y: 10},
    divStyle: {
      resize: 'both',
      overflow: 'hidden',
      width: '310px',
      height: '110px',
      background: 'purple'
    },
    matCardTitle: 'Dashboard',
    matCardSubtitle: '',
    matCardContent: '',
    matCardImage: '',
    matCardActions: '',
    matCardFooter: '',
  };
  
  groupedWorkflow$ = [];

  categorizedWorkflow:any[] = [];

  workflowSource: IWorkflow[] = [
    {      
      ID: 1, 
      Category: 'Finance', 
      SubCategory: 'CAPEX Budget Proposal', 
      PageURL: '', 
      ChildSubCategory: 'CAPEX Budget Proposal Dashboard'
    },
    {      
      ID: 2, 
      Category: 'Finance', 
      SubCategory: 'CAPEX Budget Proposal', 
      PageURL: '', 
      ChildSubCategory: 'CAPEX Budget Proposal Dashboard'
    },
    {      
      ID: 3, 
      Category: 'Finance', 
      SubCategory: 'Fixed Asset Acquisition', 
      PageURL: '', 
      ChildSubCategory: 'New Asset Acquisition'
    },
    {      
      ID: 4, 
      Category: 'Information Security', 
      SubCategory: 'IT Asset Management', 
      PageURL: '', 
      ChildSubCategory: '	IT Asset Information Entry'
    },
    {      
      ID: 5, 
      Category: 'Information Security', 
      SubCategory: 'IT Asset Management', 
      PageURL: '', 
      ChildSubCategory: 'Dashboard for IT Asset'
    },
    {      
      ID: 6, 
      Category: 'Marketing', 
      SubCategory: 'Trade Merchandising', 
      PageURL: '', 
      ChildSubCategory: 'Trade Merchandising Request'
    },
    {      
      ID: 7, 
      Category: 'Marketing', 
      SubCategory: 'Trade Merchandising', 
      PageURL: '', 
      ChildSubCategory: 'Trade Merchandising Dashboard'
    }
  ];

  workflows: IWorkflow[] = [];

  search = '';

  _logedUserAdId:any;

  listInfo = {
    name: "",
    select: "",
    expand: "",
    filterBy: "",
    filterWith: "",
    top: 1000
  };

  
  showDeptWiseWFDiv = false;
  showAllWFDiv = false;

  allWFsDivH = 600;

  //@ViewChild(DragndresizableComponent, {static : true}) child : DragndresizableComponent;

  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher, 
    private splistcrudService: SplistcrudService,
    private breakpointObserverService: BreakpointObserverService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);    

    this.opened = true; //for open side nav onInit
    
  }

  async ngOnInit() {
    

    const divStyle = {
      resize: 'both',
      overflow: 'auto',
      width: '310px',
      height: '350px',
    };

    //this._matcardInfo.divStyle = divStyle;

    this.deviceWidth = this.breakpointObserverService.screenWidth();

    if(this.opened){
      this.contentDivWidth =  this.deviceWidth - 270;
    }else {
      this.contentDivWidth = this.deviceWidth;
    }

    const _matcardInfo = { 
      dragPosition: {x: 10, y: 10},
      divStyle: {
        resize: 'both',
        overflow: 'hidden',
        width: '200px',
        height: '100px',
        background: '#CC3B5D'
      },
      matCardTitle: 'Create New Request',
      matCardSubtitle: '',
      matCardContent: '',
      matCardImage: '',
      matCardActions: '',
      matCardFooter: '',
    };

    this.workflows = this.workflowSource;
    

    this.splistcrudService.getSPLoggedInUser().then((res) => {
      this._logedUserAdId = res;      
      const wfQuery = `getbytitle('BusinessProcess')/items?&$top=200&$select=Category,SubCategory,ChildSubCategory,PageURL`;

        from(
          this.splistcrudService.getListItems(wfQuery)
          ).subscribe(
            (res) =>{ 
              this.workflowSource = res;
              this.onDeptWiseWorkflow(res);
                  
                  // let requestorsInfoData ={
                  //   EmployeeName: res[0].EmployeeName,
                  //   Company: res[0].Company,
                  //   EmployeeId: res[0].EmployeeId,
                  //   OfficeLocation: res[0].OfficeLocation,
                  //   Designation: res[0].Designation,
                  //   Department: res[0].Department,
                  //   Email: res[0].Email.EMail,
                  //   CostCenter: res[0].CostCenter,
                  //   Mobile: res[0].Mobile,
                  //   OpmEmail: res[0].OptManagerEmail,
                  //   OpmADId: res[0].OptManagerEmail.ID,
                  //   OpmName: res[0].OptManagerEmail.Title,
                  //   RequestDate: new Date().toString().substring(4, 15)
                  // };
                  
            },    
            (err) => {
                console.log(err)
            },
          ); 
        
     

    });

    this.splistcrudService.getSPLoggedInUser().then((res) => {
      this._logedUserAdId = res;
      
      // this.listInfo.name = "BergerEmployeeInformation";
      // this.listInfo.select = 'Company'+","+'EmployeeId'+","+'EmployeeName'+","+'OfficeLocation'+","+'Designation'+","+'Department'+","+'CostCenter'+","+'Email/ID'+","+'Email/EMail'+","+'OptManagerEmail/ID'+","+'OptManagerEmail/Title'+","+'OptManagerEmail'+","+'Mobile';
      // this.listInfo.expand = 'Email'+","+'OptManagerEmail';
      // this.listInfo.filterBy = 'Email/ID';
      // this.listInfo.top = 100000;
      const query = `getbytitle('BergerEmployeeInformation')/items?&$top=2000000&$select=EmployeeName,Email/ID,Email/Title,Email/EMail,OptManagerEmail/ID,OptManagerEmail/Title,DeptID,EmployeeId,EmployeeGrade,Department,Designation,OfficeLocation,Mobile,CostCenter&$expand=Email/ID,OptManagerEmail/ID&$filter=Email/ID eq '${this._logedUserAdId}'`;
      
        from(
          // this.splistcrudService.getItemsWithFilterExpand(this.listInfo, this._logedUserAdId)
          this.splistcrudService.getListItems(query)
          ).subscribe(
            (res) =>{ 
                  
                  // let requestorsInfoData ={
                  //   EmployeeName: res[0].EmployeeName,
                  //   Company: res[0].Company,
                  //   EmployeeId: res[0].EmployeeId,
                  //   OfficeLocation: res[0].OfficeLocation,
                  //   Designation: res[0].Designation,
                  //   Department: res[0].Department,
                  //   Email: res[0].Email.EMail,
                  //   CostCenter: res[0].CostCenter,
                  //   Mobile: res[0].Mobile,
                  //   OpmEmail: res[0].OptManagerEmail,
                  //   OpmADId: res[0].OptManagerEmail.ID,
                  //   OpmName: res[0].OptManagerEmail.Title,
                  //   RequestDate: new Date().toString().substring(4, 15)
                  // };
                  
            },    
            (err) => {
                console.log(err)
            },
          ); 
        
     

    });

    
    
    this.breakpointObserverService
    .breakpoint$.subscribe(() =>
      this.currentBreakpoint = this.breakpointObserverService.breakpointChanged()
    );
    
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngAfterViewInit() {    
    console.log("");
  }

  changePosition() {
    this.dragPosition = {x: this.dragPosition.x + 50, y: this.dragPosition.y + 50};
  }

  GetOutputVal(valFrmChild: any) {
    //this.emitedDataFrmChild = valFrmChild;

    this.opened = valFrmChild.compData.opened;
    this.isCardExpanded = valFrmChild.compData.isCardExpanded;

    // const _comData = {
    //   opened : false,
    //   isCardExpanded: !this.isCardExpanded
    // }
    // const data = {
    //   compData : _comData
    // }
    // this.outputToParent.emit(data);

    // if(this.opened){
    //   this.opened = false;
    // }
    // this.isCardExpanded = !this.isCardExpanded;
    // if (this.uId == "") {
    //   this.createReqInfoFrmChild = valFrmChild;
    // }
    // else {
    //   this.emitedDataFrmChild = valFrmChild;
    // }

  }

  // onSearchChange(search: string){
  //   // this.workflows = this.workflowSource
  //   // .filter((w:any)=>{
  //   //   w.ChildSubCategory.toLowerCase().includes(search.toLowerCase())
  //   // }).slice(0, 100);

  //   this.workflows = [];
  //   this.workflowSource.forEach(w => {
  //     if(w.ChildSubCategory.toLowerCase().includes(search.toLowerCase())){
  //       this.workflows.push(w);
  //     }      
  //   });
  // }

  onSearchChange(search: string){
    // this.allWorkflows = [];
    // this.workflowSource.forEach(w => {
    //   if(w.ChildSubCategory.toLowerCase().includes(search.toLowerCase())){
    //     this.allWorkflows.push(w);
    //   }      
    // });

    //const allWorkflowsArray = this.allWorkflows;
    const i = "";

    this.allWorkflows = [];

    this.workflowSource.forEach(w => {
      if(w.ChildSubCategory.toLowerCase().includes(search.toLowerCase())){
        this.createMatCardOnSearchWF(w, i);
        //this.allWorkflows.push(w);        
      }      
    });

  }

  onDeptWiseWorkflow(wfSource:any){

    // of(      
    //   { id: 1, name: 'JavaScript' },
    //   { id: 2, name: 'C#' },
    //   { id: 2, name: 'JavaScript' },
    //   { id: 1, name: 'TypeScript' },
    //   { id: 3, name: 'TypeScript' }
    // )
    //   .pipe(
    //     groupBy((p) => p.name),
    //     mergeMap((group$) =>
    //       group$.pipe(reduce((acc:any, cur) => [...acc, cur], []))
    //     )
    //   )
    //   .subscribe((p) => {
    //     console.log('key: ' + JSON.stringify(p.name));
    //     console.log('value: ' + JSON.stringify(p))
    //   });

    //====================================



    of(wfSource).pipe(
      mergeMap((res:any) => res),
      groupBy((item:any) => item.Category),
      mergeMap(obs => {
        const obsT = obs; 
          return obs.pipe(
              toArray(),
              map((items:any) => {
                  // items.subscribe((p:any) =>{
                  // })
                  // if(obs.key == 'Finance'){
                  //   this.createMatCard(obs);
                  // }

                  this.createMatCard(obs, items);
                  this.showDeptWiseWFDiv = true;
                  this.showAllWFDiv = false;
                  return { key:obs.key, value: items }
              })
          )
      }), toArray()
    ).subscribe((p:any) =>{
      this.categorizedWorkflow = [];
      this.categorizedWorkflow = p;
      console.log('result: ' + JSON.stringify(p));
 
    })
  
    
    
  }

  createMatCard(obs:any, items:any){

    let card: IMatCard;
    let xXis:number;
    let yXis:number;    

    const eRelement = Math.floor(this.contentDivWidth/250);
    this.columnNo = Math.floor(this.wfDepartments.length  % eRelement);
    this.rowNo = Math.floor(this.wfDepartments.length  / eRelement);

    xXis = 10 + (this.columnNo * 250);
    yXis = 10 + (this.rowNo * 150);   
    
    if(this.contentDivWidth - ( this.wfDepartments.length * 250) > 255){
      xXis = 10 + (this.columnNo * 250);
      yXis = 10 + (this.rowNo * 150);

      card = {
        uId: '',
        readMode: '',
        Status: '',
        logedUserAdId: 0,
        MatcardInfo: {            
          matCardTitle: obs.key,
          matCardSubtitle: items.length,
          matCardContent: '',
          matCardImage: '',
          matCardActions: '',
          matCardFooter: '',
          divStyle: {
            resize: 'both',
            overflow: 'hidden',
            width: '200px',
            height: '90px',
            background: '#D9AB29'
          },
          dragPosition: {
            x: xXis, 
            y: yXis,
          }
        }
      };

      
    }else{
      xXis = 10 + (this.columnNo * 250);
      yXis = 10 + (this.rowNo * 150);

      card = {
        uId: '',
        readMode: '',
        Status: '',
        logedUserAdId: 0,
        MatcardInfo: {            
          matCardTitle: obs.key,
          matCardSubtitle: items.length,
          matCardContent: '',
          matCardImage: '',
          matCardActions: '',
          matCardFooter: '',
          divStyle: {
            resize: 'both',
            overflow: 'hidden',
            width: '200px',
            height: '100px',
            background: '#D9AB29'
          },
          dragPosition: {
            x: xXis, 
            y: yXis,
          }
        }
      };
    }   

    this.wfDepartments.push(card);
   
  }

  moveCard(){
    let xXis:number;
    let yXis:number;
    const eRelement = Math.floor(this.contentDivWidth/250);    

    for (let j =0; j<this.wfDepartments.length ; j++){

      this.columnNo = Math.floor(j % eRelement);
      this.rowNo = Math.floor(j / eRelement);

      xXis = 10 + (this.columnNo * 250);
      yXis = 10 + (this.rowNo * 150);

      this.wfDepartments[j].MatcardInfo.dragPosition.x = xXis;
      this.wfDepartments[j].MatcardInfo.dragPosition.y = yXis;
    }

    //alert("Delayed for 1 second.");
  }

  showAllWF(){
    this.showDeptWiseWFDiv = false;
    this.allWorkflows = [];
    

    of(this.workflowSource).pipe(
      mergeMap((res:any) => res),
      groupBy((item:any) => item.SubCategory),
      mergeMap(obs => {
        const obsT = obs; 
          return obs.pipe(
              toArray(),
              map((items:any) => {
                  // items.subscribe((p:any) =>{
                  // })
                  // if(obs.key == 'Finance'){
                  //   this.createMatCard(obs);
                  // }

                  this.createMatCardForAllWF(obs, items);
                  this.showDeptWiseWFDiv = false;
                  this.showAllWFDiv = true;
                  return { key:obs.key, value: items }
              })
          )
      }), toArray()
    ).subscribe((p:any) =>{
      this.categorizedWorkflow = [];
      this.categorizedWorkflow = p;
      console.log('result: ' + JSON.stringify(p));
 
    })

    this.showAllWFDiv = true;
              
  }

  showDeptWF(){   

    this.showAllWFDiv = false;
    this.showDeptWiseWFDiv = true;   
  }

  createMatCardForAllWF(obs:any, items:any){

    let card: IMatCard;
    let xXis:number;
    let yXis:number;    

    const eRelement = Math.floor(this.contentDivWidth/250);
    this.columnNo = Math.floor(this.allWorkflows.length  % eRelement);
    this.rowNo = Math.floor(this.allWorkflows.length  / eRelement);

    xXis = 10 + (this.columnNo * 250);
    yXis = 10 + (this.rowNo * 150);   
    
    if(this.contentDivWidth - ( this.allWorkflows.length * 250) > 255){
      xXis = 10 + (this.columnNo * 250);
      yXis = 10 + (this.rowNo * 150);

      card = {
        uId: '',
        readMode: '',
        Status: '',
        logedUserAdId: 0,
        MatcardInfo: {            
          matCardTitle: obs.key,
          matCardSubtitle: '',
          matCardContent: '',
          matCardImage: '',
          matCardActions: '',
          matCardFooter: '',
          divStyle: {
            resize: 'both',
            overflow: 'hidden',
            width: '200px',
            height: '80px',
            background: '#D9AB29'
          },
          dragPosition: {
            x: xXis, 
            y: yXis,
          }
        }
      };

      
    }else{
      xXis = 10 + (this.columnNo * 250);
      yXis = 10 + (this.rowNo * 150);

      card = {
        uId: '',
        readMode: '',
        Status: '',
        logedUserAdId: 0,
        MatcardInfo: {            
          matCardTitle: obs.key,
          matCardSubtitle: '',
          matCardContent: '',
          matCardImage: '',
          matCardActions: '',
          matCardFooter: '',
          divStyle: {
            resize: 'both',
            overflow: 'hidden',
            width: '200px',
            height: '80px',
            background: '#D9AB29'
          },
          dragPosition: {
            x: xXis, 
            y: yXis,
          }
        }
      };
    } 
    
    this.allWorkflows.push(card);

    this.allWFsDivH = 180 * this.rowNo;
  }

  createMatCardOnSearchWF(obs:any, items:any){

    let card: IMatCard;
    let xXis:number;
    let yXis:number;    

    const eRelement = Math.floor(this.contentDivWidth/250);
    this.columnNo = Math.floor(this.allWorkflows.length  % eRelement);
    this.rowNo = Math.floor(this.allWorkflows.length  / eRelement);

    xXis = 10 + (this.columnNo * 250);
    yXis = 10 + (this.rowNo * 150);   
    
    if(this.contentDivWidth - ( this.allWorkflows.length * 250) > 255){
      xXis = 10 + (this.columnNo * 250);
      yXis = 10 + (this.rowNo * 150);

      card = {
        uId: '',
        readMode: '',
        Status: '',
        logedUserAdId: 0,
        MatcardInfo: {            
          matCardTitle: obs.ChildSubCategory,
          matCardSubtitle: '',
          matCardContent: '',
          matCardImage: '',
          matCardActions: '',
          matCardFooter: '',
          divStyle: {
            resize: 'both',
            overflow: 'hidden',
            width: '200px',
            height: '80px',
            background: '#D9AB29'
          },
          dragPosition: {
            x: xXis, 
            y: yXis,
          }
        }
      };

      
    }else{
      xXis = 10 + (this.columnNo * 250);
      yXis = 10 + (this.rowNo * 150);

      card = {
        uId: '',
        readMode: '',
        Status: '',
        logedUserAdId: 0,
        MatcardInfo: {            
          matCardTitle: obs.ChildSubCategory,
          matCardSubtitle: '',
          matCardContent: '',
          matCardImage: '',
          matCardActions: '',
          matCardFooter: '',
          divStyle: {
            resize: 'both',
            overflow: 'hidden',
            width: '200px',
            height: '80px',
            background: '#D9AB29'
          },
          dragPosition: {
            x: xXis, 
            y: yXis,
          }
        }
      };
    } 
    
    this.allWorkflows.push(card);

    this.allWFsDivH = 180 * this.rowNo;
  }

}
